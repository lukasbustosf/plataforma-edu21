const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function limpiarYCompletarActividades() {
  try {
    console.log('🧹 Limpiando actividades duplicadas y completando faltantes...\n');

    // 1. Eliminar actividades duplicadas de medios de transporte
    const actividadesDuplicadas = await prisma.lab_activity.findMany({
      where: {
        lab_material: {
          name: { contains: 'MEDIOS DE TRANSPORTE' }
        }
      },
      include: {
        lab_material: true
      }
    });

    console.log(`📋 Encontradas ${actividadesDuplicadas.length} actividades de medios de transporte`);

    // Mantener solo las más recientes o las que tienen mejor estructura
    const actividadesAMantener = [
      "Conociendo los Medios de Transporte",
      "Los sonidos de medios de transporte", 
      "¿Cómo es un medio de transporte?",
      "Reconociendo los Medios de Transporte"
    ];

    for (const actividad of actividadesDuplicadas) {
      if (!actividadesAMantener.includes(actividad.title)) {
        await prisma.lab_activity.delete({
          where: { id: actividad.id }
        });
        console.log(`🗑️ Eliminada actividad duplicada: ${actividad.title}`);
      }
    }

    // 2. Agregar las actividades faltantes
    const material = await prisma.lab_material.findFirst({
      where: {
        name: { contains: 'MEDIOS DE TRANSPORTE' }
      }
    });

    if (!material) {
      console.log('❌ No se encontró el material MEDIOS DE TRANSPORTE');
      return;
    }

    const actividadesFaltantes = [
      {
        id: "550e8400-e29b-41d4-a716-446655440017",
        slug: "a-viajar-y-recorrer-medios-transporte",
        title: "A viajar y recorrer con los medios de transporte",
        description: "Actividad para reconocer los medios de transporte y su uso a través de juegos y recursos didácticos.",
        learning_objectives: [
          "OA 2: Apreciar diversas formas de vida de comunidades, del país y del mundo, en el pasado y en el presente, tales como: viviendas, paisajes, alimentación, costumbres, identificando mediante diversas fuentes de documentación gráfica y audiovisual, sus características relevantes.",
          "OA 5: Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos."
        ],
        indicators_markdown: "- Describe diferencias y similitudes al comparar costumbres cotidianas del pasado y el presente a través de relatos, documentación gráfica o audiovisual, explicando lo que llama su atención.\n\n- Explica sus preferencias, opiniones e ideas en diversas situaciones cotidianas o juegos.",
        assessment_markdown: "- ¿Reconoce medios de transporte?\n- ¿Comunica preferencias e ideas?\n- ¿Describe características de objetos?\n- ¿Participa en actividades colaborativas?",
        resource_urls: [
          "https://docs.google.com/presentation/d/1JeaZ3HmUr07dou-C1py7ReNFFG-7WUb3/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://docs.google.com/presentation/d/1QhvxLjo0UO3r98MHCz4XMUBIfC7hbGXe/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://docs.google.com/document/d/1eIFWYG7qeoDkYOip9ehd91QTBvTgtx_l/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://drive.google.com/file/d/1oY3Ewi0YqKsDOcIKoqxFCo7fDLsOSXxE/view?usp=sharing"
        ],
        cover_image_url: "https://i.ibb.co/XZXT91xb/image-removebg-preview-1.png",
        video_url: "",
        oa_ids: ["OA 2", "OA 5"],
        duration_minutes: 45,
        group_size: 4,
        bloom_level: "comprender",
        target_cycle: "PK",
        difficulty_level: 2,
        subject: "Ciencias Sociales",
        grade_level: "Pre-Kínder",
        lab_material_id: material.id
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440018",
        slug: "sonido-transportes",
        title: "El Sonido de los Transportes",
        description: "Actividad para identificar los diferentes sonidos de medios de transporte y sus características a través de video y puzzle.",
        learning_objectives: [
          "OA 2: Apreciar diversas formas de vida de comunidades, del país y del mundo, en el pasado y en el presente, tales como: viviendas, paisajes, alimentación, costumbres, identificando mediante diversas fuentes de documentación gráfica y audiovisual, sus características relevantes.",
          "OA 5: Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos."
        ],
        indicators_markdown: "- Describe semejanzas y diferencias entre las viviendas, paisajes o las costumbres (danzas, fiestas, comida y artesanía) de su comunidad y las de otras comunidades del mundo, explicando lo que llama su atención.\n\n- Describe características de viviendas, paisajes y las costumbres (danzas, fiestas, comida y artesanía) de otras comunidades del mundo, explicando lo que llama su atención.\n\n- Explica sus preferencias, opiniones e ideas en diversas situaciones cotidianas o juegos.",
        assessment_markdown: "- ¿Identifica sonidos de transportes?\n- ¿Describe características de comunidades?\n- ¿Comunica preferencias e ideas?\n- ¿Participa en actividades colaborativas?",
        resource_urls: [
          "https://docs.google.com/document/d/1L4kyAZJ1Wrs7WJEw0PO6onPa1NMvvcq-/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://docs.google.com/presentation/d/1WSa4FiapETS8yL_-xI-qEdcF6rWtusTe/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true"
        ],
        cover_image_url: "https://i.ibb.co/XZXT91xb/image-removebg-preview-1.png",
        video_url: "",
        oa_ids: ["OA 2", "OA 5"],
        duration_minutes: 45,
        group_size: 4,
        bloom_level: "comprender",
        target_cycle: "PK",
        difficulty_level: 2,
        subject: "Ciencias Sociales",
        grade_level: "Pre-Kínder",
        lab_material_id: material.id
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440019",
        slug: "viaje-ratoncito-perez",
        title: "El viaje del ratoncito Pérez",
        description: "Actividad para comprender contenido de cuentos y expresarlo con el armado de un puzzle sobre medios de transporte.",
        learning_objectives: [
          "OA 5: Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos.",
          "OA 6: Comprender contenidos explícitos de textos literarios y no literarios, a partir de la escucha atenta, describiendo información y realizando progresivamente inferencias y predicciones."
        ],
        indicators_markdown: "- Explica el contenido o tema central de un texto escuchado.\n\n- Responde preguntas que hacen referencia al contenido explícito e implícito de un texto escuchado.\n\n- Explica sus preferencias, opiniones e ideas en diversas situaciones cotidianas o juegos.",
        assessment_markdown: "- ¿Comprende contenido de cuentos?\n- ¿Comunica preferencias e ideas?\n- ¿Responde preguntas sobre textos?\n- ¿Participa en actividades colaborativas?",
        resource_urls: [
          "https://docs.google.com/document/d/1-2Q0owwlGNAQryc7zM66TpX9FNS61Ns8/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://docs.google.com/presentation/d/19HLtdLZDXsbn2osfl-znMvxxUqZf4isl/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
          "https://drive.google.com/file/d/1DyIIjEDpIjogi3-GMfZqGEHvDINaEmYh/view?usp=sharing"
        ],
        cover_image_url: "https://i.ibb.co/XZXT91xb/image-removebg-preview-1.png",
        video_url: "",
        oa_ids: ["OA 5", "OA 6"],
        duration_minutes: 45,
        group_size: 4,
        bloom_level: "comprender",
        target_cycle: "PK",
        difficulty_level: 2,
        subject: "Ciencias Sociales",
        grade_level: "Pre-Kínder",
        lab_material_id: material.id
      }
    ];

    for (const actividadData of actividadesFaltantes) {
      try {
        const actividad = await prisma.lab_activity.create({
          data: {
            id: actividadData.id,
            slug: actividadData.slug,
            title: actividadData.title,
            description: actividadData.description,
            learning_objectives: actividadData.learning_objectives,
            indicators_markdown: actividadData.indicators_markdown,
            assessment_markdown: actividadData.assessment_markdown,
            resource_urls: actividadData.resource_urls,
            cover_image_url: actividadData.cover_image_url,
            video_url: actividadData.video_url,
            oa_ids: actividadData.oa_ids,
            duration_minutes: actividadData.duration_minutes,
            group_size: actividadData.group_size,
            bloom_level: actividadData.bloom_level,
            target_cycle: actividadData.target_cycle,
            difficulty_level: actividadData.difficulty_level,
            subject: actividadData.subject,
            grade_level: actividadData.grade_level,
            lab_material_id: actividadData.lab_material_id,
            status: "active"
          }
        });

        console.log(`✅ Actividad creada: ${actividad.title}`);
      } catch (error) {
        console.error(`❌ Error creando actividad ${actividadData.title}:`, error.message);
      }
    }

    console.log('\n✅ Proceso de limpieza y completado finalizado!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

limpiarYCompletarActividades(); 