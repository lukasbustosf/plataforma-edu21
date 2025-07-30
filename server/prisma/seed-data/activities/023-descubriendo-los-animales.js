const { v4: uuidv4 } = require('uuid');

module.exports = {
  metadata: {
    id: uuidv4(),
    slug: "descubriendo-los-animales",
    created_at: new Date(),
    updated_at: new Date()
  },
  activity: {
    title: "Descubriendo los animales",
    description: "Actividad para armar un puzzle de animales en grupo",
    cover_image_url: "https://i.ibb.co/YFt8WrXQ/Whats-App-Image-2025-07-27-at-22-34-09-removebg-preview.png",
    video_url: "",
    resource_urls: [
      "https://docs.google.com/presentation/d/1H-6slBi7mLDfU_0Rd3RXeo8pUFT3sEFe/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1HDyImJHPqGOqiUu8M9eudu1zJMG5IdVInHgHPbl_-Kk/edit?usp=sharing"
    ],
    duration_minutes: 45,
    difficulty_level: 2,
    target_cycle: "PK",
    subject: "Pre-Kínder",
    grade_level: "Pre-Kínder",
    group_size: 8,
    bloom_level: "comprender",
    oa_ids: ["OA 6"],
    thematic_axis: "VIDA Y RELACIONES",
    product: "LABORATORIO MOVIL DE PARVULO",
    steps_markdown: `## Instrucción General

La educadora dispone las mesas para realizar 8 grupos, en cada grupo hay un jefe de grupo que usa la gorra.

Los párvulos se sientan en las 8 mesas en las que en el centro hay una caja con un puzzle o rompecabezas de animales (50 piezas) muy colorido y con piezas grandes.

La educadora debe tener 1 puzzle ya armado a la vista de los párvulos, en un lugar visible.

Los párvulos, guiados por la educadora, realizan exploración y en grupo arman el puzzle.

Realizan ficha para colorear animales salvajes.

## Instrucción Específica

**Objetivo de la actividad:** Armar un puzzle de animales en grupo.

La educadora invita a los párvulos a observar el puzzle que ella previamente armó y ubicó en un lugar visible de la sala de clases.

La educadora y los párvulos establecen una conversación en la que otorgan características de los animales, describen color y tamaño de los animales, comparan entre animales algunas características morfológicas de alimentación, de reproducción y de desplazamiento, reconocen si son animales domésticos o salvajes, formulan preguntas en torno a características específicas de los animales, por ejemplo, las necesidades básicas que tienen para vivir y comentan las diferencias de comportamiento entre algunos animales que aparecen en el puzzle, como por ejemplo:

1. En el puzzle aparecen 3 loros, los loros tienen su cuerpo cubierto de plumas muy coloridas, tienen un pico que les sirve para alimentarse, se reproducen por huevos y hay loros que pueden imitar palabras.

2. El rinoceronte es una animal salvaje al que le gusta comer hierbas, tiene dos cuernos en su cabeza, tiene 4 patas y corre muy rápido cuando es amenazado por un depredador.

3. El elefante es muy grande, su piel es arrugada y tiene una trompa que le sirve para tomar su comida y bañarse.

Cuando todos los grupos arman el puzzle, se felicita a los párvulos y el jefe del grupo recoge el puzzle, lo ordena con la ayuda de sus compañeros y guarda en el laboratorio de prebásica para ser utilizado en una futura actividad.

El jefe del grupo reparte las fichas (guía de trabajo: ficha colorear animales salvajes) y los materiales que le entrega la educadora, los párvulos colorean solo los animales salvajes de la ficha y muestran sus trabajos.

**Anexo para la educadora:** ppt Base teórica Los puzzles en el aprendizaje de niños y niñas en etapa prebásica.`,
    indicators_markdown: `## Indicadores

- Plantea conjeturas sobre las necesidades básicas que son comunes a todos los seres vivos.`,
    assessment_markdown: `## Evaluación

La evaluación se realiza a través de la observación directa durante la actividad, considerando:

- Participación activa en el armado del puzzle
- Identificación de características de los animales
- Diferenciación entre animales domésticos y salvajes
- Comprensión de necesidades básicas de los seres vivos
- Desarrollo de habilidades motoras finas al colorear`
  },
  material: {
    name: "PUZZLE ANIMALES",
    internal_code: "puzzle-animales-descubriendo",
    description: "Puzzle de animales con 50 piezas coloridas y grandes para niños de pre-kínder",
    category: "PUZZLE ANIMALES",
    thematic_axis: "VIDA Y RELACIONES"
  }
}; 