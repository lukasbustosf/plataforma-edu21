const https = require('https');

console.log('🔍 PROBANDO DEPLOYMENT DE VERCEL');
console.log('=================================\n');

const deploymentUrl = 'https://plataforma-edu21.vercel.app';

async function testDeployment() {
  return new Promise((resolve) => {
    const req = https.get(deploymentUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 500)
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        error: err.message,
        status: 'ERROR'
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        error: 'Timeout',
        status: 'TIMEOUT'
      });
    });
  });
}

async function runTest() {
  console.log(`📡 Probando: ${deploymentUrl}\n`);
  
  const result = await testDeployment();
  
  if (result.error) {
    console.log(`❌ Error: ${result.error}`);
  } else {
    console.log(`📊 Status: ${result.status}`);
    console.log(`📄 Headers: ${JSON.stringify(result.headers, null, 2)}`);
    console.log(`📄 Response: ${result.data}`);
  }
  
  console.log('\n🔧 ANÁLISIS:');
  if (result.status === 401 || result.status === 403) {
    console.log('🚨 Problema de autenticación/autorización');
    console.log('   - Verificar configuración de CORS');
    console.log('   - Verificar variables de entorno');
    console.log('   - Verificar configuración de autenticación');
  } else if (result.status === 200) {
    console.log('✅ Deployment funcionando correctamente');
  } else if (result.status === 404) {
    console.log('❌ Página no encontrada');
    console.log('   - Verificar rutas del frontend');
    console.log('   - Verificar configuración de Next.js');
  } else {
    console.log(`⚠️ Status inesperado: ${result.status}`);
  }
  
  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('1. Verificar configuración de CORS en el servidor');
  console.log('2. Verificar variables de entorno en Vercel');
  console.log('3. Probar con diferentes rutas');
  console.log('4. Revisar logs de Railway para errores de CORS');
}

runTest(); 