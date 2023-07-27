
let blackjackGame = {
     'you': {'scoreSpan':'#your-blackjack-result', 'div': '#your-box', 'score': 0},
     'dealer': {'scoreSpan':'#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
     'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
     'cardMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A':[1, 11]},
     'wins': 0,
     'losses': 0,
     'draws': 0,
     'isStand': false,
     'turnOver': false,
     'standOff': false,
    };

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('sounds/assets_sfx_card_deal.mp3')
const winSound = new Audio('sounds/cash.mp3')
const lostSound = new Audio('sounds/assets_sfx_fail.mp3')

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
    let card = randomCard()
    showCard(card, YOU)
    updateScore(card, YOU)
    showScore(YOU)
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13)
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
    let cardImage = document.createElement('img');
    cardImage.src = `images/${card}.png`
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play()
    }
}

function blackjackDeal() {
    if (blackjackGame['turnOver'] === true) {

    blackjackGame['isStand'] = false;
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img')
    
    for(i=0; i < yourImages.length; i++) {
        yourImages[i].remove()
    }

    for(i=0; i < dealerImages.length; i++) {
        dealerImages[i].remove()
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;

    document.querySelector('#your-blackjack-result').style.color = '#ffffff'
    document.querySelector('#dealer-blackjack-result').style.color = '#ffffff'

    document.querySelector('#blackjack-result').textContent = "Let's play";
    document.querySelector('#blackjack-result').style.color = 'white';

    blackjackGame['turnOver'] = false;
  }
  blackjackGame['standOff'] = false;
}

function updateScore (card, activePlayer) {
    if (card === 'A') {

    if (activePlayer['score'] + blackjackGame['cardMap'][card][1] <= 21) {
        activePlayer['score'] += blackjackGame['cardMap'][card][1];
    } else {
        activePlayer['score'] += blackjackGame['cardMap'][card][0];
        }
    } else {
      activePlayer['score'] += blackjackGame['cardMap'][card]
    }
}

function showScore (activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent ='BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    if (blackjackGame['standOff'] === false) {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
    let card = randomCard()
    showCard(card, DEALER)
    updateScore(card, DEALER)
    showScore(DEALER)
    await sleep(1000)
    }
    //if (DEALER['score'] > 15) {
        blackjackGame['standOff'] = false;
        blackjackGame['turnOver'] = true;
        let winner = computeWinner();
        showResult(winner)
    //}
}
}


function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        // You Won
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
        blackjackGame['wins']++;
        winner = YOU
        // Dealer Won
        } else if  (YOU['score'] < DEALER['score']) {
          blackjackGame['losses']++;
            winner = DEALER;
        // Drew
        } else if (YOU['score'] === DEALER['score']) {
          blackjackGame['draws']++;
        }

        // You Lost
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
      blackjackGame['losses']++;
      winner = DEALER;
        // Drew
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
      blackjackGame['draws']++;
    }
    console.log(blackjackGame);
    return winner
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnOver'] === true) {
        blackjackGame['standOff'] = true;


    if (winner === YOU) {
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = 'You won!';
        messageColor = 'green';
        winSound.play();
    
    } else if (winner === DEALER) {
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        message = 'You lost!';
        messageColor = 'red';
        lostSound.play();
   
    } else {
        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = 'You drew!';
        messageColor = 'black';
    } 

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
    }
}