
        class TicTacToe {
            constructor() {
                this.boxes = document.querySelectorAll('.box');
                this.resetBtn = document.getElementById('reset-btn');
                this.newGameBtn = document.getElementById('new-game-btn');
                this.clearStatsBtn = document.getElementById('clear-stats-btn');
                this.msgContainer = document.getElementById('msg-container');
                this.msg = document.getElementById('msg');
                this.turnIndicator = document.getElementById('turn-indicator');
                this.moveList = document.getElementById('move-list');
                
                this.turnO = true;
                this.gameActive = true;
                this.moveCount = 0;
                this.moveHistory = [];
                
                // Stats
                this.stats = {
                    gamesPlayed: 0,
                    scoreO: 0,
                    scoreX: 0,
                    draws: 0,
                    currentStreak: 0,
                    lastWinner: null
                };
                
                this.winPatterns = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                    [0, 4, 8], [2, 4, 6] // diagonals
                ];
                
                this.loadStats();
                this.initializeGame();
                this.attachEventListeners();
            }
            
            initializeGame() {
                this.turnO = true;
                this.gameActive = true;
                this.moveCount = 0;
                this.moveHistory = [];
                this.updateTurnIndicator();
                this.updateMoveHistory();
                this.enableBoxes();
                this.msgContainer.classList.add('hide');
            }
            
            attachEventListeners() {
                this.boxes.forEach((box, index) => {
                    box.addEventListener('click', () => this.handleBoxClick(box, index));
                });
                
                this.resetBtn.addEventListener('click', () => this.resetGame());
                this.newGameBtn.addEventListener('click', () => this.resetGame());
                this.clearStatsBtn.addEventListener('click', () => this.clearStats());
            }
            
            handleBoxClick(box, index) {
                if (!this.gameActive || box.disabled) return;
                
                const player = this.turnO ? 'O' : 'X';
                box.innerText = player;
                box.classList.add(player.toLowerCase());
                box.disabled = true;
                
                this.moveCount++;
                this.moveHistory.push({ player, position: index + 1 });
                this.updateMoveHistory();
                
                if (this.checkWinner()) {
                    this.showWinner(player);
                    this.updateStats(player);
                } else if (this.moveCount === 9) {
                    this.showDraw();
                    this.updateStats('draw');
                } else {
                    this.turnO = !this.turnO;
                    this.updateTurnIndicator();
                }
            }
            
            checkWinner() {
                for (let pattern of this.winPatterns) {
                    const [a, b, c] = pattern;
                    const boxA = this.boxes[a];
                    const boxB = this.boxes[b];
                    const boxC = this.boxes[c];
                    
                    if (boxA.innerText && 
                        boxA.innerText === boxB.innerText && 
                        boxB.innerText === boxC.innerText) {
                        
                        // Highlight winning boxes
                        [boxA, boxB, boxC].forEach(box => {
                            box.classList.add('winning');
                        });
                        
                        this.gameActive = false;
                        return true;
                    }
                }
                return false;
            }
            
            showWinner(winner) {
                this.msg.innerText = `🎉 Player ${winner} Wins!`;
                this.msg.classList.add('winner');
                this.msg.classList.remove('draw');
                this.msgContainer.classList.remove('hide');
                this.disableBoxes();
            }
            
            showDraw() {
                this.msg.innerText = `🤝 It's a Draw!`;
                this.msg.classList.add('draw');
                this.msg.classList.remove('winner');
                this.msgContainer.classList.remove('hide');
            }
            
            updateStats(result) {
                this.stats.gamesPlayed++;
                
                if (result === 'O') {
                    this.stats.scoreO++;
                    this.updateStreak('O');
                } else if (result === 'X') {
                    this.stats.scoreX++;
                    this.updateStreak('X');
                } else {
                    this.stats.draws++;
                    this.stats.currentStreak = 0;
                    this.stats.lastWinner = null;
                }
                
                this.saveStats();
                this.displayStats();
            }
            
            updateStreak(winner) {
                if (this.stats.lastWinner === winner) {
                    this.stats.currentStreak++;
                } else {
                    this.stats.currentStreak = 1;
                    this.stats.lastWinner = winner;
                }
            }
            
            displayStats() {
                document.getElementById('score-o').textContent = this.stats.scoreO;
                document.getElementById('score-x').textContent = this.stats.scoreX;
                document.getElementById('score-draw').textContent = this.stats.draws;
                document.getElementById('games-played').textContent = this.stats.gamesPlayed;
                document.getElementById('current-streak').textContent = this.stats.currentStreak;
            }
            
            updateTurnIndicator() {
                this.turnIndicator.textContent = this.turnO ? 'O' : 'X';
                this.turnIndicator.style.color = this.turnO ? '#4ecdc4' : '#ff6b6b';
            }
            
            updateMoveHistory() {
                if (this.moveHistory.length === 0) {
                    this.moveList.textContent = 'Game not started';
                    return;
                }
                
                const historyText = this.moveHistory
                    .map((move, index) => `${index + 1}. Player ${move.player} → Position ${move.position}`)
                    .join('\n');
                
                this.moveList.textContent = historyText;
            }
            
            resetGame() {
                this.boxes.forEach(box => {
                    box.innerText = '';
                    box.disabled = false;
                    box.classList.remove('x', 'o', 'winning');
                });
                
                this.initializeGame();
            }
            
            clearStats() {
                this.stats = {
                    gamesPlayed: 0,
                    scoreO: 0,
                    scoreX: 0,
                    draws: 0,
                    currentStreak: 0,
                    lastWinner: null
                };
                
                this.saveStats();
                this.displayStats();
            }
            
            disableBoxes() {
                this.boxes.forEach(box => {
                    box.disabled = true;
                });
            }
            
            enableBoxes() {
                this.boxes.forEach(box => {
                    box.disabled = false;
                    box.innerText = '';
                    box.classList.remove('x', 'o', 'winning');
                });
            }
            
            saveStats() {
                // In a real app, this would save to localStorage
                // For this demo, we'll keep stats in memory
            }
            
            loadStats() {
                // In a real app, this would load from localStorage
                this.displayStats();
            }
        }
        
        // Initialize the game when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new TicTacToe();
        });
   