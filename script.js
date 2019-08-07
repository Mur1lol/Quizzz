let respostas = []
let time = []
let tam = []
let acert = []
var partidas = 0
var erros = 0
var ptTot = 0;
var c = 0;
var t;

const proxy = 'https://cors-anywhere.herokuapp.com/';

//------------------------------------------------------------------------------------------------------------------

//PEGAR PERGUNTAS
document.querySelector('.btn-quiz').addEventListener('click', function(){
    document.getElementById("btn-quiz").disabled=true

    var c = document.getElementById("selectCat");
    var categoriaSelecionada = c.options[c.selectedIndex].value;

    var d = document.getElementById("selectDif");
    var dificuldadeSelecionada = d.options[d.selectedIndex].value;

    var difName = document.getElementById("selectDif");
    var dificuldadeSelecionadaNome = difName.options[difName.selectedIndex].text;

    axios.get(`${proxy}https://opentdb.com/api.php`, {
        params: {
            amount: 1,
            category: categoriaSelecionada,
            difficulty: dificuldadeSelecionada
        }
    })
    .then(function(json) {
        const quiz = json.data;

        const pergunta = quiz.results[0]
        const categorias = pergunta.category
        const tipo = pergunta.type
        const dificuldade = pergunta.difficulty
        const respostaCerta = pergunta.correct_answer
        const respostasIncorreta = pergunta.incorrect_answers

        console.log(pergunta)

        document.querySelector('.pergunta').textContent = `${pergunta.question}`;

        respostas = respostasIncorreta
        respostas.push(respostaCerta);
        respostas = shuffle(respostas);

        if(dificuldade == "easy") {
            var acerto = 5
            var dif = "Fácil"
            var tempo = 45
        }

        else if (dificuldade == "medium") {
            var acerto = 8
            var dif = "Médio"
            var tempo = 30
        }

        else {
            var acerto = 10
            var dif = "Difícil"
            var tempo = 15
        }

        const categ = document.querySelector('.categoria');
        categ.textContent = '';

        const dificul = document.querySelector('.dificuldade');
        dificul.textContent = '';

        const resp = document.querySelector('.respostas');
        resp.textContent = '';

        categ.innerHTML=
        `<option value="${categoriaSelecionada}">${categorias}</option>`        

        dificul.innerHTML= 
        `<option value="${dificuldade}">${dif}</option>`

        for (let i = 0; i < respostas.length; i++) {
            resp.innerHTML += 
            `<li class="margem"><button class="btn btn-info container answer${i}" id="answer${i}">${respostas[i]}</button></li>`
        };

        console.log(respostaCerta)

        var tamanho = 2
        document.querySelector('.answer0').addEventListener('click', function() {        
            if (respostas[0] == respostaCerta) {
                pontuou(acerto)
                document.querySelector('.answer0').style.backgroundColor = "#14fc03";  
                contador(1,0)

            }
            else {
                pontuou(acerto*-1)
                document.querySelector('.answer0').style.backgroundColor = "#fc030f";  
                contador(1,1)
            }
            blockBotao(tamanho)
            stopCount()
        })

        document.querySelector('.answer1').addEventListener('click', function() {
            if (respostas[1] == respostaCerta) {
                pontuou(acerto)
                document.querySelector('.answer1').style.backgroundColor = "#14fc03";  
                contador(1,0)
                
            }
            else {
                pontuou(acerto*-1)
                document.querySelector('.answer1').style.backgroundColor = "#fc030f";  
                contador(1,1)
            }
            blockBotao(tamanho)
            stopCount()
        })

        if (tipo == "multiple") {
            var tamanho = 4
            document.querySelector('.answer2').addEventListener('click', function() {
                if (respostas[2] == respostaCerta) {
                    pontuou(acerto)
                    document.querySelector('.answer2').style.backgroundColor = "#14fc03";  
                    contador(1,0)
                }
                else {
                    pontuou(acerto*-1)
                    document.querySelector('.answer2').style.backgroundColor = "#fc030f";  
                    contador(1,1)
                }
                blockBotao(tamanho)
                stopCount()
            })

            document.querySelector('.answer3').addEventListener('click', function() {
                if (respostas[3] == respostaCerta) {
                    pontuou(acerto)
                    document.querySelector('.answer3').style.backgroundColor = "#14fc03";  
                    contador(1,0)
                }
                else {
                    pontuou(acerto*-1)
                    document.querySelector('.answer3').style.backgroundColor = "#fc030f";  
                    contador(1,1)
                }
                blockBotao(tamanho)
                stopCount()
            })
        }

        timedCount(tamanho, tempo, acerto)
    })
    .catch(function(erro) {
        console.log(erro);
        console.log("entrou no erro")
    });

});

