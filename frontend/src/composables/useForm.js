import { ref, reactive, computed } from 'vue';

export function useForm(initialValues = {}, validationRules = {}) {
  const values = reactive({ ...initialValues });
  const errors = reactive({});
  const touched = reactive({});
  const isSubmitting = ref(false);
  const isDirty = ref(false);

  const validate = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';
    for (const rule of rules) {
      const result = rule(value, values);
      if (result !== true) return result;
    }
    return '';
  };

  const validateAll = () => {
    let valid = true;
    for (const key in values) {
      const error = validate(key, values[key]);
      errors[key] = error;
      if (error) valid = false;
    }
    return valid;
  };

  const setFieldValue = (name, value) => {
    values[name] = value;
    isDirty.value = true;
    if (touched[name]) errors[name] = validate(name, value);
  };

  const setFieldTouched = (name) => {
    touched[name] = true;
    errors[name] = validate(name, values[name]);
  };

  const reset = (newValues = initialValues) => {
    Object.assign(values, newValues);
    Object.keys(errors).forEach(k => { errors[k] = ''; });
    Object.keys(touched).forEach(k => { touched[k] = false; });
    isDirty.value = false;
    isSubmitting.value = false;
  };

  const handleSubmit = (fn) => async (e) => {
    e.preventDefault();
    Object.keys(values).forEach(k => { touched[k] = true; });
    if (!validateAll()) return;
    isSubmitting.value = true;
    try { await fn(values); }
    finally { isSubmitting.value = false; }
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    setFieldValue,
    setFieldTouched,
    validateAll,
    reset,
    handleSubmit
  };
}

export const required = (msg = 'Este campo es requerido') => (v) => (v ? true : msg);
export const email = (msg = 'Email inválido') => (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : msg);
export const minLength = (min, msg) => (v) => (v?.length >= min ? true : msg || `Mínimo ${min} caracteres`);
export const maxLength = (max, msg) => (v) => (v?.length <= max ? true : msg || `Máximo ${max} caracteres`);
export const pattern = (regex, msg) => (v) => (regex.test(v) ? true : msg || 'Formato inválido');
