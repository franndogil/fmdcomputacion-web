# FMDCOMPUTACION – Sitio web

Sitio web de FMDCOMPUTACION, mi marca personal de servicio técnico de computación en Quilmes, Buenos Aires. Presenta los servicios que ofrezco, un catálogo filtrable, los proyectos que fui realizando y los canales de contacto. Incluye además un panel de administración propio con autenticación mediante Supabase.

**Sitio en producción:** https://fmdcomputacion.com/

---

## Características

- Página de inicio con presentación de servicios, slider de proyectos, sección de motivos para contratar y formulario de contacto.
- Catálogo de servicios con filtrado por categoría y ordenamiento alfabético, controlable también por parámetro de URL.
- Tarjetas de servicio expandibles con precio de referencia y enlace directo a WhatsApp con mensaje prellenado por servicio.
- Slider de proyectos con navegación por botones, puntos indicadores y arrastre con el mouse.
- Páginas de detalle por proyecto con carrusel de imágenes y visor tipo lightbox.
- Página de preguntas frecuentes.
- Botones flotantes de WhatsApp y de acceso a servicios.
- Menú de navegación responsive con versión móvil.
- Panel de administración con inicio de sesión, dashboard y cierre de sesión.
- SEO básico: metadatos por página, `robots.txt` y `sitemap.xml`.
- Integración de analítica con Microsoft Clarity.

---

## Tecnologías utilizadas

### Frontend
- HTML5
- CSS3 (hojas de estilo separadas por sección, sin frameworks)
- JavaScript (ES Modules y scripts clásicos, sin frameworks ni bundler)

### Backend
- Sin backend propio. El sitio público es estático; el panel de administración consume Supabase directamente desde el navegador.

### Base de datos
- Supabase (PostgreSQL gestionado). El panel consulta la tabla `servicios` (campos usados: `activo`).

### Autenticación
- Supabase Auth (inicio de sesión con email y contraseña mediante `signInWithPassword`).

### Hosting
- No hay archivos de despliegue en el repositorio. El `sitemap.xml` y las rutas absolutas apuntan al dominio `https://fmdcomputacion.com`.

### Servicios externos
- WhatsApp (enlaces `wa.me` con mensajes prellenados)
- Microsoft Clarity (analítica de comportamiento)
- Supabase (autenticación y datos del panel)
- Redes sociales enlazadas: Instagram, TikTok, YouTube, Facebook
- Formulario de contacto mediante `mailto:`

### Herramientas
- Git para control de versiones
- Supabase JS SDK cargado por CDN (`https://esm.sh/@supabase/supabase-js@2`)

---

## Capturas

> Agregar imágenes aquí.

---

## Arquitectura

El proyecto es un sitio estático servido directamente como archivos, sin proceso de build ni gestor de dependencias (`package.json` no existe).

Se distinguen dos partes:

1. **Sitio público** (`index.html`, `servicios.html`, `proyectos.html`, `faqs.html` y las páginas dentro de `proyectos/`): HTML servido directamente, con estilos en `css/` y comportamiento en `js/`. Todo el contenido está escrito en el propio HTML; no consume datos remotos.

2. **Panel de administración** (`admin/`): páginas HTML independientes que cargan Supabase por CDN mediante ES Modules. La sesión se verifica al cargar cada página; sin sesión válida, se redirige al login. El dashboard lee un conteo de la tabla `servicios`.

La configuración de Supabase (URL y clave pública) está definida como constantes en `admin/js/config.js`.

---

## Flujo de funcionamiento

**Visitante del sitio público:**

1. Llega a `index.html` y ve el hero, la grilla de servicios destacados y el slider de proyectos.
2. Al hacer clic en un servicio, es dirigido a `servicios.html` con un parámetro `?cat=` que preselecciona el filtro correspondiente.
3. En `servicios.html` puede filtrar por categoría u ordenar de A–Z; las tarjetas se muestran/ocultan y reordenan en el cliente. Al hacer clic en una tarjeta, se expande mostrando la descripción y el precio.
4. Desde cada servicio o desde los botones flotantes puede abrir WhatsApp con un mensaje ya redactado, o completar el formulario de contacto que abre el cliente de correo con destino `fmdcomputacion@gmail.com`.
5. Puede explorar los proyectos en `proyectos.html` y abrir cada uno para ver su galería con lightbox.

