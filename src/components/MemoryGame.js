import React, { useState, useEffect } from "react";
import "./MemoryGame.css";

const MemoryGame = () => {
  const gridSize = 5.5;
  const [grid, setGrid] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [canSelect, setCanSelect] = useState(false);

  const initializeGame = () => {
    const pairs = Array.from(
      { length: (gridSize * gridSize) / 2 },
      (_, i) => i + 1
    );
    const doubledPairs = [...pairs, ...pairs];
    const shuffledPairs = doubledPairs.sort(() => Math.random() - 0.5);
    const gridItems = shuffledPairs.map((number) => ({
      number,
      revealed: false,
      permanentRevealed: false,
    }));
    setGrid(gridItems);
    setSelectedTiles([]);
    setCanSelect(false);

    setTimeout(() => {
      setGrid(gridItems.map((item) => ({ ...item, revealed: true })));
      setTimeout(() => {
        setGrid(gridItems.map((item) => ({ ...item, revealed: false })));
        setCanSelect(true);
      }, 5000); // Hide tiles after 5 seconds
    }, 1000); // Reveal tiles for 1 second before hiding
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleTileClick = (index) => {
    const checkWinCondition = () => {
      const allTilesRevealed = grid.every((tile) => tile.permanentRevealed);
      if (allTilesRevealed) {
        setTimeout(() => {
          alert("You win!");
          initializeGame();
        }, 1000);
      }
    };
    if (!canSelect || grid[index].permanentRevealed) return;

    const newGrid = [...grid];
    newGrid[index].revealed = true;
    setGrid(newGrid);

    const newSelectedTiles = [...selectedTiles, index];
    setSelectedTiles(newSelectedTiles);

    if (newSelectedTiles.length === 2) {
      setCanSelect(false);
      const [firstIndex, secondIndex] = newSelectedTiles;

      if (newGrid[firstIndex].number === newGrid[secondIndex].number) {
        //match
        newGrid[firstIndex].permanentRevealed = true;
        newGrid[secondIndex].permanentRevealed = true;
        setGrid(newGrid);
        setSelectedTiles([]);
        setCanSelect(true);
        checkWinCondition();
      } else {
        // not a match
        setTimeout(() => {
          newGrid[firstIndex].revealed = false;
          newGrid[secondIndex].revealed = false;
          setGrid(newGrid);
          setSelectedTiles([]);
          setCanSelect(true);
        }, 1000);
      }
    }
  };

  return (
    <>
      <div className="memory-grid">
        {grid.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile.revealed ? "revealed" : ""}`}
            onClick={() => handleTileClick(index)}
          >
            {tile.revealed ? tile.number : ""}
          </div>
        ))}
      </div>
      <button className="start-btn" onClick={initializeGame}>
        Start/Reset
      </button>
    </>
  );
};

export default MemoryGame;
