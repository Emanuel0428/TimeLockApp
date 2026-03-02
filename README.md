# TimeLockApp

Una aplicación web moderna para el seguimiento y control del uso del teléfono móvil, diseñada para promover hábitos digitales saludables mediante gamificación, métricas detalladas y un sistema de recompensas con tokens.

## Descripción

TimeLockApp es una aplicación integral de gestión del tiempo de pantalla que ayuda a los usuarios a ser más conscientes de su uso del teléfono móvil. A través de un sistema de métricas detalladas, desafíos personalizables, modo enfoque Pomodoro y un sistema de recompensas basado en tokens, la aplicación motiva a los usuarios a desarrollar un uso más equilibrado y saludable de sus dispositivos móviles.

## Características Principales

### Monitoreo de Métricas

- **Vista de Inicio**: Panel principal con resumen diario de uso
- **Navegación temporal**: Consulta métricas de días anteriores
- **Desbloqueos**: Seguimiento de cuántas veces desbloqueas tu dispositivo
- **Uso promedio**: Estadísticas de tiempo de pantalla promedio
- **Uso continuo**: Monitoreo de sesiones prolongadas sin pausas
- **Avance de desbloqueos**: Progreso de desbloqueos a lo largo del día

### Métricas de Actividad

- **Uso en movimiento**: Rastrea el uso del teléfono mientras caminas
- **Vida sedentaria**: Monitorea el tiempo de uso estático
- **Sistema de alertas**: Notificaciones sobre patrones poco saludables

### Modo Enfoque

- **Temporizador Pomodoro**: Sistema de enfoque con intervalos personalizables
- **Etiquetas personalizadas**: Categoriza tus sesiones (Estudio, Trabajo, Lectura, etc.)
- **Palette de colores**: Organiza visualmente tus actividades
- **Historial de sesiones**: Revisa tus sesiones de enfoque anteriores
- **Motor de temporizador (TimerEngine)**: Sistema robusto con soporte para fases de enfoque y descanso

### Sistema de Tokens

- **Tienda de tokens**: Sistema de recompensas para incentivar buenos hábitos
- **Múltiples recompensas**: Desbloquea contenido y beneficios con tus tokens
- **Balance en tiempo real**: Visualiza tus tokens ganados
- **Servicio de tokens (TokenService)**: Gestión completa de ganancias y gastos de tokens
- **Registro de transacciones**: Historial detallado de movimientos de tokens

### Sistema de Desafíos

- **Desafíos personalizables**: Configura desafíos según tus objetivos
- **Motor de desafíos (ChallengesEngine)**: Sistema automatizado de evaluación
- **Tipos de desafíos**: Tiempo de pantalla, desbloqueos, uso continuo, vida sedentaria, etc.
- **Reportes diarios**: Métricas y análisis de cumplimiento de objetivos

### Listas de Bloqueo

- **Bloqueo de aplicaciones**: Previene el uso de apps específicas
- **Bloqueo de URLs**: Control de acceso a sitios web
- **Gestión flexible**: Añade o elimina apps y URLs fácilmente

### Gestión de Usuario

- **Sistema de autenticación**: Login y registro de usuarios
- **Configuración personalizable**: Ajusta la app a tus preferencias
- **Persistencia de datos**: Almacenamiento local por usuario con sistema multi-usuario
- **Modo invitado**: Prueba la app sin necesidad de registro

## Stack Tecnológico

### Frontend

- **React 19.2.4** - Biblioteca principal de UI con las últimas características
- **TypeScript 5.9.3** - Tipado estático para mayor seguridad y productividad
- **Vite 7.3.1** - Build tool y servidor de desarrollo ultrarrápido
- **React Router DOM 7.13.1** - Navegación entre páginas con enrutamiento dinámico

### Estilos

- **Tailwind CSS 4.2.1** - Framework de CSS utility-first de última generación
- **Lucide React 0.575.0** - Librería de iconos moderna y ligera con más de 1000 iconos

### Arquitectura Core

