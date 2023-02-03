const seccionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
const sectionReiniciar = document.getElementById("reiniciar");
const botonMascotaJugador = document.getElementById("boton-mascota");
const botonReiniciar = document.getElementById("boton-reiniciar");
sectionReiniciar.style.display = "none";

const sectionSeleccionarMascota = document.getElementById(
    "seleccionar-mascota"
);
const spanMascotaJugador = document.getElementById("mascota-jugador");
const spanMascotaEnemigo = document.getElementById("mascota-enemigo");

const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");

const seccionMensajes = document.getElementById("resultado");
const ataquesDelJugador = document.getElementById("ataques-del-jugador");
const ataquesDelEnemigo = document.getElementById("ataques-del-enemigo");
const contenedorTarjetas = document.getElementById("contenedor-tarjeta");
const contenedorAtaques = document.getElementById("contenedor-ataques");

const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

let jugadorId = null;
let enemigoId = null;
let mokepones = [];
let mokeponesEnemigos = [];
let ataqueJugador = [];
let ataqueEnemigo = [];
let opcionDeMokepones;
let inputHipodoge;
let inputCapipepo;
let inputRatigueya;
let mascotaJugador;
let mascotaJugadorObjeto;
let ataquesMokepon;
let ataquesMokeponEnemigo;
let botonFuego;
let botonAgua;
let botonTierra;
let botones = [];
let indexAtaqueJugador;
let indexAtaqueEnemigo;
let victoriasJugador = 0;
let victoriasEnemigo = 0;
let vidasJugador = 3;
let vidasEnemigo = 3;
let lienzo = mapa.getContext("2d");
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "./assets/mokemap.png";
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 350;

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20;
}

alturaQueBuscamos = anchoDelMapa * 600 / 800;

mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id;
        this.nombre = nombre;
        this.foto = foto;
        this.vida = vida;
        this.ataques = [];
        this.ancho = 40;
        this.alto = 40;
        this.x = aleatorio(0, mapa.width - this.ancho);
        this.y = aleatorio(0, mapa.height - this.alto);
        this.mapaFoto = new Image();
        this.mapaFoto.src = fotoMapa;
        this.velocidadx = 0;
        this.velocidady = 0;
    }

    pintarMokepon() {
        lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto);
    }
}

let hipodoge = new Mokepon(
    "Hipodoge",
    "./assets/mokepons_mokepon_hipodoge_attack.png",
    5,
    "./assets/hipodoge.png",
    enemigoId
);

let capipepo = new Mokepon(
    "Capipepo",
    "./assets/mokepons_mokepon_capipepo_attack.png",
    5,
    "./assets/capipepo.png", enemigoId
);

let ratigueya = new Mokepon(
    "Ratigueya",
    "./assets/mokepons_mokepon_ratigueya_attack.png",
    5,
    "./assets/ratigueya.png",
    enemigoId
);

const HIPODOGE_ATAQUES = [
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🌱", id: "boton-tierra" },
];

hipodoge.ataques.push(...HIPODOGE_ATAQUES);

const CAPIPEPO_ATAQUES = [
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" },
];
capipepo.ataques.push(...CAPIPEPO_ATAQUES);

const RATIGUEYA_ATAQUES = [
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "💧", id: "boton-agua" },
];

ratigueya.ataques.push(...RATIGUEYA_ATAQUES);

mokepones.push(hipodoge, capipepo, ratigueya);

function iniciarJuego() {
    seccionSeleccionarAtaque.style.display = "none";
    sectionVerMapa.style.display = "none";

    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
    <input type="radio" name="mascota" id=${mokepon.nombre} />
            <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
                <p>${mokepon.nombre}</p>
                <img src=${mokepon.foto} alt=${mokepon.nombre} >
            </label>
    `;

        contenedorTarjetas.innerHTML += opcionDeMokepones;

        inputHipodoge = document.getElementById("Hipodoge");
        inputCapipepo = document.getElementById("Capipepo");
        inputRatigueya = document.getElementById("Ratigueya");
    });

    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);

    botonReiniciar.addEventListener("click", reiniciarJuego);

    unirseAlJuego();
}

function unirseAlJuego() {
    fetch("http://macbook-pro-julian-guacaneme.local:8080/unirse").then(
        function(res) {
            if (res.ok) {
                res.text().then(function(respuesta) {
                    console.log(respuesta);
                    jugadorId = respuesta;
                });
            }
        }
    );
}

function seleccionarMascotaJugador() {

    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id;
        mascotaJugador = inputHipodoge.id;
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id;
        mascotaJugador = inputCapipepo.id;
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id;
        mascotaJugador = inputRatigueya.id;
    } else {
        alert("👀 SELECCIONA UNA MASCOTA!!!");
        return
    }

    sectionSeleccionarMascota.style.display = "none";
    seleccionarMokepon(mascotaJugador);

    extraerAtaques(mascotaJugador);
    sectionVerMapa.style.display = "flex";
    iniciarMapa();
}

function seleccionarMokepon(mascotaJugador) {
    fetch(
        `http://macbook-pro-julian-guacaneme.local:8080/mokepon/${jugadorId}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mokepon: mascotaJugador,
            }),
        }
    );
}

