<template>
  <div class="login-page">
    <BaseCard class="login-card" glass>
      <div class="login-header">
        <div class="logo">CD</div>
        <h1>Clínica Dental</h1>
        <p>Selecciona tu rol para continuar</p>
      </div>

      <div class="role-selector">
        <button
          v-for="r in roles"
          :key="r.id"
          :class="['role-btn', { active: selectedRole === r.id }]"
          @click="selectedRole = r.id"
        >
          <span class="role-icon">{{ r.icon }}</span>
          <span class="role-label">{{ r.label }}</span>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <BaseInput
          v-model="form.values.email"
          label="Email"
          placeholder="email@ejemplo.com"
          :error="form.errors.email"
          @blur="form.setFieldTouched('email')"
        />

        <BaseInput
          v-model="form.values.password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          :error="form.errors.password"
          toggle-password
          @blur="form.setFieldTouched('password')"
        />

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          style="width: 100%; margin-top: 8px;"
        >
          Iniciar Sesión
        </BaseButton>

        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <div class="demo-accounts">
        <p class="demo-title">Cuentas de prueba:</p>
        <div class="demo-list">
          <div v-for="demo in demoAccounts" :key="demo.email" class="demo-item">
            <strong>{{ demo.rol }}</strong>: {{ demo.email }} / {{ demo.password }}
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { useForm, required, email } from '../composables/useForm';
import BaseCard from '../components/BaseCard.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const error = ref('');
const selectedRole = ref('secretaria');

const roles = [
  { id: 'secretaria', label: 'Secretaria', icon: '📋' },
  { id: 'medico', label: 'Médico', icon: '👨‍⚕️' },
  { id: 'paciente', label: 'Paciente', icon: '👤' }
];

const demoAccounts = [
  { rol: 'Secretaria', email: 'secretaria@clinica.com', password: 'secretaria123' },
  { rol: 'Médico', email: 'medico@clinica.com', password: 'medico123' },
  { rol: 'Paciente', email: 'paciente@clinica.com', password: 'paciente123' }
];

const form = useForm(
  { email: '', password: '' },
  {
    email: [required('El email es requerido'), email('Email inválido')],
    password: [required('La contraseña es requerida')]
  }
);

const handleSubmit = async () => {
  if (!form.validateAll()) return;
  loading.value = true;
  error.value = '';

  try {
    await auth.login(form.values.email, form.values.password);
    const roleHome = {
      secretaria: '/dashboard',
      medico: '/medico-dashboard',
      paciente: '/paciente-dashboard'
    }[auth.userRole] || '/dashboard';
    router.push(roleHome);
  } catch (e) {
    error.value = e.message || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.login-card {
  width: 100%;
  max-width: 420px;
}
.login-header {
  text-align: center;
  margin-bottom: var(--space-6);
}
.logo {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto var(--space-4);
}
.login-header h1 { margin: 0 0 var(--space-2); font-size: var(--text-xl); }
.login-header p { color: var(--muted); margin: 0; }
.role-selector {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}
.role-btn {
  flex: 1;
  padding: 12px 8px;
  border: 2px solid rgba(255,255,255,.1);
  border-radius: 12px;
  background: rgba(2,6,23,.5);
  color: var(--text);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all .2s;
}
.role-btn:hover { border-color: var(--primary); }
.role-btn.active { border-color: var(--primary); background: rgba(212,175,55,.1); }
.role-icon { font-size: 24px; }
.role-label { font-size: 12px; font-weight: 600; }
.error {
  color: var(--danger);
  text-align: center;
  margin-top: var(--space-4);
  font-size: var(--text-sm);
}
.demo-accounts {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255,255,255,.1);
}
.demo-title {
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 8px;
  text-align: center;
}
.demo-list {
  font-size: 11px;
  color: var(--muted);
}
.demo-item {
  padding: 4px 0;
}
.demo-item strong { color: var(--text); }
</style>