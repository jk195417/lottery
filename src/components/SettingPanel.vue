<script setup lang="ts">
import { ref } from 'vue'
import { parseSave, stringifySave, type Config } from '../lottery'
import { useLotteryStore } from '../store'

const store = useLotteryStore()
const fileInput = ref<HTMLInputElement>()
const message = ref<string | null>(null)

const fields: { key: keyof Config; label: string; min: number }[] = [
  { key: 'min', label: '最小號碼', min: 0 },
  { key: 'max', label: '最大號碼', min: 0 },
  { key: 'msOfDrawing', label: '抽獎時長(ms)', min: 0 },
  { key: 'msOfNoticing', label: '通知時長(ms)', min: 0 },
]

function exportJson() {
  const url = URL.createObjectURL(new Blob([stringifySave(store.$state)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'lottery.json'
  link.click()
  URL.revokeObjectURL(url)
}

async function importJson(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    store.load(parseSave(await file.text()))
    message.value = `已匯入 ${file.name}`
  } catch (error) {
    message.value = error instanceof Error ? `匯入失敗：${error.message}` : '匯入失敗'
  } finally {
    fileInput.value!.value = ''
  }
}

function reset() {
  if (window.confirm('確定要清除所有禮物、中獎紀錄與設定嗎？建議先匯出備份。')) store.reset()
}
</script>

<template>
  <div>
    <form @submit.prevent>
      <div v-for="field in fields" :key="field.key" class="row mb-3">
        <label class="col col-form-label" :for="`config-${field.key}`">{{ field.label }}</label>
        <div class="col">
          <input
            :id="`config-${field.key}`"
            :value="store.config[field.key]"
            type="number"
            :min="field.min"
            class="form-control"
            @change="store.updateConfig({ [field.key]: Number(($event.target as HTMLInputElement).value) })"
          />
        </div>
      </div>
    </form>
    <h3 class="h6 lt-muted mt-4">紀錄</h3>
    <p class="small lt-muted">資料會自動存在這台電腦的瀏覽器裡，重新整理也不會不見。</p>
    <button type="button" class="btn btn-outline-light w-100" @click="fileInput?.click()">匯入</button>
    <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="importJson" />
    <button type="button" class="btn btn-outline-light w-100 mt-2" @click="exportJson">匯出</button>
    <button type="button" class="btn btn-outline-danger w-100 mt-2" @click="reset">全部清除</button>
    <p v-if="message" class="small mt-2" role="status">{{ message }}</p>
  </div>
</template>
