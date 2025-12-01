// ====== GESTOR DE PEDIDOS (INDEX.HTML) ======

let pedido = [];

// -------- BUSCAR PRODUCTOS --------
function buscar() {
    const q = document.getElementById("buscador").value.toLowerCase().trim();
    const cont = document.getElementById("resultados");

    if (!q) {
        cont.innerHTML = "<p>No se ingresó texto de búsqueda.</p>";
        return;
    }

    // LISTA_PRODUCTOS viene de productos_lista.js
    const encontrados = LISTA_PRODUCTOS.filter(p => {
        const desc = (p.descripcion || "").toLowerCase();
        const cod  = (p.codigo || "").toString();
        return desc.includes(q) || cod.startsWith(q);
    });

    if (!encontrados.length) {
        cont.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    let html = `
        <table class="table table-sm table-hover">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;

    encontrados.forEach(p => {
        const descEsc = (p.descripcion || "").replace(/"/g, '&quot;');
        html += `
            <tr>
                <td>${p.codigo}</td>
                <td>${p.descripcion}</td>
                <td>${p.precio}</td>
                <td>
                    <button class="btn btn-sm btn-primary"
                        onclick="seleccionarPorCodigo('${p.codigo}')">
                        Elegir
                    </button>
                </td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    cont.innerHTML = html;
}

// -------- SELECCIONAR PRODUCTO POR CÓDIGO --------
function seleccionarPorCodigo(codigo) {
    const prod = LISTA_PRODUCTOS.find(
        p => p.codigo.toString() === codigo.toString()
    );
    if (!prod) {
        alert("No encontré el producto con código " + codigo);
        return;
    }

    document.getElementById("codigoSel").value = prod.codigo;
    document.getElementById("descripcionSel").value = prod.descripcion;
    document.getElementById("precioSel").value = prod.precio;
    document.getElementById("cantidadSel").value = 1;
}

// -------- AGREGAR ÍTEM AL PEDIDO --------
function agregarItem() {
    const codigo = document.getElementById("codigoSel").value.trim();
    const desc   = document.getElementById("descripcionSel").value.trim();
    const precio = parseFloat(document.getElementById("precioSel").value);
    const cant   = parseInt(document.getElementById("cantidadSel").value);

    if (!codigo || !desc || isNaN(precio) || !cant || cant <= 0) {
        alert("Falta seleccionar producto o cantidad.");
        return;
    }

    const total = precio * cant;
    pedido.push({ codigo, desc, precio, cant, total });
    renderPedido();

    // limpiar selección
    document.getElementById("codigoSel").value = "";
    document.getElementById("descripcionSel").value = "";
    document.getElementById("precioSel").value = "";
    document.getElementById("cantidadSel").value = 1;
}

// -------- MOSTRAR TABLA DEL PEDIDO --------
function renderPedido() {
    const tbody = document.getElementById("tablaPedido");
    tbody.innerHTML = "";
    let totalGeneral = 0;

    pedido.forEach((p, i) => {
        totalGeneral += p.total;
        tbody.innerHTML += `
            <tr>
                <td>${p.codigo}</td>
                <td>${p.desc}</td>
                <td>${p.precio.toFixed(2)}</td>
                <td>${p.cant}</td>
                <td>${p.total.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger"
                        onclick="borrarItem(${i})">
                        X
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalGeneral").textContent =
        totalGeneral.toFixed(2);
}

// -------- BORRAR UNA LÍNEA --------
function borrarItem(indice) {
    pedido.splice(indice, 1);
    renderPedido();
}

// -------- LIMPIAR TODO EL PEDIDO --------
function limpiarPedido() {
    pedido = [];
    renderPedido();
}

// -------- EXPORTAR A CSV --------
function exportarCSV() {
    if (!pedido.length) {
        alert("No hay ítems en el pedido.");
        return;
    }

    const cliente = document.getElementById("cliente").value || "SIN_CLIENTE";
    let csv = "Cliente;Código;Descripción;Precio;Cantidad;Total\n";

    pedido.forEach(p => {
        csv += `${cliente};${p.codigo};${p.desc};${p.precio.toFixed(2)};${p.cant};${p.total.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido_${cliente}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// -------- ATALLO: ENTER EN EL BUSCADOR --------
document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscador");
    if (buscador) {
        buscador.addEventListener("keyup", (e) => {
            if (e.key === "Enter") buscar();
        });
    }
});
