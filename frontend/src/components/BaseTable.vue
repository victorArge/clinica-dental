<template>
  <div class="base-table">
    <div v-if="$slots.header || searchable" class="table-header">
      <slot name="header" />
      <input v-if="searchable" v-model="search" :placeholder="searchPlaceholder" class="search-input" />
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="{ sortable: col.sortable, 'text-right': col.align === 'right' }"
              @click="col.sortable && toggleSort(col.key)"
            >
              <div class="th-content">
                {{ col.label }}
                <span v-if="col.sortable" class="sort-icon">
                  <svg v-if="sortKey === col.key && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
                  <svg v-else-if="sortKey === col.key && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:.3"><polyline points="18 15 12 9 6 15"/></svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="i in 5" :key="i" class="skeleton-row">
            <td v-for="col in columns" :key="col.key"><div class="skeleton"></div></td>
          </tr>
        </tbody>
        <tbody v-else-if="paginatedData.length === 0">
          <tr>
            <td :colspan="columns.length" class="empty-state">
              <slot name="empty">
                <div class="empty-content">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                  <p>No hay datos disponibles</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(row, idx) in paginatedData" :key="getRowKey(row, idx)" v-memo="[row]">
            <td v-for="col in columns" :key="col.key" :class="{ 'text-right': col.align === 'right' }">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">{{ row[col.key] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pagination && !loading" class="table-pagination">
      <span class="pagination-info">Mostrando {{ startItem }}-{{ endItem }} de {{ filteredData.length }}</span>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button v-for="p in visiblePages" :key="p" :class="['page-btn', { active: p === currentPage }]" @click="currentPage = p">{{ p }}</button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  loading: Boolean,
  searchable: Boolean,
  searchPlaceholder: { type: String, default: 'Buscar...' },
  searchKeys: { type: Array, default: null },
  pagination: { type: Boolean, default: true },
  perPage: { type: Number, default: 10 },
  rowKey: { type: String, default: 'id' }
});

const emit = defineEmits(['sort', 'row-click']);

const search = ref('');
const sortKey = ref('');
const sortOrder = ref('asc');
const currentPage = ref(1);

const filteredData = computed(() => {
  let data = [...props.data];
  if (search.value && props.searchKeys?.length) {
    const term = search.value.toLowerCase();
    data = data.filter(row => props.searchKeys.some(k => String(row[k]).toLowerCase().includes(term)));
  }
  if (sortKey.value) {
    data.sort((a, b) => {
      const val = a[sortKey.value] < b[sortKey.value] ? -1 : a[sortKey.value] > b[sortKey.value] ? 1 : 0;
      return sortOrder.value === 'asc' ? val : -val;
    });
  }
  return data;
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / props.perPage));
const paginatedData = computed(() => {
  if (!props.pagination) return filteredData.value;
  const start = (currentPage.value - 1) * props.perPage;
  return filteredData.value.slice(start, start + props.perPage);
});
const startItem = computed(() => Math.min((currentPage.value - 1) * props.perPage + 1, filteredData.value.length));
const endItem = computed(() => Math.min(currentPage.value * props.perPage, filteredData.value.length));
const visiblePages = computed(() => {
  const pages = [];
  for (let i = Math.max(1, currentPage.value - 2); i <= Math.min(totalPages.value, currentPage.value + 2); i++) pages.push(i);
  return pages;
});

watch(search, () => { currentPage.value = 1; });

const toggleSort = (key) => {
  if (sortKey.value === key) sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  else { sortKey.value = key; sortOrder.value = 'asc'; }
  emit('sort', { key: sortKey.value, order: sortOrder.value });
};

const getRowKey = (row, idx) => typeof row[props.rowKey] !== 'undefined' ? row[props.rowKey] : idx;
</script>

<style scoped>
.base-table { display: flex; flex-direction: column; gap: var(--space-4); }
.table-header { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.search-input {
  padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,.2);
  background: rgba(2,6,23,.5); color: var(--text); font-size: var(--text-sm);
}
.search-input:focus { outline: none; border-color: var(--primary); }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid rgba(255,255,255,.08); }
th { font-size: var(--text-sm); color: var(--muted); font-weight: 500; background: rgba(255,255,255,.03); }
th.sortable { cursor: pointer; user-select: none; }
th.sortable:hover { color: var(--text); }
.th-content { display: flex; align-items: center; gap: 4px; }
.sort-icon { display: flex; }
.text-right { text-align: right; }
.skeleton-row td { padding: 14px; }
.skeleton { height: 16px; background: rgba(255,255,255,.1); border-radius: 4px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
.empty-state { text-align: center; padding: var(--space-12) !important; }
.empty-content { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); color: var(--muted); }
.table-pagination { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3); }
.pagination-info { font-size: var(--text-sm); color: var(--muted); }
.pagination-controls { display: flex; gap: var(--space-1); }
.page-btn {
  width: 32px; height: 32px; border: none; border-radius: 6px;
  background: rgba(255,255,255,.08); color: var(--muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--duration-fast) var(--ease-out);
}
.page-btn:hover:not(:disabled) { background: rgba(255,255,255,.12); color: var(--text); }
.page-btn.active { background: var(--primary); color: #0b1020; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 768px) {
  .table-header { flex-direction: column; align-items: flex-start; }
  .search-input { width: 100%; }
  th, td { padding: 10px 8px; font-size: 12px; }
  .table-pagination { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 480px) {
  .table-wrapper { font-size: 12px; }
  th, td { padding: 8px 6px; }
  .page-btn { width: 28px; height: 28px; font-size: 12px; }
  .pagination-info { font-size: 11px; }
}
</style>
