<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

// The id and other attributes go on the panel, not the backdrop
defineOptions({ inheritAttrs: false })
defineProps<{ title: string; side: 'start' | 'end' }>()
const open = defineModel<boolean>({ required: true })

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-show="open" class="drawer-backdrop" @click="open = false"></div>
  <aside v-bind="$attrs" class="drawer" :class="[`drawer-${side}`, { open }]" :aria-hidden="!open" :aria-label="title" :inert="!open">
    <header class="d-flex align-items-center justify-content-between mb-4">
      <h2 class="h4 mb-0">{{ title }}</h2>
      <button type="button" class="btn-close" aria-label="關閉" @click="open = false"></button>
    </header>
    <slot />
  </aside>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1040;
  background: rgb(0 0 0 / 50%);
}
.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1045;
  width: min(380px, 100vw);
  padding: 1.5rem;
  overflow-y: auto;
  background: var(--lt-surface);
  border-color: var(--lt-card-border);
  transition: transform 0.25s ease;
}
.drawer-start {
  left: 0;
  border-right: 1px solid var(--lt-card-border);
  transform: translateX(-100%);
}
.drawer-end {
  right: 0;
  border-left: 1px solid var(--lt-card-border);
  transform: translateX(100%);
}
.drawer.open {
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .drawer {
    transition: none;
  }
}
</style>
