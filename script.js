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

function generarGrid() {
  grid = Array.from({ length: tamanio }, () => Array(tamanio).fill(""));
  palabras.forEach(palabra => colocarPalabra(palabra));
  for (let i = 0; i < tamanio; i++)
    for (let j = 0; j < tamanio; j++)
      if (grid[i][j] === "") grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function colocarPalabra(palabra) {
  const direcciones = [[1,0],[0,1],[1,1],[-1,1]];
  let colocada = false;
  while (!colocada) {
    let x = Math.floor(Math.random() * tamanio);
    let y = Math.floor(Math.random() * tamanio);
    let [dx, dy] = direcciones[Math.floor(Math.random() * direcciones.length)];
    let puede = true;
    for (let i = 0; i < palabra.length; i++) {
      let nx = x + dx * i, ny = y + dy * i;
      if (nx < 0 || ny < 0 || nx >= tamanio || ny >= tamanio || (grid[nx][ny] && grid[nx][ny] !== palabra[i])) {
        puede = false; break;
      }
    }
    if (puede) {
      for (let i = 0; i < palabra.length; i++)
        grid[x + dx * i][y + dy * i] = palabra[i];
      colocada = true;
    }
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
  if (!cell || !cell.classList.contains("cell") || cell.classList.contains("found")) return;
  const x = parseInt(cell.dataset.x), y = parseInt(cell.dataset.y);
  if (seleccion.some(p => p.x === x && p.y === y)) return;
  cell.classList.add("selected");
  seleccion.push({x, y, letra: grid[x][y]});
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
      document.querySelectorAll(".cell").forEach(c => {
        if (parseInt(c.dataset.x) === p.x && parseInt(c.dataset.y) === p.y) {
          c.classList.remove("selected");
          c.classList.add("found");
        }
      });
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

document.addEventListener('DOMContentLoaded', function() {
  const modalDiv = document.getElementById('modalDificultad');
  let modal;
  if (modalDiv && typeof bootstrap !== 'undefined') {
    modal = new bootstrap.Modal(modalDiv, {backdrop: 'static', keyboard: false});
    modal.show();

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
        modal.hide();
      };
    }
  }

  // Botón "Nueva Sopa" SIEMPRE reinicia la sopa con la dificultad actual
  const btnNueva = document.getElementById('btnNuevaSopa');
  if (btnNueva) {
    btnNueva.onclick = function() {
      reiniciarJuego();
    };
  }
});


