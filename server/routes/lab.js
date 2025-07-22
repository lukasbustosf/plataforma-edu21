const express = require('express');
const router = express.Router();
const { supabaseAdmin: supabase } = require('../database/supabase'); // Importar el cliente admin
const multer = require('multer');
const path = require('path');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { labMetrics } = require('../services/labMetrics');

// Configuración de multer para upload de evidencias
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Máximo 5 archivos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// ============================================================================
// PRODUCTOS Y MATERIALES
// ============================================================================

// GET /api/lab/products - Listar productos de laboratorio
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lab_product')
      .select(`
        *,
        lab_material(
          id, name, internal_code, specifications, 
          cover_image_url, quantity_per_kit, status
        )
      `)
      .eq('status', 'active')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching lab products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar productos de laboratorio',
      error: error.message
    });
  }
});

// GET /api/lab/materials - Listar materiales
router.get('/materials', authenticateToken, async (req, res) => {
  try {
    const { lab_product_id, status } = req.query;
    
    let query = supabase
      .from('lab_material')
      .select(`
        *,
        lab_product(id, name, code)
      `)
      .order('name');

    if (lab_product_id) {
      query = query.eq('lab_product_id', lab_product_id);
    }

    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.in('status', ['active', 'out_of_stock']);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching lab materials:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar materiales',
      error: error.message
    });
  }
});

// POST /api/lab/materials - Crear material (solo superadmin)
router.post('/materials', authenticateToken, requireRole(['superadmin']), upload.single('cover_image'), async (req, res) => {
  try {
    const {
      name,
      internal_code,
      lab_product_id,
      specifications,
      quantity_per_kit,
      weight_grams,
      dimensions,
      safety_info,
      status
    } = req.body;

    let cover_image_url = null;

    // Subir imagen si se proporciona
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lab-materials')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('lab-materials')
        .getPublicUrl(fileName);
      
      cover_image_url = publicUrl;
    }

    const { data, error } = await supabase
      .from('lab_material')
      .insert({
        name,
        internal_code,
        lab_product_id,
        specifications: specifications ? JSON.parse(specifications) : {},
        cover_image_url,
        quantity_per_kit: parseInt(quantity_per_kit) || 1,
        weight_grams: weight_grams ? parseInt(weight_grams) : null,
        dimensions: dimensions ? JSON.parse(dimensions) : null,
        safety_info: safety_info ? JSON.parse(safety_info) : null,
        status: status || 'active'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Material creado exitosamente',
      data
    });
  } catch (error) {
    console.error('Error creating lab material:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear material',
      error: error.message
    });
  }
});

// PUT /api/lab/materials/:id - Actualizar material (solo superadmin)
router.put('/materials/:id', authenticateToken, requireRole(['superadmin']), upload.single('cover_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parsear campos JSON si existen
    if (updateData.specifications) {
      updateData.specifications = JSON.parse(updateData.specifications);
    }
    if (updateData.dimensions) {
      updateData.dimensions = JSON.parse(updateData.dimensions);
    }
    if (updateData.safety_info) {
      updateData.safety_info = JSON.parse(updateData.safety_info);
    }

    // Subir nueva imagen si se proporciona
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lab-materials')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('lab-materials')
        .getPublicUrl(fileName);
      
      updateData.cover_image_url = publicUrl;
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('lab_material')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Material actualizado exitosamente',
      data
    });
  } catch (error) {
    console.error('Error updating lab material:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar material',
      error: error.message
    });
  }
});

// DELETE /api/lab/materials/:id - Eliminar material (soft delete - solo superadmin)
router.delete('/materials/:id', authenticateToken, requireRole(['superadmin']), async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('lab_material')
      .update({ 
        status: 'discontinued',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Material eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting lab material:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar material',
      error: error.message
    });
  }
});

// ============================================================================
// ACTIVIDADES
// ============================================================================

