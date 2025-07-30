const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function verificarActividadesFaltantes() {
  try {
    console.log('🔍 Verificando actividades de medios de transporte...\n');
    
    // Lista de actividades que deberían estar
    const actividadesEsperadas = [
      "Conociendo los Medios de Transporte",
      "Los sonidos de medios de transporte", 
      "¿Cómo es un medio de transporte?",
      "Reconociendo los Medios de Transporte",
      "A viajar y recorrer con los medios de transporte",
      "El Sonido de los Transportes",
      "El viaje del ratoncito Pérez"
    ];
    
    // Buscar todas las actividades de medios de transporte
    const actividades = await prisma.lab_activity.findMany({
      where: {
        lab_material: {
          name: { contains: 'MEDIOS DE TRANSPORTE' }
        }
      },
      include: {
        lab_material: true
      }
    });
    
    console.log(`✅ Actividades encontradas en BD: ${actividades.length}`);
    actividades.forEach((act, index) => {
      console.log(`   ${index + 1}. ${act.title}`);
    });
    
    console.log('\n📋 Actividades esperadas:');
    actividadesEsperadas.forEach((act, index) => {
      console.log(`   ${index + 1}. ${act}`);
    });
    
    // Verificar cuáles faltan
    console.log('\n❌ Actividades faltantes:');
    const actividadesEncontradas = actividades.map(a => a.title);
    const faltantes = actividadesEsperadas.filter(esperada => 
      !actividadesEncontradas.some(encontrada => 
        encontrada.toLowerCase().includes(esperada.toLowerCase().replace('¿', '').replace('?', '')) ||
        esperada.toLowerCase().includes(encontrada.toLowerCase())
      )
    );
    
    if (faltantes.length === 0) {
      console.log('   ✅ Todas las actividades están presentes');
    } else {
      faltantes.forEach((act, index) => {
        console.log(`   ${index + 1}. ${act}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarActividadesFaltantes(); 