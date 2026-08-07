import axios from "axios";

// Set VITE_API_URL in a .env file when you deploy; falls back to the
// local FastAPI dev server so this works out of the box.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
});

export interface CatEntry {
  id: number;
  name: string;
  breed: string | null;
  summary: string | null;
  body: string | null;
  image_url: string | null;
  version: number;
  created_at: string;
  updated_at: string | null;
}

export async function fetchCats(search?: string): Promise<CatEntry[]> {
  const { data } = await api.get<CatEntry[]>("/api/cats", {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function fetchCat(id: number): Promise<CatEntry> {
  const { data } = await api.get<CatEntry>(`/api/cats/${id}`);
  return data;
}

export interface CatEntryUpdatePayload {
  name: string;
  breed: string | null;
  summary: string | null;
  body: string | null;
  image_url: string | null;
  version: number;
}

// Thrown specifically when the backend returns 409 — i.e. someone else
// saved a change to this entry after we loaded it. The detail page
// catches this to show a "reload and try again" message instead of a
// generic error.
export class EditConflictError extends Error {
  constructor() {
    super("This entry was edited by someone else. Reload and try again.");
    this.name = "EditConflictError";
  }
}

export async function updateCat(
  id: number,
  payload: CatEntryUpdatePayload
): Promise<CatEntry> {
  try {
    const { data } = await api.put<CatEntry>(`/api/cats/${id}`, payload);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      throw new EditConflictError();
    }
    throw err;
  }
}

export interface CatEntryCreatePayload {
  name: string;
  breed: string | null;
  summary: string | null;
  body: string | null;
  image_url: string | null;
}

export async function createCat(payload: CatEntryCreatePayload): Promise<CatEntry> {
  const { data } = await api.post<CatEntry>("/api/cats", payload);
  return data;
}

export async function deleteCat(id: number): Promise<void> {
  await api.delete(`/api/cats/${id}`);
}
