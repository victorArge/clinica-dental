<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Panel del Médico</h2>
        <p class="subtitle">Bienvenido, Dr. {{ auth.userName }}</p>
      </div>
      <BaseButton variant="secondary" @click="handleLogout">Cerrar Sesión</BaseButton>
    </div>

    <div class="stats-grid">
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--primary);">{{ misCitasProgramadas }}</span>
          <BaseBadge variant="info">Programadas</BaseBadge>
        </div>
      </BaseCard>
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--green);">{{ misCitasCompletadas }}</span>
          <BaseBadge variant="success">Completadas</BaseBadge>
        </div>
      </BaseCard>
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--danger);">{{ misCitasCanceladas }}</span>
          <BaseBadge variant="danger">Canceladas</BaseBadge>
        </div>
      </BaseCard>
    </div>

    <BaseCard style="margin-top: var(--space-4);">
      <h3 style="margin: 0 0 var(--space-4);">Mis Próximas Citas</h3>
      <BaseTable :columns="columns" :data="misProximasCitas" :loading="loading">
        <template #cell-paciente_nombre="{ row }">
          <div class="patient-cell">
            <div class="avatar">{{ getInitials(row.paciente_nombre) }}</div>
            {{ row.paciente_nombre }} {{ row.paciente_apellido }}
          </div>
        </template>
        <template #cell-fecha_hora="{ value }">{{ formatDate(value) }}</template>
        <template #cell-estado="{ value }">
          <BaseBadge :variant="getEstadoVariant(value)">{{ value }}</BaseBadge>
        </template>
        <template #cell-acciones="{ row }">
          <div class="actions">
            <button v-if="row.estado === 'programada'" class="action-btn success" @click="updateEstado(row.id, 'completada')" title="Marcar completada">✓</button>
            <button v-if="row.estado === 'programada'" class="action-btn danger" @click="updateEstado(row.id, 'cancelada')" title="Cancelar">✕</button>
          </div>
        </template>
        <template #empty>
          <div class="empty-state">No tienes citas programadas</div>
        </template>
      </BaseTable>
    </BaseCard>

    <BaseCard style="margin-top: var(--space-4);">
      <h3 style="margin: 0 0 var(--space-4);">Historial de Citas</h3>
      <BaseTable :columns="columnsHistorial" :data="misCitasPasadas" :loading="loading">
        <template #cell-paciente_nombre="{ row }">
          <div class="patient-cell">
            <div class="avatar">{{ getInitials(row.paciente_nombre) }}</div>
            {{ row.paciente_nombre }} {{ row.paciente_apellido }}
          </div>
        </template>
        <template #cell-fecha_hora="{ value }">{{ formatDate(value) }}</template>
        <template #cell-estado="{ value }">
          <BaseBadge :variant="getEstadoVariant(value)">{{ value }}</BaseBadge>
        </template>
        <template #empty>
          <div class="empty-state">No hay historial de citas</div>
        </template>
      </BaseTable>
    </BaseCard>

    <div class="tables-row">
      <BaseCard>
        <h3 style="margin: 0 0 var(--space-4);">Próximas Citas</h3>
        <BaseTable :columns="columns" :data="misProximasCitas" :loading="loading">
          <template #cell-paciente_nombre="{ row }">
            <div class="patient-cell">
              <div class="avatar">{{ getInitials(row.paciente_nombre) }}</div>
              {{ row.paciente_nombre }} {{ row.paciente_apellido }}
            </div>
          </template>
          <template #cell-fecha_hora="{ value }">{{ formatDate(value) }}</template>
          <template #cell-estado="{ value }">
            <BaseBadge :variant="getEstadoVariant(value)">{{ value }}</BaseBadge>
          </template>
          <template #cell-acciones="{ row }">
            <div class="actions">
              <button v-if="row.estado === 'programada'" class="action-btn success" @click="updateEstado(row.id, 'completada')" title="Marcar completada">✓</button>
              <button v-if="row.estado === 'programada'" class="action-btn danger" @click="updateEstado(row.id, 'cancelada')" title="Cancelar">✕</button>
            </div>
          </template>
          <template #empty>
            <div class="empty-state">Sin citas próximas</div>
          </template>
        </BaseTable>
      </BaseCard>

      <BaseCard>
        <h3 style="margin: 0 0 var(--space-4);">Historial de Citas</h3>
        <BaseTable :columns="columnsHistorial" :data="misCitasPasadas" :loading="loading">
          <template #cell-paciente_nombre="{ row }">
            <div class="patient-cell">
              <div class="avatar">{{ getInitials(row.paciente_nombre) }}</div>
              {{ row.paciente_nombre }} {{ row.paciente_apellido }}
            </div>
          </template>
          <template #cell-fecha_hora="{ value }">{{ formatDate(value) }}</template>
          <template #cell-estado="{ value }">
            <BaseBadge :variant="getEstadoVariant(value)">{{ value }}</BaseBadge>
          </template>
          <template #empty>
            <div class="empty-state">Sin historial</div>
          </template>
        </BaseTable>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { getCitas, getMedicos, updateCita } from '../services/api';
