const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function verificarTodasActividades() {
  try {
    console.log('🔍 Verificando todas las actividades en la base de datos...\n');
    
    // Buscar todas las actividades
    const actividades = await prisma.lab_activity.findMany({
      include: {
        lab_material: true
      },
      orderBy: {
        title: 'asc'
      }
    });
    
    console.log(`✅ Total de actividades encontradas: ${actividades.length}\n`);
    
    // Mostrar las últimas 10 actividades
    const ultimasActividades = actividades.slice(-10);
    
    console.log('📋 Últimas 10 actividades:');
    ultimasActividades.forEach((actividad, index) => {
      console.log(`\n${index + 1}. ${actividad.title}`);
      console.log(`   ID: ${actividad.id}`);
      console.log(`   Slug: ${actividad.slug}`);
      console.log(`   Material: ${actividad.lab_material?.name || 'Sin material'}`);
      console.log(`   Recursos: ${actividad.resource_urls?.length || 0} URLs`);
      console.log(`   Imagen: ${actividad.cover_image_url ? '✅' : '❌'}`);
    });
    
    // Buscar específicamente actividades de medios de transporte
    console.log('\n🚗 Actividades de medios de transporte:');
    const actividadesTransporte = actividades.filter(act => 
      act.title.toLowerCase().includes('transporte') || 
      act.title.toLowerCase().includes('transportes') ||
      act.title.toLowerCase().includes('viajar')
    );
    
    actividadesTransporte.forEach((actividad, index) => {
      console.log(`\n${index + 1}. ${actividad.title}`);
      console.log(`   ID: ${actividad.id}`);
      console.log(`   Slug: ${actividad.slug}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarTodasActividades(); 