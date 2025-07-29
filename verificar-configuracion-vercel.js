const fs = require('fs');
const path = require('path');

console.log('🔧 VERIFICACIÓN Y CORRECCIÓN DE CONFIGURACIÓN VERCEL');
console.log('====================================================');

// Verificar archivos de configuración
function checkVercelConfig() {
  console.log('\n📋 1. Verificando archivos de configuración...');
  
  const files = [
    'vercel.json',
    'client/vercel.json',
    'client/.env.local',
    'client/.env',
    '.env.local',
    '.env'
  ];
  
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`✅ ${file} existe`);
      
      if (content.includes('NEXT_PUBLIC_API_URL')) {
        console.log(`   📝 Contiene NEXT_PUBLIC_API_URL`);
        if (content.includes('localhost')) {
          console.log(`   ⚠️  Usando localhost (debería ser Railway)`);
        }
        if (content.includes('railway.app')) {
          console.log(`   ✅ Usando Railway URL`);
        }
      }
    } else {
      console.log(`❌ ${file} NO existe`);
    }
  });
}

// Verificar configuración de Railway
function checkRailwayConfig() {
  console.log('\n📋 2. Verificando configuración de Railway...');
  
  const serverEnvPath = path.join(__dirname, 'server', '.env');
  if (fs.existsSync(serverEnvPath)) {
    const content = fs.readFileSync(serverEnvPath, 'utf8');
    console.log('✅ server/.env existe');
    
    const requiredVars = [
      'SUPABASE_URL',
      'JWT_SECRET',
      'NODE_ENV',
      'PORT'
    ];
    
    requiredVars.forEach(varName => {
      if (content.includes(varName)) {
        console.log(`   ✅ ${varName} configurado`);
      } else {
        console.log(`   ❌ ${varName} FALTANTE`);
      }
    });
    
    if (content.includes('NODE_ENV=production')) {
      console.log('   ✅ NODE_ENV=production (correcto para Railway)');
    } else {
      console.log('   ⚠️  NODE_ENV no está en production');
    }
  } else {
    console.log('❌ server/.env NO existe');
  }
}

// Generar instrucciones para Vercel
function generateVercelInstructions() {
  console.log('\n📋 3. INSTRUCCIONES PARA CONFIGURAR VERCEL:');
  console.log('==============================================');
  
  console.log('\n🔧 Paso 1: Ir a Vercel Dashboard');
  console.log('1. Ve a https://vercel.com/dashboard');
  console.log('2. Selecciona tu proyecto: client-rose-kappa');
  
  console.log('\n🔧 Paso 2: Configurar Variables de Entorno');
  console.log('1. Ve a Settings > Environment Variables');
  console.log('2. Haz clic en "Add New"');
  console.log('3. Configura:');
  console.log('   - Name: NEXT_PUBLIC_API_URL');
  console.log('   - Value: https://plataforma-edu21-production.up.railway.app');
  console.log('   - Environment: Production (y Preview si quieres)');
  console.log('4. Haz clic en "Save"');
  
  console.log('\n🔧 Paso 3: Forzar nuevo deploy');
  console.log('1. Ve a Deployments');
  console.log('2. Haz clic en "Redeploy" en el último deployment');
  console.log('3. O haz un push a GitHub para trigger automático');
  
  console.log('\n🔧 Paso 4: Verificar Railway');
  console.log('1. Ve a https://railway.app/dashboard');
  console.log('2. Selecciona tu proyecto');
  console.log('3. Ve a Variables');
  console.log('4. Verifica que tengas:');
  console.log('   - NODE_ENV=production');
  console.log('   - JWT_SECRET (configurado)');
  console.log('   - SUPABASE_URL (configurado)');
}

// Generar script de prueba
function generateTestScript() {
  console.log('\n📋 4. SCRIPT DE PRUEBA PARA VERCEL:');
  console.log('=====================================');
  
  const script = `
// Copia y pega esto en la consola del navegador en Vercel
console.log('🔍 PRUEBA DE CONFIGURACIÓN VERCEL');

// 1. Verificar variables de entorno
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// 2. Verificar localStorage
console.log('auth_token:', localStorage.getItem('auth_token'));
console.log('user_data:', localStorage.getItem('user_data'));

// 3. Hacer llamada de prueba
console.log('\\n🌐 Probando llamada a API...');
fetch('/api/lab/materials', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer demo-token-teacher',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Status:', response.status);
  console.log('URL:', response.url);
  console.log('Headers:', Object.fromEntries(response.headers.entries()));
  return response.text();
})
.then(data => {
  console.log('Respuesta:', data.substring(0, 300));
})
.catch(error => {
  console.error('Error:', error);
});

// 4. Verificar si está usando la URL correcta
console.log('\\n🔗 Verificando URL base...');
if (process.env.NEXT_PUBLIC_API_URL) {
  console.log('✅ NEXT_PUBLIC_API_URL está configurado');
  if (process.env.NEXT_PUBLIC_API_URL.includes('railway.app')) {
    console.log('✅ Usando Railway URL');
  } else {
    console.log('❌ NO está usando Railway URL');
  }
} else {
  console.log('❌ NEXT_PUBLIC_API_URL NO está configurado');
}
`;

  console.log(script);
}

// Función principal
function main() {
  checkVercelConfig();
  checkRailwayConfig();
  generateVercelInstructions();
  generateTestScript();
  
  console.log('\n🎯 RESUMEN DE ACCIONES:');
  console.log('1. ✅ Configurar NEXT_PUBLIC_API_URL en Vercel Dashboard');
  console.log('2. ✅ Verificar variables en Railway');
  console.log('3. ✅ Hacer nuevo deploy en Vercel');
  console.log('4. ✅ Ejecutar script de prueba en el navegador');
  console.log('5. ✅ Verificar que las llamadas vayan a Railway, no a Vercel');
}

main(); 