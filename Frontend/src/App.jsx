
import { useState, useEffect } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  // Explicitly point to backend port 4002 based on terminal output, though .env said 4000.
  // Using relative path if proxy configured, but vite proxy not set yet.
  // Let's assume 4002 based on user's error report context, but might be 4000.
  // Best to use window.location or hardcode to 4002 for now as per "Server listening on 4002" log.
  const API_URL = "http://localhost:4000/auth";

  useEffect(() => {
    const fetchedUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, { withCredentials: true });
        setUser(res.data.user);
      } catch (error) {
        console.log("Not logged in");
      }
    }
    fetchedUser();
  }, [])

  const handleLogin = () => {
    window.location.href = `${API_URL}/google`;
  }

  const handleLogout = async () => {
    // Clear cookies logic or call logout endpoint if exists (not yet implemented)
    // For now just reload to see if token expires or just clear state
    // Actually we need a logout endpoint to clear cookies on backend
    setUser(null);
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      {user ? (
        <div className="card">
          <h2>Welcome, {user.username}</h2>
          <img src={user.avatar} alt="Avatar" style={{ borderRadius: '50%', width: '100px' }} />
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="card">
          <button onClick={handleLogin}>
            Login with Google
          </button>
        </div>
      )}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
