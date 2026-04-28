<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Citas</h2>
        <p class="subtitle">Programación de citas médico-paciente</p>
      </div>
      <BaseButton @click="openModal()">+ Nueva Cita</BaseButton>
    </div>

    <div class="grid-3">
      <BaseCard class="mini-card" hoverable>
        <div class="stat">
          <span class="kpi">{{ citasProgramadas }}</span>
          <BaseBadge variant="info">Programadas</BaseBadge>
        </div>
      </BaseCard>
      <BaseCard class="mini-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--green);">{{ citasCompletadas }}</span>
          <BaseBadge variant="success">Completadas</BaseBadge>
        </div>
      </BaseCard>
      <BaseCard class="mini-card" hoverable>
        <div class="stat">
          <span class="kpi" style="color: var(--danger);">{{ citasCanceladas }}</span>
          <BaseBadge variant="danger">Canceladas</BaseBadge>
        </div>
      </BaseCard>
    </div>

    <BaseCard>
      <BaseTable
        :columns="columns"
        :data="citas"
        :loading="loading"
        @row-click="openModal"
      >
        <template #header>
          <h3 style="margin: 0; font-size: var(--text-lg);">Lista de Citas</h3>
        </template>

        <template #cell-paciente_nombre="{ row }">
          <div class="patient-cell">
            <div class="avatar">{{ getInitials(row.paciente_nombre) }}</div>
            {{ row.paciente_nombre }} {{ row.paciente_apellido }}
          </div>
        </template>

        <template #cell-medico_nombre="{ row }">
          {{ row.medico_nombre }} {{ row.medico_apellido }}
        </template>

        <template #cell-fecha_hora="{ value }">{{ formatDate(value) }}</template>
        <template #cell-duracion_minutos="{ value }">{{ value }} min</template>

        <template #cell-estado="{ value, row }">
          <div class="estado-actions">
            <BaseBadge :variant="getEstadoVariant(value)">{{ value }}</BaseBadge>
            <div v-if="value === 'programada'" class="quick-actions">
              <button class="quick-btn success" @click.stop="updateEstado(row._id, 'completada')" title="Marcar completada">✓</button>
              <button class="quick-btn danger" @click.stop="updateEstado(row._id, 'cancelada')" title="Cancelar">✕</button>
            </div>
            <div v-if="value === 'completada'" class="quick-actions">
              <button class="quick-btn warning" @click.stop="updateEstado(row._id, 'programada')" title="Volver a programar">↩</button>
            </div>
            <div v-if="value === 'cancelada'" class="quick-actions">
              <button class="quick-btn info" @click.stop="updateEstado(row._id, 'programada')" title="Reactivar">↩</button>
            </div>
          </div>
        </template>

        <template #cell-acciones="{ row }">
          <div class="actions">
            <BaseButton variant="ghost" size="sm" icon-only @click.stop="openModal(row)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </BaseButton>
            <BaseButton variant="ghost" size="sm" icon-only @click.stop="deleteCitaConfirm(row.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </BaseButton>
          </div>
        </template>

        <template #empty>
          <div class="empty-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <p>No hay citas registradas</p>
            <BaseButton variant="secondary" size="sm" @click="openModal()">Programar primera cita</BaseButton>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <BaseModal v-model="showModal" :title="editing ? 'Editar Cita' : 'Nueva Cita'" max-width="500px">
      <form @submit.prevent="saveCita">
        <BaseSelect
          v-model="form.values.paciente_id"
          label="Paciente *"
          :options="pacientesOptions"
          placeholder="Seleccionar paciente..."
          :error="form.errors.paciente_id"
          searchable
          @blur="form.setFieldTouched('paciente_id')"
        />
        <BaseSelect
          v-model="form.values.medico_id"
          label="Médico *"
          :options="medicosOptions"
          placeholder="Seleccionar médico..."
          :error="form.errors.medico_id"
          searchable
          @blur="form.setFieldTouched('medico_id')"
        />
        <div class="calendar-wrapper">
          <label class="calendar-label">Fecha y Hora *</label>
          <MiniCalendar
            v-model="form.values.fecha_hora"
            :appointments="citas"
          />
          <span v-if="form.errors.fecha_hora" class="error-text">{{ form.errors.fecha_hora }}</span>
        </div>
        <BaseSelect
          v-model="form.values.duracion_minutos"
          label="Duración"
          :options="duracionOptions"
        />
        <BaseInput v-model="form.values.motivo" label="Motivo" placeholder="Motivo de la consulta..." />
        <BaseSelect
          v-model="form.values.estado"
          label="Estado"
          :options="estadoOptions"
        />

        <div class="btn-group">
          <BaseButton type="submit" :loading="saving">{{ editing ? 'Actualizar' : 'Crear' }}</BaseButton>
          <BaseButton variant="secondary" @click="closeModal">Cancelar</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getCitas, getPacientes, getMedicos, createCita, updateCita, deleteCita } from '../services/api';
import { useToastStore } from '../stores/useToastStore';
import { useForm, required } from '../composables/useForm';
import BaseCard from '../components/BaseCard.vue';
import BaseTable from '../components/BaseTable.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseModal from '../components/BaseModal.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseSelect from '../components/BaseSelect.vue';
import BaseBadge from '../components/BaseBadge.vue';
import MiniCalendar from '../components/MiniCalendar.vue';

