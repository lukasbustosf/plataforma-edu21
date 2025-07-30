const { v4: uuidv4 } = require('uuid');

module.exports = {
  metadata: {
    id: uuidv4(),
    slug: "quien-come-que",
    created_at: new Date(),
    updated_at: new Date()
  },
  activity: {
    title: "¿Quién come qué?",
    description: "Actividad para identificar cuál es la alimentación de los animales",
    cover_image_url: "https://i.ibb.co/YFt8WrXQ/Whats-App-Image-2025-07-27-at-22-34-09-removebg-preview.png",
    video_url: "",
    resource_urls: [
      "https://drive.google.com/file/d/12AL7x1XJegzsN-ruERxEf2poQSQGpzmB/view?usp=sharing",
      "https://docs.google.com/document/d/12vuUeeYMA-KDx392CX70kqo_rc_Siizu/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true",
      "https://docs.google.com/presentation/d/1R5NQEPIIel1e22-nQd3Su9X_7UgOvutp/edit?usp=sharing&ouid=116920741338788258588&rtpof=true&sd=true"
    ],
    duration_minutes: 45,
    difficulty_level: 2,
    target_cycle: "PK",
    subject: "Pre-Kínder",
    grade_level: "Pre-Kínder",
    group_size: 9,
    bloom_level: "comprender",
    oa_ids: ["OA 7", "OA 6"],
    thematic_axis: "VIDA Y RELACIONES",
    product: "LABORATORIO MOVIL DE PARVULO",
    steps_markdown: `## Instrucción General

La educadora dispone las mesas para realizar 9 grupos de trabajo, en cada mesa se encuentra el recurso "Puzzle de animales".

Los párvulos se sientan en las mesas.

Los párvulos observan, exploran el material, dando características de lo que ven, juegan libremente durante un período de 5 minutos.

La educadora utiliza la pantalla Classdtouch para trabajar los recursos pedagógicos.

En cada grupo hay un jefe de grupo que usa la gorra.

El jefe de grupo es el encargado de:

1.- Guardar el recurso en el laboratorio móvil.

2.- Entregar la guía de trabajo y materiales a sus compañeros.

## Instrucción Específica

**Objetivo de la actividad:** identificar cuál es la alimentación de los animales.

La educadora solicita a los párvulos que se distribuyan en 9 grupos de trabajo, cada grupo en una mesa, eligen un jefe de grupo, el que se identifica con el gorro que se encuentra en el laboratorio.

Mediante la presente actividad, los párvulos ejercitan sus habilidades blandas a través del trabajo grupal y ponen en práctica estrategias de comunicación oral y desarrollan su capacidad expresiva.

La educadora para incentivar el trabajo de los párvulos les presenta el recurso "Puzzle animales" para descubrir conocimientos previos les da 5 minutos para que interactúen con el recurso.

Luego les pregunta:

- ¿Qué creen que vamos a conocer hoy?
- ¿Conocen los animales?
- ¿Saben de qué se alimentan?

La educadora solicita a los niños y niñas ordenar el recurso y entregarlo al jefe de grupo para que lo ordenen en el laboratorio de preescolar, para ser usado en otra oportunidad.

La educadora les presenta el video ¿Qué comen? Y les muestra el primer Flash Player "¿Quién come qué?" Para interactuar, les da las instrucciones del juego:

- primero deben elegir un animal para jugar
- tendrán que fijarse si es carnívoro, herbívoro u omnívoro
- se les da de comer según gusto y necesidades de cada animal
- al mover el animal con el lápiz, este va atrapando los alimentos que caen del cielo.
- si les dan de comer un alimento que es de su agrado y necesario para él, gana puntos
- si le dan alimentos que no son de su agrado y no necesita, perderán puntos.

La educadora, con la ayuda de los párvulos, comienza el juego. Los párvulos son los que eligen el animal con el que la educadora comienza la demostración del juego. Posteriormente, los hace pasar uno a uno para que desarrollen la actividad de manera colectiva.

Posteriormente, la educadora comparte con los párvulos el segundo Flash Player "Zoo 3" y desarrolla la actividad de manera colectiva. En este juego deben ayudar a MANOLO (un extraterrestre) a superar una prueba para conseguir un trabajo en el zoo de la ciudad, debe alimentar a 6 animales, pulsando el alimento que corresponde a su tipo de alimentación, cada vez que acierten con el alimento, sumaran 5 puntos y cada vez que se equivoquen se restaran 5 puntos. Para que MANOLO consiga el trabajo, debe lograr a lo menos 20 puntos.

Para finalizar, la educadora entrega una guía de trabajo, "¿Quién come qué?", al jefe de grupo, quien se las entrega a sus compañeros, junto con los materiales (lápiz, grafito, lápices de colores).

La educadora da las instrucciones necesarias e incentiva a los párvulos a desarrollar guía de reforzamiento.

Finalmente, los párvulos muestran sus trabajos y con la ayuda de la educadora los ubican en el panel.`,
    indicators_markdown: `## Indicadores

- Compara algunas características de personas, animales y plantas que crecen en distintos contextos (condiciones climáticas, niveles de contaminación, fuentes de alimentación u otras).
- Plantea conjeturas sobre las necesidades básicas que son comunes a todos los seres vivos.
- Explica la relación entre las características de algunos animales y su hábitat.`,
    assessment_markdown: `## Evaluación

La evaluación se realiza a través de la observación directa durante la actividad, considerando:

- Participación activa en los juegos interactivos
- Identificación de tipos de alimentación (carnívoro, herbívoro, omnívoro)
- Comprensión de las necesidades básicas de los animales
- Desarrollo de habilidades de comunicación oral
- Trabajo colaborativo en grupo`
  },
  material: {
    name: "PUZZLE ANIMALES",
    internal_code: "puzzle-animales-quien-come",
    description: "Puzzle de animales con 50 piezas coloridas y grandes para niños de pre-kínder",
    category: "PUZZLE ANIMALES",
    thematic_axis: "VIDA Y RELACIONES"
  }
}; 