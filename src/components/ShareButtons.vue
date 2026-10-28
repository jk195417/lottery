<script setup lang="ts">
import { ref } from 'vue'
import { encodeShare, resultsText, shareUrl } from '../share'
import { useLotteryStore } from '../store'

const store = useLotteryStore()
const message = ref<string | null>(null)
// Shown when the clipboard is not available, so the text can be copied by hand
const manualCopy = ref<string | null>(null)

async function copy(text: string, done: string) {
  try {
    await navigator.clipboard.writeText(text)
    manualCopy.value = null
    message.value = done
  } catch {
    manualCopy.value = text
    message.value = '無法自動複製，請手動複製下面的內容'
  }
}

async function copyLink() {
  await copy(shareUrl(await encodeShare(store.$state)), '已複製分享連結：對方打開會看到目前的中獎名單')
}

function copyText() {
  return copy(resultsText(store.$state), '已複製結果文字')
}
</script>

<template>
  <div class="text-center mb-3">
    <button type="button" class="btn btn-outline-primary btn-sm me-2" :disabled="!store.gifts.length" @click="copyLink">
      <i class="fas fa-link" aria-hidden="true"></i> 複製分享連結
    </button>
    <button type="button" class="btn btn-outline-primary btn-sm" :disabled="!store.gifts.length" @click="copyText">
      <i class="far fa-copy" aria-hidden="true"></i> 複製結果文字
    </button>
    <p v-if="message" class="small text-muted mt-2 mb-0" role="status">{{ message }}</p>
    <textarea
      v-if="manualCopy"
      class="form-control form-control-sm mt-2"
      rows="4"
      readonly
      aria-label="要分享的內容"
      :value="manualCopy"
      @focus="($event.target as HTMLTextAreaElement).select()"
    ></textarea>
  </div>
</template>
