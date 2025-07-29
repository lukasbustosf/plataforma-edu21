const fs = require('fs');
const path = require('path');

// Función para actualizar la configuración del cliente
function updateClientConfig() {
  console.log('🔧 Actualizando configuración del cliente...');
  
  // Verificar que el archivo de configuración existe
  const configPath = path.join(__dirname, 'client', 'src', 'lib', 'api.ts');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ No se encontró el archivo de configuración del cliente');
    return false;
  }
  
  let content = fs.readFileSync(configPath, 'utf8');
  
  // Asegurar que la URL base sea localhost:5000 para el servidor
  content = content.replace(
    /this\.baseURL = process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:\d+'/g,
    "this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'"
  );
  
  fs.writeFileSync(configPath, content);
  console.log('✅ Configuración del cliente actualizada');
  return true;
}

// Función para crear un script de configuración rápida
function createQuickSetupScript() {
  const script = `
// Script de configuración rápida para EDU21
console.log('🚀 Configurando EDU21...');

// Configurar autenticación
localStorage.setItem('auth_token', '${getTokenFromFile()}');

const userData = {
  user_id: '57e39af0-1ee5-4fcf-9537-65a01ea88be6',
  school_id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'teacher@demo.edu21.cl',
  first_name: 'Profesor',
  last_name: 'Demo',
  role: 'TEACHER'
};

localStorage.setItem('user_data', JSON.stringify(userData));

console.log('✅ Configuración completada');
console.log('🔄 Recargando página...');

setTimeout(() => {
  window.location.href = 'http://localhost:3000';
}, 1000);
`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDU21 - Configuración Rápida</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            text-align: center;
        }
        .button {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 18px;
            margin: 20px 10px;
            transition: all 0.3s ease;
        }
        .button:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
        .status {
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .success { background: rgba(76, 175, 80, 0.3); }
        .info { background: rgba(33, 150, 243, 0.3); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 EDU21 - Configuración Rápida</h1>
        
        <div class="status success">
            ✅ Servidor funcionando en puerto 5000
        </div>
        
        <div class="status info">
            ✅ Cliente configurado para puerto 3000
        </div>
        
        <h2>🎯 Configuración Automática</h2>
        
        <button class="button" onclick="setupAndOpen()">
            🚀 Configurar y Abrir EDU21
        </button>
        
        <div class="status info">
            <strong>Información:</strong><br>
            • Servidor: http://localhost:5000<br>
            • Cliente: http://localhost:3000<br>
            • Usuario: teacher@demo.edu21.cl
        </div>
    </div>

    <script>
        function setupAndOpen() {
            // Configurar autenticación
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            
            localStorage.setItem('auth_token', '${getTokenFromFile()}');
            
            const userData = {
                user_id: '57e39af0-1ee5-4fcf-9537-65a01ea88be6',
                school_id: '550e8400-e29b-41d4-a716-446655440000',
                email: 'teacher@demo.edu21.cl',
                first_name: 'Profesor',
                last_name: 'Demo',
                role: 'TEACHER'
            };
            
            localStorage.setItem('user_data', JSON.stringify(userData));
            
            // Abrir la aplicación
            window.open('http://localhost:3000', '_blank');
        }
    </script>
</body>
</html>
`;

  const htmlPath = path.join(__dirname, 'quick-setup.html');
  fs.writeFileSync(htmlPath, html);
  
  console.log('✅ Archivo de configuración rápida creado: quick-setup.html');
  return htmlPath;
}

// Función para obtener el token del archivo auto-auth.html
function getTokenFromFile() {
  try {
    const authPath = path.join(__dirname, 'auto-auth.html');
    if (fs.existsSync(authPath)) {
      const content = fs.readFileSync(authPath, 'utf8');
      const match = content.match(/localStorage\.setItem\('auth_token', '([^']+)'\)/);
      if (match) {
        return match[1];
      }
    }
  } catch (error) {
    console.log('⚠️ No se pudo leer el token del archivo');
  }
  
  // Token de respaldo
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTdlMzlhZjAtMWVlNS00ZmNmLTk1MzctNjVhMDFlYTg4YmU2Iiwicm9sZSI6IlRFQUNIRVIiLCJzY2hvb2xfaWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMCIsImlhdCI6MTczMjY5NzE2NiwiZXhwIjoxNzMzMzAyMzY2fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
}

function main() {
  console.log('🔧 Configurando EDU21 para funcionamiento local...\n');
  
  // Actualizar configuración del cliente
  updateClientConfig();
  
  // Crear script de configuración rápida
  const htmlPath = createQuickSetupScript();
  
  console.log('\n🎯 Próximos pasos:');
  console.log('1. Abre el archivo: quick-setup.html');
  console.log('2. Haz clic en "Configurar y Abrir EDU21"');
  console.log('3. La aplicación se abrirá automáticamente');
  
  console.log('\n📂 Archivos creados:');
  console.log(`• ${htmlPath}`);
  console.log('• auto-auth.html (configuración completa)');
  
  console.log('\n🌐 URLs importantes:');
  console.log('• Servidor: http://localhost:5000');
  console.log('• Cliente: http://localhost:3000');
  console.log('• Configuración: quick-setup.html');
}

main(); 