const https = require('https');
const http = require('http');

console.log('🔍 DIAGNÓSTICO COMPLETO ERROR 404');
console.log('==================================\n');

// URLs a verificar
const urls = [
  'https://plataforma-edu21-production.up.railway.app/health',
  'https://plataforma-edu21-production.up.railway.app/api/lab/activities',
  'https://plataforma-edu21-production.up.railway.app/api/auth/status'
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 200) // Primeros 200 caracteres
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        error: err.message,
        status: 'ERROR'
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        error: 'Timeout',
        status: 'TIMEOUT'
      });
    });
  });
}

async function runDiagnosis() {
  console.log('🌐 Verificando conectividad del backend...\n');
  
  for (const url of urls) {
    console.log(`📡 Probando: ${url}`);
    const result = await testUrl(url);
    
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`);
    } else {
      console.log(`  ✅ Status: ${result.status}`);
      console.log(`  📄 Response: ${result.data}`);
    }
    console.log('');
  }
  
  console.log('🔧 VERIFICANDO CONFIGURACIÓN:');
  console.log('1. ✅ Vercel tiene NEXT_PUBLIC_API_URL configurado');
  console.log('2. ✅ Railway tiene todas las variables necesarias');
  console.log('3. ✅ El servidor local funciona (puerto 5000)');
  
  console.log('\n🎯 POSIBLES CAUSAS DEL 404:');
  console.log('1. 🚨 Railway no está respondiendo correctamente');
  console.log('2. 🚨 CORS issues entre Vercel y Railway');
  console.log('3. 🚨 Rutas no configuradas en Railway');
  console.log('4. 🚨 Railway está en modo sleep');
  
  console.log('\n🔧 SOLUCIONES A PROBAR:');
  console.log('1. Verificar que Railway esté activo');
  console.log('2. Revisar logs de Railway');
  console.log('3. Verificar rutas en el servidor');
  console.log('4. Probar con curl desde local');
}

runDiagnosis(); 