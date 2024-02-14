let listaCompras = [];

// Función para cargar la lista desde el Local Storage al cargar la página
function cargarListaDesdeLocalStorage() {
    const listaGuardada = localStorage.getItem('listaCompras');
    if (listaGuardada) {
        listaCompras = JSON.parse(listaGuardada);
        actualizarLista();
    }
}

// Función para guardar la lista en el Local Storage
function guardarListaEnLocalStorage() {
    localStorage.setItem('listaCompras', JSON.stringify(listaCompras));
}

// Al cargar la página, cargar la lista desde el Local Storage
window.addEventListener('load', cargarListaDesdeLocalStorage);

// Agregar un producto a la lista
function agregarProducto() {
    const nombreProducto = document.getElementById("producto").value.trim();
    const precioProducto = parseFloat(document.getElementById("precio").value.trim());

    // Verificar que los campos no estén vacíos y el precio sea válido
    if (nombreProducto === "" || isNaN(precioProducto) || precioProducto <= 0) {
        mostrarMensaje("Por favor, ingrese un nombre de producto válido y un precio numérico mayor que cero.", "error");
        return;
    }
    const idProducto = Date.now();

    // Agregar el producto a la lista
    listaCompras.push({ id: idProducto, nombre: nombreProducto, precio: precioProducto });

    // Actualizar la lista en la interfaz y guardar en el Local Storage
    actualizarLista();
    guardarListaEnLocalStorage();

    // Mostrar notificación de éxito
    mostrarMensaje("Producto agregado correctamente", "exito");
}

// Eliminar un producto de la lista
function eliminarProducto(idProducto) {
    listaCompras = listaCompras.filter(producto => producto.id !== idProducto);
    actualizarLista();
    guardarListaEnLocalStorage();

    // Mostrar notificación de éxito
    mostrarMensaje("Producto eliminado correctamente", "exito");
}

// Buscar productos en la lista
function buscarProducto() {
    const textoBusqueda = document.getElementById("buscar").value.trim().toLowerCase();
    const productosFiltrados = listaCompras.filter(producto =>
        producto.nombre.toLowerCase().includes(textoBusqueda)
    );
    actualizarLista(productosFiltrados, "resultados-busqueda");
}

// Editar un producto de la lista
function editarProducto(idProducto) {
    const producto = listaCompras.find(producto => producto.id === idProducto);

    Swal.fire({
        title: 'Editar producto',
        html: `<input id="swal-input1" class="swal2-input" placeholder="Nombre del producto" value="${producto.nombre}">
               <input id="swal-input2" class="swal2-input" placeholder="Precio del producto" value="${producto.precio}">`,
        focusConfirm: false,
        showCloseButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Okay',
        preConfirm: () => {
            const nuevoNombre = Swal.getPopup().querySelector('#swal-input1').value;
            const nuevoPrecio = Swal.getPopup().querySelector('#swal-input2').value;
            if (!nuevoNombre || isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
                Swal.showValidationMessage("Por favor, ingrese un nombre de producto válido y un precio numérico mayor que cero.");
            }
            return { nuevoNombre: nuevoNombre, nuevoPrecio: nuevoPrecio };
        }
    }).then(result => {
        if (result.isConfirmed) {
            producto.nombre = result.value.nuevoNombre;
            producto.precio = parseFloat(result.value.nuevoPrecio);
            actualizarLista();

            // Mostrar notificación de éxito
            mostrarMensaje("Producto editado correctamente", "exito");
        }
    });
}

// Actualizar la lista en la interfaz
function actualizarLista(productos = listaCompras, contenedorId = "lista-compras") {
    let listaHTML = "";
    let totalPrecio = 0;

    productos.forEach((producto) => {
        listaHTML += `
            <div>
                <span>${producto.nombre}</span>
                <span>$${producto.precio.toFixed(2)}</span>
                <button class="interno eliminar-btn" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                <button class="interno editar-btn" onclick="editarProducto(${producto.id})">Editar</button>
            </div>
        `;
        totalPrecio += producto.precio;
    });

    document.getElementById(contenedorId).innerHTML = listaHTML;
    if (contenedorId === "lista-compras") {
        document.getElementById("total").textContent = `Total: $${totalPrecio.toFixed(2)}`;
    }
}

// Mostrar mensaje utilizando Toastify
function mostrarMensaje(mensaje, tipo) {
    Toastify({
        text: mensaje,
        duration: 1500,
        close: true,
        gravity: "top",
        backgroundColor: tipo === "exito" ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)",
    }).showToast();
}

// Limpiar campos de entrada
function limpiarCampos() {
    document.getElementById("producto").value = "";
    document.getElementById("precio").value = "";
}

// Ordenar la lista
function ordenarLista() {
    const orden = document.getElementById("ordenar").value;
    listaCompras.sort((a, b) => (orden === "precio-menor" ? a.precio - b.precio : b.precio - a.precio));
    actualizarLista();
}

// Event listeners
document.getElementById("agregar").addEventListener("click", agregarProducto);
document.getElementById("ordenar").addEventListener("change", ordenarLista);
document.getElementById("buscar-btn").addEventListener("click", buscarProducto);
