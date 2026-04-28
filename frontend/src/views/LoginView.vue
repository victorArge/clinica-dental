<template>
  <div class="login-page">
    <BaseCard class="login-card" glass>
      <div class="login-header">
        <div class="logo">CD</div>
        <h1>Clínica Dental</h1>
        <p>Ingresa tus credenciales para continuar</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <BaseInput
          v-model="loginForm.values.email"
          label="Email"
          placeholder="email@ejemplo.com"
          :error="loginForm.errors.email"
          @blur="loginForm.setFieldTouched('email')"
        />

        <BaseInput
          v-model="loginForm.values.password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          :error="loginForm.errors.password"
          toggle-password
          @blur="loginForm.setFieldTouched('password')"
        />

        <div class="links-row">
          <button type="button" class="forgot-link" @click="showRecovery = true">
            ¿Olvidaste tu contraseña?
          </button>
          <button type="button" class="create-link" @click="showRegister = true">
            Crear Cuenta
          </button>
        </div>

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          style="width: 100%;"
        >
          Iniciar Sesión
        </BaseButton>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="successMsg" class="success">{{ successMsg }}</p>
      </form>
    </BaseCard>

    <BaseModal v-model="showRecovery" title="Recuperar Contraseña">
      <div v-if="!recoverySent">
        <p class="recovery-info">Ingresa tu email y te enviaremos un código de recuperación.</p>
        <BaseInput
          v-model="recoveryEmail"
          label="Email"
          placeholder="email@ejemplo.com"
          type="email"
        />
        <BaseButton
          variant="primary"
          size="lg"
          style="width: 100%; margin-top: 16px;"
          @click="sendRecoveryCode"
          :loading="sendingCode"
        >
          Enviar Código
        </BaseButton>
      </div>
      <div v-else>
        <p class="recovery-info">Te enviamos un código a <strong>{{ recoveryEmail }}</strong></p>
        <BaseInput
          v-model="recoveryCode"
          label="Código de recuperación"
          placeholder="123456"
        />
        <BaseInput
          v-model="newPassword"
          label="Nueva Contraseña"
          type="password"
          placeholder="••••••••"
          toggle-password
        />
        <BaseButton
          variant="primary"
          size="lg"
          style="width: 100%; margin-top: 16px;"
          @click="resetPassword"
          :loading="resetting"
        >
          Cambiar Contraseña
        </BaseButton>
      </div>
      <p v-if="recoveryError" class="error">{{ recoveryError }}</p>
      <p v-if="recoverySuccess" class="success">{{ recoverySuccess }}</p>
    </BaseModal>

    <BaseModal v-model="showRegister" title="Crear Cuenta de Paciente">
      <form @submit.prevent="handleRegister">
        <BaseInput
          v-model="registerForm.values.email"
          label="Email"
          placeholder="email@ejemplo.com"
          :error="registerForm.errors.email"
          @blur="registerForm.setFieldTouched('email')"
        />
        <BaseInput
          v-model="registerForm.values.password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          :error="registerForm.errors.password"
          toggle-password
          @blur="registerForm.setFieldTouched('password')"
        />
        <BaseInput
          v-model="registerForm.values.nombre"
          label="Nombre"
          placeholder="Tu nombre"
          :error="registerForm.errors.nombre"
          @blur="registerForm.setFieldTouched('nombre')"
        />
        <BaseInput
          v-model="registerForm.values.apellido"
          label="Apellido"
          placeholder="Tu apellido"
          :error="registerForm.errors.apellido"
          @blur="registerForm.setFieldTouched('apellido')"
        />
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loadingRegister"
          style="width: 100%; margin-top: 16px;"
        >
          Crear Cuenta
        </BaseButton>
        <p v-if="registerError" class="error">{{ registerError }}</p>
        <p v-if="registerSuccess" class="success">{{ registerSuccess }}</p>
      </form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import { useForm, required, email } from '../composables/useForm';
