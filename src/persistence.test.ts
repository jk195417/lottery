import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useLotteryStore } from './store'
import { persist } from './persistence'

function memoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
    clear: () => data.clear(),
    key: (i) => [...data.keys()][i] ?? null,
    get length() {
      return data.size
    },
  }
}

describe('persist', () => {
  it('restores the lottery after a reload', async () => {
    const storage = memoryStorage()

    setActivePinia(createPinia())
    const before = useLotteryStore()
    persist(before, storage)
    before.addGift({ name: 'iPhone', number: 1, imageUrl: null })
    before.addWinner(42, 0)
    await nextTick()

    setActivePinia(createPinia())
    const after = useLotteryStore()
    persist(after, storage)
    expect(after.gifts[0].name).toBe('iPhone')
    expect(after.winners[0].serial).toBe(42)
  })

  it('starts empty when the saved data is unreadable', () => {
    const storage = memoryStorage()
    storage.setItem('lottery', 'not json')
    setActivePinia(createPinia())
    const store = useLotteryStore()
    persist(store, storage)
    expect(store.gifts).toEqual([])
  })
})
