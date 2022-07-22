"use strict";

const BaseCell = require("./BaseCell");

module.exports = class Cell extends BaseCell {
    deleteTyle() {
        this._tyle = null;
    }

    get tyleColor() {
        if (this._tyle)
            return super.tyleColor
        else
            return null
    }

    /**
     * @param {Tyle} tyle New Tyle
     */
    set tyle(tyle) {
        this._tyle = tyle;
    }

    get tyle () {
        return this._tyle;
    }
}