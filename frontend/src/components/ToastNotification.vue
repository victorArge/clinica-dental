<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          role="alert"
        >
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <svg v-else-if="toast.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <div class="toast-content">
            <p v-if="toast.title" class="toast-title">{{ toast.title }}</p>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button class="toast-close" @click="remove(toast.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useToastStore } from '../stores/useToastStore';

const toastStore = useToastStore();
const toasts = computed(() => toastStore.toasts);
const remove = toastStore.remove;
</script>

<style scoped>
.toast-container {
  position: fixed; bottom: var(--space-6); right: var(--space-6);
  display: flex; flex-direction: column; gap: var(--space-3);
  z-index: 2000; pointer-events: none;
}
.toast {
  display: flex; align-items: flex-start; gap: var(--space-3);
  padding: var(--space-4); border-radius: 10px; min-width: 300px; max-width: 420px;
  background: var(--surface); border: 1px solid rgba(255,255,255,.1);
  backdrop-filter: blur(16px); box-shadow: var(--shadow); pointer-events: all;
}
.toast-success { border-left: 3px solid var(--green); }
.toast-error { border-left: 3px solid var(--danger); }
.toast-warning { border-left: 3px solid var(--warning); }
.toast-info { border-left: 3px solid var(--info); }
.toast-icon { flex-shrink: 0; margin-top: 2px; }
.toast-success .toast-icon { color: var(--green); }
.toast-error .toast-icon { color: var(--danger); }
.toast-warning .toast-icon { color: var(--warning); }
.toast-info .toast-icon { color: var(--info); }
.toast-content { flex: 1; }
.toast-title { margin: 0; font-weight: 600; font-size: var(--text-sm); }
.toast-message { margin: 4px 0 0; font-size: var(--text-sm); color: var(--muted); }
.toast-close {
  background: none; border: none; color: var(--muted); cursor: pointer;
  padding: 2px; border-radius: 4px; display: flex;
}
.toast-close:hover { background: rgba(255,255,255,.1); color: var(--text); }

.toast-enter-active { transition: all var(--duration-normal) var(--ease-out); }
.toast-leave-active { transition: all var(--duration-fast) var(--ease-in-out); }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
.toast-move { transition: transform var(--duration-normal) var(--ease-out); }
</style>
