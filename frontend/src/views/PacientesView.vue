<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Pacientes</h2>
        <p class="subtitle">Gestiona los pacientes registrados</p>
      </div>
      <button class="btn" @click="openModal()">+ Nuevo Paciente</button>
    </div>

    <div class="card">
      <div class="search-bar">
        <input 
          v-model="search" 
          type="text" 
          class="input" 
          placeholder="Buscar paciente..."
        >
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paciente in filteredPacientes" :key="paciente.id">
            <td>{{ paciente.id }}</td>
            <td>
              <div class="patient-cell">
                <div class="avatar">{{ getInitials(paciente.nombre) }}</div>
                {{ paciente.nombre }} {{ paciente.apellido }}
              </div>
            </td>
            <td>{{ paciente.telefono || '-' }}</td>
            <td>{{ paciente.email || '-' }}</td>
            <td>{{ paciente.direccion || '-' }}</td>
            <td>
              <div class="actions">
                <button class="btn-icon" @click="openModal(paciente)" title="Editar">✏️</button>
                <button class="btn-icon danger" @click="deletePaciente(paciente.id)" title="Eliminar">🗑️</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredPacientes.length === 0">
            <td colspan="6" style="text-align: center; color: var(--muted);">
              No hay pacientes registrados
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editing ? 'Editar' : 'Nuevo' }} Paciente</h3>
        <form @submit.prevent="savePaciente">
          <div class="form-group">
            <label>Nombre *</label>
            <input v-model="form.nombre" class="input" required>
          </div>
          <div class="form-group">
            <label>Apellido *</label>
            <input v-model="form.apellido" class="input" required>
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
            <label>Dirección</label>
            <input v-model="form.direccion" class="input">
          </div>
          <div class="form-group">
            <label>Fecha de Nacimiento</label>
            <input v-model="form.fecha_nacimiento" type="date" class="input">
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
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from '../services/api';

export default {
  name: 'PacientesView',
  setup() {
    const pacientes = ref([]);
    const search = ref('');
    const showModal = ref(false);
    const editing = ref(null);
    const form = ref({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      direccion: '',
      fecha_nacimiento: ''
    });

    const loadPacientes = async () => {
      try {
        pacientes.value = await getPacientes();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const filteredPacientes = computed(() => {
      if (!search.value) return pacientes.value;
      const s = search.value.toLowerCase();
      return pacientes.value.filter(p => 
        p.nombre?.toLowerCase().includes(s) || 
        p.apellido?.toLowerCase().includes(s) ||
        p.email?.toLowerCase().includes(s)
      );
    });

    const getInitials = (name) => {
      if (!name) return '?';
      return name.charAt(0).toUpperCase();
    };

    const openModal = (paciente = null) => {
      if (paciente) {
        editing.value = paciente.id;
        form.value = { ...paciente };
      } else {
        editing.value = null;
        form.value = { nombre: '', apellido: '', telefono: '', email: '', direccion: '', fecha_nacimiento: '' };
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      editing.value = null;
    };

    const savePaciente = async () => {
      try {
        if (editing.value) {
          await updatePaciente(editing.value, form.value);
        } else {
          await createPaciente(form.value);
        }
        closeModal();
        loadPacientes();
      } catch (error) {
        console.error('Error guardando:', error);
      }
    };

    const deletePacienteConfirm = async (id) => {
      if (confirm('¿Eliminar paciente?')) {
        try {
          await deletePaciente(id);
          loadPacientes();
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    onMounted(loadPacientes);

    return {
      pacientes,
      search,
      filteredPacientes,
      showModal,
      editing,
      form,
      getInitials,
      openModal,
      closeModal,
      savePaciente,
      deletePaciente: deletePacienteConfirm
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
.page-header h2 {
  margin: 0 0 4px;
  font-size: 24px;
}
.subtitle {
  color: var(--muted);
  margin: 0;
}
.search-bar {
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.patient-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.actions {
  display: flex;
  gap: 8px;
}
.btn-icon {
  background: none;
  border: none;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
}
.btn-icon:hover {
  background: rgba(255,255,255,0.1);
}
.btn-icon.danger:hover {
  background: rgba(239,68,68,0.2);
}
</style>