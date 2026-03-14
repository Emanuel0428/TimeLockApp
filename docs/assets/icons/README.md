# Carpeta de Iconos

Esta carpeta contiene los iconos personalizados utilizados en el landing page.

## Contenido sugerido:

- Favicon en múltiples tamaños
- Iconos para redes sociales
- Iconos de características (si no usas SVG inline)
- App icons para diferentes plataformas

## Favicon Kit:

Genera un favicon completo en https://realfavicongenerator.net/

Incluye:
- `favicon.ico` (16x16, 32x32, 48x48)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

## Uso en HTML:

```html
<head>
    <link rel="icon" type="image/x-icon" href="assets/icons/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png">
    <link rel="manifest" href="assets/icons/site.webmanifest">
</head>
```

## Formato:

- **Favicon**: ICO y PNG
- **Iconos SVG**: Para mejor escalabilidad
- **Optimización**: Usar SVGOMG para SVG, TinyPNG para PNG
