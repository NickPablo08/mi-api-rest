import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Defino la conexión a MongoDB
mongoose.connect(
  "mongodb+srv://pablonicocuenca:Messi191273s@cluster0.plqigdv.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Defino el modelo de MongoDB
const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  descripcion: String,
});
const Producto = mongoose.model("Productos", productoSchema);

// Rutas de la API
app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).send("Hubo un error en el servidor");
  }
});

app.post("/productos", async (req, res) => {
  const producto = req.body;
  try {
    const guardarProducto = new Producto(producto);
    await guardarProducto.save();
    res.status(201).send("El producto fue creado exitosamente");
  } catch (error) {
    res.status(500).send("Hubo un problema con el servidor");
  }
});

app.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const producto = await Producto.findById(id);
  if (!producto) {
    return res.status(404).json({ msg: "Producto no encontrado" });
  }
  producto.nombre = body.nombre || producto.nombre;
  producto.precio = body.precio || producto.precio;
  producto.descripcion = body.descripcion || producto.descripcion;
  try {
    const productoActualizado = await producto.save();
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).send("Hubo un problema con el servidor");
  }
});

app.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const eliminar = await Producto.findByIdAndDelete(id);
    res.status(200).send(eliminar);
  } catch (error) {
    res.status(500).send("Hubo un error en el servidor");
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

