import { ref, computed } from 'vue';

export function useFetch(fetchFn, options = {}) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const execute = async (...args) => {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fetchFn(...args);
    } catch (e) {
      error.value = e.message || 'Error desconocido';
    } finally {
      loading.value = false;
    }
  };

  const reset = () => { data.value = null; error.value = null; loading.value = false; };

  return { data, error, loading, execute, reset };
}
