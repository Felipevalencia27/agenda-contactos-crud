
// ================================================
// AGENDA DE CONTACTOS
// CRUD CON LOCALSTORAGE
// ================================================


// ================================================
// PROMPT 1: REFERENCIAS A LOS ELEMENTOS DEL HTML
// ================================================

const formulario = document.getElementById("formulario-contacto");

const inputNombre = document.getElementById("nombre");
const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");
const selectCategoria = document.getElementById("categoria");
const inputNotas = document.getElementById("notas");

const botonGuardar = document.getElementById("boton-guardar");
const botonCancelar = document.getElementById("boton-cancelar");
const tituloFormulario = document.getElementById("titulo-formulario");

const tablaContactos = document.getElementById("tabla-contactos");

const CLAVE_STORAGE = "contactos";


// ================================================
// PROMPT 3: REFERENCIAS DEL BUSCADOR Y FILTRO
// ================================================

const inputBusqueda = document.getElementById("buscar-contacto");
const filtroCategoria = document.getElementById("filtrar-categoria");
const mensajeVacio = document.getElementById("mensaje-vacio");


// ================================================
// PROMPT 4: ESTADO DE LA APLICACIÓN
// ================================================

// Guarda el ID del contacto que se está editando.
// Si es null, significa que estamos creando uno nuevo.

let idEditando = null;


// ================================================
// PROMPT 1: FUNCIONES DE LOCALSTORAGE
// ================================================

// Leer los contactos guardados.
function obtenerContactos() {
    try {
        const datos = localStorage.getItem(CLAVE_STORAGE);
        return datos ? JSON.parse(datos) : [];
    } catch (error) {
        console.error("Error al leer los contactos:", error);
        return [];
    }
}

// Guardar los contactos en localStorage.
function guardarContactos(contactos) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(contactos));
}


// ================================================
// PROMPT 2: VALIDACIONES DEL FORMULARIO
// ================================================

// Mostrar un mensaje de error debajo del campo.
function mostrarError(campo, mensaje) {
    document.getElementById("error-" + campo).textContent = mensaje;
}

// Limpiar todos los mensajes de error.
function limpiarErrores() {
    ["nombre", "telefono", "correo", "categoria"].forEach(function(campo) {
        mostrarError(campo, "");
    });
}

// Comprobar que los datos ingresados sean correctos.
function validarFormulario() {
    limpiarErrores();

    let valido = true;

    const nombre = inputNombre.value.trim();
    const telefono = inputTelefono.value.trim();
    const correo = inputCorreo.value.trim();
    const categoria = selectCategoria.value;

    // Validar nombre obligatorio y mínimo 3 caracteres.
    if (nombre.length < 3) {
        mostrarError("nombre", "El nombre debe tener mínimo 3 caracteres.");
        valido = false;
    }

    // Validar teléfono: únicamente números de 7 a 10 dígitos.
    if (!/^[0-9]{7,10}$/.test(telefono)) {
        mostrarError("telefono", "Ingrese entre 7 y 10 números.");
        valido = false;
    }

    // Validar formato del correo electrónico.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarError("correo", "Ingrese un correo electrónico válido.");
        valido = false;
    }

    // Validar que la categoría sea obligatoria.
    if (categoria === "") {
        mostrarError("categoria", "Seleccione una categoría.");
        valido = false;
    }

    return valido;
}


// ================================================
// PROMPT 4: FUNCIONES PEQUEÑAS Y ORGANIZADAS
// ================================================

// Obtener los datos del formulario en un objeto.
function obtenerDatosFormulario() {
    return {
        nombre: inputNombre.value.trim(),
        telefono: inputTelefono.value.trim(),
        correo: inputCorreo.value.trim(),
        categoria: selectCategoria.value,
        notas: inputNotas.value.trim()
    };
}

// Crear una celda de la tabla de forma segura.
function crearCelda(texto) {
    const celda = document.createElement("td");
    celda.textContent = texto || "";
    return celda;
}

// Crear botones de acciones.
function crearBoton(texto, clase, id) {
    const boton = document.createElement("button");

    boton.type = "button";
    boton.textContent = texto;
    boton.className = clase;
    boton.dataset.id = id;

    return boton;
}


// ================================================
// PROMPT 1: MOSTRAR CONTACTOS EN LA TABLA
// PROMPT 3: APLICAR BÚSQUEDA Y FILTRO
// ================================================

function mostrarContactos() {
    const contactos = obtenerContactos();

    const textoBusqueda = inputBusqueda.value.trim().toLowerCase();
    const categoriaSeleccionada = filtroCategoria.value;

    // Filtrar los contactos por nombre y categoría.
    const contactosFiltrados = contactos.filter(function(contacto) {

        const coincideNombre = contacto.nombre
            .toLowerCase()
            .includes(textoBusqueda);

        const coincideCategoria = categoriaSeleccionada === "" ||
            contacto.categoria === categoriaSeleccionada;

        return coincideNombre && coincideCategoria;
    });

    // Limpiar la tabla.
    tablaContactos.innerHTML = "";

    // Recorrer los contactos encontrados.
    contactosFiltrados.forEach(function(contacto) {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(contacto.nombre));
        fila.appendChild(crearCelda(contacto.telefono));
        fila.appendChild(crearCelda(contacto.correo));
        fila.appendChild(crearCelda(contacto.categoria));

        // Crear la celda de acciones.
        const celdaAcciones = document.createElement("td");

        // PROMPT 3: Botón Editar.
        const botonEditar = crearBoton(
            "Editar",
            "btn-editar",
            contacto.id
        );

        // PROMPT 4: Botón Eliminar.
        const botonEliminar = crearBoton(
            "Eliminar",
            "btn-eliminar",
            contacto.id
        );

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaAcciones);
        tablaContactos.appendChild(fila);
    });

    // Mostrar mensaje si no existen resultados.
    mensajeVacio.hidden = contactosFiltrados.length > 0;
}


