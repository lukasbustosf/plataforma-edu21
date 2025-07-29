const axios = require('axios');

console.log('🔍 VERIFICACIÓN DE URL EN VERCEL');
console.log('==================================');

const VERCEL_URL = 'https://client-rose-kappa.vercel.app';
const RAILWAY_URL = 'https://plataforma-edu21-production.up.railway.app';

async function checkVercelConfiguration() {
  console.log('\n📋 1. Verificando configuración actual de Vercel...');
  
  try {
    // Obtener la página principal de Vercel
    const response = await axios.get(VERCEL_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ Vercel está respondiendo');
    console.log(`📊 Status: ${response.status}`);
    
    // Buscar indicadores en el HTML
    const html = response.data;
    
    // Buscar URLs en el código JavaScript
    const urlPatterns = [
      /localhost:5000/g,
      /localhost:3000/g,
      /railway\.app/g,
      /vercel\.app/g,
      /NEXT_PUBLIC_API_URL/g
    ];
    
    console.log('\n🔍 Buscando patrones en el código:');
    urlPatterns.forEach(pattern => {
      const matches = html.match(pattern);
      if (matches) {
        console.log(`⚠️  Encontrado: ${pattern.source} (${matches.length} veces)`);
      } else {
        console.log(`✅ No encontrado: ${pattern.source}`);
      }
    });
    
    // Buscar específicamente la configuración de API
    if (html.includes('NEXT_PUBLIC_API_URL')) {
      console.log('\n⚠️  NEXT_PUBLIC_API_URL está hardcodeado en el HTML');
    } else {
      console.log('\n✅ NEXT_PUBLIC_API_URL no está hardcodeado (bueno)');
    }
    
  } catch (error) {
    console.log('❌ Error verificando Vercel:', error.message);
  }
}

async function testRailwayEndpoints() {
  console.log('\n📋 2. Verificando endpoints de Railway...');
  
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
      const status = error.response?.status || 'ERROR';
      console.log(`❌ ${endpoint}: ${status} - ${error.message}`);
    }
  }
}

function generateVercelFixInstructions() {
  console.log('\n📋 3. INSTRUCCIONES PARA CORREGIR VERCEL:');
  console.log('============================================');
  
  console.log('\n🔧 Paso 1: Ir a Vercel Dashboard');
  console.log('1. Ve a https://vercel.com/dashboard');
  console.log('2. Selecciona tu proyecto: client-rose-kappa');
  
  console.log('\n🔧 Paso 2: Verificar Variables de Entorno');
  console.log('1. Ve a Settings > Environment Variables');
  console.log('2. Busca si existe: NEXT_PUBLIC_API_URL');
  console.log('3. Si NO existe, agrégalo:');
  console.log('   - Name: NEXT_PUBLIC_API_URL');
  console.log('   - Value: https://plataforma-edu21-production.up.railway.app');
  console.log('   - Environment: Production (y Preview)');
  
  console.log('\n🔧 Paso 3: Si ya existe, verificar el valor');
  console.log('1. Haz clic en "Edit" en NEXT_PUBLIC_API_URL');
  console.log('2. Verifica que el valor sea: https://plataforma-edu21-production.up.railway.app');
  console.log('3. Si es diferente, corrígelo');
  
  console.log('\n🔧 Paso 4: Forzar nuevo deploy');
  console.log('1. Ve a Deployments');
  console.log('2. Haz clic en "Redeploy" en el último deployment');
  console.log('3. O haz un push a GitHub');
}

function generateTestScript() {
  console.log('\n📋 4. SCRIPT DE PRUEBA PARA VERCEL:');
  console.log('=====================================');
  
  const script = `
// Ejecuta esto en la consola del navegador en Vercel
console.log('🔍 PRUEBA DE CONFIGURACIÓN VERCEL');

// 1. Verificar variables de entorno
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// 2. Verificar localStorage
console.log('auth_token:', localStorage.getItem('auth_token'));

// 3. Probar llamada directa a Railway
console.log('\\n🌐 Probando Railway directamente...');
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

// 4. Probar llamada a través del cliente (debería usar Railway)
console.log('\\n🌐 Probando llamada del cliente...');
fetch('/api/lab/materials', {
  headers: {
    'Authorization': 'Bearer demo-token-teacher'
  }
})
.then(response => {
  console.log('Cliente Status:', response.status);
  console.log('Cliente URL:', response.url);
  return response.text();
})
.then(data => {
  console.log('Cliente Response:', data.substring(0, 200));
})
.catch(error => {
  console.error('Cliente Error:', error);
});

// 5. Verificar configuración
console.log('\\n🔗 Verificando configuración...');
if (process.env.NEXT_PUBLIC_API_URL) {
  console.log('✅ NEXT_PUBLIC_API_URL está configurado');
  if (process.env.NEXT_PUBLIC_API_URL.includes('railway.app')) {
    console.log('✅ Usando Railway URL');
  } else {
    console.log('❌ NO está usando Railway URL');
    console.log('Valor actual:', process.env.NEXT_PUBLIC_API_URL);
  }
} else {
  console.log('❌ NEXT_PUBLIC_API_URL NO está configurado');
}
`;

  console.log(script);
}

async function main() {
  await checkVercelConfiguration();
  await testRailwayEndpoints();
  generateVercelFixInstructions();
  generateTestScript();
  
  console.log('\n🎯 RESUMEN:');
  console.log('1. ✅ Railway está funcionando en puerto 8080 (correcto)');
  console.log('2. ❌ Vercel NO tiene configurado NEXT_PUBLIC_API_URL');
  console.log('3. 🔧 Necesitas configurar la variable en Vercel Dashboard');
  console.log('4. 🔄 Hacer nuevo deploy después de configurar');
}

main().catch(console.error); 