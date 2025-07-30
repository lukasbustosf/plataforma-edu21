const { v4: uuidv4 } = require('uuid');

module.exports = {
  metadata: {
    id: uuidv4(),
    slug: "animales-y-modelado",
    created_at: new Date(),
    updated_at: new Date()
  },
  activity: {
    title: "Animales y modelado",
    description: "Actividad para armar y modelar los animales del puzzle",
    cover_image_url: "https://i.ibb.co/YFt8WrXQ/Whats-App-Image-2025-07-27-at-22-34-09-removebg-preview.png",
    video_url: "",
    resource_urls: [
      "https://docs.google.com/presentation/d/17z1-SE4btU5YjO-GinQGefnpS19Gj-jT/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
      "https://docs.google.com/document/d/1fla4TllANHLK0aczlQxHpe_uQ3W6l6Fsa6ZjN53MSko/edit?usp=sharing"
    ],
    duration_minutes: 45,
    difficulty_level: 2,
    target_cycle: "PK",
    subject: "Pre-Kínder",
    grade_level: "Pre-Kínder",
    group_size: 8,
    bloom_level: "comprender",
    oa_ids: ["OA 7", "OA 6"],
    thematic_axis: "VIDA Y RELACIONES",
    product: "LABORATORIO MOVIL DE PARVULO",
    steps_markdown: `## Instrucción General

La educadora dispone las mesas para realizar 8 grupos. En cada grupo hay un jefe de grupo que usa la gorra.

Los párvulos se sientan en las 8 mesas en las que en el centro hay una caja con un puzzle o rompecabezas de animales (50 piezas) muy colorido y con piezas grandes.

La educadora debe tener 1 puzzle ya armado a la vista de los párvulos, en un lugar visible y recordar que anteriormente habían armado el puzzle.

Los párvulos, guiados por la educadora, realizan exploración y en grupo arman el puzzle.

Los párvulos modelan el o los animales que más les llamó o llamaron la atención.

## Instrucción Específica

**Objetivo de la actividad:** Armar y modelar los animales del puzzle.

Los párvulos ven el video (recurso interactivo: Adivinanzas para niños de animales salvajes) y a medida que se otorgan pistas, adivinan a qué animal corresponden las características.
https://www.youtube.com/watch?v=AG3U9JzSVv4

La educadora invita a los párvulos a observar el puzzle que ella previamente armó y ubicó en un lugar visible de la sala de clases.

La educadora y los párvulos establecen una conversación en la que otorgan características específicas de los animales del puzzle, por ejemplo: desplazamiento, alimentación, cantidad de patas o dientes. Señala dos o tres semejanzas y diferencias entre los animales.

La educadora les pide a los párvulos que en grupo seleccionen las piezas y las ubiquen para armar el puzzle. La educadora debe estar atenta y prestar ayuda a los párvulos para completar el puzzle y les explica que pueden guiarse por el modelo que está armado o la experiencia anterior.

Cuando todos los grupos arman el puzzle, se felicita a los párvulos.

El jefe de cada grupo recoge el puzzle ya ordenado y lo guarda en el laboratorio de prebásica para ser utilizado en una futura actividad.

La educadora da a elegir a los párvulos si quieren modelar y colorear animales o realizar una guía de trabajo: (contando animales) para modelar los animales que más les llamaron la atención del puzzle que armaron, entrega los materiales (cerámica en frío, témperas de colores y pinceles) al jefe de cada grupo para que los reparta y para la guía entrega ficha en la que los párvulos cuentan y suma los animales para escribir el número del resultado en el circulo. (lápices grafitos y gomas)

Los párvulos muestran sus trabajos y los exhiben en el panel.

**Anexo para la educadora:** ppt Base teórica Los puzzles en el aprendizaje de niños y niñas en etapa prebásica.`,
    indicators_markdown: `## Indicadores

- Compara el proceso de crecimiento de personas, animales y plantas.
- Explica la relación entre las características de algunos animales y su hábitat.`,
    assessment_markdown: `## Evaluación

La evaluación se realiza a través de la observación directa durante la actividad, considerando:

- Participación activa en el armado del puzzle
- Identificación de características de los animales
- Comprensión de semejanzas y diferencias
- Desarrollo de habilidades motoras finas en el modelado
- Creatividad en la representación de los animales`
  },
  material: {
    name: "PUZZLE ANIMALES",
    internal_code: "puzzle-animales-modelado",
    description: "Puzzle de animales con 50 piezas coloridas y grandes para niños de pre-kínder",
    category: "PUZZLE ANIMALES",
    thematic_axis: "VIDA Y RELACIONES"
  }
}; 