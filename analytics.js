// Obtener el ID del usuario desde la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id_usuario');
console.log("ID de usuario capturado:", userId);

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwBq8YX9CVNIfui93u9kytIJRUlDK0o54",
  authDomain: "daralius-b4f88.firebaseapp.com",
  databaseURL: "https://daralius-b4f88-default-rtdb.firebaseio.com",
  projectId: "daralius-b4f88",
  storageBucket: "daralius-b4f88.appspot.com",
  messagingSenderId: "998963006445",
  appId: "1:998963006445:android:b9d28717e9734e92e375e4"
};

// Inicializar Firebase en modo compat
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Variables para almacenar instancias de los gráficos
let chartInstanceFrasesMasUtilizadas = null;
let chartInstanceFrasesMenosUtilizadas = null;
let chartInstancePalabrasMasUtilizadas = null;
let chartInstancePalabrasMenosUtilizadas = null;

// Función para obtener datos del usuario usando el ID capturado
function obtenerDatosUsuario() {
  if (!userId) {
    console.error("No se ha proporcionado un id_usuario");
    return;
  }

  // Referencias para frases y palabras
  const frasesRef = database.ref(`Frases/${userId}`);
  const palabrasRef = database.ref(`Palabras/${userId}`);

  // Obtener datos de frases y palabras
  Promise.all([
    frasesRef.once('value'),
    palabrasRef.once('value')
  ]).then(([frasesSnapshot, palabrasSnapshot]) => {
    const frasesData = frasesSnapshot.val();
    const palabrasData = palabrasSnapshot.val();

    // Lógica para mostrar el mensaje o los gráficos
    if (frasesData || palabrasData) {
      mostrarGraficos(frasesData, palabrasData);
    } else {
      document.getElementById('chartMessage').innerText = "Todavía no utilizas ninguna frase o palabra.";
    }
  }).catch(error => {
    console.error("Error al obtener datos del usuario:", error);
  });
}

// Llama a la función al cargar la página
obtenerDatosUsuario();

// Función para mostrar gráficos de las 10 más y menos utilizadas
// Lógica para mostrar gráficos de las 10 más y menos utilizadas
// Lógica para mostrar gráficos de las 10 más y menos utilizadas
function mostrarGraficos(frasesData, palabrasData) {
    if (frasesData) {
      const frasesOrdenadas = Object.values(frasesData).sort((a, b) => b.cantidad - a.cantidad);
      const top10Frases = frasesOrdenadas.slice(0, 10);
      const bottom10Frases = frasesOrdenadas.slice(-10).reverse(); // Cambiado
  
      mostrarGrafico('chartFrasesMasUtilizadas', top10Frases, 'Uso de Frases - Más Utilizadas');
      mostrarGrafico('chartFrasesMenosUtilizadas', bottom10Frases, 'Uso de Frases - Menos Utilizadas');
    }
  
    if (palabrasData) {
      const palabrasOrdenadas = Object.values(palabrasData).sort((a, b) => b.cantidad - a.cantidad);
      const top10Palabras = palabrasOrdenadas.slice(0, 10);
      const bottom10Palabras = palabrasOrdenadas.slice(-10).reverse(); // Cambiado
  
      mostrarGrafico('chartPalabrasMasUtilizadas', top10Palabras, 'Uso de Palabras - Más Utilizadas');
      mostrarGrafico('chartPalabrasMenosUtilizadas', bottom10Palabras, 'Uso de Palabras - Menos Utilizadas');
    }
}

// Función para mostrar un gráfico específico
function mostrarGrafico(canvasId, data, label) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Verificar si ya existe un gráfico en la variable global y destruirlo si es necesario
  if (window[canvasId] instanceof Chart) {
    window[canvasId].destroy();
  }

  // Crear los datos del gráfico
  const labels = data.map(item => item.frase || item.palabra); // Usa 'frase' o 'palabra' según corresponda
  const valores = data.map(item => item.cantidad);

  // Crear nuevo gráfico y almacenarlo en la variable correspondiente
  window[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: valores,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
