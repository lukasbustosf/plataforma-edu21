const fetch = require('node-fetch');

async function testActividadesAPI() {
  try {
    console.log('🔍 Probando API de actividades del laboratorio...\n');
    
    // Primero obtener un token de autenticación (simular login)
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'lbustos@edu21.cl',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Error en login:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    console.log('✅ Login exitoso');
    
    // Probar la API de actividades
    const actividadesResponse = await fetch('http://localhost:5000/api/lab/activities', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!actividadesResponse.ok) {
      console.log('❌ Error al obtener actividades:', await actividadesResponse.text());
      return;
    }
    
    const actividadesData = await actividadesResponse.json();
    
    console.log('📊 Respuesta de la API:');
    console.log('Success:', actividadesData.success);
    console.log('Total actividades:', actividadesData.data?.length || 0);
    
    if (actividadesData.data && actividadesData.data.length > 0) {
      console.log('\n📋 Actividades encontradas:');
      actividadesData.data.forEach((actividad, index) => {
        console.log(`${index + 1}. ${actividad.title} (${actividad.status})`);
      });
    } else {
      console.log('\n❌ No se encontraron actividades');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testActividadesAPI(); 