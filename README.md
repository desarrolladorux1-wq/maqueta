# Maqueta SATCONTROL · Paulet / FISE

Proyecto frontend tipo maqueta para visualizar y simular módulos SATCONTROL relacionados con proyectos FISE, Bono Gas, Vale FISE, Ahorro GNV, Masificación, Fotovoltaico, Electricidad al Toque y MCTER.

La aplicación es principalmente HTML, CSS y JavaScript. No usa base de datos real ni backend complejo; el servidor local solo sirve archivos estáticos.

## Cómo ejecutar el proyecto

Requisito:

- Node.js instalado.

Desde la carpeta raíz del proyecto:

```bash
node server.js
```

También se puede ejecutar indicando el puerto:

```bash
node -e "require('./server').startServer(3100)"
```

Luego abrir en el navegador:

```text
http://localhost:3100
```

Si el puerto 3100 está ocupado, se puede usar otro puerto:

```bash
PORT=3200 node server.js
```

En Windows PowerShell:

```powershell
$env:PORT=3200; node server.js
```

## Estructura principal

```text
maqueta_v1/
├─ index.html                  Pantalla principal y contenedor de módulos
├─ server.js                   Servidor local estático
├─ js/
│  ├─ main.js                  Lógica principal de SATCONTROL y módulos integrados
│  └─ shared/                  Eventos compartidos y soporte de shell
├─ style/
│  └─ style.css                Estilos globales
├─ modulos/
│  ├─ administrador/
│  ├─ bonogas/
│  ├─ vale_fise/
│  ├─ ahorro_gnv/
│  ├─ masificacion/
│  ├─ fotovoltaico/
│  ├─ electricidad_al_toque/
│  └─ mtcer/
├─ assets/                     Datos, GeoJSON, imágenes y recursos
├─ login/                      Pantalla de login
├─ log_fise.png                Logo FISE local
└─ logopaulet.png              Logo Paulet local
```

## Módulos y funciones

### SATCONTROL Proyectos / Administrador

Módulo base para la gestión territorial de proyectos.

Incluye:

- Mapa principal con herramientas de selección.
- Capas, temáticos y carga de capas GIS.
- Crear, listar, modificar y eliminar proyectos.
- Gestión de beneficiarios mediante tablas y carga Excel.
- Panel derecho con información del proyecto, KPIs, evidencias y reportes.
- Vista consolidada de capas temáticas de otros módulos.

Archivo principal:

```text
modulos/administrador/administrador.html
```

### Usuarios

Entorno administrativo para crear y listar usuarios.

Incluye:

- Formulario de creación de usuario.
- Tabla de usuarios.
- Paginación para listado.

Está integrado dentro de `index.html` y controlado por `js/main.js`.

### Bono Gas

Módulo orientado al seguimiento de Bono Gas y BONOGAS2.0.

Incluye:

- SATCONTROL Bono Gas con mapa.
- Filtros por departamento, distrito, estrato, empresa instaladora, concesionaria y fechas.
- Visualización de manzanas/estratos.
- Validaciones y Solicitudes.
- KPIs interactivos.
- Reportes con exportación.
- Generación de mapa de estratificación en PDF.
- Modal guiado para generar mapa de estratificación.
- Botón de “Generar mapa de estratificación” en el panel derecho debajo de “Exportar selección”.
- Validación IA simulada de DJ y evidencias.
- Control de plazos Art. 25.9.

Archivo principal:

```text
modulos/bonogas/bonogas.html
```

Datos geográficos usados por este módulo:

```text
assets/geo/
```

### Vale FISE

Módulo SATCONTROL para Vale FISE.

Incluye:

- Mapa con herramientas unificadas.
- Capas y utilitarios GIS.
- Carga de capas GeoJSON/GPX/KML/ZIP.
- Paneles de información y visualización territorial.
- Estilos visuales alineados con SATCONTROL Proyectos.

Archivo principal:

```text
modulos/vale_fise/vale_fise.html
```

### Ahorro GNV

Módulo para seguimiento de Ahorro GNV.

Incluye:

- Vista de gráficas/KPIs.
- SATCONTROL Ahorro GNV con mapa.
- Morosidad operativa.
- Modal de detalle con tabla paginada.
- Liquidaciones.
- Informes técnicos y resoluciones.
- Validación IA simulada para expedientes vehiculares.
- Exportaciones con logos institucionales.

Archivos principales:

```text
modulos/ahorro_gnv/ahorro_gnv.html
modulos/ahorro_gnv/ahorro_gnv_satcontrol.html
```

### Masificación

Módulo SATCONTROL para proyectos de masificación.

Incluye:

- Mapa territorial.
- Herramientas de selección.
- Función de círculo alineada con Bono Gas.
- Gestión de reportes, liquidaciones e informes.
- Utilitarios de capas y reportes.

Archivos principales:

```text
modulos/masificacion/masificacion.html
modulos/masificacion/masificacion_satcontrol.html
```

### Fotovoltaico

Módulo SATCONTROL para sistemas fotovoltaicos.

Incluye:

- Mapa con estilos unificados.
- Botones de Mapas, Capas y limpieza/preparación de selección.
- Selección por círculo/área.
- Panel derecho con información del sistema y evidencias.
- Capas temáticas y utilitarios.

Archivo principal:

```text
modulos/fotovoltaico/fotovoltaico.html
```

### Electricidad al Toque

Módulo SATCONTROL para Electricidad al Toque.

Incluye:

- Mapa con controles unificados.
- Mapas base agrupados bajo botón “Mapas”.
- Capas con estilo SATCONTROL Proyectos.
- Herramientas flotantes.
- Selección territorial y panel derecho.

Archivo principal:

```text
modulos/electricidad_al_toque/electricidad_al_toque.html
```

### MCTER

Módulo SATCONTROL para medición y compensación MCTER.

Incluye:

- Filtros territoriales por nivel regional, provincial y distrital.
- Aplicación de filtros al mapa y al panel derecho.
- KPIs de inventario.
- Visualización territorial y temáticos.
- Reporte de saldos por empresa.
- Exportación de reportes.
- Evidencias fotográficas.

Archivo principal:

```text
modulos/mtcer/mtcer.html
```

## Exportaciones

El proyecto tiene varias exportaciones simuladas o frontend:

- CSV
- XLS/XLSX
- PDF
- Reportes HTML imprimibles

Las exportaciones institucionales usan los logos locales:

```text
log_fise.png
logopaulet.png
```

## Datos geográficos

El proyecto usa capas y datos de ejemplo para visualización territorial. Algunas capas están en:

```text
assets/geo/
```

En Bono Gas, las manzanas y estratos se usan para mostrar mapas de estratificación y generar PDF sin que el usuario tenga que subir manualmente el GeoJSON cada vez.

## Notas importantes

- Es una maqueta frontend; muchas funciones simulan integración con sistemas externos.
- `server.js` solo sirve archivos estáticos.
- No hay autenticación real ni persistencia en base de datos.
- Algunos datos son demostrativos para validar flujo visual y funcional.
- Para cambios de estilos, revisar principalmente `style/style.css`.
- Para lógica general, revisar principalmente `js/main.js`.

## Validar JavaScript

Para validar sintaxis del archivo principal:

```bash
node --check js/main.js
```

En PowerShell:

```powershell
node --check .\js\main.js
```

