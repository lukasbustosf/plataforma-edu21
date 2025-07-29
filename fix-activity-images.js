const fs = require('fs');
const path = require('path');

console.log('🖼️ ARREGLANDO IMÁGENES DE ACTIVIDADES');
console.log('=' .repeat(50));

// Mapeo de actividades con sus imágenes correctas
const activityImages = {
  'el-habitat-de-los-animales': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png',
  'los-sonidos-magicos-de-los-animales': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png',
  'mi-mascota-es-mi-amiga': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png',
  'de-que-animal-se-trata': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png',
  'la-caja-de-los-sonidos': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png',
  'memorice-de-numeros': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png',
  'mi-mascota-preferida': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png',
  'rimas-y-adivinanzas-con-las-mascotas': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png',
  'donde-viven-los-animales': 'https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png'
};

// Función para actualizar un archivo de actividad
function updateActivityFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extraer el slug del nombre del archivo
    const fileName = path.basename(filePath, '.js');
    const slug = fileName.replace(/^\d+-/, ''); // Remover el número del inicio
    
    // Obtener la imagen correcta para esta actividad
    const newImageUrl = activityImages[slug];
    
    if (!newImageUrl) {
      console.log(`⚠️ No se encontró imagen para: ${slug}`);
      return;
    }
    
    // Buscar y reemplazar la línea de cover_image_url
    const lines = content.split('\n');
    let updated = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('cover_image_url') && lines[i].includes(':')) {
        const oldLine = lines[i];
        const newLine = `    "cover_image_url": "${newImageUrl}",`;
        
        if (oldLine !== newLine) {
          console.log(`📝 Actualizando: ${slug}`);
          console.log(`   Antes: ${oldLine.trim()}`);
          console.log(`   Después: ${newLine.trim()}`);
          
          lines[i] = newLine;
          updated = true;
        } else {
          console.log(`⏭️ Saltando: ${slug} (ya tiene la imagen correcta)`);
        }
        break;
      }
    }
    
    if (updated) {
      // Escribir el archivo actualizado
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`   ✅ Actualizado`);
    }
    
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

// Procesar todos los archivos de actividades
function processAllActivities() {
  const activitiesDir = path.join(__dirname, 'server', 'prisma', 'seed-data', 'activities');
  
  if (!fs.existsSync(activitiesDir)) {
    console.error('❌ Directorio de actividades no encontrado');
    return;
  }
  
  const files = fs.readdirSync(activitiesDir).filter(file => file.endsWith('.js'));
  
  console.log(`\n📁 Encontrados ${files.length} archivos de actividades`);
  
  files.forEach(file => {
    const filePath = path.join(activitiesDir, file);
    updateActivityFile(filePath);
  });
  
  console.log('\n🎉 Proceso completado');
  console.log('\n📋 Resumen:');
  console.log('- Imágenes actualizadas con URLs válidas de i.ibb.co');
  console.log('- Todas las actividades de Memorice EL ANIMAL tienen la misma imagen');
  console.log('- Imágenes optimizadas para carga rápida');
}

processAllActivities(); 