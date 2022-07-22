"use strict";

module.exports = class BaseCell {
    /**
     * 
     * @param {Number} x - Позиция в колонке 
     * @param {Number} y - Позиция в ряду
     * @param {Tyle} [tyle] - (Опционально) 
     */
    constructor(x, y, tyle) {
        this._x = x;
        this._y = y;
        this._tyle = tyle;
    }

    /**
     * @returns {Number} Позиция в колонке
     */
    get x() {
        return this._x;
    }

    /**
     * @returns {Number} Позиция в ряду
     */
    get y() {
        return this._y;
    }

    /**
     * @returns {string} - Цвет тайла
     */
    get tyleColor() {
        if (this._tyle)
            return this._tyle.color
        else
            return null
    }
}