import React, { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function EditTaskModal({ task, onClose, onUpdated }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'pending');
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '');
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ title, description, status, dueDate: dueDate || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      onUpdated && onUpdated(data);
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Edit Task</h3>
        <form onSubmit={save} className="space-y-3">
          <input className="w-full p-2 border" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="w-full p-2 border" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex gap-2 items-center">
            <select className="p-2 border" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input type="date" className="p-2 border" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 mt-3">
            <button type="button" className="px-4 py-2 border rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
