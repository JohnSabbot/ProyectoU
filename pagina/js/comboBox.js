document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('CBX').addEventListener('submit', function(event) {

        var selectedValue = document.getElementById('motivo').value;

        if (selectedValue === 'value1') {
            alert('Por favor, selecciona un motivo válido.');
            event.preventDefault(); 
            //no me funciono pero la idea es que no pueda enviarse con el "selecione" 
        }

        else if (selectedValue === 'Devolvolucion') {
            //al seleccionar devolucion, que pida una explicacion, es para que crean que un empleado lo leera y se pondra en contacto con el usuario


        } else if (selectedValue === 'Queja') {
            //lo mismo que devolucion pero que pida el id del producto, el nombre y la factura 



        } else if (selectedValue === 'Garantia') {
            ////lo mismo que Queja



        } else if (selectedValue === 'Otro Motivo') {
            //que pueda escribir el motivo, para que un empleado lo puedaa leer (cree que lo van a leer wuaaaaaaja xd saludos)


        } else  {
            //aca no se me ocurre nada/ delete system32 ola

        }
    });
});