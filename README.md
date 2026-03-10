# TimeLockApp

Aplicación móvil para Android desarrollada con React y Capacitor que ayuda a gestionar el tiempo de pantalla mediante métricas detalladas, desafíos personalizables, modo enfoque Pomodoro y un sistema de recompensas con tokens.

## Características

### Monitoreo y Métricas
- Dashboard con métricas diarias (desbloqueos, tiempo de pantalla, uso continuo)
- Seguimiento por hora del día (24 slots)
- Detección automática de movimiento (caminando vs estacionario)
- Navegación temporal para consultar días anteriores
- Visualización con gráficos interactivos (donut, barras, mini charts)

### Modo Enfoque
- Temporizador Pomodoro con fases de enfoque y descanso
- Etiquetas y colores personalizables para categorizar sesiones
- Historial completo de sesiones de enfoque
- Sincronización entre pestañas en tiempo real

### Sistema de Tokens
- Recompensas automáticas por buenos hábitos
- Tienda de tokens con beneficios desbloqueables
- Libro mayor con historial de transacciones
- Balance en tiempo real con eventos de actualización

### Desafíos y Notificaciones
- Motor de desafíos con evaluación automatizada
- Notificaciones para milestones y alertas
- Centro de notificaciones con historial

### Bloqueo de Aplicaciones
- Lista personalizable de apps bloqueadas
- Plugin nativo para Android con permisos de UsageStats y Overlay
- Monitoreo de app en primer plano

### Gestión de Usuario
- Sistema de autenticación (login/register)
- Almacenamiento multi-usuario con aislamiento de datos
- Configuración personalizable

## Stack Tecnológico

- **React 19.2.4** + **TypeScript 5.9.3**
- **Vite 7.3.1** - Build tool y servidor de desarrollo
- **React Router DOM 7.13.1** - Navegación
- **Tailwind CSS 4.2.1** - Estilos utility-first
- **Lucide React 0.575.0** - Iconos
- **Capacitor 8.2.0** - Framework para aplicaciones nativas (Android)

## Arquitectura

### Core Services
- **TimerEngine**: Temporizador Pomodoro con gestión de fases y persistencia
- **TokenService**: Sistema de economía con libro mayor de transacciones
- **ChallengesEngine**: Motor de evaluación de desafíos
- **NotificationService**: Gestión de notificaciones multi-tipo
- **AppLifecycle** y **DailyReport**: Métricas y reportes
- **MotionDetector** y **DeviceControl**: Capacidades del dispositivo
- **userStorage**: Almacenamiento multi-usuario con aislamiento

### Context
- **MetricsContext**: Estado global con tracking automático de:
  - Tiempo de pantalla activo/inactivo
  - Pickups por hora
  - Detección de movimiento (geolocalización)
  - Sistema de rachas
  - Otorgamiento automático de tokens por milestones

### Plugins Nativos (Android)
- **AppMonitor**: Plugin Capacitor personalizado para:
  - Permisos de UsageStats y Overlay
  - Obtener apps instaladas y estadísticas de uso
  - Monitoreo de app en primer plano
  - Gestión de lista de apps bloqueadas

## Instalación y Uso

### Requisitos
- Node.js 18+
- Android Studio (para desarrollo Android)

### Desarrollo Web
```bash
npm install
npm run dev
# Abre http://localhost:5173
```

### Desarrollo Android
```bash
# Sincronizar con Android
npm run android:sync

# Compilar y ejecutar en dispositivo/emulador
npm run android:run

# Abrir en Android Studio
npm run android:open
```

### Scripts Disponibles
```bash
npm run dev              # Servidor de desarrollo
npm run build            # Compilar para producción
npm run lint             # Análisis de código
npm run preview          # Vista previa de build
npm run android:sync     # Sincronizar web con Android
npm run android:run      # Compilar y ejecutar en Android
npm run android:open     # Abrir proyecto en Android Studio
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes UI reutilizables
│   ├── ChallengeWidget.tsx
│   ├── DonutChart.tsx
│   ├── MetricsBarChart.tsx
│   ├── MiniChart.tsx
│   ├── Navbar.tsx
│   ├── QuickAccess.tsx
│   └── StackedBarChart.tsx
│
├── context/            # Estado global
│   └── MetricsContext.tsx
│
├── core/               # Lógica de negocio
│   ├── models.ts
│   ├── capabilities/   # DeviceControl, MotionDetector
│   ├── challenges/     # ChallengesEngine
│   ├── metrics/        # AppLifecycle, DailyReport
│   ├── notifications/  # NotificationService
│   ├── storage/        # userStorage
│   ├── time/           # TimerEngine, formatHour12
│   └── tokens/         # TokenService, tokenRules
│
├── hooks/              # Custom hooks
│   ├── useMetricsChart.ts
│   └── useSteps.ts
│
├── lib/                # Utilidades
│   ├── dateHelpers.ts
│   ├── homeModulesStorage.ts
│   └── storage.ts
│
├── pages/              # Páginas de la app
│   ├── Home.tsx, Login.tsx, Register.tsx
│   ├── Settings.tsx, Blocklists.tsx, Notifications.tsx
│   ├── Focus.tsx, TokenShop.tsx
│   ├── Pickups.tsx, AverageUse.tsx, ContinuousUse.tsx
│   ├── WalkingUse.tsx, StationaryLife.tsx, UnlockAdvance.tsx
│   └── PluginTest.tsx
│
├── plugins/            # Plugins Capacitor
│   ├── AppMonitor.ts
│   └── web.ts
│
└── App.tsx, main.tsx, style.css

android/                # Proyecto nativo Android
```

## Características Técnicas

### Sistema de Métricas
- **Tracking automático**: MetricsContext monitorea actividad cada segundo
- **Métricas por hora**: 24 slots diarios con pickups, tiempo activo y rachas
- **Detección de movimiento**: Geolocalización para clasificar caminando/estacionario
- **Rollover automático**: Detecta cambio de día y crea métricas nuevas
- **Tokens automáticos**: Recompensas por milestones (pickups cada 10, caminata cada 10min, rachas cada 30min)

### Persistencia
- LocalStorage con prefijo por usuario
- Aislamiento completo entre usuarios
- Sincronización entre pestañas con eventos de Storage
- Serialización automática de datos

### UI/UX
- Diseño responsive con Tailwind CSS
- Dark theme con gradientes
- Animaciones y transiciones suaves
- Gráficos interactivos (donut, barras, mini charts)
- Iconos con Lucide React

## Configuración

### Capacitor
- **appId**: `com.timelockapp.app`
- **webDir**: `dist`
- **androidScheme**: `https`

### Permisos Android (plugin AppMonitor)
- **UsageStats**: Estadísticas de uso de apps
- **Overlay**: Mostrar bloqueadores sobre apps

## Autores

Desarrollado por ELO, CMM y AEO

## Diseño

[Wireframes en Figma](https://www.figma.com/design/Pf4DcNiKsU3oUSDTaxR0L8/WireFrames-TImeLock?node-id=0-1&t=43dgUT0p4nUD4FVQ-1)

---

**Versión**: 1.0.0

