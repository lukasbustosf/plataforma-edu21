const { v4: uuidv4 } = require('uuid');

module.exports = {
  metadata: {
    id: uuidv4(),
    slug: "animales-y-caracteristicas",
    created_at: new Date(),
    updated_at: new Date()
  },
  activity: {
    title: "Animales y características",
    description: "Actividad para armar, dibujar y colorear los animales del puzzle",
    cover_image_url: "https://i.ibb.co/YFt8WrXQ/Whats-App-Image-2025-07-27-at-22-34-09-removebg-preview.png",
    video_url: "",
    resource_urls: [
      "https://docs.google.com/presentation/d/1WVgtgHGtKBmLBY-teCLPt0vwp1-zrEtS/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
      "https://drive.google.com/file/d/1gk3vUvJSYM2LEGih_aRBirLTXomaX8rZ/view?usp=sharing",
      "https://docs.google.com/document/d/1vJSzaPoCAHDzqb8CRlyEwq2NGfL6TWv3D6gdQhZSzTM/edit?usp=sharing"
    ],
    duration_minutes: 45,
    difficulty_level: 2,
    target_cycle: "PK",
    subject: "Pre-Kínder",
    grade_level: "Pre-Kínder",
    group_size: 8,
    bloom_level: "comprender",
    oa_ids: ["OA 1", "OA 1"],
    thematic_axis: "VIDA Y RELACIONES",
    product: "LABORATORIO MOVIL DE PARVULO",
    steps_markdown: `## Instrucción General

La educadora dispone las mesas para realizar 8 grupos.

Los párvulos se sientan en las 8 mesas en las que en el centro hay una caja con un puzzle o rompecabezas de animales (50 piezas) muy colorido y con piezas grandes.

En cada mesa hay un jefe de grupo que usa la gorra.

La educadora debe tener 1 puzzle ya armado a la vista de los párvulos, en un lugar visible y recordar que anteriormente habían armado el puzzle.

Los párvulos guiados por la educadora realizan exploración y en grupo arman el puzzle.
Los párvulos dibujan y colorean animales.

## Instrucción Específica

**Objetivo de la actividad:** Armar, dibujar y colorear los animales del puzzle.

La educadora invita a los párvulos a observar el puzzle que ella previamente armó y ubicó en un lugar visible de la sala de clases.

La educadora y los párvulos establecen una conversación en la que otorgan características específicas de los animales del puzzle, por ejemplo: desplazamiento, alimentación, cantidad de patas o dientes. Señala dos o tres semejanzas y diferencias entre los animales.

Los párvulos ven el video interactivo anexo en recursos, "Animales salvajes").

La educadora les pide a los párvulos que en grupo seleccionen las piezas y las ubiquen para armar el puzzle, la educadora debe estar atenta y prestar ayuda a los párvulos para completar el puzzle y les explica que pueden guiarse por el modelo que está armado o la experiencia anterior.

Cuando todos los grupos arman el puzzle se felicita a los párvulos. Ordenan y guardan las piezas del puzzle de los animales y se lo pasan al jefe del grupo para que él lo guarde en el laboratorio de prebásica para ser utilizado en una futura actividad.

La educadora entrega los materiales (lápices grafitos, goma, lápices de colores de diferentes tipos) para que los párvulos dibujen y coloreen, los animales que más les llamaron la atención de los vistos en el puzzle o entrega una guía de trabajo (cada animal con su cría) en la que los párvulos deben observar los dibujos de los animales e identificar la cría de cada uno de ellos y unir con un lápiz grafito.

Finalmente, los párvulos con la ayuda de la educadora exhiben sus dibujos.

**Anexo para la educadora:** ppt Base teórica Los puzzles en el aprendizaje de niños y niñas en etapa prebásica`,
    indicators_markdown: `## Indicadores

- Comenta experiencias personales en las que ha experimentado emociones y sentimientos, tales como, amor, miedo, tristeza, alegría o ira.
- Explora el entorno, observando, manipulando y formulando preguntas sobre los cambios que ocurren en el entorno natural (personas, animales, plantas, lugares y cuerpos celestes).
- Describe lo que llama su atención sobre los cambios que ocurren en el entorno natural (personas, animales, plantas, lugares y cuerpos celestes).`,
    assessment_markdown: `## Evaluación

La evaluación se realiza a través de la observación directa durante la actividad, considerando:

- Participación activa en el armado del puzzle
- Identificación de características de los animales
- Comprensión de semejanzas y diferencias
- Expresión de emociones y sentimientos
- Desarrollo de habilidades motoras finas al dibujar y colorear`
  },
  material: {
    name: "PUZZLE ANIMALES",
    internal_code: "puzzle-animales-caracteristicas",
    description: "Puzzle de animales con 50 piezas coloridas y grandes para niños de pre-kínder",
    category: "PUZZLE ANIMALES",
    thematic_axis: "VIDA Y RELACIONES"
  }
}; 