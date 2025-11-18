# ═══════════════════════════════════════════════════════════════
# MUSIC GENERATOR API WITH MODAL + CLOUDFLARE R2
# ═══════════════════════════════════════════════════════════════

import modal
from pydantic import BaseModel
# ───────────────────────────────────────────────────────────────
# STEP 1: Create Modal App
# ───────────────────────────────────────────────────────────────
app = modal.App("music-generator-app")

# ───────────────────────────────────────────────────────────────
# STEP 2: Define Docker Image (FIXED)
# ───────────────────────────────────────────────────────────────
image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install(
        "git",
        "libsndfile1",      # Required for soundfile
        "libsndfile1-dev"
    )
    .pip_install_from_requirements("requirements.txt")
    .run_commands([
        "git clone https://github.com/ace-step/ACE-Step.git /tmp/ACE-Step",
        "cd /tmp/ACE-Step && pip install -e ."
    ])
    .env({"HF_HOME": "/.cache/huggingface"})
    .add_local_python_source("prompt")  # Copies the 'prompt' folder
)

# ───────────────────────────────────────────────────────────────
# STEP 3: Create Volumes (persistent storage)
# ───────────────────────────────────────────────────────────────
modal_volume = modal.Volume.from_name(
    "ace-step-models", create_if_missing=True)
hf_volume = modal.Volume.from_name("qwen-hf-volume", create_if_missing=True)

# ───────────────────────────────────────────────────────────────
# STEP 4: Load Secrets (R2 credentials)
# ───────────────────────────────────────────────────────────────
r2_secret = modal.Secret.from_name("r2-secret")

# ───────────────────────────────────────────────────────────────
# STEP 5: Define Request Format
# ───────────────────────────────────────────────────────────────


class MusicRequest(BaseModel):
    description: str
    instrumental: bool = False

# ═══════════════════════════════════════════════════════════════
# STEP 6: Main Music Generator Class
# ═══════════════════════════════════════════════════════════════


