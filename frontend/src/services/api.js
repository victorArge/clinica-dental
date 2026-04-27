const API_URL = '/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error de autenticación');
  }
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
}

export async function getMedicos() {
  const res = await fetch(`${API_URL}/medicos`, { headers: authHeaders() });
  if (!res.ok) throw new Error('No se pudieron cargar los médicos');
  return res.json();
}

export async function createMedico(data) {
  const res = await fetch(`${API_URL}/medicos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear médico');
  return res.json();
}

export async function updateMedico(id, data) {
  const res = await fetch(`${API_URL}/medicos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar médico');
  return res.json();
}

export async function deleteMedico(id) {
  const res = await fetch(`${API_URL}/medicos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar médico');
}

export async function getPacientes() {
  const res = await fetch(`${API_URL}/pacientes`, { headers: authHeaders() });
  if (!res.ok) throw new Error('No se pudieron cargar los pacientes');
  return res.json();
}

export async function createPaciente(data) {
  const res = await fetch(`${API_URL}/pacientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear paciente');
  return res.json();
}

export async function updatePaciente(id, data) {
  const res = await fetch(`${API_URL}/pacientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar paciente');
  return res.json();
}

export async function deletePaciente(id) {
  const res = await fetch(`${API_URL}/pacientes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar paciente');
}

export async function getCitas() {
  const res = await fetch(`${API_URL}/citas`, { headers: authHeaders() });
  if (!res.ok) throw new Error('No se pudieron cargar las citas');
  return res.json();
}

export async function createCita(data) {
  const res = await fetch(`${API_URL}/citas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear cita');
  return res.json();
}

export async function updateCita(id, data) {
  const res = await fetch(`${API_URL}/citas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar cita');
  return res.json();
}

export async function deleteCita(id) {
  const res = await fetch(`${API_URL}/citas/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar cita');
}