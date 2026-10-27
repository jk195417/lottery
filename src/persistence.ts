import { watch } from 'vue'
import { parseSave, stringifySave } from './lottery'
import type { useLotteryStore } from './store'

const KEY = 'lottery'

/** Keeps the lottery in localStorage so a page reload in the middle of a party loses nothing. */
export function persist(store: ReturnType<typeof useLotteryStore>, storage: Storage = window.localStorage) {
  try {
    const saved = storage.getItem(KEY)
    if (saved) store.load(parseSave(saved))
  } catch {
    // Unreadable or blocked storage: start empty
  }
  watch(
    () => store.$state,
    (state) => {
      try {
        storage.setItem(KEY, stringifySave(state))
      } catch {
        // Private mode or full storage: keep working without saving
      }
    },
    { deep: true },
  )
}
