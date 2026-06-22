import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const glowRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
        glowRef.current.style.opacity = '1'
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/auth/login', { email, password })
      login(res.data.token, res.data.role, res.data.full_name)
      if (res.data.role === 'admin') navigate('/admin')
      else if (res.data.role === 'trainer') navigate('/trainer')
      else navigate('/member')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="font-body-md text-body-md antialiased min-h-screen relative overflow-hidden bg-[#0c0e14]">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="w-full h-full bg-cover bg-center scale-105 opacity-60" 
          style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDFss5ORzwyZW00-LQS-sXt1Hl3X_HHD494KkVV1cNt2iEVk7FC8HBwsiN_87eIrhCnMRvpTS5duv7NkDqzQSaVegpn__wUI2UpnUJQMX58qeacdDGmcVJR42BcEmMWkYNyz5vUpV6ZZzuzFaX1nFWVQRxo_X9MoV1m6ohBYeyNGlsmaCA1WofXKtUCWu_79w_3CYH5hUFBCpqqyD_JqvMJoyicm5E5HKir0RqVtHhJn4RZUw1d8vCBEo9Ih7q6O78tPwtyvntSWix")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Main Content Grid */}
      <main className="relative z-10 min-h-screen flex items-stretch">
        {/* Left Side: Editorial Watermark & Stats */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
          {/* Branding Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
            </div>
            <span className="font-display-lg text-display-lg tracking-tighter text-white uppercase">
              GYM <span className="text-primary-container">CMS</span>
            </span>
          </div>

          {/* Massive Watermark */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-30">
            <h1 className="text-[200px] font-display-hero text-outline leading-none vertical-text tracking-widest uppercase">
              GYM CMS
            </h1>
          </div>

          {/* Stats Footer */}
          <div className="flex gap-12 items-center z-10">
            <div className="flex flex-col">
              <span className="font-display-lg text-4xl text-white">4.9</span>
              <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 uppercase">Global Rating</span>
            </div>
            <div className="w-px h-8 bg-surface-border"></div>
            <div className="flex flex-col">
              <span className="font-display-lg text-4xl text-white">12K+</span>
              <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 uppercase">Active Elite</span>
            </div>
            <div className="w-px h-8 bg-surface-border"></div>
            <div className="flex flex-col">
              <span className="font-display-lg text-4xl text-white">0%</span>
              <span className="font-label-caps text-[10px] tracking-widest text-on-surface-variant/60 uppercase">Excuses Allowed</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Panel */}
        <div className="w-full lg:w-[500px] xl:w-[600px] flex items-center justify-center p-6 md:p-12 z-10">
          <div className="w-full max-w-md glass-morphism rounded-2xl p-8 md:p-10 relative overflow-hidden" style={{ background: 'rgba(18, 19, 26, 0.85)' }}>
            {/* Top Accents */}
            <div className="absolute top-0 right-0 w-32 h-1 bg-primary-container"></div>
            
            <header className="mb-10 text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center gap-4 mb-8">
                <div className="w-14 h-14 bg-primary-container rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
                </div>
                <span className="font-display-lg text-display-lg-mobile tracking-tighter text-white">GYM <span className="text-primary-container">CMS</span></span>
              </div>
              <h2 className="font-heading-2 text-4xl text-white tracking-tight">WELCOME BACK, COMMANDER</h2>
              <p className="text-on-surface-variant/70 mt-2 font-body-md">Authorization required to access the tactical dashboard.</p>
            </header>

            {error && (
              <div className="bg-error-container/10 border border-error-container/20 text-error px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <label className="font-label-caps text-xs tracking-widest text-on-surface-variant/70 block" htmlFor="email">
                  IDENTIFICATION (EMAIL)
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-container transition-colors">person</span>
                  <input 
                    className="w-full bg-surface-container-lowest/50 border border-surface-border rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-on-surface-variant/20 text-sm" 
                    id="email" 
                    placeholder="commander@ironpulse.io" 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-xs tracking-widest text-on-surface-variant/70" htmlFor="password">
                    SECURE KEY (PASSWORD)
                  </label>
                  <a className="text-[10px] font-bold text-primary-container hover:text-white transition-colors" href="#forgot">FORGOT ACCESS KEY?</a>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-container transition-colors">key</span>
                  <input 
                    className="w-full bg-surface-container-lowest/50 border border-surface-border rounded-lg py-4 pl-12 pr-12 text-white focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container transition-all placeholder:text-on-surface-variant/20 text-sm" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-white transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Remember & CTA */}
              <div className="flex items-center gap-2 pb-2">
                <input 
                  className="w-4 h-4 rounded border-surface-border bg-black text-primary-container focus:ring-primary-container/30" 
                  id="remember" 
                  type="checkbox"
                />
                <label className="font-label-caps text-[10px] cursor-pointer select-none text-on-surface-variant/70" htmlFor="remember">
                  TRUST THIS STATION FOR 30 DAYS
                </label>
              </div>

              <button 
                className="w-full bg-primary-container text-white font-action-text text-xl py-4 rounded-lg orange-glow-border hover:bg-primary-container/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:pointer-events-none" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'INITIALIZING ACCESS...' : 'INITIALIZE SYSTEM ACCESS'}
                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
              </button>
            </form>

            {/* Registration Footer */}
            <footer className="mt-10 pt-6 border-t border-surface-border text-center">
              <p className="text-[13px] text-on-surface-variant/50">
                NEW RECRUIT? 
                <Link className="text-primary-container font-bold hover:underline underline-offset-4 ml-1 uppercase" to="/register">
                  JOIN THE ELITE FORCE
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </main>

      {/* Interactive Glow Layer */}
      <div 
        ref={glowRef}
        className="fixed w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-[150px] pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-700" 
        id="cursor-glow"
      />
    </div>
  )
}