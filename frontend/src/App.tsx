import { useState } from 'react'
import Login from './components/Auth/Login'
import ChatWorkspace from './components/Chat/ChatWorkspace'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('jwtToken')))

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return <ChatWorkspace onLogout={() => setIsAuthenticated(false)} />
}

export default App
