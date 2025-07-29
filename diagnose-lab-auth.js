const axios = require('axios');

// Configuración
const LOCAL_API_URL = 'http://localhost:5000';
const PRODUCTION_API_URL = 'https://edu21-server-production.up.railway.app';

async function testAuth(endpoint, apiUrl, description) {
  console.log(`\n🔍 Probando ${description}:`);
  console.log(`URL: ${apiUrl}${endpoint}`);
  
  try {
    // Test 1: Sin token
    console.log('\n1️⃣ Sin token:');
    const response1 = await axios.get(`${apiUrl}${endpoint}`);
    console.log('✅ Status:', response1.status);
    console.log('📊 Data:', response1.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data?.error?.message || error.message);
  }

  try {
    // Test 2: Con token demo
    console.log('\n2️⃣ Con token demo:');
    const response2 = await axios.get(`${apiUrl}${endpoint}`, {
      headers: {
        'Authorization': 'Bearer demo-token-teacher-123'
      }
    });
    console.log('✅ Status:', response2.status);
    console.log('📊 Data count:', response2.data?.data?.length || 'No data');
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data?.error?.message || error.message);
  }

  try {
    // Test 3: Con token demo admin
    console.log('\n3️⃣ Con token demo admin:');
    const response3 = await axios.get(`${apiUrl}${endpoint}`, {
      headers: {
        'Authorization': 'Bearer demo-token-admin-789'
      }
    });
    console.log('✅ Status:', response3.status);
    console.log('📊 Data count:', response3.data?.data?.length || 'No data');
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data?.error?.message || error.message);
  }
}

async function diagnoseLabAuth() {
  console.log('🚀 DIAGNÓSTICO DE AUTENTICACIÓN DEL LABORATORIO');
  console.log('=' .repeat(60));

  // Test materials endpoint
  await testAuth('/api/lab/materials', LOCAL_API_URL, 'MATERIALES (LOCAL)');
  await testAuth('/api/lab/materials', PRODUCTION_API_URL, 'MATERIALES (PRODUCCIÓN)');

  // Test activities endpoint
  await testAuth('/api/lab/activities', LOCAL_API_URL, 'ACTIVIDADES (LOCAL)');
  await testAuth('/api/lab/activities', PRODUCTION_API_URL, 'ACTIVIDADES (PRODUCCIÓN)');

  console.log('\n🎯 RESUMEN:');
  console.log('- Si LOCAL funciona pero PRODUCCIÓN no: problema de configuración de producción');
  console.log('- Si ambos fallan: problema de autenticación general');
  console.log('- Si ambos funcionan: problema del frontend');
}

diagnoseLabAuth().catch(console.error); 