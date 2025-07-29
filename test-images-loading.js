const fetch = require('node-fetch');

console.log('🖼️ VERIFICANDO CARGA DE IMÁGENES');
console.log('=' .repeat(50));

async function testImageLoading() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // 1. Verificar que el servidor esté corriendo
    console.log('🔍 Verificando servidor...');
    const serverResponse = await fetch(`${baseUrl}/api/lab/activities`);
    
    if (!serverResponse.ok) {
      console.log('❌ Servidor no responde correctamente');
      return;
    }
    
    console.log('✅ Servidor respondiendo correctamente');
    
    // 2. Obtener lista de actividades
    const activities = await serverResponse.json();
    console.log(`📋 Encontradas ${activities.length} actividades`);
    
    // 3. Verificar imágenes de cada actividad
    for (const activity of activities) {
      console.log(`\n🖼️ Verificando: ${activity.title}`);
      console.log(`   URL: ${activity.cover_image_url}`);
      
      if (activity.cover_image_url && activity.cover_image_url.includes('i.ibb.co')) {
        console.log('   ✅ URL de imagen válida (i.ibb.co)');
        
        // Verificar que la imagen se puede cargar
        try {
          const imageResponse = await fetch(activity.cover_image_url);
          if (imageResponse.ok) {
            console.log('   ✅ Imagen se carga correctamente');
          } else {
            console.log('   ❌ Imagen no se puede cargar');
          }
        } catch (error) {
          console.log('   ❌ Error al cargar imagen:', error.message);
        }
      } else {
        console.log('   ❌ URL de imagen inválida o faltante');
      }
    }
    
    // 4. Probar una actividad específica
    console.log('\n🎯 Probando actividad específica...');
    const specificActivity = await fetch(`${baseUrl}/api/lab/activities/rimas-y-adivinanzas-con-las-mascotas`);
    
    if (specificActivity.ok) {
      const activityData = await specificActivity.json();
      console.log(`✅ Actividad específica cargada: ${activityData.title}`);
      console.log(`   Imagen: ${activityData.cover_image_url}`);
    } else {
      console.log('❌ Error al cargar actividad específica');
    }
    
  } catch (error) {
    console.error('❌ Error en la verificación:', error.message);
  }
}

testImageLoading(); 