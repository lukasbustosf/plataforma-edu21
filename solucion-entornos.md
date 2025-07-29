# 🚀 Solución para Entornos Local vs Producción

## 📋 **El Problema**
Tienes dos entornos que necesitas manejar:
- **Local**: `http://localhost:5000` (servidor) + `http://localhost:3000` (cliente)
- **Producción**: `https://plataforma-edu21-production.up.railway.app`

## 🔧 **Solución Manual Simple**

### **Para Desarrollo Local:**

1. **Crear archivo `.env.local` en el cliente:**
   ```bash
   # En la carpeta client/
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
   ```

2. **Iniciar servidor local:**
   ```bash
   # En la carpeta server/
   node index.js
   ```

3. **Iniciar cliente local:**
   ```bash
   # En la carpeta client/
   npm run dev
   ```

4. **Configurar autenticación:**
   - Abrir `lab-auth-setup.html` en el navegador
   - Hacer clic en "Configurar Autenticación"
   - Ir a `/teacher/labs/activities`

### **Para Producción:**

1. **Cambiar configuración del cliente:**
   ```bash
   # En la carpeta client/
   echo "NEXT_PUBLIC_API_URL=https://plataforma-edu21-production.up.railway.app" > .env.local
   ```

2. **Hacer commit y push:**
   ```bash
   git add .
   git commit -m "Cambio a producción"
   git push
   ```

3. **Railway se despliega automáticamente**

## 🎯 **Comandos Rápidos**

### **Cambiar a Local:**
```bash
# En la raíz del proyecto
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > client/.env.local
```

### **Cambiar a Producción:**
```bash
# En la raíz del proyecto
echo "NEXT_PUBLIC_API_URL=https://plataforma-edu21-production.up.railway.app" > client/.env.local
```

### **Verificar configuración actual:**
```bash
# Ver qué URL está configurada
type client\.env.local
```

## 📊 **Estado Actual**

### **Servidor:**
- ✅ Puerto 5000
- ✅ NODE_ENV: production
- ✅ MockGameDataService activo

### **Cliente:**
- ✅ Puerto 3000
- ✅ Next.js funcionando
- ⚠️ Necesita configuración de entorno

## 🚨 **Solución Inmediata**

Para resolver el problema de 401 en laboratorio:

1. **Configurar cliente para local:**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > client/.env.local
   ```

2. **Reiniciar cliente:**
   ```bash
   # Detener cliente actual (Ctrl+C)
   # Luego en carpeta client/
   npm run dev
   ```

3. **Usar autenticación de desarrollo:**
   - Abrir `lab-auth-setup.html`
   - Configurar token de desarrollo
   - Ir a actividades del laboratorio

## 💡 **Tips de Trabajo**

### **Desarrollo Local:**
- ✅ Cambios inmediatos
- ✅ Debugging fácil
- ✅ Base de datos mock
- ❌ No afecta producción

### **Producción:**
- ✅ Datos reales
- ✅ Usuarios reales
- ❌ Cambios requieren deploy
- ❌ Debugging limitado

## 🔄 **Flujo de Trabajo Recomendado**

1. **Para desarrollo diario:**
   - Usar entorno local
   - Configurar `.env.local` para `localhost:5000`
   - Usar `lab-auth-setup.html` para autenticación

2. **Para pruebas en producción:**
   - Cambiar a Railway
   - Hacer commit y push
   - Esperar deploy automático

3. **Para debugging:**
   - Siempre usar entorno local
   - Verificar configuración con `type client\.env.local`

## 🎯 **Próximos Pasos**

1. **Ejecutar comando de configuración local:**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > client/.env.local
   ```

2. **Reiniciar cliente:**
   ```bash
   cd client
   npm run dev
   ```

3. **Configurar autenticación:**
   - Abrir `lab-auth-setup.html`
   - Hacer clic en "Configurar Autenticación"

4. **Probar laboratorio:**
   - Ir a `/teacher/labs/activities`
   - Verificar que no hay errores 401

## ⚠️ **Solución de Problemas**

### **Error 401 persistente:**
1. Verificar que servidor esté en puerto 5000
2. Verificar configuración de `.env.local`
3. Usar `lab-auth-setup.html` para autenticación

### **Error de conexión:**
1. Verificar que ambos servicios estén corriendo
2. Verificar puertos (3000 para cliente, 5000 para servidor)
3. Verificar configuración de entorno

### **Problemas de base de datos:**
- **Local**: Usa datos mock
- **Producción**: Usa Supabase real 