const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createUser() {
  try {
    console.log('👤 Creando nuevo usuario en EDU21...\n');

    // Datos del usuario - Lukas Bustos F.
    const userData = {
      email: 'lbustos@edu21.cl',
      password: '84788990',
      first_name: 'Lukas',
      last_name: 'Bustos F.',
      role: 'TEACHER', // TEACHER, ADMIN, STUDENT, GUARDIAN
      school_code: 'DEMO001', // Código del colegio existente
      school_name: 'COLEGIO EDU21', // Solo si necesitas crear un colegio nuevo
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
          address: 'Dirección del colegio',
          phone: '+56987654321',
          email: 'contacto@colegio.edu',
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

    console.log(`✅ Usuario creado exitosamente!`);
    console.log(`   ID: ${newUser.user_id}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Nombre: ${newUser.first_name} ${newUser.last_name}`);
    console.log(`   Rol: ${newUser.role}`);
    console.log(`   Colegio: ${school.school_name}`);
    console.log(`   Contraseña: ${userData.password} (recuerda cambiarla)`);

    // 5. Mostrar información adicional
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

// Función para listar usuarios existentes
async function listUsers() {
  try {
    console.log('📋 Listando usuarios existentes...\n');
    
    const users = await prisma.public_users.findMany({
      include: {
        schools: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Colegio: ${user.schools?.school_name || 'Sin colegio'}`);
      console.log(`   Activo: ${user.active ? '✅' : '❌'}`);
      console.log(`   ID: ${user.user_id}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para listar colegios
async function listSchools() {
  try {
    console.log('🏫 Listando colegios existentes...\n');
    
    const schools = await prisma.schools.findMany({
      orderBy: {
        school_name: 'asc'
      }
    });

    schools.forEach((school, index) => {
      console.log(`${index + 1}. ${school.school_name}`);
      console.log(`   Código: ${school.school_code}`);
      console.log(`   ID: ${school.school_id}`);
      console.log(`   Activo: ${school.active ? '✅' : '❌'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error listando colegios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar según el argumento
const command = process.argv[2];

switch (command) {
  case 'create':
    createUser();
    break;
  case 'list':
    listUsers();
    break;
  case 'schools':
    listSchools();
    break;
  default:
    console.log('📖 Uso del script:');
    console.log('   node create-user.js create    - Crear nuevo usuario');
    console.log('   node create-user.js list      - Listar usuarios existentes');
    console.log('   node create-user.js schools   - Listar colegios existentes');
    console.log('');
    console.log('💡 Para crear un usuario, edita los datos en el script y ejecuta:');
    console.log('   node create-user.js create');
} 