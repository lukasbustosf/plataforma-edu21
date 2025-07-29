const fs = require('fs');
const path = require('path');

console.log('🔄 Gestor de Entornos EDU21');
console.log('============================');

const clientEnvPath = path.join(__dirname, 'client', '.env.local');
const serverEnvPath = path.join(__dirname, 'server', '.env');

// Configuraciones de entornos
const environments = {
  local: {
    client: {
      NEXT_PUBLIC_API_URL: 'http://localhost:5000'
    },
    server: {
      NODE_ENV: 'development',
      PORT: '5000'
    }
  },
  production: {
    client: {
      NEXT_PUBLIC_API_URL: 'https://plataforma-edu21-production.up.railway.app'
    },
    server: {
      NODE_ENV: 'production',
      PORT: '5000'
    }
  }
};

function createEnvFile(content, filePath) {
  const envContent = Object.entries(content)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(filePath, envContent);
  console.log(`✅ Archivo creado: ${filePath}`);
}

function switchToEnvironment(env) {
  console.log(`\n🔄 Cambiando a entorno: ${env.toUpperCase()}`);
  console.log('=====================================');

  if (!environments[env]) {
    console.log('❌ Entorno no válido. Usa: local o production');
    return;
  }

  // Configurar cliente
  if (environments[env].client) {
    createEnvFile(environments[env].client, clientEnvPath);
  }

  // Configurar servidor (solo variables específicas del entorno)
  if (environments[env].server) {
    // Leer el archivo .env actual del servidor
    let serverEnvContent = '';
    try {
      serverEnvContent = fs.readFileSync(serverEnvPath, 'utf8');
    } catch (error) {
      console.log('⚠️  No se encontró archivo .env del servidor, creando uno nuevo...');
    }

    // Parsear el contenido actual
    const currentEnv = {};
    serverEnvContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        currentEnv[key.trim()] = value.trim();
      }
    });

    // Actualizar solo las variables específicas del entorno
    Object.assign(currentEnv, environments[env].server);

    // Escribir el archivo actualizado
    const updatedContent = Object.entries(currentEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(serverEnvPath, updatedContent);
    console.log(`✅ Servidor configurado para: ${env}`);
  }

  console.log(`\n✅ Entorno cambiado a: ${env.toUpperCase()}`);
  console.log(`📋 Cliente: ${environments[env].client.NEXT_PUBLIC_API_URL}`);
  console.log(`📋 Servidor: ${environments[env].server.NODE_ENV} en puerto ${environments[env].server.PORT}`);
}

function showCurrentEnvironment() {
  console.log('\n📊 Estado Actual de Entornos:');
  console.log('==============================');

  // Verificar cliente
  let clientEnv = 'No configurado';
  try {
    const clientContent = fs.readFileSync(clientEnvPath, 'utf8');
    const apiUrl = clientContent.match(/NEXT_PUBLIC_API_URL=(.+)/);
    if (apiUrl) {
      clientEnv = apiUrl[1];
    }
  } catch (error) {
    // Archivo no existe
  }

  // Verificar servidor
  let serverEnv = 'No configurado';
  try {
    const serverContent = fs.readFileSync(serverEnvPath, 'utf8');
    const nodeEnv = serverContent.match(/NODE_ENV=(.+)/);
    if (nodeEnv) {
      serverEnv = nodeEnv[1];
    }
  } catch (error) {
    // Archivo no existe
  }

  console.log(`🌐 Cliente: ${clientEnv}`);
  console.log(`⚙️  Servidor: ${serverEnv}`);
}

function createQuickSetup() {
  console.log('\n🚀 Creando configuración rápida...');
  
  // Crear script de inicio rápido
  const quickSetupContent = `@echo off
echo 🚀 Iniciando EDU21 - Entorno Local
echo =================================

echo 📁 Iniciando servidor...
cd server
start "EDU21 Server" cmd /k "node index.js"

echo 📁 Iniciando cliente...
cd ../client
start "EDU21 Client" cmd /k "npm run dev"

echo ✅ Ambos servicios iniciados
echo 🌐 Cliente: http://localhost:3000
echo ⚙️  Servidor: http://localhost:5000
pause
`;

  fs.writeFileSync('iniciar-local.bat', quickSetupContent);
  console.log('✅ Archivo iniciar-local.bat creado');
}

// Procesar argumentos
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'local':
    switchToEnvironment('local');
    break;
  case 'production':
    switchToEnvironment('production');
    break;
  case 'status':
    showCurrentEnvironment();
    break;
  case 'setup':
    createQuickSetup();
    break;
  default:
    console.log('\n📋 Uso del script:');
    console.log('==================');
    console.log('node switch-environments.js local     - Cambiar a entorno local');
    console.log('node switch-environments.js production - Cambiar a entorno producción');
    console.log('node switch-environments.js status     - Ver estado actual');
    console.log('node switch-environments.js setup      - Crear script de inicio rápido');
    console.log('\n💡 Tip: Usa "node switch-environments.js local" para desarrollo');
} 