import React, { useState } from "react";
import "./MemoryGame.css";

const MemoryGame = () => {
  const gridSize = 5.5;
  const [grid, setGrid] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [canSelect, setCanSelect] = useState(false);
  const [isGameDisplaying, setIsGameDisplaying] = useState(false);
  const totalPairs = (gridSize * gridSize) / 3;
  const colors = [
    "#FF4136",
    "#0074D9",
    "#85144b",
    "#FFDC00",
    "#7FDBFF",
    "#F012BE",
    "#01FF70",
    "#2ECC40",
    "#AAAAAA",
    "#3D9970",
  ];
  const shuffledColors = colors
    .sort(() => Math.random() - 0.5)
    .slice(0, totalPairs);

  const initializeGame = () => {
    setIsGameDisplaying(true);

    const numbersArray = Array.from({ length: totalPairs }, (_, i) => i + 1);
    const pairedNumbersColors = numbersArray.map((number, index) => ({
      number,
      color: shuffledColors[index % shuffledColors.length],
    }));

    const doubledPairedNumbersColors = [
      ...pairedNumbersColors,
      ...pairedNumbersColors,
    ];
    const shuffledPairedNumbersColors = doubledPairedNumbersColors.sort(
      () => Math.random() - 0.5
    );

    const gridItems = shuffledPairedNumbersColors.map((pair) => ({
      number: pair.number,
      color: pair.color,
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
    }); // Reveal tiles for 1 second before hiding
  };

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
      {isGameDisplaying ? (
        <div className="memory-grid">
          {grid.map((tile, index) => (
            <div
              key={index}
              className={`tile ${tile.revealed ? "revealed" : ""}`}
              style={{
                backgroundColor: tile.revealed ? tile.color : "",
              }}
              onClick={() => handleTileClick(index)}
            >
              {tile.revealed ? tile.number : ""}
            </div>
          ))}
        </div>
      ) : (
        <p className="welcome-banner">Welcome to my game!</p>
      )}
      <button className="start-btn" onClick={initializeGame}>
        Start
      </button>
    </>
  );
};

export default MemoryGame;
