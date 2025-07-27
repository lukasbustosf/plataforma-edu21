const https = require('https');

console.log('🔍 DIAGNÓSTICO ESPECÍFICO VERCEL');
console.log('=================================\n');

// URLs específicas que Vercel podría estar intentando acceder
const testUrls = [
  {
    url: 'https://plataforma-edu21-production.up.railway.app/health',
    description: 'Health check (sin autenticación)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/auth/status',
    description: 'Auth status (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/lab/activities',
    description: 'Lab activities (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/quiz',
    description: 'Quiz endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/class',
    description: 'Class endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/curriculum',
    description: 'Curriculum endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/reports',
    description: 'Reports endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/evaluation',
    description: 'Evaluation endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/oa',
    description: 'OA endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/question-bank',
    description: 'Question bank endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/notifications',
    description: 'Notifications endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/demo',
    description: 'Demo endpoint (necesita token)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/skins',
    description: 'Skins endpoint (sin autenticación)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/security',
    description: 'Security endpoint (sin autenticación)'
  },
  {
    url: 'https://plataforma-edu21-production.up.railway.app/api/my-evaluations',
    description: 'My evaluations endpoint (necesita token)'
  }
];

async function testUrl(url, description) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          description,
          status: res.statusCode,
          data: data.substring(0, 100)
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        description,
        status: 'ERROR',
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        description,
        status: 'TIMEOUT',
        error: 'Request timeout'
      });
    });
  });
}

async function runDiagnosis() {
  console.log('🌐 Verificando todos los endpoints del servidor...\n');
  
  for (const test of testUrls) {
    console.log(`📡 ${test.description}:`);
    const result = await testUrl(test.url, test.description);
    
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`);
    } else if (result.status === 404) {
      console.log(`  ❌ 404 - Endpoint no encontrado`);
    } else if (result.status === 401) {
      console.log(`  ✅ ${result.status} - Endpoint existe (necesita autenticación)`);
    } else if (result.status === 200) {
      console.log(`  ✅ ${result.status} - Endpoint funciona perfectamente`);
    } else {
      console.log(`  ⚠️ ${result.status} - Respuesta inesperada`);
    }
    console.log('');
  }
  
  console.log('🔧 ANÁLISIS:');
  console.log('1. Si ves muchos 404, hay rutas faltantes');
  console.log('2. Si ves 401, las rutas existen pero necesitan token');
  console.log('3. Si ves 200, todo está funcionando');
  console.log('4. Si ves ERROR, hay problemas de conectividad');
  
  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('1. Identificar qué rutas dan 404');
  console.log('2. Verificar si Vercel está intentando acceder a rutas que no existen');
  console.log('3. Revisar logs de Vercel para ver exactamente qué URL está fallando');
}

runDiagnosis(); 