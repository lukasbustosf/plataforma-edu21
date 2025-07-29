const axios = require('axios');

async function testLabRoutes() {
  console.log('🧪 Probando rutas del laboratorio...\n');

  try {
    // Test materials
    console.log('1️⃣ Probando /api/lab/materials...');
    const materialsResponse = await axios.get('http://localhost:5000/api/lab/materials', {
      headers: {
        'Authorization': 'Bearer demo-token-teacher-123'
      }
    });
    console.log('✅ Materials:', materialsResponse.status, materialsResponse.data?.data?.length || 0, 'items');

    // Test activities
    console.log('\n2️⃣ Probando /api/lab/activities...');
    const activitiesResponse = await axios.get('http://localhost:5000/api/lab/activities', {
      headers: {
        'Authorization': 'Bearer demo-token-teacher-123'
      }
    });
    console.log('✅ Activities:', activitiesResponse.status, activitiesResponse.data?.data?.length || 0, 'items');

    console.log('\n🎉 ¡Todas las pruebas pasaron!');
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.data?.error?.message || error.message);
  }
}

testLabRoutes(); 