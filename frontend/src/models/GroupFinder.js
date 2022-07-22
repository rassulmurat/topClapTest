"use strict";

const BaseCell = require("./BaseCell");

module.exports = class GroupFinder {
    /**
     * Проверит в переданных ячейках наличие групп
     * @param {Array.<BaseCell[]>} cells Ячейки в которых искать группы
     * @param {Number} [minGroupSize=2] Минимальный размер группы
     * @returns {boolean}
     */
    static groupsLeft(cells, minGroupSize = 2) {
        for(const col of cells) {
            for (const row of col) {
                if(this.getGroup(cells, row, minGroupSize).length > 0)
                    return true;
            }
        }
        return false;        
    }

    /**
     * Возвращает ячейку выше
     * @param {BaseCell} cell Ячейка от которой брать
     * @param {Array.<BaseCell[]>} cells Игровая доска
     * @returns {BaseCell|null}
     */
    static _getTopCell(cell, cells) {
        if (cells[cell.x].length === cell.y + 1)
            return null;
        return cells[cell.x][cell.y + 1];
    }

    /**
     * Возвращает ячейку справа
     * @param {BaseCell} cell Ячейка от которой брать
     * @param {Array.<BaseCell[]>} cells Игровая доска
     * @returns {BaseCell|null}
     */
    static _getRightCell(cell, cells) {
        if (cells.length === cell.x + 1)
            return null;
        return cells[cell.x + 1][cell.y];
    }

    /**
     * Возвращает ячейку снизу
     * @param {BaseCell} cell Ячейка от которой брать
     * @param {Array.<BaseCell[]>} cells Игровая доска
     * @returns {BaseCell|null}
     */
    static _getBottomCell(cell, cells) {
        if (cell.y === 0)
            return null;
        return cells[cell.x][cell.y - 1];
    }

    /**
     * Возвращает ячейку слева
     * @param {BaseCell} cell Ячейка от которой брать
     * @param {Array.<BaseCell[]>} cells Игровая доска
     * @returns {BaseCell|null}
     */
    static _getLeftCell(cell, cells) {
        if (cell.x === 0)
            return null;
        return cells[cell.x - 1][cell.y];
    }

    /**
     * Проверит прилегающие ячейки и вернет ячейки принадлежащие к группе
     * @param {BaseCell} cell Ячейка вокруго которой искать группу
     * @param {Array.<BaseCell[]>} cells Игровая доска
     * @param {string} groupColor Цвет группы
     */
    static _checkCellForGroup(cell, cells, groupColor, currentGroup) {
        const group = [];
        const isInGroup = checkingCell => element => {
            return checkingCell.x === element.x && checkingCell.y === element.y;
        }

        if (this._getTopCell(cell, cells)
            && this._getTopCell(cell, cells).tyleColor === groupColor
            && currentGroup.findIndex(isInGroup(this._getTopCell(cell, cells))) === -1)
            group.push(this._getTopCell(cell, cells));
        if (this._getRightCell(cell, cells)
            && this._getRightCell(cell, cells).tyleColor === groupColor
            && currentGroup.findIndex(isInGroup(this._getRightCell(cell, cells))) === -1)
            group.push(this._getRightCell(cell, cells));
        if (this._getBottomCell(cell, cells)
            && this._getBottomCell(cell, cells).tyleColor === groupColor
            && currentGroup.findIndex(isInGroup(this._getBottomCell(cell, cells))) === -1)
            group.push(this._getBottomCell(cell, cells));
        if (this._getLeftCell(cell, cells) &&
            this._getLeftCell(cell, cells).tyleColor === groupColor
            && currentGroup.findIndex(isInGroup(this._getLeftCell(cell, cells))) === -1)
            group.push(this._getLeftCell(cell, cells));
        return group;
    }

    /**
     * Вернет группу прилегающую к указанной ячейке
     * @param {Array.<BaseCell[]>} cells Ячейки в которых искать группы 
     * @param {BaseCell} location Ячейка от которой искать группу
     * @param {Number} [minGroupSize=2] Минимальный размер группы
     * @returns {BaseCell[]}
     */
    static getGroup(cells, location, minGroupSize = 2) {
        const groupColor = location.tyleColor;
        const group = [];
        let tylesLeft = [location];
        do {
            let currentCell = tylesLeft.pop();
            group.push(currentCell);
            tylesLeft.push(...this._checkCellForGroup(currentCell, cells, groupColor, group));
        } while (tylesLeft.length > 0);
        if (group.length >= minGroupSize)
            return group;
        else
            return [];
    }
}