import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Zap } from 'lucide-react'
import API from '../api/axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

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
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0d0d1a]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80"
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
              TRAIN.<br/>TRACK.<br/>TRANSFORM.
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              The all-in-one platform for hybrid gym management.
            </p>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Active Members', value: '500+' },
                { label: 'Workout Plans', value: '50+' },
                { label: 'Trainers', value: '10+' },
                { label: 'Success Rate', value: '98%' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <p className="font-display text-4xl text-orange-400 mb-1">{stat.value}</p>
                  <p className="text-zinc-500 text-sm tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-black" />
            </div>
            <span className="font-display text-3xl text-white tracking-wider">GYM CMS</span>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Sign in</h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Welcome back! Please enter your details.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl mb-8 text-sm leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="text-zinc-400 text-xs block mb-2 uppercase tracking-widest font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all text-base pr-14"
                  placeholder="Enter your password"
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-4 rounded-xl transition-all text-base tracking-widest"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <p className="text-zinc-500 text-base text-center mt-8 leading-relaxed">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}