- **Capacidades del Dispositivo (Device Capabilities)**
  - `DeviceControl`: Control y gestión del dispositivo
  - `MotionDetector`: Detección de movimiento y actividad física

- **Sistema de Desafíos (Challenges)**
  - `ChallengesEngine`: Motor de evaluación y seguimiento de desafíos

- **Métricas (Metrics)**
  - `AppLifecycle`: Gestión del ciclo de vida de la aplicación
  - `DailyReport`: Generación de reportes diarios

- **Notificaciones (Notifications)**
  - `NotificationService`: Sistema de notificaciones push

- **Almacenamiento (Storage)**
  - `userStorage`: Sistema de almacenamiento multi-usuario
  - Soporte para múltiples usuarios con aislamiento de datos

- **Temporizador (Time)**
  - `TimerEngine`: Motor de temporizador Pomodoro con eventos

- **Tokens (Rewards)**
  - `TokenService`: Gestión de economía de tokens y recompensas

### Herramientas de Desarrollo

- **ESLint 9.39.3** - Linting y análisis estático de código
- **TypeScript ESLint 8.48.0** - Reglas específicas para TypeScript
- **Vite Plugin React 5.1.1** - Soporte optimizado para React con Fast Refresh

## Instalación

### Requisitos Previos

- Node.js 18 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd TimeLockApp
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:5173
```

## Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar linting
npm run lint

# Vista previa de build de producción
npm run preview
```

## Estructura del Proyecto

```
TimeLockApp/
├── public/                    # Archivos estáticos
├── src/
│   ├── components/            # Componentes reutilizables de UI
│   │   ├── DonutChart.tsx         # Gráfico de donut para visualización
│   │   ├── MiniChart.tsx          # Mini gráficos para métricas
│   │   ├── Navbar.tsx             # Barra de navegación
│   │   ├── QuickAccess.tsx        # Acceso rápido a funciones
│   │   └── StackedBarChart.tsx    # Gráfico de barras apiladas
│   │
│   ├── context/               # Contextos de React
│   │   └── MetricsContext.tsx     # Contexto global de métricas
│   │
│   ├── core/                  # Lógica de negocio principal
│   │   ├── models.ts              # Modelos de datos TypeScript
│   │   │
│   │   ├── capabilities/          # Capacidades del dispositivo
│   │   │   ├── DeviceControl.ts
│   │   │   └── MotionDetector.ts
│   │   │
│   │   ├── challenges/            # Sistema de desafíos
│   │   │   └── ChallengesEngine.ts
│   │   │
│   │   ├── metrics/               # Sistema de métricas
│   │   │   ├── AppLifecycle.ts
│   │   │   └── DailyReport.ts
│   │   │
│   │   ├── notifications/         # Sistema de notificaciones
│   │   │   └── NotificationService.ts
│   │   │
│   │   ├── storage/               # Gestión de almacenamiento
│   │   │   └── userStorage.ts
│   │   │
│   │   ├── time/                  # Sistema de tiempo
│   │   │   └── TimerEngine.ts
│   │   │
│   │   └── tokens/                # Sistema de tokens
│   │       └── TokenService.ts
│   │
│   ├── lib/                   # Utilidades y funciones auxiliares
│   │   └── storage.ts             # Utilidades de almacenamiento
│   │
│   ├── pages/                 # Páginas de la aplicación
│   │   ├── Home.tsx               # Dashboard principal
│   │   ├── Login.tsx              # Página de inicio de sesión
│   │   ├── Register.tsx           # Página de registro
│   │   ├── Settings.tsx           # Configuración de usuario
│   │   ├── Blocklists.tsx         # Gestión de bloqueos
│   │   ├── Focus.tsx              # Modo enfoque/Pomodoro
│   │   ├── Pickups.tsx            # Métricas de desbloqueos
│   │   ├── AverageUse.tsx         # Uso promedio
│   │   ├── WalkingUse.tsx         # Uso en movimiento
│   │   ├── StationaryLife.tsx     # Vida sedentaria
│   │   ├── UnlockAdvance.tsx      # Avance de desbloqueos
│   │   ├── ContinuousUse.tsx      # Uso continuo
│   │   ├── TokenShop.tsx          # Tienda de tokens
│   │   └── Notifications.tsx      # Centro de notificaciones
│   │
│   ├── App.tsx                # Componente raíz con enrutamiento
│   ├── main.tsx               # Punto de entrada de la aplicación
│   └── style.css              # Estilos globales y Tailwind
│
├── index.html                 # Template HTML principal
├── package.json               # Dependencias y scripts
├── tsconfig.json              # Configuración de TypeScript (base)
├── tsconfig.app.json          # Configuración de TypeScript (app)
├── tsconfig.node.json         # Configuración de TypeScript (node)
├── vite.config.ts             # Configuración de Vite
├── tailwind.config.js         # Configuración de Tailwind CSS
└── eslint.config.js           # Configuración de ESLint
```

