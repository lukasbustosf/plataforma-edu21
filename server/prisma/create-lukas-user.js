const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createLukasUser() {
  try {
    console.log('👤 Creando usuario Lukas Bustos F. en EDU21...\n');

    // Datos específicos de Lukas Bustos F.
    const userData = {
      email: 'lbustos@edu21.cl',
      password: '84788990',
      first_name: 'Lukas',
      last_name: 'Bustos F.',
      role: 'TEACHER',
      school_code: 'DEMO001',
      school_name: 'COLEGIO EDU21',
      phone: '+56948504588',
      rut: '19740319-5'
    };

    // 1. Verificar si el colegio existe, si no, crearlo
    let school = await prisma.schools.findUnique({
      where: { school_code: userData.school_code }
    });

    if (!school) {
      console.log(`🏫 Creando colegio: ${userData.school_name}`);
      school = await prisma.schools.create({
        data: {
          school_name: userData.school_name,
          school_code: userData.school_code,
          address: 'Dirección del COLEGIO EDU21',
          phone: '+56987654321',
          email: 'contacto@edu21.cl',
          region: 'Metropolitana',
          comuna: 'Santiago',
          school_type: 'particular',
          active: true
        }
      });
      console.log(`✅ Colegio creado: ${school.school_name} (ID: ${school.school_id})`);
    } else {
      console.log(`✅ Colegio encontrado: ${school.school_name} (ID: ${school.school_id})`);
    }

    // 2. Verificar si el usuario ya existe
    const existingUser = await prisma.public_users.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      console.log(`⚠️  El usuario ${userData.email} ya existe`);
      console.log(`   ID: ${existingUser.user_id}`);
      console.log(`   Rol: ${existingUser.role}`);
      console.log(`   Colegio: ${school.school_name}`);
      return;
    }

    // 3. Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // 4. Crear el usuario
    const newUser = await prisma.public_users.create({
      data: {
        email: userData.email,
        password_hash: passwordHash,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        school_id: school.school_id,
        phone: userData.phone,
        rut: userData.rut,
        active: true,
        email_verified: true,
        permissions: {},
        role_permissions: {}
      }
    });

    console.log(`✅ Usuario Lukas Bustos F. creado exitosamente!`);
    console.log(`   ID: ${newUser.user_id}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Nombre: ${newUser.first_name} ${newUser.last_name}`);
    console.log(`   Rol: ${newUser.role}`);
    console.log(`   Colegio: ${school.school_name}`);
    console.log(`   Contraseña: ${userData.password}`);

    // 5. Mostrar información de acceso
    console.log(`\n📋 Información de acceso:`);
    console.log(`   URL: http://localhost:3000/login`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Contraseña: ${userData.password}`);

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createLukasUser(); 