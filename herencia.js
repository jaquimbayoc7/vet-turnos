// Script de Abstracción + Encapsulamiento + Herencia para Vet Turnos
class Mascota {
  #peso; //campo privado

  constructor(nombre, peso, especie) {
    if (new.target === Mascota) {
      throw new Error(
        "No se puede instanciar directamente la clase Mascota porque es abstracta",
      );
    }
    this.nombre = nombre;
    this.#peso = peso;
    this.especie = especie;
  }
  //metodos get y set para acceder al peso privado
  get peso() {
    return this.#peso;
  }
  //metodo para dar el valor del peso al atributo privado #peso
  set peso(valor) {
    if (typeof valor !== "number" || valor <= 0 || isNaN(valor)) {
      throw new RangeError(
        "El peso debe ser un número positivo o mayor a cero",
      );
    }
    this.#peso = valor;
  }

    //Contrato para hacer Sonido
  hacerSonido(){
    throw new Error(`${this.constructor.nombre} debe implementar el método de Hacer Sonido`);
  }

  //Método para describir la mascota
  describir(){
    return `Nombre: ${this.nombre}, Peso: ${this.#peso} Kg, Especie: ${this.especie}`;
  }
}

// Clases de Herencia de Perro
class Perro extends Mascota{
    constructor(nombre, peso, raza){
        super(nombre, peso, "perro");
        this.raza = raza;
    }

    //Cumplir el contrato de la clase padre hacer sonido
    hacerSonido(){
        return "Guau Guau";
    }

    //Cumplir el contrato de la clase padre describir
    describir(){
        return `${super.describir()}, Raza: ${this.raza}`;
    }
}

//Clase de Herencia de Gato
class Gato extends Mascota{
    constructor(nombre, peso, deInterior){
        super(nombre, peso, "gato");
        this.deInterior = deInterior;
    }

    //Cumplir el contrato de la clase padre hacer sonido
    hacerSonido(){
        return "Miau Miau";
    }

    //Cumplir el contrato de la clase padre describir
    describir(){
       return `${super.describir()} ${this.deInterior ? "De Interior" : "De Calle"}`;
    }
}

// Clase de Herencia de Ave 
class Ave extends Mascota{
    constructor(nombre, peso, puedeVolar){
        super(nombre, peso, "ave");
        this.puedeVolar = puedeVolar;
    }

    //Cumplir el contrato de la clase padre hacer sonido
    hacerSonido(){
        return "Pío Pío";
    }

    //Cumplir el contrato de la clase padre describir
    describir(){
        return `${super.describir()} ${this.puedeVolar ? "Puede Volar" : "No Puede Volar"}`;
    }
}

// Clase Clinica
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

//Datos de formulario de especie
const ETIQUETAS = {Perro: "Raza", Gato:"Vive en", Ave: "Vuelo"};
const OPCIONES ={
    Perro: ["Labrador", "Bulldog", "Beagle", "Poodle"],
    Gato: ["De interior", "De calle"],
    Ave: ["Puede Volar", "No Puede Volar"]
};
//Un fábrica por especie - Abstract factory
const fabricas = {
    Perro: (nombre, peso, extra) => new Perro(nombre, peso, extra),
    Gato: (nombre, peso, extra) => new Gato(nombre, peso, extra === "De interior"),
    Ave: (nombre, peso, extra) => new Ave(nombre, peso, extra === "Puede Volar")
};

//Conexión con el html
const clinica = new Clinica();
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");
const total = document.getElementById("total");
const selectTipo = document.getElementById("tipo");
const etiqueta = document.getElementById("etiqueta");
const extra = document.getElementById("extra");

function cargarExtra(){
    const tipo = selectTipo.value;
    etiqueta.textContent = ETIQUETAS[tipo];
    extra.innerHTML = "";
    for(const opcion of OPCIONES[tipo]){
        const opt = document.createElement("option");
        //opt.value = opcion;
        opt.textContent = opcion;
        extra.appendChild(opt);
    }
}

function mostrar(tipo, text){
    mensaje.textContent = text;
    mensaje.className = tipo;
}

function dibujar(){
    lista.innerHTML= "";
    for(const m of clinica.pacientes){
        const li = document.createElement("li");
        li.className = "Paciente";
        li.textContent = m.describir();
        const detalle = document.createElement("small");
        detalle.textContent = m.hacerSonido();
        li.appendChild(detalle);
        lista.appendChild(li);
    }
    total.textContent = `Total de pacientes: ${clinica.pacientes.length}`;
}
//activador del cambio de la lista seleccionando gato,perro o ave.
selectTipo.addEventListener("change", cargarExtra);

//Aquí se consolida la lógica del ejercicio para registrar mascotas
document.getElementById("formulario").addEventListener("submit", (e) => {
    e.preventDefault();
    const tipo = selectTipo.value;
    const nombre = document.getElementById("nombre").value;
    const peso = Number(document.getElementById("peso").value);

    try {
       const msacota = fabricas[tipo](nombre, peso, extra.value);
       clinica.registrar(msacota);
       dibujar();
       mostrar("exito", "Mascota registrada correctamente");
    } catch (error) {
        mostrar("error", error.message);
    }
});

//cargarExtra();
//dibujar();
