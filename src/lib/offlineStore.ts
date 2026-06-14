import { openDB as idbOpenDB, type IDBPDatabase } from 'idb'
import type { OfflineMutation } from '@/types/trip'

const DB_NAME = 'dtl-offline'
const STORE_NAME = 'pendingMutations'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = idbOpenDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

export async function enqueue(mutation: OfflineMutation): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, mutation)
}

export async function getAllMutations(): Promise<OfflineMutation[]> {
  const db = await getDB()
  const all = await db.getAll(STORE_NAME)
  return (all as OfflineMutation[]).sort((a, b) => a.timestamp - b.timestamp)
}

export async function deleteMutation(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}

export async function clearAll(): Promise<void> {
  const db = await getDB()
  await db.clear(STORE_NAME)
}

export async function getMutationCount(): Promise<number> {
  const db = await getDB()
  return db.count(STORE_NAME)
}
