const axios = require('axios');

console.log('🔍 DIAGNÓSTICO ERROR 502 RAILWAY');
console.log('==================================');

const RAILWAY_URL = 'https://plataforma-edu21-production.up.railway.app';

async function checkRailwayHealth() {
  console.log('\n📋 1. Verificando estado de Railway...');
  
  try {
    // Probar sin headers primero
    const response = await axios.get(`${RAILWAY_URL}/health`, {
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500; // Aceptar cualquier status < 500
      }
    });
    
    console.log('✅ Railway responde');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📏 Tamaño: ${response.data?.length || 'N/A'}`);
    
  } catch (error) {
    console.log('❌ Railway no responde correctamente');
    console.log(`📊 Status: ${error.response?.status || 'ERROR'}`);
    console.log(`📝 Error: ${error.message}`);
    
    if (error.response?.status === 502) {
      console.log('\n🚨 ERROR 502 - Bad Gateway');
      console.log('Esto significa que:');
      console.log('1. Railway está iniciando pero no está listo');
      console.log('2. Hay un problema en el código del servidor');
      console.log('3. El puerto no está configurado correctamente');
      console.log('4. Hay un problema de dependencias');
    }
  }
}

async function testDifferentEndpoints() {
  console.log('\n📋 2. Probando diferentes endpoints...');
  
  const endpoints = [
    '/',
    '/health',
    '/api/auth/status',
    '/api/lab/materials',
    '/api/lab/activities'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${RAILWAY_URL}${endpoint}`, {
        timeout: 5000,
        validateStatus: function (status) {
          return status < 500;
        }
      });
      console.log(`✅ ${endpoint}: ${response.status}`);
    } catch (error) {
      const status = error.response?.status || 'ERROR';
      console.log(`❌ ${endpoint}: ${status} - ${error.message}`);
    }
  }
}

function generateRailwayInstructions() {
  console.log('\n📋 3. INSTRUCCIONES PARA RAILWAY DASHBOARD:');
  console.log('=============================================');
  
  console.log('\n🔧 Paso 1: Verificar Railway Dashboard');
  console.log('1. Ve a https://railway.app/dashboard');
  console.log('2. Selecciona tu proyecto: plataforma-edu21-production');
  
  console.log('\n🔧 Paso 2: Verificar Logs');
  console.log('1. Ve a la pestaña "Logs"');
  console.log('2. Busca errores como:');
  console.log('   - "Error: listen EADDRINUSE"');
  console.log('   - "Error: Cannot find module"');
  console.log('   - "Database connection failed"');
  console.log('   - "Port already in use"');
  
  console.log('\n🔧 Paso 3: Verificar Variables');
  console.log('1. Ve a la pestaña "Variables"');
  console.log('2. Verifica que tengas:');
  console.log('   - PORT=8080 (o el que Railway asigne)');
  console.log('   - NODE_ENV=production');
  console.log('   - JWT_SECRET=configurado');
  console.log('   - SUPABASE_URL=configurado');
  
  console.log('\n🔧 Paso 4: Verificar Deployments');
  console.log('1. Ve a la pestaña "Deployments"');
  console.log('2. Verifica el estado del último deployment');
  console.log('3. Si hay errores, haz clic en "Redeploy"');
  
  console.log('\n🔧 Paso 5: Verificar Puertos');
  console.log('1. Railway asigna puertos automáticamente');
  console.log('2. El código debe usar process.env.PORT');
  console.log('3. NO hardcodear puertos como 5000');
}

function checkServerCode() {
  console.log('\n📋 4. Verificando código del servidor...');
  
  const serverIndexPath = './server/index.js';
  const fs = require('fs');
  
  if (fs.existsSync(serverIndexPath)) {
    const content = fs.readFileSync(serverIndexPath, 'utf8');
    
    // Verificar configuración de puerto
    if (content.includes('process.env.PORT')) {
      console.log('✅ Usando process.env.PORT (correcto para Railway)');
    } else if (content.includes('5000')) {
      console.log('❌ Hardcodeado puerto 5000 (problema para Railway)');
    } else {
      console.log('⚠️  No se detectó configuración de puerto');
    }
    
    // Verificar configuración de CORS
    if (content.includes('cors')) {
      console.log('✅ CORS configurado');
    } else {
      console.log('⚠️  CORS no detectado');
    }
    
    // Verificar configuración de rutas
    if (content.includes('/api/')) {
      console.log('✅ Rutas API configuradas');
    } else {
      console.log('⚠️  Rutas API no detectadas');
    }
    
  } else {
    console.log('❌ server/index.js no existe');
  }
}

function generateFixScript() {
  console.log('\n📋 5. SCRIPT DE CORRECCIÓN:');
  console.log('=============================');
  
  const script = `
// Script para verificar Railway desde el navegador
console.log('🔍 VERIFICACIÓN RAILWAY DESDE NAVEGADOR');

// Probar Railway directamente
fetch('https://plataforma-edu21-production.up.railway.app/health')
.then(response => {
  console.log('Railway Health Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Railway Health Response:', data.substring(0, 200));
})
.catch(error => {
  console.error('Railway Health Error:', error);
});

// Probar con autenticación
fetch('https://plataforma-edu21-production.up.railway.app/api/lab/materials', {
  headers: {
    'Authorization': 'Bearer demo-token-teacher'
  }
})
.then(response => {
  console.log('Railway Lab Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Railway Lab Response:', data.substring(0, 200));
})
.catch(error => {
  console.error('Railway Lab Error:', error);
});
`;

  console.log(script);
}

async function main() {
  await checkRailwayHealth();
  await testDifferentEndpoints();
  generateRailwayInstructions();
  checkServerCode();
  generateFixScript();
  
  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('1. 🔍 Verificar logs en Railway Dashboard');
  console.log('2. 🔧 Corregir cualquier error encontrado');
  console.log('3. 🔄 Hacer redeploy en Railway');
  console.log('4. 🧪 Probar endpoints nuevamente');
  console.log('5. ✅ Configurar Vercel una vez que Railway funcione');
}

main().catch(console.error); 