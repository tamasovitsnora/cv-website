// --- Create the "Deal Two Cards" button ---
const blackjackBtn = document.createElement('button');
blackjackBtn.textContent = "Deal Two Cards (Blackjack)";
blackjackBtn.style.display = "block";
blackjackBtn.style.margin = "24px auto 8px auto";
blackjackBtn.style.padding = "12px 22px";
blackjackBtn.style.fontSize = "1.06rem";
blackjackBtn.style.background = "#a7c7e7";
blackjackBtn.style.color = "#23233b";
blackjackBtn.style.border = "none";
blackjackBtn.style.borderRadius = "8px";
blackjackBtn.style.cursor = "pointer";
blackjackBtn.style.boxShadow = "0 1.5px 8px #bee4ff2a";
blackjackBtn.style.transition = "background 0.15s";
blackjackBtn.onmouseover = function() {
    blackjackBtn.style.background = "#427aa1";
    blackjackBtn.style.color = "#fff";
};
blackjackBtn.onmouseout = function() {
    blackjackBtn.style.background = "#a7c7e7";
    blackjackBtn.style.color = "#23233b";
};

// --- Create the "Draw Next Card" button ---
const drawBtn = document.createElement('button');
drawBtn.textContent = "Draw Next Card";
drawBtn.style.display = "block";
drawBtn.style.margin = "8px auto";
drawBtn.style.padding = "10px 20px";
drawBtn.style.fontSize = "1.01rem";
drawBtn.style.background = "#f5f7fa";
drawBtn.style.color = "#427aa1";
drawBtn.style.border = "1.6px solid #a7c7e7";
drawBtn.style.borderRadius = "8px";
drawBtn.style.cursor = "pointer";
drawBtn.style.boxShadow = "0 1px 6px #bee4ff1a";
drawBtn.style.transition = "background 0.14s, color 0.14s";
drawBtn.onmouseover = function() {
    drawBtn.style.background = "#427aa1";
    drawBtn.style.color = "#fff";
};
drawBtn.onmouseout = function() {
    drawBtn.style.background = "#f5f7fa";
    drawBtn.style.color = "#427aa1";
};
drawBtn.disabled = true;

// --- Cards and State ---
let currentCards = [];
let currentTotal = 0;

const blackjackResultDiv = document.createElement('div');
blackjackResultDiv.style.textAlign = "center";
blackjackResultDiv.style.fontWeight = "bold";
blackjackResultDiv.style.fontSize = "1.2rem";
blackjackResultDiv.style.color = "#427aa1";
blackjackResultDiv.style.margin = "16px 0";

const suits = ["♠", "♥", "♣", "♦"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
function getCardValue(rank) {
    if (rank === "A") return 11;
    if (["J","Q","K"].includes(rank)) return 10;
    return parseInt(rank);
}
function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return { rank, suit, value: getCardValue(rank) };
}
function updateResultDisplay() {
    const cardsStr = currentCards.map(
        card => `<span style="color:#23233b">${card.rank}${card.suit}</span>`
    ).join(' &amp; ');
    let resultHtml = 
        `🃏 Your cards: ${cardsStr}<br>
        Total: <span style="color:#5780c1">${currentTotal}</span>`;
    if (currentTotal === 21) {
        resultHtml += `<br><span style="color:#0da676;font-size:1.13em;">Nyertél</span>`;
        drawBtn.disabled = true;
    } else if (currentTotal > 21) {
        resultHtml += `<br><span style="color:#e2365d;font-size:1.13em;">Vesztettél hehe</span>`;
        drawBtn.disabled = true;
    }
    blackjackResultDiv.innerHTML = resultHtml;
}

// --- Button events ---
blackjackBtn.addEventListener('click', function() {
    // Start new game: Deal two cards
    currentCards = [getRandomCard(), getRandomCard()];
    currentTotal = currentCards[0].value + currentCards[1].value;
    drawBtn.disabled = false;
    updateResultDisplay();
});

drawBtn.addEventListener('click', function() {
    // Draw a card into current game
    const nextCard = getRandomCard();
    currentCards.push(nextCard);
    currentTotal += nextCard.value;
    updateResultDisplay();
});

document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector(".container");
    const motto = document.querySelector(".motto");
    if (motto && container) {
        container.insertBefore(blackjackBtn, motto.nextSibling);
        container.insertBefore(drawBtn, blackjackBtn.nextSibling);
        container.insertBefore(blackjackResultDiv, drawBtn.nextSibling);
    }
});
