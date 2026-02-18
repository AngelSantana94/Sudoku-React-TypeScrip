import { useState, useEffect, useCallback, useRef } from "react";

interface Cell {
  id: number;
  valorReal: number;
  valorMostrado: string | number;
  esFijo: boolean;
  error: boolean;
}

export const Sudoku = () => {
  const [boardData, setBoardData] = useState<Cell[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const bgMusic = useRef<HTMLAudioElement | null>(null);
  const cellClickSound = useRef<HTMLAudioElement | null>(null);
  const buttonClickSound = useRef<HTMLAudioElement | null>(null);
  const arrowSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgMusic.current = new Audio("sound/music.mp3");
    cellClickSound.current = new Audio("sound/click.mp3");
    buttonClickSound.current = new Audio("sound/click-01.mp3");
    arrowSound.current = new Audio("sound/arrows.mp3");

    bgMusic.current.loop = true;

    return () => {
      if (bgMusic.current) {
        bgMusic.current.pause();
        bgMusic.current = null;
      }
    };
  }, []);

  const playEffect = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const playButtonSound = () => playEffect(buttonClickSound);

  const stopMusic = () => {
    playButtonSound();
    if (bgMusic.current) {
      bgMusic.current.pause();
      bgMusic.current.currentTime = 0;
    }
  };

  const handleMouseClick = (esFijo: boolean) => {
    if (!esFijo) playEffect(cellClickSound);
  };

  useEffect(() => {
    if (!bgMusic.current) return;
    if (isActive) {
      bgMusic.current.play().catch(() => {});
    } else {
      bgMusic.current.pause();
    }
  }, [isActive]);

  useEffect(() => {
    if (boardData.length > 0 && isActive) {
      const estaCompleto = boardData.every((cell) => cell.valorMostrado !== "");
      const sinErrores = boardData.every((cell) => !cell.error);
      if (estaCompleto && sinErrores) {
        setIsActive(false);
        new Audio("sound/aplausos.mp3").play().catch(() => {});
        setTimeout(() => {
          alert(
            `¡HAS GANADO!\nTiempo: ${Math.floor(seconds / 60)}m ${seconds % 60}s`,
          );
        }, 500);
      }
    }
  }, [boardData, isActive, seconds]);

  const esSeguro = (board: number[], indice: number, numero: number) => {
    const fila = Math.floor(indice / 9);
    const col = indice % 9;
    for (let i = 0; i < 9; i++) {
      if (board[fila * 9 + i] === numero) return false;
      if (board[i * 9 + col] === numero) return false;
    }
    const iniF = Math.floor(fila / 3) * 3;
    const iniC = Math.floor(col / 3) * 3;
    for (let f = 0; f < 3; f++) {
      for (let c = 0; c < 3; c++) {
        if (board[(iniF + f) * 9 + (iniC + c)] === numero) return false;
      }
    }
    return true;
  };

  const resolver = (board: number[]): boolean => {
    const vacio = board.indexOf(0);
    if (vacio === -1) return true;
    for (let num = 1; num <= 9; num++) {
      if (esSeguro(board, vacio, num)) {
        board[vacio] = num;
        if (resolver(board)) return true;
        board[vacio] = 0;
      }
    }
    return false;
  };

  const generarNuevoJuego = useCallback(() => {
    const nuevoTablero = new Array(81).fill(0);
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 9; i++) nuevoTablero[i] = nums[i];
    resolver(nuevoTablero);
    const data: Cell[] = nuevoTablero.map((val, i) => {
      const visible = Math.random() < 0.43;
      return {
        id: i,
        valorReal: val,
        valorMostrado: visible ? val : "",
        esFijo: visible,
        error: false,
      };
    });
    setBoardData(data);
    setSeconds(0);
    setIsActive(true);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const resolverSudokuCompleto = () => {
    playButtonSound();
    setBoardData((prev) =>
      prev.map((c) => ({
        ...c,
        valorMostrado: c.valorReal,
        error: false,
        esFijo: true,
      })),
    );
    setIsActive(false);
  };

  const setCellValue = (id: number, value: string) => {
    if (boardData[id].esFijo) return;
    const n = value.length > 0 ? value.slice(-1) : "";
    if (n !== "" && !/^[1-9]$/.test(n)) return;

    setBoardData((prev) => {
      const valComp = n === "" ? "" : parseInt(n);
      const nt = prev.map((c) =>
        c.id === id ? { ...c, valorMostrado: valComp } : c,
      );
      const tv = nt.map((c) => ({ ...c, error: false }));
      const errs = new Set<number>();
      const getV = (idx: number) =>
        tv[idx].valorMostrado === "" ? 0 : Number(tv[idx].valorMostrado);

      for (let f = 0; f < 9; f++) {
        const s = new Map<number, number[]>();
        for (let c = 0; c < 9; c++) {
          const i = f * 9 + c;
          const v = getV(i);
          if (v !== 0) {
            if (!s.has(v)) s.set(v, []);
            s.get(v)!.push(i);
          }
        }
        s.forEach((idx) => {
          if (idx.length > 1) for (let c = 0; c < 9; c++) errs.add(f * 9 + c);
        });
      }

      for (let c = 0; c < 9; c++) {
        const s = new Map<number, number[]>();
        for (let f = 0; f < 9; f++) {
          const i = f * 9 + c;
          const v = getV(i);
          if (v !== 0) {
            if (!s.has(v)) s.set(v, []);
            s.get(v)!.push(i);
          }
        }
        s.forEach((idx) => {
          if (idx.length > 1) for (let f = 0; f < 9; f++) errs.add(f * 9 + c);
        });
      }

      for (let bf = 0; bf < 3; bf++) {
        for (let bc = 0; bc < 3; bc++) {
          const s = new Map<number, number[]>();
          for (let f = 0; f < 3; f++) {
            for (let co = 0; co < 3; co++) {
              const i = (bf * 3 + f) * 9 + (bc * 3 + co);
              const v = getV(i);
              if (v !== 0) {
                if (!s.has(v)) s.set(v, []);
                s.get(v)!.push(i);
              }
            }
          }
          s.forEach((idx) => {
            if (idx.length > 1)
              for (let f = 0; f < 3; f++)
                for (let co = 0; co < 3; co++)
                  errs.add((bf * 3 + f) * 9 + (bc * 3 + co));
          });
        }
      }
      return tv.map((c) => ({ ...c, error: errs.has(c.id) }));
    });
  };

  const handleKeyDown = (id: number, e: React.KeyboardEvent) => {
    if (
      /^[1-9]$/.test(e.key) ||
      e.key.startsWith("Arrow") ||
      e.key === "Backspace" ||
      e.key === "Delete"
    ) {
      playEffect(arrowSound);
    }
    if (/^[1-9]$/.test(e.key)) {
      if (boardData[id].esFijo) return;
      (e.target as HTMLInputElement).value = "";
    }
    let nId = id;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (id >= 9) nId = id - 9;
        break;
      case "ArrowDown":
        e.preventDefault();
        if (id <= 71) nId = id + 9;
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (id % 9 !== 0) nId = id - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        if (id % 9 !== 8) nId = id + 1;
        break;
      case "Backspace":
      case "Delete":
        if (!boardData[id].esFijo) setCellValue(id, "");
        return;
      default:
        return;
    }
    if (nId !== id)
      (document.getElementById(`cell-${nId}`) as HTMLInputElement)?.focus();
  };

  return {
    boardData,
    seconds,
    generarNuevoJuego,
    setCellValue,
    handleKeyDown,
    setIsActive,
    resolverSudokuCompleto,
    stopMusic,
    handleMouseClick,
    playButtonSound,
  };
};
