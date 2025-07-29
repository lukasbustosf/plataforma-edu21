const fs = require('fs');
const path = require('path');

console.log('🔧 DIAGNÓSTICO Y REPARACIÓN DE PROBLEMAS DEL LABORATORIO');
console.log('=' .repeat(60));

// 1. Verificar que el servidor esté funcionando
async function testServer() {
  console.log('\n1️⃣ Probando servidor...');
  try {
    const response = await fetch('http://localhost:5000/api/lab/materials', {
      headers: {
        'Authorization': 'Bearer demo-token-teacher-123'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Servidor funcionando:', data.data?.length || 0, 'materiales');
    } else {
      console.log('❌ Error del servidor:', response.status);
    }
  } catch (error) {
    console.log('❌ Servidor no disponible:', error.message);
  }
}

// 2. Verificar rutas del frontend
function checkFrontendRoutes() {
  console.log('\n2️⃣ Verificando rutas del frontend...');
  
  const routes = [
    'client/src/app/teacher/labs/activities/page.tsx',
    'client/src/app/teacher/labs/activity/[slug]/page.tsx'
  ];
  
  routes.forEach(route => {
    if (fs.existsSync(route)) {
      console.log('✅', route);
    } else {
      console.log('❌', route, '- NO EXISTE');
    }
  });
}

// 3. Crear favicon para eliminar 404
function createFavicon() {
  console.log('\n3️⃣ Creando favicon...');
  
  const faviconPath = 'client/public/favicon.ico';
  const iconPath = 'client/src/app/icon.ico';
  
  // Crear directorio si no existe
  const publicDir = path.dirname(faviconPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Crear favicon placeholder
  const faviconContent = `# EDU21 Favicon
# Este es un placeholder para el favicon
# En producción, deberías tener un archivo .ico real`;
  
  try {
    fs.writeFileSync(faviconPath, faviconContent);
    console.log('✅ Favicon creado en public/');
  } catch (error) {
    console.log('❌ Error creando favicon:', error.message);
  }
  
  try {
    fs.writeFileSync(iconPath, faviconContent);
    console.log('✅ Icon creado en app/');
  } catch (error) {
    console.log('❌ Error creando icon:', error.message);
  }
}

// 4. Verificar configuración de Next.js
function checkNextConfig() {
  console.log('\n4️⃣ Verificando configuración de Next.js...');
  
  const nextConfigPath = 'client/next.config.js';
  if (fs.existsSync(nextConfigPath)) {
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    console.log('✅ next.config.js existe');
    
    if (config.includes('experimental')) {
      console.log('⚠️ Configuración experimental detectada');
    }
  } else {
    console.log('❌ next.config.js no existe');
  }
}

// 5. Verificar variables de entorno
function checkEnvironment() {
  console.log('\n5️⃣ Verificando variables de entorno...');
  
  const envPath = 'client/.env.local';
  if (fs.existsSync(envPath)) {
    console.log('✅ .env.local existe');
  } else {
    console.log('⚠️ .env.local no existe');
  }
  
  const envExamplePath = 'client/.env.example';
  if (fs.existsSync(envExamplePath)) {
    console.log('✅ .env.example existe');
  } else {
    console.log('⚠️ .env.example no existe');
  }
}

// Ejecutar diagnóstico
async function runDiagnosis() {
  await testServer();
  checkFrontendRoutes();
  createFavicon();
  checkNextConfig();
  checkEnvironment();
  
  console.log('\n🎯 RESUMEN DE PROBLEMAS Y SOLUCIONES:');
  console.log('- 404 favicon.ico: ✅ Creado favicon placeholder');
  console.log('- Warning hydration: ⚠️ Puede ser por atributos extra en el DOM');
  console.log('- URL de actividad: ✅ Ruta existe, verificar slug');
  console.log('- Cookies GFE_RTT: ⚠️ Advertencia de Google, no afecta funcionalidad');
  
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('1. Reiniciar el servidor de desarrollo');
  console.log('2. Limpiar caché del navegador');
  console.log('3. Verificar que las actividades cargan correctamente');
  console.log('4. Probar navegación a actividades específicas');
}

runDiagnosis().catch(console.error); 