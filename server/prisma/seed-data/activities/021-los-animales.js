const { v4: uuidv4 } = require('uuid');

module.exports = {
  metadata: {
    id: uuidv4(),
    slug: "los-animales",
    created_at: new Date(),
    updated_at: new Date()
  },
  activity: {
    title: "Los animales",
    description: "Actividad para armar un puzzle de animales en grupo",
    cover_image_url: "https://i.ibb.co/YFt8WrXQ/Whats-App-Image-2025-07-27-at-22-34-09-removebg-preview.png",
    video_url: "",
    resource_urls: [
      "https://docs.google.com/document/d/1M6M3LJbhchO2xNfaS_M9i_jwDKzaVOmNCJv2tvwS7qs/edit?usp=sharing",
      "https://docs.google.com/presentation/d/1Yg-m4vGGJMzbBoMOxUF_o9XZwltOLhwa/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true"
    ],
    duration_minutes: 45,
    difficulty_level: 2,
    target_cycle: "PK",
    subject: "Pre-Kínder",
    grade_level: "Pre-Kínder",
    group_size: 8,
    bloom_level: "comprender",
    oa_ids: ["OA 12", "OA 6"],
    thematic_axis: "VIDA Y RELACIONES",
    product: "LABORATORIO MOVIL DE PARVULO",
    steps_markdown: `## Instrucción General

La educadora dispone las mesas para realizar 8 grupos.

Los párvulos se sientan en las 8 mesas en las que en el centro hay una caja con un puzzle o rompecabezas de animales (50 piezas) muy colorido y con piezas grandes.

La educadora debe tener 1 puzzle ya armado a la vista de los párvulos, en un lugar visible.

Los párvulos guiados por la educadora realizan exploración y en grupo arman el puzzle.

El jefe de cada grupo recolecta el puzzle y los guarda.

## Instrucción Específica

**Objetivo de la actividad:** Armar un puzzle de animales en grupo.

La educadora invita a los párvulos a observar el puzzle que ella previamente armó y ubicó en un lugar visible de la sala de clases.

La educadora y los párvulos establecen una conversación en la que otorgan características de los animales, describen color y tamaño de los animales, comparan entre animales algunas características morfológicas de alimentación, de reproducción y de desplazamiento, formulan preguntas en torno a características específicas de los animales, por ejemplo: las necesidades básicas que tienen para vivir y comentan las diferencias de comportamiento entre algunos animales que aparecen en el puzzle, como por ejemplo: el elefante es muy grande, su piel es arrugada y tiene una trompa que le sirve para tomar su comida y bañarse. El león tiene una melena y es carnívoro. El mono tiene una cola larga y delgada que le sirve para sujetarse de los árboles... etc.

Los párvulos ven el video musical (recurso interactivo): "Dios hizo los animales".
https://www.youtube.com/watch?v=Cgf13O6Mpjs

Luego se le pide a los párvulos que en grupo seleccionen las piezas y las ubiquen para armar el puzzle, la educadora debe estar atenta y prestar ayuda a los párvulos para completar el puzzle.

Cuando todos los grupos arman el puzzle se felicita a los párvulos.

Los párvulos ordenan y guardan las piezas del puzzle de los animales y se las pasan al jefe de grupo para que él las guarde en el laboratorio de prebásica para ser utilizado en una futura actividad.

La educadora entrega una guía de trabajo (cada animal con su grupo) los párvulos utilizando pensamiento lógico, observan los animales de cada grupo y rodean con lápiz grafito el animal intruso de cada grupo.

**Anexo para la educadora:** ppt Base teórica Los puzzles en el aprendizaje de niños y niñas en etapa prebásica`,
    indicators_markdown: `## Indicadores

- Describe semejanzas y diferencias entre plantas y animales según sus características, necesidades de alimentación y hábitat.
- Señala (indica y nombra) las acciones que podría realizar para alcanzar la meta de sus juegos o proyectos.`,
    assessment_markdown: `## Evaluación

La evaluación se realiza a través de la observación directa durante la actividad, considerando:

- Participación activa en el armado del puzzle
- Identificación de características de los animales
- Comprensión de semejanzas y diferencias
- Desarrollo del pensamiento lógico
- Trabajo colaborativo en grupo`
  },
  material: {
    name: "PUZZLE ANIMALES",
    internal_code: "puzzle-animales-los-animales",
    description: "Puzzle de animales con 50 piezas coloridas y grandes para niños de pre-kínder",
    category: "PUZZLE ANIMALES",
    thematic_axis: "VIDA Y RELACIONES"
  }
}; 