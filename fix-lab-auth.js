const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando autenticación para laboratorio...');

// Token de desarrollo para TEACHER
const demoToken = 'demo-token-teacher-550e8400-e29b-41d4-a716-446655440001';
const userData = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'profesor@demo.edu21.cl',
  name: 'Profesor Demo',
  role: 'TEACHER',
  school_id: '550e8400-e29b-41d4-a716-446655440000'
};

// Crear script HTML para configurar localStorage
const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuración Laboratorio EDU21</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #fff;
        }
        .status {
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .success { background: rgba(76, 175, 80, 0.3); }
        .error { background: rgba(244, 67, 54, 0.3); }
        button {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
            transition: background 0.3s;
        }
        button:hover {
            background: #45a049;
        }
        .button-group {
            text-align: center;
            margin-top: 30px;
        }
        .info {
            background: rgba(33, 150, 243, 0.3);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Configuración Laboratorio EDU21</h1>
        
        <div class="info">
            <strong>📋 Instrucciones:</strong>
            <ol>
                <li>Haz clic en "Configurar Autenticación"</li>
                <li>Espera a que aparezca el mensaje de éxito</li>
                <li>Haz clic en "Abrir Laboratorio"</li>
            </ol>
        </div>

        <div id="status" class="status">
            Estado: Esperando configuración...
        </div>

        <div class="button-group">
            <button onclick="configureAuth()">🔐 Configurar Autenticación</button>
            <button onclick="openLab()" id="openLabBtn" disabled>🧪 Abrir Laboratorio</button>
            <button onclick="checkStatus()">🔍 Verificar Estado</button>
        </div>

        <div id="details" class="status" style="display: none;">
            <strong>Detalles de configuración:</strong>
            <div id="tokenInfo"></div>
            <div id="userInfo"></div>
        </div>
    </div>

    <script>
        function configureAuth() {
            const statusDiv = document.getElementById('status');
            const openLabBtn = document.getElementById('openLabBtn');
            const detailsDiv = document.getElementById('details');
            const tokenInfo = document.getElementById('tokenInfo');
            const userInfo = document.getElementById('userInfo');

            try {
                // Configurar token
                localStorage.setItem('auth_token', '${demoToken}');
                
                // Configurar datos del usuario
                localStorage.setItem('user_data', JSON.stringify(${JSON.stringify(userData)}));
                
                // Verificar que se guardó correctamente
                const savedToken = localStorage.getItem('auth_token');
                const savedUser = localStorage.getItem('user_data');
                
                if (savedToken && savedUser) {
                    statusDiv.innerHTML = '✅ <strong>Autenticación configurada exitosamente!</strong><br>Token y datos de usuario guardados correctamente.';
                    statusDiv.className = 'status success';
                    openLabBtn.disabled = false;
                    
                    // Mostrar detalles
                    detailsDiv.style.display = 'block';
                    tokenInfo.innerHTML = '<strong>Token:</strong> ' + savedToken.substring(0, 20) + '...';
                    userInfo.innerHTML = '<strong>Usuario:</strong> ' + JSON.parse(savedUser).name + ' (' + JSON.parse(savedUser).role + ')';
                } else {
                    throw new Error('No se pudieron guardar los datos');
                }
            } catch (error) {
                statusDiv.innerHTML = '❌ <strong>Error al configurar:</strong> ' + error.message;
                statusDiv.className = 'status error';
            }
        }

        function openLab() {
            window.open('http://localhost:3000/teacher/labs/activities', '_blank');
        }

        function checkStatus() {
            const statusDiv = document.getElementById('status');
            const token = localStorage.getItem('auth_token');
            const user = localStorage.getItem('user_data');
            
            if (token && user) {
                const userData = JSON.parse(user);
                statusDiv.innerHTML = '✅ <strong>Autenticación activa:</strong><br>Usuario: ' + userData.name + ' (' + userData.role + ')';
                statusDiv.className = 'status success';
            } else {
                statusDiv.innerHTML = '❌ <strong>No hay autenticación configurada</strong><br>Haz clic en "Configurar Autenticación"';
                statusDiv.className = 'status error';
            }
        }

        // Verificar estado al cargar
        window.onload = function() {
            checkStatus();
        };
    </script>
</body>
</html>`;

// Guardar el archivo HTML
const htmlPath = path.join(__dirname, 'lab-auth-setup.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('✅ Archivo HTML creado:', htmlPath);
console.log('');
console.log('📋 Instrucciones:');
console.log('1. Abre el archivo lab-auth-setup.html en tu navegador');
console.log('2. Haz clic en "Configurar Autenticación"');
console.log('3. Haz clic en "Abrir Laboratorio"');
console.log('');
console.log('🔗 URL del archivo:', `file://${htmlPath.replace(/\\/g, '/')}`);
console.log('');
console.log('🎯 Token configurado:', demoToken);
console.log('👤 Usuario:', userData.name, `(${userData.role})`);

// Intentar abrir el archivo automáticamente
try {
    const { exec } = require('child_process');
    exec(`start "" "${htmlPath}"`, (error) => {
        if (error) {
            console.log('⚠️  No se pudo abrir automáticamente. Abre manualmente:', htmlPath);
        } else {
            console.log('🌐 Abriendo configuración en el navegador...');
        }
    });
} catch (error) {
    console.log('⚠️  Abre manualmente el archivo:', htmlPath);
} 