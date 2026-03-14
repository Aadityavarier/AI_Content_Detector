import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import UploadBox from '@/components/UploadBox'
import HowItWorks from '@/components/HowItWorks'
import StatsSection from '@/components/StatsSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative">
      {/* Scan line effect */}
      <div className="scan-line" />
Q
      <Navbar />
      <HeroSection />
      <UploadBox />
      <HowItWorks />
      <StatsSection />

      {/* About section */}
       <section id="detect" style={{ padding: '96px 24px' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-mono text-xs tracking-widest text-neon-green/60 uppercase mb-3">
            // ABOUT
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-white mb-6">
            Why We Built This
          </h2>
          <p className="text-white/50 font-body text-lg leading-relaxed mb-6">
            As AI-generated content floods the internet, the ability to verify authenticity becomes critical.
            Veridian is a free, open-source tool that brings state-of-the-art ML detection to everyone —
            no paid subscription, no proprietary black box.
          </p>
          <p className="text-white/35 font-body leading-relaxed mb-10">
            Built as a student project using entirely free and open-source tools:
            HuggingFace Transformers, PyTorch, Next.js, FastAPI, and Supabase.
            The full codebase is available on GitHub under the MIT license.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/detect"
              className="bg-neon-green text-void-900 font-mono font-bold text-sm tracking-wider px-8 py-4 rounded glow-green hover:bg-neon-cyan transition-all"
            >
              TRY IT NOW →
            </a>
            <a
              href="https://github.com/your-repo/ai-detector"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/15 text-white/60 font-mono text-sm tracking-wider px-8 py-4 rounded hover:border-neon-green/30 hover:text-neon-green/70 transition-all"
            >
              ⭐ STAR ON GITHUB
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
