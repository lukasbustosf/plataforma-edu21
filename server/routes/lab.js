const express = require('express');
const router = express.Router();
const prisma = require('../database/prisma');
const { authenticateToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para guardar archivos en /uploads/lab-evidence
const evidenceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, '../uploads/lab-evidence');
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadEvidence = multer({ storage: evidenceStorage });

// ============================================================================
// PRODUCTOS Y MATERIALES (CON PRISMA)
// ============================================================================

router.get('/products', authenticateToken, async (req, res) => {
  try {
    const products = await prisma.lab_product.findMany({
      where: { status: 'active' },
      include: { lab_material: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cargar productos', error: error.message });
  }
});

router.get('/materials', authenticateToken, async (req, res) => {
  try {
    const materials = await prisma.lab_material.findMany({
      include: { lab_product: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: materials, count: materials.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cargar materiales', error: error.message });
  }
});

router.get('/materials/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const material = await prisma.lab_material.findUnique({
      where: { id: parseInt(id) },
    });

    if (!material) {
      return res.status(404).json({ success: false, message: 'Material no encontrado' });
    }

    res.json({ success: true, data: material });
  } catch (error) {
    console.error('Error fetching single lab material with Prisma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar el material',
      error: error.message
    });
  }
});

// ... (otras rutas de materiales)

// ============================================================================
// ACTIVIDADES (CON PRISMA)
// ============================================================================

router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { searchTerm, grade_level, page = 1, limit = 12 } = req.query;
    const filterConditions = [];
    if (searchTerm) {
      filterConditions.push({
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      });
    }
    if (grade_level && grade_level !== 'all') {
      filterConditions.push({ target_cycle: grade_level });
    }
    const whereClause = {
      AND: [
        ...filterConditions,
        { OR: [{ status: 'active' }, { creator_id: userId }] },
      ],
    };
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [activities, total] = await prisma.$transaction([
      prisma.lab_activity.findMany({
        where: whereClause,
        select: {
          id: true, title: true, slug: true, status: true, created_at: true,
          description: true, cover_image_url: true, tags: true,
          target_cycle: true, duration_minutes: true, creator_id: true,
        },
        skip: offset,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' },
      }),
      prisma.lab_activity.count({ where: whereClause }),
    ]);
    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching lab activities with Prisma:', error);
    res.status(500).json({ success: false, message: 'Error al cargar actividades', error: error.message });
  }
});

router.get('/activities/id/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await prisma.lab_activity.findUnique({
      where: { id: id },
    });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching activity by ID:', error);
    res.status(500).json({ success: false, message: 'Error al cargar la actividad' });
  }
});

router.get('/activities/:slug', authenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.user_id;

    const activity = await prisma.lab_activity.findUnique({
      where: { slug: slug },
      include: {
        lab_material: true,
        lab_activity_metrics: true,
        lab_activity_favorites: {
          where: { teacher_id: userId },
          select: { id: true }
        },
        lab_activity_log: {
          where: { teacher_id: userId },
          select: {
            id: true,
            execution_date: true,
            student_count: true,
            success_rating: true,
            notes: true,
            courses: {
              select: {
                course_id: true,
                course_name: true
              }
            },
            lab_evidence: {
              select: {
                id: true,
                file_url: true,
                file_type: true,
                file_name: true,
                mime_type: true
              }
            }
          },
          orderBy: { execution_date: 'desc' },
          take: 5
        }
      }
    });

    if (!activity || (activity.status !== 'active' && activity.creator_id !== userId)) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada o no tienes permiso para verla.'
      });
    }

    const responseData = {
      ...activity,
      is_favorite: activity.lab_activity_favorites.length > 0,
      my_recent_executions: activity.lab_activity_log.map(log => ({
        ...log,
        course: log.courses,
        evidence: log.lab_evidence
      }))
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching activity detail with Prisma:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar detalle de actividad',
      error: error.message
    });
  }
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[ \-]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

router.post('/activities', authenticateToken, requireRole('teacher', 'admin_escolar', 'superadmin'), async (req, res) => {
  try {
    const {
      title,
      description,
      cover_image_url,
      tags,
      target_cycle,
      duration_minutes,
      // Agrega aquí los demás campos requeridos
    } = req.body;

    // Validación básica
    if (!title || !description || !target_cycle || !duration_minutes) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
    }

    const slug = slugify(title);

    const newActivity = await prisma.lab_activity.create({
      data: {
        title,
        description,
        cover_image_url,
        tags: tags || [],
        target_cycle,
        duration_minutes: Number(duration_minutes),
        status: 'active',
        slug,
        // Agrega aquí los demás campos requeridos
      },
    });

    res.status(201).json({ success: true, data: newActivity });
  } catch (error) {
    console.error('Error creando actividad:', error);
    res.status(500).json({ success: false, message: 'Error al crear actividad', error: error.message });
  }
});

