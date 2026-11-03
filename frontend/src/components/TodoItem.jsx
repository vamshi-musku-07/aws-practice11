import { useState } from "react";

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      await onUpdate(todo._id, { title: draft.trim() });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="fade-in group flex items-start gap-3 rounded-xl border border-ink-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm transition hover:border-moss-400/40">
      <button
        type="button"
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        onClick={() => onToggle(todo)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
          todo.completed
            ? "border-moss-500 bg-moss-500 text-white"
            : "border-ink-200 bg-white hover:border-moss-500"
        }`}
      >
        {todo.completed && (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.5L5 9L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") {
                  setDraft(todo.title);
                  setEditing(false);
                }
              }}
              className="min-w-0 flex-1 rounded-lg border border-ink-200 px-3 py-1.5 text-sm outline-none focus:border-moss-500 focus:ring-2 focus:ring-moss-400/30"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={save}
                disabled={busy}
                className="rounded-lg bg-moss-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-moss-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(todo.title);
                  setEditing(false);
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-100"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className={`break-words text-[15px] leading-snug ${
              todo.completed ? "text-ink-700/50 line-through" : "text-ink-800"
            }`}
          >
            {todo.title}
          </p>
        )}
      </div>

      {!editing && (
        <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-ink-700 hover:bg-ink-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo._id)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-red-700/80 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
