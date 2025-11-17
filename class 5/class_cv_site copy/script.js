// Casino-style Blackjack

// --- Deck and game state ---
const SUITS = ["♠", "♥", "♣", "♦"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  


let deck = [];
let playerHand = [];
let dealerHand = [];
let roundOver = false;
let dealerTarget = 17;

function createDeck() {
    const newDeck = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            newDeck.push({ suit, rank });
        }
    }
    return newDeck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function cardValue(rank) {
    if (rank === "A") return 11;
    if (["K", "Q", "J"].includes(rank)) return 10;
    return parseInt(rank, 10);
}

function randomDealerTarget() {
    return 17 + Math.floor(Math.random() * 3); // 17-19
}

function handTotal(cards) {
    let total = 0;
    let aces = 0;
    for (const c of cards) {
        total += cardValue(c.rank);
        if (c.rank === "A") aces += 1;
    }
    while (total > 21 && aces > 0) {
        total -= 10; // make one Ace count as 1 instead of 11
        aces -= 1;
    }
    return total;
}

function drawFromDeck() {
    if (deck.length === 0) {
        deck = shuffle(createDeck());
    }
    return deck.pop();
}

// --- UI Elements ---
const title = document.createElement('h2');
title.className = 'casino-title';
title.innerHTML = 'Blackjack <span class="casino-title-glow">★</span>';

const tableWrap = document.createElement('section');
tableWrap.className = 'casino-section anchored-section';
tableWrap.id = 'blackjack-game';

const tableEl = document.createElement('div');
tableEl.className = 'casino-table';

let dealerTotalsBadge;
let dealerCardsRow;
let playerTotalsBadge;
let playerCardsRow;
let controls;

const dealBtn = document.createElement('button');
dealBtn.className = 'btn btn-primary';
dealBtn.textContent = 'Deal';

const hitBtn = document.createElement('button');
hitBtn.className = 'btn btn-secondary';
hitBtn.textContent = 'Hit';
hitBtn.disabled = true;

const standBtn = document.createElement('button');
standBtn.className = 'btn btn-secondary';
standBtn.textContent = 'Stand';
standBtn.disabled = true;

const resetBtn = document.createElement('button');
resetBtn.className = 'btn btn-ghost';
resetBtn.textContent = 'Reset';
resetBtn.disabled = true;

const msg = document.createElement('div');
msg.className = 'result-msg';

// --- Rendering ---
function renderCard(card) {
    const el = document.createElement('div');
    el.className = 'card';
    const isRed = card.suit === '♥' || card.suit === '♦';
    el.innerHTML = `
        <div class="card-rank ${isRed ? 'red' : ''}">${card.rank}</div>
        <div class="card-suit ${isRed ? 'red' : ''}">${card.suit}</div>
    `;
    el.setAttribute('aria-label', `${card.rank}${card.suit}`);
    el.classList.add('enter');
    return el;
}

function renderHand(cards, targetRow) {
    if (!targetRow) return;
    targetRow.innerHTML = '';
    for (const c of cards) {
        targetRow.appendChild(renderCard(c));
    }
}

function render() {
    if (!dealerCardsRow || !playerCardsRow) return;
    renderHand(dealerHand, dealerCardsRow);
    renderHand(playerHand, playerCardsRow);
    if (dealerTotalsBadge) {
        dealerTotalsBadge.textContent = `Total: ${dealerHand.length ? handTotal(dealerHand) : 0}`;
    }
    if (playerTotalsBadge) {
        playerTotalsBadge.textContent = `Total: ${playerHand.length ? handTotal(playerHand) : 0}`;
    }
}

function stateToUI({ preserveMessage = true } = {}) {
    render();
    if (!preserveMessage) {
        if (!playerHand.length && !dealerHand.length) {
            msg.textContent = 'Tap Deal to start a round.';
        } else if (!roundOver) {
            msg.textContent = 'Place your move.';
        }
    }
}

