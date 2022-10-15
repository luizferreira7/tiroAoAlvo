let titulo = document.createElement('h2');
titulo.innerHTML = 'Tiro ao Alvo'
titulo.style.display = 'grid'
titulo.style.justifyContent = 'center'

let instruoes = document.createElement('p');
instruoes.innerHTML = 'Instruções: <br> 1 - Cada acerto ganha 1 ponto <br> 2 - Cada erro perde 1 ponto'
instruoes.style.display = 'grid'
instruoes.style.justifyContent = 'center'

let pontuacaoLabel = document.createElement('span');
pontuacaoLabel.style.marginTop = '15px'
pontuacaoLabel.innerHTML = 'Pontuação: 0';
pontuacaoLabel.style.display = 'grid';
pontuacaoLabel.style.justifyContent = 'center';
pontuacaoLabel.id = 'pontuacao';

let alvosLabel = document.createElement('span');
alvosLabel.innerHTML = 'Numero de alvos: ';
alvosLabel.style.marginRight = '5px'
alvosLabel.style.display = 'grid';
alvosLabel.id = 'alvosLabel';

let input = document.createElement('input');
input.setAttribute("type", "number");
input.style.width = '50px'
input.style.justifySelf = 'center';
input.style.display = 'inline'
input.min = '0'
input.max = '50'
input.value = '0'
input.id = 'input'

let configuracao = document.createElement('div');
configuracao.style.display = 'flex';
configuracao.style.justifySelf = 'center'
configuracao.appendChild(alvosLabel)
configuracao.appendChild(input)

var canvas = document.createElement('canvas');
canvas.width = '800'
canvas.height = '500'
canvas.style.justifySelf = 'center'
canvas.style.border = '1px solid black'
canvas.onclick = function() {
    pontuacao -= 1;
    document.getElementById('pontuacao').innerHTML = 'Pontuação: ' + pontuacao;
}
var pen = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let numCirculos = 0;
var direcao = [0.1, -0.1];

let pontuacao = 0;

class Circulo {
    constructor(x, y, dx, dy, r) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.color = sorteiaCor(Math.floor(Math.random() * 10), 10);
        this.direcaoX = direcao[Math.floor(Math.random() * 2)];
        this.direcaoY = direcao[Math.floor(Math.random() * 2)];

        this.draw = function () {
            pen.fillStyle = this.color;
            pen.beginPath();
            pen.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            pen.fill();
        };

        this.update = function () {
            this.x += this.dx;
            this.y += this.dy;
            if (this.dx > 9 || this.dx < -9) {
                this.dx *= Math.random() -0.3;
            }
            this.dx += this.direcaoX;
            if (this.dy > 9 || this.dy < -9) {
                this.dy *= Math.random() -0.3;
            }
            this.dy += this.direcaoY;
            if (this.x > width - this.r) {
                this.x = width - this.r;
                this.dx *= -1;
                this.direcaoX *= -1;
            } else if (this.x < this.r) {
                this.x = this.r;
                this.dx *= -1;
                this.direcaoX *= -1;
            }
            if (this.y > height - this.r) {
                this.y = height - this.r;
                this.dy *= -0.7;
                this.direcaoY *= -1;
            } else if (this.y < this.r) {
                this.y = this.r + 1;
                this.dy *= -0.7;
                this.direcaoY *= -1;
            }
            this.draw();
        };
    }
}

function sorteiaCor(colorNum, colors) {
    if (colors < 1) colors = 1;
    return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
}

var circulos = [];

let btnStart = document.createElement('button');
btnStart.innerHTML = 'Start';
btnStart.style.width = '80px'
btnStart.style.margin = '15px'
btnStart.style.justifySelf = 'center'
btnStart.style.borderRadius = '10%'
btnStart.style.display = 'inline'
btnStart.onclick = function() {
    pontuacao = 0;
    document.getElementById('pontuacao').innerHTML = 'Pontuação: 0';
    numCirculos = Number.parseInt(document.getElementById('input').value);
    criaCirculos();
};

let btnStop = document.createElement('button');
btnStop.innerHTML = 'Stop';
btnStop.style.width = '80px'
btnStop.style.margin = '15px'
btnStop.style.justifySelf = 'center'
btnStop.style.borderRadius = '10%'
btnStart.style.display = 'inline'
btnStop.onclick = function() {
    circulos = [];
};

let comandos = document.createElement('div');
comandos.style.display = 'flex';
comandos.style.justifySelf = 'center'
comandos.appendChild(btnStop)
comandos.appendChild(btnStart)

