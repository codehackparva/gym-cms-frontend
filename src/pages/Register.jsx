import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Zap } from 'lucide-react'
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
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0d0d1a]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80"
            alt="Gym"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-black" />
            </div>
            <span className="font-display text-3xl text-white tracking-wider">GYM CMS</span>
          </div>
          <div>
            <h2 className="font-display text-7xl text-white tracking-wider leading-tight mb-8">
              START YOUR<br/>JOURNEY<br/>TODAY.
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              Join hundreds of members already tracking their progress.
            </p>
            <div className="space-y-5">
              {[
                'Access your personalized workout plans',
                'Track your progress weekly',
                'Connect with expert trainers',
                'Monitor your nutrition goals',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  </div>
                  <p className="text-zinc-300 text-base leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-black" />
            </div>
            <span className="font-display text-3xl text-white tracking-wider">GYM CMS</span>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Create account</h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Start your fitness journey today.
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-4 rounded-xl transition-all mb-6"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
            <span className="text-base font-medium tracking-wide">Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-zinc-800"></div>
            <span className="text-zinc-600 text-sm tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-zinc-800"></div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl mb-8 text-sm leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-zinc-400 text-xs block mb-2 uppercase tracking-widest font-semibold">
                Full Name
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({...form, full_name: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-base"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs block mb-2 uppercase tracking-widest font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-base"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs block mb-2 uppercase tracking-widest font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-base pr-14"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-zinc-400 text-xs block mb-2 uppercase tracking-widest font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-base"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-4 rounded-xl transition-all text-base tracking-widest mt-2"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-zinc-500 text-base text-center mt-8 leading-relaxed">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}