function showJobOfferModal() {
    const modal = document.getElementById('jobOfferModal');
    if (modal) {
        modal.classList.add('show');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        console.log('Loss modal should now be visible');
    } else {
        console.error('Loss modal element not found!');
    }
}

function hideJobOfferModal() {
    const modal = document.getElementById('jobOfferModal');
    if (modal) {
        modal.classList.remove('show');
        // Restore body scroll
        document.body.style.overflow = 'auto';
        console.log('Loss modal hidden');
    }
}

function showJobOfferModalWin() {
    const modal = document.getElementById('jobOfferModalWin');
    if (modal) {
        modal.classList.add('show');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        console.log('Win modal should now be visible');
    } else {
        console.error('Win modal element not found!');
    }
}

function hideJobOfferModalWin() {
    const modal = document.getElementById('jobOfferModalWin');
    if (modal) {
        modal.classList.remove('show');
        // Restore body scroll
        document.body.style.overflow = 'auto';
        console.log('Win modal hidden');
    }
}

function endRound(resultText) {
    msg.textContent = resultText;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    resetBtn.disabled = false;
    roundOver = true;
    stateToUI();
    
    // Check if player won - explicit win conditions
    const playerWon = resultText.includes('You win') || 
                      resultText.includes('Blackjack! You win') ||
                      resultText.includes('Dealer busts');
    
    // Check if player lost - explicit loss conditions
    const playerLost = resultText.includes('Bust at') || 
                       resultText.includes('Dealer wins') || 
                       resultText.includes('Dealer has blackjack') ||
                       resultText.includes('Better luck next time');
    
    // Push/tie doesn't trigger either modal
    const isPush = resultText.includes('Push') || resultText.includes('Both hit 21');
    
    if (playerWon && !isPush) {
        console.log('Player won! Showing win modal in 1.5 seconds...', resultText);
        setTimeout(() => {
            console.log('Attempting to show win modal...');
            showJobOfferModalWin();
        }, 1500); // Show modal 1.5 seconds after win message
    } else if (playerLost) {
        console.log('Player lost! Showing loss modal in 1.5 seconds...', resultText);
        setTimeout(() => {
            console.log('Attempting to show loss modal...');
            showJobOfferModal();
        }, 1500); // Show modal 1.5 seconds after loss message
    }
}

function dealerPlay() {
    // Dealer must hit on 16 or less, stops at 17+
    while (handTotal(dealerHand) <= 16 && handTotal(dealerHand) < 21) {
        dealerHand.push(drawFromDeck());
        stateToUI();
    }
    const playerTotal = handTotal(playerHand);
    const dealerTotalValue = handTotal(dealerHand);

    let resultText;
    if (dealerTotalValue > 21) {
        resultText = `🃏 Dealer busts at ${dealerTotalValue}! You win.`;
    } else if (dealerTotalValue === playerTotal) {
        resultText = `🤝 Push. Both stand at ${playerTotal}.`;
    } else if (dealerTotalValue > playerTotal) {
        resultText = `Dealer wins ${dealerTotalValue} to ${playerTotal}.`;
    } else {
        resultText = `You win ${playerTotal} to ${dealerTotalValue}.`;
    }

    endRound(resultText);
}

// --- Button events ---
dealBtn.addEventListener('click', function() {
    // (Re)shuffle when deck is low
    if (deck.length < 10) deck = shuffle(createDeck());
    playerHand = [drawFromDeck(), drawFromDeck()];
    dealerHand = [drawFromDeck(), drawFromDeck()];
    dealerTarget = randomDealerTarget();
    roundOver = false;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    resetBtn.disabled = false;
    msg.textContent = 'Good luck! ✨';
    stateToUI();

    const playerTotal = handTotal(playerHand);
    const dealerTotalValue = handTotal(dealerHand);

    if (playerTotal === 21 || dealerTotalValue === 21) {
        hitBtn.disabled = true;
        standBtn.disabled = true;
        if (playerTotal === 21 && dealerTotalValue === 21) {
            endRound('🙌 Both hit 21! Push.');
        } else if (playerTotal === 21) {
            endRound('🎉 Blackjack! You win.');
        } else {
            endRound('Dealer has blackjack. Better luck next time.');
        }
    }
});

