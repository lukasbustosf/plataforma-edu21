# Solución Error pnpm-lock.yaml en Vercel

## Problema Original
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/package.json
Error: Command "pnpm install" exited with 1
```

## Causa del Problema
El archivo `pnpm-lock.yaml` no estaba sincronizado con el `package.json`. Específicamente:
- En `package.json`: `"recharts": "^2.15.4"`
- En `pnpm-lock.yaml`: `"recharts": "^2.8.0"`

## Solución Aplicada

### 1. Eliminación de archivos desincronizados
```bash
# Eliminar pnpm-lock.yaml desactualizado
del pnpm-lock.yaml

# Eliminar node_modules
rmdir /s /q node_modules
```

### 2. Regeneración del lock file
```bash
# Limpiar cache de pnpm
pnpm store prune

# Reinstalar dependencias
pnpm install --no-frozen-lockfile
```

### 3. Verificación de sincronización
- ✅ `recharts: ^2.15.4` - Sincronizado
- ✅ `next: ^14.0.0` - Sincronizado  
- ✅ `react: ^18.2.0` - Sincronizado

## Estado Actual
- ✅ `pnpm-lock.yaml` regenerado correctamente (6136 líneas)
- ✅ `node_modules` reinstalado correctamente
- ✅ Todas las dependencias sincronizadas
- ✅ Archivos críticos verificados

## Comandos para Deploy en Vercel

### Opción 1: Deploy desde la raíz del proyecto
```bash
# Desde la carpeta plataforma-edu21
vercel --prod
```

### Opción 2: Deploy desde la carpeta client
```bash
# Navegar a la carpeta client
cd client
vercel --prod
```

### Opción 3: Deploy con configuración específica
```bash
# Configurar el directorio raíz como client
vercel --prod --cwd client
```

## Configuración Recomendada para Vercel

### Variables de Entorno Necesarias
Asegúrate de configurar estas variables en el dashboard de Vercel:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `NEXT_PUBLIC_TTS_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Configuración del Proyecto
- **Framework Preset**: Next.js
- **Root Directory**: `client` (si deployas desde la raíz)
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`

## Scripts de Utilidad Creados

### 1. `fix-pnpm-lock-windows.js`
Script para solucionar problemas de pnpm-lock.yaml en Windows:
```bash
node fix-pnpm-lock-windows.js
```

### 2. `verificar-deploy-vercel.js`
Script para verificar que todo esté listo para deploy:
```bash
node verificar-deploy-vercel.js
```

## Prevención de Problemas Futuros

### 1. Antes de hacer cambios en dependencias
```bash
# Verificar estado actual
pnpm list

# Actualizar dependencias de forma segura
pnpm update

# Verificar que el lock file se actualizó
git diff pnpm-lock.yaml
```

### 2. Antes de hacer commit
```bash
# Verificar que todo esté sincronizado
pnpm install --frozen-lockfile

# Si hay errores, regenerar
pnpm install
```

### 3. En CI/CD
```bash
# Usar --frozen-lockfile para verificar consistencia
pnpm install --frozen-lockfile
```

## Notas Importantes

1. **Siempre commitear `pnpm-lock.yaml`** junto con `package.json`
2. **No modificar manualmente** el archivo `pnpm-lock.yaml`
3. **Usar `pnpm install`** después de clonar el repositorio
4. **Verificar sincronización** antes de hacer deploy

## Estado Final
✅ **Problema resuelto completamente**
✅ **Listo para deploy en Vercel**
✅ **Scripts de utilidad creados**
✅ **Documentación completa**

El proyecto ahora está completamente preparado para el deploy en Vercel sin problemas de sincronización de dependencias. 