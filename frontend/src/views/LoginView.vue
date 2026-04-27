<template>
  <div class="login-page">
    <BaseCard class="login-card" glass>
      <div class="login-header">
        <div class="logo">CD</div>
        <h1>Clínica Dental</h1>
        <p>Ingresa tus credenciales</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <BaseInput
          v-model="form.values.email"
          label="Email"
          placeholder="doctor@clinica.com"
          :error="form.errors.email"
          @blur="form.setFieldTouched('email')"
        >
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </template>
        </BaseInput>

        <BaseInput
          v-model="form.values.password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          :error="form.errors.password"
          toggle-password
          @blur="form.setFieldTouched('password')"
        >
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </template>
        </BaseInput>

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="form.isSubmitting.value"
          style="width: 100%; margin-top: 8px;"
        >
          Iniciar Sesión
        </BaseButton>

        <p v-if="loginError" class="error">{{ loginError }}</p>
      </form>

      <p class="hint">Usa cualquier email y contraseña para probar</p>
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
const loginError = ref('');

const form = useForm(
  { email: '', password: '' },
  {
    email: [required('El email es requerido'), email('Email inválido')],
    password: [required('La contraseña es requerida')]
  }
);

const handleSubmit = form.handleSubmit(async (values) => {
  loginError.value = '';
  await new Promise(resolve => setTimeout(resolve, 800));
  const fakeToken = 'demo-token-' + Date.now();
  auth.login(fakeToken, { email: values.email, name: 'Dr. Demo' });
  router.push('/');
});
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
  max-width: 400px;
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
.login-header h1 {
  margin: 0 0 var(--space-2);
  font-size: var(--text-xl);
}
.login-header p {
  color: var(--muted);
  margin: 0;
}
.error {
  color: var(--danger);
  text-align: center;
  margin-top: var(--space-4);
  font-size: var(--text-sm);
}
.hint {
  text-align: center;
  color: var(--muted);
  font-size: var(--text-xs);
  margin-top: var(--space-6);
}
</style>
