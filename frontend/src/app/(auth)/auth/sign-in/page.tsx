"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "~/lib/auth-client"
import { toast } from "sonner"
import { Music, Mail, Lock, ArrowRight, Loader2, Sparkles, Play, Headphones } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn.email({
        email,
        password,
      })

      if (result.error) {
        toast.error(result.error.message || "Failed to sign in")
      } else {
        toast.success("Welcome back!")
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E8E8E8] flex">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#E8E8E8] shadow-[inset_12px_12px_24px_#c5c5c5,inset_-12px_-12px_24px_#ffffff] opacity-40 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#E8E8E8] shadow-[inset_12px_12px_24px_#c5c5c5,inset_-12px_-12px_24px_#ffffff] opacity-30 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-12 w-12 rounded-2xl bg-[#E8E8E8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] flex items-center justify-center">
              <Music className="h-7 w-7 text-[#4a5568]" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-[#1a202c]">Melodia</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-5xl font-bold mb-6 text-[#1a202c] leading-tight">
              Welcome back to your creative space
            </h2>
            <p className="text-xl text-[#4a5568] mb-12 leading-relaxed">
              Continue making music that moves you. Your next masterpiece is waiting.
            </p>

            {/* Feature highlights */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E8E8E8] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center shrink-0">
                  <Play className="h-6 w-6 text-[#4a5568]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a202c] mb-1">Instant Access</h3>
                  <p className="text-[#4a5568] text-sm">Jump right back into your projects</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#E8E8E8] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center shrink-0">
                  <Headphones className="h-6 w-6 text-[#4a5568]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a202c] mb-1">Your Library</h3>
                  <p className="text-[#4a5568] text-sm">All your tracks in one place</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <Link href="/landing" className="inline-flex items-center gap-2 text-sm text-[#4a5568] hover:text-[#1a202c] transition-colors font-medium">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to home
          </Link>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#E8E8E8] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] flex items-center justify-center">
                <Music className="h-7 w-7 text-[#4a5568]" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-[#1a202c]">Melodia</span>
            </div>
          </div>

          <div className="p-10 rounded-[3rem] bg-[#E8E8E8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff]">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8E8E8] shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#4a5568]" />
                <span className="text-xs font-medium text-[#4a5568]">Sign In</span>
              </div>
              <h1 className="text-4xl font-bold mb-3 text-[#1a202c] leading-tight">Welcome back</h1>
              <p className="text-[#4a5568] text-base">Sign in to continue creating</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-[#2d3748]">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Mail className="h-5 w-5 text-[#4a5568] group-focus-within:text-[#1a202c] transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#E8E8E8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] text-[#1a202c] placeholder:text-[#9ca3af] focus:outline-none focus:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] transition-all text-base"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[#2d3748]">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Lock className="h-5 w-5 text-[#4a5568] group-focus-within:text-[#1a202c] transition-colors" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#E8E8E8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] text-[#1a202c] placeholder:text-[#9ca3af] focus:outline-none focus:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] transition-all text-base"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4.5 rounded-xl text-base font-bold text-[#1a202c] bg-[#E8E8E8] shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#E8E8E8] shadow-[inset_1px_1px_2px_#c5c5c5]"></div>
              <span className="text-xs text-[#4a5568] font-medium">OR</span>
              <div className="flex-1 h-px bg-[#E8E8E8] shadow-[inset_1px_1px_2px_#c5c5c5]"></div>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#4a5568]">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="font-bold text-[#1a202c] hover:text-[#4a5568] transition-colors underline-offset-4 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
