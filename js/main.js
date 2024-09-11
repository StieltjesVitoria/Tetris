// Classe Peça
const pecaClass = new Peca;

// Player
const player = new Player(pecaClass.getPeca(), pecaClass.getPeca());

// Tabuleiro
const tabuleiro = new Tabuleiro(300, 600, 20);
const tabuleiropProxPeca = new Tabuleiro(120, 120, 20);

// Tag HTML do Tabuleiro
const canvas = document.getElementById('tetris');
canvas.height = tabuleiro.getH;
canvas.width = tabuleiro.getW;

// Tag HTML da proxima peça
const canvasProxPeca = document.getElementById('proxPeca');
canvasProxPeca.height = tabuleiropProxPeca.getH;
canvasProxPeca.width = tabuleiropProxPeca.getW;

// Tag HTML dos pontos
document.getElementById('placar').innerHTML = player.getPontos;
document.getElementById('ultimaPartida').innerHTML = sessionStorage.getItem('lastPoints');
document.getElementById('record').innerHTML = localStorage.getItem('bestRecord');

// Tabuleiro de forma 2D
const desenhoTabuleiro = canvas.getContext('2d');
const desenhoProximaPeca = canvasProxPeca.getContext('2d');

// Padrão de tamanho de peça gerado por Matrix
desenhoTabuleiro.scale(tabuleiro.getS, tabuleiro.getS);
desenhoProximaPeca.scale(tabuleiropProxPeca.getS, tabuleiropProxPeca.getS);

let startGame = false;

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

const fases = {
    1000: 450,
    5000: 400,
    10000: 350,
    15000: 300,
    20000: 250,
    25000: 200,
    30000: 150,
    35000: 100,
    40000: 50,
    100000: 10,
};

let contador = 0;
let intervalo = 500;
let ultimoTempo = 0;

// Anexa a peca ao tabuleiro
/**
 * @param {Player} player
 * @param {any[][]} dadosDasPecas
 */
function anexar(dadosDasPecas, player) {
    player.setPontos = player.getPontos + 50;
    const playerPeca = player.getPeca;
    playerPeca.forEach((linha, y) => {
        linha.forEach((value, x) => {
            if (value !== 0) {
                dadosDasPecas[y + player.getPosY][x + player.getPosX] = value;
            }
        });
    });
    verificarLinha(dadosDasPecas);
}

// Verifica se a linha esta cheia e remove ela
/**
 * @param {any[][]} dadosDasPecas
 */
function verificarLinha(dadosDasPecas) {
    dadosDasPecas.forEach((linha, y) => {
        if (linha.every(element => element != 0)) {
            dadosDasPecas.splice(y, 1);
            dadosDasPecas.unshift(new Array(tabuleiro.getW / tabuleiro.getS).fill(0));
            player.setPontos = player.getPontos + ((y + 1) * 10);
        }
    });
}

// Finaliza o jogo e salva a pontuação
function gameOver() {
    sessionStorage.setItem("lastPoints", player.getPontos);
    if (player.getPontos > localStorage.getItem("bestRecord")) localStorage.setItem("bestRecord", player.getPontos);
    cancelAnimationFrame(0);
    document.getElementById('placar').innerHTML = player.getPontos;
    document.getElementById('ultimaPartida').innerHTML = sessionStorage.getItem('lastPoints');
    document.getElementById('record').innerHTML = localStorage.getItem('bestRecord');
}

// Reinicia o jogo
function restart() {
    tabuleiro.reset();
    player.peca = pecaClass.getPeca;
    rodarJogo();
}

// Verifica Colisão
/**
 * @param {Player} player
 * @param {any[][]} dadosDasPecas
 */
