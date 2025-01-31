import React, { useState, useEffect } from 'react';

type Card = {
  id: string;
  image: string;
  matched: boolean;
};

type GameHistory = {
  score: number;
  time: number;
};

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameTime, setGameTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Load game history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('gameHistory');
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save game history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
  }, [gameHistory]);

  // Initialize the game
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && matchedCards.length < 16) {
      timer = setInterval(() => {
        setGameTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, matchedCards]);

  // Generate cards
  const initializeGame = () => {
    const cardImages = ['🍎', '🍌', '🥕', '🍒', '🥝', '🍓', '🍇', '🍉'];
    let newCards: Card[] = [];
    for (let i = 0; i < 8; i++) {
      newCards.push({ id: `card-${i}-1`, image: cardImages[i], matched: false });
      newCards.push({ id: `card-${i}-2`, image: cardImages[i], matched: false });
    }
    newCards = shuffleCards(newCards);
    setCards(newCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setGameTime(0);
  };

  // Shuffle cards
  const shuffleCards = (cards: Card[]): Card[] => {
    return cards.sort(() => Math.random() - 0.5);
  };

  // Handle card flip
  const flipCard = (index: number) => {
    if (!flippedCards.includes(index) && !matchedCards.includes(index) && flippedCards.length < 2) {
      const newFlippedCards = [...flippedCards, index];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        if (cards[newFlippedCards[0]].image === cards[newFlippedCards[1]].image) {
          setMatchedCards([...matchedCards, newFlippedCards[0], newFlippedCards[1]]);
          setScore(score + 1);
          setFlippedCards([]);

          // Check if all cards are matched
          if (matchedCards.length + 2 === 16) {
            setGameHistory([...gameHistory, { score: score + 1, time: gameTime }]);
          }
        } else {
          setTimeout(() => {
            setFlippedCards([]);
          }, 1000);
        }
      }
    }
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
  };

  // Reset the game
  const resetGame = () => {
    setGameStarted(false);
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setGameTime(0);
  };

  // Toggle game history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 flex flex-col items-center justify-center p-4">
      {/* Game Info */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-4">Memory Game</h1>
        <div className="flex justify-between mb-4">
          <p className="text-lg font-semibold">Score: {score}</p>
          <p className="text-lg font-semibold">Time: {gameTime}s</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={startGame}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Start
          </button>
          <button
            onClick={resetGame}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Reset
          </button>
          <button
            onClick={toggleHistory}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            History
          </button>
        </div>
      </div>

      {/* Game Grid */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`
                w-20 h-20 flex items-center justify-center 
                rounded-lg cursor-pointer transition-all transform 
                ${flippedCards.includes(index) || matchedCards.includes(index)
                  ? 'bg-purple-200 rotate-0'
                  : 'bg-purple-500 hover:bg-purple-600 rotate-180'
                }
                ${matchedCards.includes(index) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => flipCard(index)}
            >
              <span className="text-3xl">
                {(flippedCards.includes(index) || matchedCards.includes(index)) 
                  ? card.image 
                  : '?'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Game Over Message */}
      {matchedCards.length === 16 && (
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
          <p className="text-2xl font-bold text-green-600 mb-4">Congratulations! You won!</p>
          <p className="text-lg">Final Score: {score}</p>
          <p className="text-lg">Time Taken: {gameTime}s</p>
        </div>
      )}

      {/* Game History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Game History</h2>
            {gameHistory.length === 0 ? (
              <p className="text-lg">No games played yet.</p>
            ) : (
              <ul>
                {gameHistory.map((game, index) => (
                  <li key={index} className="text-lg mb-2">
                    Game {index + 1}: Score {game.score}, Time {game.time}s
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={toggleHistory}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;