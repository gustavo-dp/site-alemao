// --- VARIÁVEIS GLOBAIS ---
let available_words = [];
let index; 
let points = 0;

// --- SELETORES DE ELEMENTOS DO DOM ---
const btnNext = document.getElementById('next-word');
const word = document.getElementById('word-display');
const btnArticle = document.querySelectorAll('.btn-article');
const feedback = document.getElementById('feedback');
const pointsConst = document.getElementById('points');

// --- EVENT LISTENERS ---


btnArticle.forEach(button => {
    button.addEventListener('click', () => {
        const choice = button.dataset.article; 
        verifyAnswer(choice); 
    });
});

btnNext.addEventListener('click', () => {
    nextQuestion();
});


// --- FUNÇÕES DO JOGO ---

async function startQuiz() {
    index = 0;
    points = 0; 
    pointsConst.innerText = points; 
    
    await setUpQuiz();

    if (available_words.length > 0) {
        nextQuestion();
    }
}

function nextQuestion() {
    feedback.innerText = '';
    feedback.className = '';
    btnArticle.forEach(btn => btn.disabled = false); 
    btnNext.classList.add('hidden');

    if (index < available_words.length) {
        word.innerText = available_words[index].palavra;
    } else {
        word.innerText = 'Parabéns!';
        feedback.innerText = `Você completou todas as palavras! Pontuação final: ${points}`;
        btnArticle.forEach(btn => btn.disabled = true);
        btnNext.classList.add('hidden');
    }
}

/**
 * Verifica se a resposta do usuário está correta.
 * @param {string} choice - O artigo que o usuário escolheu ('der', 'die', ou 'das').
 */
function verifyAnswer(choice) {
    btnArticle.forEach(btn => btn.disabled = true);

    
    if (available_words[index].artigo === choice) {
        points++;
        feedback.innerText = 'Correto!';
        feedback.classList.add('correct');
        pointsConst.innerText = points;
    } else {
        feedback.innerText = `Incorreto! O certo é "${available_words[index].artigo} ${available_words[index].palavra}"`;
        feedback.classList.add('incorrect');
    }
    index++;
    btnNext.classList.remove('hidden');
}

async function setUpQuiz() {
    const urlParams = new URLSearchParams(window.location.search);
    const lektion = urlParams.get('lektion');

    if (lektion) {
        await loadWords(lektion);
    } else {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px; font-family: sans-serif;">
                <h1>Erro</h1>
                <p>Nenhuma lição foi selecionada.</p>
                <p><a href="index.html">Volte para a página inicial</a> e escolha uma lição.</p>
            </div>
        `;
    }
}

/**
 * Carrega o arquivo JSON da lição especificada.
 * @param {string} lektion - O identificador da lição.
 */
async function loadWords(lektion) {
  
    const url = `json/lektion${lektion}.json`; 
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Arquivo não encontrado ou erro de rede: ${response.statusText}`);
        }
        const data = await response.json();
        available_words = data.sort(() => Math.random() - 0.5); 
    } catch(error) {
        console.error('Falha ao carregar a lição:', error);
        word.innerText = 'Erro!';
        feedback.innerText = 'Não foi possível carregar os dados da lição. Verifique o nome do arquivo JSON.';
    }
}

// --- INICIA O QUIZ ---
startQuiz();