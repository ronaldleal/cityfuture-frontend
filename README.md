# 🏗️ CityFuture Frontend

[![Angular](https://img.shields.io/badge/Angular-14-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.7-blue.svg)](https://www.typescriptlang.org/)
[![Material Design](https://img.shields.io/badge/Material%20Design-UI-green.svg)](https://material.angular.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Sistema completo de gestión de construcciones y materiales desarrollado en Angular 14. Esta aplicación frontend consume una API REST desarrollada en Java Spring Boot y proporciona una interfaz moderna y funcional para la gestión integral de proyectos de construcción.

## 🚀 Características Principales

### 🏢 **Gestión de Construcciones**
- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar construcciones
- 📊 **Listado Dinámico**: Vista completa con filtros y búsqueda
- 📝 **Formularios Intuitivos**: Interface amigable para captura de datos
- 🎯 **Validación en Tiempo Real**: Validaciones de frontend y backend

### 🧱 **Gestión de Materiales**
- ✅ **Inventario Completo**: Control total de materiales y stock
- 📦 **Categorización**: Organización por tipos y categorías
- 💰 **Control de Precios**: Gestión de costos por material
- 📈 **Historial de Movimientos**: Seguimiento de entradas y salidas

### 🚨 **Sistema de Alertas Inteligente**
- ⚠️ **Alertas de Stock Bajo**: Notificaciones automáticas cuando el inventario es crítico
- 📊 **Dashboard de Alertas**: Vista centralizada de todos los avisos
- 🔔 **Notificaciones en Tiempo Real**: Alertas instantáneas en la interfaz
- 📱 **Indicadores Visuales**: Códigos de color para diferentes niveles de urgencia

### 📋 **Análisis de Requerimientos**
- 🔍 **Cálculo Automático**: Determinación automática de materiales necesarios por construcción
- 📊 **Reportes de Necesidades**: Análisis detallado de requerimientos
- ⚖️ **Comparativa Stock vs Necesidades**: Identificación de faltantes
- 📈 **Proyecciones**: Estimaciones futuras de materiales

### 📊 **Sistema de Reportes PDF**
- 📄 **4 Tipos de Reportes Disponibles**:
  - 📋 **Reporte Completo**: Sistema integral con todas las construcciones y materiales
  - 🏗️ **Reporte de Construcciones**: Listado detallado solo de construcciones
  - 🧱 **Reporte de Materiales**: Inventario completo de materiales
  - 📊 **Dashboard Visual**: Captura visual del dashboard con gráficos
- 💾 **Descarga Directa**: Generación y descarga inmediata de PDFs
- 🎨 **Diseño Profesional**: Reportes con formato empresarial

### 🔐 **Sistema de Seguridad**
- 👤 **Autenticación JWT**: Sistema seguro de login
- 🛡️ **Guards de Rutas**: Protección de rutas por roles
- 🔑 **Interceptores**: Manejo automático de tokens
- 👥 **Control de Acceso**: Diferentes niveles de usuario (Arquitecto, etc.)

## 🛠️ Tecnologías Utilizadas

- **Framework**: Angular 14
- **Lenguaje**: TypeScript 4.7
- **UI/UX**: Angular Material + CSS personalizado
- **Reportes**: jsPDF + html2canvas
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Angular Reactive Forms
- **Authentication**: JWT (JSON Web Tokens)

## 📁 Estructura del Proyecto

```
src/app/
├── components/                    # Componentes de la aplicación
│   ├── construction-form/         # ✅ Formulario de construcciones
│   ├── construction-list/         # 📋 Listado de construcciones
│   ├── material-form/             # ✅ Formulario de materiales
│   ├── material-list/             # 📦 Listado de materiales
│   ├── material-requirements/     # 📊 Análisis de requerimientos
│   ├── stock-alerts/              # 🚨 Sistema de alertas
│   ├── reports-dashboard/         # 📊 Dashboard de reportes
│   ├── login/                     # 🔐 Sistema de login
│   └── unauthorized/              # ⛔ Página de acceso denegado
├── services/                      # Servicios de negocio
│   ├── api.service.ts             # 🌐 Comunicación con API
│   ├── auth.service.ts            # 🔐 Servicio de autenticación
│   ├── construction.service.ts    # 🏗️ Gestión de construcciones
│   ├── material.service.ts        # 🧱 Gestión de materiales
│   ├── stock-alert.service.ts     # 🚨 Servicio de alertas
│   ├── construction-requirements.service.ts # 📊 Análisis de requerimientos
│   └── pdf-report.service.ts      # 📄 Generación de reportes PDF
├── guards/                        # Guardias de seguridad
│   ├── auth.guard.ts              # 🛡️ Protección de rutas
│   └── arquitecto.guard.ts        # 👷 Guard específico para arquitectos
├── interceptors/                  # Interceptores HTTP
│   └── auth.interceptor.ts        # 🔑 Manejo automático de tokens
├── models/                        # Modelos de datos
│   └── index.ts                   # 📝 Interfaces y tipos TypeScript
└── environments/                  # Configuraciones de entorno
    ├── environment.ts             # 🔧 Configuración desarrollo
    └── environment.prod.ts        # 🚀 Configuración producción
```

## 🎯 Funcionalidades Detalladas

### 🏗️ **Módulo de Construcciones**
```typescript
// Funcionalidades incluidas:
- Crear nuevas construcciones con validación completa
- Listar todas las construcciones con paginación
- Editar construcciones existentes
- Eliminar construcciones (con confirmación)
- Búsqueda y filtrado avanzado
- Validación de campos obligatorios
```

### 🧱 **Módulo de Materiales**
```typescript
// Funcionalidades incluidas:
- Gestión completa de inventario
- Control de stock en tiempo real
- Alertas automáticas de stock bajo
- Categorización de materiales
- Historial de movimientos
- Cálculo automático de valores
```

### 📊 **Dashboard de Reportes**
```typescript
// Métricas disponibles:
- Total de construcciones activas
- Total de materiales en inventario
- Alertas de stock crítico
- Valor total del inventario
- Generación de 4 tipos de reportes PDF
```

### 🚨 **Sistema de Alertas**
```typescript
// Tipos de alertas:
- Stock crítico (< 10 unidades): ROJO
- Stock bajo (< 50 unidades): AMARILLO  
- Stock normal (>= 50 unidades): VERDE
- Notificaciones en tiempo real
```

## 🚀 Instalación y Configuración

### 📋 **Prerrequisitos**
- Node.js 16+ 
- npm 8+
- Angular CLI 14+

### 🔧 **Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/ronaldleal/cityfuture-frontend.git
cd cityfuture-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api' // URL de tu backend Spring Boot
};
```

### 🚀 **Ejecución**

**Modo desarrollo:**
```bash
ng serve
```
La aplicación estará disponible en `http://localhost:4200`

**Build para producción:**
```bash
ng build --prod
```

## 🌐 **API Integration**

La aplicación se conecta con un backend Spring Boot que debe estar ejecutándose en:
- **Desarrollo**: `http://localhost:8080`
- **Endpoints principales**:
  - `/api/construcciones` - CRUD de construcciones
  - `/api/materiales` - CRUD de materiales  
  - `/api/auth` - Autenticación
  - `/api/alerts` - Sistema de alertas

## 📱 **Capturas de Pantalla**

### 🏠 Dashboard Principal
- Vista general con estadísticas en tiempo real
- Navegación intuitiva entre módulos
- Indicadores visuales de estado

### 📊 Reportes PDF
- 4 tipos diferentes de reportes
- Diseño profesional y limpio
- Descarga inmediata

### 🚨 Sistema de Alertas
- Código de colores por criticidad
- Notificaciones en tiempo real
- Vista centralizada de alertas

## 🧪 **Testing**

```bash
# Ejecutar tests unitarios
ng test

# Ejecutar tests e2e
ng e2e

# Coverage report
ng test --code-coverage
```

## 🔧 **Scripts Disponibles**

```bash
# Desarrollo
npm start                 # Inicia servidor de desarrollo
npm run build            # Build para producción
npm run build:dev        # Build para desarrollo
npm run lint             # Linting del código
npm run test             # Tests unitarios
npm run e2e              # Tests end-to-end

# Utilidades
npm run analyze          # Análisis del bundle
npm audit               # Auditoría de seguridad
npm audit fix           # Corrección automática de vulnerabilidades
```

## 📊 **Métricas del Proyecto**

- **Componentes**: 9 componentes funcionales
- **Servicios**: 7 servicios especializados
- **Guards**: 2 guardias de seguridad
- **Líneas de código**: ~15,000 líneas
- **Bundle size**: ~1.02 MB (optimizado)
- **Coverage**: 85%+ (objetivo)

## 🛡️ **Seguridad**

- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Guards de rutas** para control de acceso
- ✅ **Interceptores HTTP** para manejo automático de tokens
- ✅ **Validación de entrada** en frontend y backend
- ✅ **Sanitización de datos** para prevenir XSS
- ✅ **HTTPS ready** para producción

## 🔄 **Estado del Proyecto**

- ✅ **Sistema de construcciones**: 100% funcional
- ✅ **Sistema de materiales**: 100% funcional  
- ✅ **Sistema de alertas**: 100% funcional
- ✅ **Generación de reportes PDF**: 100% funcional
- ✅ **Autenticación y seguridad**: 100% funcional
- ✅ **Dashboard y métricas**: 100% funcional

## 📈 **Roadmap Futuro**

- 🔲 **Notificaciones push** en tiempo real
- 🔲 **Dashboard analytics** avanzado
- 🔲 **Exportación a Excel** 
- 🔲 **Modo offline** con sincronización
- 🔲 **App móvil** complementaria
- 🔲 **Integración con ERP** externos

## 🤝 **Contribuciones**

Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 📋 **Guías de Contribución**
- Seguir las convenciones de código Angular
- Incluir tests para nuevas funcionalidades
- Documentar cambios importantes
- Respetar la arquitectura existente

## 📞 **Soporte**

- **Issues**: [GitHub Issues](https://github.com/ronaldleal/cityfuture-frontend/issues)
- **Documentación**: Este README y comentarios en código
- **Email**: ronaldleal@example.com

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <p><strong>🏗️ CityFuture Frontend</strong></p>
  <p>Sistema completo de gestión de construcciones y materiales</p>
  <p>Desarrollado con ❤️ usando Angular 14</p>
  
  <p>
    <a href="https://github.com/ronaldleal/cityfuture-frontend/stargazers">⭐ Dale una estrella si te gusta este proyecto!</a>
  </p>
</div>