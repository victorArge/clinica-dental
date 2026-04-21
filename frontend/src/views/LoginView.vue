<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">CD</div>
        <h1>Clínica Dental</h1>
        <p>Ingresa tus credenciales</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="input" 
            placeholder="doctor@clinica.com"
            required
          >
        </div>
        
        <div class="form-group">
          <label>Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            class="input" 
            placeholder="••••••••"
            required
          >
        </div>
        
        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      
      <p class="hint">Usa cualquier email y contraseña para probar</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');
    const router = useRouter();

    const handleLogin = async () => {
      loading.value = true;
      error.value = '';
      
      setTimeout(() => {
        localStorage.setItem('token', 'demo-token-123');
        localStorage.setItem('user', JSON.stringify({ email: email.value, nombre: 'Dr. Demo' }));
        loading.value = false;
        router.push('/');
      }, 800);
    };

    return { email, password, loading, error, handleLogin };
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
  background: var(--surface);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: var(--radius);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header .logo {
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
  margin: 0 auto 16px;
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.login-header p {
  color: var(--muted);
  margin: 0;
}

.login-card .btn {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  font-size: 16px;
}

.login-card .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: var(--danger);
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.hint {
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  margin-top: 24px;
}
</style>