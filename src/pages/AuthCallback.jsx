import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import supabase from '../api/supabase'
import API from '../api/axios'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        navigate('/login')
        return
      }

      const token = data.session.access_token
      const user = data.session.user

      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // Create profile for new Google user
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email,
          role: 'member'
        })
        login(token, 'member', user.user_metadata?.full_name || user.email)
        navigate('/member')
      } else {
        login(token, profile.role, profile.full_name)
        if (profile.role === 'admin') navigate('/admin')
        else if (profile.role === 'trainer') navigate('/trainer')
        else navigate('/member')
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Signing you in...</p>
      </div>
    </div>
  )
}