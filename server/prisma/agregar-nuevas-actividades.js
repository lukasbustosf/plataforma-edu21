const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function agregarNuevasActividades() {
  try {
    console.log('🚀 Agregando nuevas actividades de medios de transporte...\n');

    // Cargar las 3 nuevas actividades
    const actividadesDir = path.join(__dirname, 'seed-data', 'activities');
    const nuevasActividades = [
      '010-a-viajar-y-recorrer.js',
      '011-sonido-transportes.js', 
      '012-viaje-ratoncito-perez.js'
    ];

    let actividadesCargadas = 0;

    for (const archivo of nuevasActividades) {
      const rutaArchivo = path.join(actividadesDir, archivo);
      
      if (fs.existsSync(rutaArchivo)) {
        const actividadData = require(rutaArchivo);
        console.log(`📚 Cargando: ${actividadData.activity.title}`);
        actividadesCargadas++;
      }
    }

    console.log(`📊 Total de nuevas actividades cargadas: ${actividadesCargadas}`);

    // Buscar el material MEDIOS DE TRANSPORTE
    const material = await prisma.lab_material.findFirst({
      where: {
        name: { contains: 'MEDIOS DE TRANSPORTE' }
      }
    });

    if (!material) {
      console.log('❌ No se encontró el material MEDIOS DE TRANSPORTE');
      return;
    }

    console.log(`✅ Material encontrado: ${material.name} (ID: ${material.id})`);

    // Crear las 3 nuevas actividades
    const nuevasActividadesData = [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        slug: "a-viajar-y-recorrer-medios-transporte",
        title: "A viajar y recorrer con los medios de transporte",
        description: "Actividad para reconocer los medios de transporte y su uso a través de juegos y recursos didácticos.",
        learning_objectives: [
          "OA 2: Apreciar diversas formas de vida de comunidades, del país y del mundo, en el pasado y en el presente, tales como: viviendas, paisajes, alimentación, costumbres, identificando mediante diversas fuentes de documentación gráfica y audiovisual, sus características relevantes.",
          "OA 5: Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos."
        ],
        indicators: [
          "Describe diferencias y similitudes al comparar costumbres cotidianas del pasado y el presente a través de relatos, documentación gráfica o audiovisual, explicando lo que llama su atención.",
          "Explica sus preferencias, opiniones e ideas en diversas situaciones cotidianas o juegos."
        ],
        resource_urls: [
          "https://docs.google.com/presentation/d/1JeaZ3HmUr07dou-C1py7ReNFFG-7WUb3/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://docs.google.com/presentation/d/1QhvxLjo0UO3r98MHCz4XMUBIfC7hbGXe/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://docs.google.com/document/d/1eIFWYG7qeoDkYOip9ehd91QTBvTgtx_l/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://drive.google.com/file/d/1oY3Ewi0YqKsDOcIKoqxFCo7fDLsOSXxE/view?usp=sharing"
        ],
        cover_image_url: "https://i.ibb.co/XZXT91xb/image-removebg-preview-1.png",
        video_url: "",
        duration_minutes: 45,
        difficulty_level: 2,
        lab_material_id: material.id
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440011",
        slug: "sonido-transportes",
        title: "El Sonido de los Transportes",
        description: "Actividad para identificar los diferentes sonidos de medios de transporte y sus características a través de video y puzzle.",
        learning_objectives: [
          "OA 2: Apreciar diversas formas de vida de comunidades, del país y del mundo, en el pasado y en el presente, tales como: viviendas, paisajes, alimentación, costumbres, identificando mediante diversas fuentes de documentación gráfica y audiovisual, sus características relevantes.",
          "OA 5: Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos."
        ],
        indicators: [
          "Describe semejanzas y diferencias entre las viviendas, paisajes o las costumbres (danzas, fiestas, comida y artesanía) de su comunidad y las de otras comunidades del mundo, explicando lo que llama su atención.",
          "Describe características de viviendas, paisajes y las costumbres (danzas, fiestas, comida y artesanía) de otras comunidades del mundo, explicando lo que llama su atención.",
          "Explica sus preferencias, opiniones e ideas en diversas situaciones cotidianas o juegos."
        ],
        resource_urls: [
          "https://docs.google.com/document/d/1L4kyAZJ1Wrs7WJEw0PO6onPa1NMvvcq-/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://docs.google.com/presentation/d/1WSa4FiapETS8yL_-xI-qEdcF6rWtusTe/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true"
        ],
        cover_image_url: "https://i.ibb.co/XZXT91xb/image-removebg-preview-1.png",
        video_url: "",
        duration_minutes: 45,
        difficulty_level: 2,
        lab_material_id: material.id
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440012",
        slug: "viaje-ratoncito-perez",
        title: "El viaje del ratoncito Pérez",
        description: "Actividad para comprender contenido de cuentos y expresarlo con el armado de un puzzle sobre medios de transporte.",
        learning_objectives: [
          "OA 5: Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos.",
          "OA 6: Comprender contenidos explícitos de textos literarios y no literarios, a partir de la escucha atenta, describiendo información y realizando progresivamente inferencias y predicciones."
        ],
        indicators: [
          "Explica el contenido o tema central de un texto escuchado.",
          "Responde preguntas que hacen referencia al contenido explícito e implícito de un texto escuchado.",
          "Explica sus preferencias, opiniones e ideas en diversas situaciones cotidianas o juegos."
        ],
        resource_urls: [
          "https://docs.google.com/document/d/1-2Q0owwlGNAQryc7zM66TpX9FNS61Ns8/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://docs.google.com/presentation/d/19HLtdLZDXsbn2osfl-znMvxxUqZf4isl/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://drive.google.com/file/d/1DyIIjEDpIjogi3-GMfZqGEHvDINaEmYh/view?usp=sharing"
        ],
        cover_image_url: "https://i.ibb.co/XZXT91xb/image-removebg-preview-1.png",
        video_url: "",
        duration_minutes: 45,
        difficulty_level: 2,
        lab_material_id: material.id
      }
    ];

    // Crear las actividades
    for (const actividadData of nuevasActividadesData) {
      try {
        const actividad = await prisma.lab_activity.upsert({
          where: { slug: actividadData.slug },
          update: {
            title: actividadData.title,
            description: actividadData.description,
            learning_objectives: actividadData.learning_objectives,
            resource_urls: actividadData.resource_urls,
            cover_image_url: actividadData.cover_image_url,
            video_url: actividadData.video_url,
            duration_minutes: actividadData.duration_minutes,
            difficulty_level: actividadData.difficulty_level,
            lab_material_id: actividadData.lab_material_id
          },
          create: {
            id: actividadData.id,
            slug: actividadData.slug,
            title: actividadData.title,
            description: actividadData.description,
            learning_objectives: actividadData.learning_objectives,
            resource_urls: actividadData.resource_urls,
            cover_image_url: actividadData.cover_image_url,
            video_url: actividadData.video_url,
            duration_minutes: actividadData.duration_minutes,
            difficulty_level: actividadData.difficulty_level,
            lab_material_id: actividadData.lab_material_id
          }
        });

        console.log(`✅ Actividad creada: ${actividad.title}`);
      } catch (error) {
        console.error(`❌ Error creando actividad ${actividadData.title}:`, error.message);
      }
    }

    console.log('\n✅ Proceso completado!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

agregarNuevasActividades(); 