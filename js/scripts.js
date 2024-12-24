
/*********************************************************************************************************************************************************************************************
 * **************************************************************************************************** NOTICIAS ***************************************************************************
 * *******************************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", () => {
    loadNews(); // Llama a la función para cargar las noticias
});

async function loadNews() {
    try {
        // Cargar las noticias desde el archivo JSON externo
        const response = await fetch("../noticias.json");
        if (!response.ok) {
            throw new Error('Error al cargar las noticias');
        }
        const data = await response.json();

        // Mostrar las noticias
        displayNews(data);
    } catch (error) {
        console.error("Error al cargar las noticias:", error);
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "<p>Hubo un problema al cargar las noticias.</p>";
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "";
    articles.forEach((article) => {
        const newsCard = document.createElement("div");
        newsCard.className = "news-card";

        newsCard.innerHTML = `
            <img src="${article.image || 'https://via.placeholder.com/300x150'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description || "Descripción no disponible"}</p>
            <a href="${article.url}" target="_blank">Leer más</a>
        `;

        newsContainer.appendChild(newsCard);
    });
}

/*********************************************************************************************************************************************************************
********************************************************************PRESUPUESTO *********************************************************************************************************
********************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPresupuesto");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevenir el envío del formulario si hay errores

        // Validar campos
        const isValid = validarFormulario();

        if (isValid) {
            alert("Formulario enviado correctamente");
            form.reset(); // Reiniciar formulario
        }
    });

    function validarFormulario() {
        let valido = true;

        // Validar nombre
        const nombre = document.getElementById("nombre").value.trim();
        const errorNombre = document.getElementById("errorNombre");
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,15}$/.test(nombre)) {
            errorNombre.textContent = "El nombre solo puede contener letras (máx. 15 caracteres).";
            valido = false;
        } else {
            errorNombre.textContent = "";
        }

        // Validar apellidos
        const apellidos = document.getElementById("apellidos").value.trim();
        const errorApellidos = document.getElementById("errorApellidos");
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,40}$/.test(apellidos)) {
            errorApellidos.textContent = "Los apellidos solo pueden contener letras (máx. 40 caracteres).";
            valido = false;
        } else {
            errorApellidos.textContent = "";
        }

        // Validar teléfono
        const telefono = document.getElementById("telefono").value.trim();
        const errorTelefono = document.getElementById("errorTelefono");
        if (!/^\d{9}$/.test(telefono)) {
            errorTelefono.textContent = "El teléfono debe tener exactamente 9 dígitos.";
            valido = false;
        } else {
            errorTelefono.textContent = "";
        }

        // Validar email
        const email = document.getElementById("email").value.trim();
        const errorEmail = document.getElementById("errorEmail");
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errorEmail.textContent = "El correo electrónico no tiene un formato válido.";
            valido = false;
        } else {
            errorEmail.textContent = "";
        }

        return valido;
    }
});
/*************************************** CALCULO PRESUPUESTO ************************************/
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formPresupuesto");
    const producto = document.getElementById("producto");
    const plazo = document.getElementById("plazo");
    const extras = document.querySelectorAll('input[name="extras"]');
    const totalElement = document.getElementById("total");
    const condiciones = document.getElementById("condiciones");
    const enviarButton = document.getElementById("enviar");

    // Función para calcular el presupuesto
    function calcularPresupuesto() {
        let total = 0;

        // Obtener precio del producto
        const precioProducto = parseFloat(producto.value);
        if (!isNaN(precioProducto)) {
            total += precioProducto;
        }

        // Calcular costo de extras
        extras.forEach(extra => {
            if (extra.checked) {
                total += parseFloat(extra.value);
            }
        });

        // Aplicar descuento por plazo
        const plazoSeleccionado = parseInt(plazo.value);
        if (plazoSeleccionado > 6) {
            total *= 0.9; // Descuento del 10%
        }

        // Mostrar el total
        totalElement.textContent = `${total.toFixed(2)}€`;
    }

    // Función para habilitar o deshabilitar el botón de envío
    function validarFormulario() {
        // Habilitar el botón de envío si se han aceptado las condiciones
        enviarButton.disabled = !condiciones.checked || !form.checkValidity();
    }

    // Calcular presupuesto cuando cambien los valores
    form.addEventListener("change", () => {
        calcularPresupuesto();
        validarFormulario();
    });

    // Validar antes de enviar el formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevenir el envío del formulario si hay errores

        // Validar campos de contacto antes de enviar
        const isValid = validarFormulario();

        if (isValid) {
            alert("Presupuesto enviado correctamente");
            form.reset();
            totalElement.textContent = "0€";
        }
    });

    // Calcular presupuesto inicial
    calcularPresupuesto();
});
/*************************************************************************************************************************************************************************
************************************************************************* MÁPA DINAMICO ************************************************************************************
*************************************************************************************************************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
    // Coordenadas de la empresa (modifica estas coordenadas a tu ubicación real)
    const empresaLat = 40.416775;  // Ejemplo: Madrid
    const empresaLng = -3.703790; // Ejemplo: Madrid

    const map = L.map('map').setView([empresaLat, empresaLng], 13); // Establecer vista inicial del mapa

    // Agregar la capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marcador para la empresa
    const markerEmpresa = L.marker([empresaLat, empresaLng]).addTo(map)
        .bindPopup('<b>Mi Empresa S.A.</b><br>Calle Ficticia, 123, Madrid')
        .openPopup();

    // Función para manejar la geolocalización del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const usuarioLat = position.coords.latitude;
            const usuarioLng = position.coords.longitude;
            const usuarioUbicacion = L.latLng(usuarioLat, usuarioLng);

            // Marcador para la ubicación del usuario
            const markerUsuario = L.marker(usuarioUbicacion).addTo(map)
                .bindPopup('<b>Tu ubicación</b>')
                .openPopup();

            // Calcular la ruta desde el usuario hasta la empresa
            L.Routing.control({
                waypoints: [
                    usuarioUbicacion,
                    [empresaLat, empresaLng] // Coordenadas de la empresa
                ],
                routeWhileDragging: true
            }).addTo(map);
        }, function () {
            alert("No se pudo obtener la ubicación. Se mostrará solo el mapa de la empresa.");
            // Si no se puede obtener la ubicación del usuario, solo mostrar el mapa de la empresa
        });
    } else {
        alert("La geolocalización no es soportada por este navegador.");
    }
});
/*************************************************************************************************************************************************************************
************************************************************************* GALERIA DINAMICA ************************************************************************************
*************************************************************************************************************************************************************************/
let currentImageIndex = 0; // Índice de la imagen actual
const images = [
    "../images/chairs-2181960_1280.jpg",
    "../images/desk-593327_1280.jpg",
    "../images/teamwork-3213924_1280.jpg",
    "../images/woman-4702060_1280.jpg",
    "../images/office-620822_1280.jpg",
    "../images/telework-6795505_1280.jpg",
];

function openModal(imageSrc) {
    currentImageIndex = images.indexOf(imageSrc); // Establece el índice de la imagen actual
    updateModalImage();
    const modal = document.getElementById('windows');
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('windows');
    modal.classList.add('hidden');
}

function changeImage(direction) {
    currentImageIndex += direction; // Cambia el índice según la dirección
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1; // Vuelve al final si está en el inicio
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0; // Vuelve al inicio si está al final
    }
    updateModalImage();
}

function updateModalImage() {
    const modalImg = document.getElementById('windowImg');
    modalImg.src = images[currentImageIndex]; // Actualiza la imagen en la modal
}