router.put('/activities/:id', authenticateToken, requireRole('superadmin', 'admin_escolar', 'teacher'), async (req, res) => {
  // ... (código de la ruta de actualización)
});

router.delete('/activities/:id', authenticateToken, async (req, res) => {
  // ... (código de la ruta de eliminación)
});

// ============================================================================
// LOGS DE EJECUCIÓN (CON PRISMA)
// ============================================================================
router.post('/activity-logs', authenticateToken, requireRole('teacher'), uploadEvidence.single('evidence'), async (req, res) => {
  const {
    activity_id,
    course_id,
    execution_date,
    student_count,
    duration_actual_minutes,
    success_rating,
    engagement_rating,
    difficulty_perceived,
    notes,
    challenges_faced
  } = req.body;

  // Obtener teacher_id y school_id del usuario autenticado
  const teacher_id = req.user?.user_id;
  const school_id = req.user?.school_id;

  // Convertir student_count a número
  const studentCount = parseInt(student_count, 10);

  // Validación básica
  if (!activity_id || !student_count || !execution_date) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
  }
  if (isNaN(studentCount)) {
    return res.status(400).json({ success: false, message: 'El número de estudiantes no es válido.' });
  }

  // Validar que course_id sea un UUID o null
  function isValidUUID(str) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
  }
  const courseIdToSave = course_id && isValidUUID(course_id) ? course_id : null;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear el registro de ejecución
      const newLog = await tx.lab_activity_log.create({
        data: {
          activity_id,
          teacher_id,
          school_id,
          course_id: courseIdToSave,
          execution_date: new Date(execution_date),
          student_count: studentCount,
          duration_actual_minutes,
          success_rating,
          engagement_rating,
          difficulty_perceived,
          notes,
          challenges_faced,
        },
      });

      // 2. Si hay archivo de evidencia, crear registro en lab_evidence
      if (req.file) {
        const fileUrl = `/uploads/lab-evidence/${req.file.filename}`;
        const mimeType = req.file.mimetype;
        const fileType = mimeType.startsWith('image/') ? 'image' : (mimeType === 'application/pdf' ? 'pdf' : 'other');
        await tx.lab_evidence.create({
          data: {
            activity_log_id: newLog.id,
            file_url: fileUrl,
            file_type: fileType,
            file_size_bytes: req.file.size,
            file_name: req.file.originalname,
            mime_type: mimeType,
            description: '',
            is_student_work: false,
          },
        });
      }

      // 2. Update or create the activity metrics
      const currentMetrics = await tx.lab_activity_metrics.findUnique({
        where: { activity_id },
      });

      if (currentMetrics) {
        // Calculate new averages
        const totalExecutions = currentMetrics.total_executions + 1;
        const newAvgRating = ((currentMetrics.avg_rating * currentMetrics.total_executions) + success_rating) / totalExecutions;
        const newAvgDuration = ((currentMetrics.avg_duration_minutes * currentMetrics.total_executions) + duration_actual_minutes) / totalExecutions;
        
        await tx.lab_activity_metrics.update({
          where: { activity_id },
          data: {
            total_executions: { increment: 1 },
            avg_rating: newAvgRating,
            avg_duration_minutes: newAvgDuration,
            last_execution_date: new Date(execution_date),
            // Note: unique_teachers and unique_schools would require more complex logic
          },
        });
      } else {
        await tx.lab_activity_metrics.create({
          data: {
            activity_id,
            total_executions: 1,
            unique_teachers: 1,
            unique_schools: 1,
            avg_rating: success_rating,
            avg_duration_minutes: duration_actual_minutes,
            last_execution_date: new Date(execution_date),
          },
        });
      }

      return newLog;
    });

    res.status(201).json({ success: true, message: 'Ejecución registrada con éxito', data: result });

  } catch (error) {
    console.error('Error logging activity execution:', error);
    res.status(500).json({ success: false, message: 'Error al registrar la ejecución', error: error.message });
  }
});


module.exports = router;
