"use strict";

module.exports = class Tyle {
    
    /**
     * 
     * @param {string} color 
     */
    constructor(color) {
        this._color = color;
    }

    get color() {
        return this._color;
    }
}