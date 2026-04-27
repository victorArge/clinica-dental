import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';

const routes = [
  { path: '/login', component: () => import('../views/LoginView.vue') },
  { path: '/', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/pacientes', component: () => import('../views/PacientesView.vue'), meta: { requiresAuth: true } },
  { path: '/medicos', component: () => import('../views/MedicosView.vue'), meta: { requiresAuth: true } },
  { path: '/citas', component: () => import('../views/CitasView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)', redirect: '/' }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) next('/login');
  else next();
});

export default router;
