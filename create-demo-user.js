const axios = require('axios');

async function createDemoUser() {
  try {
    console.log('🔐 Creando usuario demo...');
    
    // Datos del usuario demo
    const demoUser = {
      email: 'teacher@demo.edu21.cl',
      password: 'demo123',
      first_name: 'Profesor',
      last_name: 'Demo',
      role: 'TEACHER',
      school_code: 'DEMO001'
    };

    // Intentar registrar el usuario
    console.log('📝 Registrando usuario demo...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', demoUser);
    
    if (registerResponse.data.token) {
      console.log('✅ Usuario demo creado exitosamente');
      console.log('🔑 Token:', registerResponse.data.token);
      console.log('👤 Usuario:', registerResponse.data.user);
      return registerResponse.data.token;
    }
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️ Usuario demo ya existe, intentando login...');
      
      // Intentar login con el usuario existente
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'teacher@demo.edu21.cl',
        password: 'demo123'
      });
      
      if (loginResponse.data.token) {
        console.log('✅ Login exitoso');
        console.log('🔑 Token:', loginResponse.data.token);
        console.log('👤 Usuario:', loginResponse.data.user);
        return loginResponse.data.token;
      }
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  }
}

async function testLabEndpoints(token) {
  if (!token) {
    console.log('❌ No hay token disponible');
    return;
  }

  console.log('\n🧪 Probando endpoints de laboratorio...');
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Probar endpoint de actividades
    console.log('📋 Probando /api/lab/activities...');
    const activitiesResponse = await axios.get('http://localhost:5000/api/lab/activities', { headers });
    console.log('✅ Actividades:', activitiesResponse.data);

    // Probar endpoint de materiales
    console.log('🔬 Probando /api/lab/materials...');
    const materialsResponse = await axios.get('http://localhost:5000/api/lab/materials', { headers });
    console.log('✅ Materiales:', materialsResponse.data);

  } catch (error) {
    console.error('❌ Error en endpoints:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando configuración de usuario demo...\n');
  
  const token = await createDemoUser();
  await testLabEndpoints(token);
  
  console.log('\n📝 Para usar en el frontend:');
  console.log('1. Abre las herramientas de desarrollador (F12)');
  console.log('2. Ve a la pestaña Application/Storage');
  console.log('3. En localStorage, agrega:');
  console.log('   Key: auth_token');
  console.log(`   Value: ${token}`);
  console.log('\n4. Recarga la página');
}

main().catch(console.error); 