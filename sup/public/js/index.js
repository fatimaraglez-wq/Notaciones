const inputExpresion = document.getElementById("expresion");
const btnCalcular = document.getElementById("btnCalcular");
const btnLimpiar = document.getElementById("btnLimpiar");
const contenedorResultado = document.getElementById("resultado");

const obtenerTokens = (expresion) => {
    const expresionLimpia = expresion.replace(/\s+/g, "");

    if (!expresionLimpia) {
        return {
            valido: false,
            mensaje: "Debes ingresar una expresion."
        };

    }


    
    if (!/^[a-zA-Z0-9+\-*/^()]+$/.test(expresionLimpia)) {

        return {
            valido: false,
            mensaje:
                "La expresion contiene caracteres no validos. " +
                "Solo se permiten letras, numeros, operadores (+, -, *, /, ^) y parentesis."
        };

    }


    
    const tokens = expresionLimpia.match(
    /[a-zA-Z]+|\d+(?:\.\d+)?|[+\-*/^()]/g
);


    if (!tokens || tokens.join("") !== expresionLimpia) {

        return {
            valido: false,
            mensaje: "No se pudo reconocer correctamente la expresion."
        };

    }


    return {
        valido: true,
        tokens: tokens
    };

};

const validarExpresion = (tokens) => {
    let parentesis = 0;
    let esperaOperando = true;


    for (let i = 0; i < tokens.length; i++) {

        const token = tokens[i];

        const esOperando =
            /^[a-zA-Z]+$/.test(token) ||
            /^\d+(?:\.\d+)?$/.test(token);

        const esOperador = /^[+\-*/^]$/.test(token);
        if (esOperando) {
            if (!esperaOperando) {
                return {
                    valido: false,
                    mensaje:
                        `Error: hay dos operandos seguidos cerca de "${token}".`
                };

            }

            esperaOperando = false;

        }
        else if (esOperador) {

            if (esperaOperando) {

                return {
                    valido: false,
                    mensaje:
                        `Error: el operador "${token}" esta en una posicion incorrecta.`
                };

            }

            esperaOperando = true;

        }

        else if (token === "(") {
            parentesis++;
            if (!esperaOperando) {
                return {
                    valido: false,
                    mensaje:
                        "Error: falta un operador antes del parentesis de apertura."
                };

            }

        }
        else if (token === ")") {

            parentesis--;


            if (parentesis < 0) {

                return {
                    valido: false,
                    mensaje:
                        "Error: hay un parentesis de cierre sin su correspondiente apertura."
                };

            }


            if (esperaOperando) {

                return {
                    valido: false,
                    mensaje:
                        "Error: el parentesis de cierre esta en una posicion incorrecta."
                };

            }

        }

    }

    if (parentesis !== 0) {

        return {
            valido: false,
            mensaje:
                "Error: los parentesis no estan correctamente balanceados."
        };

    }
    if (esperaOperando) {

        return {
            valido: false,
            mensaje:
                "Error: la expresion no puede terminar con un operador."
        };

    }


    return {
        valido: true
    };

};


// ======================================================
// PRIORIDAD DE LOS OPERADORES
// ======================================================

const prioridad = (operador) => {

    if (operador === "+" || operador === "-") {

        return 1;

    }

    if (operador === "*" || operador === "/") {

        return 2;

    }

    if (operador === "^") {

        return 3;

    }

    return 0;

};
const infijaAPostfija = (tokens) => {

    const salida = [];

    const pila = [];


    for (let token of tokens) {

        const esOperando =
            /^[a-zA-Z]+$/.test(token) ||
            /^\d+(?:\.\d+)?$/.test(token);


        if (esOperando) {

            salida.push(token);

        }
        else if (token === "(") {

            pila.push(token);

        }
        else if (token === ")") {

            while (
                pila.length > 0 &&
                pila[pila.length - 1] !== "("
            ) {

                salida.push(pila.pop());

            }

            pila.pop();

        }
        else {

            while (
                pila.length > 0 &&
                pila[pila.length - 1] !== "(" &&
                prioridad(pila[pila.length - 1]) >= prioridad(token)
            ) {

                salida.push(pila.pop());

            }

            pila.push(token);

        }

    }


    // Vaciar la pila
    while (pila.length > 0) {

        salida.push(pila.pop());

    }


    return salida;

};

const infijaAPrefija = (tokens) => {

    // Invertimos los tokens
    const invertidos = [...tokens].reverse();


    // Cambiamos los parentesis
    for (let i = 0; i < invertidos.length; i++) {

        if (invertidos[i] === "(") {

            invertidos[i] = ")";

        }

        else if (invertidos[i] === ")") {

            invertidos[i] = "(";

        }

    }


    // Convertimos a postfija
    const postfija = infijaAPostfija(invertidos);


    // Invertimos el resultado
    return postfija.reverse();

};
const mostrarResultados = (
    expresionInfija,
    expresionPrefija,
    expresionPostfija
) => {

    const contenido = `

        <div class="col-12 col-md-8">

            <div class="card shadow-sm mb-4">

                <div class="card-header bg-success text-white text-center fw-bold">

                    Resultado de la conversion

                </div>


                <div class="card-body">


                    <!-- INFIJA -->

                    <div class="mb-4">

                        <label class="form-label fw-bold">

                            Notacion Infija

                        </label>

                        <div class="alert alert-primary mb-0">

                            ${expresionInfija}

                        </div>

                    </div>


                    <!-- PREFIJA -->

                    <div class="mb-4">

                        <label class="form-label fw-bold">

                            Notacion Prefija

                        </label>

                        <div class="alert alert-warning mb-0">

                            ${expresionPrefija}

                        </div>

                    </div>


                    <!-- POSTFIJA -->

                    <div>

                        <label class="form-label fw-bold">

                            Notacion Postfija

                        </label>

                        <div class="alert alert-info mb-0">

                            ${expresionPostfija}

                        </div>

                    </div>


                </div>

            </div>

        </div>

    `;


    contenedorResultado.innerHTML = contenido;

};
const mostrarError = (mensaje) => {

    const contenido = `

        <div class="col-12 col-md-8">

            <div class="alert alert-danger text-center fw-bold shadow-sm">

                ${mensaje}

            </div>

        </div>

    `;


    contenedorResultado.innerHTML = contenido;

};

const convertirExpresion = () => {

    const expresion = inputExpresion.value.trim();
    const resultadoTokens = obtenerTokens(expresion);


    if (!resultadoTokens.valido) {

        mostrarError(resultadoTokens.mensaje);

        return;

    }


    const tokens = resultadoTokens.tokens;


    // Validar expresion
    const validacion = validarExpresion(tokens);


    if (!validacion.valido) {

        mostrarError(validacion.mensaje);

        return;

    }


    // Convertir
    const postfija = infijaAPostfija(tokens);

    const prefija = infijaAPrefija(tokens);


    // Mostrar resultados
    mostrarResultados(
        expresion,
        prefija.join(" "),
        postfija.join(" ")
    );

};
const limpiarContenido = () => {

    inputExpresion.value = "";

    contenedorResultado.innerHTML = "";

    inputExpresion.focus();

};

btnCalcular.addEventListener("click", () => {

    convertirExpresion();

});
btnLimpiar.addEventListener("click", () => {

    limpiarContenido();

});

inputExpresion.addEventListener("keydown", (evento) => {

    if (evento.key === "Enter") {

        convertirExpresion();

    }

});