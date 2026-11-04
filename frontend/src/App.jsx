import { useCallback, useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "./api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadTodos = useCallback(async () => {
    try {
      setError("");
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAdd = async (title) => {
    const todo = await createTodo(title);
    setTodos((prev) => [todo, ...prev]);
  };

  const handleToggle = async (todo) => {
    const updated = await updateTodo(todo._id, {
      completed: !todo.completed,
    });
    setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleUpdate = async (id, updates) => {
    const updated = await updateTodo(id, updates);
    setTodos((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-10 sm:py-16">
      <header className="mb-8">
        <p className="mb-1 text-sm font-medium tracking-wide text-moss-600">
          Taskflow
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          Your todos
        </h1>
        <p className="mt-2 text-ink-700/70">
          Capture vamshiiiiiiiiiii, check them off, keep moving.
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-6">
        <TodoForm onAdd={handleAdd} />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
            <button
              type="button"
              onClick={loadTodos}
              className="ml-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-700/60">
            {remaining} remaining
          </p>
          <div className="flex rounded-lg border border-ink-100 bg-white/60 p-0.5 text-xs font-medium">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 capitalize transition ${
                  filter === f
                    ? "bg-ink-900 text-sand-50"
                    : "text-ink-700 hover:bg-ink-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-ink-700/50">
            Loading todos…
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink-200 bg-white/40 py-12 text-center text-sm text-ink-700/50">
            {filter === "all"
              ? "No todos yet — add one above."
              : `No ${filter} todos.`}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {filtered.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>

      <footer className="mt-10 text-center text-xs text-ink-700/40">
        React · Express · MongoDB
      </footer>
    </div>
  );
}
