import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token?: string | null) => {
  if (token) {
    localStorage.setItem('jwtToken', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  localStorage.removeItem('jwtToken')
  delete api.defaults.headers.common.Authorization
}

const storedToken = localStorage.getItem('jwtToken')
if (storedToken) {
  setAuthToken(storedToken)
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null)
    }

    return Promise.reject(error)
  },
)

export { api, API_BASE_URL }
