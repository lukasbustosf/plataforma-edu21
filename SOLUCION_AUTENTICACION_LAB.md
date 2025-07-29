# 🔐 SOLUCIÓN: Problema de Autenticación en Laboratorios

## 🎯 **PROBLEMA IDENTIFICADO**

**Error:** 401 Unauthorized en rutas de laboratorio
- `http://localhost:3000/api/lab/activities` → 401 Unauthorized
- `http://localhost:3000/api/lab/materials` → 401 Unauthorized

**Causa:** Las rutas de laboratorio requieren autenticación (`authenticateToken`)

---

## ✅ **SOLUCIÓN IMPLEMENTADA**

### **1. Usuario Demo Creado**
- **Email:** `teacher@demo.edu21.cl`
- **Contraseña:** `demo123`
- **Rol:** `TEACHER`
- **Token:** Generado automáticamente

### **2. Scripts Creados**
- `create-demo-user.js` - Crea usuario demo y prueba endpoints
- `setup-frontend-auth.js` - Configura autenticación en frontend
- `auth-setup.html` - Interfaz web para configuración

---

## 🚀 **INSTRUCCIONES PARA USAR**

### **Opción 1: Usar el archivo HTML (Recomendado)**
1. Abre el archivo `auth-setup.html` en tu navegador
2. Haz clic en el botón "🚀 Abrir EDU21 con Autenticación"
3. La aplicación se abrirá automáticamente con autenticación configurada

### **Opción 2: Configuración Manual**
1. Abre `http://localhost:3001` en tu navegador
2. Presiona `F12` para abrir herramientas de desarrollador
3. Ve a la pestaña `Console`
4. Ejecuta el código de autenticación que aparece en `auth-setup.html`

### **Opción 3: Login Manual**
1. Ve a `http://localhost:3001/login`
2. Usa las credenciales:
   - **Email:** `teacher@demo.edu21.cl`
   - **Contraseña:** `demo123`

---

## 📊 **ESTADO ACTUAL**

### **✅ Servidor Backend**
- ✅ Puerto 5000 funcionando
- ✅ Usuario demo creado
- ✅ Token generado
- ✅ Endpoints de laboratorio probados

### **✅ Cliente Frontend**
- ✅ Puerto 3001 funcionando (evita conflicto con 3000)
- ✅ Archivo de configuración creado
- ✅ Instrucciones disponibles

### **✅ Endpoints Verificados**
- ✅ `/api/lab/activities` - Funcionando
- ✅ `/api/lab/materials` - Funcionando
- ✅ `/api/auth/login` - Funcionando
- ✅ `/api/auth/register` - Funcionando

---

## 🔧 **CONFIGURACIÓN TÉCNICA**

### **Token de Autenticación**
```javascript
// Token demo válido por 7 días
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTdlMzlhZjAtMWVlNS00ZmNmLTk1MzctNjVhMDFlYTg4YmU2Iiwic2Nob29sX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6IlRFQUNIRVIiLCJlbWFpbCI6InRlYWNoZXJAZGVtby5lZHUyMS5jbCIsImlhdCI6MTc1MzczNzY0MSwiZXhwIjoxNzU0MzQyNDQxfQ.bZ-IDlEU8U1UOgA4rzWVnG0TUNgDETFLhIoRshpHCD4";
```

### **Datos del Usuario**
```javascript
const userData = {
  user_id: '57e39af0-1ee5-4fcf-9537-65a01ea88be6',
  school_id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'teacher@demo.edu21.cl',
  first_name: 'Profesor',
  last_name: 'Demo',
  role: 'TEACHER'
};
```

---

## 🎯 **PRÓXIMOS PASOS**

### **Para Acceder a Laboratorios:**
1. **Abre:** `http://localhost:3001`
2. **Configura autenticación** usando `auth-setup.html`
3. **Navega a:** `/teacher/labs/activities`
4. **¡Disfruta!** Los datos de laboratorio deberían cargar correctamente

### **Para Desarrollo:**
1. **Servidor:** `cd server && node index.js` (puerto 5000)
2. **Cliente:** `cd client && npm run dev -- -p 3001` (puerto 3001)
3. **Configuración:** Usa `auth-setup.html` para autenticación

---

## 📝 **NOTAS IMPORTANTES**

- **Puerto del Cliente:** Cambiado a 3001 para evitar conflictos
- **Token:** Válido por 7 días, regenerar si expira
- **Credenciales:** Guardadas en localStorage del navegador
- **Endpoints:** Todos requieren autenticación excepto `/health`

---

## 🔗 **ENLACES ÚTILES**

- **Aplicación:** http://localhost:3001
- **Configuración:** auth-setup.html
- **Servidor:** http://localhost:5000/health
- **Documentación:** SOLUCION_AUTENTICACION_LAB.md

---

*Solución creada el 28 de diciembre de 2024* 