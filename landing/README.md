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

## 🚀 Despliegue

### Opciones de Hosting

1. **GitHub Pages** (Recomendado)
   ```bash
   # Subir a GitHub y activar GitHub Pages en la carpeta landing/
   ```

2. **Netlify**
   ```bash
   # Conectar repositorio o arrastrar la carpeta landing/
   ```

3. **Vercel**
   ```bash
   vercel --prod
   ```

4. **Firebase Hosting**
   ```bash
   firebase init hosting
   firebase deploy
   ```

### Servidor Local

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

## 📝 Personalización

### Actualizar Enlaces

Antes de publicar, actualizar los siguientes enlaces:

1. **index.html** - Línea del botón "Descargar en Play Store":
   ```html
   <a href="TU_ENLACE_DE_PLAY_STORE" class="btn btn-primary">
   ```

2. **terminos.html y privacidad.html** - Sección de contacto:
   ```html
   <li>Correo electrónico: [tu-email@ejemplo.com]</li>
   ```

### Agregar Screenshots

Para mejorar el hero section, agregar screenshots de la app:

1. Exportar screenshots desde el emulador o dispositivo
2. Guardar las imágenes en `assets/images/`
3. Optimizar las imágenes (recomendado: 300x600px)
4. Reemplazar el placeholder en `index.html`:

```html
<div class="phone-screen">
    <img src="assets/images/home.png" alt="TimeLock App">
</div>
```

### Agregar Logo

Para usar el logo SVG de la app:

1. El logo ya está en `public/logoTimeLock-white.svg`
2. Opcionalmente, copiar a `assets/images/` para mejor organización
3. Actualizar referencias en HTML si se mueve

## 🎯 SEO y Meta Tags

La página incluye meta tags básicos. Considera agregar:

- Open Graph tags para redes sociales
- Twitter Cards
- Schema.org markup
- Favicon completo (múltiples tamaños)

Ejemplo para añadir en `<head>`:

```html
<!-- Open Graph -->
<meta property="og:title" content="TimeLock - Controla tu tiempo de pantalla">
<meta property="og:description" content="Aplicación para gestionar tu tiempo digital...">
<meta property="og:image" content="URL_DE_IMAGEN_PREVIEW">
<meta property="og:url" content="TU_URL">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="TimeLock">
<meta name="twitter:description" content="Controla tu tiempo de pantalla...">
<meta name="twitter:image" content="URL_DE_IMAGEN_PREVIEW">
```

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

## ✅ Checklist Pre-Lanzamiento

Antes de publicar el landing page, asegúrate de:

- [ ] Actualizar el enlace de Play Store en el botón "Descargar"
- [ ] Agregar email de contacto en páginas legales
- [ ] Subir screenshots de la app a `assets/screenshots/`
- [ ] Generar y agregar favicons en `assets/icons/`
- [ ] Probar todos los enlaces internos
- [ ] Verificar responsive en diferentes dispositivos
- [ ] Validar HTML en [W3C Validator](https://validator.w3.org/)
- [ ] Optimizar todas las imágenes
- [ ] Probar velocidad de carga en [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Configurar dominio personalizado (si aplica)
- [ ] Agregar Google Analytics o herramienta de métricas (opcional)

## 🚀 Próximos Pasos

1. **Agregar Screenshots**: Captura pantallas de la app y colócalas en `assets/screenshots/`
2. **Generar Favicons**: Usa [RealFaviconGenerator](https://realfavicongenerator.net/)
3. **Configurar Dominio**: Apunta tu dominio al hosting elegido
4. **SEO**: Agrega `sitemap.xml` y `robots.txt`
5. **Analytics**: Configura seguimiento de visitantes (opcional)
6. **Open Graph**: Agrega meta tags para redes sociales

## 📞 Soporte

Para preguntas sobre el landing page, contactar a los desarrolladores del proyecto TimeLock.

---

**Nota**: Recuerda actualizar los enlaces de Play Store y email de contacto antes del lanzamiento oficial.
