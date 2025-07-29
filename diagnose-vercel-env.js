const axios = require('axios');

console.log('🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO EN VERCEL');
console.log('==================================================');

// URLs a verificar
const VERCEL_URL = 'https://client-rose-kappa.vercel.app';
const RAILWAY_URL = 'https://plataforma-edu21-production.up.railway.app';

async function checkVercelEnvironment() {
  console.log('\n📋 1. Verificando configuración de Vercel...');
  
  try {
    // Intentar obtener información de la página principal
    const response = await axios.get(VERCEL_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ Vercel está respondiendo');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📏 Tamaño: ${response.data.length} caracteres`);
    
    // Buscar indicadores de configuración en el HTML
    const html = response.data;
    if (html.includes('NEXT_PUBLIC_API_URL')) {
      console.log('⚠️  Encontrado NEXT_PUBLIC_API_URL en el HTML (puede ser hardcodeado)');
    }
    
    if (html.includes('localhost:5000')) {
      console.log('❌ Encontrado localhost:5000 en el HTML - MALA CONFIGURACIÓN');
    }
    
    if (html.includes('plataforma-edu21-production.up.railway.app')) {
      console.log('✅ Encontrado Railway URL en el HTML - BUENA CONFIGURACIÓN');
    }
    
  } catch (error) {
    console.log('❌ Error verificando Vercel:', error.message);
  }
}

async function checkRailwayLogs() {
  console.log('\n📋 2. Verificando logs de Railway...');
  
  try {
    // Verificar endpoints básicos
    const endpoints = [
      '/health',
      '/api/auth/status',
      '/api/lab/materials',
      '/api/lab/activities'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${RAILWAY_URL}${endpoint}`, {
          timeout: 5000,
          headers: {
            'Authorization': 'Bearer demo-token-teacher'
          }
        });
        console.log(`✅ ${endpoint}: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status || error.message}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error verificando Railway:', error.message);
  }
}

async function checkEnvironmentVariables() {
  console.log('\n📋 3. Verificando variables de entorno...');
  
  console.log('🔧 Para verificar en Vercel:');
  console.log('1. Ve a https://vercel.com/dashboard');
  console.log('2. Selecciona tu proyecto');
  console.log('3. Ve a Settings > Environment Variables');
  console.log('4. Busca: NEXT_PUBLIC_API_URL');
  console.log('5. Debería ser: https://plataforma-edu21-production.up.railway.app');
  
  console.log('\n🔧 Para verificar en Railway:');
  console.log('1. Ve a https://railway.app/dashboard');
  console.log('2. Selecciona tu proyecto');
  console.log('3. Ve a Variables');
  console.log('4. Verifica que tengas:');
  console.log('   - SUPABASE_URL');
  console.log('   - JWT_SECRET');
  console.log('   - NODE_ENV=production');
}

async function generateTestScript() {
  console.log('\n📋 4. Generando script de prueba...');
  
  const testScript = `
// Script para ejecutar en la consola del navegador en Vercel
console.log('🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO');

// Verificar variables de entorno
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Verificar localStorage
console.log('auth_token:', localStorage.getItem('auth_token'));
console.log('user_data:', localStorage.getItem('user_data'));

// Hacer una llamada de prueba
fetch('/api/lab/materials', {
  headers: {
    'Authorization': 'Bearer demo-token-teacher'
  }
})
.then(response => {
  console.log('Status:', response.status);
  console.log('URL llamada:', response.url);
  return response.text();
})
.then(data => {
  console.log('Respuesta:', data.substring(0, 200));
})
.catch(error => {
  console.error('Error:', error);
});
`;

  console.log('📝 Copia y pega este script en la consola del navegador en Vercel:');
  console.log(testScript);
}

async function main() {
  await checkVercelEnvironment();
  await checkRailwayLogs();
  await checkEnvironmentVariables();
  await generateTestScript();
  
  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('1. Ejecuta el script de prueba en la consola del navegador en Vercel');
  console.log('2. Verifica las variables de entorno en Vercel Dashboard');
  console.log('3. Si NEXT_PUBLIC_API_URL no está configurado, agrégalo');
  console.log('4. Haz un nuevo deploy después de configurar las variables');
}

main().catch(console.error); 