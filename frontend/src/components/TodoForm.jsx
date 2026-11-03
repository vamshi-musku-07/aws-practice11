import { useState } from "react";

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAdd(title.trim());
      setTitle("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
        className="min-w-0 flex-1 rounded-xl border border-ink-200/80 bg-white/80 px-4 py-3 text-ink-900 shadow-sm outline-none transition placeholder:text-ink-700/40 focus:border-moss-500 focus:ring-2 focus:ring-moss-400/30"
      />
      <button
        type="submit"
        disabled={!title.trim() || submitting}
        className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-sand-50 transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