//------------------------------------------------------------------------------------------------------------------

//PEGAR CATEGORIAS
document.querySelector('.categoria').addEventListener('click', function() {
    axios.get(`${proxy}https://opentdb.com/api_category.php`)
    .then(function(json) {
        const categorias = json.data;
        const cat = categorias.trivia_categories;

        var selectCat = document.getElementById("selectCat");

        if (selectCat.options.length != 25) {
            while (selectCat.options.length > 0) { 
                selectCat.remove(0); 
            }

            var newOption

            const categ = document.querySelector('.categoria');
            categ.textContent = '';        
            categ.innerHTML=
            `<option value="0">Aleatório</option>`
            
            for(let i = 0; i < cat.length; i++){            
                newOption = document.createElement("option"); 
                newOption.value = cat[i].id;
                newOption.text=cat[i].name; 

                try { 
                    selectCat.add(newOption);
                } 
                catch (e) { 
                   selectCat.appendChild(newOption); 
                }
            }
        }
    })
    .catch(function(erro) {
        console.log(erro);
        console.log("entrou no erro")
    });
});

//------------------------------------------------------------------------------------------------------------------

//PEGAR DIFICULDADES
document.querySelector('.dificuldade').addEventListener('click', function() {
    var selectDif = document.getElementById("selectDif");

    if (selectDif.options.length != 4) {
        while (selectDif.options.length > 0) { 
            selectDif.remove(0); 
        }

        const dificul = document.querySelector('.dificuldade');
        dificul.textContent = '';       
        dificul.innerHTML= 
        `<option value="">Aleatório</option>
        <option value="easy">Fácil</option>
        <option value="medium">Medio</option>
        <option value="hard">Difícil</option>`
    }
    
})

//------------------------------------------------------------------------------------------------------------------

function shuffle(respostas) {
    var ctr = respostas.length, temp, index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = respostas[ctr];
        respostas[ctr] = respostas[index];
        respostas[index] = temp;
    }
    return respostas;
}

function pontuou(acerto){
    ptTot = ptTot + acerto
    document.querySelector('.btn-pontos').textContent = `Pontos: ${ptTot}`;
}

function blockBotao(tamanho) {
    document.getElementById("answer0").disabled=true
    document.getElementById("answer1").disabled=true
    if(tamanho == 4) {
        document.getElementById("answer2").disabled=true
        document.getElementById("answer3").disabled=true
    }

    document.getElementById("btn-quiz").disabled=false
}


function contador(part, erro) {
    partidas = partidas + part
    erros = erros + erro

    if(erros == 3) {
        let timerInterval
        Swal.fire({
          title: 'Game Over!',
          html: '<div>Pontuação: '+ptTot+'</div>'+
          '<div>Partidas: '+partidas+'</div>',
          type: 'error'
        })

        ptTot = 0
        partidas = 0
        erros = 0

        document.querySelector('.btn-pontos').textContent = `Pontos: ${ptTot}`;
    }
}

function timedCount(tamanho, tempo, acerto) {
    document.getElementById("txt").value = c + " Segundos";
    c = c + 1;
    t = setTimeout(timedCount, 1000);

    for (var i = 0; i < tempo; i++) {
        time[i] = i
    }

    for (var i = 0; i < tamanho; i++) {
        tam[i] = i
    }

    for (var i = 0; i < acerto; i++) {
        acert[i] = i
    }

    if(c == time.length+1) {
        pontuou(acert.length*-1)
        contador(1,1)
        blockBotao(tam.length)
        stopCount()
    }
}


function stopCount() {
    clearTimeout(t);
    c = 0
    tam.length = 0
    time.length = 0
    acert.length = 0        
}