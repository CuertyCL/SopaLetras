<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sopa de Letras Pro</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  
  <header>
    <div id="mensaje" class="mt-4 display-6 text-success fw-bold"></div>
    <h1 class="titulo">Sopa de Letras</h1>
    <p class="subtitulo">Encuentra todas las palabras ocultas</p>
  </header>
  
  <div class="container text-center mt-5">
    <div id="grid" class="grid my-4"></div>
    <h5 class="mb-3">Palabras a encontrar:</h5>
    <ul id="wordList" class="list-group list-group-flush mb-3"></ul>
    <button class="btn btn-success" id="btnNuevaSopa">Nueva Sopa</button>
  </div>

  <footer class="footer-custom mt-5 py-3">
    <div class="container text-center">
      <span class="footer-text">Hecho con ❤️ por Tu Nombre &copy; <?php echo date('Y'); ?> | Sopa de Letras Pro</span>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>
