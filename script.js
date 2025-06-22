const conjunto = [
  'ALGORITMO', 'ANCHO_DE_BANDA', 'ANTIVIRUS', 'API', 'ARCHIVO',
  'ARRAY', 'BACKUP', 'BINARIO', 'BIT', 'BUG',
  'BYTE', 'CACHE', 'CLIENTE', 'CLOUD', 'CLUSTER',
  'CODIGO', 'COMPILADOR', 'COMPUTADORA', 'COOKIE', 'CPU',
  'CIBERSEGURIDAD', 'DATO', 'DEBUG', 'DESARROLLADOR', 'DOMINIO',
  'DRIVER', 'ENCRIPTAR', 'ENSAMBLADOR', 'ETHERNET', 'FIREWALL',
  'FIRMWARE', 'FTP', 'GIGABYTE', 'GPU', 'HARDWARE',
  'HTML', 'HTTP', 'HTTPS', 'INDEX', 'INPUT',
  'INTERNET', 'IP', 'JAVA', 'JAVASCRIPT', 'KERNEL',
  'LAPTOP', 'LENGUAJE', 'LINUX', 'LOGIN', 'MACRO',
  'MALWARE', 'MEMORIA', 'METADATO', 'MODEM', 'MONITOR',
  'MOUSE', 'NAVEGADOR', 'NUBE', 'OCTETO', 'OFFLINE',
  'ONLINE', 'OUTPUT', 'PANTALLA', 'PAQUETE', 'PASSWORD',
  'PATCH', 'PING', 'PIXEL', 'PLUGIN', 'POST',
  'PROCESADOR', 'PROGRAMA', 'PROGRAMADOR', 'PROTOCOLO', 'PROXY',
  'QUERY', 'RAM', 'RED', 'REBOOT', 'RECURSO',
  'ROOT', 'ROUTER', 'SCRIPT', 'SEGURIDAD', 'SERVIDOR',
  'SHELL', 'SOFTWARE', 'SQL', 'SSH', 'STACK',
  'STREAMING', 'SISTEMA', 'TABLERO', 'TCP', 'TERMINAL',
  'TOKEN', 'UPDATE', 'USB', 'USUARIO', 'VARIABLE',
  'VPN', 'WEB', 'WIFI', 'WINDOWS', 'ZIP', 'FUNA', 'JAIMITO'
];

let tamanio = 10;

function obtenerPalabrasAleatorias(array, cantidad = 6) {
  const copia = [...array];
  const seleccionadas = [];
  for (let i = 0; i < cantidad && copia.length > 0; i++) {
    const idx = Math.floor(Math.random() * copia.length);
    seleccionadas.push(copia.splice(idx, 1)[0]);
  }
  return seleccionadas;
}

// Ejemplo de uso:
let palabras = obtenerPalabrasAleatorias(conjunto.filter(p => p.length <= tamanio), 6);

let grid = [], seleccion = [], encontradas = [];
let seleccionando = false;
let celdaPalabras = {}; // Nuevo: mapea "x,y" a lista de palabras

