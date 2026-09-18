
// ==========================================
// MEU DESAFIO SEM DOCE 🍓
// ==========================================

// Metas do desafio
const METAS = [7, 15, 30, 60, 90, 100, 365];

// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const contadorDias = document.getElementById("contador-dias");
const contadorHoras = document.getElementById("contador-horas");
const contadorMinutos = document.getElementById("contador-minutos");
const contadorSegundos = document.getElementById("contador-segundos");

const dataInicio = document.getElementById("data-inicio");
const recordeElemento = document.getElementById("recorde");
const proximaMetaElemento = document.getElementById("proxima-meta");

const barraProgresso = document.getElementById("barra-progresso");
const textoProgresso = document.getElementById("texto-progresso");
const mensagemMeta = document.getElementById("mensagem-meta");

const mensagemMotivacional = document.getElementById(
    "mensagem-motivacional"
);

const btnComecar = document.getElementById("btn-comecar");
const btnResetar = document.getElementById("btn-resetar");
const btnTema = document.getElementById("btn-tema");

const modalConfirmacao = document.getElementById(
    "modal-confirmacao"
);

const modalInicio = document.getElementById("modal-inicio");

const btnFecharModal = document.getElementById(
    "btn-fechar-modal"
);

const btnConfirmarReset = document.getElementById(
    "btn-confirmar-reset"
);

const btnCancelarReset = document.getElementById(
    "btn-cancelar-reset"
);

const btnConfirmarInicio = document.getElementById(
    "btn-confirmar-inicio"
);

const dataEscolhida = document.getElementById(
    "data-escolhida"
);

const listaHistorico = document.getElementById(
    "lista-historico"
);

const campoAnotacao = document.getElementById(
    "campo-anotacao"
);

const btnSalvarAnotacao = document.getElementById(
    "btn-salvar-anotacao"
);

const totalDias = document.getElementById("total-dias");
const totalMetas = document.getElementById("total-metas");
const vezesResetou = document.getElementById("vezes-resetou");
const anoAtual = document.getElementById("ano-atual");

// ==========================================
// DADOS SALVOS
// ==========================================

let inicio = localStorage.getItem("inicioDesafio");

let recordeAtual =
    Number(localStorage.getItem("recordeDesafio")) || 0;

let historico = [];

try {
    historico =
        JSON.parse(
            localStorage.getItem("historicoDesafio")
        ) || [];
} catch (erro) {
    historico = [];
}

let recomecos =
    Number(localStorage.getItem("recomecosDesafio")) || 0;

let modoEscuro =
    localStorage.getItem("modoEscuro") === "true";

// ==========================================
// ANO ATUAL
// ==========================================

anoAtual.textContent = new Date().getFullYear();

// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

// ==========================================
// CALCULAR TEMPO
// ==========================================

function calcularTempo() {
    if (!inicio) {
        return null;
    }

    const dataInicial = new Date(inicio);
    const agora = new Date();

    const diferenca = agora.getTime() - dataInicial.getTime();

    if (diferenca < 0) {
        return null;
    }

    const segundosTotais = Math.floor(
        diferenca / 1000
    );

    const dias = Math.floor(
        segundosTotais / 86400
    );

    const horas = Math.floor(
        (segundosTotais % 86400) / 3600
    );

    const minutos = Math.floor(
        (segundosTotais % 3600) / 60
    );

    const segundos = segundosTotais % 60;

    return {
        dias,
        horas,
        minutos,
        segundos
    };
}

// ==========================================
// ATUALIZAR CONTADOR
// ==========================================

function atualizarContador() {
    const tempo = calcularTempo();

    if (!tempo) {
        contadorDias.textContent = "0";
        contadorHoras.textContent = "00";
        contadorMinutos.textContent = "00";
        contadorSegundos.textContent = "00";

        dataInicio.textContent = "Ainda não definido";

        atualizarMensagem(0);
        atualizarMeta(0);
        atualizarMetasConquistadas(0);
        atualizarEstatisticas(0);

        return;
    }

    contadorDias.textContent = tempo.dias;

    contadorHoras.textContent =
        String(tempo.horas).padStart(2, "0");

    contadorMinutos.textContent =
        String(tempo.minutos).padStart(2, "0");

    contadorSegundos.textContent =
        String(tempo.segundos).padStart(2, "0");

    dataInicio.textContent =
        formatarData(new Date(inicio));

    atualizarRecorde(tempo.dias);
    atualizarMeta(tempo.dias);
    atualizarMensagem(tempo.dias);
    atualizarMetasConquistadas(tempo.dias);
    atualizarEstatisticas(tempo.dias);
}

