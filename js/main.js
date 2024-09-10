// Classe Peça
const pecaClass = new Peca;

// Player
const player = new Player(pecaClass.getPeca());

// Tabuleiro
const tabuleiro = new Tabuleiro(300, 600, tabuleiro.getS);

// Tag HTML do Tabuleiro
const canvas = document.getElementById('tetris');
canvas.height = tabuleiro.getH;
canvas.width = tabuleiro.getW;

// Tabuleiro de forma 2D
const desenhoTabuleiro = canvas.getContext('2d');

// Padrão de tamanho de peça gerado por Matrix
desenhoTabuleiro.scale(tabuleiro.getS, tabuleiro.getS);

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
 * @param {any[][]} dadosDasPecas
 */
function draw(dadosDasPecas) {
    desenhoTabuleiro.fillStyle = "lightgray";
    desenhoTabuleiro.fillRect(0, 0, canvas.width, canvas.height);
    // Dados do Tabuleiro
    gerarPeca(dadosDasPecas, { x: 0, y: 0 }, desenhoTabuleiro);
    // Dados do player
    gerarPeca(player.getPeca, player.getPos, desenhoTabuleiro);
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
            player.setPeca = pecaClass.getPeca();
        }
        contador = 0;
    }
    draw(tabuleiro.getDados);
    requestAnimationFrame(rodarJogo);
}

function gerarPeca(peca, pos, tabuleiro) {
    peca.forEach((linha, y) => {
        linha.forEach((valor, x) => {
            if (valor !== 0) {
                tabuleiro.fillStyle = valor;
                tabuleiro.fillRect(x + pos.x, y + pos.y, 1, 1);
            }
        });
    });
}

async function movimento(key) {
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
    if (playerMove.getPosX + 2 >= tabuleiro.getW / tabuleiro.getS || colidiu(tabuleiro.getDados, playerMove)) {
        return
    };

    player.setPos = playerMove.getPos;
    rodarJogo(0)
}

document.addEventListener('keypress', tecla => {
    movimento(tecla.key.toLocaleLowerCase());
})

rodarJogo();