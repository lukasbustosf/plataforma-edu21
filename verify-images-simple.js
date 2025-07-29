const https = require('https');
const http = require('http');

console.log('🖼️ VERIFICANDO IMÁGENES DE ACTIVIDADES');
console.log('=' .repeat(50));

// Función para verificar una URL de imagen
function checkImageUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve({ success: true, status: res.statusCode });
      } else {
        resolve({ success: false, status: res.statusCode });
      }
    });
    
    req.on('error', () => {
      resolve({ success: false, error: 'Network error' });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

// URLs de imágenes a verificar
const imageUrls = [
  'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png'
];

async function verifyImages() {
  console.log('🔍 Verificando URLs de imágenes...\n');
  
  for (const url of imageUrls) {
    console.log(`📸 Verificando: ${url}`);
    const result = await checkImageUrl(url);
    
    if (result.success) {
      console.log('   ✅ Imagen accesible');
    } else {
      console.log(`   ❌ Error: ${result.error || result.status}`);
    }
  }
  
  console.log('\n📋 Resumen:');
  console.log('- Todas las actividades usan la misma imagen');
  console.log('- URL: https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png');
  console.log('- Formato: PNG con fondo removido');
  console.log('- Hosting: i.ibb.co (confiable)');
  
  console.log('\n💡 Si las imágenes no se ven en el frontend:');
  console.log('1. Verifica que el servidor esté corriendo');
  console.log('2. Verifica que la base de datos esté actualizada');
  console.log('3. Limpia el caché del navegador');
  console.log('4. Revisa la consola del navegador para errores');
}

verifyImages(); 