import BaseCard from '../components/BaseCard.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const loadingRegister = ref(false);
const error = ref('');
const successMsg = ref('');
const showRecovery = ref(false);
const showRegister = ref(false);
const sendingCode = ref(false);
const resetting = ref(false);
const recoveryEmail = ref('');
const recoveryCode = ref('');
const newPassword = ref('');
const recoveryError = ref('');
const recoverySuccess = ref('');
const recoverySent = ref(false);
const registerError = ref('');
const registerSuccess = ref('');

const loginForm = useForm(
  { email: '', password: '' },
  {
    email: [required('El email es requerido'), email('Email inválido')],
    password: [required('La contraseña es requerida')]
  }
);

const registerForm = useForm(
  { email: '', password: '', nombre: '', apellido: '' },
  {
    email: [required('El email es requerido'), email('Email inválido')],
    password: [required('La contraseña es requerida')],
    nombre: [required('El nombre es requerido')],
    apellido: [required('El apellido es requerido')]
  }
);

const handleSubmit = async () => {
  if (!loginForm.validateAll()) return;
  loading.value = true;
  error.value = '';
  successMsg.value = '';

  try {
    await auth.login(loginForm.values.email, loginForm.values.password);
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

const handleRegister = async () => {
  if (!registerForm.validateAll()) return;
  loadingRegister.value = true;
  registerError.value = '';
  registerSuccess.value = '';

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerForm.values.email,
        password: registerForm.values.password,
        nombre: registerForm.values.nombre,
        apellido: registerForm.values.apellido,
        rol: 'paciente'
      })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error al crear cuenta');
    }

    registerSuccess.value = 'Cuenta creada. Ahora puedes iniciar sesión.';

    setTimeout(() => {
      showRegister.value = false;
      registerForm.reset();
      registerSuccess.value = '';
    }, 2000);
  } catch (e) {
    registerError.value = e.message || 'Error al crear cuenta';
  } finally {
    loadingRegister.value = false;
  }
};

const sendRecoveryCode = async () => {
  if (!recoveryEmail.value) {
    recoveryError.value = 'Ingresa tu email';
    return;
  }
  sendingCode.value = true;
  recoveryError.value = '';
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: recoveryEmail.value })
    });
    if (res.ok) {
      recoverySent.value = true;
      recoverySuccess.value = 'Código enviado. Revisa tu bandeja de entrada.';
    } else {
      const data = await res.json();
      recoveryError.value = data.error || 'Error al enviar código';
    }
  } catch (e) {
    recoveryError.value = 'No se pudo conectar al servidor';
  } finally {
    sendingCode.value = false;
  }
};

const resetPassword = async () => {
  if (!recoveryCode.value || !newPassword.value) {
    recoveryError.value = 'Completa todos los campos';
    return;
  }
  resetting.value = true;
  recoveryError.value = '';
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: recoveryEmail.value,
        code: recoveryCode.value,
        newPassword: newPassword.value
      })
    });
    if (res.ok) {
      recoverySuccess.value = 'Contraseña cambiada. Ya puedes iniciar sesión.';
      setTimeout(() => {
        showRecovery.value = false;
        recoverySent.value = false;
        recoveryEmail.value = '';
        recoveryCode.value = '';
        newPassword.value = '';
        recoverySuccess.value = '';
      }, 2000);
    } else {
      const data = await res.json();
      recoveryError.value = data.error || 'Código inválido';
    }
  } catch (e) {
    recoveryError.value = 'No se pudo conectar al servidor';
  } finally {
    resetting.value = false;
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
  margin-bottom: var(--space-4);
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
.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: var(--space-4);
  background: rgba(2,6,23,.5);
  border-radius: 8px;
  padding: 4px;
}
.tab {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab.active {
  background: var(--primary);
  color: #0b1020;
}
.tab:hover:not(.active) {
  color: var(--text);
}
.forgot-link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
  padding: 0;
  text-align: right;
  width: 100%;
}
.forgot-link:hover { text-decoration: underline; }
.create-link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-size: var(--text-sm);
}
.create-link:hover { text-decoration: underline; }
.links-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}
.error {
  color: var(--danger);
  text-align: center;
  margin-top: var(--space-4);
  font-size: var(--text-sm);
}
.success {
  color: var(--green);
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
.recovery-info {
  color: var(--muted);
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}
</style>