// GET /api/lab/activities - Listar actividades con filtros simples
router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const {
      searchTerm,
      grade_level, // Mantenemos el nombre del parámetro para compatibilidad con el frontend
      page = 1,
      limit = 12
    } = req.query;

    let query = supabase
      .from('lab_activity')
      .select('id, title, slug, status, created_at, description, cover_image_url, tags, target_cycle, duration_minutes', { count: 'exact' }) // Consulta explícita
      .eq('status', 'active');

    // Filtros
    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,` +
        `description.ilike.%${searchTerm}%,` +
        `tags.cs.{${searchTerm}}` // Usar 'tags' en lugar de 'oa_codes' si es más apropiado
      );
    }
    
    // CORRECCIÓN: Usar 'target_cycle' en lugar de 'grade_level' y eliminar 'subject'
    if (grade_level) {
      query = query.eq('target_cycle', grade_level);
    }

    // Paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query
      .range(offset, offset + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    // --- INICIO DE LOG DE DEPURACIÓN ---
    console.log('[DEBUG] Respuesta de Supabase para /api/lab/activities:');
    if (error) console.error('[DEBUG] Error:', JSON.stringify(error, null, 2));
    console.log('[DEBUG] Conteo:', count);
    console.log('[DEBUG] Datos recibidos:', JSON.stringify(data, null, 2));
    // --- FIN DE LOG DE DEPURACIÓN ---

    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching lab activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar actividades',
      error: error.message
    });
  }
});

// GET /api/lab/activities/test-activity - Actividad de prueba estática
router.get('/activities/test-activity', (req, res) => {
  console.log('GET /api/lab/activities/test-activity -> Devolviendo datos de prueba.');
  res.json({
    success: true,
    data: {
      id: 'd9f8c7b6-a5e4-4f3c-8b1a-2e9f1d0c3b7a',
      title: 'Actividad de Prueba (Estática)',
      slug: 'test-activity',
      description: 'Esta es una actividad de prueba para verificar la conexión entre el frontend y el backend.',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lab_product_id: 'prod_123',
      lab_product: { id: 'prod_123', name: 'Kit de Ciencias Básico', code: 'SCI-BAS-01' },
      cover_image_url: 'https://via.placeholder.com/400x250.png?text=Test+Activity',
      video_url: null,
      duration_minutes: 45,
      preparation_time_minutes: 10,
      target_cycle: '1er_ciclo_basico',
      bloom_level: 'Aplicar',
      group_size: 4,
      required_material_ids: ['mat_abc', 'mat_def'],
      required_materials: [
        { id: 'mat_abc', name: 'Vaso de precipitados', quantity_per_kit: 2 },
        { id: 'mat_def', name: 'Pipeta de plástico', quantity_per_kit: 5 }
      ],
      steps: [
        { step: 1, title: 'Preparación', description: 'Reunir todos los materiales sobre la mesa.' },
        { step: 2, title: 'Ejecución', description: 'Seguir las instrucciones del manual.' },
        { step: 3, title: 'Limpieza', description: 'Limpiar y guardar los materiales.' }
      ],
      is_favorite: false,
      my_recent_executions: []
    }
  });
});

// GET /api/lab/activities/:slug - Detalle de actividad
router.get('/activities/:slug', authenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    const { data: activity, error } = await supabase
      .from('lab_activity')
      .select(`
        *,
        lab_product(id, name, code),
        lab_activity_metrics(
          total_executions,
          unique_teachers,
          unique_schools,
          avg_rating,
          avg_duration_minutes,
          avg_preparation_time,
          total_evidence_count,
          last_execution_date,
          trend_7d,
          trend_30d
        )
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error || !activity) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }

    // Obtener materiales requeridos
    if (activity.required_material_ids && activity.required_material_ids.length > 0) {
      const { data: materials, error: materialsError } = await supabase
        .from('lab_material')
        .select('*')
        .in('id', activity.required_material_ids);

      if (!materialsError) {
        activity.required_materials = materials;
      }
    }

    // Verificar si está en favoritos del usuario
    const { data: favorite } = await supabase
      .from('lab_activity_favorites')
      .select('id')
      .eq('teacher_id', userId)
      .eq('activity_id', activity.id)
      .single();

    activity.is_favorite = !!favorite;

    // Obtener mis ejecuciones recientes
    const { data: myExecutions } = await supabase
      .from('lab_activity_log')
      .select(`
        id, execution_date, student_count, success_rating, notes,
        course:courses(id, name, level)
      `)
      .eq('activity_id', activity.id)
      .eq('teacher_id', userId)
      .order('execution_date', { ascending: false })
      .limit(5);

    activity.my_recent_executions = myExecutions || [];

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching activity detail:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar detalle de actividad',
      error: error.message
    });
  }
});

