const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Solucionando problema de pnpm-lock.yaml en Windows...');

const clientDir = path.join(__dirname, 'client');

try {
  // Verificar si estamos en el directorio correcto
  if (!fs.existsSync(path.join(clientDir, 'package.json'))) {
    console.error('❌ No se encontró package.json en la carpeta client');
    process.exit(1);
  }

  console.log('📁 Cambiando al directorio client...');
  process.chdir(clientDir);

  // Eliminar pnpm-lock.yaml primero
  console.log('🗑️  Eliminando pnpm-lock.yaml...');
  if (fs.existsSync('pnpm-lock.yaml')) {
    try {
      fs.unlinkSync('pnpm-lock.yaml');
      console.log('✅ pnpm-lock.yaml eliminado');
    } catch (error) {
      console.log('⚠️  No se pudo eliminar pnpm-lock.yaml, continuando...');
    }
  }

  // Intentar eliminar node_modules con rimraf si está disponible
  console.log('🗑️  Eliminando node_modules...');
  if (fs.existsSync('node_modules')) {
    try {
      // Usar rimraf si está disponible
      execSync('npx rimraf node_modules', { stdio: 'pipe' });
      console.log('✅ node_modules eliminado con rimraf');
    } catch (error) {
      try {
        // Fallback: usar rmdir de Windows
        execSync('rmdir /s /q node_modules', { stdio: 'pipe' });
        console.log('✅ node_modules eliminado con rmdir');
      } catch (error2) {
        console.log('⚠️  No se pudo eliminar node_modules completamente, continuando...');
      }
    }
  }

  // Limpiar cache de pnpm
  console.log('🧹 Limpiando cache de pnpm...');
  try {
    execSync('pnpm store prune', { stdio: 'pipe' });
    console.log('✅ Cache de pnpm limpiado');
  } catch (error) {
    console.log('⚠️  No se pudo limpiar cache de pnpm, continuando...');
  }

  // Instalar dependencias con pnpm
  console.log('📦 Instalando dependencias con pnpm...');
  execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });

  console.log('✅ pnpm-lock.yaml regenerado correctamente');
  console.log('✅ node_modules reinstalado correctamente');
  
  // Verificar que el lock file se generó
  if (fs.existsSync('pnpm-lock.yaml')) {
    console.log('✅ pnpm-lock.yaml creado exitosamente');
    
    // Mostrar información del lock file
    const lockContent = fs.readFileSync('pnpm-lock.yaml', 'utf8');
    const lines = lockContent.split('\n');
    console.log(`📊 pnpm-lock.yaml tiene ${lines.length} líneas`);
  } else {
    console.error('❌ Error: pnpm-lock.yaml no se generó');
    process.exit(1);
  }

  console.log('\n🎉 Problema solucionado! Ahora puedes hacer deploy en Vercel');
  console.log('💡 Comando para deploy: vercel --prod');

} catch (error) {
  console.error('❌ Error durante la ejecución:', error.message);
  console.log('\n💡 Solución manual:');
  console.log('1. cd client');
  console.log('2. del pnpm-lock.yaml');
  console.log('3. rmdir /s /q node_modules');
  console.log('4. pnpm install');
  process.exit(1);
} 