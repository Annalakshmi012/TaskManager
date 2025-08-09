import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
export default function Register(){
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [password,setPassword]=useState('');
  const [error,setError]=useState(null);
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    setError(null);
    try{
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/register', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({name,email,password})
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Register failed');
      localStorage.setItem('token', data.token);
      nav('/tasks');
    }catch(err){ setError(err.message); }
  }
  return (<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h2 className="text-xl font-bold mb-4">Register</h2>
    {error && <div className="text-red-600 mb-2">{error}</div>}
    <form onSubmit={submit}>
      <input className="w-full mb-2 p-2 border" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="w-full mb-2 p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" className="w-full mb-2 p-2 border" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-green-600 text-white py-2 px-4 rounded">Register</button>
    </form>
  </div>)
}
