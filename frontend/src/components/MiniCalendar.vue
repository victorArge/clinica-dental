<template>
  <div class="mini-calendar">
    <div class="calendar-header">
      <button @click="prevMonth" class="nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="month-year">{{ monthYearLabel }}</span>
      <button @click="nextMonth" class="nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
    <div class="weekdays">
      <span v-for="d in weekdays" :key="d">{{ d }}</span>
    </div>
    <div class="days">
      <span v-for="n in firstDayOffset" :key="'empty-' + n" class="empty"></span>
      <button
        v-for="day in daysInMonth"
        :key="day"
        :class="['day', { selected: isSelected(day), today: isToday(day), 'has-appointment': hasAppointment(day) }]"
        @click="selectDay(day)"
      >
        {{ day }}
        <span v-if="hasAppointment(day)" class="dot"></span>
      </button>
    </div>
    <div v-if="selectedDate" class="time-slots">
      <p class="time-label">Horarios disponibles para el {{ selectedDateLabel }}</p>
      <div class="slots-grid">
        <button
          v-for="slot in timeSlots"
          :key="slot.time"
          :class="['slot', { selected: isSlotSelected(slot.time), unavailable: slot.unavailable }]"
          :disabled="slot.unavailable"
          @click="selectSlot(slot)"
        >
          {{ slot.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: String,
  appointments: { type: Array, default: () => [] },
  medicoId: { type: String, default: null }
});

const emit = defineEmits(['update:modelValue']);

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDay = ref(today.getDate());
const selectedTime = ref(null);

const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const monthYearLabel = computed(() => `${monthNames[currentMonth.value]} ${currentYear.value}`);

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate());

const firstDayOffset = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay());

const selectedDate = computed(() => {
  if (!selectedDay.value) return null;
  return new Date(currentYear.value, currentMonth.value, selectedDay.value);
});

const selectedDateLabel = computed(() => {
  if (!selectedDate.value) return '';
  return selectedDate.value.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
});

const timeSlots = computed(() => {
  const slots = [];
  const relevantAppointments = props.medicoId
    ? props.appointments.filter(a => a.medico_id === props.medicoId)
    : props.appointments;

  const bookedHours = relevantAppointments
    .filter(a => {
      const d = new Date(a.fecha_hora);
      return d.getFullYear() === currentYear.value && d.getMonth() === currentMonth.value && d.getDate() === selectedDay.value;
    })
    .map(a => new Date(a.fecha_hora).getHours());

  for (let h = 8; h <= 18; h++) {
    const time = `${h.toString().padStart(2, '0')}:00`;
    slots.push({
      time,
      label: time,
      unavailable: bookedHours.includes(h)
    });
  }
  return slots;
});

const isSelected = (day) => day === selectedDay.value && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
const isToday = (day) => day === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
const isSlotSelected = (time) => time === selectedTime.value;
const hasAppointment = (day) => props.appointments.some(a => {
  const d = new Date(a.fecha_hora);
  return d.getFullYear() === currentYear.value && d.getMonth() === currentMonth.value && d.getDate() === day;
});

const prevMonth = () => {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value--; }
  else currentMonth.value--;
};

const nextMonth = () => {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++; }
  else currentMonth.value++;
};

const selectDay = (day) => { selectedDay.value = day; selectedTime.value = null; };

const selectSlot = (slot) => {
  if (slot.unavailable) return;
  selectedTime.value = slot.time;
  const dateTime = new Date(currentYear.value, currentMonth.value, selectedDay.value, parseInt(slot.time));
  emit('update:modelValue', dateTime.toISOString().slice(0, 16));
};

watch(() => props.modelValue, (val) => {
  if (val) {
    const d = new Date(val);
    currentMonth.value = d.getMonth();
    currentYear.value = d.getFullYear();
    selectedDay.value = d.getDate();
    selectedTime.value = `${d.getHours().toString().padStart(2, '0')}:00`;
  }
});
</script>

<style scoped>
.mini-calendar {
  background: rgba(2, 6, 23, 0.8);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 320px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.month-year { font-weight: 600; color: var(--text); font-size: 14px; }
.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-btn:hover { background: rgba(255, 255, 255, 0.2); }
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 6px;
  text-align: center;
}
.weekdays span {
  font-size: 10px;
  color: var(--muted);
  font-weight: 600;
  padding: 2px;
}
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-size: 12px;
  position: relative;
  transition: all 0.2s;
  padding: 2px;
}
.day:hover { background: rgba(255, 255, 255, 0.1); }
.day.selected { background: var(--primary); color: #0b1020; font-weight: 600; }
.day.today { border: 1px solid var(--primary); }
.day.empty { pointer-events: none; }
.day .dot {
  position: absolute;
  bottom: 1px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--danger);
}
.time-slots {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.time-label {
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 8px;
}
.slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.slot {
  padding: 6px 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.slot:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
.slot.selected { background: var(--primary); color: #0b1020; border-color: var(--primary); }
.slot.unavailable { opacity: 0.3; cursor: not-allowed; text-decoration: line-through; }

@media (max-width: 480px) {
  .mini-calendar { max-width: 100%; padding: 10px; }
  .slots-grid { grid-template-columns: repeat(3, 1fr); }
  .day { font-size: 11px; }
}
</style>