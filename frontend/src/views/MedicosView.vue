<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2>Médicos</h2>
        <p class="subtitle">Gestiona los médicos de la clínica</p>
      </div>
      <BaseButton @click="openModal()">+ Nuevo Médico</BaseButton>
    </div>

    <BaseCard>
      <BaseTable
        :columns="columns"
        :data="medicos"
        :loading="loading"
        searchable
        search-placeholder="Buscar médico..."
        :search-keys="['nombre', 'apellido', 'especialidad']"
        @row-click="openModal"
      >
        <template #header>
          <h3 style="margin: 0; font-size: var(--text-lg);">Lista de Médicos</h3>
        </template>

        <template #cell-nombre="{ row }">
          <div class="patient-cell">
            <div class="avatar" style="background: var(--accent);">{{ getInitials(row.nombre) }}</div>
            {{ row.nombre }} {{ row.apellido }}
          </div>
        </template>

        <template #cell-especialidad="{ value }">
          <BaseBadge variant="primary">{{ value }}</BaseBadge>
        </template>

        <template #cell-telefono="{ value }">{{ value || '-' }}</template>
        <template #cell-email="{ value }">{{ value || '-' }}</template>

        <template #cell-acciones="{ row }">
          <div class="actions">
            <BaseButton variant="ghost" size="sm" icon-only @click.stop="openModal(row)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </BaseButton>
            <BaseButton variant="ghost" size="sm" icon-only @click.stop="deleteMedicoConfirm(row.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </BaseButton>
          </div>
        </template>

        <template #empty>
          <div class="empty-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
            <p>No hay médicos registrados</p>
            <BaseButton variant="secondary" size="sm" @click="openModal()">Agregar primero</BaseButton>
          </div>
        </template>
      </BaseTable>
    </BaseCard>

    <BaseModal v-model="showModal" :title="editing ? 'Editar Médico' : 'Nuevo Médico'">
      <form @submit.prevent="saveMedico">
        <BaseInput v-model="form.values.nombre" label="Nombre *" :error="form.errors.nombre" @blur="form.setFieldTouched('nombre')" />
        <BaseInput v-model="form.values.apellido" label="Apellido *" :error="form.errors.apellido" @blur="form.setFieldTouched('apellido')" />
        <BaseSelect
          v-model="form.values.especialidad"
          label="Especialidad *"
          :options="especialidades"
          placeholder="Seleccionar..."
          :error="form.errors.especialidad"
          @blur="form.setFieldTouched('especialidad')"
        />
        <BaseInput v-model="form.values.telefono" label="Teléfono" />
        <BaseInput v-model="form.values.email" label="Email del Doctor" type="email" hint="Para acceso del médico" />
        <BaseInput v-model="form.values.password" label="Contraseña" type="password" hint="Dejar vacío para generar automáticamente" toggle-password />
        <BaseInput v-model="form.values.matricula" label="Matrícula *" :error="form.errors.matricula" @blur="form.setFieldTouched('matricula')" />

        <div v-if="tempPassword" class="temp-password-info">
          <strong>Cuenta creada!</strong><br/>
          Email: {{ form.values.email }}<br/>
          Contraseña temporal: <code>{{ tempPassword }}</code><br/>
          <small>El médico deberá cambiar su contraseña al primer ingreso.</small>
        </div>

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
import { getMedicos, createMedico, updateMedico, deleteMedico } from '../services/api';
import { useToastStore } from '../stores/useToastStore';
import { useForm, required, email } from '../composables/useForm';
import BaseCard from '../components/BaseCard.vue';
import BaseTable from '../components/BaseTable.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseModal from '../components/BaseModal.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseSelect from '../components/BaseSelect.vue';
import BaseBadge from '../components/BaseBadge.vue';

const toast = useToastStore();
const medicos = ref([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const editing = ref(null);
const tempPassword = ref(null);

const especialidades = [
  { value: 'Ortodoncia', label: 'Ortodoncia' },
  { value: 'Endodoncia', label: 'Endodoncia' },
  { value: 'Cirugía Oral', label: 'Cirugía Oral' },
  { value: 'Periodoncia', label: 'Periodoncia' },
  { value: 'Odontología General', label: 'Odontología General' },
  { value: 'Pediatría', label: 'Pediatría' }
];

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'especialidad', label: 'Especialidad', sortable: true },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'email', label: 'Email' },
  { key: 'matricula', label: 'Matrícula' },
  { key: 'acciones', label: 'Acciones', sortable: false }
];

const form = useForm(
  { nombre: '', apellido: '', especialidad: '', telefono: '', email: '', password: '', matricula: '' },
  { nombre: [required('El nombre es requerido')], apellido: [required('El apellido es requerido')], matricula: [required('La matrícula es requerida')] }
);

const loadMedicos = async () => {
  loading.value = true;
  try { medicos.value = await getMedicos(); }
  catch (e) { toast.error('Error cargando médicos'); }
  finally { loading.value = false; }
};

const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

const openModal = (medico = null) => {
  tempPassword.value = null;
  if (medico) {
    editing.value = medico.id;
    Object.keys(form.values).forEach(k => { form.values[k] = medico[k] ?? ''; });
    form.values.password = '';
  } else {
    editing.value = null;
    form.reset();
  }
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; editing.value = null; tempPassword.value = null; };

const saveMedico = async () => {
  if (!form.validateAll()) return;
  saving.value = true;
  try {
    if (editing.value) { await updateMedico(editing.value, form.values); toast.success('Médico actualizado'); }
    else {
      const result = await createMedico(form.values);
      toast.success('Médico creado');
      if (result.tempPassword) {
        tempPassword.value = result.tempPassword;
      }
    }
    closeModal();
    loadMedicos();
  } catch (e) { toast.error('Error guardando médico: ' + e.message); }
  finally { saving.value = false; }
};

const deleteMedicoConfirm = async (id) => {
  if (confirm('¿Eliminar este médico?')) {
    try { await deleteMedico(id); toast.success('Médico eliminado'); loadMedicos(); }
    catch (e) { toast.error('Error eliminando médico'); }
  }
};

onMounted(loadMedicos);
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
.temp-password-info {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: var(--space-4);
  color: var(--green);
  font-size: 13px;
}
.temp-password-info code {
  background: rgba(0,0,0,0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