function extraerAtaques(mascotaJugador) {
    let ataques;
    for (i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques;
        }
    }
    mostrarAtaques(ataques);
}

function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        ataquesMokepon = `<button id=${ataque.id} class="boton-de-ataque BAtaque"> ${ataque.nombre} </button>`;
        contenedorAtaques.innerHTML += ataquesMokepon;
    });

    botonFuego = document.getElementById("boton-fuego");
    botonAgua = document.getElementById("boton-agua");
    botonTierra = document.getElementById("boton-tierra");
    botones = document.querySelectorAll(".BAtaque");
}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            if (e.target.outerText === "🔥") {
                ataqueJugador.push("FUEGO");
                console.log(ataqueJugador);
                boton.style.background = "#112F58";
                boton.disabled = true;
            } else if (e.target.outerText === "💧") {
                ataqueJugador.push("AGUA");
                console.log(ataqueJugador);
                boton.style.background = "#112F58";
                boton.disabled = true;
            } else {
                ataqueJugador.push("TIERRA");
                console.log(ataqueJugador);
                boton.style.background = "#112F58";
                boton.disabled = true;
            }
            if (ataqueJugador.length === 5) {
                enviarAtaques();
            }

        });
    });
}

function enviarAtaques() {
    fetch(
        `http://macbook-pro-julian-guacaneme.local:8080/mokepon/${jugadorId}/ataques`, {
            method: "post",
            headers: {
                "Content-Type": "aplication/json",
            },
            body: JSON.stringify({
                ataques: ataqueJugador,
            }),
        }
    );

    intervalo = setInterval(obtenerAtaques, 50)

}

function obtenerAtaques() {
    fetch(
        `http://macbook-pro-julian-guacaneme.local:8080/mokepon/${enemigoId}/ataques`
    ).then(function(res) {
        if (res.ok) {
            res.json().then(function({ ataques }) {
                if (ataques.length === 5) {
                    ataqueEnemigo = ataques;
                    combate();
                }
            });
        }
    });
}

function seleccionarMascotaEnemigo(enemigo) {
    spanMascotaEnemigo.innerHTML = enemigo.nombre;
    ataquesMokeponEnemigo = enemigo.ataques;
    secuenciaAtaque();
}

function ataqueAleatorioEnemigo() {
    console.log("Ataques enemigo", ataquesMokeponEnemigo);
    let ataqueAleatorio = aleatorio(0, ataquesMokeponEnemigo.length - 1);

    if (ataqueAleatorio == 0 || ataqueAleatorio == 1) {
        ataqueEnemigo.push("FUEGO");
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push("AGUA");
    } else {
        ataqueEnemigo.push("TIERRA");
    }
    console.log(ataqueEnemigo);
    iniciarPelea();
}

function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponentes(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador];
    indexAtaqueEnemigo = ataqueEnemigo[enemigo];
}

function combate() {
    clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if (ataqueJugador[index] === ataqueEnemigo[index]) {
            indexAmbosOponentes(index, index);
            crearMensaje("EMPATE");
        } else if (
            ataqueJugador[index] === "FUEGO" &&
            ataqueEnemigo[index] === "TIERRA"
        ) {
            indexAmbosOponentes(index, index);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        } else if (
            ataqueJugador[index] === "AGUA" &&
            ataqueEnemigo[index] === "FUEGO"
        ) {
            indexAmbosOponentes(index, index);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        } else if (
            ataqueJugador[index] === "TIERRA" &&
            ataqueEnemigo[index] === "AGUA"
        ) {
            indexAmbosOponentes(index, index);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        } else {
            indexAmbosOponentes(index, index);
            crearMensaje("PERDISTE");
            victoriasEnemigo++;
            spanVidasEnemigo.innerHTML = victoriasEnemigo;
        }
    }

    revisarVidas();
}

function revisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Esto fue un empate!!!");
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("FELICITACIONES, ganaste!!!");
    } else {
        crearMensajeFinal("LO SIENTO, perdiste :(");
    }
}

function crearMensaje(resultado) {

    let nuevoAtaqueDelJugador = document.createElement("p");
    let nuevoAtaqueDelEnemigo = document.createElement("p");

    seccionMensajes.innerHTML = resultado;
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador;
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo;

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador);
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);
}

function crearMensajeFinal(resultadoFinal) {

    seccionMensajes.innerHTML = resultadoFinal;

    sectionReiniciar.style.display = "block";
}

function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function pintarCanvas() {
    mascotaJugadorObjeto.x =
        mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadx;
    mascotaJugadorObjeto.y =
        mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidady;
    lienzo.clearRect(0, 0, mapa.width, mapa.height);
    lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height);
    mascotaJugadorObjeto.pintarMokepon();

    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y);

    mokeponesEnemigos.forEach(function(mokepon) {
        mokepon.pintarMokepon();
        revisarColision(mokepon);
    })
}

function enviarPosicion(x, y) {
    fetch(
        `http://macbook-pro-julian-guacaneme.local:8080/mokepon/${jugadorId}/posicion`, {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                x,
                y,
            }),
        }
    ).then(function(res) {
        if (res.ok) {
            res.json().then(function({ enemigos }) {
                console.log(enemigos);

                mokeponesEnemigos = enemigos.map(function(enemigo) {
                    let mokeponEnemigo = null;
                    const mokeponNombre = enemigo.mokepon.nombre || "";
                    if (mokeponNombre === "Hipodoge") {
                        mokeponEnemigo = new Mokepon(
                            "Hipodoge",
                            "./assets/mokepons_mokepon_hipodoge_attack.png",
                            5,
                            "./assets/hipodoge.png",
                            enemigo.id
                        );
                    } else if (mokeponNombre === "Capipepo") {
                        mokeponEnemigo = new Mokepon(
                            "Capipepo",
                            "./assets/mokepons_mokepon_capipepo_attack.png",
                            5,
                            "./assets/capipepo.png",
                            enemigo.id
                        );
                    } else if (mokeponNombre === "Ratigueya") {
                        mokeponEnemigo = new Mokepon(
                            "Ratigueya",
                            "./assets/mokepons_mokepon_ratigueya_attack.png",
                            5,
                            "./assets/ratigueya.png",
                            enemigo.id
                        );
                    }

                    mokeponEnemigo.x = enemigo.x;
                    mokeponEnemigo.y = enemigo.y;

                    return mokeponEnemigo;
                });
            });
        }
    });
}

function moverDerecha() {
    mascotaJugadorObjeto.velocidadx = 5;
}

function moverIzquierda() {
    mascotaJugadorObjeto.velocidadx = -5;
}

function moverAbajo() {
    mascotaJugadorObjeto.velocidady = 5;
}

function moverArriba() {
    mascotaJugadorObjeto.velocidady = -5;
}

function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadx = 0;
    mascotaJugadorObjeto.velocidady = 0;
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba();
            break;
        case "ArrowDown":
            moverAbajo();
            break;
        case "ArrowLeft":
            moverIzquierda();
            break;
        case "ArrowRight":
            moverDerecha();
            break;
        default:
            break;
    }
}

function iniciarMapa() {
    mascotaJugadorObjeto = obtenerOjetoMascota(mascotaJugador);
    console.log(mascotaJugadorObjeto, mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50);

    window.addEventListener("keydown", sePresionoUnaTecla);

    window.addEventListener("keyup", detenerMovimiento);
}

function obtenerOjetoMascota() {
    for (i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            return mokepones[i];
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y;
    const abajoEnemigo = enemigo.y + enemigo.alto;
    const derechaEnemigo = enemigo.x + enemigo.ancho;
    const izquierdaEnemigo = enemigo.x;

    const arribaMascota = mascotaJugadorObjeto.y;
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto;
    const derechaMascota = mascotaJugadorObjeto + mascotaJugadorObjeto.ancho;
    const izquierdaMascota = mascotaJugadorObjeto.x;

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }

    detenerMovimiento();
    clearInterval(intervalo);
    console.log('se detecto colision')

    enemigoId = enemigo.id
    seccionSeleccionarAtaque.style.display = "flex";
    sectionVerMapa.style.display = "none";
    seleccionarMascotaEnemigo(enemigo);
}

window.addEventListener("load", iniciarJuego);