<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Citas</h2>
        <p class="subtitle">Programación de citas médico-paciente</p>
      </div>
      <button class="btn" @click="openModal()">+ Nueva Cita</button>
    </div>

    <div class="grid-3">
      <div class="card mini">
        <div class="stat">
          <span class="kpi">{{ citasProgramadas }}</span>
          <span class="kpi-label">Programadas</span>
        </div>
      </div>
      <div class="card mini">
        <div class="stat">
          <span class="kpi" style="color: var(--green);">{{ citasCompletadas }}</span>
          <span class="kpi-label">Completadas</span>
        </div>
      </div>
      <div class="card mini">
        <div class="stat">
          <span class="kpi" style="color: var(--danger);">{{ citasCanceladas }}</span>
          <span class="kpi-label">Canceladas</span>
        </div>
      </div>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Fecha/Hora</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cita in citas" :key="cita.id">
            <td>{{ cita.id }}</td>
            <td>
              <div class="patient-cell">
                <div class="avatar">{{ getInitials(cita.paciente_nombre) }}</div>
                {{ cita.paciente_nombre }} {{ cita.paciente_apellido }}
              </div>
            </td>
            <td>{{ cita.medico_nombre }} {{ cita.medico_apellido }}</td>
            <td>{{ formatDate(cita.fecha_hora) }}</td>
            <td>{{ cita.duracion_minutos }} min</td>
            <td>
              <span :class="'status-badge status-' + cita.estado">
                {{ cita.estado }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="btn-icon" @click="openModal(cita)" title="Editar">✏️</button>
                <button class="btn-icon danger" @click="deleteCitaConfirm(cita.id)" title="Eliminar">🗑️</button>
              </div>
            </td>
          </tr>
          <tr v-if="citas.length === 0">
            <td colspan="7" style="text-align: center; color: var(--muted);">
              No hay citas registradas
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editing ? 'Editar' : 'Nueva' }} Cita</h3>
        <form @submit.prevent="saveCita">
          <div class="form-group">
            <label>Paciente *</label>
            <select v-model="form.paciente_id" class="select" required>
              <option value="">Seleccionar...</option>
              <option v-for="p in pacientes" :key="p.id" :value="p.id">
                {{ p.nombre }} {{ p.apellido }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Médico *</label>
            <select v-model="form.medico_id" class="select" required>
              <option value="">Seleccionar...</option>
              <option v-for="m in medicos" :key="m.id" :value="m.id">
                {{ m.nombre }} {{ m.apellido }} - {{ m.especialidad }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Fecha y Hora *</label>
            <input v-model="form.fecha_hora" type="datetime-local" class="input" required>
          </div>
          <div class="form-group">
            <label>Duración (minutos)</label>
            <select v-model="form.duracion_minutos" class="select">
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
            </select>
          </div>
          <div class="form-group">
            <label>Motivo</label>
            <textarea v-model="form.motivo" class="input" rows="3" placeholder="Motivo de la consulta..."></textarea>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select v-model="form.estado" class="select">
              <option value="programada">Programada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div class="btn-group">
            <button type="submit" class="btn">Guardar</button>
            <button type="button" class="btn secondary" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getCitas, getPacientes, getMedicos, createCita, updateCita, deleteCita } from '../services/api';

export default {
  name: 'CitasView',
  setup() {
    const citas = ref([]);
    const pacientes = ref([]);
    const medicos = ref([]);
    const showModal = ref(false);
    const editing = ref(null);
    const form = ref({
      paciente_id: '',
      medico_id: '',
      fecha_hora: '',
      duracion_minutos: 30,
      motivo: '',
      estado: 'programada'
    });

    const loadData = async () => {
      try {
        const [resCitas, resPacientes, resMedicos] = await Promise.all([
          getCitas(),
          getPacientes(),
          getMedicos()
        ]);
        citas.value = resCitas;
        pacientes.value = resPacientes;
        medicos.value = resMedicos;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const citasProgramadas = computed(() => citas.value.filter(c => c.estado === 'programada').length);
    const citasCompletadas = computed(() => citas.value.filter(c => c.estado === 'completada').length);
    const citasCanceladas = computed(() => citas.value.filter(c => c.estado === 'cancelada').length);

    const getInitials = (name) => {
      if (!name) return '?';
      return name.charAt(0).toUpperCase();
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return '-';
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const openModal = (cita = null) => {
      if (cita) {
        editing.value = cita.id;
        form.value = {
          paciente_id: cita.paciente_id,
          medico_id: cita.medico_id,
          fecha_hora: cita.fecha_hora?.slice(0, 16),
          duracion_minutos: cita.duracion_minutos || 30,
          motivo: cita.motivo || '',
          estado: cita.estado
        };
      } else {
        editing.value = null;
        form.value = { paciente_id: '', medico_id: '', fecha_hora: '', duracion_minutos: 30, motivo: '', estado: 'programada' };
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      editing.value = null;
    };

    const saveCita = async () => {
      try {
        if (editing.value) {
          await updateCita(editing.value, form.value);
        } else {
          await createCita(form.value);
        }
        closeModal();
        loadData();
      } catch (error) {
        console.error('Error guardando:', error);
      }
    };

    const deleteCitaConfirm = async (id) => {
      if (confirm('¿Eliminar cita?')) {
        try {
          await deleteCita(id);
          loadData();
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    onMounted(loadData);

    return {
      citas, pacientes, medicos, showModal, editing, form,
      citasProgramadas, citasCompletadas, citasCanceladas,
      getInitials, formatDate, openModal, closeModal, saveCita, deleteCita: deleteCitaConfirm
    };
  }
};
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-header h2 { margin: 0 0 4px; font-size: 24px; }
.subtitle { color: var(--muted); margin: 0; }
.card.mini { text-align: center; padding: 20px; }
.card.mini .stat { display: flex; flex-direction: column; gap: 4px; }
.patient-cell { display: flex; align-items: center; gap: 10px; }
.actions { display: flex; gap: 8px; }
.btn-icon { background: none; border: none; font-size: 16px; padding: 4px 8px; border-radius: 4px; }
.btn-icon:hover { background: rgba(255,255,255,0.1); }
.btn-icon.danger:hover { background: rgba(239,68,68,0.2); }
textarea.input { resize: vertical; min-height: 80px; }
</style>