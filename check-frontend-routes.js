const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO RUTAS DEL FRONTEND');
console.log('==================================\n');

// Verificar estructura del frontend
const clientPath = path.join(__dirname, 'client', 'src', 'app');

console.log('📁 Estructura del frontend:');
if (fs.existsSync(clientPath)) {
  const appDirs = fs.readdirSync(clientPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log('  Directorios en /app:');
  appDirs.forEach(dir => {
    console.log(`    📁 ${dir}`);
  });
} else {
  console.log('  ❌ Directorio client/src/app no existe');
}

// Verificar archivos de configuración
console.log('\n📋 Archivos de configuración:');
const configFiles = [
  'client/next.config.js',
  'client/package.json',
  'client/src/lib/api.ts',
  'client/src/lib/utils.ts'
];

configFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${file}: ${exists ? '✅' : '❌'}`);
});

// Verificar variables de entorno en el frontend
console.log('\n🔧 Verificando configuración del frontend:');
try {
  const nextConfig = fs.readFileSync(path.join(__dirname, 'client', 'next.config.js'), 'utf8');
  const hasApiUrl = nextConfig.includes('NEXT_PUBLIC_API_URL');
  console.log(`  NEXT_PUBLIC_API_URL en next.config.js: ${hasApiUrl ? '✅' : '❌'}`);
} catch (error) {
  console.log('  ❌ Error leyendo next.config.js');
}

// Verificar archivo api.ts
try {
  const apiFile = fs.readFileSync(path.join(__dirname, 'client', 'src', 'lib', 'api.ts'), 'utf8');
  const hasApiUrl = apiFile.includes('NEXT_PUBLIC_API_URL');
  console.log(`  NEXT_PUBLIC_API_URL en api.ts: ${hasApiUrl ? '✅' : '❌'}`);
} catch (error) {
  console.log('  ❌ Error leyendo api.ts');
}

console.log('\n🎯 POSIBLES CAUSAS DEL 404:');
console.log('1. 🚨 Rutas dinámicas del frontend que no existen');
console.log('2. 🚨 Problemas de build en Vercel');
console.log('3. 🚨 Variables de entorno no configuradas correctamente');
console.log('4. 🚨 Problemas de routing en Next.js');

console.log('\n🔧 SOLUCIONES A PROBAR:');
console.log('1. 🔍 Revisar logs de Vercel para ver exactamente qué URL falla');
console.log('2. 🔍 Verificar si hay rutas específicas que no existen');
console.log('3. 🔍 Probar la aplicación localmente');
console.log('4. 🔍 Verificar la configuración de Next.js');

console.log('\n📝 PRÓXIMOS PASOS:');
console.log('1. Ve a Vercel > Deployments > Último deployment > Functions');
console.log('2. Busca errores específicos en los logs');
console.log('3. Identifica exactamente qué URL está causando el 404');
console.log('4. Verifica si es un problema de routing o de API'); 