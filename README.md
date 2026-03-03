# 🔒 TimeLock — Aplicación de Bienestar Digital

**TimeLock** es una aplicación web progresiva (PWA) de bienestar digital que ayuda a los usuarios a gestionar y reducir el tiempo de pantalla de forma consciente. Combina seguimiento de métricas en tiempo real, un sistema de tokens gamificado y un temporizador de enfoque tipo Pomodoro.

## 📱 Características Principales

### 📊 Métricas en Tiempo Real

- **Recogidas (Pickups)**: cuenta cuántas veces abres la app/pestaña
- **Uso Promedio**: tiempo acumulado con pantalla activa
- **Uso Continuo**: duración de la sesión más larga sin interrupciones
- **Actividad física**: clasificación automática caminando vs estacionario (vía GPS)
- **Gráficos por hora**: visualización real de datos por hora del día
- **Vista histórica**: navegación por Día, Semana, Mes y Año

### 🪙 Sistema de Tokens

Economía gamificada para motivar hábitos saludables:

| Regla                      | Recompensa | Descripción                           |
| -------------------------- | ---------- | ------------------------------------- |
| 🎯 Sesión de enfoque       | +1 token   | Completar 25 minutos de concentración |
| 📱 Pocas recogidas         | +2 tokens  | Menos de 50 pickups en el día         |
| 👟 10,000 pasos            | +5 tokens  | Alcanzar meta de pasos diarios        |
| ⏱️ Poco tiempo de pantalla | +1 token   | Menos de 5 horas de pantalla          |
| 🔥 Racha continua          | +1 token   | Por cada 30 minutos de uso continuo   |
| 🚶 Caminata                | +1 token   | Por cada 10 minutos caminando         |

### 🔓 Desbloqueo Temporal

Los tokens se pueden gastar para "desbloquear" temporalmente restricciones:

- **1 hora**: 1 token
- **24 horas**: 5 tokens

### ⏰ Temporizador de Enfoque (Pomodoro)

- Sesiones de enfoque de 25 minutos con descansos de 5 minutos
- Etiquetas y colores personalizables
- Registro automático de sesiones completadas
- Persiste entre recargas de página

### 🔔 Sistema de Notificaciones

- Notificaciones de tipo POMODORO, CHALLENGE, SYSTEM y WARNING
- Informe diario automático con resumen del día anterior
- Centro de notificaciones con lectura/no lectura

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── main.tsx                    # Punto de entrada de la aplicación
├── App.tsx                     # Configuración de rutas (React Router)
│
├── lib/                        # Bibliotecas compartidas
│   ├── storage.ts              # Tipos de datos + CRUD de métricas/tokens/sesiones
│   └── dateHelpers.ts          # Utilidades de fecha y etiquetas en español
│
├── core/                       # Módulos de lógica de negocio
│   ├── models.ts               # Interfaces de datos (TimerState, Settings, etc.)
│   ├── storage/
│   │   └── userStorage.ts      # Almacenamiento con namespace por usuario
│   ├── tokens/
│   │   ├── TokenService.ts     # Servicio de gestión de tokens (ganar/gastar)
│   │   └── tokenRules.ts       # Motor de reglas de ganancia de tokens
│   ├── time/
│   │   ├── TimerEngine.ts      # Motor del temporizador Pomodoro
│   │   └── formatHour12.ts     # Formateador de horas AM/PM
│   ├── metrics/
│   │   ├── AppLifecycle.ts     # Tracking de ciclo de vida (visibilidad, apertura)
│   │   └── DailyReport.ts      # Generación del informe diario
│   ├── challenges/
│   │   └── ChallengesEngine.ts # Motor de desafíos diarios
│   ├── notifications/
│   │   └── NotificationService.ts  # Servicio de notificaciones
│   └── capabilities/
│       ├── DeviceControl.ts    # Control de dispositivo (vibración, wake lock)
│       └── MotionDetector.ts   # Detección de movimiento (acelerómetro)
│
├── context/
│   └── MetricsContext.tsx      # Contexto global de métricas y tracking en tiempo real
│
├── hooks/
│   ├── useMetricsChart.ts      # Hook para datos de gráficos (Día/Semana/Mes/Año)
│   ├── useWeekStats.ts         # Hook para estadísticas semanales
│   └── useSteps.ts             # Hook para conteo de pasos (stub)
│
├── components/
│   ├── MiniChart.tsx           # Componente SVG de gráfico (barras/líneas)
│   ├── MetricsBarChart.tsx     # Gráfico con contenedor estilizado + leyenda
│   ├── DonutChart.tsx          # Gráfico de donut para distribución del tiempo
│   ├── StackedBarChart.tsx     # Gráfico de barras apiladas
│   ├── Navbar.tsx              # Barra de navegación inferior
│   └── QuickAccess.tsx         # Accesos rápidos
│
└── pages/
    ├── Home.tsx                # Dashboard principal con 6 tarjetas de métricas
    ├── Pickups.tsx             # Detalle de recogidas con gráficos
    ├── AverageUse.tsx          # Detalle de uso promedio con gráficos
    ├── ContinuousUse.tsx       # Detalle de uso continuo con gráficos
    ├── UnlockAdvance.tsx       # Página de desbloqueo temporal con tokens
    ├── Focus.tsx               # Temporizador de enfoque (Pomodoro)
    ├── Settings.tsx            # Configuración de desafíos
    ├── Notifications.tsx       # Centro de notificaciones
    ├── Blocklists.tsx          # Listas de apps/URLs bloqueadas
    ├── TokenShop.tsx           # Tienda de tokens
    ├── WalkingUse.tsx          # Detalle de tiempo caminando
    ├── StationaryLife.tsx      # Detalle de vida estacionaria
    ├── Login.tsx               # Página de inicio de sesión
    └── Register.tsx            # Página de registro
