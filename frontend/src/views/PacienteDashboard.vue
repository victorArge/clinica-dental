<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Mi Panel</h2>
        <p class="subtitle">Bienvenido, {{ auth.userName }}</p>
      </div>
      <BaseButton variant="secondary" size="sm" @click="handleLogout">Cerrar Sesión</BaseButton>
    </div>

    <div class="paciente-layout">
      <div class="paciente-column">
        <BaseCard class="datos-card">
          <h3>Mis Datos</h3>
          <div class="datos-list">
            <div class="dato-item">
              <span class="dato-label">Nombre</span>
              <span class="dato-value">{{ auth.user?.nombre }} {{ auth.user?.apellido }}</span>
            </div>
            <div class="dato-item">
              <span class="dato-label">Email</span>
              <span class="dato-value">{{ auth.user?.email }}</span>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="paciente-column">
        <BaseCard class="citas-card">
          <div class="card-header">
            <h3>Mis Próximas Citas</h3>
            <span class="citas-count">{{ misCitasProximas.length }}</span>
          </div>

          <div v-if="misCitasProximas.length" class="citas-list">
            <div v-for="cita in misCitasProximas" :key="cita._id" class="cita-item">
              <div class="cita-medico">
                <span class="icon">👨‍⚕️</span>
                <div>
                  <strong>Dr. {{ cita.medico_nombre }} {{ cita.medico_apellido }}</strong>
                  <small>{{ cita.medico_especialidad }}</small>
                </div>
              </div>
              <div class="cita-detalles">
                <div class="cita-fecha">
                  <span class="icon">📅</span>
                  {{ formatDate(cita.fecha_hora) }}
                </div>
                <div class="cita-hora">
                  <span class="icon">⏰</span>
                  {{ cita.duracion_minutos }} min
                </div>
              </div>
              <div class="cita-motivo">
                <span class="icon">📋</span>
                {{ cita.motivo || 'Consulta general' }}
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <span class="empty-icon">📅</span>
            <p>No tienes citas programadas</p>
          </div>

          <BaseButton variant="primary" size="sm" class="agendar-btn" @click="openAgendarModal">
            + Agendar Nueva Cita
          </BaseButton>
        </BaseCard>
      </div>
    </div>

    <BaseModal v-model="showAgendarModal" title="Agendar Nueva Cita" max-width="500px">
      <form @submit.prevent="agendarCita" class="agendar-form">
        <div class="form-group">
          <BaseSelect
            v-model="formMedico"
            label="Médico"
            :options="medicosOptions"
            placeholder="Seleccionar médico..."
            searchable
            :error="errors.medico"
          />
        </div>

        <div v-if="formMedico" class="form-group">
          <label class="form-label">Fecha y Hora</label>
          <MiniCalendar
            v-model="formFechaHora"
            :appointments="todasLasCitasDelMedico"
            :medico-id="formMedico"
          />
          <span v-if="errors.fecha" class="error-text">{{ errors.fecha }}</span>
        </div>

        <div class="form-group">
          <BaseInput
            v-model="formMotivo"
            label="Motivo de la cita"
            placeholder="Ej: Limpieza, Revisión..."
          />
        </div>

        <div class="form-actions">
          <BaseButton type="submit" variant="primary" :loading="saving" :disabled="!formMedico || !formFechaHora">
            Agendar Cita
          </BaseButton>
          <BaseButton variant="secondary" @click="showAgendarModal = false">
            Cancelar
          </BaseButton>
        </div>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success">{{ successMsg }}</p>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { getCitas, getMedicos, createCita } from '../services/api';
import BaseCard from '../components/BaseCard.vue';
import BaseTable from '../components/BaseTable.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseBadge from '../components/BaseBadge.vue';
import BaseModal from '../components/BaseModal.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseSelect from '../components/BaseSelect.vue';
import MiniCalendar from '../components/MiniCalendar.vue';

const router = useRouter();
const auth = useAuthStore();
const citas = ref([]);
const medicos = ref([]);
const loading = ref(false);
const saving = ref(false);
const showAgendarModal = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const formMedico = ref('');
const formFechaHora = ref('');
const formMotivo = ref('');
const errors = ref({ medico: '', fecha: '' });

const medicosOptions = computed(() =>
  medicos.value.map(m => ({ value: m._id, label: `Dr. ${m.nombre} ${m.apellido} - ${m.especialidad}` }))
);

const todasLasCitasDelMedico = computed(() => {
  if (!formMedico.value) return [];
  return citas.value.filter(c => c.medico_id === formMedico.value);
});

const misCitas = computed(() => {
  const userEntityId = auth.user?.entityId;
  if (!userEntityId) return [];
  return citas.value.filter(c => c.paciente_id === userEntityId);
});

const misCitasProgramadas = computed(() => misCitas.value.filter(c => c.estado === 'programada').length);
const misCitasCompletadas = computed(() => misCitas.value.filter(c => c.estado === 'completada').length);
const misCitasCanceladas = computed(() => misCitas.value.filter(c => c.estado === 'cancelada').length);

