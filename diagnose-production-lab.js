const axios = require('axios');

console.log('🔍 Diagnóstico de Laboratorio en Producción');
console.log('==========================================');

const PRODUCTION_URL = 'https://plataforma-edu21-production.up.railway.app';
const VERCEL_URL = 'https://plataforma-edu21.vercel.app';

// Token de desarrollo para pruebas
const demoToken = 'demo-token-teacher-550e8400-e29b-41d4-a716-446655440001';

async function testProductionEndpoints() {
  console.log('\n📡 Probando endpoints de producción...');
  
  try {
    // 1. Probar endpoint de salud del servidor
    console.log('\n1️⃣ Probando /health...');
    const healthResponse = await axios.get(`${PRODUCTION_URL}/health`, { timeout: 10000 });
    console.log('✅ Servidor respondiendo:', healthResponse.status);
    console.log('📊 Datos:', healthResponse.data);

    // 2. Probar autenticación
    console.log('\n2️⃣ Probando autenticación...');
    const authResponse = await axios.get(`${PRODUCTION_URL}/api/auth/status`, {
      headers: { Authorization: `Bearer ${demoToken}` },
      timeout: 10000
    });
    console.log('✅ Autenticación exitosa:', authResponse.status);
    console.log('👤 Usuario:', authResponse.data);

    // 3. Probar materiales del laboratorio
    console.log('\n3️⃣ Probando /api/lab/materials...');
    const materialsResponse = await axios.get(`${PRODUCTION_URL}/api/lab/materials`, {
      headers: { Authorization: `Bearer ${demoToken}` },
      timeout: 10000
    });
    console.log('✅ Materiales obtenidos:', materialsResponse.status);
    console.log('📦 Cantidad de materiales:', materialsResponse.data.length || 'N/A');

    // 4. Probar actividades del laboratorio
    console.log('\n4️⃣ Probando /api/lab/activities...');
    const activitiesResponse = await axios.get(`${PRODUCTION_URL}/api/lab/activities`, {
      headers: { Authorization: `Bearer ${demoToken}` },
      timeout: 10000
    });
    console.log('✅ Actividades obtenidas:', activitiesResponse.status);
    console.log('🎯 Cantidad de actividades:', activitiesResponse.data.length || 'N/A');

    // 5. Probar CORS
    console.log('\n5️⃣ Probando CORS...');
    const corsResponse = await axios.get(`${PRODUCTION_URL}/api/lab/activities`, {
      headers: { 
        Authorization: `Bearer ${demoToken}`,
        'Origin': VERCEL_URL
      },
      timeout: 10000
    });
    console.log('✅ CORS funcionando:', corsResponse.status);

    console.log('\n🎉 Todos los endpoints funcionan correctamente en producción!');
    console.log('🔍 El problema puede estar en:');
    console.log('   - Configuración de CORS en Railway');
    console.log('   - Variables de entorno en Vercel');
    console.log('   - Configuración de red entre Vercel y Railway');

  } catch (error) {
    console.log('\n❌ Error encontrado:');
    console.log('🔍 Tipo de error:', error.code || 'HTTP Error');
    console.log('📊 Status:', error.response?.status);
    console.log('📝 Mensaje:', error.message);
    console.log('🔗 URL:', error.config?.url);
    
    if (error.response) {
      console.log('📄 Respuesta del servidor:', error.response.data);
    }

    // Sugerencias de solución
    console.log('\n💡 Posibles soluciones:');
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('   - Verificar que Railway esté funcionando');
      console.log('   - Verificar URL de producción');
    } else if (error.response?.status === 401) {
      console.log('   - Problema de autenticación');
      console.log('   - Verificar token de desarrollo');
    } else if (error.response?.status === 403) {
      console.log('   - Problema de CORS');
      console.log('   - Verificar configuración de ALLOWED_ORIGINS');
    } else if (error.response?.status === 404) {
      console.log('   - Endpoint no encontrado');
      console.log('   - Verificar rutas del servidor');
    }
  }
}

async function testVercelFrontend() {
  console.log('\n🌐 Probando frontend de Vercel...');
  
  try {
    const response = await axios.get(VERCEL_URL, { timeout: 10000 });
    console.log('✅ Frontend de Vercel funcionando:', response.status);
  } catch (error) {
    console.log('❌ Error en frontend de Vercel:', error.message);
  }
}

async function checkEnvironmentVariables() {
  console.log('\n🔧 Verificando variables de entorno...');
  
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'NODE_ENV',
    'ALLOWED_ORIGINS'
  ];

  console.log('📋 Variables requeridas en Railway:');
  requiredVars.forEach(varName => {
    console.log(`   - ${varName}: ${process.env[varName] ? '✅ Configurada' : '❌ Faltante'}`);
  });
}

async function main() {
  console.log('🚀 Iniciando diagnóstico completo...');
  
  await testProductionEndpoints();
  await testVercelFrontend();
  await checkEnvironmentVariables();
  
  console.log('\n📋 Resumen del diagnóstico:');
  console.log('============================');
  console.log('1. Si todos los endpoints funcionan: problema en frontend');
  console.log('2. Si hay errores 401: problema de autenticación');
  console.log('3. Si hay errores 403: problema de CORS');
  console.log('4. Si hay errores 404: problema de rutas');
  console.log('5. Si hay errores de conexión: problema de red');
  
  console.log('\n🔧 Próximos pasos:');
  console.log('1. Verificar configuración de CORS en Railway');
  console.log('2. Verificar variables de entorno en Railway');
  console.log('3. Verificar configuración de red entre Vercel y Railway');
  console.log('4. Revisar logs del servidor en Railway');
}

main().catch(console.error); 