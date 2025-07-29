# 🚀 Guía de Entornos EDU21 - Local vs Producción

## 📋 **Resumen del Problema**
Tienes dos entornos:
- **Local**: `http://localhost:5000` (servidor) + `http://localhost:3000` (cliente)
- **Producción**: `https://plataforma-edu21-production.up.railway.app`

## 🔧 **Solución Implementada**

### 1. **Script de Cambio de Entornos**
```bash
# Cambiar a entorno local
node switch-environments.js local

# Cambiar a entorno producción  
node switch-environments.js production

# Ver estado actual
node switch-environments.js status
```

### 2. **Configuración Automática**
El script maneja automáticamente:
- ✅ Archivo `.env.local` del cliente
- ✅ Variables de entorno del servidor
- ✅ URLs de API correctas

## 🎯 **Flujo de Trabajo Recomendado**

### **Para Desarrollo Local:**
```bash
# 1. Cambiar a entorno local
node switch-environments.js local

# 2. Iniciar servidor
cd server && node index.js

# 3. Iniciar cliente (en otra terminal)
cd client && npm run dev

# 4. Configurar autenticación
# Abrir lab-auth-setup.html en el navegador
```

### **Para Producción:**
```bash
# 1. Cambiar a entorno producción
node switch-environments.js production

# 2. Hacer commit y push
git add .
git commit -m "Cambio a producción"
git push

# 3. Railway se despliega automáticamente
```

## 📁 **Archivos de Configuración**

### **Cliente (.env.local)**
```env
# Local
NEXT_PUBLIC_API_URL=http://localhost:5000

# Producción  
NEXT_PUBLIC_API_URL=https://plataforma-edu21-production.up.railway.app
```

### **Servidor (.env)**
```env
# Variables comunes
SUPABASE_URL=https://jzshtjlkidiclisgaqyw.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
DATABASE_URL=...

# Variables específicas del entorno
NODE_ENV=development  # o production
PORT=5000
```

## 🔄 **Comandos Rápidos**

### **Inicio Rápido Local:**
```bash
# Crear script de inicio
node switch-environments.js setup

# Usar el script creado
iniciar-local.bat
```

### **Verificar Estado:**
```bash
node switch-environments.js status
```

## 🎯 **Autenticación por Entorno**

### **Local:**
- Token: `demo-token-teacher-550e8400-e29b-41d4-a716-446655440001`
- Usuario: Profesor Demo
- Usar: `lab-auth-setup.html`

### **Producción:**
- Login normal con credenciales reales
- JWT tokens del servidor

## ⚠️ **Consideraciones Importantes**

### **Desarrollo Local:**
- ✅ Cambios inmediatos
- ✅ Debugging fácil
- ✅ Base de datos local/mock
- ❌ No afecta producción

### **Producción:**
- ✅ Datos reales
- ✅ Usuarios reales
- ❌ Cambios requieren deploy
- ❌ Debugging limitado

## 🚨 **Solución de Problemas**

### **Error 401 en Laboratorio:**
1. Verificar entorno: `node switch-environments.js status`
2. Cambiar a local: `node switch-environments.js local`
3. Reiniciar cliente y servidor
4. Usar `lab-auth-setup.html`

### **Error de Conexión:**
1. Verificar que servidor esté en puerto 5000
2. Verificar que cliente esté en puerto 3000
3. Verificar configuración de entorno

### **Problemas de Base de Datos:**
- **Local**: Usa datos mock
- **Producción**: Usa Supabase real

## 📊 **Estado Actual del Sistema**

### **Servidor:**
- ✅ Puerto 5000
- ✅ NODE_ENV: production
- ✅ MockGameDataService activo

### **Cliente:**
- ✅ Puerto 3000
- ✅ .env.local configurado
- ✅ Next.js funcionando

### **Autenticación:**
- ✅ Token de desarrollo disponible
- ✅ Middleware configurado
- ✅ Rutas protegidas funcionando

## 🎯 **Próximos Pasos**

1. **Probar entorno local:**
   ```bash
   node switch-environments.js local
   ```

2. **Iniciar servicios:**
   ```bash
   # Terminal 1
   cd server && node index.js
   
   # Terminal 2  
   cd client && npm run dev
   ```

3. **Configurar autenticación:**
   - Abrir `lab-auth-setup.html`
   - Hacer clic en "Configurar Autenticación"
   - Ir a `/teacher/labs/activities`

4. **Verificar funcionamiento:**
   - Las actividades del laboratorio deberían cargar
   - Sin errores 401
   - Datos visibles

## 💡 **Tips de Desarrollo**

- **Siempre verifica el entorno antes de trabajar**
- **Usa `node switch-environments.js status` para confirmar**
- **Mantén ambos servicios corriendo durante desarrollo**
- **Usa el script de autenticación para pruebas rápidas** 