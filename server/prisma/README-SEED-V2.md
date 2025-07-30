# Sistema de Siembra Modular EDU21 - Versión 2.0

## 🎯 Resumen

El sistema de siembra modular v2 es una versión mejorada que utiliza una estructura de datos más completa y organizada, basada en el modelo que se muestra en el frontend de la aplicación.

## 📁 Estructura de Archivos

### Estructura de Actividad (Nueva)

```javascript
module.exports = {
  "metadata": {
    "id": "550e8400-e29b-41d4-a716-446655440013",
    "slug": "conociendo-medios-transporte",
    "title": "Conociendo los Medios de Transporte",
    "product": "LABORATORIO MOVIL DE PARVULO",
    "thematic_axis": "VIDA Y RELACIONES",
    "material_name": "MEDIOS DE TRANSPORTE",
    "status": "active"
  },
  "activity": {
    "description": "Armar e identificar los diferentes medios de transporte presentados en el puzzle",
    "steps_markdown": "## Instrucción General\n\n...",
    "learning_objectives": [
      "OA 5: Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos.",
      "OA 2: Experimentar con diversos objetos estableciendo relaciones..."
    ],
    "indicators_markdown": "- Nombra los atributos que usó al clasificar elementos.\n\n- Describe algunas semejanzas...",
    "assessment_markdown": "- ¿Arma e identifica puzzle de medios de transporte?\n- ¿Comunica proceso de resolución?...",
    "resource_urls": [
      "https://docs.google.com/document/d/1D9Mc2YVnUfBRAKiDoGkuqHhGBVXW77nX/edit?usp=sharing...",
      "https://docs.google.com/presentation/d/1GOevNo79NAwYFs7w4Gb612ljH01dnliN/edit?usp=sharing..."
    ],
    "cover_image_url": "https://i.ibb.co/XZXT91xb/image-removebg-preview-1.png",
    "video_url": "",
    "oa_ids": ["OA 5", "OA 2"],
    "duration_minutes": 45,
    "group_size": 4,
    "bloom_level": "comprender",
    "target_cycle": "PK",
    "difficulty_level": 2,
    "subject": "Ciencias Sociales",
    "grade_level": "Pre-Kínder"
  },
  "material": {
    "name": "MEDIOS DE TRANSPORTE",
    "internal_code": "PARVULAB-M06",
    "quantity_per_kit": 9
  }
};
```

## 🚀 Comandos Disponibles

### Siembra Modular V2 (Recomendado)
```bash
npm run seed:modular-v2
# o
node seed-modular-v2.js
```

### Siembra Modular Original
```bash
npm run seed:modular
# o
node seed-modular.js
```

### Verificación y Limpieza
```bash
# Verificar actividades faltantes
node verificar-actividades-faltantes.js

# Limpiar duplicadas
node limpiar-duplicadas-final.js

# Verificar todas las actividades
node verificar-todas-actividades.js
```

## 📊 Mejoras en V2

### 1. Estructura de Datos Mejorada
- **metadata**: Información básica de la actividad
- **activity**: Contenido educativo completo
- **material**: Información del material didáctico

### 2. Campos Completos
- `steps_markdown`: Instrucciones en formato Markdown
- `learning_objectives`: Objetivos de aprendizaje
- `indicators_markdown`: Indicadores de evaluación
- `assessment_markdown`: Criterios de evaluación
- `oa_ids`: IDs de objetivos de aprendizaje
- `group_size`: Tamaño del grupo
- `bloom_level`: Nivel de Bloom
- `target_cycle`: Ciclo objetivo
- `subject`: Asignatura
- `grade_level`: Nivel de grado

### 3. Validación Automática
- Verificación de materiales existentes
- Manejo de duplicadas
- Validación de estructura de datos

## 📋 Actividades de Medios de Transporte

### ✅ Actividades Implementadas (7 total)

1. **Conociendo los Medios de Transporte**
   - ID: `550e8400-e29b-41d4-a716-446655440013`
   - Slug: `conociendo-medios-transporte`
   - OAs: OA 5, OA 2

2. **Los sonidos de medios de transporte**
   - ID: `550e8400-e29b-41d4-a716-446655440014`
   - Slug: `sonidos-medios-transporte`
   - OAs: OA 3, OA 1

3. **¿Cómo es un medio de transporte?**
   - ID: `550e8400-e29b-41d4-a716-446655440015`
   - Slug: `como-es-medio-transporte`
   - OAs: OA 3, OA 6

4. **Reconociendo los Medios de Transporte**
   - ID: `550e8400-e29b-41d4-a716-446655440016`
   - Slug: `reconociendo-medios-transporte`
   - OAs: OA 12, OA 5

5. **A viajar y recorrer con los medios de transporte**
   - ID: `550e8400-e29b-41d4-a716-446655440017`
   - Slug: `a-viajar-y-recorrer-medios-transporte`
   - OAs: OA 2, OA 5

6. **El Sonido de los Transportes**
   - ID: `550e8400-e29b-41d4-a716-446655440018`
   - Slug: `sonido-transportes`
   - OAs: OA 2, OA 5

7. **El viaje del ratoncito Pérez**
   - ID: `550e8400-e29b-41d4-a716-446655440019`
   - Slug: `viaje-ratoncito-perez`
   - OAs: OA 5, OA 6

## 🔧 Archivos de Configuración

### seed-modular-v2.js
Script principal que procesa la nueva estructura de datos.

### package-seed.json
Configuración de scripts y dependencias.

### Archivos de Actividades
Ubicados en `seed-data/activities/` con formato `.js`

## 📈 Ventajas del Sistema V2

1. **Estructura Clara**: Separación clara entre metadata, actividad y material
2. **Datos Completos**: Todos los campos necesarios para el frontend
3. **Validación**: Verificación automática de integridad
4. **Escalabilidad**: Fácil agregar nuevas actividades
5. **Mantenimiento**: Estructura consistente y organizada

## 🛠️ Troubleshooting

### Error: Unique constraint failed on slug
- Ejecutar: `node limpiar-duplicadas-final.js`

### Error: Material no encontrado
- Verificar que el material existe en la base de datos
- Ejecutar: `node check-products.js`

### Error: Estructura de datos inválida
- Verificar que el archivo sigue el formato correcto
- Revisar campos obligatorios

## 📝 Notas Importantes

- Todas las actividades usan el material "MEDIOS DE TRANSPORTE"
- Los recursos están en Google Drive y Google Docs
- Las imágenes de portada están en i.ibb.co
- Los videos están vacíos por defecto
- Todas las actividades son para Pre-Kínder (PK)

## 🎯 Próximos Pasos

1. Agregar más actividades siguiendo esta estructura
2. Implementar validación automática de URLs
3. Crear sistema de versionado de actividades
4. Agregar soporte para múltiples idiomas 