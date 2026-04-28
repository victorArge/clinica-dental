<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Panel del Paciente</h2>
        <p class="subtitle">Bienvenido, {{ auth.userName }}</p>
      </div>
      <BaseButton variant="secondary" @click="handleLogout">Cerrar Sesión</BaseButton>
    </div>

    <div class="stats-grid">
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--primary);">{{ misCitasProgramadas }}</span>
          <BaseBadge variant="info">Próximas</BaseBadge>
        </div>
      </BaseCard>
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--green);">{{ misCitasCompletadas }}</span>
          <BaseBadge variant="success">Atendidas</BaseBadge>
        </div>
      </BaseCard>
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--muted);">{{ misCitasCanceladas }}</span>
          <BaseBadge variant="secondary">Canceladas</BaseBadge>
        </div>
      </BaseCard>
    </div>

<BaseCard>
      <h3 style="margin: 0 0 var(--space-4);">Mis Próximas Citas</h3>
      <BaseTable :columns="columns" :data="misProximasCitas" :loading="loading">
        <template #cell-medico_nombre="{ row }">
          <div class="medico-cell">
            <span class="medico-icon">👨‍⚕️</span>
            Dr. {{ row.medico_nombre }} {{ row.medico_apellido }}
            <small class="especialidad">{{ row.medico_especialidad }}</small>
          </div>
        </template>
        <template #cell-fecha_hora="{ value }">{{ formatDate(value) }}</template>
        <template #cell-duracion_minutos="{ value }">{{ value }} min</template>
        <template #cell-estado="{ value }">
          <BaseBadge :variant="getEstadoVariant(value)">{{ value }}</BaseBadge>
        </template>
        <template #empty>
          <div class="empty-state">
            <p>No tienes citas programadas</p>
            <small>Contacta a la секретаря для programar una cita</small>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <BaseCard style="margin-top: var(--space-4);">
      <h3 style="margin: 0 0 var(--space-4);">Mi Historial de Citas</h3>
      <BaseTable :columns="columnsHistorial" :data="misCitasPasadas" :loading="loading">
        <template #cell-medico_nombre="{ row }">
          <div class="medico-cell">
            <span class="medico-icon">👨‍⚕️</span>
            Dr. {{ row.medico_nombre }} {{ row.medico_apellido }}
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
          <template #cell-medico_nombre="{ row }">
            <div class="medico-cell">
              <span class="medico-icon">👨‍⚕️</span>
              Dr. {{ row.medico_nombre }} {{ row.medico_apellido }}
            </div>
          </template>
          <template #cell-fecha_hora="{ value }">{{ formatDate(value) }}</template>
          <template #cell-estado="{ value }">
            <BaseBadge :variant="getEstadoVariant(value)">{{ value }}</BaseBadge>
          </template>
          <template #empty>
            <div class="empty-state">Sin citas próximas</div>
          </template>
        </BaseTable>
      </BaseCard>

      <BaseCard>
        <h3 style="margin: 0 0 var(--space-4);">Historial de Citas</h3>
        <BaseTable :columns="columnsHistorial" :data="misCitasPasadas" :loading="loading">
          <template #cell-medico_nombre="{ row }">
            <div class="medico-cell">
              <span class="medico-icon">👨‍⚕️</span>
              Dr. {{ row.medico_nombre }} {{ row.medico_apellido }}
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

    <BaseCard style="margin-top: var(--space-4);">
      <h3 style="margin: 0 0 var(--space-4);">Mis Datos</h3>
      <div v-if="auth.user" class="profile-info">
        <div class="info-row">
          <span class="label">Nombre:</span>
          <span class="value">{{ auth.user.nombre }} {{ auth.user.apellido }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">{{ auth.user.email }}</span>
        </div>
      </div>
    </BaseCard>

    <BaseCard style="margin-top: var(--space-4);">
      <h3 style="margin: 0 0 var(--space-4);">Mi Historial de Citas</h3>
      <BaseTable :columns="columnsHistorial" :data="misCitasPasadas" :loading="loading">
        <template #cell-medico_nombre="{ row }">
          <div class="medico-cell">
            <span class="medico-icon">👨‍⚕️</span>
            Dr. {{ row.medico_nombre }} {{ row.medico_apellido }}
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

    <BaseCard style="margin-top: var(--space-4);">
      <h3 style="margin: 0 0 var(--space-4);">Mis Datos</h3>
      <div v-if="auth.user" class="profile-info">
        <div class="info-row">
          <span class="label">Nombre:</span>
          <span class="value">{{ auth.user.nombre }} {{ auth.user.apellido }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span class="value">{{ auth.user.email }}</span>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { getCitas } from '../services/api';
import BaseCard from '../components/BaseCard.vue';
import BaseTable from '../components/BaseTable.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseBadge from '../components/BaseBadge.vue';

const router = useRouter();
const auth = useAuthStore();
const citas = ref([]);
const loading = ref(false);

const columns = [
  { key: 'medico_nombre', label: 'Médico' },
  { key: 'fecha_hora', label: 'Fecha/Hora', sortable: true },
  { key: 'duracion_minutos', label: 'Duración' },
  { key: 'estado', label: 'Estado' }
];

const columnsHistorial = [
  { key: 'medico_nombre', label: 'Médico' },
  { key: 'fecha_hora', label: 'Fecha/Hora', sortable: true },
  { key: 'estado', label: 'Estado' }
];

const misCitas = computed(() => {
  const userEntityId = auth.user?.entityId;
  if (!userEntityId) return [];
  return citas.value.filter(c => c.paciente_id === userEntityId);
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
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getEstadoVariant = (estado) => ({ programada: 'info', completada: 'success', cancelada: 'danger' }[estado] || 'default');

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

const loadData = async () => {
  loading.value = true;
  try {
    const c = await getCitas();
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
.medico-cell { display: flex; align-items: center; gap: var(--space-2); }
.medico-icon { font-size: 18px; }
.especialidad { color: var(--muted); font-size: 11px; }
.empty-state { color: var(--muted); text-align: center; padding: var(--space-6); }
.empty-state small { color: var(--muted); font-size: 12px; }
.profile-info { display: flex; flex-direction: column; gap: var(--space-3); }
.info-row { display: flex; gap: var(--space-4); }
.info-row .label { color: var(--muted); min-width: 80px; }
.info-row .value { font-weight: 500; }
.tables-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-top: var(--space-4); }
</style>