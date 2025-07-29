# 🧪 Solución para Actividades del Laboratorio

## 🔍 Problema Identificado

El error 401 en las actividades del laboratorio se debe a que el token de autenticación no tiene el formato correcto para el modo de desarrollo.

## ✅ Solución

### 1. Token Correcto para Desarrollo

El servidor está configurado para usar tokens de desarrollo con el formato:
```
demo-token-teacher-550e8400-e29b-41d4-a716-446655440001
```

### 2. Configuración Manual en el Navegador

1. **Abre la aplicación:** http://localhost:3000
2. **Abre las herramientas de desarrollador:** F12
3. **Ve a la pestaña Console**
4. **Ejecuta este código:**

```javascript
// Limpiar configuración anterior
localStorage.removeItem('auth_token');
localStorage.removeItem('user_data');

// Configurar token válido para desarrollo
localStorage.setItem('auth_token', 'demo-token-teacher-550e8400-e29b-41d4-a716-446655440001');

// Configurar datos del usuario
const userData = {
  user_id: '550e8400-e29b-41d4-a716-446655440001',
  school_id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'profesor@demo.edu21.cl',
  first_name: 'María',
  last_name: 'González',
  role: 'TEACHER'
};

localStorage.setItem('user_data', JSON.stringify(userData));

// Recargar la página
window.location.reload();
```

### 3. Verificar que Funciona

Después de ejecutar el código anterior:

1. **Ve a la sección de Laboratorio** en la aplicación
2. **Deberías poder ver las actividades** sin errores 401
3. **Puedes acceder a:**
   - Materiales del laboratorio
   - Actividades del laboratorio
   - Productos del laboratorio

## 🔧 Script Automático

Si prefieres una solución automática, ejecuta:

```bash
node fix-lab-simple.js
```

Y luego abre el archivo `lab-working.html` que se crea.

## 📋 Usuarios Disponibles para Desarrollo

| Rol | Email | Token |
|-----|-------|-------|
| TEACHER | profesor@demo.edu21.cl | demo-token-teacher-550e8400-e29b-41d4-a716-446655440001 |
| ADMIN | director@demo.edu21.cl | demo-token-admin-550e8400-e29b-41d4-a716-446655440003 |
| STUDENT | estudiante@demo.edu21.cl | demo-token-student-550e8400-e29b-41d4-a716-446655440004 |

## 🎯 Próximos Pasos

1. **Ejecuta el código JavaScript** en la consola del navegador
2. **Verifica que las actividades del laboratorio funcionen**
3. **Si hay problemas, verifica que el servidor esté ejecutándose en puerto 5000**

## 🌐 URLs Importantes

- **Servidor:** http://localhost:5000
- **Cliente:** http://localhost:3000
- **Health Check:** http://localhost:5000/health

---

**Nota:** Esta solución es específica para el modo de desarrollo. En producción, se usarían tokens JWT reales. 