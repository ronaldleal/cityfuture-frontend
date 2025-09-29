# CityFuture Frontend

Este proyecto es una aplicación Angular diseñada para el sistema de gestión de construcciones CityFuture. Consume una API desarrollada en Java Spring Boot y proporciona funcionalidades completas para la gestión de construcciones, materiales, inventario y generación de reportes.

## Estructura del Proyecto

La estructura del proyecto es la siguiente:

```
cityfuture-frontend
├── src
│   ├── app
│   │   ├── components          # Componentes de la aplicación
│   │   ├── services            # Servicios para manejar la lógica de negocio
│   │   ├── models              # Modelos de datos utilizados en la aplicación
│   │   ├── interceptors        # Interceptores para manejar solicitudes HTTP
│   │   ├── guards              # Guardias para proteger rutas
│   │   ├── pipes               # Pipes personalizados
│   │   ├── directives          # Directivas personalizadas
│   │   ├── shared              # Módulos y componentes compartidos
│   │   ├── app.component.ts    # Componente raíz de la aplicación
│   │   ├── app.component.html   # Plantilla HTML del componente raíz
│   │   ├── app.component.css    # Estilos CSS del componente raíz
│   │   ├── app.module.ts       # Módulo principal de la aplicación
│   │   └── app-routing.module.ts # Configuración de rutas
│   ├── assets                  # Recursos estáticos
│   ├── environments            # Configuraciones de entorno
│   ├── index.html             # Archivo HTML principal
│   ├── main.ts                # Punto de entrada de la aplicación
│   ├── polyfills.ts           # Polyfills para compatibilidad
│   └── styles.css             # Estilos globales
├── angular.json                # Configuración del proyecto Angular
├── package.json                # Configuración de npm
├── tsconfig.json              # Configuración de TypeScript
├── tsconfig.app.json          # Configuración específica para la aplicación
└── tsconfig.spec.json         # Configuración para pruebas unitarias
```

## Instalación

1. Clona el repositorio en tu máquina local.
2. Navega al directorio del proyecto.
3. Ejecuta `npm install` para instalar las dependencias.

## Ejecución

Para iniciar la aplicación en modo de desarrollo, ejecuta:

```
ng serve
```

Luego, abre tu navegador y visita `http://localhost:4200`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.