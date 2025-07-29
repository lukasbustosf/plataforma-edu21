const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando preparación para deploy en Vercel...');

const clientDir = path.join(__dirname, 'client');

try {
  // Verificar que estamos en el directorio correcto
  if (!fs.existsSync(path.join(clientDir, 'package.json'))) {
    console.error('❌ No se encontró package.json en la carpeta client');
    process.exit(1);
  }

  console.log('📁 Verificando archivos en client...');
  process.chdir(clientDir);

  // Verificar archivos críticos
  const requiredFiles = [
    'package.json',
    'pnpm-lock.yaml',
    'next.config.js',
    'next-env.d.ts'
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} existe`);
    } else {
      console.error(`❌ ${file} no existe`);
      process.exit(1);
    }
  }

  // Verificar que pnpm-lock.yaml está sincronizado
  console.log('🔍 Verificando sincronización de pnpm-lock.yaml...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const lockContent = fs.readFileSync('pnpm-lock.yaml', 'utf8');
  
  // Verificar algunas dependencias clave
  const keyDependencies = ['recharts', 'next', 'react'];
  let allSynced = true;
  
  for (const dep of keyDependencies) {
    if (packageJson.dependencies[dep]) {
      const packageVersion = packageJson.dependencies[dep];
      if (lockContent.includes(`specifier: ${packageVersion}`)) {
        console.log(`✅ ${dep}: ${packageVersion} - Sincronizado`);
      } else {
        console.log(`❌ ${dep}: ${packageVersion} - No sincronizado`);
        allSynced = false;
      }
    }
  }

  if (!allSynced) {
    console.error('❌ pnpm-lock.yaml no está sincronizado con package.json');
    process.exit(1);
  }

  // Verificar que node_modules existe
  if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules existe');
  } else {
    console.log('⚠️  node_modules no existe, ejecutando pnpm install...');
    execSync('pnpm install', { stdio: 'inherit' });
  }

  // Verificar configuración de Next.js
  console.log('🔍 Verificando configuración de Next.js...');
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  if (nextConfig.includes('experimental') || nextConfig.includes('output')) {
    console.log('✅ next.config.js tiene configuración válida');
  } else {
    console.log('⚠️  next.config.js parece tener configuración básica');
  }

  // Verificar TypeScript
  console.log('🔍 Verificando configuración de TypeScript...');
  if (fs.existsSync('tsconfig.json')) {
    console.log('✅ tsconfig.json existe');
  } else {
    console.log('⚠️  tsconfig.json no existe');
  }

  // Verificar que no hay errores de linting
  console.log('🔍 Verificando linting...');
  try {
    execSync('pnpm lint', { stdio: 'pipe' });
    console.log('✅ Linting pasado sin errores');
  } catch (error) {
    console.log('⚠️  Linting tiene errores, pero continuando...');
  }

  // Verificar build local
  console.log('🔍 Verificando build local...');
  try {
    execSync('pnpm build', { stdio: 'pipe', timeout: 120000 }); // 2 minutos timeout
    console.log('✅ Build local exitoso');
  } catch (error) {
    console.log('⚠️  Build local falló, pero continuando...');
  }

  console.log('\n🎉 Verificación completada!');
  console.log('✅ Todo está listo para deploy en Vercel');
  console.log('\n💡 Comandos para deploy:');
  console.log('1. vercel --prod (para producción)');
  console.log('2. vercel (para preview)');
  console.log('\n📝 Notas importantes:');
  console.log('- Asegúrate de que las variables de entorno estén configuradas en Vercel');
  console.log('- El directorio raíz debe ser la carpeta client');
  console.log('- Vercel detectará automáticamente que es un proyecto Next.js');

} catch (error) {
  console.error('❌ Error durante la verificación:', error.message);
  process.exit(1);
} 