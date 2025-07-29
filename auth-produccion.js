
// Script de autenticación para producción
// Ejecutar en la consola del navegador

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibW9jay10ZWFjaGVyLWlkIiwic2Nob29sX2lkIjoibW9jay1zY2hvb2wtaWQiLCJyb2xlIjoiVEVBQ0hFUiIsImVtYWlsIjoidGVhY2hlckBkZW1vLmVkdTIxLmNsIiwiaWF0IjoxNzUzNzg4NTMxLCJleHAiOjE3NTQzOTMzMzF9.ojetTZKid9yhsNklMzykiizlRuwhHdyX01MBe77iQTs';

const userData = {
  user_id: 'mock-teacher-id',
  school_id: 'mock-school-id',
  email: 'teacher@demo.edu21.cl',
  first_name: 'Profesor',
  last_name: 'Demo',
  role: 'TEACHER',
  active: true,
  schools: {
    school_id: 'mock-school-id',
    school_name: 'Colegio Demo EDU21',
    school_code: 'DEMO001',
    active: true
  }
};

// Limpiar localStorage anterior
localStorage.clear();

// Configurar nueva autenticación
localStorage.setItem('auth_token', token);
localStorage.setItem('user_data', JSON.stringify(userData));

console.log('✅ Autenticación configurada para producción');
console.log('👤 Usuario:', userData.first_name + ' ' + userData.last_name);
console.log('🏫 Escuela:', userData.schools.school_name);
console.log('🔄 Recargando página...');

// Recargar página
setTimeout(() => {
  window.location.reload();
}, 1000);
