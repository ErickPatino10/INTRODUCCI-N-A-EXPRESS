/**
 * ============================================================================
 *  INTRODUCCIÓN A EXPRESS 
 *  Aplicación práctica: API de "Cafetería Aroma Andino" (Quito, Ecuador)
 * ============================================================================
 *  Contexto de vida real:
 *  Una cafetería de barrio en Quito quiere que sus clientes consulten el menú,
 *  los precios y la disponibilidad de productos desde una aplicación web.
 *  Este servidor Express simula esa API.
 * ============================================================================
 */


const express = require("express");
const app = express();
const PORT = 3000;

// Base de datos simulada
const productos = [
  { id: 1, nombre: "Café Americano", categoria: "cafeteria", precio: 2.00, moneda: "USD", disponible: true, stock: 40 },
  { id: 2, nombre: "Capuchino Grande", categoria: "cafeteria", precio: 3.25, moneda: "USD", disponible: true, stock: 25 },
  { id: 3, nombre: "Té de Hierbabuena", categoria: "bebidas", precio: 1.75, moneda: "USD", disponible: true, stock: 30 },
  { id: 4, nombre: "Jugo de Mora Natural", categoria: "bebidas", precio: 2.50, moneda: "USD", disponible: false, stock: 0 },
  { id: 5, nombre: "Sanduche de Pollo", categoria: "comida", precio: 3.50, moneda: "USD", disponible: true, stock: 15 },
  { id: 6, nombre: "Brownie con Nueces", categoria: "postres", precio: 2.75, moneda: "USD", disponible: true, stock: 20 }
];

const categoriasValidas = ["cafeteria", "bebidas", "comida", "postres"];

// RUTA RAÍZ: información general de la API
app.get("/", (req, res) => {
  res.json({
    negocio: "Cafetería Aroma Andino",
    ubicacion: "Calle Yumbo N34-12 y Diego de Almagro, Quito - Ecuador",
    horario: "Lunes a Viernes 07h00 - 19h00 | Sábados 08h00 - 14h00",
    api: "v1.0",
    endpointsDisponibles: [
      "GET /menu - Menú completo",
      "GET /menu?categoria=bebidas - Filtrar por categoría",
      "GET /producto/2 - Detalle de un producto",
      "GET /precio/2 - Precio y disponibilidad",
      "GET /buscar?nombre=capuchino - Buscar por nombre"
    ]
  });
});

// RUTA 1: menú completo y filtro por categoría
app.get("/menu", (req, res) => {
  const { categoria } = req.query;

  let listaProductos = productos;

  if (categoria) {
    const categoriaBuscada = categoria.trim().toLowerCase();

    if (!categoriasValidas.includes(categoriaBuscada)) {
      return res.status(400).json({
        error: "La categoría indicada no es válida",
        categoriasValidas
      });
    }

    listaProductos = productos.filter(
      p => p.categoria === categoriaBuscada
    );
  }

  res.json({
    mensaje: categoria
      ? "Menú filtrado por categoría"
      : "Menú completo de Cafetería Aroma Andino",
    totalProductos: listaProductos.length,
    moneda: "USD",
    menu: listaProductos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      disponible: p.disponible && p.stock > 0
        ? "En stock"
        : "Agotado"
    }))
  });
});

// RUTA 2: filtro por categoría mediante req.query
app.get("/filtro", (req, res) => {
  const { categoria } = req.query;

  if (!categoria || !categoria.trim()) {
    return res.status(400).json({
      error: "Debes indicar una categoría",
      categoriasValidas,
      ejemplo: "/filtro?categoria=postres"
    });
  }

  const categoriaBuscada = categoria.trim().toLowerCase();

  if (!categoriasValidas.includes(categoriaBuscada)) {
    return res.status(400).json({
      error: `La categoría "${categoria}" no es válida`,
      categoriasValidas
    });
  }

  const filtrados = productos.filter(
    p => p.categoria === categoriaBuscada
  );

  res.json({
    filtroAplicado: `categoria = ${categoriaBuscada}`,
    resultados: filtrados.length,
    productos: filtrados
  });
});

// RUTA 3: detalle de producto mediante req.params
app.get("/producto/:id", (req, res) => {
  const idBuscado = Number(req.params.id);

  if (!Number.isInteger(idBuscado) || idBuscado <= 0) {
    return res.status(400).json({
      error: "El ID debe ser un número entero positivo"
    });
  }

  const producto = productos.find(p => p.id === idBuscado);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
      idSolicitado: idBuscado,
      sugerencia: `Prueba con un ID entre 1 y ${productos.length}`
    });
  }

  res.json({
    fichaProducto: producto,
    urlEjemploDelNegocio:
      `https://aromaandino.ec/producto/${producto.id}`
  });
});

// RUTA 4: precio y disponibilidad
app.get("/precio/:id", (req, res) => {
  const idBuscado = Number(req.params.id);

  if (!Number.isInteger(idBuscado) || idBuscado <= 0) {
    return res.status(400).json({
      error: "El ID debe ser un número entero positivo"
    });
  }

  const producto = productos.find(p => p.id === idBuscado);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
      idSolicitado: idBuscado
    });
  }

  const sePuedePedir = producto.disponible && producto.stock > 0;

  res.json({
    producto: producto.nombre,
    precioUnitario: `${producto.precio.toFixed(2)} ${producto.moneda}`,
    sePuedePedir,
    unidadesEnStock: producto.stock,
    mensajeCliente: sePuedePedir
      ? `${producto.nombre} está disponible, quedan ${producto.stock} unidades`
      : `Lo sentimos, ${producto.nombre} está agotado por hoy`
  });
});

// RUTA 5: búsqueda por nombre mediante req.query
app.get("/buscar", (req, res) => {
  const { nombre } = req.query;

  if (typeof nombre !== "string" || !nombre.trim()) {
    return res.status(400).json({
      error: "Debes indicar el nombre a buscar",
      ejemplo: "/buscar?nombre=brownie"
    });
  }

  const nombreBuscado = nombre.trim().toLowerCase();

  const coincidencias = productos.filter(p =>
    p.nombre.toLowerCase().includes(nombreBuscado)
  );

  res.json({
    busqueda: nombre.trim(),
    encontrados: coincidencias.length,
    resultados: coincidencias
  });
});

// RUTA 404: direcciones que no existen
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    rutaSolicitada: req.originalUrl,
    ayuda: "Visita GET / para ver los endpoints disponibles"
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
