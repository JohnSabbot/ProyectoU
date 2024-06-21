// app.js
document.addEventListener("DOMContentLoaded", function() {
    fetch('/catalogo')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Actualizar el contador de productos
            const productCountElement = document.getElementById("product-count");
            productCountElement.textContent = `Total de productos: ${data.length}`;

            // Renderizar la lista de productos
            const promosList = document.getElementById('promos-list');
            data.forEach(function(producto) {
                var card = document.createElement('div');
                card.classList.add('card');
                card.style.width = '18rem';
                card.innerHTML = 
                    '<div class="card-body">' +
                    '<h5 class="card-title">' + producto.nombreProducto + '</h5>' +
                    '<p><strong>Stock:</strong> ' + producto.stock + '</p>' +
                    '<p><strong>Precio:</strong> $' + producto.precioUnitario + '</p>' +
                    '</div>';
                promosList.appendChild(card);
            });
        });
});
