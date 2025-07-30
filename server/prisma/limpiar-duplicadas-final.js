const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function limpiarDuplicadasFinal() {
  try {
    console.log('🧹 Limpieza final de actividades duplicadas...\n');

    // Obtener todas las actividades de medios de transporte
    const actividades = await prisma.lab_activity.findMany({
      where: {
        lab_material: {
          name: { contains: 'MEDIOS DE TRANSPORTE' }
        }
      },
      include: {
        lab_material: true
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    console.log(`📋 Encontradas ${actividades.length} actividades de medios de transporte`);

    // Definir las actividades que queremos mantener (las más recientes y completas)
    const actividadesAMantener = [
      "Conociendo los Medios de Transporte",
      "Los sonidos de medios de transporte",
      "¿Cómo es un medio de transporte?",
      "Reconociendo los Medios de Transporte",
      "A viajar y recorrer con los medios de transporte",
      "El Sonido de los Transportes",
      "El viaje del ratoncito Pérez"
    ];

    // Agrupar por título para identificar duplicadas
    const actividadesPorTitulo = {};
    actividades.forEach(actividad => {
      if (!actividadesPorTitulo[actividad.title]) {
        actividadesPorTitulo[actividad.title] = [];
      }
      actividadesPorTitulo[actividad.title].push(actividad);
    });

    // Eliminar duplicadas manteniendo solo la más reciente de cada título
    for (const [titulo, actividadesDelTitulo] of Object.entries(actividadesPorTitulo)) {
      if (actividadesDelTitulo.length > 1) {
        console.log(`🔍 Encontradas ${actividadesDelTitulo.length} actividades con título: "${titulo}"`);
        
        // Ordenar por fecha de creación y mantener solo la más reciente
        const actividadesOrdenadas = actividadesDelTitulo.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        // Eliminar todas excepto la primera (más reciente)
        for (let i = 1; i < actividadesOrdenadas.length; i++) {
          await prisma.lab_activity.delete({
            where: { id: actividadesOrdenadas[i].id }
          });
          console.log(`🗑️ Eliminada actividad duplicada: ${actividadesOrdenadas[i].title} (ID: ${actividadesOrdenadas[i].id})`);
        }
      }
    }

    // Verificar resultado final
    const actividadesFinales = await prisma.lab_activity.findMany({
      where: {
        lab_material: {
          name: { contains: 'MEDIOS DE TRANSPORTE' }
        }
      },
      include: {
        lab_material: true
      },
      orderBy: {
        title: 'asc'
      }
    });

    console.log(`\n✅ Resultado final: ${actividadesFinales.length} actividades únicas`);
    actividadesFinales.forEach((actividad, index) => {
      console.log(`   ${index + 1}. ${actividad.title}`);
    });

    console.log('\n✅ Limpieza final completada!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

limpiarDuplicadasFinal(); 