canvas.addEventListener('mousedown',function(event) {
    verificaAcerto(event.offsetX, event.offsetY);
});

canvas.addEventListener('touchstart', function(event) {
    let r = canvas.getBoundingClientRect();
    currX = event.touches[0].clientX - r.left;
    currY = event.touches[0].clientY - r.top;
    verificaAcerto(currX, currY);
});

function verificaAcerto(x, y) {
    for (let circulo of circulos) {
        if (x > (circulo.x - circulo.r) && 
            x < (circulo.x + circulo.r) && 
            y > (circulo.y - circulo.r) && 
            y < (circulo.y + circulo.r)) 
        {
            pontuacao += 2;
            document.getElementById('pontuacao').innerHTML = 'Pontuação: ' + pontuacao;
            circulos.splice(circulos.indexOf(circulo), 1);
        }
    }
}

function criaCirculos() {
	circulos = [];
	for(var i=0 ; i < numCirculos ; i++) {
		var x = Math.random()*width;
		var y = Math.random()*height;
		var r = Math.random()*20 + 20;
        var direcaoX = direcao[Math.floor(Math.random() * 1)];
        var direcaoY = direcao[Math.floor(Math.random() * 1)];
		circulos.push(new Circulo(x, y, direcaoX, direcaoY, r));
	}
}

function start() {
	pen.clearRect(0, 0, width, height);
	for(var circulo1 of circulos) {
		circulo1.update();
		for(var circulo2 of circulos) {
			if(circulo1 !== circulo2) {
				const colisao = verificaColisao(circulo1, circulo2);
				if(colisao[0]) {
                    ajustaPosicao(circulo1, circulo2, colisao[1]);
					resolveColisao(circulo1,circulo2);
				}
			}
		} 
	}
	requestAnimationFrame(start);
}
start();

function verificaColisao(circulo1, circulo2) {
	var rSum = circulo1.r + circulo2.r;
	var dx = circulo1.x - circulo2.x;
	var dy = circulo1.y - circulo2.y;
	return [rSum*rSum > dx*dx + dy*dy,rSum-Math.sqrt(dx*dx+dy*dy)];
}

function resolveColisao(circulo1, circulo2) {
	var relVel = [circulo2.dx - circulo1.dx,circulo2.dy - circulo1.dy];
	var norm = [circulo2.x - circulo1.x, circulo2.y - circulo1.y];
	var mag = Math.sqrt(norm[0]*norm[0] + norm[1]*norm[1]);
	norm = [norm[0]/mag,norm[1]/mag];
	
	var velAlongNorm = relVel[0]*norm[0] + relVel[1]*norm[1];
	if(velAlongNorm > 0)
		return;
	
	var bounce = 0.7;
	var j = -(1 + bounce) * velAlongNorm;
	j /= 1/circulo1.r + 1/circulo2.r;
	
	var impulso = [j*norm[0],j*norm[1]];
	circulo1.dx -= 1/circulo1.r * impulso[0];
	circulo1.dy -= 1/circulo1.r * impulso[1];
	circulo2.dx += 1/circulo2.r * impulso[0];
	circulo2.dy += 1/circulo2.r * impulso[1];
}

function ajustaPosicao(circulo1,circulo2,depth) { //Inefficient implementation for now
	const percent = 0.2;
	const slop = 0.01;
	var correcao = (Math.max(depth - slop, 0) / (1/circulo1.r + 1/circulo2.r)) * percent;
	
	var norm = [circulo2.x - circulo1.x, circulo2.y - circulo1.y];
	var mag = Math.sqrt(norm[0]*norm[0] + norm[1]*norm[1]);
	norm = [norm[0]/mag,norm[1]/mag];
	correcao = [correcao*norm[0],correcao*norm[1]];
	circulo1.x -= 1/circulo1.r * correcao[0];
	circulo1.y -= 1/circulo1.r * correcao[1];
	circulo2.x += 1/circulo2.r * correcao[0];
	circulo2.y += 1/circulo2.r * correcao[1];
}

document.addEventListener("DOMContentLoaded", function (event) {
    document.body.style.display = 'grid'
    document.body.appendChild(titulo);
    document.body.appendChild(instruoes);
    document.body.appendChild(configuracao);
    document.body.appendChild(pontuacaoLabel);
    document.body.appendChild(comandos);
    document.body.appendChild(canvas);
});
