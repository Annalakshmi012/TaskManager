import React, { useEffect, useState } from "react";
import EditTaskModal from "../components/EditTaskModal";
import TaskForm from "../components/TaskForm";
import { FaClock } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pages, setPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState("");
  const [dueAfter, setDueAfter] = useState("");
  const [dueBefore, setDueBefore] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const token = localStorage.getItem("token");

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      qs.set("page", page);
      qs.set("limit", limit);
      if (statusFilter) qs.set("status", statusFilter);
      if (dueAfter) qs.set("dueAfter", new Date(dueAfter).toISOString());
      if (dueBefore) qs.set("dueBefore", new Date(dueBefore).toISOString());

      const res = await fetch(`${API}/api/tasks?${qs.toString()}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setTasks(data.tasks || []);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [page, limit, statusFilter, dueAfter, dueBefore]);

  async function onCreate() {
    setPage(1);
    await fetchTasks();
  }

  async function onDelete(id) {
    if (!confirm("Delete this task?")) return;
    try {
      await fetch(`${API}/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      fetchTasks();
    } catch {
      alert("Delete failed");
    }
  }

  function openEdit(task) {
    setEditingTask(task);
  }

  async function onUpdated() {
    setEditingTask(null);
    await fetchTasks();
  }

  // Status color mapping
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  // Dummy avatars (can be replaced with actual)
  const dummyAvatars = [
    "https://i.pravatar.cc/30?img=1",
    "https://i.pravatar.cc/30?img=2",
    "https://i.pravatar.cc/30?img=3",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Private</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="cursor-pointer">🏠 Home</li>
          <li onClick={() => setStatusFilter("completed")} className="cursor-pointer">
            ✅ Completed
          </li>
          <li onClick={() => setStatusFilter("pending")} className="cursor-pointer">
            ⏳ Pending
          </li>
          <li onClick={() => setStatusFilter("in-progress")} className="cursor-pointer">
            🚧 In Progress
          </li>
        </ul>
        <div className="mt-auto">
          <button className="w-full py-2 bg-black text-white rounded-lg mt-6">
            + Create New List
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Good Morning 👋</h1>
            <p className="text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found</p>
          ) : (
            tasks.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-500">{t.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${statusColors[t.status] || "bg-gray-200 text-gray-700"}`}
                    >
                      {t.status}
                    </span>
                    <span className="text-xs text-blue-500 font-medium">
                      #Project
                    </span>
                    <div className="flex -space-x-2">
                      {dummyAvatars.map((avatar, idx) => (
                        <img
                          key={idx}
                          src={avatar}
                          alt="avatar"
                          className="w-6 h-6 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <span className="flex items-center text-xs text-gray-500 ml-2">
                      <FaClock className="mr-1" />{" "}
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(t._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <span>
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Floating Create Task */}
      <div className="fixed bottom-0 left-64 right-0 bg-white shadow-lg p-4 border-t">
        <TaskForm onCreate={onCreate} />
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={onUpdated}
        />
      )}
    </div>
  );
}
