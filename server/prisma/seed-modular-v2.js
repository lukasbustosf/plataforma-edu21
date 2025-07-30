const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function loadActivityData() {
  const activitiesDir = path.join(__dirname, 'seed-data', 'activities');
  const activityFiles = fs.readdirSync(activitiesDir)
    .filter(file => file.endsWith('.js'))
    .sort();

  const activities = [];
  
  for (const file of activityFiles) {
    try {
      const activityData = require(path.join(activitiesDir, file));
      activities.push(activityData);
      console.log(`✅ Cargado: ${file}`);
    } catch (error) {
      console.error(`❌ Error cargando ${file}:`, error.message);
    }
  }
  
  return activities;
}

async function upsertMaterials() {
  console.log('\n🔧 Procesando materiales...');
  
  try {
    // Buscar el producto "Laboratorio movil de Parvulo - ParvuLAB"
    const product = await prisma.lab_product.findFirst({
      where: {
        name: { contains: 'Laboratorio movil de Parvulo' }
      }
    });

    if (!product) {
      console.log('❌ No se encontró el producto "Laboratorio movil de Parvulo"');
      return;
    }

    console.log(`✅ Producto encontrado: ${product.name} (ID: ${product.id})`);

    // Crear o actualizar materiales únicos
    const materials = [
      {
        name: "MEMORICE EL ANIMAL",
        internal_code: "PARVULAB-M05",
        lab_product_id: product.id,
        quantity_per_kit: 9
      },
      {
        name: "MEDIOS DE TRANSPORTE",
        internal_code: "PARVULAB-M06",
        lab_product_id: product.id,
        quantity_per_kit: 9
      }
    ];

    for (const materialData of materials) {
      const material = await prisma.lab_material.upsert({
        where: {
          internal_code: materialData.internal_code
        },
        update: {
          name: materialData.name,
          lab_product_id: materialData.lab_product_id,
          quantity_per_kit: materialData.quantity_per_kit
        },
        create: {
          name: materialData.name,
          internal_code: materialData.internal_code,
          lab_product_id: materialData.lab_product_id,
          quantity_per_kit: materialData.quantity_per_kit,
          status: "active"
        }
      });
      
      console.log(`✅ Material procesado: ${material.name}`);
    }

  } catch (error) {
    console.error('❌ Error procesando materiales:', error);
  }
}

async function upsertActivities(activities) {
  console.log('\n📚 Procesando actividades...');
  
  for (const activityData of activities) {
    try {
      const { metadata, activity, material } = activityData;
      
      // Buscar el material correspondiente
      const labMaterial = await prisma.lab_material.findFirst({
        where: {
          name: material.name
        }
      });

      if (!labMaterial) {
        console.log(`❌ No se encontró el material: ${material.name}`);
        continue;
      }

      // Preparar datos de la actividad
      const activityRecord = {
        id: metadata.id,
        slug: metadata.slug,
        title: activity.title,
        description: activity.description,
        steps_markdown: activity.steps_markdown,
        learning_objectives: activity.learning_objectives,
        indicators_markdown: activity.indicators_markdown,
        assessment_markdown: activity.assessment_markdown,
        resource_urls: activity.resource_urls,
        cover_image_url: activity.cover_image_url,
        video_url: activity.video_url,
        oa_ids: activity.oa_ids,
        duration_minutes: activity.duration_minutes,
        group_size: activity.group_size,
        bloom_level: activity.bloom_level,
        target_cycle: activity.target_cycle,
        difficulty_level: activity.difficulty_level,
        subject: activity.subject,
        grade_level: activity.grade_level,
        lab_material_id: labMaterial.id,
        status: metadata.status
      };

      // Crear o actualizar la actividad
      const result = await prisma.lab_activity.upsert({
        where: {
          id: metadata.id
        },
        update: activityRecord,
        create: activityRecord
      });

      console.log(`✅ Actividad procesada: ${result.title}`);

    } catch (error) {
      console.error(`❌ Error procesando actividad ${activityData.metadata?.title}:`, error.message);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando siembra modular v2...\n');
    
    // Cargar datos de actividades
    const activities = await loadActivityData();
    console.log(`\n📋 Total de actividades cargadas: ${activities.length}`);
    
    // Procesar materiales
    await upsertMaterials();
    
    // Procesar actividades
    await upsertActivities(activities);
    
    console.log('\n✅ Siembra modular v2 completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en siembra modular v2:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 