// ================================================
// PROMPT 1: CREATE - CREAR CONTACTOS
// PROMPT 3: UPDATE - ACTUALIZAR CONTACTOS
// PROMPT 2: VALIDAR ANTES DE GUARDAR
// ================================================

function manejarEnvio(evento) {
    evento.preventDefault();

    // Verificar las validaciones.
    if (!validarFormulario()) {
        return;
    }

    const contactos = obtenerContactos();
    const datos = obtenerDatosFormulario();

    if (idEditando === null) {

        // CREATE: crear un contacto nuevo.
        const nuevoContacto = {
            id: crypto.randomUUID(),
            ...datos
        };

        contactos.push(nuevoContacto);

    } else {

        // UPDATE: buscar el contacto por su ID.
        const posicion = contactos.findIndex(function(contacto) {
            return String(contacto.id) === String(idEditando);
        });

        // Reemplazar los datos del contacto seleccionado.
        if (posicion !== -1) {
            contactos[posicion] = {
                id: contactos[posicion].id,
                ...datos
            };
        }
    }

    // Guardar y actualizar la información.
    guardarContactos(contactos);

    salirModoEdicion();
    mostrarContactos();
}


// ================================================
// PROMPT 3: EDITAR CONTACTOS
// ================================================

function iniciarEdicion(id) {

    // Buscar el contacto por su identificador.
    const contacto = obtenerContactos().find(function(item) {
        return String(item.id) === String(id);
    });

    if (!contacto) return;

    // Guardar el ID del contacto seleccionado.
    idEditando = contacto.id;

    // Cargar los datos en el formulario.
    inputNombre.value = contacto.nombre;
    inputTelefono.value = contacto.telefono;
    inputCorreo.value = contacto.correo;
    selectCategoria.value = contacto.categoria;
    inputNotas.value = contacto.notas || "";

    // Cambiar el formulario al modo edición.
    botonGuardar.textContent = "Actualizar";
    tituloFormulario.textContent = "Editar contacto";
    botonCancelar.hidden = false;

    limpiarErrores();
    inputNombre.focus();

    formulario.scrollIntoView({ behavior: "smooth" });
}


// ================================================
// PROMPT 3: CANCELAR LA EDICIÓN
// ================================================

function salirModoEdicion() {

    // Limpiar el formulario.
    idEditando = null;
    formulario.reset();

    // Restaurar el modo de creación.
    botonGuardar.textContent = "Guardar contacto";
    tituloFormulario.textContent = "Registrar contacto";

    // Ocultar el botón Cancelar.
    botonCancelar.hidden = true;

    limpiarErrores();
}


// ================================================
// PROMPT 4: ELIMINAR CONTACTOS
// ================================================

function eliminarContacto(id) {

    let contactos = obtenerContactos();

    // Crear una lista sin el contacto seleccionado.
    contactos = contactos.filter(function(contacto) {
        return String(contacto.id) !== String(id);
    });

    guardarContactos(contactos);

    // Cancelar la edición si se eliminó ese contacto.
    if (String(idEditando) === String(id)) {
        salirModoEdicion();
    }

    mostrarContactos();
}


// ================================================
// PROMPT 3: EVENTOS DE LOS BOTONES
// ================================================

tablaContactos.addEventListener("click", function(evento) {

    const boton = evento.target.closest("button");

    if (!boton) return;

    const id = boton.dataset.id;

    // Detectar el botón Editar.
    if (boton.classList.contains("btn-editar")) {
        iniciarEdicion(id);
    }

    // Detectar el botón Eliminar.
    if (boton.classList.contains("btn-eliminar")) {
        eliminarContacto(id);
    }
});


// ================================================
// PROMPT 1: EVENTO DE ENVÍO DEL FORMULARIO
// ================================================

formulario.addEventListener("submit", manejarEnvio);

botonCancelar.addEventListener("click", salirModoEdicion);


// ================================================
// PROMPT 3: EVENTOS DEL BUSCADOR Y DEL FILTRO
// ================================================

// Buscar contactos mientras se escribe.
inputBusqueda.addEventListener("input", mostrarContactos);

// Filtrar contactos al seleccionar una categoría.
filtroCategoria.addEventListener("change", mostrarContactos);


// ================================================
// PROMPT 2: LIMPIAR ERRORES AL CORREGIR CAMPOS
// ================================================

inputNombre.addEventListener("input", function() {
    mostrarError("nombre", "");
});

inputTelefono.addEventListener("input", function() {
    mostrarError("telefono", "");
});

inputCorreo.addEventListener("input", function() {
    mostrarError("correo", "");
});

selectCategoria.addEventListener("change", function() {
    mostrarError("categoria", "");
});


// ================================================
// PROMPT 1: CARGAR CONTACTOS AL ABRIR LA PÁGINA
// ================================================

mostrarContactos();


// ================================================
// FIN DE LA AGENDA DE CONTACTOS
// ================================================
