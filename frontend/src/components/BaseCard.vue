<template>
  <div :class="['base-card', { 'glass': glass, 'hoverable': hoverable }]">
    <div v-if="$slots.header || title" class="card-header">
      <div>
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </div>
      <slot name="header-action" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  glass: { type: Boolean, default: true },
  hoverable: Boolean
});
</script>

<style scoped>
.base-card {
  background: var(--card);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: var(--radius);
  padding: var(--space-4);
  box-shadow: var(--shadow);
}
.base-card.glass {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.base-card.hoverable {
  transition: all var(--duration-normal) var(--ease-out);
  cursor: pointer;
}
.base-card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,.4);
  border-color: rgba(212,175,55,.3);
}
.card-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: var(--space-4);
}
.card-title { margin: 0; font-size: var(--text-lg); font-weight: 600; }
.card-subtitle { margin: var(--space-1) 0 0; font-size: var(--text-sm); color: var(--muted); }
.card-footer { margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid rgba(255,255,255,.08); }
</style>
