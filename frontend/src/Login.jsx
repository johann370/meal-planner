import { useState } from 'react'

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({password}),
      credentials: 'include'
    })
    .then(response => {
      if(response.ok) {
        onLogin();
      }
      else {
        setError('Invalid password');
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log In</h1>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Log In</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

export default Login
