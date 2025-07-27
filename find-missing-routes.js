const fs = require('fs');
const path = require('path');

console.log('🔍 BUSCANDO RUTAS FALTANTES');
console.log('============================\n');

// Verificar si existe el archivo de rutas de security
const securityRoutePath = path.join(__dirname, 'server', 'routes', 'security.js');
const securityExists = fs.existsSync(securityRoutePath);

console.log('📁 Verificando archivos de rutas:');
console.log(`  Security routes: ${securityExists ? '✅ Existe' : '❌ No existe'}`);

if (!securityExists) {
  console.log('\n🔧 Creando archivo de rutas de security faltante...');
  
  const securityContent = `const express = require('express');
const router = express.Router();

// GET /api/security/status
router.get('/status', (req, res) => {
  res.json({
    status: 'secure',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET /api/security/health
router.get('/health', (req, res) => {
  res.json({
    security: 'active',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
`;
  
  fs.writeFileSync(securityRoutePath, securityContent);
  console.log('✅ Archivo security.js creado');
}

// Verificar otras rutas que podrían faltar
const routeFiles = [
  'auth.js',
  'quiz.js', 
  'game.js',
  'class.js',
  'curriculum.js',
  'reports.js',
  'evaluation.js',
  'oa.js',
  'questionBank.js',
  'notifications.js',
  'lab.js',
  'demo.js',
  'skins.js',
  'security.js',
  'myEvaluations.js'
];

console.log('\n📋 Verificando todas las rutas:');
routeFiles.forEach(file => {
  const filePath = path.join(__dirname, 'server', 'routes', file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${file}: ${exists ? '✅' : '❌'}`);
});

console.log('\n🎯 POSIBLES CAUSAS DEL 404 EN VERCEL:');
console.log('1. 🚨 Rutas específicas del frontend que no existen');
console.log('2. 🚨 Problemas de CORS entre Vercel y Railway');
console.log('3. 🚨 Rutas dinámicas que no están configuradas');
console.log('4. 🚨 Problemas de autenticación en el frontend');

console.log('\n🔧 SOLUCIONES:');
console.log('1. ✅ Crear archivo security.js faltante');
console.log('2. 🔍 Revisar logs de Vercel para ver exactamente qué URL falla');
console.log('3. 🔍 Verificar si hay rutas específicas del frontend que no existen');
console.log('4. 🔍 Probar la aplicación localmente para replicar el error');

console.log('\n📝 PRÓXIMOS PASOS:');
console.log('1. Hacer commit del archivo security.js si se creó');
console.log('2. Revisar los logs de Vercel en tiempo real');
console.log('3. Probar la aplicación localmente');
console.log('4. Verificar si el error 404 persiste'); 