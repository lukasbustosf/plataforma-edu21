const https = require('https');

console.log('🔍 PROBANDO RUTAS DE VERCEL');
console.log('============================\n');

const baseUrl = 'https://plataforma-edu21.vercel.app';
const routes = [
  '/',
  '/login',
  '/admin',
  '/student',
  '/teacher',
  '/guardian',
  '/api/auth/status',
  '/health',
  '/api/health'
];

async function testRoute(route) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${route}`;
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          route,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          data: data.substring(0, 200)
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        route,
        error: err.message,
        status: 'ERROR'
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        route,
        error: 'Timeout',
        status: 'TIMEOUT'
      });
    });
  });
}

async function runTests() {
  console.log(`📡 Probando rutas en: ${baseUrl}\n`);
  
  for (const route of routes) {
    console.log(`🔍 Probando: ${route}`);
    const result = await testRoute(route);
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    } else {
      console.log(`   📊 Status: ${result.status}`);
      console.log(`   📄 Content-Type: ${result.contentType}`);
      if (result.status === 200) {
        console.log(`   ✅ FUNCIONA`);
      } else if (result.status === 404) {
        console.log(`   ❌ No encontrado`);
      } else {
        console.log(`   ⚠️ Status inesperado`);
      }
    }
    console.log('');
  }
  
  console.log('🎯 ANÁLISIS:');
  console.log('- Si todas las rutas dan 404: Problema de configuración de Next.js');
  console.log('- Si algunas rutas funcionan: Problema de rutas específicas');
  console.log('- Si hay errores de conexión: Problema de red o DNS');
}

runTests(); 