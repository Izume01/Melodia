# Melodia

> **AI-Powered Music Generation Platform**  
> Create full songs, lyrics, and cover art from simple text descriptions.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![Python](https://img.shields.io/badge/Python-3.10-yellow)
![Modal](https://img.shields.io/badge/Modal-Serverless_GPU-green)

## Overview

**Melodia** is a cutting-edge full-stack application that leverages the power of generative AI to transform text prompts into complete musical compositions. Unlike simple melody generators, Melodia creates a cohesive package including:

-   **High-Fidelity Audio:** Generated using the ACE-Step model.
-   **Contextual Lyrics:** Written by Qwen2-7B-Instruct based on your theme.
-   **Album Art:** Visualized by Stable Diffusion Turbo.

Built with a modern tech stack, it features a responsive Next.js frontend and a scalable serverless Python backend running on Modal.

## Key Features

-   **Text-to-Song Generation:** Simply describe the vibe, genre, or topic (e.g., "A sad piano ballad about rain").
-   **Multi-Modal Output:** Automatically generates audio, lyrics, and cover art in one go.
-   **Customization:** Toggle instrumental mode or provide your own lyrics.
-   **User Dashboard:** Track your generation history, manage credits, and organize your library.
-   **Social Features:** Like and share songs with the community.
-   **Scalable Infrastructure:** Powered by Modal for on-demand GPU inference and Cloudflare R2 for asset storage.

## Architecture

The project is divided into two main components:

1.  **Frontend (`/frontend`)**: A Next.js 15 application handling the UI, authentication, and database interactions.
2.  **Backend (`/backend`)**: A Python-based AI engine running on Modal, responsible for the heavy lifting (inference).

### Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS v4, Shadcn UI |
| **Backend** | Python 3.10, Modal (Serverless GPU), FastAPI |
| **AI Models** | ACE-Step (Audio), Qwen2-7B (Lyrics/Prompt), SD-Turbo (Images) |
| **Database** | PostgreSQL, Prisma ORM |
| **Storage** | Cloudflare R2 (S3 Compatible) |
| **Auth** | Better Auth |
| **Queue** | Inngest (Event-driven background jobs) |

## Project Structure

```bash
root/
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/            # App Router pages & layouts
│   │   ├── components/     # React components (UI & Feature specific)
│   │   ├── actions/        # Server Actions (Generation logic)
│   │   ├── inngest/        # Background job definitions
│   │   └── lib/            # Utilities & configurations
│   ├── prisma/             # Database schema & migrations
│   └── public/             # Static assets
│
└── backend/                # Python AI Engine
    ├── main.py             # Modal app entry point & API
    ├── prompt.py           # Prompt engineering templates
    └── requirements.txt    # Python dependencies
```

## Getting Started

### Prerequisites

-   **Node.js** (v18+ recommended)
-   **pnpm** (Package manager)
-   **Python** (3.10+)
-   **Modal CLI** (`pip install modal`)
-   **PostgreSQL Database**
-   **Cloudflare R2 Bucket**

### 1. Clone the Repository

```bash
git clone https://github.com/Izume01/Melodia.git
cd Melodia
```

### 2. Backend Setup (Modal)

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
modal setup  # Authenticate with Modal
```

Set up your Modal secrets (R2 credentials & Hugging Face token) via the Modal dashboard or CLI:

-   `R2_ACCOUNT_ID`
-   `R2_ACCESS_KEY_ID`
-   `R2_SECRET_ACCESS_KEY`
-   `R2_BUCKET_NAME`
-   `HF_TOKEN`

Deploy or run the backend app:

```bash
modal serve main.py
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
pnpm install
```

Create a `.env` file in the `frontend` root based on the example below:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/melodia"

# Auth (Better Auth)
BETTER_AUTH_SECRET="your_generated_secret"
BETTER_AUTH_URL="http://localhost:3000"

# Inngest
NEXT_PUBLIC_INNGEST_EVENT_KEY="local"
NEXT_PUBLIC_INNGEST_SIGNING_KEY="local"

# AWS / R2 (For client-side presigning if needed)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="auto"
AWS_BUCKET_NAME=""
AWS_ENDPOINT=""
```

Initialize the database:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Roadmap

- [x] Core Music Generation (Audio + Lyrics + Image)
- [x] User Authentication & Profiles
- [x] Song Library & History
- [ ] Social Sharing & Community Feed
- [ ] Advanced Music Controls (Tempo, Key, Instruments)
- [ ] Playlist Creation
- [ ] Mobile App (React Native)

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built by <a href="https://github.com/Izume01">Izume01</a></p>
</div>
