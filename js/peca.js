class Peca {
    constructor() {

    }

    conjuntoDePecas = [
        [
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0],
        ],
        [
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 1],
        ],
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 1],
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [1, 0, 0],
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    ]

    // Função que gera uma cor HEX aleátoria
    escolherCor() {
        const letras = '0123456789ABCDEF';
        let cor = '#';

        for (let i = 0; i < 6; i++) {
            cor += letras[Math.floor(Math.random() * 16)];
        };

        return cor;
    }

    gerarPeca(peca, pos, tabuleiro) {
        peca.forEach((linha, y) => {
            linha.forEach((valor, x) => {
                if (valor !== 0) {
                    tabuleiro.fillStyle = valor;
                    tabuleiro.fillRect(x + pos.x, y + pos.y, 1, 1);
                }
            });
        });
    }

}