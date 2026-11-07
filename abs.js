//Class Encapsulamiento + Abstracción
class Mascota{
    #peso; //campo de tipo privado (private) - public(acceder desde cualquier clase), private (solo accesible dentro de la clase), 
    //protected (solo accesible dentro de la clase y sus subclases), default (solo accesible dentro del mismo paquete)

    constructor(nombre, peso) {
    if (new.target === Mascota) {
      throw new TypeError(
        "No se puede instanciar la clase Mascota directamente",
      );
    }
    this.nombre = nombre;
    this.peso = peso;
  }
  //metodos get y set para acceder al peso privado
  get peso(){
    return this.#peso;
  }
  //metodo para dar el valor del peso al atributo privado #peso
  set peso(valor){
    if(typeof valor !== "number" || valor <= 0 || isNaN(valor)){
      throw new RangeError("El peso debe ser un número positivo o mayor a cero");
    }
    this.#peso = valor;
  }

  //Contrato para hacer Sonido
  hacerSonido(){
    throw new Error(`${this.constructor.nombre} debe implementar el método de Hacer Sonido`);
  }
}

//Implementación de la clases hijas por herencia
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

//Implementación de lista de mascotas privada
class Clinica{
    #pacientes = [];

    registrar(mascota){
        if(!(mascota instanceof Mascota)){
            throw new TypeError("Solo se pueden registrar instancias de Mascota");
        }
        this.#pacientes.push(mascota);
    }

    //object(xasasas)
    get pacientes(){
        return [...this.#pacientes]; //imprimir una copia del arreglo para no exponer el original
    }
}

//Conexión con el html principal y pruebas
const clinica = new Clinica();
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");
const total = document.getElementById("total");

function mostrar(tipo, text){
    mensaje.textContent = text;
    mensaje.className = tipo;
}

function dibujar(){
    lista.innerHTML= "";
    for(const m of clinica.pacientes){
        const li = document.createElement("li");
        li.className = "Paciente";
        li.textContent = `${m.constructor.name}: ${m.nombre} - ${m.peso} Kg.`;
        const detalle = document.createElement("small");
        detalle.textContent = m.hacerSonido();
        li.appendChild(detalle);
        lista.appendChild(li);
    }
    total.textContent = `Total de pacientes: ${clinica.pacientes.length}`;
}

//Aquí se consolida la lógica del ejercicio para registrar mascotas
document.getElementById("formulario").addEventListener("submit", (e) => {
  e.preventDefault(); //evita que la página se recargue al enviar el formulario
  const tipo = document.getElementById("tipo").value;
  const nombre = document.getElementById("nombre").value;
  const peso = Number(document.getElementById("peso").value);

  try{
    const mascota = tipo === "perro" ? new Perro(nombre, peso) : new Gato(nombre, peso);
    clinica.registrar(mascota);
    dibujar();
    mostrar("ok", `Mascota ${nombre} registrada correctamente`);
  }catch(error){
    mostrar("error", error.message);
  }
 
});