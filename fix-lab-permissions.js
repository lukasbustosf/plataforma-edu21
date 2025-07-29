const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔧 Solucionando permisos del laboratorio...\n');

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
  
  return null;
}

// Función para probar endpoints del laboratorio
async function testLabEndpoints(token) {
  try {
    console.log('🧪 Probando endpoints del laboratorio...');
    
    // Probar endpoint de materiales
    const materialesResponse = await axios.get('http://localhost:5000/api/lab/materials', {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000
    });
    
    console.log('✅ Endpoint de materiales funcionando');
    console.log(`   Materiales encontrados: ${materialesResponse.data.length}`);
    
    // Probar endpoint de actividades
    const actividadesResponse = await axios.get('http://localhost:5000/api/lab/activities', {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000
    });
    
    console.log('✅ Endpoint de actividades funcionando');
    console.log(`   Actividades encontradas: ${actividadesResponse.data.length}`);
    
    return true;
  } catch (error) {
    console.log('❌ Error en endpoints del laboratorio');
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Función para crear un usuario demo con permisos de laboratorio
async function createLabUser() {
  try {
    console.log('👤 Creando usuario demo para laboratorio...');
    
    const userData = {
      email: 'lab@demo.edu21.cl',
      password: 'demo123',
      first_name: 'Laboratorio',
      last_name: 'Demo',
      role: 'TEACHER',
      school_id: '550e8400-e29b-41d4-a716-446655440000'
    };
    
    const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
      timeout: 5000
    });
    
    console.log('✅ Usuario de laboratorio creado');
    console.log(`   Email: ${userData.email}`);
    console.log(`   Password: ${userData.password}`);
    
    return response.data.token;
  } catch (error) {
    console.log('❌ Error al crear usuario de laboratorio');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

// Función para actualizar el archivo de configuración
function updateAuthFile(token) {
  try {
    console.log('📝 Actualizando archivo de configuración...');
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDU21 - Configuración Laboratorio</title>
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
        <h1>🧪 EDU21 - Laboratorio Configurado</h1>
        
        <div class="status success">
            ✅ Permisos de laboratorio configurados
        </div>
        
        <div class="status info">
            ✅ Usuario: lab@demo.edu21.cl
        </div>
        
        <h2>🎯 Configuración Automática</h2>
        
        <button class="button" onclick="setupAndOpen()">
            🚀 Configurar y Abrir EDU21
        </button>
        
        <div class="status info">
            <strong>Información:</strong><br>
            • Servidor: http://localhost:5000<br>
            • Cliente: http://localhost:3000<br>
            • Usuario: lab@demo.edu21.cl
        </div>
    </div>

    <script>
        function setupAndOpen() {
            // Configurar autenticación
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            
            localStorage.setItem('auth_token', '${token}');
            
            const userData = {
                user_id: '57e39af0-1ee5-4fcf-9537-65a01ea88be6',
                school_id: '550e8400-e29b-41d4-a716-446655440000',
                email: 'lab@demo.edu21.cl',
                first_name: 'Laboratorio',
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

    const htmlPath = path.join(__dirname, 'lab-setup.html');
    fs.writeFileSync(htmlPath, html);
    
    console.log('✅ Archivo de configuración de laboratorio creado: lab-setup.html');
    return htmlPath;
  } catch (error) {
    console.log('❌ Error al crear archivo de configuración');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

// Función principal
async function main() {
  console.log('🔧 Iniciando configuración de permisos del laboratorio...\n');
  
  // Obtener token actual
  let token = getTokenFromFile();
  
  if (!token) {
    console.log('❌ No se pudo obtener el token actual');
    return;
  }
  
  // Probar endpoints actuales
  const currentTest = await testLabEndpoints(token);
  
  if (currentTest) {
    console.log('\n✅ Los endpoints del laboratorio ya funcionan correctamente');
    return;
  }
  
  // Si no funcionan, crear nuevo usuario
  console.log('\n🔄 Creando nuevo usuario con permisos de laboratorio...');
  const newToken = await createLabUser();
  
  if (newToken) {
    // Probar con el nuevo token
    const newTest = await testLabEndpoints(newToken);
    
    if (newTest) {
      console.log('\n✅ Nuevo usuario creado y funcionando');
      
      // Actualizar archivo de configuración
      const htmlPath = updateAuthFile(newToken);
      
      console.log('\n🎯 Próximos pasos:');
      console.log('1. Abre el archivo: lab-setup.html');
      console.log('2. Haz clic en "Configurar y Abrir EDU21"');
      console.log('3. La aplicación se abrirá con permisos de laboratorio');
      
      console.log('\n📂 Archivos creados:');
      console.log(`• ${htmlPath}`);
      
      console.log('\n🌐 URLs importantes:');
      console.log('• Servidor: http://localhost:5000');
      console.log('• Cliente: http://localhost:3000');
      console.log('• Configuración: lab-setup.html');
    } else {
      console.log('\n❌ El nuevo usuario tampoco tiene permisos');
      console.log('🔧 Esto puede indicar un problema de configuración del servidor');
    }
  } else {
    console.log('\n❌ No se pudo crear el nuevo usuario');
  }
}

main().catch(console.error); 