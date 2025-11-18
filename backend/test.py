import os

import modal

app = modal.App()


@app.function(secrets=[modal.Secret.from_name("r2-secret")])
def f():
    print(os.environ["R2_ACCESS_KEY_ID"])
    print(os.environ["R2_SECRET_ACCESS_KEY"])
    