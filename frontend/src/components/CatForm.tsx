export interface CatFormValues {
  name: string;
  breed: string;
  summary: string;
  body: string;
  image_url: string;
}

interface Props {
  values: CatFormValues;
  onChange: (values: CatFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  submitLabel: string;
  onCancel?: () => void;
  banner?: React.ReactNode;
}

export default function CatForm({
  values,
  onChange,
  onSubmit,
  saving,
  submitLabel,
  onCancel,
  banner,
}: Props) {
  function set<K extends keyof CatFormValues>(key: K, value: string) {
    onChange({ ...values, [key]: value });
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      {banner}

      <div>
        <label className="block font-body text-xs uppercase tracking-widest text-pine mb-1">
          Name
        </label>
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          required
          className="w-full border-2 border-ink/15 bg-white/40 px-3 py-2 font-body focus:outline-none focus:border-pine"
        />
      </div>

      <div>
        <label className="block font-body text-xs uppercase tracking-widest text-pine mb-1">
          Breed
        </label>
        <input
          value={values.breed}
          onChange={(e) => set("breed", e.target.value)}
          required
          className="w-full border-2 border-ink/15 bg-white/40 px-3 py-2 font-body focus:outline-none focus:border-pine"
        />
      </div>

      <div>
        <label className="block font-body text-xs uppercase tracking-widest text-pine mb-1">
          Image URL
        </label>
        <input
          value={values.image_url}
          onChange={(e) => set("image_url", e.target.value)}
          placeholder="https://example.com/cat-photo.jpg"
          className="w-full border-2 border-ink/15 bg-white/40 px-3 py-2 font-body focus:outline-none focus:border-pine"
        />
        <p className="font-body text-xs text-ink/50 mt-1">
          Paste a link to an image already hosted somewhere online (e.g. from
          Wikimedia Commons or Imgur) — this doesn't upload a file, it just
          links to one.
        </p>
        {values.image_url && (
          <img
            src={values.image_url}
            alt="Preview"
            className="mt-2 h-32 w-32 object-cover border-2 border-ink/15"
            onError={(e) => (e.currentTarget.style.display = "none")}
            onLoad={(e) => (e.currentTarget.style.display = "block")}
          />
        )}
      </div>

      <div>
        <label className="block font-body text-xs uppercase tracking-widest text-pine mb-1">
          Summary
        </label>
        <textarea
          value={values.summary}
          onChange={(e) => set("summary", e.target.value)}
          required
          rows={2}
          className="w-full border-2 border-ink/15 bg-white/40 px-3 py-2 font-body focus:outline-none focus:border-pine"
        />
      </div>

      <div>
        <label className="block font-body text-xs uppercase tracking-widest text-pine mb-1">
          Full entry
        </label>
        <textarea
          value={values.body}
          onChange={(e) => set("body", e.target.value)}
          rows={6}
          className="w-full border-2 border-ink/15 bg-white/40 px-3 py-2 font-body focus:outline-none focus:border-pine"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="font-body text-sm px-4 py-2 bg-pine text-parchment hover:bg-ink transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="font-body text-sm px-4 py-2 border-2 border-ink/20 text-ink/70 hover:border-ink/40 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}