import BaseCard from '../components/BaseCard.vue';
import BaseTable from '../components/BaseTable.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseBadge from '../components/BaseBadge.vue';

const router = useRouter();
const auth = useAuthStore();
const citas = ref([]);
const loading = ref(false);

const columns = [
  { key: 'paciente_nombre', label: 'Paciente' },
  { key: 'fecha_hora', label: 'Fecha/Hora', sortable: true },
  { key: 'duracion_minutos', label: 'Duración' },
  { key: 'motivo', label: 'Motivo' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: 'Acciones' }
];

const columnsHistorial = [
  { key: 'paciente_nombre', label: 'Paciente' },
  { key: 'fecha_hora', label: 'Fecha/Hora', sortable: true },
  { key: 'duracion_minutos', label: 'Duración' },
  { key: 'estado', label: 'Estado' }
];

const misCitas = computed(() => {
  const userEntityId = auth.user?.entityId;
  if (!userEntityId) return [];
  return citas.value.filter(c => c.medico_id === userEntityId);
});

const misCitasProgramadas = computed(() => misCitas.value.filter(c => c.estado === 'programada').length);
const misCitasCompletadas = computed(() => misCitas.value.filter(c => c.estado === 'completada').length);
const misCitasCanceladas = computed(() => misCitas.value.filter(c => c.estado === 'cancelada').length);

const now = new Date();
const misProximasCitas = computed(() => misCitas.value.filter(c => new Date(c.fecha_hora) > now && c.estado === 'programada'));
const misCitasPasadas = computed(() => misCitas.value.filter(c => new Date(c.fecha_hora) <= now || c.estado !== 'programada').slice(0, 10));

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
const getEstadoVariant = (estado) => ({ programada: 'info', completada: 'success', cancelada: 'danger' }[estado] || 'default');

const updateEstado = async (id, nuevoEstado) => {
  try {
    await updateCita(id, { estado: nuevoEstado });
    loadData();
  } catch (e) {
    console.error('Error actualizando cita:', e);
  }
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

const loadData = async () => {
  loading.value = true;
  try {
    const [c, m] = await Promise.all([getCitas(), getMedicos()]);
    citas.value = c;
  } catch (e) {
    console.error('Error cargando datos:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
.page-header h2 { margin: 0 0 4px; font-size: var(--text-xl); }
.subtitle { color: var(--muted); margin: 0; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-bottom: var(--space-6); }
.stat-card { text-align: center; }
.stat { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
.kpi { font-size: var(--text-2xl); font-weight: 700; }
.patient-cell { display: flex; align-items: center; gap: var(--space-3); }
.avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--primary); display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xs); font-weight: 600; color: #0b1020;
}
.actions { display: flex; gap: 4px; }
.action-btn {
  width: 24px; height: 24px; border-radius: 4px; border: none;
  cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;
}
.action-btn.success { background: rgba(34, 197, 94, 0.2); color: var(--green); }
.action-btn.success:hover { background: var(--green); color: white; }
.action-btn.danger { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
.action-btn.danger:hover { background: var(--danger); color: white; }
.empty-state { color: var(--muted); text-align: center; padding: var(--space-6); }
.tables-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-top: var(--space-4); }
</style>