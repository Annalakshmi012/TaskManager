import React from 'react'
import { Outlet, Link } from 'react-router-dom'
export default function App(){
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="font-bold">TaskManager</Link>
          <div>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet/>
      </main>
    </div>
  )
}
