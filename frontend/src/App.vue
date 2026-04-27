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
      <BaseButton variant="secondary" size="sm" @click="handleLogout">Cerrar Sesión</BaseButton>
    </header>

    <aside class="sidebar">
      <nav class="nav">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
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

    <main class="main">
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

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style>
.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  color: #e5e7eb;
  transition: all 0.2s;
}
.nav-link:hover {
  background: rgba(255,255,255,0.05);
}
.nav-link.active {
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: #d4af37;
}
</style>