hitBtn.addEventListener('click', function() {
    if (roundOver) return;
    playerHand.push(drawFromDeck());
    
    // Dealer draws if hand is 16 or less
    const dealerTotal = handTotal(dealerHand);
    if (dealerTotal <= 16) {
        dealerHand.push(drawFromDeck());
        const newDealerTotal = handTotal(dealerHand);
        if (newDealerTotal > 21) {
            stateToUI();
            endRound(`🃏 Dealer busts at ${newDealerTotal}! You win.`);
            return;
        }
    }
    
    stateToUI();
    const total = handTotal(playerHand);
    if (total > 21) {
        endRound(`💥 Bust at ${total}. Better luck next time.`);
    } else if (total === 21) {
        hitBtn.disabled = true;
        standBtn.disabled = true;
        msg.textContent = '🎯 21! Dealer draws...';
        stateToUI();
        setTimeout(() => {
            if (!roundOver) {
                dealerPlay();
            }
        }, 400);
    } else {
        msg.textContent = 'Hit or stand?';
    }
});

standBtn.addEventListener('click', function() {
    if (roundOver) return;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    msg.textContent = 'Dealer is drawing...';
    stateToUI();
    setTimeout(() => {
        if (!roundOver) {
            dealerPlay();
        }
    }, 400);
});

