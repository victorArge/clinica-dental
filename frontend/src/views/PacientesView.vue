<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Pacientes</h2>
        <p class="subtitle">Gestiona los pacientes registrados</p>
      </div>
      <BaseButton @click="openModal()">+ Nuevo Paciente</BaseButton>
    </div>

    <BaseCard>
      <BaseTable
        :columns="columns"
        :data="pacientes"
        :loading="loading"
        searchable
        search-placeholder="Buscar paciente..."
        :search-keys="['nombre', 'apellido', 'email']"
        @row-click="openModal"
      >
        <template #header>
          <h3 style="margin: 0; font-size: var(--text-lg);">Lista de Pacientes</h3>
        </template>

        <template #cell-nombre="{ row }">
          <div class="patient-cell">
            <div class="avatar">{{ getInitials(row.nombre) }}</div>
            {{ row.nombre }} {{ row.apellido }}
          </div>
        </template>

        <template #cell-telefono="{ value }">{{ value || '-' }}</template>
        <template #cell-email="{ value }">{{ value || '-' }}</template>
        <template #cell-direccion="{ value }">{{ value || '-' }}</template>

        <template #cell-acciones="{ row }">
          <div class="actions">
            <BaseButton variant="ghost" size="sm" icon-only @click.stop="openModal(row)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </BaseButton>
            <BaseButton variant="ghost" size="sm" icon-only @click.stop="deletePacienteConfirm(row.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </BaseButton>
          </div>
        </template>

        <template #empty>
          <div class="empty-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <p>No hay pacientes registrados</p>
            <BaseButton variant="secondary" size="sm" @click="openModal()">Agregar primero</BaseButton>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <BaseModal v-model="showModal" :title="editing ? 'Editar Paciente' : 'Nuevo Paciente'">
      <form @submit.prevent="savePaciente">
        <BaseInput v-model="form.values.nombre" label="Nombre *" :error="form.errors.nombre" @blur="form.setFieldTouched('nombre')" />
        <BaseInput v-model="form.values.apellido" label="Apellido *" :error="form.errors.apellido" @blur="form.setFieldTouched('apellido')" />
        <BaseInput v-model="form.values.telefono" label="Teléfono" maxlength="10" placeholder="10 dígitos" />
        <BaseInput v-model="form.values.email" label="Email" type="email" :error="form.errors.email" @blur="form.setFieldTouched('email')" />
        <BaseInput v-model="form.values.direccion" label="Dirección" />
        <BaseInput v-model="form.values.fecha_nacimiento" label="Fecha de Nacimiento" type="date" />

        <div class="btn-group">
          <BaseButton type="submit" :loading="saving">{{ editing ? 'Actualizar' : 'Crear' }}</BaseButton>
          <BaseButton variant="secondary" @click="closeModal">Cancelar</BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from '../services/api';
import { useToastStore } from '../stores/useToastStore';
import { useForm, required, email } from '../composables/useForm';
import BaseCard from '../components/BaseCard.vue';
import BaseTable from '../components/BaseTable.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseModal from '../components/BaseModal.vue';
import BaseInput from '../components/BaseInput.vue';

const toast = useToastStore();
const pacientes = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const editing = ref(null);

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Email' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'acciones', label: 'Acciones', sortable: false }
];

const form = useForm(
  { nombre: '', apellido: '', telefono: '', email: '', direccion: '', fecha_nacimiento: '' },
  { nombre: [required('El nombre es requerido')], apellido: [required('El apellido es requerido')], email: [email('Email inválido')] }
);

const loadPacientes = async () => {
  loading.value = true;
  try { pacientes.value = await getPacientes(); }
  catch (e) { toast.error('Error cargando pacientes'); }
  finally { loading.value = false; }
};

const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

const openModal = (paciente = null) => {
  if (paciente) {
    editing.value = paciente.id;
    Object.keys(form.values).forEach(k => { form.values[k] = paciente[k] ?? ''; });
  } else {
    editing.value = null;
    form.reset();
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; editing.value = null; };

const savePaciente = async () => {
  if (!form.validateAll()) return;
  saving.value = true;
  try {
    if (editing.value) { await updatePaciente(editing.value, form.values); toast.success('Paciente actualizado'); }
    else { await createPaciente(form.values); toast.success('Paciente creado'); }
    closeModal();
    loadPacientes();
  } catch (e) { toast.error('Error guardando paciente'); }
  finally { saving.value = false; }
};

const deletePacienteConfirm = async (id) => {
  if (confirm('¿Eliminar este paciente?')) {
    try { await deletePaciente(id); toast.success('Paciente eliminado'); loadPacientes(); }
    catch (e) { toast.error('Error eliminando paciente'); }
  }
};

onMounted(loadPacientes);
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
.page-header h2 { margin: 0 0 4px; font-size: var(--text-xl); }
.subtitle { color: var(--muted); margin: 0; }
.patient-cell { display: flex; align-items: center; gap: var(--space-3); }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--primary); display: flex; align-items: center; justify-content: center;
  font-size: var(--text-sm); font-weight: 600; color: #0b1020;
}
.actions { display: flex; gap: var(--space-2); }
.empty-content { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); color: var(--muted); }
</style>
