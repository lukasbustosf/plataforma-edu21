
// Script para verificar configuración de producción
// Ejecutar en la consola del navegador

console.log('🔍 Verificando configuración de producción...');

// Verificar localStorage
const token = localStorage.getItem('auth_token');
const userData = localStorage.getItem('user_data');

console.log('Token configurado:', token ? '✅ Sí' : '❌ No');
console.log('Datos de usuario:', userData ? '✅ Sí' : '❌ No');

// Verificar variable de entorno
console.log('API URL configurada:', process.env.NEXT_PUBLIC_API_URL || '❌ No configurada');

// Probar conexión directa
fetch('https://plataforma-edu21-production.up.railway.app/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Servidor de producción responde:', data);
  })
  .catch(error => {
    console.log('❌ Error conectando a producción:', error.message);
  });

// Probar endpoint de laboratorio con token
if (token) {
  fetch('https://plataforma-edu21-production.up.railway.app/api/lab/materials', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    console.log('✅ Laboratorio responde:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📦 Materiales obtenidos:', data.length || 'N/A');
  })
  .catch(error => {
    console.log('❌ Error en laboratorio:', error.message);
  });
}
