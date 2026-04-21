<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Médicos</h2>
        <p class="subtitle">Gestiona los médicos de la clínica</p>
      </div>
      <button class="btn" @click="openModal()">+ Nuevo Médico</button>
    </div>

    <div class="card">
      <div class="search-bar">
        <input 
          v-model="search" 
          type="text" 
          class="input" 
          placeholder="Buscar médico..."
        >
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Matrícula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="medico in filteredMedicos" :key="medico.id">
            <td>{{ medico.id }}</td>
            <td>
              <div class="patient-cell">
                <div class="avatar" style="background: var(--accent);">{{ getInitials(medico.nombre) }}</div>
                {{ medico.nombre }} {{ medico.apellido }}
              </div>
            </td>
            <td><span class="badge">{{ medico.especialidad }}</span></td>
            <td>{{ medico.telefono || '-' }}</td>
            <td>{{ medico.email || '-' }}</td>
            <td>{{ medico.matricula }}</td>
            <td>
              <div class="actions">
                <button class="btn-icon" @click="openModal(medico)" title="Editar">✏️</button>
                <button class="btn-icon danger" @click="deleteMedicoConfirm(medico.id)" title="Eliminar">🗑️</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredMedicos.length === 0">
            <td colspan="7" style="text-align: center; color: var(--muted);">
              No hay médicos registrados
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editing ? 'Editar' : 'Nuevo' }} Médico</h3>
        <form @submit.prevent="saveMedico">
          <div class="form-group">
            <label>Nombre *</label>
            <input v-model="form.nombre" class="input" required>
          </div>
          <div class="form-group">
            <label>Apellido *</label>
            <input v-model="form.apellido" class="input" required>
          </div>
          <div class="form-group">
            <label>Especialidad *</label>
            <select v-model="form.especialidad" class="select" required>
              <option value="">Seleccionar...</option>
              <option value="Ortodoncia">Ortodoncia</option>
              <option value="Endodoncia">Endodoncia</option>
              <option value="Cirugía Oral">Cirugía Oral</option>
              <option value="Periodoncia">Periodoncia</option>
              <option value="Odontología General">Odontología General</option>
              <option value="Pediatría">Pediatría</option>
            </select>
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.telefono" class="input">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" class="input">
          </div>
          <div class="form-group">
            <label>Matrícula *</label>
            <input v-model="form.matricula" class="input" required>
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
import { getMedicos, createMedico, updateMedico, deleteMedico } from '../services/api';

export default {
  name: 'MedicosView',
  setup() {
    const medicos = ref([]);
    const search = ref('');
    const showModal = ref(false);
    const editing = ref(null);
    const form = ref({
      nombre: '',
      apellido: '',
      especialidad: '',
      telefono: '',
      email: '',
      matricula: ''
    });

    const loadMedicos = async () => {
      try {
        medicos.value = await getMedicos();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const filteredMedicos = computed(() => {
      if (!search.value) return medicos.value;
      const s = search.value.toLowerCase();
      return medicos.value.filter(m => 
        m.nombre?.toLowerCase().includes(s) || 
        m.apellido?.toLowerCase().includes(s) ||
        m.especialidad?.toLowerCase().includes(s)
      );
    });

    const getInitials = (name) => {
      if (!name) return '?';
      return name.charAt(0).toUpperCase();
    };

    const openModal = (medico = null) => {
      if (medico) {
        editing.value = medico.id;
        form.value = { ...medico };
      } else {
        editing.value = null;
        form.value = { nombre: '', apellido: '', especialidad: '', telefono: '', email: '', matricula: '' };
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      editing.value = null;
    };

    const saveMedico = async () => {
      try {
        if (editing.value) {
          await updateMedico(editing.value, form.value);
        } else {
          await createMedico(form.value);
        }
        closeModal();
        loadMedicos();
      } catch (error) {
        console.error('Error guardando:', error);
      }
    };

    const deleteMedicoConfirm = async (id) => {
      if (confirm('¿Eliminar médico?')) {
        try {
          await deleteMedico(id);
          loadMedicos();
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    onMounted(loadMedicos);

    return {
      medicos,
      search,
      filteredMedicos,
      showModal,
      editing,
      form,
      getInitials,
      openModal,
      closeModal,
      saveMedico,
      deleteMedico: deleteMedicoConfirm
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
.search-bar { padding: 16px; border-bottom: 1px solid rgba(255,255,255,.08); }
.patient-cell { display: flex; align-items: center; gap: 10px; }
.badge {
  background: rgba(124,58,237,.2);
  color: var(--accent);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
}
.actions { display: flex; gap: 8px; }
.btn-icon { background: none; border: none; font-size: 16px; padding: 4px 8px; border-radius: 4px; }
.btn-icon:hover { background: rgba(255,255,255,0.1); }
.btn-icon.danger:hover { background: rgba(239,68,68,0.2); }
</style>