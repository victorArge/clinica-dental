<template>
  <div :class="['base-select', { 'is-focused': focused, 'has-error': error, 'is-disabled': disabled }]" ref="selectRef">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="select-wrapper" @click="!disabled && toggle()">
      <div class="select-display">
        <span v-if="loading" class="select-loading">Cargando...</span>
        <span v-else-if="!selectedOption && !search" class="placeholder">{{ placeholder }}</span>
        <span v-else class="selected-text">{{ selectedOption?.label || search }}</span>
      </div>
      <svg class="chevron" :class="{ open: isOpen }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown">
        <input
          v-if="searchable"
          ref="searchInput"
          v-model="search"
          class="search-input"
          :placeholder="searchPlaceholder"
          @click.stop
        />
        <div class="options-list">
          <div v-if="filteredOptions.length === 0" class="no-options">Sin resultados</div>
          <div
            v-for="option in filteredOptions"
            :key="option.value"
            :class="['option', { selected: option.value === modelValue }]"
            @click.stop="selectOption(option)"
          >
            {{ option.label }}
            <svg v-if="option.value === modelValue" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
      </div>
    </Transition>
    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  options: { type: Array, default: () => [] },
  label: String,
  placeholder: { type: String, default: 'Seleccionar...' },
  searchPlaceholder: { type: String, default: 'Buscar...' },
  searchable: Boolean,
  async: Boolean,
  loading: Boolean,
  error: String,
  disabled: Boolean
});

const emit = defineEmits(['update:modelValue', 'search', 'load-more']);

const selectRef = ref(null);
const searchInput = ref(null);
const search = ref('');
const isOpen = ref(false);
const focused = ref(false);

const selectedOption = computed(() => props.options.find(o => o.value === props.modelValue));
const filteredOptions = computed(() => {
  if (!search.value) return props.options;
  const term = search.value.toLowerCase();
  return props.options.filter(o => o.label.toLowerCase().includes(term));
});

watch(search, (val) => { if (props.async) emit('search', val); });
watch(isOpen, (val) => { if (val && props.searchable) nextTick(() => searchInput.value?.focus()); });

const toggle = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.async) emit('load-more');
};
const selectOption = (option) => {
  emit('update:modelValue', option.value);
  search.value = '';
  isOpen.value = false;
};

const handleClickOutside = (e) => { if (selectRef.value && !selectRef.value.contains(e.target)) isOpen.value = false; };
onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.base-select { position: relative; display: flex; flex-direction: column; gap: var(--space-1); }
.label { font-size: var(--text-sm); color: var(--muted); font-weight: 500; }
.select-wrapper {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(255,255,255,.2);
  background: rgba(2,6,23,.5); transition: all var(--duration-fast) var(--ease-out);
}
.is-focused .select-wrapper { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(212,175,55,.15); }
.has-error .select-wrapper { border-color: var(--danger); }
.is-disabled .select-wrapper { opacity: 0.5; cursor: not-allowed; }
.select-display { flex: 1; color: var(--text); font-size: var(--text-base); }
.placeholder { color: rgba(255,255,255,.35); }
.selected-text { color: var(--text); }
.chevron { transition: transform var(--duration-fast) var(--ease-out); color: var(--muted); }
.chevron.open { transform: rotate(180deg); }
.dropdown {
  position: absolute; top: 100%; left: 0; right: 0; margin-top: 4px;
  background: var(--surface); border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px; box-shadow: var(--shadow); z-index: 100; overflow: hidden;
}
.search-input {
  width: 100%; padding: 10px 12px; border: none; border-bottom: 1px solid rgba(255,255,255,.08);
  background: transparent; color: var(--text); font-size: var(--text-sm);
}
.search-input:focus { outline: none; }
.options-list { max-height: 200px; overflow-y: auto; }
.option {
  padding: 10px 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
  transition: background var(--duration-fast) var(--ease-out);
}
.option:hover { background: rgba(255,255,255,.08); }
.option.selected { background: rgba(212,175,55,.15); color: var(--primary); }
.no-options { padding: 12px; text-align: center; color: var(--muted); font-size: var(--text-sm); }
.error-text { font-size: var(--text-xs); color: var(--danger); }

.dropdown-enter-active, .dropdown-leave-active { transition: all var(--duration-fast) var(--ease-out); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
