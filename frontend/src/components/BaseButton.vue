<template>
  <component
    :is="tag"
    :class="['base-btn', `btn-${variant}`, `btn-${size}`, { 'btn-loading': loading, 'btn-icon-only': iconOnly }]"
    :disabled="disabled || loading"
    :type="tag === 'button' ? type : undefined"
    v-bind="$attrs"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-if="$slots.iconLeft && !loading" class="icon-left">
      <slot name="iconLeft" />
    </span>
    <span v-if="!iconOnly" class="btn-content">
      <slot />
    </span>
    <span v-if="$slots.iconRight && !loading" class="icon-right">
      <slot name="iconRight" />
    </span>
  </component>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary', validator: v => ['primary', 'secondary', 'ghost', 'danger', 'success'].includes(v) },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
  tag: { type: String, default: 'button' },
  type: { type: String, default: 'button' },
  disabled: Boolean,
  loading: Boolean,
  iconOnly: Boolean
});
</script>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
  white-space: nowrap;
}
.base-btn:active:not(:disabled) { transform: scale(0.97); }
.base-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Sizes */
.btn-sm { padding: 6px 10px; font-size: var(--text-sm); }
.btn-md { padding: 10px 14px; font-size: var(--text-base); }
.btn-lg { padding: 14px 20px; font-size: var(--text-lg); }
.btn-icon-only.btn-sm { padding: 6px; width: 30px; height: 30px; }
.btn-icon-only.btn-md { padding: 8px; width: 38px; height: 38px; }
.btn-icon-only.btn-lg { padding: 10px; width: 46px; height: 46px; }

/* Variants */
.btn-primary { background: var(--primary); color: #0b1020; }
.btn-primary:hover:not(:disabled) { background: var(--accent); box-shadow: 0 4px 16px rgba(212,175,55,.3); }
.btn-secondary { background: rgba(255,255,255,.12); color: var(--text); border: 1px solid rgba(255,255,255,.15); }
.btn-secondary:hover:not(:disabled) { background: rgba(255,255,255,.18); }
.btn-ghost { background: transparent; color: var(--muted); }
.btn-ghost:hover:not(:disabled) { background: rgba(255,255,255,.08); color: var(--text); }
.btn-danger { background: var(--danger); color: white; }
.btn-danger:hover:not(:disabled) { background: #dc2626; box-shadow: 0 4px 16px rgba(239,68,68,.3); }
.btn-success { background: var(--green); color: white; }
.btn-success:hover:not(:disabled) { background: #059669; box-shadow: 0 4px 16px rgba(16,185,129,.3); }

/* Loading */
.btn-loading { pointer-events: none; }
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.icon-left, .icon-right { display: flex; align-items: center; }
</style>
