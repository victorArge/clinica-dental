import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value ? `${user.value.nombre} ${user.value.apellido}` : 'Usuario');
  const userRole = computed(() => user.value?.rol || null);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      token.value = res.data.token;
      user.value = res.data.usuario;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.usuario));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error de conexión';
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post('/api/auth/register', data);
      token.value = res.data.token;
      user.value = res.data.usuario;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.usuario));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error de conexión';
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const verifyToken = async () => {
    if (!token.value) return false;
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      const res = await axios.get('/api/auth/verify');
      user.value = res.data;
      return true;
    } catch {
      logout();
      return false;
    }
  };

  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  return { token, user, isAuthenticated, userName, userRole, login, register, logout, verifyToken };
});