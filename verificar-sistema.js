const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando sistema EDU21...\n');

// Función para verificar el servidor
async function verificarServidor() {
  try {
    console.log('📡 Verificando servidor...');
    const response = await axios.get('http://localhost:5000/health', { timeout: 5000 });
    console.log('✅ Servidor funcionando correctamente');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Timestamp: ${response.data.timestamp}`);
    return true;
  } catch (error) {
    console.log('❌ Error al conectar con el servidor');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Función para verificar el cliente
async function verificarCliente() {
  try {
    console.log('\n🌐 Verificando cliente...');
    const response = await axios.get('http://localhost:3000', { timeout: 5000 });
    console.log('✅ Cliente funcionando correctamente');
    console.log(`   Status: ${response.status}`);
    return true;
  } catch (error) {
    console.log('❌ Error al conectar con el cliente');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Función para verificar autenticación
async function verificarAutenticacion() {
  try {
    console.log('\n🔐 Verificando autenticación...');
    
    // Obtener token del archivo auto-auth.html
    const authPath = path.join(__dirname, 'auto-auth.html');
    if (!fs.existsSync(authPath)) {
      console.log('❌ No se encontró el archivo auto-auth.html');
      return false;
    }
    
    const content = fs.readFileSync(authPath, 'utf8');
    const match = content.match(/localStorage\.setItem\('auth_token', '([^']+)'\)/);
    
    if (!match) {
      console.log('❌ No se pudo extraer el token del archivo');
      return false;
    }
    
    const token = match[1];
    console.log('✅ Token encontrado en auto-auth.html');
    
    // Probar endpoint de autenticación
    const response = await axios.get('http://localhost:5000/api/auth/status', {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000
    });
    
    console.log('✅ Autenticación funcionando correctamente');
    console.log(`   Usuario: ${response.data.user.email}`);
    console.log(`   Rol: ${response.data.user.role}`);
    return true;
  } catch (error) {
    console.log('❌ Error en autenticación');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Función para verificar endpoints del lab
async function verificarLabEndpoints() {
  try {
    console.log('\n🧪 Verificando endpoints del laboratorio...');
    
    // Obtener token
    const authPath = path.join(__dirname, 'auto-auth.html');
    const content = fs.readFileSync(authPath, 'utf8');
    const match = content.match(/localStorage\.setItem\('auth_token', '([^']+)'\)/);
    const token = match[1];
    
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
    return false;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando verificación completa del sistema EDU21...\n');
  
  const resultados = {
    servidor: await verificarServidor(),
    cliente: await verificarCliente(),
    autenticacion: await verificarAutenticacion(),
    lab: await verificarLabEndpoints()
  };
  
  console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
  console.log('========================');
  console.log(`Servidor:        ${resultados.servidor ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Cliente:         ${resultados.cliente ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Autenticación:   ${resultados.autenticacion ? '✅ OK' : '❌ ERROR'}`);
  console.log(`Laboratorio:     ${resultados.lab ? '✅ OK' : '❌ ERROR'}`);
  
  const todosOk = Object.values(resultados).every(r => r);
  
  if (todosOk) {
    console.log('\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
    console.log('\n🌐 URLs importantes:');
    console.log('• Servidor: http://localhost:5000');
    console.log('• Cliente: http://localhost:3001');
    console.log('• Configuración: quick-setup.html');
    
    console.log('\n📋 Próximos pasos:');
    console.log('1. Abre quick-setup.html en tu navegador');
    console.log('2. Haz clic en "Configurar y Abrir EDU21"');
    console.log('3. ¡Disfruta usando la aplicación!');
  } else {
    console.log('\n⚠️ Hay problemas que necesitan atención');
    console.log('\n🔧 Soluciones sugeridas:');
    
    if (!resultados.servidor) {
      console.log('• Verifica que el servidor esté ejecutándose en puerto 5000');
    }
    
    if (!resultados.cliente) {
      console.log('• Verifica que el cliente esté ejecutándose en puerto 3001');
    }
    
    if (!resultados.autenticacion) {
      console.log('• Ejecuta: node auto-auth.js');
    }
    
    if (!resultados.lab) {
      console.log('• Verifica la configuración de la base de datos');
    }
  }
}

main().catch(console.error); 