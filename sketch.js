// Variáveis do jogo
let fazendeiro;
let itens = [];
let pontos = 0;
let tempo = 15; // Tempo máximo de 15 segundos
let tempoRestante = tempo;
let fase = 1;
let jogoAtivo = true;
let mensagem = "";

function setup() {
  createCanvas(800, 600);
  iniciarFase(fase); // Começa a fase inicial
  frameRate(60); // Aumenta o número de quadros por segundo para um cronômetro mais preciso
}

function draw() {
  if (!jogoAtivo) {
    // Fim de jogo
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(mensagem, width / 2, height / 2 - 50);
    textSize(24);
    text("Você pegou " + pontos + " milhos!", width / 2, height / 2 + 50);
    return;
  }

  // Chama a função para desenhar o fundo da fazenda
  desenhaFundo();

  // Desenha e move o fazendeiro
  fazendeiro.mover();
  fazendeiro.exibir();

  // Verificar se o fazendeiro pegou algum item
  for (let i = itens.length - 1; i >= 0; i--) {
    itens[i].exibir();
    if (fazendeiro.colidiuCom(itens[i])) {
      pontos++;
      itens.splice(i, 1); // Remove o item da lista
      gerarItens(1); // Gera um novo item após pegar
    }
  }

  // Verifica se o jogador alcançou a meta de milhos
  if (pontos >= getMetaDeMilhos()) {
    fase++;
    if (fase > 3) {
      jogoAtivo = false;
      mensagem = "Parabéns, você venceu!";
    } else {
      iniciarFase(fase); // Avança para a próxima fase
    }
  }

  // Exibe os pontos
  fill(0);
  textSize(24);
  text("Pontos: " + pontos, 10, 30);

  // Cronômetro
  tempoRestante -= deltaTime / 1000; // Atualiza o tempo restante
  if (tempoRestante <= 0) {
    tempoRestante = 0;
    jogoAtivo = false;
    mensagem = "Game Over!";
  }

  // Exibe o tempo restante
  textSize(24);
  text("Tempo: " + nf(tempoRestante.toFixed(1), 1, 1) + "s", width - 150, 30);
}

// Função para gerar itens aleatórios
function gerarItens(qtd) {
  for (let i = 0; i < qtd; i++) {
    let x = random(50, width - 50);
    let y = random(50, height - 150);
    itens.push(new Item(x, y)); // Chama a classe Item corretamente
  }
}

// Função para iniciar a fase
function iniciarFase(fase) {
  pontos = 0;
  tempoRestante = tempo;
  itens = []; // Inicializa a lista de itens
  gerarItens(getMetaDeMilhos()); // Gera a quantidade de milhos conforme a fase
  fazendeiro = new Fazendeiro(width / 2, height / 2); // Cria o fazendeiro na posição central
}

// Função para pegar a meta de milhos de acordo com a fase
function getMetaDeMilhos() {
  if (fase === 1) {
    return 30;
  } else if (fase === 2) {
    return 50;
  } else if (fase === 3) {
    return 75;
  }
  return 0; // Default
}

// Função para desenhar o fundo da fazenda
function desenhaFundo() {
  // Céu
  background(135, 206, 235); // Céu azul claro

  // Campos
  fill(34, 139, 34); // Verde
  noStroke();
  rect(0, height / 2, width, height / 2); // O campo de baixo

  // Colinas ao fundo
  fill(85, 107, 47); // Cor mais escura para colinas
  ellipse(width / 4, height / 2 + 50, 400, 300);
  ellipse(3 * width / 4, height / 2 + 50, 400, 300);

  // Sol
  fill(255, 223, 0); // Sol amarelo
  noStroke();
  ellipse(width - 100, 100, 100, 100); // Sol no canto superior direito

  // Algumas árvores
  fill(34, 139, 34); // Cor do tronco da árvore
  rect(100, height / 2 - 100, 20, 50); // Tronco da árvore 1
  fill(0, 128, 0); // Folhagem
  ellipse(110, height / 2 - 120, 60, 60); // Copa da árvore 1

  fill(34, 139, 34); // Tronco da árvore 2
  rect(600, height / 2 - 120, 20, 50); // Tronco da árvore 2
  fill(0, 128, 0); // Folhagem
  ellipse(610, height / 2 - 140, 60, 60); // Copa da árvore 2

  // Um celeiro simples
  fill(255, 0, 0); // Cor do celeiro (vermelho)
  rect(width / 2 - 80, height / 2 - 100, 160, 120); // Corpo do celeiro
  fill(255); // Cor da porta do celeiro
  rect(width / 2 - 20, height / 2 - 40, 40, 60); // Porta do celeiro
}

// Classe do Fazendeiro
class Fazendeiro {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocidade = 5;
    this.largura = 50;
    this.altura = 50;
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.velocidade;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.velocidade;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.velocidade;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.velocidade;
    }

    // Impede o fazendeiro de sair da tela
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  exibir() {
    // Cabeça (circulo)
    fill(255, 224, 189); // Cor de pele
    ellipse(this.x, this.y - 35, 30, 30); // Cabeça

    // Corpo (retângulo)
    fill(100, 150, 255); // Cor da camisa
    rect(this.x - 15, this.y - 10, 30, 40); // Corpo

    // Braços (retângulos)
    fill(255, 224, 189); // Cor de pele
    rect(this.x - 25, this.y - 10, 10, 25); // Braço esquerdo
    rect(this.x + 15, this.y - 10, 10, 25); // Braço direito

    // Pernas (retângulos)
    fill(0, 0, 255); // Cor das calças
    rect(this.x - 15, this.y + 30, 10, 20); // Perna esquerda
    rect(this.x + 5, this.y + 30, 10, 20); // Perna direita

    // Botas (retângulos pequenos)
    fill(139, 69, 19); // Cor das botas (marrom)
    rect(this.x - 15, this.y + 50, 10, 5); // Bota esquerda
    rect(this.x + 5, this.y + 50, 10, 5); // Bota direita
  }

  colidiuCom(item) {
    let d = dist(this.x, this.y, item.x, item.y);
    return d < 25 + item.raio; // Colisão simples (ajuste de raio)
  }
}

// Classe de Itens
class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.raio = 20;
  }

  exibir() {
    fill(255, 223, 0); // Cor amarela para os milhos
    noStroke();
    ellipse(this.x, this.y, this.raio * 2, this.raio * 2);
  }
}
