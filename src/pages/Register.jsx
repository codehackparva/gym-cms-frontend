import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import supabase from '../api/supabase'

export default function Register() {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  
  const containerRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const xAxis = (window.innerWidth / 2 - e.pageX) / 60
      const yAxis = (window.innerHeight / 2 - e.pageY) / 60
      containerRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await API.post('/auth/register', {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: 'member'
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex items-center justify-center p-4 md:p-8 overflow-x-hidden relative" style={{ perspective: '1000px' }}>
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center grayscale contrast-125 opacity-40 scale-105" 
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrDSXWpMd1hPvUIrxSI2Bm9VsJjbV8350suBnssUGCOV8yb5wenFBSp2zbFLFgM-c36TFsaKXYI3aKpcGUqLp6jZaSieRaZiiNL4OcQBGknLRLjDYN12MglSaovBTv9LZWCg6u4OFC8KHl2eVJFz3iXLkrzJGGEXZigdL9UYv723PWVYkDtcKBwevfQ4Aq8Kjr-z3MSh0HEFjHB8rsGp9YKN_YprA3OFQEy614Y3M9x0DEEU7ypq7_8GFZ6PQ8SIE4AWPVa0837Zs3')` }}
        />
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Registration Container */}
      <main 
        ref={containerRef}
        className="relative z-20 w-full max-w-[520px] transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tighter leading-none mb-2">IRON PULSE</h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-[0.3em] text-[10px]">Elite Performance CMS</p>
        </div>

        {/* Registration Card */}
        <div className="glass-card rounded-2xl p-8 md:p-10 glow-accent">
          <div className="mb-8">
            <h2 className="font-heading-2 text-heading-2 text-on-surface mb-2">CREATE YOUR ACCOUNT</h2>
            <p className="text-on-surface-variant text-sm">Join the network of elite performance managers and athletes.</p>
          </div>

          {error && (
            <div className="bg-error-container/10 border border-error-container/20 text-error px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* OAuth Option */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 py-3.5 px-4 rounded-xl font-bold transition-transform active:scale-95 hover:bg-zinc-100 mb-8 cursor-pointer"
          >
            <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="text-zinc-900 font-semibold tracking-wide text-sm">CONTINUE WITH GOOGLE</span>
          </button>

          {/* Separator */}
          <div className="relative flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-surface-border"></div>
            <span className="text-label-caps text-on-surface-variant text-[9px] uppercase tracking-widest font-bold">OR REGISTER WITH EMAIL</span>
            <div className="h-[1px] flex-1 bg-surface-border"></div>
          </div>

          {/* Signup Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    className="w-full bg-surface-container-low border border-surface-border rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-surface-variant focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm" 
                    placeholder="John Doe" 
                    type="text"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({...form, full_name: e.target.value})}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    className="w-full bg-surface-container-low border border-surface-border rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-surface-variant focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm" 
                    placeholder="manager@ironpulse.com" 
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider ml-1">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-primary-container font-semibold hover:text-white"
                    >
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                    <input 
                      className="w-full bg-surface-container-low border border-surface-border rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-surface-variant focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm" 
                      placeholder="••••••••" 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({...form, password: e.target.value})}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-label-caps text-xs text-on-surface-variant font-semibold uppercase tracking-wider ml-1">Confirm</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">shield</span>
                    <input 
                      className="w-full bg-surface-container-low border border-surface-border rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-surface-variant focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm" 
                      placeholder="••••••••" 
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.confirmPassword}
                      onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 mt-4">
              <input 
                className="mt-1 rounded bg-surface-container border-surface-border text-primary focus:ring-offset-background focus:ring-primary" 
                id="terms" 
                type="checkbox"
                required
              />
              <label className="text-[11px] text-on-surface-variant leading-relaxed cursor-pointer select-none" htmlFor="terms">
                I agree to the <a className="text-primary hover:underline" href="#terms">Terms of Service</a> and <a className="text-primary hover:underline" href="#privacy">Privacy Policy</a> regarding my athlete performance data.
              </label>
            </div>

            {/* Submit Action */}
            <button 
              className="w-full bg-primary-container text-white py-4 px-6 rounded-xl font-action-text text-xl tracking-widest shadow-lg shadow-primary-container/20 hover:shadow-primary-container/40 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'INITIALIZING PROFILE...' : 'INITIALIZE PROFILE'}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-10 pt-6 border-t border-surface-border text-center">
            <p className="text-on-surface-variant text-sm">
              ALREADY REGISTERED? 
              <Link className="text-primary font-bold hover:text-primary/80 transition-colors ml-1 uppercase tracking-tight" to="/login">
                Access Control (Login)
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">encrypted</span>
            <span className="text-[10px] font-label-caps tracking-widest uppercase">SSL SECURED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="text-[10px] font-label-caps tracking-widest uppercase">GDPR COMPLIANT</span>
          </div>
        </div>
      </main>
    </div>
  )
}