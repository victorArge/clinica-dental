<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeOnOverlay && close()">
        <div
          ref="modalRef"
          class="modal"
          :style="{ maxWidth: maxWidth }"
          role="dialog"
          aria-modal="true"
        >
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="close-btn" @click="close" aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  maxWidth: { type: String, default: '480px' },
  closeOnOverlay: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue', 'close']);
const modalRef = ref(null);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.modelValue) close();
  if (e.key === 'Tab' && modalRef.value) {
    const focusable = modalRef.value.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
};

watch(() => props.modelValue, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
  if (val) setTimeout(() => modalRef.value?.querySelector('button, input, [tabindex]')?.focus(), 100);
});

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: var(--space-4);
}
.modal {
  background: var(--surface);
  border-radius: var(--radius);
  padding: var(--space-6);
  width: 100%;
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: var(--shadow);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: var(--space-6);
}
.modal-title { margin: 0; font-size: var(--text-lg); font-weight: 600; }
.close-btn {
  background: none; border: none; color: var(--muted);
  cursor: pointer; padding: 4px; border-radius: 6px;
  display: flex; transition: all var(--duration-fast) var(--ease-out);
}
.close-btn:hover { background: rgba(255,255,255,.1); color: var(--text); }
.modal-body { color: var(--text); }
.modal-footer { margin-top: var(--space-6); display: flex; gap: var(--space-3); justify-content: flex-end; }

.modal-enter-active, .modal-leave-active { transition: all var(--duration-normal) var(--ease-out); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: scale(0.95) translateY(10px); }
</style>
