# TimeLockApp

Una aplicación web moderna para el seguimiento y control del uso del teléfono móvil, diseñada para promover hábitos digitales saludables mediante gamificación y métricas detalladas.

## Descripción

TimeLockApp es una aplicación de gestión del tiempo de pantalla que ayuda a los usuarios a ser más conscientes de su uso del teléfono móvil. A través de un sistema de métricas detalladas y un sistema de recompensas, la aplicación motiva a los usuarios a desarrollar un uso más equilibrado y saludable de sus dispositivos.

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

### Sistema de Tokens

- **Tienda de tokens**: Sistema de recompensas para incentivar buenos hábitos
- **Múltiples recompensas**: Desbloquea contenido y beneficios con tus tokens
- **Balance en tiempo real**: Visualiza tus tokens ganados

### Gestión de Usuario

- **Sistema de autenticación**: Login y registro de usuarios
- **Configuración personalizable**: Ajusta la app a tus preferencias
- **Persistencia de datos**: Almacenamiento local de métricas

## Stack Tecnológico

### Frontend

- **React 19** - Biblioteca principal de UI
- **TypeScript** - Tipado estático para mayor seguridad
- **Vite** - Build tool y servidor de desarrollo ultrarrápido
- **React Router DOM 7** - Navegación entre páginas

### Estilos

- **Tailwind CSS 4** - Framework de CSS utility-first
- **Lucide React** - Librería de iconos moderna y ligera

### Herramientas de Desarrollo

- **ESLint** - Linting y análisis de código
- **TypeScript ESLint** - Reglas específicas para TypeScript
- **Vite Plugin React** - Soporte optimizado para React

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
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   └── QuickAccess.tsx
│   ├── pages/          # Páginas de la aplicación
│   │   ├── Home.tsx           # Dashboard principal
│   │   ├── Login.tsx          # Página de inicio de sesión
│   │   ├── Register.tsx       # Página de registro
│   │   ├── Settings.tsx       # Configuración de usuario
│   │   ├── Focus.tsx          # Modo enfoque/Pomodoro
│   │   ├── Pickups.tsx        # Métricas de desbloqueos
│   │   ├── AverageUse.tsx     # Uso promedio
│   │   ├── WalkingUse.tsx     # Uso en movimiento
│   │   ├── StationaryLife.tsx # Vida sedentaria
│   │   ├── UnlockAdvance.tsx  # Avance de desbloqueos
│   │   ├── ContinuousUse.tsx  # Uso continuo
│   │   └── TokenShop.tsx      # Tienda de tokens
│   ├── context/        # Contextos de React (en desarrollo)
│   ├── lib/            # Utilidades y funciones auxiliares (en desarrollo)
│   ├── App.tsx         # Componente raíz
│   ├── main.tsx        # Punto de entrada
│   └── style.css       # Estilos globales
├── index.html
├── package.json
├── tsconfig.json       # Configuración de TypeScript
├── vite.config.ts      # Configuración de Vite
├── tailwind.config.js  # Configuración de Tailwind
└── eslint.config.js    # Configuración de ESLint
```

## Características de Diseño

- **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- **Dark Theme**: Interfaz oscura moderna con gradientes sutiles
- **Animaciones suaves**: Transiciones y efectos visuales pulidos
- **Accesibilidad**: Diseño pensado para todos los usuarios

## Estado del Proyecto

**Versión Actual**: 1.0.0 (Desarrollo Activo)

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
