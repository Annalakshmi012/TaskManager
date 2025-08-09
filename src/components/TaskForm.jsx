import React, {useState} from 'react'
export default function TaskForm({onCreate}){
  const [title,setTitle]=useState(''), [description,setDescription]=useState(''), [dueDate,setDueDate]=useState('');
  const token = localStorage.getItem('token');
  async function submit(e){
    e.preventDefault();
    const res = await fetch(import.meta.env.VITE_API_URL + '/api/tasks', {
      method:'POST',
      headers:{'Content-Type':'application/json', Authorization: 'Bearer ' + token},
      body: JSON.stringify({title,description,dueDate: dueDate || undefined})
    });
    const data = await res.json();
    if(!res.ok) return alert(data.message || 'Error');
    setTitle(''); setDescription(''); setDueDate('');
    onCreate && onCreate(data);
  }
  return (<form className="bg-white p-4 rounded shadow" onSubmit={submit}>
    <div className="mb-2">
      <input className="w-full p-2 border" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
    </div>
    <div className="mb-2">
      <textarea className="w-full p-2 border" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
    </div>
    <div className="mb-2">
      <input type="date" className="p-2 border" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
    </div>
    <button className="bg-blue-600 text-white py-2 px-4 rounded">Create Task</button>
  </form>)
}
