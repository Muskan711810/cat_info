import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CatEntry,
  EditConflictError,
  ValidationError,
  deleteCat,
  fetchCat,
  updateCat,
} from "../api/client";
import CatForm from "../components/CatForm";
import CatInfobox from "../components/CatInfobox";
import { parseInfobox } from "../utils/catInfo";

export default function CatDetail() {
  const { id } = useParams<{ id: string }>();
  const catId = Number(id);
  const navigate = useNavigate();

  const [cat, setCat] = useState<CatEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);

  // Form fields, only used while editing
  const [form, setForm] = useState({
    name: "",
    breed: "",
    summary: "",
    body: "",
    image_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function loadCat() {
    setLoading(true);
    setNotFound(false);
    fetchCat(catId)
      .then((data) => {
        setCat(data);
        setForm({
          name: data.name,
          breed: data.breed ?? "",
          summary: data.summary ?? "",
          body: data.body ?? "",
          image_url: data.image_url ?? "",
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!cat) return;
    setSaving(true);
    setConflict(false);
    setSaveError(null);
    try {
      const updated = await updateCat(cat.id, { ...form, version: cat.version });
      setCat(updated);
      setEditing(false);
} catch (err) {
      if (err instanceof EditConflictError) {
        setConflict(true);
      } else if (err instanceof ValidationError) {
        setSaveError(err.message);
      } else {
        setSaveError("Couldn't save. Check that the backend is running.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!cat) return;
    if (!confirm(`Delete "${cat.name}"? This can't be undone.`)) return;
    await deleteCat(cat.id);
    navigate("/");
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="font-body text-ink/50">Loading entry…</p>
      </main>
    );
  }

  if (notFound || !cat) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="font-body text-rust mb-4">
          No entry found with that catalog number.
        </p>
        <Link to="/" className="font-body text-pine underline">
          &larr; Back to the catalog
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/" className="font-body text-sm text-pine underline">
        &larr; Back to the catalog
      </Link>

      {!editing ? (
        <div className="mt-6">
          <CatInfobox
            info={parseInfobox(cat.body)}
            imageUrl={cat.image_url}
            name={cat.name}
          />

          <p className="font-body text-xs tracking-widest text-marigold">
            No. {String(cat.id).padStart(3, "0")}
          </p>
          <h1 className="font-display text-4xl text-ink mt-1 mb-2">{cat.name}</h1>
          {cat.breed && <p className="font-body text-pine mb-6">{cat.breed}</p>}

          {cat.summary && (
            <p className="font-body text-lg text-ink/80 mb-4">{cat.summary}</p>
          )}
          {cat.body && (
            <p className="font-body text-ink/70 whitespace-pre-wrap">{cat.body}</p>
          )}

          <div className="clear-both flex gap-3 mt-8">
            <button
              onClick={() => setEditing(true)}
              className="font-body text-sm px-4 py-2 border-2 border-pine text-pine hover:bg-pine hover:text-parchment transition-colors"
            >
              Edit this entry
            </button>
            <button
              onClick={handleDelete}
              className="font-body text-sm px-4 py-2 border-2 border-rust text-rust hover:bg-rust hover:text-parchment transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <CatForm
          values={form}
          onChange={setForm}
          onSubmit={handleSave}
          saving={saving}
          submitLabel="Save changes"
          onCancel={() => {
            setEditing(false);
            setConflict(false);
            setSaveError(null);
          }}
          banner={
            <>
              {conflict && (
                <div className="border-2 border-rust bg-rust/10 text-rust font-body text-sm p-3">
                  Someone else edited this entry while you were working on it.{" "}
                  <button
                    type="button"
                    onClick={loadCat}
                    className="underline font-medium"
                  >
                    Reload the latest version
                  </button>{" "}
                  and reapply your changes.
                </div>
              )}
              {saveError && (
                <p className="font-body text-sm text-rust">{saveError}</p>
              )}
            </>
          }
        />
      )}
    </main>
  );
}
