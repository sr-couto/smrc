import Dexie from 'dexie'

export const db = new Dexie('DB')

db.version(1).stores({
  projects: '++id, date'
})