function colidiu(dadosDasPecas, player) {
    const pecaDoPlayer = player.getPeca;
    const posicaoDoPlayer = player.getPos;
    for (let y = 0; y < pecaDoPlayer.length; y++) {
        for (let x = 0; x < pecaDoPlayer[y].length; x++) {
            if (pecaDoPlayer[y][x] !== 0 && (dadosDasPecas[y + posicaoDoPlayer.y] && dadosDasPecas[y + posicaoDoPlayer.y][x + posicaoDoPlayer.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Desenha 
/**
 * @param {any[][]} tabuleiro
 * @param {canvas} desenhoTabuleiro
 * @param {{x: number, y: number}} pos
 * @param {number[][]} peca
 */
function draw(tabuleiro, desenhoTabuleiro, peca, pos) {
    desenhoTabuleiro.fillStyle = "black";
    desenhoTabuleiro.fillRect(0, 0, tabuleiro.getW, tabuleiro.getH);
    // Dados do player
    gerarPeca(peca, pos, desenhoTabuleiro);
    // Dados do Tabuleiro
    gerarPeca(tabuleiro.getDados, { x: 0, y: 0 }, desenhoTabuleiro);
}

// Roda o jogo
function rodarJogo(time = 0) {
    const deltaTime = time - ultimoTempo;
    ultimoTempo = time;
    contador += deltaTime;
    if (contador > intervalo) {
        player.setPosY = player.getPosY + 1;
        if (colidiu(tabuleiro.getDados, player)) {
            player.setPosY = player.getPosY - 1;
            if (player.getPosY === -1) {
                gameOver()
                return;
            };
            anexar(tabuleiro.getDados, player);
            player.setPos = { x: 6, y: -1 };
            player.setPeca = player.getProxPeca;
            player.setProxPeca = pecaClass.getPeca();
        }
        contador = 0;
    }
    draw(tabuleiro, desenhoTabuleiro, player.getPeca, player.getPos);
    draw(tabuleiropProxPeca, desenhoProximaPeca, player.getProxPeca, { x: 1, y: 1 });
    document.getElementById('placar').innerHTML = player.getPontos;
    requestAnimationFrame(rodarJogo);
}

/**
 * @param {number[][]} peca
 * @param {{x: number, y: number}} pos
 * @param {canvas} desenhoTabuleiro
 */
function gerarPeca(peca, pos, desenhoTabuleiro) {
    peca.forEach((linha, y) => {
        linha.forEach((valor, x) => {
            if (valor !== 0) {
                desenhoTabuleiro.fillStyle = valor;
                desenhoTabuleiro.fillRect(x + pos.x, y + pos.y, 1, 1);
            }
        });
    });
}

async function movimento(key) {
    if (!startGame) return;
    const playerMove = new Player(player.getPeca);
    playerMove.setPos = player.getPos;
    switch (direcoes[key]) {
        case "down":
            playerMove.setPosY = playerMove.getPosY + 1;
            break;
        case "left":
            playerMove.setPosX = playerMove.getPosX - 1;
            break;
        case "right":
            playerMove.setPosX = playerMove.getPosX + 1;
            break;
        case "up":
            playerMove.setPeca = pecaClass.girarPeca(playerMove.getPeca);
            // Valida o movimento
            if (playerMove.getPosX + 2 >= tabuleiro.getW / tabuleiro.getS || colidiu(tabuleiro.getDados, playerMove)) {
                playerMove.getPeca = pecaClass.girarPeca(playerMove.getPeca);
                playerMove.getPeca = pecaClass.girarPeca(playerMove.getPeca);
                playerMove.getPeca = pecaClass.girarPeca(playerMove.getPeca);
                return;
            }
            break;
    }
    // Valida o movimento
    if (playerMove.getPosX + 1 >= tabuleiro.getW / tabuleiro.getS || colidiu(tabuleiro.getDados, playerMove)) {
        return
    };

    player.setPos = playerMove.getPos;
    rodarJogo(0)
}

document.addEventListener('keypress', tecla => {
    movimento(tecla.key.toLocaleLowerCase());
})

function iniciarJogo() {
    startGame = true;
    draw(tabuleiropProxPeca, desenhoProximaPeca, player.getProxPeca, { x: 1, y: 1 });
    // rodarJogo();
}

iniciarJogo()