document.getElementById("login").addEventListener("submit", function(event){
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username === "admin" && password === "123456"){
        window.location.href = "Admin.html";
    } else {
        alert("el usuario y/o contraseña son incorrectos")
    }
});