function generarGrid() {
  grid = Array.from({ length: tamanio }, () => Array(tamanio).fill(""));
  celdaPalabras = {}; // Reinicia el mapeo
  palabras.forEach(palabra => colocarPalabra(palabra));
  for (let i = 0; i < tamanio; i++)
    for (let j = 0; j < tamanio; j++)
      if (grid[i][j] === "") grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function colocarPalabra(palabra) {
  const direcciones = [[1,0],[0,1],[1,1],[-1,1]];
  let colocada = false;
  let intentos = 0;
  while (!colocada && intentos < 100) {
    let x = Math.floor(Math.random() * tamanio);
    let y = Math.floor(Math.random() * tamanio);
    let [dx, dy] = direcciones[Math.floor(Math.random() * direcciones.length)];
    let puede = true;
    for (let i = 0; i < palabra.length; i++) {
      let nx = x + dx * i, ny = y + dy * i;
      if (nx < 0 || ny < 0 || nx >= tamanio || ny >= tamanio) {
        puede = false; break;
      }
      if (grid[nx][ny] !== "" && grid[nx][ny] !== palabra[i]) {
        puede = false; break;
      }
    }
    if (puede) {
      for (let i = 0; i < palabra.length; i++) {
        let nx = x + dx * i, ny = y + dy * i;
        grid[nx][ny] = palabra[i];
        // Nuevo: registra la palabra en la celda
        const key = nx + "," + ny;
        if (!celdaPalabras[key]) celdaPalabras[key] = [];
        celdaPalabras[key].push(palabra);
      }
      colocada = true;
    }
    intentos++;
  }
}

// Mouse
function iniciarSeleccion(e) {
  if (e.button !== 0) return; // solo click izquierdo
  limpiarSeleccion(); // Limpia selección anterior
  seleccionando = true;
  seleccion = [];
  marcarCelda(e.target);
}
function arrastrarSeleccion(e) {
  if (!seleccionando) return;
  marcarCelda(e.target);
}
function terminarSeleccion(e) {
  if (!seleccionando) return;
  seleccionando = false;
  validarSeleccion();
}

// Touch
function iniciarSeleccionTouch(e) {
  limpiarSeleccion(); // Limpia selección anterior
  seleccionando = true;
  seleccion = [];
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  marcarCelda(target);
}
function arrastrarSeleccionTouch(e) {
  if (!seleccionando) return;
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  marcarCelda(target);
}
function terminarSeleccionTouch(e) {
  if (!seleccionando) return;
  seleccionando = false;
  validarSeleccion();
}

function limpiarSeleccion() {
  document.querySelectorAll('.cell.selected').forEach(cell => {
    cell.classList.remove('selected');
  });
}

function marcarCelda(cell) {
  if (!cell || !cell.classList.contains("cell")) return;
  const x = parseInt(cell.dataset.x), y = parseInt(cell.dataset.y);
  if (seleccion.some(p => p.x === x && p.y === y)) return;

  if (seleccion.length === 0) {
    // Primera celda
    cell.classList.add("selected");
    seleccion.push({x, y, letra: grid[x][y]});
  } else {
    // Segunda celda o más: selecciona la línea completa si está alineada
    const {x: x0, y: y0} = seleccion[0];
    const dx = x - x0;
    const dy = y - y0;
    // Normaliza dirección a -1, 0 o 1
    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
    // Solo permite líneas rectas (horizontal, vertical, diagonal)
    if (
      (stepX === 0 && stepY !== 0) ||
      (stepY === 0 && stepX !== 0) ||
      (Math.abs(dx) === Math.abs(dy) && stepX !== 0 && stepY !== 0)
    ) {
      // Selecciona todas las celdas intermedias
      const length = Math.max(Math.abs(dx), Math.abs(dy));
      limpiarSeleccion();
      seleccion = [];
      for (let i = 0; i <= length; i++) {
        const nx = x0 + stepX * i;
        const ny = y0 + stepY * i;
        const c = document.querySelector(`.cell[data-x="${nx}"][data-y="${ny}"]`);
        if (c) c.classList.add("selected");
        seleccion.push({x: nx, y: ny, letra: grid[nx][ny]});
      }
    }
  }
}

function dibujarGrid() {
  const gridDiv = document.getElementById("grid");
  gridDiv.style.setProperty('--tamanio', tamanio);
  gridDiv.innerHTML = "";
  for (let i = 0; i < tamanio; i++)
    for (let j = 0; j < tamanio; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[i][j];
      cell.dataset.x = i;
      cell.dataset.y = j;
      // Mouse events
      cell.onmousedown = iniciarSeleccion;
      cell.onmouseenter = arrastrarSeleccion;
      cell.onmouseup = terminarSeleccion;
      // Touch events
      cell.ontouchstart = iniciarSeleccionTouch;
      cell.ontouchmove = arrastrarSeleccionTouch;
      cell.ontouchend = terminarSeleccionTouch;
      // Click simple
      cell.onclick = seleccionarCelda;
      gridDiv.appendChild(cell);
    }
  // Evitar selección de texto al arrastrar
  gridDiv.onmousedown = e => e.preventDefault();
  gridDiv.ontouchstart = e => e.preventDefault();
}

// Selección por click simple
function seleccionarCelda(e) {
  const cell = e.target;
  if (cell.classList.contains("found")) return;
  const x = parseInt(cell.dataset.x), y = parseInt(cell.dataset.y);
  const idx = seleccion.findIndex(p => p.x === x && p.y === y);
  if (idx !== -1) {
    cell.classList.remove("selected");
    seleccion.splice(idx, 1);
  } else {
    cell.classList.add("selected");
    seleccion.push({x, y, letra: grid[x][y]});
  }
  validarSeleccion();
}

function validarSeleccion() {
  if (seleccion.length < 2) return;
  const palabraFormada = seleccion.map(p => p.letra).join("");
  const palabraReversa = seleccion.map(p => p.letra).reverse().join("");
  let encontrada = null;
  if (palabras.includes(palabraFormada) && !encontradas.includes(palabraFormada)) {
    encontrada = palabraFormada;
  } else if (palabras.includes(palabraReversa) && !encontradas.includes(palabraReversa)) {
    encontrada = palabraReversa;
  }
  if (encontrada) {
    encontradas.push(encontrada);
    seleccion.forEach(p => {
      const key = p.x + "," + p.y;
      // Determina si la celda pertenece a alguna palabra ya encontrada
      let perteneceAEncontrada = false;
      if (celdaPalabras[key]) {
        for (const palabra of celdaPalabras[key]) {
          if (encontradas.includes(palabra)) {
            perteneceAEncontrada = true;
            break;
          }
        }
      }
      document.querySelectorAll(".cell").forEach(c => {
        if (parseInt(c.dataset.x) === p.x && parseInt(c.dataset.y) === p.y) {
          c.classList.remove("selected");
          if (perteneceAEncontrada) c.classList.add("found");
        }
      });
    });
    // Además, repinta todas las celdas compartidas por si alguna letra compartida debe actualizarse
    document.querySelectorAll(".cell").forEach(c => {
      const x = parseInt(c.dataset.x), y = parseInt(c.dataset.y);
      const key = x + "," + y;
      let perteneceAEncontrada = false;
      if (celdaPalabras[key]) {
        for (const palabra of celdaPalabras[key]) {
          if (encontradas.includes(palabra)) {
            perteneceAEncontrada = true;
            break;
          }
        }
      }
      if (perteneceAEncontrada) {
        c.classList.add("found");
      } else {
        c.classList.remove("found");
      }
    });
    seleccion = [];
    actualizarLista();
    if (encontradas.length === palabras.length)
      document.getElementById("mensaje").textContent = "¡Excelente! Has completado la sopa 🎉";
  } else {
    // Animación roja y limpiar después de un pequeño delay
    seleccion.forEach(p => {
      document.querySelectorAll(".cell").forEach(c => {
        if (parseInt(c.dataset.x) === p.x && parseInt(c.dataset.y) === p.y) {
          c.classList.add("incorrecta");
        }
      });
    });
    setTimeout(() => {
      seleccion.forEach(p => {
        document.querySelectorAll(".cell").forEach(c => {
          if (parseInt(c.dataset.x) === p.x && parseInt(c.dataset.y) === p.y) {
            c.classList.remove("selected");
            c.classList.remove("incorrecta");
          }
        });
      });
      seleccion = [];
    }, 400);
  }
}

function actualizarLista() {
  const ul = document.getElementById("wordList");
  ul.innerHTML = "";
  palabras.forEach(p => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = p;
    if (encontradas.includes(p)) {
      li.classList.add("encontrada-palabra");
    } else {
      li.classList.add("no-encontrada-palabra");
    }
    ul.appendChild(li);
  });
}

