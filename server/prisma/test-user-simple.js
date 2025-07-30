const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión
    const userCount = await prisma.public_users.count();
    console.log(`✅ Conexión exitosa. Usuarios en BD: ${userCount}`);
    
    // Listar usuarios
    const users = await prisma.public_users.findMany({
      include: {
        schools: true
      }
    });
    
    console.log('\n📋 Usuarios encontrados:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Colegio: ${user.schools?.school_name || 'Sin colegio'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 