// Classe Peça
const classPeca = new Peca;

// Tamanho do tabuleiro
const tamanhoTabuleiro = {
    h: 600,
    w: 300
};

// Pontos
let pontos = 0;

let contador = 0;
let intervalo = 500;
let ultimoTempo = 0;

// Direções
const direcoes = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right",
    e: "rotateL",
    q: "rotateR",
};

// Tabuleiro em Matrix
const dadosDasPecas = gerarMatrix(tamanhoTabuleiro['w'] / 20, tamanhoTabuleiro['h'] / 20);

// Player
const player = {
    // Posição inicial do player
    pos: { x: 6, y: -1 },
    //Peça inicial do Jogador
    peca: null,
};

// Tag HTML do Tabuleiro
const canvas = document.getElementById('tetris');
canvas.height = tamanhoTabuleiro['h'];
canvas.width = tamanhoTabuleiro['w']

// Tabuleiro de forma 2D
const tabuleiro = canvas.getContext('2d');
// Padrão de tamanho de peça gerado por Matrix
tabuleiro.scale(20, 20);

// Função de gera um tabuleiro de forma de matrix para que possa ser guardado as peças
function gerarMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

// Anexa a peca ao tabuleiro
function anexar(dadosDasPecas, player) {
    pontos = pontos + 50;
    player.peca.forEach((linha, y) => {
        linha.forEach((value, x) => {
            if (value !== 0) {
                dadosDasPecas[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
    verificarLinha(dadosDasPecas);
}

// Verifica se a linha esta cheia e remove ela
function verificarLinha(dadosDasPecas) {
    dadosDasPecas.forEach((linha, y) => {
        if(linha.every(element => element != 0)) {
            dadosDasPecas.splice(y, 1);
            dadosDasPecas.unshift(new Array(tamanhoTabuleiro['w'] / 20).fill(0));
            pontos = pontos + ((y + 1) * 10);
        }
    });
}

// Finaliza o jogo e salva a pontuação
function gameOver() {
    sessionStorage.setItem("lastPoints", pontos);
    if (pontos.recordAtual > localStorage.getItem("bestRecord")) localStorage.setItem("bestRecord", pontos);
}

// Verifica Colisão
function colidiu(dadosDasPecas, player) {
    const pecaDoPlayer = player.peca;
    const posicaoDoPlayer = player.pos;
    for (let y = 0; y < pecaDoPlayer.length; y++) {
        for (let x = 0; x < pecaDoPlayer[y].length; x++) {
            if (pecaDoPlayer[y][x] !== 0 && (dadosDasPecas[y + posicaoDoPlayer.y] && dadosDasPecas[y + posicaoDoPlayer.y][x + posicaoDoPlayer.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Função responsável por gerar a peça e anexar a cor dela.
function escolherPeca() {
    const valor = Math.floor(Math.random() * classPeca.conjuntoDePecas.length);
    const cor = classPeca.escolherCor();
    let peca = classPeca.conjuntoDePecas[valor]
    peca.forEach(linha => {
        const index = peca.indexOf(linha);
        linha.forEach(valor => {
            const index = linha.indexOf(valor);
            if (valor !== 0) {
                valor = cor;
            }
            linha[index] = valor
        });
        peca[index] = linha
    });
    player.peca = peca;
}

// Desenha 
function draw() {
    tabuleiro.fillStyle = "lightgray";
    tabuleiro.fillRect(0, 0, canvas.width, canvas.height);
    // Dados do Tabuleiro
    classPeca.gerarPeca(dadosDasPecas, { x: 0, y: 0 }, tabuleiro);
    // Dados do player
    classPeca.gerarPeca(player.peca, player.pos, tabuleiro);
}

// Roda o jogo
function atulizar(time = 0) {
    const deltaTime = time - ultimoTempo;
    ultimoTempo = time;
    contador += deltaTime;
    if (contador > intervalo) {
        player.pos.y++;
        if (colidiu(dadosDasPecas, player)) {
            player.pos.y--;
            if (player.pos.y === -1) {
                gameOver()
                return;
            };
            anexar(dadosDasPecas, player);
            player.pos = { x: 6, y: -1 };
            escolherPeca();
            player.cor = classPeca.escolherCor();
        }
        contador = 0;
    }
    draw();
    requestAnimationFrame(atulizar);
}

function girar(peca) {
    for (let y = 0; y < peca.length; y++) {
        for (let x = 0; x < y; x++) {
            [peca[x][y], peca[y][x]] = [peca[y][x], peca[x][y]];
        }
    }
    peca.reverse();
    return peca;
}

async function movimento(key) {
    const playerMove = {
        pos: {
            x: player.pos.x,
            y: player.pos.y
        },
        peca: player.peca,
    };
    switch (direcoes[key]) {
        case "down":
            playerMove.pos.y += 1;
            break;
        case "left":
            playerMove.pos.x -= 1;
            break;
        case "right":
            playerMove.pos.x += 1;
            break;
        case "up":
            playerMove.peca = await girar(playerMove.peca);
            // Valida o movimento
            if (playerMove.pos.x + 2 >= tamanhoTabuleiro['w'] / 20 || colidiu(dadosDasPecas, playerMove)) {
                playerMove.peca = await girar(playerMove.peca);
                playerMove.peca = await girar(playerMove.peca);
                playerMove.peca = await girar(playerMove.peca);
                return;
            }
            break;
    }
    // Valida o movimento
    if (playerMove.pos.x + 2 > tamanhoTabuleiro['w'] / 20 || colidiu(dadosDasPecas, playerMove)) {
        return
    };

    player.pos = {
        x: playerMove.pos.x,
        y: playerMove.pos.y
    }
    atulizar(0)
}

document.addEventListener('keypress', tecla => {
    movimento(tecla.key.toLocaleLowerCase());
})

escolherPeca();
atulizar();