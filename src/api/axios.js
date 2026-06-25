import axios from 'axios'
import supabase from './supabase'

const API = axios.create({
  baseURL: 'https://gym-cms-backend-production.up.railway.app/api'
})

API.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    localStorage.setItem('token', token)
  }
  return config
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { data } = await supabase.auth.refreshSession()
      if (data?.session) {
        localStorage.setItem('token', data.session.access_token)
        error.config.headers.Authorization = `Bearer ${data.session.access_token}`
        return API.request(error.config)
      } else {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default API