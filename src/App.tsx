import { useState } from "react";
import { Sudoku } from "./Sudoku.tsx";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const {
    boardData,
    seconds,
    generarNuevoJuego,
    setCellValue,
    resolverSudokuCompleto,
    handleKeyDown,
    stopMusic,
    handleMouseClick,
    playButtonSound,
    setIsActive,
  } = Sudoku();

  const startGame = () => {
    playButtonSound();
    generarNuevoJuego();
    setGameStarted(true);
    setIsActive(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return {
      min: String(m).padStart(2, "0"),
      seg: String(sec).padStart(2, "0"),
    };
  };

  const tiempo = formatTime(seconds);

  return (
    <div className="min-h-screen w-full flex items-center justify-center m-0 overflow-hidden font-['Fredoka'] select-none">
      {!gameStarted && (
        <div
          id="header"
          className="flex flex-col items-center justify-center min-h-screen animate-fade-in"
        >
          <div id="title" className="mb-20">
            <img
              src="img/title.png"
              alt="Sudoku Title"
              className="w-full max-w-5xl"
            />
          </div>

          <button
            onClick={startGame}
            className="w-65 h-20 bg-[url('./img/button.jpeg')] bg-cover bg-center rounded-4xl 
              shadow-[8px_8px_15px_-3px_rgba(0,0,0,0.9)] font-bold text-5xl 
              text-[#E6DED1] text-shadow-[4px_4px_2px_rgba(0,0,0,0.5)] 
              active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
          >
            Jugar
          </button>
        </div>
      )}

      {gameStarted && (
        <div className="flex flex-col items-center animate-fade-in px-4">
          <div
            className="w-45 h-13 bg-[url('img/button.jpeg')] bg-cover bg-center rounded-4xl 
                          shadow-[8px_8px_15px_-3px_rgba(0,0,0,0.9)] font-bold text-4xl 
                          text-[#E6DED1] flex items-center justify-center mb-8"
          >
            <span>{tiempo.min}</span>:<span>{tiempo.seg}</span>
          </div>

          <div className="relative w-[90vw] h-[90vw] max-w-137.5 max-h-137.5 shadow-2xl rounded-xl overflow-hidden mb-8">
            <img
              src="img/board.jpeg"
              className="border border-[#805D37] flex items-center justify-center text-[35px] font-bold font-['Roboto_Slab'] aspect-square"
              alt="Tablero"
            />

            <div className="absolute inset-0 z-20 grid grid-cols-9 grid-rows-9 p-3.5 gap-1">
              <div
                id="sudoku-grid"
                className="absolute inset-0 z-20 grid grid-cols-9 grid-rows-9 p-3 gap-0"
              >
                {boardData.map((cell) => {
                  const row = Math.floor(cell.id / 9);
                  const col = cell.id % 9;
                  const blockRow = Math.floor(row / 3);
                  const blockCol = Math.floor(col / 3);
                  const isGreen = (blockRow + blockCol) % 2 === 0;

                  const borderClasses = `
                  border-[#805D37]
                  ${col === 2 || col === 5 ? "border-r-4" : "border-r"}
                  ${row === 2 || row === 5 ? "border-b-4" : "border-b"}
                  ${col === 8 ? "border-r-0" : ""} 
                  ${row === 8 ? "border-b-0" : ""}
                `;

                  const bgClass = cell.error
                    ? "bg-[#D93718]/50"
                    : isGreen
                      ? "bg-[#769949]"
                      : "bg-transparent";

                  return (
                    <input
                      id={`cell-${cell.id}`}
                      key={cell.id}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      title=""
                      maxLength={1}
                      onClick={() => handleMouseClick(cell.esFijo)}
                      value={
                        cell.valorMostrado === ""
                          ? ""
                          : String(cell.valorMostrado)
                      }
                      readOnly={cell.esFijo}
                      onKeyDown={(e) => handleKeyDown(cell.id, e)}
                      onChange={(e) => setCellValue(cell.id, e.target.value)}
                      className={`
                      w-full h-full text-center cursor-pointer
                      flex items-center justify-center text-[35px] font-bold font-['Roboto_Slab']
                      transition-all duration-200 caret-transparent outline-none
                      ${borderClasses}
                      ${bgClass}
                      ${cell.esFijo ? "text-black" : "text-[#2B463C]"}
                      focus:ring-3 focus:ring-inset focus:ring-[#805D37]
                    `}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            <button
              onClick={resolverSudokuCompleto}
              className="w-40 h-14 bg-[url('./img/button.jpeg')] bg-cover bg-center rounded-3xl shadow-lg font-bold text-2xl text-[#E6DED1] active:scale-95 transition-transform cursor-pointer"
            >
              Resolver
            </button>
            <button
              onClick={() => {
                playButtonSound();
                generarNuevoJuego();
              }}
              className="w-40 h-14 bg-[url('./img/button.jpeg')] bg-cover bg-center rounded-3xl shadow-lg font-bold text-2xl text-[#E6DED1] active:scale-95 transition-transform cursor-pointer"
            >
              Reiniciar
            </button>
            <button
              onClick={() => {
                stopMusic();
                setGameStarted(false);
                setIsActive(false);
              }}
              className="w-40 h-14 bg-[url('./img/button.jpeg')] bg-cover bg-center rounded-3xl shadow-lg font-bold text-2xl text-[#E6DED1] active:scale-95 transition-transform cursor-pointer"
            >
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
