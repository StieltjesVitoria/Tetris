class Peca {
    #conjuntoDePecas = [
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

    get getPeca() {
        return this.#escolherPeca;
    }

    get getPecaInicias() {
        return this.#gerarPecasInicias;
    }

    /**
    * @param {number[][]} peca
    **/
    girarPeca(peca) {
        for (let y = 0; y < peca.length; y++) {
            for (let x = 0; x < y; x++) {
                [peca[x][y], peca[y][x]] = [peca[y][x], peca[x][y]];
            }
        }
        peca.reverse();
        return peca;
    }s

    // Função que gera uma cor HEX aleátoria
    #escolherCor() {
        const letras = '0123456789ABCDEF';
        let cor = '#';

        for (let i = 0; i < 6; i++) {
            cor += letras[Math.floor(Math.random() * 16)];
        };

        return cor;
    }

    // Função responsável por gerar a peça e anexar a cor dela.
    #escolherPeca() {
        const valor = Math.floor(Math.random() * this.#conjuntoDePecas.length);
        const cor = this.#escolherCor();
        let peca = this.#conjuntoDePecas[valor]
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
        return peca;
    }

    #gerarPecasInicias() {
        const listPecas = [];
        let peca1 = this.#escolherPeca();
        listPecas.push(peca1);
        return listPecas;
    }
}

class Player {
    /**
     * @param {number[][]} peca
     * @param {number[][][]} listProxPecas
     */
    constructor(peca, listProxPecas) {
        this.#peca = peca;
        this.#listProxPecas = listProxPecas
    }

    #x = 6;
    #y = -1;
    #peca = [[0]];
    #listProxPecas = [[[0]]];
    #pontos = 0;

    get getPos() {
        return {x: this.#x, y: this.#y};
    }

    get getPeca() {
        return this.#peca;
    }

    get getListProxPeca() {
        return this.#listProxPecas;
    }

    get getPontos() {
        return this.#pontos;
    }

    get getPosX() {
        return this.#x;
    }

    get getPosY() {
        return this.#y;
    }

    /**
     * @param {{x: number, y: number}} pos
     */
    set setPos(pos) {
        this.#x = pos.x;
        this.#y = pos.y;
    }

    /**
     * @param {number} x
     */
    set setPosX(x) {
        this.#x = x;
    }

    /**
     * @param {number} y
     */
    set setPosY(y) {
        this.#y = y;
    }

    /**
     * @param {number[][]} peca
     */
    set setPeca(peca) {
        this.#peca = peca;
    }

    /**
     * @param {number[][]} peca
     */
    set setListProxPeca(peca) {
        this.#listProxPecas.shift()
        this.#listProxPecas.push(peca);
    }

    /**
     * @param {number} pontos
     */
    set setPontos(pontos) {
        this.#pontos = pontos;
    }
}

class Tabuleiro {
    #w = 0;
    #h = 0;
    #s = 0;
    #dados;

    /**
     * @param {number} w
     * @param {number} h
     * @param {number} scale
     */
    constructor(w, h, scale) {
        this.#w = w;
        this.#h = h;
        this.#s = scale;
        this.#dados = this.#gerarMatrix(w / scale, h / scale);
    }

    get getW() {
        return this.#w;
    }

    get getH() {
        return this.#h;
    }

    get getS() {
        return this.#s;
    }

    get getDados() {
        return this.#dados;
    }

    /**
     * @param {number} w
     */
    set setW(w) {
        this.#w = w;
    }

    /**
     * @param {number} h
     */
    set setH(h) {
        this.#h = h;
    }

    /**
     * @param {any[][]} dados
     */
    set setDados(dados) {
        this.#dados = dados;
    }

    reset() {
        this.#dados = this.#gerarMatrix(this.#w / this.#s, this.#h / this.#s)
    }

    // Método que gera um tabuleiro em forma de matrix para que possa ser guardado as peças
    #gerarMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}
}