```

---

## 🔧 Tecnologías

| Tecnología           | Uso                   |
| -------------------- | --------------------- |
| **React 19**         | Framework de UI       |
| **TypeScript**       | Tipado estático       |
| **Vite 7**           | Bundler y dev server  |
| **React Router DOM** | Navegación SPA        |
| **Tailwind CSS 4**   | Estilos utilitarios   |
| **Lucide React**     | Iconos SVG            |
| **localStorage**     | Persistencia de datos |

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Node.js ≥ 18
- npm ≥ 9

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Emanuel0428/TimeLockApp.git
cd TimeLockApp

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrir en el navegador
# → http://localhost:5173
```

### Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo con hot reload
npm run build     # Compilación TypeScript + build de producción
npm run lint      # Linting con ESLint
npm run preview   # Vista previa del build de producción
```

---

## 📦 Flujo de Datos

```
┌─────────────────────────────────────────────────┐
│                  MetricsContext                   │
│  (tracking en tiempo real cada 1 segundo)        │
│                                                   │
│  • Visibilidad → pickups + hourly.pickups[h]     │
│  • Timer 1s → screenActiveMs + hourly[h]         │
│  • Streak → continuousMaxMs + hourly[h]          │
│  • Geolocation → walkingMs / stationaryMs        │
│  • Tokens → awardToken() por hitos               │
└─────────┬───────────────────────────┬─────────────┘
          │ persist()                 │ useMetrics()
          ▼                           ▼
┌─────────────────────┐    ┌─────────────────────────┐
│  localStorage        │    │ Páginas de métricas      │
│  (con namespace)     │    │ (Pickups, AverageUse,    │
│                      │    │  ContinuousUse)          │
│ timelock:guest:      │    │                          │
│  metrics:2026-03-03  │    │  useMetricsChart()       │
│  tokenLedger         │    │  → hourlyExtractor       │
│  focusSessions       │    │  → metricExtractor       │
│  timer_state         │    │  → maxY histórico        │
│  settings            │    │                          │
└─────────────────────┘    └─────────────────────────┘
```

---

## 🪙 Sistema de Almacenamiento

Toda la persistencia usa `localStorage` con namespace por usuario:

```
timelock:{userId}:metrics:YYYY-MM-DD   → DailyMetrics completas del día
timelock:{userId}:tokenLedger          → Array de todas las transacciones de tokens
timelock:{userId}:focusSessions        → Array de sesiones de enfoque
timelock:{userId}:timer_state          → Estado del temporizador Pomodoro
timelock:{userId}:settings             → Configuración del usuario
timelock:{userId}:notifications        → Lista de notificaciones
```

La migración desde claves antiguas (sin namespace) es automática: al leer datos de un día anterior, si no se encuentran en la clave nueva, se buscan en la vieja y se migran automáticamente.

---

## 📊 Gráficos

Los gráficos se renderizan con **SVG puro** (sin librerías externas de charts):

- **MiniChart.tsx**: componente base que dibuja barras o líneas sobre SVG
- **MetricsBarChart.tsx**: wrapper con estilos y leyenda de máximo histórico
- **useMetricsChart.ts**: hook que prepara los datos por pestaña (Día/Semana/Mes/Año)

Cada página de métrica pasa su propio `hourlyExtractor` para que los datos del gráfico "Día" sean distintos y correctos:

- Pickups → `hourly.pickups[h]`
- Uso Promedio → `hourly.screenActiveMs[h]` (convertido a horas)
- Uso Continuo → `hourly.continuousMaxMs[h]` (convertido a horas)

---

## 👥 Autores

- **Emanuel** — Desarrollo principal
- Universidad Pontificia Bolivariana — 7° Semestre, Aplicaciones Móviles

---

## 📄 Licencia

Proyecto académico — Universidad Pontificia Bolivariana 2026.
