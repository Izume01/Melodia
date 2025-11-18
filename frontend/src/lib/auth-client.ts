import {createAuthClient} from "better-auth/react";

export const auth = createAuthClient({
    
})

export const {signIn , signOut , signUp , useSession , }  =  auth
export const authClient = auth;