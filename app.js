require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const clienteRoutes =
  require("./src/routes/cliente.routes");

const adminRoutes =
  require("./src/routes/admin.routes");

  const notaRoutes =
  require("./src/routes/nota.routes");

const app = express();

const PORT =
  process.env.PORT || 3000;


// =============================================
// EJS
// =============================================

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "src", "views")
);


// =============================================
// ARCHIVOS PÚBLICOS
// =============================================

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);


// =============================================
// FORMULARIOS Y JSON
// =============================================

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());


// =============================================
// SESIONES
// =============================================

app.use(
  session({

    secret:
      process.env.SESSION_SECRET ||
      "dedicatoria-musical-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {

      httpOnly: true,

      maxAge:
        1000 * 60 * 60 * 24

    }

  })
);


// =============================================
// RUTAS
// =============================================

app.use("/", clienteRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/notas", notaRoutes);


// =============================================
// SERVIDOR
// =============================================

app.listen(
  PORT,
  () => {

    console.log("");
    console.log(
      "================================"
    );

    console.log(
      `Servidor funcionando en http://localhost:${PORT}`
    );

    console.log(
      `Admin: http://localhost:${PORT}/admin/login`
    );

    console.log(
      "================================"
    );
    console.log("");

  }
);