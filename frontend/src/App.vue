<template>
  <ToastNotification />
  <div v-if="auth.isAuthenticated" class="app-layout">
    <header class="topbar">
      <div class="brand">
        <div class="logo">CD</div>
        <div>
          <h1>Clínica Dental</h1>
          <small>Sistema de Gestión</small>
        </div>
      </div>
      <div class="user-info">
        <span class="user-role">{{ getRoleLabel(auth.userRole) }}</span>
        <BaseButton variant="secondary" size="sm" @click="handleLogout">Cerrar Sesión</BaseButton>
      </div>
    </header>

    <aside v-if="auth.userRole === 'secretaria'" class="sidebar">
      <nav class="nav">
        <router-link to="/dashboard" class="nav-link" :class="{ active: $route.path === '/dashboard' }">
          <span class="icon">📊</span>
          Dashboard
        </router-link>
        <router-link to="/pacientes" class="nav-link" :class="{ active: $route.path === '/pacientes' }">
          <span class="icon">👥</span>
          Pacientes
        </router-link>
        <router-link to="/medicos" class="nav-link" :class="{ active: $route.path === '/medicos' }">
          <span class="icon">👨‍⚕️</span>
          Médicos
        </router-link>
        <router-link to="/citas" class="nav-link" :class="{ active: $route.path === '/citas' }">
          <span class="icon">📅</span>
          Citas
        </router-link>
      </nav>
    </aside>

    <main :class="['main', { 'full-width': auth.userRole !== 'secretaria' }]">
      <router-view />
    </main>
  </div>
  <router-view v-else />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/useAuthStore';
import ToastNotification from './components/ToastNotification.vue';
import BaseButton from './components/BaseButton.vue';

const auth = useAuthStore();
const router = useRouter();

const getRoleLabel = (rol) => {
  const labels = { secretaria: 'Secretaria', medico: 'Médico', paciente: 'Paciente' };
  return labels[rol] || rol;
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style>
.app-layout { display: flex; flex-direction: column; min-height: 100vh; }
.topbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 24px; background: rgba(2, 6, 23, 0.95);
  border-bottom: 1px solid rgba(255,255,255,.1);
}
.brand { display: flex; align-items: center; gap: 12px; }
.logo {
  width: 40px; height: 40px; border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 16px;
}
.brand h1 { margin: 0; font-size: var(--text-lg); }
.brand small { color: var(--muted); font-size: 11px; }
.user-info { display: flex; align-items: center; gap: 16px; }
.user-role {
  padding: 4px 12px; border-radius: 20px;
  background: rgba(212, 175, 55, 0.2); color: var(--primary);
  font-size: 12px; font-weight: 600;
}
.app-layout { display: flex; flex-direction: column; min-height: 100vh; }
.app-layout { display: flex; flex-direction: column; min-height: 100vh; }
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; background: rgba(2,6,23,0.95); border-bottom: 1px solid rgba(255,255,255,.1); }
.brand { display: flex; align-items: center; gap: 12px; }
.logo { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; }
.brand h1 { margin: 0; font-size: var(--text-lg); }
.brand small { color: var(--muted); font-size: 11px; }
.user-info { display: flex; align-items: center; gap: 16px; }
.user-role { padding: 4px 12px; border-radius: 20px; background: rgba(212,175,55,0.2); color: var(--primary); font-size: 12px; font-weight: 600; }
.sidebar { width: 240px; background: rgba(2,6,23,0.8); border-right: 1px solid rgba(255,255,255,.1); padding: 20px 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
.nav-link { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 10px; color: #e5e7eb; transition: all 0.2s; text-decoration: none; }
.nav-link:hover { background: rgba(255,255,255,0.05); }
.nav-link.active { background: rgba(212,175,55,0.2); border: 1px solid rgba(212,175,55,0.4); color: #d4af37; }
.icon { font-size: 18px; }
.main { flex: 1; padding: 24px; background: var(--background); }
.main.full-width { width: 100%; }
</style>