const now = new Date();
const miProximaCita = computed(() => misCitas.value.find(c => new Date(c.fecha_hora) > now && c.estado === 'programada'));
const misCitasProximas = computed(() =>
  misCitas.value
    .filter(c => new Date(c.fecha_hora) > now && c.estado === 'programada')
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const getEstadoVariant = (estado) => ({ programada: 'info', completada: 'success', cancelada: 'danger' }[estado] || 'default');

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};

const openAgendarModal = () => {
  formMedico.value = '';
  formFechaHora.value = '';
  formMotivo.value = '';
  errors.value = { medico: '', fecha: '' };
  errorMsg.value = '';
  successMsg.value = '';
  showAgendarModal.value = true;
};

const agendarCita = async () => {
  errors.value = { medico: '', fecha: '' };
  if (!formMedico.value) { errors.value.medico = 'Selecciona un médico'; return; }
  if (!formFechaHora.value) { errors.value.fecha = 'Selecciona fecha y hora'; return; }

  saving.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    await createCita({
      paciente_id: auth.user.entityId,
      medico_id: formMedico.value,
      fecha_hora: formFechaHora.value,
      duracion_minutos: 30,
      motivo: formMotivo.value || 'Consulta general',
      estado: 'programada'
    });
    successMsg.value = 'Cita agendada exitosamente';
    setTimeout(() => { showAgendarModal.value = false; }, 1500);
    loadData();
  } catch (e) {
    errorMsg.value = 'Error al agendar la cita';
  } finally {
    saving.value = false;
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [c, m] = await Promise.all([getCitas(), getMedicos()]);
    citas.value = c;
    medicos.value = m;
  } catch (e) { console.error('Error cargando datos:', e); }
  finally { loading.value = false; }
};

onMounted(loadData);
</script>

<style scoped>
.page { padding: var(--space-6); max-width: 900px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
.page-header h2 { margin: 0 0 4px; font-size: var(--text-xl); }
.subtitle { color: var(--muted); margin: 0; font-size: var(--text-sm); }

.paciente-layout { display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-6); }
.paciente-column { display: flex; flex-direction: column; gap: var(--space-4); }
.datos-card h3 { margin: 0 0 var(--space-4); font-size: var(--text-lg); }
.datos-list { display: flex; flex-direction: column; gap: var(--space-3); }
.dato-item { display: flex; flex-direction: column; gap: 4px; }
.dato-label { font-size: var(--text-xs); color: var(--muted); text-transform: uppercase; }
.dato-value { font-size: var(--text-base); }

.citas-card { flex: 1; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
.card-header h3 { margin: 0; font-size: var(--text-lg); }
.citas-count {
  background: var(--primary); color: #0b1020; font-size: var(--text-sm); font-weight: 600;
  padding: 2px 10px; border-radius: 12px;
}
.citas-list { display: flex; flex-direction: column; gap: var(--space-3); }
.cita-item { display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-4); background: rgba(2,6,23,.5); border-radius: 12px; border: 1px solid rgba(255,255,255,.1); }
.cita-medico { display: flex; align-items: center; gap: var(--space-3); }
.cita-medico .icon { font-size: 22px; }
.cita-medico strong { display: block; font-size: var(--text-base); }
.cita-medico small { color: var(--muted); font-size: var(--text-xs); display: block; }
.cita-detalles { display: flex; flex-wrap: wrap; gap: var(--space-3); font-size: var(--text-sm); color: var(--muted); margin-left: 36px; }
.cita-fecha, .cita-hora { display: flex; align-items: center; gap: 6px; }
.cita-motivo { font-size: var(--text-sm); color: var(--text); margin-left: 36px; }
.cita-motivo .icon { margin-right: 6px; }

.agendar-btn { width: 100%; margin-top: var(--space-4); }

.empty-state { text-align: center; padding: var(--space-6); color: var(--muted); }
.empty-icon { font-size: 36px; display: block; margin-bottom: var(--space-2); }
.empty-state p { margin: 0; font-size: var(--text-sm); }

.agendar-form { display: flex; flex-direction: column; gap: var(--space-4); }
.form-group { display: flex; flex-direction: column; gap: var(--space-2); }
.form-label { font-size: var(--text-sm); color: var(--muted); font-weight: 500; }
.form-actions { display: flex; gap: var(--space-3); margin-top: var(--space-2); }
.error-text { font-size: var(--text-xs); color: var(--danger); }
.error { color: var(--danger); text-align: center; margin: var(--space-3) 0 0; font-size: var(--text-sm); }
.success { color: var(--green); text-align: center; margin: var(--space-3) 0 0; font-size: var(--text-sm); }

@media (max-width: 768px) {
  .page { padding: var(--space-4); }
  .paciente-layout { grid-template-columns: 1fr; gap: var(--space-4); }
  .page-header { flex-direction: column; gap: var(--space-3); align-items: flex-start; }
  .page-header h2 { font-size: 20px; }
}

@media (max-width: 480px) {
  .page { padding: var(--space-3); }
  .citas-list { gap: var(--space-2); }
  .cita-item { padding: var(--space-3); }
  .agendar-btn { width: 100%; }
  .form-actions { flex-direction: column; }
  .form-actions > * { width: 100%; }
}
</style>