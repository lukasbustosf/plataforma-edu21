const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Solucionando problema de pnpm-lock.yaml...');

const clientDir = path.join(__dirname, 'client');

try {
  // Verificar si estamos en el directorio correcto
  if (!fs.existsSync(path.join(clientDir, 'package.json'))) {
    console.error('❌ No se encontró package.json en la carpeta client');
    process.exit(1);
  }

  console.log('📁 Cambiando al directorio client...');
  process.chdir(clientDir);

  // Eliminar node_modules y pnpm-lock.yaml
  console.log('🗑️  Eliminando node_modules y pnpm-lock.yaml...');
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
  }
  if (fs.existsSync('pnpm-lock.yaml')) {
    fs.unlinkSync('pnpm-lock.yaml');
  }

  // Instalar dependencias con pnpm
  console.log('📦 Instalando dependencias con pnpm...');
  execSync('pnpm install', { stdio: 'inherit' });

  console.log('✅ pnpm-lock.yaml regenerado correctamente');
  console.log('✅ node_modules reinstalado correctamente');
  
  // Verificar que el lock file se generó
  if (fs.existsSync('pnpm-lock.yaml')) {
    console.log('✅ pnpm-lock.yaml creado exitosamente');
  } else {
    console.error('❌ Error: pnpm-lock.yaml no se generó');
    process.exit(1);
  }

  console.log('\n🎉 Problema solucionado! Ahora puedes hacer deploy en Vercel');
  console.log('💡 Comando para deploy: vercel --prod');

} catch (error) {
  console.error('❌ Error durante la ejecución:', error.message);
  process.exit(1);
} 