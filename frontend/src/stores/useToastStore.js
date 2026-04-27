import { defineStore } from 'pinia';
import { ref } from 'vue';

let toastId = 0;

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);

  const add = ({ type = 'info', title = '', message, duration = 4000 }) => {
    const id = ++toastId;
    toasts.value.push({ id, type, title, message });
    if (duration > 0) setTimeout(() => remove(id), duration);
    return id;
  };

  const remove = (id) => {
    const idx = toasts.value.findIndex(t => t.id === id);
    if (idx > -1) toasts.value.splice(idx, 1);
  };

  const success = (message, title = '') => add({ type: 'success', message, title });
  const error = (message, title = '') => add({ type: 'error', message, title });
  const warning = (message, title = '') => add({ type: 'warning', message, title });
  const info = (message, title = '') => add({ type: 'info', message, title });

  return { toasts, add, remove, success, error, warning, info };
});
