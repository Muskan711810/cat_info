import axios from "axios";

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

export class EditConflictError extends Error {
  constructor() {
    super("This entry was edited by someone else. Reload and try again.");
    this.name = "EditConflictError";
  }
}

export class ValidationError extends Error {
  constructor() {
    super("Please fill in all required fields (Name, Breed, Summary).");
    this.name = "ValidationError";
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
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      throw new ValidationError();
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
  try {
    const { data } = await api.post<CatEntry>("/api/cats", payload);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      throw new ValidationError();
    }
    throw err;
  }
}

export async function deleteCat(id: number): Promise<void> {
  await api.delete(`/api/cats/${id}`);
}