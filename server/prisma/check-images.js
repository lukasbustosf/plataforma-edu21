const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function checkImages() {
  try {
    const activities = await prisma.lab_activity.findMany({
      where: {
        slug: {
          in: [
            'el-habitat-de-los-animales',
            'los-sonidos-magicos-de-los-animales',
            'mi-mascota-es-mi-amiga',
            'de-que-animal-se-trata',
            'la-caja-de-los-sonidos',
            'memorice-de-numeros',
            'mi-mascota-preferida',
            'rimas-y-adivinanzas-con-las-mascotas',
            'donde-viven-los-animales'
          ]
        }
      },
      select: {
        title: true,
        slug: true,
        cover_image_url: true
      },
      orderBy: {
        slug: 'asc'
      }
    });
    
    console.log('📸 Verificando imágenes de actividades 1-9:');
    console.log('');
    
    activities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.title}`);
      console.log(`   Slug: ${activity.slug}`);
      console.log(`   Imagen: ${activity.cover_image_url}`);
      console.log('');
    });
    
    console.log(`✅ Total de actividades verificadas: ${activities.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkImages(); 