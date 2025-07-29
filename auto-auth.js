const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function getDemoToken() {
  try {
    console.log('🔐 Obteniendo token demo...');
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'teacher@demo.edu21.cl',
      password: 'demo123'
    });
    
    if (loginResponse.data.token) {
      console.log('✅ Token obtenido exitosamente');
      return loginResponse.data.token;
    }
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.response?.data || error.message);
    return null;
  }
}

function createAuthScript(token) {
  return `
// Script de autenticación automática para EDU21
console.log('🔐 Configurando autenticación demo...');

// Limpiar tokens existentes
localStorage.removeItem('auth_token');
localStorage.removeItem('user_data');

// Configurar token demo
localStorage.setItem('auth_token', '${token}');

// Configurar datos del usuario demo
const userData = {
  user_id: '57e39af0-1ee5-4fcf-9537-65a01ea88be6',
  school_id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'teacher@demo.edu21.cl',
  first_name: 'Profesor',
  last_name: 'Demo',
  role: 'TEACHER'
};

localStorage.setItem('user_data', JSON.stringify(userData));

console.log('✅ Autenticación configurada');
console.log('🔄 Recargando página...');

// Recargar la página
setTimeout(() => {
  window.location.reload();
}, 1000);
`;
}

function createHTMLFile(token) {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDU21 - Autenticación Automática</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .success { color: #28a745; font-weight: bold; }
        .warning { color: #ffc107; font-weight: bold; }
        .error { color: #dc3545; font-weight: bold; }
        .code {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            white-space: pre-wrap;
            border: 1px solid #dee2e6;
        }
        .button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        .button:hover { background: #0056b3; }
        .button.success { background: #28a745; }
        .button.success:hover { background: #1e7e34; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 EDU21 - Autenticación Automática</h1>
        
        <div class="success">
            ✅ Token demo generado exitosamente
        </div>
        
        <h2>🚀 Opciones de Configuración:</h2>
        
        <button class="button success" onclick="setupAuthAndOpen()">
            🎯 Configurar y Abrir EDU21 (Recomendado)
        </button>
        
        <button class="button" onclick="openEDU21()">
            🌐 Solo Abrir EDU21
        </button>
        
        <h2>📋 Instrucciones Manuales:</h2>
        <ol>
            <li>Abre <a href="http://localhost:3001" target="_blank">http://localhost:3001</a></li>
            <li>Presiona <strong>F12</strong> para abrir las herramientas de desarrollador</li>
            <li>Ve a la pestaña <strong>Console</strong></li>
            <li>Copia y pega el siguiente código:</li>
        </ol>
        
        <div class="code">${createAuthScript(token)}</div>
        
        <h2>📝 Información del Usuario Demo:</h2>
        <ul>
            <li><strong>Email:</strong> teacher@demo.edu21.cl</li>
            <li><strong>Contraseña:</strong> demo123</li>
            <li><strong>Rol:</strong> TEACHER</li>
            <li><strong>Nombre:</strong> Profesor Demo</li>
        </ul>
        
        <div class="warning">
            ⚠️ Nota: Este token es válido por 7 días. Si expira, ejecuta este script nuevamente.
        </div>
    </div>

    <script>
        function setupAuthAndOpen() {
            // Configurar autenticación
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            
            localStorage.setItem('auth_token', '${token}');
            
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
            window.open('http://localhost:3001', '_blank');
        }
        
        function openEDU21() {
            window.open('http://localhost:3001', '_blank');
        }
    </script>
</body>
</html>
`;

  return html;
}

async function main() {
  console.log('🚀 Configurando autenticación automática...\n');
  
  // Esperar un poco para que el servidor esté listo
  console.log('⏳ Esperando que el servidor esté listo...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const token = await getDemoToken();
  
  if (!token) {
    console.log('❌ No se pudo obtener el token');
    console.log('💡 Asegúrate de que el servidor esté ejecutándose en puerto 5000');
    return;
  }
  
  // Crear archivo HTML con instrucciones
  const htmlContent = createHTMLFile(token);
  const htmlPath = path.join(__dirname, 'auto-auth.html');
  
  fs.writeFileSync(htmlPath, htmlContent);
  
  console.log('✅ Archivo de configuración creado: auto-auth.html');
  console.log('📂 Ubicación:', htmlPath);
  
  // Abrir el archivo HTML automáticamente
  console.log('🌐 Abriendo configuración automática...');
  exec(`start ${htmlPath}`);
  
  console.log('\n🎯 Próximos pasos:');
  console.log('1. Se abrirá una página web con opciones de configuración');
  console.log('2. Haz clic en "Configurar y Abrir EDU21"');
  console.log('3. La aplicación se abrirá automáticamente con autenticación');
  console.log('\n🔑 Token generado:', token.substring(0, 50) + '...');
}

main().catch(console.error); 