// ==========================================
// RECORDES
// ==========================================

function atualizarRecorde(dias) {
    if (dias > recordeAtual) {
        recordeAtual = dias;

        localStorage.setItem(
            "recordeDesafio",
            recordeAtual
        );
    }

    recordeElemento.textContent = recordeAtual;
}

// ==========================================
// ENCONTRAR PRÓXIMA META
// ==========================================

function encontrarProximaMeta(dias) {
    for (const meta of METAS) {
        if (dias < meta) {
            return meta;
        }
    }

    return METAS[METAS.length - 1];
}

// ==========================================
// ATUALIZAR META
// ==========================================

function atualizarMeta(dias) {
    const metaAtual = encontrarProximaMeta(dias);

    const indiceMeta = METAS.indexOf(metaAtual);

    const metaAnterior =
        indiceMeta > 0
            ? METAS[indiceMeta - 1]
            : 0;

    proximaMetaElemento.textContent = metaAtual;

    let progresso =
        ((dias - metaAnterior) /
            (metaAtual - metaAnterior)) *
        100;

    progresso = Math.max(
        0,
        Math.min(100, progresso)
    );

    barraProgresso.style.width =
        `${progresso}%`;

    textoProgresso.textContent =
        `${dias} / ${metaAtual} dias`;

    const faltam = metaAtual - dias;

    if (faltam > 0) {
        mensagemMeta.textContent =
            `Faltam ${faltam} dias para sua próxima meta! 🚀`;
    } else {
        mensagemMeta.textContent =
            "Meta conquistada! 🎉";
    }
}

// ==========================================
// MENSAGENS MOTIVACIONAIS
// ==========================================

function atualizarMensagem(dias) {
    let mensagem = "";

    if (dias === 0) {
        mensagem =
            "Vamos começar! Você consegue! 💪";
    } else if (dias === 1) {
        mensagem =
            "Primeiro dia! O começo é importante. 🍓";
    } else if (dias < 7) {
        mensagem =
            "Você está construindo um novo hábito! 🌱";
    } else if (dias < 15) {
        mensagem =
            "Uma semana! Continue firme! 🔥";
    } else if (dias < 30) {
        mensagem =
            "Mais de duas semanas! Você está arrasando! 💪";
    } else if (dias < 60) {
        mensagem =
            "UM MÊS! Olha o tamanho dessa sequência! 🏆";
    } else if (dias < 90) {
        mensagem =
            "Dois meses! Que determinação! 👑";
    } else if (dias < 100) {
        mensagem =
            "Três meses! Você está quase nos 100 dias! 💎";
    } else if (dias < 365) {
        mensagem =
            "100 dias! Você é oficialmente uma lenda! 💯";
    } else {
        mensagem =
            "UM ANO! Você conseguiu! 🌟";
    }

    mensagemMotivacional.textContent = mensagem;
}

// ==========================================
// ATUALIZAR CONQUISTAS
// ==========================================

function atualizarMetasConquistadas(dias) {
    const metas = document.querySelectorAll(".meta");

    let conquistadas = 0;

    metas.forEach((meta) => {
        const valor = Number(
            meta.dataset.meta
        );

        const status =
            meta.querySelector(".status-meta");

        if (!status) {
            return;
        }

        if (dias >= valor) {
            status.textContent = "✅";

            meta.classList.add("conquistada");

            conquistadas++;
        } else {
            status.textContent = "🔒";

            meta.classList.remove("conquistada");
        }
    });

    totalMetas.textContent = conquistadas;
}

// ==========================================
// ESTATÍSTICAS
// ==========================================

function atualizarEstatisticas(dias) {
    totalDias.textContent = dias;
    vezesResetou.textContent = recomecos;
}

// ==========================================
// ABRIR MODAL PARA COMEÇAR
// ==========================================

btnComecar.addEventListener("click", () => {
    if (inicio) {
        const continuar = confirm(
            "Você já possui um desafio em andamento. Deseja começar uma nova sequência?"
        );

        if (!continuar) {
            return;
        }
    }

    const hoje = new Date();

    dataEscolhida.value =
        hoje.toISOString().split("T")[0];

    modalInicio.classList.remove(
        "escondido"
    );
});

// ==========================================
// CONFIRMAR DATA DE INÍCIO
// ==========================================

