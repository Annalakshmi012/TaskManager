import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
export default function Login(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState('');
  const [error,setError]=useState(null);
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    setError(null);
    try{
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email,password})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      nav('/tasks');
    }catch(err){ setError(err.message); }
  }
  return (<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h2 className="text-xl font-bold mb-4">Login</h2>
    {error && <div className="text-red-600 mb-2">{error}</div>}
    <form onSubmit={submit}>
      <input className="w-full mb-2 p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="w-full mb-2 p-2 border" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white py-2 px-4 rounded">Login</button>
    </form>
  </div>)
}
