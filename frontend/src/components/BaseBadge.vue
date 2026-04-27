<template>
  <span :class="['base-badge', `badge-${variant}`, `badge-${size}`]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default', validator: v => ['default', 'primary', 'success', 'danger', 'warning', 'info'].includes(v) },
  size: { type: String, default: 'md', validator: v => ['sm', 'md'].includes(v) }
});
</script>

<style scoped>
.base-badge {
  display: inline-flex; align-items: center; gap: 4px;
  border-radius: 20px; font-weight: 600; white-space: nowrap;
}
.badge-sm { padding: 2px 8px; font-size: var(--text-xs); }
.badge-md { padding: 4px 10px; font-size: var(--text-sm); }
.badge-default { background: rgba(255,255,255,.1); color: var(--muted); }
.badge-primary { background: rgba(212,175,55,.2); color: var(--primary); }
.badge-success { background: rgba(16,185,129,.2); color: var(--green); }
.badge-danger { background: rgba(239,68,68,.2); color: var(--danger); }
.badge-warning { background: rgba(245,158,11,.2); color: var(--warning); }
.badge-info { background: rgba(59,130,246,.2); color: var(--info); }
</style>
