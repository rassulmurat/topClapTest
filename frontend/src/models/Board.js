"use strict";

const Tyle = require("./Tyle");
const BaseCell = require("./BaseCell");
const Cell = require("./Cell");

/**
 * Класс отвечающий за рассположение и движение тайлов в ячейках
 */
module.exports = class Board {

    /**
     * 
     * @param {Number} height Высота игровой доски 
     * @param {Number} width Ширина игровой доски
     * @param {Tyle[]} tyles Массив тайлов для заполнения
     */
    constructor(height, width, tyles) {
        if (!Array.isArray(tyles))
            throw new Error("tyles must be an array");
        if (height * width !== tyles.length)
            throw new Error("tyles array length must be height * width");
        this._height = height;
        this._width = width;
        /**
         * @type {Array.<Cell[]>} Массив ячеек, 1 массив колонки, 2 массив ряды
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

    shuffleTyles() {

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
     * Возвращает массив ячеек
     * @returns {Array.<BaseCell[]>} Возвращает массив ячеек, 1 массив колонки, 2 массив ряды
     */
    getCells() {
        return this._gamingBoard;
    }
}