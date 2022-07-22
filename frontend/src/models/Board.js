"use strict";

const Tyle = require("./Tyle");
const BaseCell = require("./BaseCell");
const Cell = require("./Cell");
const random = require("random");

/**
 * Класс отвечающий за рассположение и движение тайлов в ячейках
 */
module.exports = class Board {

    /**
     * @param {Number} height Высота игровой доски 
     * @param {Number} width Ширина игровой доски
     * @param {Tyle[]} tyles Массив тайлов для заполнения, отсчет начинается слева снизу, 0 обект будет стоять в ячейке [0][0] последний [width-1][height-1]
     */
    constructor(height, width, tyles) {
        if (!Array.isArray(tyles))
            throw new Error("tyles must be an array");
        if (height * width !== tyles.length)
            throw new Error("tyles array length must be height * width");
        this._height = height;
        this._width = width;
        /**
         * @type {Array.<Cell[]>} Массив ячеек, 1 массив колонки, 2 массив ряды, отсчет начинается слева снизу
         */
        this._gamingBoard = new Array(width);
        for (let i = 0; i < width; ++i) {
            this._gamingBoard[i] = new Array(height);
            for (let j = 0; j < height; ++j) {
                if (!(tyles[i * height + j] instanceof Tyle))
                    throw new Error(`tyles[${i * height + j}] must be instance of class Tyle`);
                this._gamingBoard[i][j] = new Cell(i, j, tyles[i * height + j]);
            }
        }
    }

    /**
     * Случайно перемешивает тайлы в ячейках
     */
    shuffleTyles() {
        const heightRandGen = random.uniformInt(0, this._height - 1);
        const widthRandGen = random.uniformInt(0, this._width - 1);
        
        for(let i = 0; i < this._width; ++i) {
            for(let j = 0; j < this._height; ++j) {
                let x = widthRandGen();
                let y = heightRandGen();
                const tmp = this._gamingBoard[x][y].tyle;
                this._gamingBoard[x][y].tyle = this._gamingBoard[i][j].tyle; 
                this._gamingBoard[i][j].tyle = tmp;
            }
        }
    }

    /**
     * Удаляет тайлы в указаных ячейках, переместит тайлы вниз и добавит новые тайлы
     * @param {BaseCell[]} cells Массив ячеек который необходимо удалить
     */
    deleteTyles(cells) {
        cells.forEach((cell) => {
            this._gamingBoard[cell.x][cell.y].deleteTyle();
        });
    }

    /**
     * Рекурсивный метод, заполняет пустые поля сдвигая верхние вниз
     * @param {Cell} cell Ячейка которую нужно заполнить
     * @param {Tyle[]} newTyles Новые тайлы которые приходят сверху
     * @returns {Cell} Ячейка которой нужно заменить
     */
    _fillEmpty(cell, newTyles) {
        if (cell.y + 1 === this._height) { // Если ячейка выше вне игрового поля
            return newTyles.pop();
        } else if (this._gamingBoard[cell.x][cell.y + 1].tyle) { // Если ячейка выше не пустая
            let tmp = this._gamingBoard[cell.x][cell.y + 1].tyle;
            this._gamingBoard[cell.x][cell.y + 1].tyle = null;
            return tmp;
        } else { // Если ячейка выше пустая
            return this._fillEmpty(this._gamingBoard[cell.x][cell.y + 1], newTyles);
        }
    }

    /**
     * Переместит тайлы вниз и добавит новые тайлы
     * @param {Tyle[]} newTyles Новые тайлы которые приходят сверху
     */
    fillEmptyCells(newTyles) {
        if (!Array.isArray(newTyles))
            throw new Error("newTyles must be array");
        for (const col of this._gamingBoard) {
            for (let j = 0; j < col.length; ++j) {
                if (col[j].tyle === null) {
                    col[j].tyle = this._fillEmpty(col[j], newTyles);
                }
            }
        }
    }

    /**
     * Возвращает массив ячеек, отсчет начинается слева снизу
     * @returns {Array.<BaseCell[]>} Возвращает массив ячеек, 1 массив колонки, 2 массив ряды
     */
    getCells() {
        const cells = [];
        for(const col of this._gamingBoard) {
            cells.push([]);
            for(const row of col)
                cells[row.x][row.y] = new BaseCell(row.x, row.y, new Tyle(row.tyleColor));
        }
        return cells;
    }
}