btnConfirmarInicio.addEventListener(
    "click",
    () => {
        if (!dataEscolhida.value) {
            alert(
                "Escolha uma data para começar!"
            );

            return;
        }

        const dataSelecionada = new Date(
            `${dataEscolhida.value}T00:00:00`
        );

        if (dataSelecionada > new Date()) {
            alert(
                "A data de início não pode estar no futuro."
            );

            return;
        }

        inicio = dataSelecionada.toISOString();

        localStorage.setItem(
            "inicioDesafio",
            inicio
        );

        modalInicio.classList.add(
            "escondido"
        );

        adicionarHistorico(
            "começo",
            dataSelecionada
        );

        atualizarContador();
    }
);

// ==========================================
// ABRIR MODAL "COMI DOCE"
// ==========================================

btnResetar.addEventListener("click", () => {
    if (!inicio) {
        alert(
            "Você ainda não começou o desafio. 🍓"
        );

        return;
    }

    modalConfirmacao.classList.remove(
        "escondido"
    );
});

// ==========================================
// CONFIRMAR RESET
// ==========================================

btnConfirmarReset.addEventListener(
    "click",
    () => {
        const tempo = calcularTempo();

        if (tempo) {
            adicionarHistorico(
                "fim",
                new Date(),
                tempo.dias
            );
        }

        recomecos++;

        localStorage.setItem(
            "recomecosDesafio",
            recomecos
        );

        inicio = null;

        localStorage.removeItem(
            "inicioDesafio"
        );

        modalConfirmacao.classList.add(
            "escondido"
        );

        atualizarContador();
    }
);

// ==========================================
// CANCELAR RESET
// ==========================================

btnCancelarReset.addEventListener(
    "click",
    () => {
        modalConfirmacao.classList.add(
            "escondido"
        );
    }
);

// ==========================================
// FECHAR MODAL
// ==========================================

btnFecharModal.addEventListener(
    "click",
    () => {
        modalConfirmacao.classList.add(
            "escondido"
        );
    }
);

// ==========================================
// HISTÓRICO
// ==========================================

function adicionarHistorico(
    tipo,
    data,
    dias = 0
) {
    const item = {
        tipo: tipo,
        data: data.toISOString(),
        dias: dias
    };

    historico.unshift(item);

    localStorage.setItem(
        "historicoDesafio",
        JSON.stringify(historico)
    );

    mostrarHistorico();
}

// ==========================================
// MOSTRAR HISTÓRICO
// ==========================================

function mostrarHistorico() {
    if (historico.length === 0) {
        listaHistorico.innerHTML = `
            <div class="historico-vazio">
                <span>🍓</span>
                <p>
                    Seu histórico aparecerá aqui.
                </p>
            </div>
        `;

        return;
    }

    listaHistorico.innerHTML = "";

    historico.forEach((item) => {
        const elemento =
            document.createElement("div");

        elemento.classList.add("meta");

        const data = formatarData(
            new Date(item.data)
        );

        if (item.tipo === "começo") {
            elemento.innerHTML = `
                <span>🍓</span>

                <div>
                    <strong>
                        Desafio iniciado
                    </strong>

                    <p>
                        ${data}
                    </p>
                </div>

                <span>🚀</span>
            `;
        } else {
            elemento.innerHTML = `
                <span>😭</span>

                <div>
                    <strong>
                        Sequência encerrada
                    </strong>

                    <p>
                        ${data} • ${item.dias} dias
                    </p>
                </div>

                <span>🔄</span>
            `;
        }

        listaHistorico.appendChild(
            elemento
        );
    });
}

// ==========================================
// ANOTAÇÕES
// ==========================================

function carregarAnotacao() {
    const anotacao =
        localStorage.getItem(
            "anotacaoDesafio"
        );

    if (anotacao) {
        campoAnotacao.value = anotacao;
    }
}

btnSalvarAnotacao.addEventListener(
    "click",
    () => {
        localStorage.setItem(
            "anotacaoDesafio",
            campoAnotacao.value
        );

        alert(
            "Anotação salva! 💗"
        );
    }
);

// ==========================================
// MODO ESCURO
// ==========================================

function atualizarTema() {
    if (modoEscuro) {
        document.body.classList.add(
            "modo-escuro"
        );

        btnTema.textContent = "☀️";
    } else {
        document.body.classList.remove(
            "modo-escuro"
        );

        btnTema.textContent = "🌙";
    }
}

btnTema.addEventListener("click", () => {
    modoEscuro = !modoEscuro;

    localStorage.setItem(
        "modoEscuro",
        modoEscuro
    );

    atualizarTema();
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarTema();
mostrarHistorico();
carregarAnotacao();
atualizarContador();

// ==========================================
// ATUALIZAÇÃO A CADA SEGUNDO
// ==========================================

setInterval(() => {
    atualizarContador();
}, 1000);

