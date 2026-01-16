import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Music, 
  Play, 
  ArrowRight,
  Headphones,
  Mic,
  Disc,
  Radio,
  Volume2,
  Waveform
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#E8E8E8] text-foreground flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#E8E8E8] shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] flex items-center justify-center">
              <Music className="h-6 w-6 text-[#4a5568]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#2d3748]">Melodia</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4a5568]">
            <Link href="#features" className="hover:text-[#2d3748] transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-[#2d3748] transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-[#2d3748] transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/sign-in">
              <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#4a5568] bg-[#E8E8E8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] transition-all">
                Log in
              </button>
            </Link>
            <Link href="/auth/sign-up">
              <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#2d3748] bg-[#E8E8E8] shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 lg:py-40 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <div className="inline-block mb-8">
              <div className="px-6 py-2.5 rounded-full bg-[#E8E8E8] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] text-[#4a5568] text-sm font-medium">
                ✨ Create Your Sound
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-[#1a202c] leading-tight">
              Make Music That <br className="hidden md:block" />
              <span className="relative inline-block">
                Moves You
                <svg className="absolute w-full h-4 -bottom-2 left-0 opacity-20" viewBox="0 0 200 20" preserveAspectRatio="none">
                  <path d="M0 10 Q 50 5 100 10 T 200 10" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#4a5568] mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Turn your ideas into beautiful tracks. No studio needed, no experience required. Just you and your creativity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link href="/auth/sign-up">
                <button className="px-10 py-4 rounded-2xl text-lg font-semibold text-[#1a202c] bg-[#E8E8E8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] hover:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all flex items-center gap-2">
                  Start Creating
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="#demo">
                <button className="px-10 py-4 rounded-2xl text-lg font-medium text-[#4a5568] bg-[#E8E8E8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] transition-all flex items-center gap-2">
                  <Play className="h-5 w-5 fill-current" />
                  Listen to Examples
                </button>
              </Link>
            </div>
            
            {/* Stats with Neumorphic Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: "10k+", label: "Tracks Created" },
                { value: "5k+", label: "Creators" },
                { value: "24/7", label: "Available" },
                { value: "4.9", label: "Rating" }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#E8E8E8] shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] transition-all">
                  <div className="text-3xl font-bold text-[#1a202c] mb-1">{stat.value}</div>
                  <div className="text-sm text-[#4a5568] font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-[#E8E8E8]">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1a202c]">Everything You Need</h2>
              <p className="text-[#4a5568] text-lg font-light leading-relaxed">
                Simple tools for making music. No complexity, just pure creative flow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Describe Your Sound",
                  description: "Tell us what you're feeling. 'Sunny afternoon vibes' or 'late night energy' - we'll bring it to life.",
                  icon: Mic
                },
                {
                  title: "Studio Quality",
                  description: "Professional-grade tracks ready for your projects. Download in any format you need, instantly.",
                  icon: Headphones
                },
                {
                  title: "Instant Creation",
                  description: "Your music is ready in moments. No waiting, no rendering - just pure creative momentum.",
                  icon: Radio
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-[#E8E8E8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] hover:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] transition-all group">
                  <div className="h-16 w-16 rounded-2xl bg-[#E8E8E8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center mb-6 group-hover:shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] transition-all">
                    <feature.icon className="h-8 w-8 text-[#4a5568]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[#1a202c]">{feature.title}</h3>
                  <p className="text-[#4a5568] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-[#E8E8E8]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
              <div className="lg:w-1/2">
                <div className="inline-block mb-6">
                  <div className="px-4 py-1.5 rounded-full bg-[#E8E8E8] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] text-[#4a5568] text-xs font-medium">
                    Simple Process
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-10 text-[#1a202c] leading-tight">
                  Three Steps to <br/>
                  <span className="text-[#4a5568]">Your Sound</span>
                </h2>
                
                <div className="space-y-8">
                  {[
                    { num: "1", title: "Share Your Vision", desc: "Describe the mood, energy, or feeling you want. Be as specific or as free-form as you like." },
                    { num: "2", title: "We Create Together", desc: "Your idea becomes a full track. Every element crafted to match your vision perfectly." },
                    { num: "3", title: "Make It Yours", desc: "Listen, tweak if needed, and download. It's yours to use however you want." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="h-12 w-12 rounded-xl bg-[#E8E8E8] shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] flex items-center justify-center shrink-0 group-hover:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] transition-all">
                        <span className="text-xl font-bold text-[#1a202c]">{step.num}</span>
                      </div>
                      <div className="pt-1">
                        <h3 className="text-xl font-bold mb-2 text-[#1a202c]">{step.title}</h3>
                        <p className="text-[#4a5568] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2 w-full">
                <div className="p-8 rounded-[3rem] bg-[#E8E8E8] shadow-[12px_12px_24px_#c5c5c5,-12px_-12px_24px_#ffffff] relative overflow-hidden">
                  {/* Mock Music Player Interface */}
                  <div className="space-y-6">
                    {/* Waveform Visualization */}
                    <div className="h-32 rounded-2xl bg-[#E8E8E8] shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] p-6 flex items-end justify-center gap-1">
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-2 rounded-full bg-[#4a5568] opacity-60"
                          style={{ height: `${Math.random() * 60 + 20}%` }}
                        />
                      ))}
                    </div>

                    {/* Track Info */}
                    <div className="space-y-3">
                      <div className="h-6 rounded-xl bg-[#E8E8E8] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] w-3/4"></div>
                      <div className="h-4 rounded-lg bg-[#E8E8E8] shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] w-1/2"></div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <button className="h-12 w-12 rounded-xl bg-[#E8E8E8] shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] flex items-center justify-center hover:shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] transition-all">
                        <Play className="h-5 w-5 text-[#4a5568] ml-0.5" />
                      </button>
                      <div className="flex-1 h-2 rounded-full bg-[#E8E8E8] shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] overflow-hidden">
                        <div className="h-full w-1/3 bg-[#4a5568] rounded-full"></div>
                      </div>
                      <button className="h-10 w-10 rounded-xl bg-[#E8E8E8] shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center">
                        <Volume2 className="h-4 w-4 text-[#4a5568]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-[#E8E8E8]">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-[#E8E8E8] shadow-[12px_12px_24px_#c5c5c5,-12px_-12px_24px_#ffffff]">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[#1a202c]">
                Ready to Create?
              </h2>
              <p className="text-[#4a5568] text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Join thousands of musicians, creators, and dreamers making their sound.
              </p>
              <Link href="/auth/sign-up">
                <button className="px-12 py-5 rounded-2xl text-lg font-bold text-[#1a202c] bg-[#E8E8E8] shadow-[8px_8px_16px_#c5c5c5,-8px_-8px_16px_#ffffff] hover:shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#c5c5c5,inset_-4px_-4px_8px_#ffffff] transition-all inline-flex items-center gap-2">
                  Start Making Music
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <p className="mt-6 text-sm text-[#4a5568] font-medium">Free to start • No credit card needed</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#E8E8E8] border-t border-[#d1d5db] py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-xl bg-[#E8E8E8] shadow-[4px_4px_8px_#c5c5c5,-4px_-4px_8px_#ffffff] flex items-center justify-center">
                  <Music className="h-5 w-5 text-[#4a5568]" />
                </div>
                <span className="text-xl font-bold text-[#1a202c]">Melodia</span>
              </div>
              <p className="text-[#4a5568] leading-relaxed text-sm">
                Making music creation accessible to everyone. Simple, powerful, yours.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-[#1a202c]">Product</h4>
              <ul className="space-y-4 text-sm text-[#4a5568]">
                <li><Link href="#" className="hover:text-[#1a202c] transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-[#1a202c] transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-[#1a202c] transition-colors">Showcase</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-[#1a202c]">Company</h4>
              <ul className="space-y-4 text-sm text-[#4a5568]">
                <li><Link href="#" className="hover:text-[#1a202c] transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-[#1a202c] transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-[#1a202c] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-[#1a202c]">Legal</h4>
              <ul className="space-y-4 text-sm text-[#4a5568]">
                <li><Link href="#" className="hover:text-[#1a202c] transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-[#1a202c] transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#d1d5db] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#4a5568]">
            <p>&copy; {new Date().getFullYear()} Melodia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
