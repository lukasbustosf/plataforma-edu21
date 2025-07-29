const axios = require('axios');

async function testSpecificActivity() {
  console.log('🧪 Probando actividad específica...\n');

  try {
    // 1. Obtener todas las actividades
    console.log('1️⃣ Obteniendo todas las actividades...');
    const activitiesResponse = await axios.get('http://localhost:5000/api/lab/activities', {
      headers: {
        'Authorization': 'Bearer demo-token-teacher-123'
      }
    });
    
    const activities = activitiesResponse.data?.data || [];
    console.log(`✅ Encontradas ${activities.length} actividades`);
    
    // 2. Buscar la actividad específica
    const targetSlug = 'reconociendo-los-medios-de-transporte';
    const targetActivity = activities.find(activity => activity.slug === targetSlug);
    
    if (targetActivity) {
      console.log(`\n2️⃣ Actividad encontrada:`);
      console.log(`   Título: ${targetActivity.title}`);
      console.log(`   Slug: ${targetActivity.slug}`);
      console.log(`   ID: ${targetActivity.id}`);
      
      // 3. Probar obtener la actividad específica por slug
      console.log('\n3️⃣ Probando endpoint de actividad específica por slug...');
      const specificResponse = await axios.get(`http://localhost:5000/api/lab/activities/${targetSlug}`, {
        headers: {
          'Authorization': 'Bearer demo-token-teacher-123'
        }
      });
      
      console.log('✅ Actividad específica obtenida:', specificResponse.status);
      console.log('   Título:', specificResponse.data?.data?.title);
      console.log('   Descripción:', specificResponse.data?.data?.description?.substring(0, 50) + '...');
      
    } else {
      console.log(`\n❌ No se encontró la actividad con slug: ${targetSlug}`);
      console.log('Slugs disponibles:');
      activities.forEach(activity => {
        console.log(`   - ${activity.slug}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.data?.error?.message || error.message);
  }
}

testSpecificActivity(); 