## Arquitectura del Sistema

TimeLockApp sigue una arquitectura modular con separación clara de responsabilidades:

### Capa de Presentación (UI)
- **Pages**: Páginas completas con enrutamiento mediante React Router
- **Components**: Componentes reutilizables (gráficos, navegación, acceso rápido)
- **Context**: Estado global de la aplicación con React Context API

### Capa de Lógica de Negocio (Core)
- **Models**: Interfaces y tipos TypeScript que definen la estructura de datos
- **Capabilities**: Interacción con capacidades del dispositivo (control, detección de movimiento)
- **Challenges**: Motor de desafíos y seguimiento de objetivos
- **Metrics**: Recopilación y análisis de métricas de uso
- **Notifications**: Sistema de notificaciones con múltiples tipos
- **Storage**: Persistencia de datos multi-usuario en localStorage
- **Time**: Motor de temporizador Pomodoro con gestión de fases
- **Tokens**: Sistema de economía de tokens y recompensas

### Capa de Datos
- **userStorage**: Gestión de almacenamiento por usuario con aislamiento de datos
- **storage (lib)**: Utilidades generales de almacenamiento
- LocalStorage como backend de persistencia

### Flujo de Datos
1. La UI interactúa con servicios del Core a través de Context
2. Los servicios Core gestionan la lógica de negocio
3. Los datos se persisten mediante el sistema de Storage
4. Las notificaciones se disparan mediante eventos del sistema

## Características de Diseño

- **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- **Dark Theme**: Interfaz oscura moderna con gradientes sutiles
- **Animaciones suaves**: Transiciones y efectos visuales pulidos
- **Visualización de datos**: Gráficos interactivos (donut charts, bar charts, mini charts)
- **Accesibilidad**: Diseño pensado para todos los usuarios
- **Componentes modulares**: UI construida con componentes reutilizables

## Estado del Proyecto

**Versión Actual**: 1.0.0 (Desarrollo Activo)

### Características Implementadas ✅
- Sistema de autenticación (Login/Register)
- Dashboard principal con métricas
- Modo enfoque Pomodoro con TimerEngine
- Sistema de tokens y recompensas
- Visualización de métricas (desbloqueos, uso promedio, uso continuo)
- Sistema de notificaciones
- Configuración personalizable
- Gestión de listas de bloqueo (apps y URLs)
- Almacenamiento multi-usuario
- Motor de desafíos
- Componentes de visualización de datos

### En Desarrollo 🚧
- Integración con APIs del dispositivo móvil
- Detección de movimiento en tiempo real
- Sistema de reportes diarios automatizado
- Funcionalidades avanzadas de control de dispositivo

## Requisitos del Sistema

- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: Habilitado
- **LocalStorage**: Habilitado (para persistencia de datos)

## Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es de código privado y uso personal.

## Autores

Desarrollado por ELO, CMM y AEO con ❤️ para promover hábitos digitales saludables.

---

**Nota**: Este proyecto está en fase de desarrollo activo. Algunas características pueden estar incompletas o en proceso de implementación.
