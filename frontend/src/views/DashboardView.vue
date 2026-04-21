<template>
  <div class="dashboard">
    <div class="page-header">
      <h2>Dashboard</h2>
      <p class="subtitle">Resumen de tu clínica dental</p>
    </div>

    <div class="grid-3">
      <div class="card">
        <div class="card-header">
          <span class="icon">👥</span>
        </div>
        <div class="kpi">{{ pacientes.length }}</div>
        <div class="kpi-label">Pacientes Registrados</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="icon">👨‍⚕️</span>
        </div>
        <div class="kpi">{{ medicos.length }}</div>
        <div class="kpi-label">Médicos Activos</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="icon">📅</span>
        </div>
        <div class="kpi">{{ citas.length }}</div>
        <div class="kpi-label">Citas Totales</div>
      </div>
    </div>

    <div class="section">
      <h3>Próximas Citas</h3>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cita in citas.slice(0, 5)" :key="cita.id">
              <td>
                <div class="patient-cell">
                  <div class="avatar">{{ getInitials(cita.paciente_nombre) }}</div>
                  {{ cita.paciente_nombre }} {{ cita.paciente_apellido }}
                </div>
              </td>
              <td>{{ cita.medico_nombre }} {{ cita.medico_apellido }}</td>
              <td>{{ formatDate(cita.fecha_hora) }}</td>
              <td>
                <span :class="'status-badge status-' + cita.estado">
                  {{ cita.estado }}
                </span>
              </td>
            </tr>
            <tr v-if="citas.length === 0">
              <td colspan="4" style="text-align: center; color: var(--muted);">
                No hay citas programadas
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getPacientes, getMedicos, getCitas } from '../services/api';

export default {
  name: 'DashboardView',
  setup() {
    const pacientes = ref([]);
    const medicos = ref([]);
    const citas = ref([]);

    const loadData = async () => {
      try {
        const [resPacientes, resMedicos, resCitas] = await Promise.all([
          getPacientes(),
          getMedicos(),
          getCitas()
        ]);
        pacientes.value = resPacientes;
        medicos.value = resMedicos;
        citas.value = resCitas;
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

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

    onMounted(loadData);

    return { pacientes, medicos, citas, getInitials, formatDate };
  }
};
</script>

<style scoped>
.page-header {
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

.section {
  margin-top: 32px;
}
.section h3 {
  margin: 0 0 16px;
  font-size: 18px;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.patient-cell .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}
</style>