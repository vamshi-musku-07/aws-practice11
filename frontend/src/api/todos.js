const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export const getTodos = () => request("/todos");

export const createTodo = (title) =>
  request("/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateTodo = (id, updates) =>
  request(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

export const deleteTodo = (id) =>
  request(`/todos/${id}`, { method: "DELETE" });