@app.cls(
    image=image,
    secrets=[r2_secret],
    gpu="L40S",
    volumes={
        "/modals": modal_volume,
        "/.cache/huggingface": hf_volume
    },
    scaledown_window=15,
    timeout=600,
)
class MusicGenerator:

    @modal.enter()
    def load_models(self):
        """Load all AI models when container starts"""
        import os
        from acestep.pipeline_ace_step import ACEStepPipeline
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from diffusers import AutoPipelineForText2Image
        import torch

        self.os = os
        self.torch = torch

        print("🚀 Loading models...")

        # Music generation model
        self.music_model = ACEStepPipeline(
            checkpoint_dir="/modals",
            dtype="bfloat16",
            torch_compile=False,
            cpu_offload=False,
            overlapped_decode=False
        )

        # LLM for prompts and lyrics
        model_id = "Qwen/Qwen2-7B-Instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(
            model_id,
            cache_dir="/.cache/huggingface"
        )
        self.llm_model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype="auto",
            device_map="auto",
            cache_dir="/.cache/huggingface"
        )

        # Image generation model
        self.image_pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sd-turbo",
            torch_dtype=torch.float16,
            variant="fp16",
            cache_dir="/.cache/huggingface"
        ).to("cuda")

        print("✅ Models loaded successfully!")

    # ──────────────────────────────────────────────────────────
    # Helper Methods
    # ──────────────────────────────────────────────────────────

    def prompt_llm(self, question: str):
        """Ask the LLM a question and get response"""
        messages = [{"role": "user", "content": question}]

        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        inputs = self.tokenizer([text], return_tensors="pt").to(
            self.llm_model.device)

        output = self.llm_model.generate(
            inputs.input_ids,
            max_new_tokens=1024,
            temperature=0.7,
        )

        response = self.tokenizer.batch_decode(
            output[:, inputs.input_ids.shape[-1]:],
            skip_special_tokens=True
        )

        return response[0].strip()

    def generate_prompt(self, description: str):
        """Generate music prompt from description"""
        from prompt import PROMPT_GENERATOR_PROMPT

        return self.prompt_llm(
            PROMPT_GENERATOR_PROMPT.format(user_prompt=description)
        )

    def generate_lyrics(self, description: str):
        """Generate song lyrics from description"""
        from prompt import LYRICS_GENERATOR_PROMPT

        return self.prompt_llm(
            LYRICS_GENERATOR_PROMPT.format(description=description)
        )

    def generate_categories(self, description: str):
        """Generate music genre tags"""
        question = f"List 3-5 Musical Genre (comma separated) for the following description: {description}"

        resp = self.prompt_llm(question)
        return [x.strip() for x in resp.split(",") if x.strip()]

    def upload_to_r2(self, file_path: str, bucket_name: str):
        """Upload file to Cloudflare R2 storage"""
        import boto3
        import uuid

        # Get R2 credentials from environment
        account_id = self.os.environ["R2_ACCOUNT_ID"]
        access_key = self.os.environ["R2_ACCESS_KEY_ID"]
        secret_key = self.os.environ["R2_SECRET_ACCESS_KEY"]

        # R2 endpoint URL
        endpoint_url = f"https://{account_id}.r2.cloudflarestorage.com"

        # Create S3-compatible client for R2
        s3 = boto3.client(
            "s3",
            endpoint_url=endpoint_url,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name="auto"
        )

        # Generate unique key
        key = f"{uuid.uuid4()}_{self.os.path.basename(file_path)}"

        # Upload file
        s3.upload_file(file_path, bucket_name, key)
        print(f"☁️ Uploaded {file_path} → r2://{bucket_name}/{key}")

        return key

    # ──────────────────────────────────────────────────────────
    # Main Generation Method
    # ──────────────────────────────────────────────────────────

    @modal.method()
    def generate(self, description: str, instrumental: bool = False):
        """Generate complete music package from description"""
        import uuid

        self.os.makedirs("/tmp/output", exist_ok=True)
        bucket_name = self.os.environ["R2_BUCKET_NAME"]

        print(f"🎵 Generating music for: {description}")

        # Step 1: Generate prompt and lyrics
        music_prompt = self.generate_prompt(description)
        lyrics = "[Instrumental]" if instrumental else self.generate_lyrics(
            description)

        print(f"🎶 Prompt: {music_prompt}")
        print(f"📝 Lyrics preview: {lyrics[:150]}...")

        # Step 2: Generate categories
        categories = self.generate_categories(description)
        print(f"🎼 Categories: {categories}")

        # Step 3: Generate music
        music_output_path = f"/tmp/output/{uuid.uuid4()}_output.wav"
        self.music_model(
            prompt=music_prompt,
            lyrics=lyrics,
            audio_duration=120,  # 2 minutes
            save_path=music_output_path,
            infer_step=126,
            guidance_scale=8.6,
        )
        print(f"✅ Music generated: {music_output_path}")

        # Step 4: Generate cover art
        image_output_path = f"/tmp/output/{uuid.uuid4()}_cover.png"
        img = self.image_pipe(
            prompt=f"{music_prompt}, album cover art, high detail, vibrant colors, digital art",
            num_inference_steps=1,
            guidance_scale=0.0,
        ).images[0]
        img.save(image_output_path)
        print(f"✅ Cover art generated: {image_output_path}")

        # Step 5: Upload to R2
        music_file_key = self.upload_to_r2(music_output_path, bucket_name)
        image_file_key = self.upload_to_r2(image_output_path, bucket_name)

        return {
            "s3_audio": music_file_key,
            "s3_image": image_file_key,
            "lyrics": lyrics,
            "categories": categories,
            "prompt": music_prompt
        }

# ═══════════════════════════════════════════════════════════════
# STEP 7: HTTP Endpoint
# ═══════════════════════════════════════════════════════════════


@app.function(
    image=image,
    secrets=[r2_secret],
)
@modal.fastapi_endpoint(method="POST")
def generate_music_api(req: MusicRequest):
    """
    HTTP POST endpoint for music generation

    Usage:
        curl -X POST https://your-url.modal.run \
             -H "Content-Type: application/json" \
             -d '{"description": "happy pop song", "instrumental": false}'
    """
    generator = MusicGenerator()
    result = generator.generate.remote(
        description=req.description,
        instrumental=req.instrumental
    )
    return result

# ═══════════════════════════════════════════════════════════════
# STEP 8: Local Testing
# ═══════════════════════════════════════════════════════════════


@app.local_entrypoint()
def main(description: str = "cyberpunk song pop", instrumental: bool = False):
    """
    Test the music generator from terminal

    Run with:
        modal run main.py
        modal run main.py --description "sad piano ballad"
        modal run main.py --description "rock anthem" --instrumental true
    """
    print(f"🎸 Testing music generation...")
    print(f"   Description: {description}")
    print(f"   Instrumental: {instrumental}")

    generator = MusicGenerator()
    result = generator.generate.remote(description, instrumental)

    print("\n🎉 Generation complete!")
    print(f"   Audio: r2://{result['s3_audio']}")
    print(f"   Image: r2://{result['s3_image']}")
    print(f"   Genres: {', '.join(result['categories'])}")