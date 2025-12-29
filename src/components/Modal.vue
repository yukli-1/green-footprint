<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-window">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="close">×</button>
      </header>
      <div class="modal-body">
        <slot />
      </div>
      <footer class="modal-footer">
        <button class="btn" @click="close">关闭</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  title: { type: String, default: '' }
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-window {
  width: 90%;
  max-width: 720px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.modal-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:16px 20px;
  border-bottom:1px solid #eee;
}
.modal-body { padding:20px; max-height:60vh; overflow:auto }
.modal-footer { padding:12px 20px; text-align:right; border-top:1px solid #f2f2f2 }
.close-btn { background:transparent; border:none; font-size:20px; cursor:pointer }
.btn { padding:8px 14px; border-radius:8px; background:#27ae60; color:#fff; border:none; cursor:pointer }
</style>