**Administración (uso propio):**

1. Ingreso a `admin/login.html` con email y contraseña.
2. `auth.js` llama a `supabase.auth.signInWithPassword`. Si es correcto, redirige a `admin/index.html`.
3. `index.html` verifica la sesión con `getSession`; si existe, muestra el dashboard y el conteo de servicios activos consultando la tabla `servicios` con `activo = true`.
4. El botón "Cerrar sesión" ejecuta `supabase.auth.signOut` y vuelve al login.

---

## Instalación

### Requisitos
- Un servidor de archivos estáticos (por ejemplo, la extensión Live Server de VS Code, `python -m http.server`, o `npx serve`). Conviene servir por HTTP en lugar de abrir los archivos con `file://`, porque el panel usa ES Modules.
- Para el panel: un proyecto de Supabase con Auth habilitado y una tabla `servicios`.

### Instalación
No hay dependencias que instalar. Basta con clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd fmd-web
```

### Configuración
La configuración del panel se define en `admin/js/config.js`:

```js
export const SUPABASE_URL = 'https://<tu-proyecto>.supabase.co';
export const SUPABASE_ANON_KEY = '<tu-clave-publica>';
```

### Variables de entorno
El proyecto no utiliza archivos de entorno. Ver la sección siguiente.

### Ejecución
Servir la carpeta raíz con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

Luego abrir `http://localhost:<puerto>/index.html` para el sitio y `http://localhost:<puerto>/admin/login.html` para el panel.

---

## Variables de entorno

El proyecto no gestiona variables de entorno ni archivos `.env`. La configuración necesaria está declarada como constantes en `admin/js/config.js`:

| Constante | Ubicación | Descripción |
|-----------|-----------|-------------|
| `SUPABASE_URL` | `admin/js/config.js` | URL del proyecto de Supabase. |
| `SUPABASE_ANON_KEY` | `admin/js/config.js` | Clave pública (anon) de Supabase usada por el cliente del navegador. |

---

## Estructura del proyecto

```
fmd-web/
├── index.html                 # Página de inicio
├── servicios.html             # Catálogo de servicios con filtros
├── proyectos.html             # Listado de proyectos
├── faqs.html                  # Preguntas frecuentes
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── css/
│   ├── style.css
│   ├── index.css
│   ├── nav.css
│   ├── servicios.css
│   ├── proyectos.css
│   ├── proyecto.css
│   └── faqs.css
├── js/
│   ├── nav.js                 # Menú responsive
│   ├── servicios.js           # Filtrado y orden de servicios
│   └── lightbox.js            # Visor de imágenes en proyectos
├── assets/
│   ├── icons/                 # Iconos de contacto y redes
│   ├── icons-services/        # Iconos de servicios
│   └── ...                    # Imágenes de perfil, posts, navegación
├── proyectos/
│   ├── template.html          # Plantilla base de proyecto
│   ├── noImage.png
│   └── <slug-del-proyecto>/
│       ├── <slug>.html
│       └── img/
└── admin/
    ├── login.html
    ├── index.html             # Dashboard
    ├── css/admin.css
    └── js/
        ├── config.js          # Constantes de Supabase
        ├── supabase.js        # Cliente de Supabase
        └── auth.js            # Lógica de login
```

---

## Funcionalidades

### Catálogo de servicios (`servicios.html` + `js/servicios.js`)
Cada servicio es una tarjeta con `data-cat` (categoría) y `data-titulo`. El script filtra por categoría y ordena alfabéticamente con `localeCompare` en español. Si la URL trae `?cat=`, aplica el filtro correspondiente al cargar, normalizando acentos para la comparación. Las categorías presentes son: armado, hardware, limpieza, redes, reparación, software y web.

