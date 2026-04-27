<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>Dashboard</h2>
      <p class="subtitle">Resumen de tu clínica dental</p>
    </div>

    <div class="grid-3">
      <BaseCard hoverable>
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(212,175,55,.15); color: var(--primary);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <div class="kpi">{{ pacientes.length }}</div>
            <div class="kpi-label">Pacientes Registrados</div>
          </div>
        </div>
      </BaseCard>

      <BaseCard hoverable>
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(184,134,11,.15); color: var(--accent);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
          </div>
          <div>
            <div class="kpi">{{ medicos.length }}</div>
            <div class="kpi-label">Médicos Activos</div>
          </div>
        </div>
      </BaseCard>

      <BaseCard hoverable>
        <div class="kpi-card">
          <div class="kpi-icon" style="background: rgba(16,185,129,.15); color: var(--green);">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <div class="kpi">{{ citas.length }}</div>
            <div class="kpi-label">Citas Totales</div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="section">
      <h3>Próximas Citas</h3>
      <BaseCard>
        <BaseTable
          :columns="columns"
          :data="proximasCitas"
          :loading="loading"
          :pagination="false"
        >
          <template #cell-paciente_nombre="{ row }">
            <div class="patient-cell">
              <div class="avatar">{{ getInitials(row.paciente_nombre) }}</div>
              {{ row.paciente_nombre }} {{ row.paciente_apellido }}
            </div>
          </template>

          <template #cell-medico_nombre="{ row }">{{ row.medico_nombre }} {{ row.medico_apellido }}</template>

          <template #cell-fecha_hora="{ value }">{{ formatDate(value) }}</template>

          <template #cell-estado="{ value }">
            <BaseBadge :variant="getEstadoVariant(value)">{{ value }}</BaseBadge>
          </template>

          <template #empty>
            <div class="empty-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p>No hay citas programadas</p>
            </div>
          </template>
        </BaseTable>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getPacientes, getMedicos, getCitas } from '../services/api';
import BaseCard from '../components/BaseCard.vue';
import BaseTable from '../components/BaseTable.vue';
import BaseBadge from '../components/BaseBadge.vue';

const pacientes = ref([]);
const medicos = ref([]);
const citas = ref([]);
const loading = ref(false);

const proximasCitas = computed(() => citas.value.slice(0, 5));

const columns = [
  { key: 'paciente_nombre', label: 'Paciente', sortable: true },
  { key: 'medico_nombre', label: 'Médico' },
  { key: 'fecha_hora', label: 'Fecha', sortable: true },
  { key: 'estado', label: 'Estado', sortable: true }
];

const loadData = async () => {
  loading.value = true;
  try {
    const [resPacientes, resMedicos, resCitas] = await Promise.all([getPacientes(), getMedicos(), getCitas()]);
    pacientes.value = resPacientes;
    medicos.value = resMedicos;
    citas.value = resCitas;
  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    loading.value = false;
  }
};

const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
const getEstadoVariant = (estado) => ({ programada: 'info', completada: 'success', cancelada: 'danger' }[estado] || 'default');

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

onMounted(loadData);
</script>

<style scoped>
.page-header { margin-bottom: var(--space-6); }
.page-header h2 { margin: 0 0 4px; font-size: var(--text-xl); }
.subtitle { color: var(--muted); margin: 0; }

.kpi-card { display: flex; align-items: center; gap: var(--space-4); }
.kpi-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.kpi { font-size: var(--text-2xl); font-weight: 700; margin: 0; }
.kpi-label { font-size: var(--text-sm); color: var(--muted); margin: 4px 0 0; }

.section { margin-top: var(--space-8); }
.section h3 { margin: 0 0 var(--space-4); font-size: var(--text-lg); }

.patient-cell { display: flex; align-items: center; gap: var(--space-3); }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--primary); display: flex; align-items: center; justify-content: center;
  font-size: var(--text-sm); font-weight: 600; color: #0b1020;
}
.empty-content { display: flex; flex-direction: column; align-items: center; gap: var(--space-3); color: var(--muted); padding: var(--space-6); }
</style>
