const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECCIÓN DE CONFIGURACIÓN RAILWAY');
console.log('=======================================');

// Verificar y corregir server/.env
function fixServerEnv() {
  console.log('\n📋 1. Verificando server/.env...');
  
  const serverEnvPath = path.join(__dirname, 'server', '.env');
  
  if (fs.existsSync(serverEnvPath)) {
    let content = fs.readFileSync(serverEnvPath, 'utf8');
    console.log('✅ server/.env existe');
    
    // Verificar NODE_ENV
    if (content.includes('NODE_ENV=production')) {
      console.log('✅ NODE_ENV ya está en production');
    } else {
      console.log('⚠️  NODE_ENV no está en production, corrigiendo...');
      
      // Reemplazar NODE_ENV si existe, o agregarlo si no
      if (content.includes('NODE_ENV=')) {
        content = content.replace(/NODE_ENV=.*/g, 'NODE_ENV=production');
      } else {
        content += '\nNODE_ENV=production';
      }
      
      fs.writeFileSync(serverEnvPath, content);
      console.log('✅ NODE_ENV corregido a production');
    }
    
    // Verificar otras variables críticas
    const requiredVars = [
      'SUPABASE_URL',
      'JWT_SECRET',
      'PORT'
    ];
    
    let missingVars = [];
    requiredVars.forEach(varName => {
      if (!content.includes(varName)) {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length > 0) {
      console.log('❌ Variables faltantes:', missingVars.join(', '));
    } else {
      console.log('✅ Todas las variables requeridas están presentes');
    }
    
  } else {
    console.log('❌ server/.env NO existe');
  }
}

// Generar instrucciones para Railway Dashboard
function generateRailwayInstructions() {
  console.log('\n📋 2. INSTRUCCIONES PARA RAILWAY DASHBOARD:');
  console.log('=============================================');
  
  console.log('\n🔧 Paso 1: Ir a Railway Dashboard');
  console.log('1. Ve a https://railway.app/dashboard');
  console.log('2. Selecciona tu proyecto: plataforma-edu21-production');
  
  console.log('\n🔧 Paso 2: Verificar Variables');
  console.log('1. Ve a la pestaña "Variables"');
  console.log('2. Verifica que tengas:');
  console.log('   - NODE_ENV=production');
  console.log('   - JWT_SECRET=tu_secret_aqui');
  console.log('   - SUPABASE_URL=tu_url_aqui');
  console.log('   - PORT=5000');
  
  console.log('\n🔧 Paso 3: Si falta NODE_ENV');
  console.log('1. Haz clic en "New Variable"');
  console.log('2. Name: NODE_ENV');
  console.log('3. Value: production');
  console.log('4. Haz clic en "Add"');
  
  console.log('\n🔧 Paso 4: Reiniciar el servicio');
  console.log('1. Ve a la pestaña "Deployments"');
  console.log('2. Haz clic en "Redeploy" en el último deployment');
  console.log('3. O espera a que se reinicie automáticamente');
}

// Generar instrucciones para Vercel
function generateVercelInstructions() {
  console.log('\n📋 3. INSTRUCCIONES PARA VERCEL DASHBOARD:');
  console.log('============================================');
  
  console.log('\n🔧 Paso 1: Ir a Vercel Dashboard');
  console.log('1. Ve a https://vercel.com/dashboard');
  console.log('2. Selecciona tu proyecto: client-rose-kappa');
  
  console.log('\n🔧 Paso 2: Configurar Variable de Entorno');
  console.log('1. Ve a Settings > Environment Variables');
  console.log('2. Haz clic en "Add New"');
  console.log('3. Configura:');
  console.log('   - Name: NEXT_PUBLIC_API_URL');
  console.log('   - Value: https://plataforma-edu21-production.up.railway.app');
  console.log('   - Environment: Production (y Preview)');
  console.log('4. Haz clic en "Save"');
  
  console.log('\n🔧 Paso 3: Forzar nuevo deploy');
  console.log('1. Ve a Deployments');
  console.log('2. Haz clic en "Redeploy" en el último deployment');
  console.log('3. O haz un push a GitHub');
}

// Generar script de verificación
function generateVerificationScript() {
  console.log('\n📋 4. SCRIPT DE VERIFICACIÓN:');
  console.log('==============================');
  
  const script = `
// Ejecuta esto en la consola del navegador en Vercel
console.log('🔍 VERIFICACIÓN COMPLETA');

// 1. Verificar configuración del cliente
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// 2. Verificar autenticación
console.log('auth_token:', localStorage.getItem('auth_token'));

// 3. Probar llamada a Railway
console.log('\\n🌐 Probando Railway...');
fetch('https://plataforma-edu21-production.up.railway.app/api/lab/materials', {
  headers: {
    'Authorization': 'Bearer demo-token-teacher'
  }
})
.then(response => {
  console.log('Railway Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Railway Response:', data.substring(0, 200));
})
.catch(error => {
  console.error('Railway Error:', error);
});

// 4. Probar llamada local (debería fallar si está bien configurado)
console.log('\\n🌐 Probando llamada local...');
fetch('/api/lab/materials', {
  headers: {
    'Authorization': 'Bearer demo-token-teacher'
  }
})
.then(response => {
  console.log('Local Status:', response.status);
  console.log('Local URL:', response.url);
  return response.text();
})
.then(data => {
  console.log('Local Response:', data.substring(0, 200));
})
.catch(error => {
  console.error('Local Error:', error);
});
`;

  console.log(script);
}

// Función principal
function main() {
  fixServerEnv();
  generateRailwayInstructions();
  generateVercelInstructions();
  generateVerificationScript();
  
  console.log('\n🎯 ORDEN DE ACCIONES:');
  console.log('1. 🔧 Configurar NODE_ENV=production en Railway');
  console.log('2. 🔧 Configurar NEXT_PUBLIC_API_URL en Vercel');
  console.log('3. 🔄 Hacer redeploy en Railway');
  console.log('4. 🔄 Hacer redeploy en Vercel');
  console.log('5. 🧪 Ejecutar script de verificación');
  console.log('6. ✅ Verificar que las llamadas vayan a Railway');
}

main(); 