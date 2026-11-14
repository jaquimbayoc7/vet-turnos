// Crear la super clase de Mascota
class Mascota {
  #peso; // atributo privado

  constructor(nombre, especie, peso) {
    if (new.target === Mascota) {
      throw new Error("No se puede instanciar la clase Mascota directamente");
    }
    this.nombre = nombre;
    this.especie = especie;
    this.#peso = peso;
  }

  //Método get y set
  get peso() {
    return this.#peso;
  }

  set peso(valor) {
    if (
      typeof valor !== "number" ||
      Number.isNaN(valor) ||
      valor <= 0 ||
      valor === 0
    ) {
      throw new Error("El peso debe ser un número positivo");
    }
    this.#peso = valor;
  }

  //Contrato para el tema del Hacersonido
  hacerSonido() {
    throw new Error(
      `${this.constructor.name} debe implementar el método hacerSonido()`,
    );
  }

  //Calcular la consulta -- unico cambio vs el archivo de Herencia
  calcularConsulta() {
    throw new Error(
      `${this.constructor.name} debe implementar el método calcularConsulta()`,
    );
  }

  describir() {
    return `Nombre: ${this.nombre}, Especie: ${this.especie}, Peso: ${this.#peso} Kg.`;
  }
}

//Herencia + Polimorfismo: cada clase hija responde de manera diferente - Clase Perro
class Perro extends Mascota {
  constructor(nombre, peso, raza) {
    super(nombre, "Perro", peso);
    this.raza = raza;
  }

  //respetar el contrato con la super clase Mascota
  hacerSonido() {
    return "Guau Guau";
  }

  //proceso nuevo de polimorfismo: cada clase hija calcula la consulta de manera diferente
  calcularConsulta() {
    return 30000 + this.peso * 1000;
  }

  //método de describir
  describir() {
    return `${super.describir()}, Raza: ${this.raza}`;
  }
}

//Herencia + Polimorfismo: cada clase hija responde de manera diferente - Clase Gato
class Gato extends Mascota {
  constructor(nombre, peso, deInterior) {
    super(nombre, "Gato", peso);
    this.deInterior = deInterior;
  }
  //respetar el contrato con la super clase Mascota
  hacerSonido() {
    return "Miau Miau";
  }
  //proceso nuevo de polimorfismo: cada clase hija calcula la consulta de manera diferente
  calcularConsulta() {
    return 35000;
  }
  //método de describir
  describir() {
    return `${super.describir()}, De interior: ${this.deInterior ? "de interior" : "de calle"}`;
  }
}

//Herencia + Polimorfismo: cada clase hija responde de manera diferente - Clase Ave
class Ave extends Mascota {
  constructor(nombre, peso, puedeVolar) {
    super(nombre, "Ave", peso);
    this.puedeVolar = puedeVolar;
  }

  //respetar el contrato con la super clase Mascota
  hacerSonido() {
    return "Pío Pío";
  }

  //proceso nuevo de polimorfismo: cada clase hija calcula la consulta de manera diferente
  calcularConsulta() {
    return this.puedeVolar ? 25000 : 32000;
  }

  //método de describir
  describir() {
    return `${super.describir()}, Puede volar: ${this.puedeVolar ? "vuela" : "no vuela"}`;
  }
}

//la Clinica con lista (Arreglo) protegida de pacientes , sumar valor consulta de cada mascota
class Clinica {
  #pacientes = [];

  registrar(mascota) {
    if (!(mascota instanceof Mascota)) {
      throw new Error("Solo se pueden registrar mascotas");
    }
    this.#pacientes.push(mascota);
  }

  get pacientes() {
    return [...this.#pacientes];
  }

  //Nuevo calcular el total de la consulta de todos los pacientes
  totalDia() {
    return this.#pacientes.reduce((suma, m) => suma + m.calcularConsulta(), 0);
  }
}

//datos del formulario
const ETIQUETAS = { Perro: "Raza", Gato: "Vive en", Ave: "Vuelo" };
const OPCIONES = {
  Perro: ["Labrador", "Criollo", "Pastor alemán"],
  Gato: ["De interior", "De calle"],
  Ave: ["Puede volar", "No puede volar"],
};

// Fábrica de Objetos - Abstract Factory
const fabricas = {
  Perro: (nombre, peso, extra) => new Perro(nombre, peso, extra),
  Gato: (nombre, peso, extra) =>
    new Gato(nombre, peso, extra === "De interior"),
  Ave: (nombre, peso, extra) => new Ave(nombre, peso, extra === "Puede volar"),
};

//Conexión con el html
const clinica = new Clinica();
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");
const total = document.getElementById("total");
const selectTipo = document.getElementById("tipo");
const etiqueta = document.getElementById("etiqueta");
const extra = document.getElementById("extra");

//Nuevo: funcion dinero
function dinero(n) {
  return "$." + n.toLocaleString("es-CO");
}

//Función que implementa el cambio de opciones según el tipo de mascota
function cargarExtra() {
  const tipo = selectTipo.value;
  etiqueta.textContent = ETIQUETAS[tipo];
  extra.innerHTML = "";
  for (const opcion of OPCIONES[tipo]) {
    const o = document.createElement("option");
    o.textContent = opcion;
    extra.appendChild(o);
  }
}

// funcion de mostrar tipo y texto asociado a la mascota

function mostrar(tipo, texto) {
  mensaje.className = tipo;
  mensaje.textContent = texto;
}

//Fíjate: aquí nadie pregunta "¿eres perro o gato?"
function dibujar() {
  lista.innerHTML = "";
  for (const m of clinica.pacientes) {
    const li = document.createElement("li");
    li.className = "paciente";
    li.textContent = m.describir();
    const detalle = document.createElement("small");
    detalle.textContent = `${m.hacerSonido()} · Consulta: ${dinero(m.calcularConsulta())}`;
    li.appendChild(detalle);
    lista.appendChild(li);
  }
  total.textContent = `Pacientes hoy: ${clinica.pacientes.length} · Total consultas: ${dinero(clinica.totalDia())}`;
}

//Evento para actualizar las opciones cuando cambia el tipo de mascota
selectTipo.addEventListener("change", cargarExtra);

document.getElementById("formulario").addEventListener("submit", (e) => {
  e.preventDefault();
  const tipo = selectTipo.value;
  const nombre = document.getElementById("nombre").value;
  const peso = Number(document.getElementById("peso").value);
 
  try {
    const mascota = fabricas[tipo](nombre, peso, extra.value);
    clinica.registrar(mascota);
    dibujar();
    mostrar("ok", `${nombre} registrado`);
  } catch (error) {
    mostrar("error", error.message);
  }
});

cargarExtra();
dibujar();