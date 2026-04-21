import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import PacientesView from '../views/PacientesView.vue';
import MedicosView from '../views/MedicosView.vue';
import CitasView from '../views/CitasView.vue';

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/pacientes', component: PacientesView, meta: { requiresAuth: true } },
  { path: '/medicos', component: MedicosView, meta: { requiresAuth: true } },
  { path: '/citas', component: CitasView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.)', redirect: '/' },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  const isAuth = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuth) next('/login');
  else next();
});

export default router;