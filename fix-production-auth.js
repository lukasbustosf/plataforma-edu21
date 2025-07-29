const axios = require('axios');

console.log('🔧 Solucionando Autenticación en Producción');
console.log('==========================================');

const PRODUCTION_URL = 'https://plataforma-edu21-production.up.railway.app';

async function createProductionUser() {
  console.log('\n👤 Creando usuario de producción...');
  
  try {
    // 1. Crear usuario de prueba
    const userData = {
      email: 'teacher@demo.edu21.cl',
      password: 'demo123',
      name: 'Profesor Demo',
      role: 'TEACHER',
      school_id: '550e8400-e29b-41d4-a716-446655440000'
    };

    const registerResponse = await axios.post(`${PRODUCTION_URL}/api/auth/register`, userData, {
      timeout: 10000
    });

    console.log('✅ Usuario creado:', registerResponse.data);
    return registerResponse.data.token;

  } catch (error) {
    if (error.response?.status === 409) {
      console.log('ℹ️  Usuario ya existe, intentando login...');
      
      // Intentar login
      const loginData = {
        email: 'teacher@demo.edu21.cl',
        password: 'demo123'
      };

      const loginResponse = await axios.post(`${PRODUCTION_URL}/api/auth/login`, loginData, {
        timeout: 10000
      });

      console.log('✅ Login exitoso:', loginResponse.data);
      return loginResponse.data.token;
    } else {
      console.log('❌ Error creando usuario:', error.response?.data || error.message);
      throw error;
    }
  }
}

async function testProductionWithRealToken(token) {
  console.log('\n🧪 Probando endpoints con token real...');
  
  try {
    // 1. Probar autenticación
    console.log('1️⃣ Probando autenticación...');
    const authResponse = await axios.get(`${PRODUCTION_URL}/api/auth/status`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    });
    console.log('✅ Autenticación exitosa:', authResponse.data);

    // 2. Probar materiales del laboratorio
    console.log('2️⃣ Probando materiales...');
    const materialsResponse = await axios.get(`${PRODUCTION_URL}/api/lab/materials`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    });
    console.log('✅ Materiales obtenidos:', materialsResponse.data.length || 'N/A');

    // 3. Probar actividades del laboratorio
    console.log('3️⃣ Probando actividades...');
    const activitiesResponse = await axios.get(`${PRODUCTION_URL}/api/lab/activities`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    });
    console.log('✅ Actividades obtenidas:', activitiesResponse.data.length || 'N/A');

    return true;

  } catch (error) {
    console.log('❌ Error probando endpoints:', error.response?.data || error.message);
    return false;
  }
}

async function createFrontendTokenScript(token) {
  console.log('\n📝 Creando script para frontend...');
  
  const scriptContent = `
// Script para configurar token en producción
// Ejecutar en la consola del navegador en https://plataforma-edu21.vercel.app

const token = '${token}';
const userData = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'teacher@demo.edu21.cl',
  name: 'Profesor Demo',
  role: 'TEACHER',
  school_id: '550e8400-e29b-41d4-a716-446655440000'
};

// Configurar localStorage
localStorage.setItem('auth_token', token);
localStorage.setItem('user_data', JSON.stringify(userData));

console.log('✅ Token configurado para producción');
console.log('🔄 Recarga la página para aplicar cambios');

// Recargar página
setTimeout(() => {
  window.location.reload();
}, 1000);
`;

  const fs = require('fs');
  fs.writeFileSync('production-token-script.js', scriptContent);
  
  console.log('✅ Script creado: production-token-script.js');
  console.log('📋 Instrucciones:');
  console.log('1. Ve a https://plataforma-edu21.vercel.app');
  console.log('2. Abre la consola del navegador (F12)');
  console.log('3. Copia y pega el contenido de production-token-script.js');
  console.log('4. Presiona Enter');
  console.log('5. La página se recargará automáticamente');
}

async function main() {
  try {
    console.log('🚀 Iniciando solución de autenticación en producción...');
    
    // 1. Crear usuario y obtener token
    const token = await createProductionUser();
    
    // 2. Probar endpoints con token real
    const success = await testProductionWithRealToken(token);
    
    if (success) {
      console.log('\n🎉 ¡Problema solucionado!');
      console.log('✅ El servidor de producción funciona correctamente');
      console.log('✅ Los endpoints del laboratorio responden');
      
      // 3. Crear script para frontend
      await createFrontendTokenScript(token);
      
      console.log('\n📋 Resumen de la solución:');
      console.log('==========================');
      console.log('✅ Usuario de producción creado/autenticado');
      console.log('✅ Token JWT válido generado');
      console.log('✅ Endpoints del laboratorio funcionando');
      console.log('✅ Script para frontend creado');
      
      console.log('\n🎯 Próximos pasos:');
      console.log('1. Usar el script production-token-script.js en Vercel');
      console.log('2. Verificar que las actividades se cargan correctamente');
      console.log('3. Probar funcionalidad completa del laboratorio');
      
    } else {
      console.log('\n❌ Problema persistente');
      console.log('🔍 Revisar logs del servidor en Railway');
      console.log('🔍 Verificar configuración de base de datos');
    }
    
  } catch (error) {
    console.log('\n❌ Error en el proceso:', error.message);
    console.log('🔍 Verificar:');
    console.log('   - Conexión a Railway');
    console.log('   - Variables de entorno en Railway');
    console.log('   - Configuración de base de datos');
  }
}

main(); 