<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Panel de Secretaria</h2>
        <p class="subtitle">Bienvenido, {{ auth.userName }}</p>
      </div>
      <BaseButton variant="secondary" @click="handleLogout">Cerrar Sesión</BaseButton>
    </div>

    <div class="stats-grid">
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi">{{ totalPacientes }}</span>
          <BaseBadge variant="info">Pacientes</BaseBadge>
        </div>
      </BaseCard>
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--primary);">{{ totalMedicos }}</span>
          <BaseBadge variant="warning">Médicos</BaseBadge>
        </div>
      </BaseCard>
      <BaseCard class="stat-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--green);">{{ totalCitas }}</span>
          <BaseBadge variant="success">Citas Hoy</BaseBadge>
        </div>
      </BaseCard>
    </div>

    <div class="dashboard-grid">
      <BaseCard class="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div class="action-buttons">
          <BaseButton @click="navigateTo('/pacientes')">+ Nuevo Paciente</BaseButton>
          <BaseButton variant="secondary" @click="navigateTo('/medicos')">+ Nuevo Médico</BaseButton>
          <BaseButton variant="secondary" @click="navigateTo('/citas')">+ Nueva Cita</BaseButton>
        </div>
      </BaseCard>

      <BaseCard class="recent-citas">
        <h3>Próximas Citas</h3>
        <div v-if="proximasCitas.length === 0" class="empty-state">
          No hay citas programadas
        </div>
        <div v-else class="citas-list">
          <div v-for="cita in proximasCitas" :key="cita.id" class="cita-item">
            <div class="cita-info">
              <strong>{{ cita.paciente_nombre }} {{ cita.paciente_apellido }}</strong>
              <span>Dr. {{ cita.medico_nombre }} {{ cita.medico_apellido }}</span>
              <small>{{ formatDate(cita.fecha_hora) }}</small>
            </div>
            <BaseBadge :variant="getEstadoVariant(cita.estado)">{{ cita.estado }}</BaseBadge>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="nav-cards">
      <div class="nav-card" @click="navigateTo('/pacientes')">
        <span class="nav-icon">👥</span>
        <span class="nav-label">Pacientes</span>
      </div>
      <div class="nav-card" @click="navigateTo('/medicos')">
        <span class="nav-icon">👨‍⚕️</span>
        <span class="nav-label">Médicos</span>
      </div>
      <div class="nav-card" @click="navigateTo('/citas')">
        <span class="nav-icon">📅</span>
        <span class="nav-label">Citas</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { getPacientes, getMedicos, getCitas } from '../services/api';
import BaseCard from '../components/BaseCard.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseBadge from '../components/BaseBadge.vue';

const router = useRouter();
const auth = useAuthStore();
const pacientes = ref([]);
const medicos = ref([]);
const citas = ref([]);

const totalPacientes = computed(() => pacientes.value.length);
const totalMedicos = computed(() => medicos.value.length);
const totalCitas = computed(() => {
  const hoy = new Date().toDateString();
  return citas.value.filter(c => new Date(c.fecha_hora).toDateString() === hoy).length;
});

const proximasCitas = computed(() => {
  const ahora = new Date();
  return citas.value
    .filter(c => new Date(c.fecha_hora) > ahora && c.estado === 'programada')
    .slice(0, 5);
});

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const getEstadoVariant = (estado) => ({ programada: 'info', completada: 'success', cancelada: 'danger' }[estado] || 'default');

const navigateTo = (path) => router.push(path);

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

const loadData = async () => {
  try {
    const [p, m, c] = await Promise.all([getPacientes(), getMedicos(), getCitas()]);
    pacientes.value = p;
    medicos.value = m;
    citas.value = c;
  } catch (e) {
    console.error('Error cargando datos:', e);
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
.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-6); }
.quick-actions h3, .recent-citas h3 { margin: 0 0 var(--space-4); font-size: var(--text-lg); }
.action-buttons { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.empty-state { color: var(--muted); text-align: center; padding: var(--space-6); }
.citas-list { display: flex; flex-direction: column; gap: var(--space-3); }
.cita-item { display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: rgba(255,255,255,.05); border-radius: 8px; }
.cita-info { display: flex; flex-direction: column; gap: 2px; }
.cita-info strong { font-size: var(--text-sm); }
.cita-info span { font-size: var(--text-xs); color: var(--muted); }
.cita-info small { font-size: 11px; color: var(--primary); }
.nav-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }
.nav-card {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 12px;
  padding: var(--space-6);
  text-align: center;
  cursor: pointer;
  transition: all .2s;
}
.nav-card:hover { background: rgba(255,255,255,.1); border-color: var(--primary); }
.nav-icon { font-size: 32px; display: block; margin-bottom: var(--space-2); }
.nav-label { font-weight: 600; }
</style>