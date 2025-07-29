const axios = require('axios');

console.log('🧪 Probando actividades del laboratorio...\n');

// Token válido para desarrollo (formato esperado por el middleware)
const validToken = 'demo-token-teacher-550e8400-e29b-41d4-a716-446655440001';

async function testLabActivities() {
  try {
    console.log('🔐 Usando token de desarrollo válido...');
    
    // Probar endpoint de materiales
    console.log('\n📦 Probando endpoint de materiales...');
    const materialesResponse = await axios.get('http://localhost:5000/api/lab/materials', {
      headers: { 'Authorization': `Bearer ${validToken}` },
      timeout: 5000
    });
    
    console.log('✅ Materiales cargados correctamente');
    console.log(`   Cantidad: ${materialesResponse.data.count || materialesResponse.data.data?.length || 0}`);
    
    // Probar endpoint de actividades
    console.log('\n📚 Probando endpoint de actividades...');
    const actividadesResponse = await axios.get('http://localhost:5000/api/lab/activities', {
      headers: { 'Authorization': `Bearer ${validToken}` },
      timeout: 5000
    });
    
    console.log('✅ Actividades cargadas correctamente');
    console.log(`   Cantidad: ${actividadesResponse.data.count || actividadesResponse.data.data?.length || 0}`);
    
    // Mostrar algunas actividades si existen
    if (actividadesResponse.data.data && actividadesResponse.data.data.length > 0) {
      console.log('\n📋 Primeras actividades disponibles:');
      actividadesResponse.data.data.slice(0, 3).forEach((actividad, index) => {
        console.log(`   ${index + 1}. ${actividad.title || 'Sin título'}`);
        console.log(`      Materia: ${actividad.subject || 'N/A'}`);
        console.log(`      Ciclo: ${actividad.target_cycle || 'N/A'}`);
      });
    }
    
    // Probar endpoint de productos
    console.log('\n🛍️ Probando endpoint de productos...');
    const productosResponse = await axios.get('http://localhost:5000/api/lab/products', {
      headers: { 'Authorization': `Bearer ${validToken}` },
      timeout: 5000
    });
    
    console.log('✅ Productos cargados correctamente');
    console.log(`   Cantidad: ${productosResponse.data.count || productosResponse.data.data?.length || 0}`);
    
    console.log('\n🎉 ¡Todas las pruebas del laboratorio fueron exitosas!');
    
    return true;
  } catch (error) {
    console.log('❌ Error en las pruebas del laboratorio');
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function createValidAuthFile() {
  try {
    console.log('\n📝 Creando archivo de autenticación válido...');
    
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

    const htmlPath = 'lab-working.html';
    require('fs').writeFileSync(htmlPath, html);
    
    console.log('✅ Archivo de configuración creado: lab-working.html');
    return htmlPath;
  } catch (error) {
    console.log('❌ Error al crear archivo de configuración');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🔧 Iniciando pruebas del laboratorio...\n');
  
  // Probar actividades del laboratorio
  const testResult = await testLabActivities();
  
  if (testResult) {
    // Crear archivo de configuración válido
    const htmlPath = await createValidAuthFile();
    
    console.log('\n🎯 Próximos pasos:');
    console.log('1. Abre el archivo: lab-working.html');
    console.log('2. Haz clic en "Configurar y Abrir EDU21"');
    console.log('3. La aplicación se abrirá con permisos de laboratorio');
    
    console.log('\n📂 Archivos creados:');
    console.log(`• ${htmlPath}`);
    
    console.log('\n🌐 URLs importantes:');
    console.log('• Servidor: http://localhost:5000');
    console.log('• Cliente: http://localhost:3000');
    console.log('• Configuración: lab-working.html');
  } else {
    console.log('\n❌ Las pruebas del laboratorio fallaron');
    console.log('🔧 Esto puede indicar un problema de configuración del servidor');
  }
}

main().catch(console.error); 