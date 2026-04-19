/**
 * JSON File Store — pure JavaScript, zero native dependencies.
 * Reads/writes JSON files in ./data/ directory.
 * Works on Windows, Mac, Linux without any build tools.
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readCollection<T>(name: string): T[] {
  ensureDir();
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8')) as T[];
  } catch {
    return [];
  }
}

export function writeCollection<T>(name: string, data: T[]): void {
  ensureDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf8');
}

export function findOne<T>(name: string, predicate: (item: T) => boolean): T | undefined {
  return readCollection<T>(name).find(predicate);
}

export function insertOne<T>(name: string, item: T): T {
  const col = readCollection<T>(name);
  col.unshift(item); // newest first
  writeCollection(name, col);
  return item;
}

export function updateOne<T extends { id: string }>(
  name: string,
  id: string,
  updates: Partial<T>
): T | null {
  const col = readCollection<T>(name);
  const idx = col.findIndex((item) => (item as T & { id: string }).id === id);
  if (idx === -1) return null;
  col[idx] = { ...col[idx], ...updates };
  writeCollection(name, col);
  return col[idx];
}

export function deleteOne<T extends { id: string }>(name: string, id: string): boolean {
  const col = readCollection<T>(name);
  const next = col.filter((item) => (item as T & { id: string }).id !== id);
  if (next.length === col.length) return false;
  writeCollection(name, next);
  return true;
}

export function isSeeded(): boolean {
  ensureDir();
  return fs.existsSync(filePath('users')) && readCollection('users').length > 0;
}
