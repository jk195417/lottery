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

  const mountApp = () => mount(App, { global: { plugins: [] } })

  it('asks to pick a gift before drawing', async () => {
    const wrapper = mountApp()
    await wrapper.get('button[aria-label="抽獎"]').trigger('click')
    expect(wrapper.text()).toContain('請先在中獎名單點選要抽的禮物')
  })

  it('adds a gift, draws a number and records the winner', async () => {
    const wrapper = mountApp()
    const store = useLotteryStore()
    store.updateConfig({ min: 1, max: 3 })

    await wrapper.get('#gift-name').setValue('咖啡機')
    await wrapper.get('#gift-panel form').trigger('submit')
    await wrapper.get('tbody tr').trigger('click')

    await wrapper.get('button[aria-label="抽「咖啡機」"]').trigger('click')
    expect(store.winners).toHaveLength(0)
    await vi.advanceTimersByTimeAsync(store.config.msOfDrawing)

    expect(store.winners).toHaveLength(1)
    expect([1, 2, 3]).toContain(store.winners[0].serial)
    expect(wrapper.get('[data-testid="result"]').text()).toContain(`${store.winners[0].serial}`)
    expect(wrapper.text()).toContain('剩下 0')

    // The only prize is gone
    await wrapper.get('button[aria-label="抽「咖啡機」"]').trigger('click')
    expect(wrapper.text()).toContain('「咖啡機」已經抽完了')
  })
})
