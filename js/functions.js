export async function movimento(key) {
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
    animacaoDoJogo();
}

// Roda o Jogo
export function rodarJogo() {
    player.setPosY = player.getPosY + 1;
    animacaoDoJogo();
    setTimeout(rodarJogo, intervalo)
}