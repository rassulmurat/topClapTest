"use strict";

const BaseCell = require("./BaseCell");
const Board = require("./Board");
const GroupFinder = require("./GroupFinder");
const TyleGenerator = require("./TyleGenerator");

module.exports = class Game {
    _shufflesLeft;
    _score = 0;
    _board;
    _minGroupSize;
    _numberOfColors;
    _height;
    _width;
    /** @type {Number} Количество ходов */
    _moves = 0;
    _moveLimit;
    _gameOver = false;
    _scoreGoal;
    _win = false;

    /**
     * @param {Number} width Ширина игрового поля
     * @param {Number} height Высота игрового поля
     * @param {Number} numberOfColors Количество цветов
     * @param {Number} numberOfShuffles Количество перемешиваний
     * @param {Number} movesLimit Ограничение по количеству ходов
     * @param {Number} scoreGoal Цель очков который должен набрать пользователь
     * @param {Number} [minGroupSize] Минимальный размер группы
     */
    constructor(width, height, numberOfColors, numberOfShuffles, movesLimit, scoreGoal, minGroupSize = 2) {
        if (width === null || height === null || numberOfColors === null || numberOfShuffles === null)
            throw new Error("Not enough parameters to start the game");
        if (numberOfColors > 5)
            throw new Error("Number of colors cannot be greater than 5");
        this._width = width;
        this._height = height;
        this._numberOfColors = numberOfColors;
        this._shufflesLeft = numberOfShuffles;
        this._minGroupSize = minGroupSize;
        this._moveLimit = movesLimit;
        this._scoreGoal = scoreGoal;

        // Заполнение игрового поля
        const tyles = [];
        for (let i = 0; i < height * width; ++i) {
            tyles.push(TyleGenerator.genNextTyle(numberOfColors));
        }
        this._board = new Board(height, width, tyles);
    }

    /**
     * Возвращает статус игры, завершен или не завершен
     * @returns {boolean}
     */
    get gameOver() {
        return this._gameOver;
    }

    /**
     * Возвращает текущее количество очков
     * @returns {Number}
     */
    get score() {
        return this._score;
    }

    /**
     * Возвращает ячейки на игровом поле
     * @returns {Array.<BaseCell[]>}
     */
    get cells() {
        return this._board.getCells();
    }

    /**
     * Возвращает статус победы
     * @returns {boolean}
     */
    get win() {
        return this._win;
    }

    /**
     * Добавить очки пользователю
     * @param {BaseCell[]} deletedGroup Количество очков для добавления
     */
    _addScore(deletedGroup) {
        this._score += deletedGroup.length;
    }

    /**
     * Обновит текущий статус игры, если не осталось перемешиваний и нет тайлов для сжигания то Game Over или закончились ходы
     */
    _updateGameOver() {
        const cells = this._board.getCells();
        if ((!GroupFinder.groupsLeft(cells, this._minGroupSize)
            && this._shufflesLeft === 0) // Не осталось перемешиваний
            || this._moves >= this._moveLimit) // Закончились ходы
            this._gameOver = true;
    }

    /**
     * Обновит статус игры, если пользователь выйграл
     */
    _updateWin() {
        if (this._score >= this._scoreGoal) {
            this._gameOver = true;
            this._win = true;
        }
    }

    /**
     * Механика игры при нажатии пользователем на ячейку
     * @param {Number} x Колонна на игровом поле
     * @param {Number} y Ряд на игровом поле
     */
    userClick(x, y) {
        if (this._gameOver)
            return;
        // Найти группу
        let cells = this._board.getCells();
        const location = cells[x][y];
        let group = GroupFinder.getGroup(cells, location, this._minGroupSize);
        if (group.length === 0)
            return;
        // Удаляем тайлы найденной группы
        this._board.deleteTyles(group);
        // Двигаем тайлы вниз
        const newTyles = [];
        for (let i = 0; i < group.length; ++i) {
            newTyles.push(TyleGenerator.genNextTyle(this._numberOfColors));
        }
        this._board.fillEmptyCells(newTyles);
        // Добавляем очки пользователю
        this._addScore(group);
        ++this._moves;
        this._updateGameOver();
        this._updateWin();
    }

    /**
     * Механика игры перемешивания тайлов
     */
    shuffleTyles() {
        if (this._shufflesLeft > 0) {
            this._board.shuffleTyles();
            this._shufflesLeft--;
        }
        this._updateGameOver();
    }
}