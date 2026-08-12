import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCat, ValidationError } from "../api/client";
import CatForm, { CatFormValues } from "../components/CatForm";

const empty: CatFormValues = {
  name: "",
  breed: "",
  summary: "",
  body: "",
  image_url: "",
};

export default function AddCat() {
  const navigate = useNavigate();
  const [values, setValues] = useState<CatFormValues>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await createCat(values);
      navigate(`/cats/${created.id}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else {
        setError("Couldn't save. Check that the backend is running.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-4xl text-ink mb-2">New Catalog Entry</h1>
      <p className="font-body text-ink/70 mb-6">
        Add a cat to the record. You can edit it again later.
      </p>

      {error && <p className="font-body text-sm text-rust mb-4">{error}</p>}

      <CatForm
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Add entry"
        onCancel={() => navigate("/")}
      />
    </main>
  );
}