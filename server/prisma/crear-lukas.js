const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('👤 Creando usuario Lukas Bustos F...');
    
    // Buscar o crear colegio
    let school = await prisma.schools.findUnique({
      where: { school_code: 'DEMO001' }
    });
    
    if (!school) {
      school = await prisma.schools.create({
        data: {
          school_name: 'COLEGIO EDU21',
          school_code: 'DEMO001',
          active: true
        }
      });
      console.log('✅ Colegio creado');
    }
    
    // Verificar si usuario existe
    const existingUser = await prisma.public_users.findUnique({
      where: { email: 'lbustos@edu21.cl' }
    });
    
    if (existingUser) {
      console.log('⚠️ Usuario ya existe');
      return;
    }
    
    // Crear usuario
    const passwordHash = await bcrypt.hash('84788990', 10);
    
    const user = await prisma.public_users.create({
      data: {
        email: 'lbustos@edu21.cl',
        password_hash: passwordHash,
        first_name: 'Lukas',
        last_name: 'Bustos F.',
        role: 'TEACHER',
        school_id: school.school_id,
        phone: '+56948504588',
        rut: '19740319-5',
        active: true,
        email_verified: true
      }
    });
    
    console.log('✅ Usuario creado exitosamente!');
    console.log('📧 Email: lbustos@edu21.cl');
    console.log('🔑 Contraseña: 84788990');
    console.log('🏫 Colegio: COLEGIO EDU21');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 