function reiniciarJuego() {
  // NO cambies la dificultad aquí, solo usa la actual
  let cantidad = 6;
  if (tamanio >= 14) cantidad = 9;
  if (tamanio >= 18) cantidad = 12;
  palabras = obtenerPalabrasAleatorias(conjunto.filter(p => p.length <= tamanio), cantidad);
  seleccion = []; encontradas = [];
  document.getElementById("mensaje").textContent = "";
  generarGrid(); dibujarGrid(); actualizarLista();
}

function mostrarJuego(visible) {
  // Muestra u oculta el grid y la lista de palabras
  const gridDiv = document.getElementById("grid");
  const wordList = document.getElementById("wordList");
  const btnNueva = document.getElementById("btnNuevaSopa");
  if (gridDiv) gridDiv.style.display = visible ? "" : "none";
  if (wordList) wordList.style.display = visible ? "" : "none";
  if (btnNueva) btnNueva.style.display = visible ? "" : "none";
}

document.addEventListener('DOMContentLoaded', function() {
  const modalDiv = document.getElementById('modalDificultad');
  // Si existe el modal, muéstralo y oculta el juego
  if (modalDiv) {
    modalDiv.hidden = false;
    mostrarJuego(false);
    // Botón "Comenzar"
    const btn = document.getElementById('btnElegirDificultad');
    if (btn) {
      btn.onclick = function() {
        const select = document.getElementById('dificultad-modal');
        if (select) {
          tamanio = parseInt(select.value);
        }
        let cantidad = 6;
        if (tamanio >= 14) cantidad = 9;
        if (tamanio >= 18) cantidad = 12;
        palabras = obtenerPalabrasAleatorias(conjunto.filter(p => p.length <= tamanio), cantidad);
        seleccion = []; encontradas = [];
        document.getElementById("mensaje").textContent = "";
        generarGrid(); dibujarGrid(); actualizarLista();
        // Oculta el modal personalizado y muestra el juego
        modalDiv.hidden = true;
        mostrarJuego(true);
      };
    }
  } else {
    // Si no hay modal, inicializa el juego normalmente
    generarGrid(); dibujarGrid(); actualizarLista();
    mostrarJuego(true);
  }

  // Botón "Nueva Sopa" ahora muestra el selector de dificultad
  const btnNueva = document.getElementById('btnNuevaSopa');
  if (btnNueva) {
    btnNueva.onclick = function() {
      if (modalDiv) {
        modalDiv.hidden = false;
        mostrarJuego(false);
      } else {
        reiniciarJuego();
      }
    };
  }
});


