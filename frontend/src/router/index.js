import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

const routes = [
  { path: '/login', component: () => import('../views/LoginView.vue') },
  { path: '/dashboard', component: () => import('../views/SecretariaDashboard.vue'), meta: { requiresAuth: true, roles: ['secretaria'] } },
  { path: '/medico-dashboard', component: () => import('../views/MedicoDashboard.vue'), meta: { requiresAuth: true, roles: ['medico'] } },
  { path: '/paciente-dashboard', component: () => import('../views/PacienteDashboard.vue'), meta: { requiresAuth: true, roles: ['paciente'] } },
  { path: '/', redirect: '/login' },
  { path: '/pacientes', component: () => import('../views/PacientesView.vue'), meta: { requiresAuth: true, roles: ['secretaria'] } },
  { path: '/medicos', component: () => import('../views/MedicosView.vue'), meta: { requiresAuth: true, roles: ['secretaria'] } },
  { path: '/citas', component: () => import('../views/CitasView.vue'), meta: { requiresAuth: true, roles: ['secretaria'] } },
  { path: '/:pathMatch(.*)', redirect: '/login' }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
    return;
  }

  if (to.meta.roles && auth.user) {
    const allowed = to.meta.roles.includes(auth.user.rol);
    if (!allowed) {
      const roleHome = {
        secretaria: '/dashboard',
        medico: '/medico-dashboard',
        paciente: '/paciente-dashboard'
      }[auth.user.rol] || '/login';
      next(roleHome);
      return;
    }
  }

  if (auth.isAuthenticated && to.path === '/login') {
    const roleHome = {
      secretaria: '/dashboard',
      medico: '/medico-dashboard',
      paciente: '/paciente-dashboard'
    }[auth.user?.rol] || '/dashboard';
    next(roleHome);
    return;
  }

  next();
});

export default router;