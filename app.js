
// Obtener los elementos del HTML
const formulario = document.getElementById("contact-form");
const listaContactos = document.getElementById("contact-list");

// Cargar los contactos guardados en localStorage
let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

// Guardar el arreglo de contactos en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem("contactos", JSON.stringify(contactos));
}

// Mostrar todos los contactos en la tabla
function mostrarContactos() {
    // Limpiar la tabla antes de volver a mostrar los datos
    listaContactos.innerHTML = "";

    // Recorrer el arreglo de contactos
    contactos.forEach(function(contacto) {
        const fila = document.createElement("tr");

        // Crear las celdas de cada contacto
        fila.innerHTML = `
            <td>${escapeHTML(contacto.nombre)}</td>
            <td>${escapeHTML(contacto.telefono)}</td>
            <td>${escapeHTML(contacto.correo)}</td>
            <td>${escapeHTML(contacto.categoria)}</td>
            <td>
                <button type="button" onclick="eliminarContacto('${contacto.id}')">
                    Eliminar
                </button>
            </td>
        `;

        // Agregar la fila a la tabla
        listaContactos.appendChild(fila);
    });
}

// Evitar que los datos ingresados se interpreten como HTML
function escapeHTML(texto) {
    const elemento = document.createElement("span");
    elemento.textContent = texto;
    return elemento.innerHTML;
}

// Generar un identificador único para cada contacto
function generarId() {
    return crypto.randomUUID();
}

// Escuchar el envío del formulario
formulario.addEventListener("submit", function(evento) {
    // Evitar que la página se recargue
    evento.preventDefault();

    // Obtener los valores escritos en el formulario
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const categoria = document.getElementById("categoria").value;
    const notas = document.getElementById("notas").value.trim();

    // Crear un objeto con la información del contacto
    const nuevoContacto = {
        id: generarId(),
        nombre: nombre,
        telefono: telefono,
        correo: correo,
        categoria: categoria,
        notas: notas
    };

    // Agregar el nuevo contacto al arreglo
    contactos.push(nuevoContacto);

    // Guardar los contactos actualizados
    guardarEnLocalStorage();

    // Actualizar la tabla
    mostrarContactos();

    // Limpiar los campos del formulario
    formulario.reset();
});

// Eliminar un contacto utilizando su identificador
function eliminarContacto(id) {
    // Crear un nuevo arreglo sin el contacto seleccionado
    contactos = contactos.filter(function(contacto) {
        return contacto.id !== id;
    });

    // Actualizar localStorage y la tabla
    guardarEnLocalStorage();
    mostrarContactos();
}

// Mostrar los contactos guardados al abrir la página
mostrarContactos();
