import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'
import { useLotteryStore } from './store'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('opens the gift drawer when there are no gifts yet', () => {
    const wrapper = mount(App)
    expect(wrapper.get('#gift-drawer').classes()).toContain('open')
  })

  it('asks to pick a gift before drawing', async () => {
    const wrapper = mount(App)
    await wrapper.get('button[aria-label="抽獎"]').trigger('click')
    expect(wrapper.text()).toContain('請先在中獎名單點選要抽的禮物')
  })

  it('adds a gift, draws a number and records the winner', async () => {
    const wrapper = mount(App)
    const store = useLotteryStore()
    store.updateConfig({ min: 1, max: 3 })

    await wrapper.get('#gift-name').setValue('咖啡機')
    await wrapper.get('#gift-form').trigger('submit')
    await wrapper.findAll('.gift-chip').find((b) => b.text().includes('咖啡機'))!.trigger('click')

    await wrapper.get('button[aria-label="抽「咖啡機」"]').trigger('click')
    expect(store.winners).toHaveLength(0)
    await vi.advanceTimersByTimeAsync(store.config.msOfDrawing)

    expect(store.winners).toHaveLength(1)
    const serial = store.winners[0].serial
    expect([1, 2, 3]).toContain(serial)
    expect(wrapper.get('[data-testid="result"]').text()).toBe(`${serial}`)
    expect(wrapper.text()).toContain('剩 0 份')

    // The only prize is gone
    await wrapper.get('button[aria-label="抽「咖啡機」"]').trigger('click')
    expect(wrapper.text()).toContain('「咖啡機」已經抽完了')
  })

  it('draws with the Enter key and marks a winner as collected on the board', async () => {
    const wrapper = mount(App, { attachTo: document.body })
    const store = useLotteryStore()
    store.addGift({ name: '禮券', number: 2, imageUrl: null })
    store.selectGift(store.gifts[0].id)
    await wrapper.vm.$nextTick()

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await vi.advanceTimersByTimeAsync(store.config.msOfDrawing)
    expect(store.winners).toHaveLength(1)

    await wrapper.get('.ticket').trigger('click')
    expect(store.winners[0].appearedAt).not.toBeNull()
    wrapper.unmount()
  })
})
