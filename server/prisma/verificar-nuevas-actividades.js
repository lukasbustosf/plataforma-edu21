const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function verificarNuevasActividades() {
  try {
    console.log('🔍 Verificando nuevas actividades de medios de transporte...\n');
    
    // Buscar las 3 nuevas actividades
    const actividades = await prisma.lab_activity.findMany({
      where: {
        OR: [
          { title: { contains: 'A viajar y recorrer' } },
          { title: { contains: 'Sonido de los Transportes' } },
          { title: { contains: 'viaje del ratoncito' } }
        ]
      },
      include: {
        lab_material: true
      }
    });
    
    console.log(`✅ Encontradas ${actividades.length} actividades:`);
    
    actividades.forEach((actividad, index) => {
      console.log(`\n${index + 1}. ${actividad.title}`);
      console.log(`   ID: ${actividad.id}`);
      console.log(`   Slug: ${actividad.slug}`);
      console.log(`   Material: ${actividad.lab_material?.name || 'Sin material'}`);
      console.log(`   Recursos: ${actividad.resource_urls?.length || 0} URLs`);
      console.log(`   Imagen: ${actividad.cover_image_url ? '✅' : '❌'}`);
    });
    
    // Verificar materiales
    console.log('\n🔧 Verificando materiales...');
    const materiales = await prisma.lab_material.findMany({
      where: {
        name: { contains: 'MEDIOS DE TRANSPORTE' }
      }
    });
    
    console.log(`✅ Encontrados ${materiales.length} materiales de medios de transporte:`);
    materiales.forEach((material, index) => {
      console.log(`   ${index + 1}. ${material.name} (ID: ${material.id})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarNuevasActividades(); 