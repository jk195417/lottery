import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'
import { emptySave } from './lottery'
import { encodeShare } from './share'
import { useLotteryStore } from './store'

const sharedSave = {
  ...emptySave(),
  gifts: [{ id: 0, name: '分享的禮物', number: 1, imageUrl: null }],
  winners: [{ serial: 5, giftId: 0, createdAt: '', appearedAt: null }],
}

describe('share links', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => {
    history.replaceState(null, '', '/')
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('opens a read-only view without touching your own lottery', async () => {
    location.hash = `#share=${await encodeShare(sharedSave)}`
    const wrapper = mount(App)
    await vi.waitFor(() => expect(wrapper.text()).toContain('別人分享的抽獎結果'))
    expect(wrapper.text()).toContain('分享的禮物')
    expect(wrapper.text()).toContain('5 號')
    expect(useLotteryStore().gifts).toEqual([])

    await wrapper.findAll('button').find((b) => b.text() === '回到我的抽獎')!.trigger('click')
    expect(wrapper.text()).not.toContain('別人分享的抽獎結果')
    expect(location.hash).toBe('')
  })

  it('loads the shared lottery after confirming', async () => {
    const store = useLotteryStore()
    store.addGift({ name: '我自己的禮物', number: 1, imageUrl: null })
    const confirm = vi.fn().mockReturnValue(true)
    vi.stubGlobal('confirm', confirm)
    location.hash = `#share=${await encodeShare(sharedSave)}`
    const wrapper = mount(App)
    await vi.waitFor(() => expect(wrapper.text()).toContain('載入到我的抽獎'))

    await wrapper.findAll('button').find((b) => b.text() === '載入到我的抽獎')!.trigger('click')
    expect(confirm).toHaveBeenCalled()
    expect(store.gifts.map((g) => g.name)).toEqual(['分享的禮物'])
  })

  it('shows an error for a broken link', async () => {
    location.hash = '#share=AAAA'
    const wrapper = mount(App)
    await vi.waitFor(() => expect(wrapper.text()).toContain('無法開啟分享連結'))
  })

  it('falls back to manual copy when the clipboard is unavailable', async () => {
    useLotteryStore().addGift({ name: '咖啡機', number: 1, imageUrl: null })
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }, configurable: true })
    const wrapper = mount(App)
    await wrapper.findAll('button').find((b) => b.text().includes('複製結果文字'))!.trigger('click')
    await flushPromises()
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toContain('咖啡機（0/1）')
  })
})
