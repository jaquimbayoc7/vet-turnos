//Abstracción de la lógica para registrar mascotas
class Mascota {
  constructor(nombre, peso) {
    if (new.target === Mascota) {
      throw new TypeError(
        "No se puede instanciar la clase Mascota directamente",
      );
    }
    this.nombre = nombre;
    this.peso = peso;
  }
  //Contrato
  hacerSonido(){
    throw new Error(`${this.constructor.nombre} debe implementar el método de Hacer Sonido`);
  }
} 

//Sección para definir clases específicas de mascotas que heredan de Mascota
class Perro extends Mascota{
    hacerSonido(){
        return "Guau Guau";
    }
}

class Gato extends Mascota{
    hacerSonido(){
        return "Miau Miau";
    }
}

//Conexión con la página de Index.
const pacientes = [];
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");

function mostrar(tipo, texto){
    mensaje.className = tipo;
    mensaje.textContent = texto;
}

function dibujar(){
    lista.innerHTML= "";
    for(const m of pacientes){
        const li = document.createElement("li");
        li.className = "Paciente";
        li.textContent = `${m.constructor.name}: ${m.nombre} - ${m.peso} Kg.`;
        const detalle = document.createElement("small");
        detalle.textContent = m.hacerSonido();
        li.appendChild(detalle);
        lista.appendChild(li);
    }
}

//Aquí se consolida la lógica del ejercicio para registrar mascotas
document.getElementById("formulario").addEventListener("submit", (e) => {
  e.preventDefault(); //evita que la página se recargue al enviar el formulario
  const tipo = document.getElementById("tipo").value;
  const nombre = document.getElementById("nombre").value;
  const peso = Number(document.getElementById("peso").value);

  const mascota = tipo === "perro" ? new Perro(nombre, peso) : new Gato(nombre, peso);

  pacientes.push(mascota);

  dibujar();

  mostrar("ok", `Mascota ${nombre} registrada correctamente`);
});
