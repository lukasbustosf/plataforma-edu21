const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando Vercel para Producción');
console.log('======================================');

// Configuración para producción
const productionConfig = {
  client: {
    NEXT_PUBLIC_API_URL: 'https://plataforma-edu21-production.up.railway.app'
  }
};

// Crear archivo .env.local para el cliente
const clientEnvPath = path.join(__dirname, 'client', '.env.local');
const clientEnvContent = `NEXT_PUBLIC_API_URL=${productionConfig.client.NEXT_PUBLIC_API_URL}`;

fs.writeFileSync(clientEnvPath, clientEnvContent);

console.log('✅ Archivo .env.local creado en cliente:');
console.log(`📋 Contenido: ${clientEnvContent}`);

// Crear script para verificar configuración
const verificationScript = `
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
      'Authorization': \`Bearer \${token}\`
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
`;

fs.writeFileSync('verificar-produccion.js', verificationScript);

console.log('\n📋 Instrucciones para solucionar:');
console.log('==================================');
console.log('');
console.log('1. 🔧 Configurar Vercel:');
console.log('   - Ve a https://vercel.com/dashboard');
console.log('   - Selecciona tu proyecto');
console.log('   - Ve a Settings > Environment Variables');
console.log('   - Agrega: NEXT_PUBLIC_API_URL = https://plataforma-edu21-production.up.railway.app');
console.log('');
console.log('2. 🔄 Re-deploy:');
console.log('   - Haz un commit y push a GitHub');
console.log('   - Vercel se desplegará automáticamente');
console.log('');
console.log('3. 🧪 Probar:');
console.log('   - Ve a tu aplicación de Vercel');
console.log('   - Abre la consola (F12)');
console.log('   - Ejecuta el contenido de verificar-produccion.js');
console.log('');
console.log('4. 🔐 Configurar autenticación:');
console.log('   - Usa el script production-token-script.js');
console.log('   - O ejecuta el código de autenticación manualmente');

// Crear script de autenticación mejorado
const authScript = `
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
`;

fs.writeFileSync('auth-produccion.js', authScript);

console.log('\n✅ Scripts creados:');
console.log('   - verificar-produccion.js (para diagnosticar)');
console.log('   - auth-produccion.js (para autenticación)');
console.log('   - .env.local configurado en cliente');

console.log('\n🎯 Próximos pasos:');
console.log('1. Configurar NEXT_PUBLIC_API_URL en Vercel');
console.log('2. Hacer deploy');
console.log('3. Usar auth-produccion.js para autenticación');
console.log('4. Probar actividades del laboratorio'); 