const toast = useToastStore();
const citas = ref([]);
const pacientes = ref([]);
const medicos = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const editing = ref(null);

const especialidades = [
  { value: 'Ortodoncia', label: 'Ortodoncia' },
  { value: 'Endodoncia', label: 'Endodoncia' },
  { value: 'Cirugía Oral', label: 'Cirugía Oral' },
  { value: 'Periodoncia', label: 'Periodoncia' },
  { value: 'Odontología General', label: 'Odontología General' },
  { value: 'Pediatría', label: 'Pediatría' }
];

const pacientesOptions = computed(() => pacientes.value.map(p => ({ value: p._id, label: `${p.nombre} ${p.apellido}` })));
const medicosOptions = computed(() => medicos.value.map(m => ({ value: m._id, label: `${m.nombre} ${m.apellido} - ${m.especialidad}` })));
const duracionOptions = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' }
];
const estadoOptions = [
  { value: 'programada', label: 'Programada' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' }
];

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'paciente_nombre', label: 'Paciente', sortable: true },
  { key: 'medico_nombre', label: 'Médico' },
  { key: 'fecha_hora', label: 'Fecha/Hora', sortable: true },
  { key: 'duracion_minutos', label: 'Duración' },
  { key: 'estado', label: 'Estado', sortable: true },
  { key: 'acciones', label: 'Acciones', sortable: false }
];

const form = useForm(
  { paciente_id: '', medico_id: '', fecha_hora: '', duracion_minutos: 30, motivo: '', estado: 'programada' },
  { paciente_id: [required('El paciente es requerido')], medico_id: [required('El médico es requerido')], fecha_hora: [required('La fecha es requerida')] }
);

const loadData = async () => {
  loading.value = true;
  try {
    const [resCitas, resPacientes, resMedicos] = await Promise.all([getCitas(), getPacientes(), getMedicos()]);
    citas.value = resCitas;
    pacientes.value = resPacientes;
    medicos.value = resMedicos;
  } catch (e) { toast.error('Error cargando datos'); }
  finally { loading.value = false; }
};

const citasProgramadas = computed(() => citas.value.filter(c => c.estado === 'programada').length);
const citasCompletadas = computed(() => citas.value.filter(c => c.estado === 'completada').length);
const citasCanceladas = computed(() => citas.value.filter(c => c.estado === 'cancelada').length);

const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
const getEstadoVariant = (estado) => ({ programada: 'info', completada: 'success', cancelada: 'danger' }[estado] || 'default');

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const openModal = (cita = null) => {
  if (cita) {
    editing.value = cita.id;
    Object.keys(form.values).forEach(k => { form.values[k] = cita[k] ?? form.values[k]; });
    if (cita.fecha_hora) form.values.fecha_hora = cita.fecha_hora?.slice(0, 16);
  } else {
    editing.value = null;
    form.reset();
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; editing.value = null; };

const saveCita = async () => {
  if (!form.validateAll()) return;
  saving.value = true;
  try {
    if (editing.value) { await updateCita(editing.value, form.values); toast.success('Cita actualizada'); }
    else { await createCita(form.values); toast.success('Cita creada'); }
    closeModal();
    loadData();
  } catch (e) { toast.error('Error guardando cita'); }
  finally { saving.value = false; }
};

const deleteCitaConfirm = async (id) => {
  if (confirm('¿Eliminar esta cita?')) {
    try { await deleteCita(id); toast.success('Cita eliminada'); loadData(); }
    catch (e) { toast.error('Error eliminando cita'); }
  }
};

const updateEstado = async (id, nuevoEstado) => {
  try {
    await updateCita(id, { estado: nuevoEstado });
    toast.success(`Cita marcada como ${nuevoEstado}`);
    loadData();
  } catch (e) { toast.error('Error actualizando estado'); }
};

onMounted(loadData);
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
.page-header h2 { margin: 0 0 4px; font-size: var(--text-xl); }
.subtitle { color: var(--muted); margin: 0; }
.mini-card { text-align: center; }
.stat { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
.kpi { font-size: var(--text-2xl); font-weight: 700; }
.patient-cell { display: flex; align-items: center; gap: var(--space-3); }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--primary); display: flex; align-items: center; justify-content: center;
  font-size: var(--text-sm); font-weight: 600; color: #0b1020;
}
.actions { display: flex; gap: var(--space-2); }
.empty-content { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); color: var(--muted); }
.calendar-wrapper { margin-bottom: var(--space-4); }
.calendar-label { display: block; font-size: var(--text-sm); color: var(--muted); font-weight: 500; margin-bottom: var(--space-2); }
.error-text { font-size: var(--text-xs); color: var(--danger); margin-top: var(--space-1); display: block; }
.estado-actions { display: flex; align-items: center; gap: var(--space-2); }
.quick-actions { display: flex; gap: 4px; }
.quick-btn {
  width: 24px; height: 24px; border-radius: 4px; border: none;
  cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.quick-btn.success { background: rgba(34, 197, 94, 0.2); color: var(--green); }
.quick-btn.success:hover { background: var(--green); color: white; }
.quick-btn.danger { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
.quick-btn.danger:hover { background: var(--danger); color: white; }
.quick-btn.warning { background: rgba(234, 179, 8, 0.2); color: #eab308; }
.quick-btn.warning:hover { background: #eab308; color: white; }
.quick-btn.info { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.quick-btn.info:hover { background: #3b82f6; color: white; }
</style>
