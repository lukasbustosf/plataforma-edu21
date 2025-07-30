const { PrismaClient } = require('./prisma/generated/prisma');

const prisma = new PrismaClient();

async function verificarActividades() {
  try {
    console.log('🔍 Verificando actividades del laboratorio...\n');
    
    // Verificar todas las actividades
    const actividades = await prisma.lab_activity.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        creator_id: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });
    
    console.log(`📊 Total de actividades encontradas: ${actividades.length}\n`);
    
    if (actividades.length > 0) {
      console.log('📋 Lista de actividades:');
      actividades.forEach((actividad, index) => {
        console.log(`${index + 1}. ${actividad.title} (${actividad.status}) - ID: ${actividad.id}`);
      });
    } else {
      console.log('❌ No se encontraron actividades en la base de datos');
    }
    
    // Verificar usuario Lukas
    const user = await prisma.public_users.findUnique({
      where: { email: 'lbustos@edu21.cl' },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        active: true
      }
    });
    
    console.log('\n👤 Verificando usuario Lukas:');
    if (user) {
      console.log(`✅ Usuario encontrado: ${user.first_name} ${user.last_name}`);
      console.log(`   ID: ${user.user_id}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Activo: ${user.active ? '✅' : '❌'}`);
    } else {
      console.log('❌ Usuario Lukas no encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarActividades(); 