import { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../api/supabase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const role = localStorage.getItem('role')
        const name = localStorage.getItem('name')
        setUser({ token: session.access_token, role, name })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const role = localStorage.getItem('role')
        const name = localStorage.getItem('name')
        setUser({ token: session.access_token, role, name })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = (token, role, name) => {
    localStorage.setItem('role', role)
    localStorage.setItem('name', name)
    setUser({ token, role, name })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)