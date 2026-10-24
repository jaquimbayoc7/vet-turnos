//Aquí se consolida la lógica del ejercicio para registrar mascotas
document.getElementById("formulario").addEventListener("submit", (e)=>{
    e.preventDefault();//evita que la página se recargue al enviar el formulario
    document.getElementById("mensaje").textContent = "Mascota registrada correctamente";
});