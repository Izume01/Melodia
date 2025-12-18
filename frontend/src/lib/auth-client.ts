import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

// Note: Depending on the exact versions of `better-auth` and
// `@polar-sh/better-auth`, the plugin types can be slightly mismatched.
// The runtime contracts are compatible; the cast silences a TS-only mismatch.
export const auth = createAuthClient({
    plugins: [polarClient() ],
})

export const { signIn, signOut, signUp, useSession } = auth
export const authClient = auth;