// GET /api/lab/activities/id/:id - Obtener actividad por ID (sin .single() para depuración)
router.get('/activities/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('lab_activity')
      .select('*')
      .eq('id', id);

    if (error || !data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }

    res.json({
      success: true,
      data: data[0] // Devuelve el primer registro encontrado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cargar la actividad',
      error: error.message
    });
  }
});

// ============================================================================
// REGISTRO DE EJECUCIONES
// ============================================================================

// POST /api/lab/activity-logs - Registrar ejecución de actividad
router.post('/activity-logs', authenticateToken, requireRole(['teacher', 'coordinator']), upload.array('evidence', 5), async (req, res) => {
  try {
    const {
      activity_id,
      course_id,
      execution_date,
      student_count,
      duration_actual_minutes,
      preparation_time_actual,
      success_rating,
      engagement_rating,
      difficulty_perceived,
      notes,
      challenges_faced,
      student_feedback,
      would_repeat,
      location,
      weather_conditions,
      adaptations_made
    } = req.body;

    const teacher_id = req.user.id;
    const school_id = req.user.school_id;

    // Crear log de actividad
    const { data: activityLog, error: logError } = await supabase
      .from('lab_activity_log')
      .insert({
        activity_id,
        teacher_id,
        school_id,
        course_id,
        execution_date: execution_date || new Date().toISOString(),
        student_count: parseInt(student_count),
        duration_actual_minutes: duration_actual_minutes ? parseInt(duration_actual_minutes) : null,
        preparation_time_actual: preparation_time_actual ? parseInt(preparation_time_actual) : null,
        success_rating: parseInt(success_rating),
        engagement_rating: engagement_rating ? parseInt(engagement_rating) : null,
        difficulty_perceived: difficulty_perceived ? parseInt(difficulty_perceived) : null,
        notes,
        challenges_faced: challenges_faced ? challenges_faced.split(',') : null,
        student_feedback,
        would_repeat: would_repeat === 'true',
        location: location || 'classroom',
        weather_conditions,
        adaptations_made
      })
      .select()
      .single();

    if (logError) throw logError;

    // Subir evidencias si existen
    if (req.files && req.files.length > 0) {
      const evidencePromises = req.files.map(async (file, index) => {
        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}-${index}-${Math.random().toString(36).substring(7)}${fileExt}`;
        
        // Subir archivo a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('lab-evidence')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('lab-evidence')
          .getPublicUrl(fileName);

        // Crear registro de evidencia
        return supabase
          .from('lab_evidence')
          .insert({
            activity_log_id: activityLog.id,
            file_url: publicUrl,
            file_type: file.mimetype.startsWith('video/') ? 'video' : 'photo',
            file_size_bytes: file.size,
            file_name: file.originalname,
            mime_type: file.mimetype,
            capture_timestamp: new Date().toISOString()
          });
      });

      await Promise.all(evidencePromises);
    }

    // Log métrica de ejecución
    labMetrics.trackActivityExecution(
      activity_id, 
      duration_actual_minutes || 0, 
      req.files ? req.files.length : 0
    );

    res.status(201).json({
      success: true,
      message: 'Ejecución registrada exitosamente',
      data: activityLog
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
    
    // Log error de evidencia si aplica
    if (req.files && error.message.includes('storage')) {
      labMetrics.trackEvidenceUploadError(
        error,
        req.files.reduce((sum, f) => sum + f.size, 0),
        req.files[0]?.mimetype || 'unknown'
      );
    }

    res.status(500).json({
      success: false,
      message: 'Error al registrar ejecución',
      error: error.message
    });
  }
});

// GET /api/lab/activity-logs - Mis logs de actividad
router.get('/activity-logs', authenticateToken, async (req, res) => {
  try {
    const { activity_id, course_id, page = 1, limit = 10 } = req.query;
    const teacher_id = req.user.id;

    let query = supabase
      .from('lab_activity_log')
      .select(`
        *,
        activity:lab_activity(id, title, slug, cover_image_url),
        course:courses(id, name, level),
        lab_evidence(id, file_url, file_type, description, is_student_work)
      `, { count: 'exact' })
      .eq('teacher_id', teacher_id)
      .order('execution_date', { ascending: false });

    if (activity_id) {
      query = query.eq('activity_id', activity_id);
    }

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    // Paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar historial de actividades',
      error: error.message
    });
  }
});

// ============================================================================
// DASHBOARD Y MÉTRICAS
// ============================================================================

// GET /api/lab/dashboard/usage-heatmap - Mapa de calor de uso por curso
router.get('/dashboard/usage-heatmap', authenticateToken, async (req, res) => {
  try {
    const { school_id, period = '30' } = req.query;
    const userSchoolId = school_id || req.user.school_id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const { data, error } = await supabase.rpc('get_lab_usage_heatmap', {
      p_school_id: userSchoolId,
      p_start_date: startDate.toISOString()
    });

    if (error) throw error;

    res.json({
      success: true,
      data,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Error fetching usage heatmap:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar mapa de uso',
      error: error.message
    });
  }
});

// GET /api/lab/dashboard/oa-correlation - Correlación uso vs progreso OA
router.get('/dashboard/oa-correlation', authenticateToken, async (req, res) => {
  try {
    const { school_id, period = '90' } = req.query;
    const userSchoolId = school_id || req.user.school_id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const { data, error } = await supabase.rpc('get_lab_oa_correlation', {
      p_school_id: userSchoolId,
      p_start_date: startDate.toISOString()
    });

    if (error) throw error;

    // Calcular coeficiente de correlación
    const correlationData = data || [];
    let correlation = 0;
    let pValue = 1;

    if (correlationData.length > 2) {
      const { correlation: r, pValue: p } = calculateCorrelation(
        correlationData.map(d => d.lab_usage_pct),
        correlationData.map(d => d.oa_mastery_pct)
      );
      correlation = r;
      pValue = p;
    }

    res.json({
      success: true,
      data: correlationData,
      correlation_coefficient: correlation,
      p_value: pValue,
      period: parseInt(period),
      interpretation: interpretCorrelation(correlation, pValue)
    });
  } catch (error) {
    console.error('Error fetching OA correlation:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular correlación OA',
      error: error.message
    });
  }
});

// GET /api/lab/dashboard/top-activities - Top actividades más usadas
router.get('/dashboard/top-activities', authenticateToken, async (req, res) => {
  try {
    const { school_id, period = '30', limit = 5 } = req.query;
    const userSchoolId = school_id || req.user.school_id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const { data, error } = await supabase
      .from('lab_activity_log')
      .select(`
        activity_id,
        activity:lab_activity(
          id, title, slug, cover_image_url, 
          bloom_level, target_cycle, duration_minutes
        ),
        count:id.count(),
        avg_rating:success_rating.avg(),
        avg_duration:duration_actual_minutes.avg()
      `)
      .eq('school_id', userSchoolId)
      .gte('execution_date', startDate.toISOString())
      .not('success_rating', 'is', null)
      .group('activity_id, activity.id, activity.title, activity.slug, activity.cover_image_url, activity.bloom_level, activity.target_cycle, activity.duration_minutes')
      .order('count', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    res.json({
      success: true,
      data,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Error fetching top activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar actividades top',
      error: error.message
    });
  }
});

// GET /api/lab/dashboard/executive-summary - Resumen ejecutivo
router.get('/dashboard/executive-summary', authenticateToken, requireRole(['admin_escolar', 'sostenedor', 'superadmin']), async (req, res) => {
  try {
    const { school_id, period = '90' } = req.query;
    const userSchoolId = school_id || req.user.school_id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Métricas paralelas
    const [usageStats, teacherStats, evidenceStats, trendData] = await Promise.all([
      // Estadísticas de uso general
      supabase.rpc('get_lab_usage_stats', {
        p_school_id: userSchoolId,
        p_start_date: startDate.toISOString()
      }),
      
      // Estadísticas de docentes
      supabase.rpc('get_lab_teacher_stats', {
        p_school_id: userSchoolId,
        p_start_date: startDate.toISOString()
      }),
      
      // Estadísticas de evidencias
      supabase.rpc('get_lab_evidence_stats', {
        p_school_id: userSchoolId,
        p_start_date: startDate.toISOString()
      }),
      
      // Datos de tendencia semanal
      supabase.rpc('get_lab_trend_data', {
        p_school_id: userSchoolId,
        p_weeks: 12
      })
    ]);

    const summary = {
      usage: usageStats.data?.[0] || {},
      teachers: teacherStats.data?.[0] || {},
      evidence: evidenceStats.data?.[0] || {},
      trends: trendData.data || [],
      period: parseInt(period),
      generated_at: new Date().toISOString()
    };

    // Log métrica de dashboard
    labMetrics.trackDashboardRender(4, summary.trends.length, Date.now() - (req.startTime || Date.now()));

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching executive summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar resumen ejecutivo',
      error: error.message
    });
  }
});

// ============================================================================
// FAVORITOS Y COLECCIONES
// ============================================================================

// POST /api/lab/favorites - Agregar a favoritos
router.post('/favorites', authenticateToken, requireRole(['teacher', 'coordinator']), async (req, res) => {
  try {
    const { activity_id, notes } = req.body;
    const teacher_id = req.user.id;

    const { data, error } = await supabase
      .from('lab_activity_favorites')
      .insert({
        teacher_id,
        activity_id,
        notes
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Actividad agregada a favoritos',
      data
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar a favoritos',
      error: error.message
    });
  }
});

// DELETE /api/lab/favorites/:activity_id - Quitar de favoritos
router.delete('/favorites/:activity_id', authenticateToken, requireRole(['teacher', 'coordinator']), async (req, res) => {
  try {
    const { activity_id } = req.params;
    const teacher_id = req.user.id;

    const { error } = await supabase
      .from('lab_activity_favorites')
      .delete()
      .eq('teacher_id', teacher_id)
      .eq('activity_id', activity_id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Actividad quitada de favoritos'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error al quitar de favoritos',
      error: error.message
    });
  }
});

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

// Calcular correlación de Pearson
function calculateCorrelation(x, y) {
  const n = x.length;
  if (n < 2) return { correlation: 0, pValue: 1 };

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) return { correlation: 0, pValue: 1 };

  const correlation = numerator / denominator;
  
  // Cálculo aproximado de p-value (simplificado)
  const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
  const pValue = 2 * (1 - Math.abs(t) / Math.sqrt(t * t + n - 2));

  return { 
    correlation: Math.round(correlation * 1000) / 1000,
    pValue: Math.round(pValue * 1000) / 1000
  };
}

// Interpretar correlación
function interpretCorrelation(r, p) {
  if (p > 0.05) return 'No significativa (p > 0.05)';
  
  const absR = Math.abs(r);
  if (absR < 0.3) return 'Débil';
  if (absR < 0.5) return 'Moderada';
  if (absR < 0.7) return 'Fuerte';
  return 'Muy fuerte';
}

module.exports = router;

console.log('[INFO] Módulo /routes/lab.js cargado y usando el cliente Supabase Admin.');
