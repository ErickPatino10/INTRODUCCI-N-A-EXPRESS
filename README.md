# INTRODUCCION-A-EXPRESS
API REST - Cafetería "Aroma Andino" (Quito, Ecuador)
Este repositorio contiene el desarrollo del servidor backend y la creación de endpoints utilizando **Node.js** y **Express**, simulando el sistema de consultas de menú, precios y disponibilidad de productos para una cafetería local en Quito.

## Integrantes y Roles
* **José Buñay** — Informe Técnico Completo (Formato IEEE)
* **Fernanda Rodriguez** — Lógica de Rutas Iniciales + Archivo README.md
* **Erick Patiño** — Lógica Avanzada de Respuestas JSON + Configuración del Repositorio

---

## Prerrequisitos e Instalación

Asegúrate de tener instalado en tu computadora:
* [Node.js](https://nodejs.org/) (Versión 16 o superior recomendada).

### Pasos para clonar e iniciar el proyecto:

1. **Clona este repositorio en tu máquina local:**
   ```bash
   git clone https://github.com/ErickPatino10/INTRODUCCI-N-A-EXPRESS.git
2. **Instalar depenendencias:**
npm install -y
3. **Ejecucion de la aplicacion:**
node watch index.js

### Rutas y Endpoints:

1. **Ruta Raíz (Información de la API):**
Método HTTP: GET

URL: http://localhost:3000/

Devuelven datos generales del negocio
2. **Menú Completo y Filtro Opcional:**
Método HTTP: GET

URL (Menú completo): http://localhost:3000/menu

URL (Con filtro): http://localhost:3000/menu?categoria=bebidas

Devuelve la lista filtrada 
3. **Filtro Dedicado por Categoría:**
Método HTTP: GET

URL de prueba: http://localhost:3000/filtro?categoria=postres

Utiliza req.query para extraer la categoría de la URL y realiza una validación estricta de errores con códigos 400 en caso de que falte o no sea válida.
4. **Detalle de Producto por ID (Ruta Dinámica):**
Método HTTP: GET

URL de prueba: http://localhost:3000/producto/2

Valida que el numero sea positivo , caso contrario retorna un error 404
5. **Consulta de Precio y Disponibilidad:**
Método HTTP: GET

URL de prueba: http://localhost:3000/precio/2

Retorna de manera especifica los datos
6. **Búsqueda por Nombre:**
Método HTTP: GET

URL de prueba: http://localhost:3000/buscar?nombre=cafe

Permite buscar productos de forma flexible mediante req.query,
7. **Manejo de Rutas No Encontradas (404):**
Método HTTP: GET

URL: Cualquier otra ruta no especificada (ej: http://localhost:3000/inventario)

Middleware global de control de errores que intercepta cualquier petición inválida y responde con un código 404 y una guía de ayuda.
