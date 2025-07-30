const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function verificarLukas() {
  try {
    console.log('🔍 Verificando usuario Lukas Bustos F...\n');
    
    const user = await prisma.public_users.findUnique({
      where: { email: 'lbustos@edu21.cl' },
      include: {
        schools: true
      }
    });
    
    if (user) {
      console.log('✅ Usuario encontrado:');
      console.log(`   ID: ${user.user_id}`);
      console.log(`   Nombre: ${user.first_name} ${user.last_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Teléfono: ${user.phone}`);
      console.log(`   RUT: ${user.rut}`);
      console.log(`   Activo: ${user.active ? '✅' : '❌'}`);
      console.log(`   Colegio: ${user.schools?.school_name || 'Sin colegio'}`);
      console.log(`   Creado: ${user.created_at}`);
    } else {
      console.log('❌ Usuario no encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarLukas(); 