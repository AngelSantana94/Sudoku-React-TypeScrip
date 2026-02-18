import { describe, it, expect } from 'vitest';

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

describe('Sudoku Logic - esSeguro', () => {
  const mockBoard = [
    5, 3, 0, 0, 7, 0, 0, 0, 0,
    6, 0, 0, 1, 9, 5, 0, 0, 0,
    0, 9, 8, 0, 0, 0, 0, 6, 0,
    8, 0, 0, 0, 6, 0, 0, 0, 3,
    4, 0, 0, 8, 0, 3, 0, 0, 1,
    7, 0, 0, 0, 2, 0, 0, 0, 6,
    0, 6, 0, 0, 0, 0, 2, 8, 0,
    0, 0, 0, 4, 1, 9, 0, 0, 5,
    0, 0, 0, 0, 8, 0, 0, 7, 9
  ];

  it('debería permitir un número válido en una celda vacía', () => {
    expect(esSeguro(mockBoard, 2, 4)).toBe(true);
  });

  it('debería rechazar un número que ya existe en la misma fila', () => {
    expect(esSeguro(mockBoard, 2, 5)).toBe(false);
  });

  it('debería rechazar un número que ya existe en la misma columna', () => {
    expect(esSeguro(mockBoard, 18, 7)).toBe(false);
  });

  it('debería rechazar un número que ya existe en el mismo bloque 3x3', () => {
    expect(esSeguro(mockBoard, 10, 8)).toBe(false);
  });

  it('debería identificar correctamente el final de un tablero válido', () => {
    const fullBoard = [...mockBoard];
    expect(esSeguro(fullBoard, 2, 3)).toBe(false); 
  });
});