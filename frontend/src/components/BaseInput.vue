<template>
  <div :class="['base-input', { 'has-error': error, 'is-focused': focused, 'is-disabled': disabled }]">
    <label v-if="label" :for="inputId" class="label">{{ label }}</label>
    <div class="input-wrapper">
      <span v-if="$slots.prefix" class="prefix">
        <slot name="prefix" />
      </span>
      <input
        :id="inputId"
        v-bind="$attrs"
        :type="computedType"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder"
        class="input-field"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button v-if="togglePassword" type="button" class="toggle-password" @click="showPassword = !showPassword">
        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      </button>
      <span v-if="$slots.suffix" class="suffix">
        <slot name="suffix" />
      </span>
    </div>
    <span v-if="error" class="error-text">{{ error }}</span>
    <span v-else-if="hint" class="hint-text">{{ hint }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  error: String,
  hint: String,
  disabled: Boolean,
  togglePassword: Boolean
});

defineEmits(['update:modelValue']);

const focused = ref(false);
const showPassword = ref(false);
const inputId = `input-${Math.random().toString(36).slice(2, 9)}`;

const computedType = computed(() => {
  if (props.togglePassword) return showPassword.value ? 'text' : 'password';
  return props.type;
});
</script>

<style scoped>
.base-input { display: flex; flex-direction: column; gap: var(--space-1); }
.label { font-size: var(--text-sm); color: var(--muted); font-weight: 500; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-field {
  width: 100%; padding: 10px 12px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,.2);
  background: rgba(2,6,23,.5); color: var(--text);
  font-size: var(--text-base); transition: all var(--duration-fast) var(--ease-out);
}
.input-field:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(212,175,55,.15); }
.input-field::placeholder { color: rgba(255,255,255,.35); }
.input-field:disabled { opacity: 0.5; cursor: not-allowed; }
.has-error .input-field { border-color: var(--danger); }
.has-error .input-field:focus { box-shadow: 0 0 0 3px rgba(239,68,68,.15); }
.prefix, .suffix { position: absolute; display: flex; align-items: center; color: var(--muted); }
.prefix { left: 10px; }
.suffix { right: 10px; }
.prefix + .input-field { padding-left: 36px; }
.toggle-password {
  position: absolute; right: 8px; background: none; border: none;
  color: var(--muted); cursor: pointer; padding: 4px; display: flex;
}
.toggle-password:hover { color: var(--text); }
.error-text { font-size: var(--text-xs); color: var(--danger); }
.hint-text { font-size: var(--text-xs); color: var(--muted); }
</style>