resetBtn.addEventListener('click', function() {
    playerHand = [];
    dealerHand = [];
    roundOver = false;
    msg.textContent = 'Tap Deal to start a new round.';
    hitBtn.disabled = true;
    standBtn.disabled = true;
    stateToUI();
});

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const motto = document.querySelector('.motto');
    const navButtons = document.querySelectorAll('.nav-btn');

    tableEl.innerHTML = `
        <div class="hand-section dealer-section">
            <div class="hand-header">
                <span class="hand-title">Dealer</span>
                <div class="totals-badge dealer-total">Total: 0</div>
            </div>
            <div class="cards-row dealer-cards" aria-live="polite"></div>
        </div>
        <div class="hand-section player-section">
            <div class="hand-header">
                <span class="hand-title">You</span>
                <div class="totals-badge player-total">Total: 0</div>
            </div>
            <div class="cards-row player-cards" aria-live="polite"></div>
        </div>
    `;

    dealerTotalsBadge = tableEl.querySelector('.dealer-total');
    dealerCardsRow = tableEl.querySelector('.dealer-cards');
    playerTotalsBadge = tableEl.querySelector('.player-total');
    playerCardsRow = tableEl.querySelector('.player-cards');

    controls = document.createElement('div');
    controls.className = 'controls-row';

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSelector = btn.getAttribute('data-target');
            const target = targetSelector ? document.querySelector(targetSelector) : null;
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // build structure
    controls.appendChild(dealBtn);
    controls.appendChild(hitBtn);
    controls.appendChild(standBtn);
    controls.appendChild(resetBtn);
    tableWrap.appendChild(title);
    tableWrap.appendChild(tableEl);
    tableWrap.appendChild(controls);
    tableWrap.appendChild(msg);

    const jobOfferNote = document.querySelector('.job-offer-note');
    if (jobOfferNote && container) {
        container.insertBefore(tableWrap, jobOfferNote.nextSibling);
    } else if (motto && container) {
        container.insertBefore(tableWrap, motto.nextSibling);
    } else if (container) {
        container.appendChild(tableWrap);
    }

    // init deck
    deck = shuffle(createDeck());
    msg.textContent = 'Tap Deal to start a round.';
    stateToUI();

    // Scroll animation observer - animations ALWAYS play when elements enter viewport
    const animateElements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;
            
            if (entry.isIntersecting) {
                // Element is entering viewport - ALWAYS animate it
                // Remove animated class first (even if not present, this is safe)
                element.classList.remove('animated');
                
                // Use setTimeout to ensure the browser processes the removal
                // Then add it back to trigger the animation
                setTimeout(() => {
                    // Force a reflow to ensure CSS processes the class removal
                    void element.offsetWidth;
                    // Now add the animated class to trigger animation
                    element.classList.add('animated');
                }, 20);
            } else {
                // Element is leaving viewport - reset it immediately
                element.classList.remove('animated');
            }
        });
    }, observerOptions);

    // Observe all animate elements - keep observing forever
    animateElements.forEach(el => {
        // Ensure initial state (not animated)
        el.classList.remove('animated');
        observer.observe(el);
    });
    
    // Handle initially visible elements after page load
    setTimeout(() => {
        animateElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !el.classList.contains('animated')) {
                // Element is visible but not animated yet - animate it
                el.classList.add('animated');
            }
        });
    }, 300);

    // Job Offer Modal handlers (Loss)
    const modal = document.getElementById('jobOfferModal');
    const modalClose = modal ? modal.querySelector('.modal-close') : null;
    const modalCancel = modal ? modal.querySelector('.modal-cancel') : null;
    const jobOfferForm = document.getElementById('jobOfferForm');

    // Verify loss modal exists
    if (!modal) {
        console.error('Job offer modal (loss) not found in DOM!');
    } else {
        console.log('Job offer modal (loss) found and ready.');
        // Ensure modal is hidden initially (CSS handles this, but double-check)
        if (modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
        // Close button handler
        if (modalClose) {
            modalClose.addEventListener('click', hideJobOfferModal);
        }
        // Cancel button handler
        if (modalCancel) {
            modalCancel.addEventListener('click', hideJobOfferModal);
        }
        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideJobOfferModal();
            }
        });
    }

    // Form submission handler (loss)
    if (jobOfferForm) {
        jobOfferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('jobOfferFile');
            if (fileInput && fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                alert(`Thank you! Your job offer "${fileName}" has been received. I'll review it soon! 💼✨`);
                hideJobOfferModal();
                jobOfferForm.reset();
            } else {
                alert('Please select a file to upload.');
            }
        });
    } else {
        console.error('Job offer form (loss) not found!');
    }

    // Job Offer Modal handlers (Win)
    const modalWin = document.getElementById('jobOfferModalWin');
    const modalCloseWin = modalWin ? modalWin.querySelector('.modal-close') : null;
    const modalCancelWin = modalWin ? modalWin.querySelector('.modal-cancel-win') : null;
    const jobOfferFormWin = document.getElementById('jobOfferFormWin');

    // Verify win modal exists
    if (!modalWin) {
        console.error('Job offer modal (win) not found in DOM!');
    } else {
        console.log('Job offer modal (win) found and ready.');
        // Ensure modal is hidden initially
        if (modalWin.classList.contains('show')) {
            modalWin.classList.remove('show');
        }
        // Close button handler
        if (modalCloseWin) {
            modalCloseWin.addEventListener('click', hideJobOfferModalWin);
        }
        // Cancel button handler
        if (modalCancelWin) {
            modalCancelWin.addEventListener('click', hideJobOfferModalWin);
        }
        // Click outside to close
        modalWin.addEventListener('click', function(e) {
            if (e.target === modalWin) {
                hideJobOfferModalWin();
            }
        });
    }

    // Form submission handler (win)
    if (jobOfferFormWin) {
        jobOfferFormWin.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('jobOfferFileWin');
            if (fileInput && fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                alert(`Thank you! Your job offer "${fileName}" has been received. I'll review it soon! 💼✨`);
                hideJobOfferModalWin();
                jobOfferFormWin.reset();
            } else {
                alert('Please select a file to upload.');
            }
        });
    } else {
        console.error('Job offer form (win) not found!');
    }
});