### Tarjetas expandibles
Las tarjetas de servicio se abren y cierran con un `onclick` que alterna la clase `open`. Cada una incluye precio de referencia y un enlace a WhatsApp con un mensaje específico del servicio.

### Slider de proyectos (script en `index.html`)
Slider con scroll horizontal, botones anterior/siguiente, puntos indicadores generados dinámicamente y soporte de arrastre con el mouse. Detecta la tarjeta activa según su posición respecto al contenedor.

### Lightbox de proyectos (`js/lightbox.js`)
Crea dinámicamente un visor a pantalla completa. Al hacer clic en una imagen del carrusel la muestra ampliada; se cierra con clic, con el botón de cierre o con la tecla Escape, bloqueando el scroll del fondo mientras está abierto.

### Navegación responsive (`js/nav.js`)
Alterna la clase `menu-open` sobre el nav para mostrar u ocultar el menú móvil.

### Botones flotantes (`index.html`)
Botón flotante de WhatsApp siempre visible y botón "Ver servicios" que aparece/desaparece según la visibilidad de la sección de servicios, controlado con `IntersectionObserver`.

### Formulario de contacto (`index.html`)
Formulario con `action="mailto:"` que abre el cliente de correo del usuario con los campos completados. No hay backend de envío.

### Panel de administración (`admin/`)
- **Login** (`login.html` + `auth.js`): autenticación por email y contraseña con Supabase Auth. Redirige al dashboard si ya hay sesión.
- **Dashboard** (`index.html`): protegido por verificación de sesión; muestra el email del usuario y el conteo de servicios activos de la tabla `servicios`. Incluye cierre de sesión.

---

## Integraciones

- **Supabase**: autenticación (`signInWithPassword`, `getSession`, `signOut`) y consulta de la tabla `servicios`. El SDK se carga por CDN.
- **WhatsApp**: enlaces `https://wa.me/5491128352176` con mensajes prellenados por servicio y en los botones de contacto.
- **Microsoft Clarity**: script de analítica embebido en `index.html` (id de proyecto `wkfw5kgo1p`).
- **Correo**: formulario de contacto vía `mailto:fmdcomputacion@gmail.com`.
- **Redes sociales**: enlaces a Instagram, TikTok, YouTube y Facebook en el pie de página.

---

## Decisiones técnicas

- Construí el sitio con HTML, CSS y JavaScript sin frameworks ni proceso de build, para mantener el despliegue como un simple servido de archivos estáticos.
- El contenido de servicios y proyectos está escrito directamente en el HTML, sin depender de una base de datos para el sitio público.
- El filtrado y ordenamiento de servicios se resuelve en el cliente y admite enlaces profundos mediante el parámetro `?cat=`.
- Estilos organizados en hojas separadas por sección en lugar de un único archivo.
- El panel de administración está aislado del sitio público en su propia carpeta, con su propia hoja de estilos y su propia configuración.
- Uso de `IntersectionObserver` para la lógica de los botones flotantes en lugar de escuchar el evento de scroll.

---

## Posibles mejoras

- Referencia a `css/mobile.css` en `index.html` y `servicios.html`: el archivo no existe en el repositorio, por lo que conviene crearlo o eliminar la referencia.
- El sitio público repite bloques de navegación y pie de página en cada HTML; podrían centralizarse para facilitar el mantenimiento.
- El formulario de contacto depende de `mailto:`; un endpoint de envío mejoraría la fiabilidad y la experiencia.
- El panel de administración lee datos pero aún no permite gestionar servicios ni proyectos (los enlaces "Servicios" y "Proyectos" del sidebar apuntan a `#`); podría completarse el CRUD.
- Definir un archivo de despliegue (por ejemplo, para el hosting utilizado) para documentar y reproducir el proceso de publicación.
- Añadir un `package.json` con scripts de servido y linting facilitaría el trabajo local.

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
