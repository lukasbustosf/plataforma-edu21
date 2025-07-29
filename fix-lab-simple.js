const fs = require('fs');

console.log('🔧 Solucionando problema del laboratorio...\n');

// Token válido para desarrollo
const validToken = 'demo-token-teacher-550e8400-e29b-41d4-a716-446655440001';

// Crear archivo HTML con configuración válida
const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDU21 - Laboratorio Funcional</title>
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
        <h1>🧪 EDU21 - Laboratorio Funcional</h1>
        
        <div class="status success">
            ✅ Token de desarrollo configurado
        </div>
        
        <div class="status info">
            ✅ Permisos de laboratorio activos
        </div>
        
        <h2>🎯 Configuración Automática</h2>
        
        <button class="button" onclick="setupAndOpen()">
            🚀 Configurar y Abrir EDU21
        </button>
        
        <div class="status info">
            <strong>Información:</strong><br>
            • Servidor: http://localhost:5000<br>
            • Cliente: http://localhost:3000<br>
            • Usuario: profesor@demo.edu21.cl<br>
            • Rol: TEACHER (con permisos de laboratorio)
        </div>
    </div>

    <script>
        function setupAndOpen() {
            // Configurar autenticación
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            
            // Token válido para desarrollo
            localStorage.setItem('auth_token', '${validToken}');
            
            const userData = {
                user_id: '550e8400-e29b-41d4-a716-446655440001',
                school_id: '550e8400-e29b-41d4-a716-446655440000',
                email: 'profesor@demo.edu21.cl',
                first_name: 'María',
                last_name: 'González',
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

try {
  fs.writeFileSync('lab-working.html', html);
  console.log('✅ Archivo de configuración creado: lab-working.html');
  
  console.log('\n🎯 Próximos pasos:');
  console.log('1. Abre el archivo: lab-working.html');
  console.log('2. Haz clic en "Configurar y Abrir EDU21"');
  console.log('3. La aplicación se abrirá con permisos de laboratorio');
  
  console.log('\n🌐 URLs importantes:');
  console.log('• Servidor: http://localhost:5000');
  console.log('• Cliente: http://localhost:3000');
  console.log('• Configuración: lab-working.html');
  
} catch (error) {
  console.log('❌ Error al crear archivo');
  console.log(`   Error: ${error.message}`);
} 