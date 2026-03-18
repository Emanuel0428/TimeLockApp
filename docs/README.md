# TimeLock - Landing Page

Landing page oficial de la aplicación móvil TimeLock.

## 📁 Estructura

```
landing/
├── index.html                      # Página principal
├── README.md                       # Documentación principal
│
├── assets/                         # Recursos estáticos
│   ├── README.md                   # Guía de assets
│   ├── images/                     # Imágenes generales
│   │   └── README.md           
│   ├── screenshots/                # Capturas de la app
│   │   └── README.md           
│   └── icons/                      # Favicons e iconos
│       └── README.md           
│
├── css/                            # Hojas de estilo
│   ├── main.css                    # Estilos página principal
│   └── legal.css                   # Estilos páginas legales
│
├── js/                             # JavaScript
│   └── main.js                     # Script principal (navegación, animaciones)
│
└── pages/                          # Páginas secundarias
    ├── terminos.html               # Términos y condiciones
    └── privacidad.html             # Política de privacidad
```

## 🎨 Características

- **Diseño Responsivo**: Optimizado para dispositivos móviles, tablets y escritorio
- **Identidad TimeLock**: Colores y tipografía coherentes con la app
- **Arquitectura Limpia**: Estructura organizada con separación de responsabilidades
- **SEO Friendly**: Meta tags optimizados y estructura semántica
- **Performance**: CSS y JS optimizados sin dependencias externas
- **Secciones Principales**:
  - Hero con call-to-action destacado
  - Beneficios en cards interactivas
  - Características detalladas
  - Enlace al prototipo de Figma
- **Documentación Legal**:
  - Términos y condiciones completos
  - Política de privacidad detallada (privacy-first)

## 📂 Navegación Rápida

- **Página Principal**: [`index.html`](index.html)
- **Estilos**: [`css/main.css`](css/main.css)
- **Scripts**: [`js/main.js`](js/main.js)
- **Legal**:
  - [Términos y Condiciones](pages/terminos.html)
  - [Política de Privacidad](pages/privacidad.html)
- **Assets**: [Guía de recursos](assets/README.md)

## Servidor Local

Para probar localmente:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000
```

Luego visitar: `http://localhost:8000`

## 🔧 Tecnologías Utilizadas

- HTML5 semántico
- CSS3 con variables personalizadas
- JavaScript vanilla (sin dependencias)
- Google Fonts: Poppins e Inter
- SVG para iconos

## 📱 Compatibilidad

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Navegadores móviles modernos

## 🎨 Paleta de Colores TimeLock

```css
--app-bg-primary: #0F172A      /* Fondo principal */
--app-bg-secondary: #1E293B    /* Fondo secundario */
--app-brand-primary: #4B6FA7   /* Color marca principal */
--app-brand-light: #7FD3FF     /* Color marca claro */
--app-text-primary: #F8FAFC    /* Texto principal */
--app-text-secondary: #94A3B8  /* Texto secundario */
```

## 📄 Licencia

Este landing page es parte del proyecto TimeLock.
Desarrollado por ELO, CMM y AEO.

## 📞 Soporte

Para preguntas sobre el landing page, contactar a los desarrolladores del proyecto TimeLock.

---
