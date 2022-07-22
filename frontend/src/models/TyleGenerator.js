"use strict";

const Tyle = require('./Tyle');
const random = require("random");

const colors = [
    "green",
    "yellow",
    "red",
    "purple",
    "blue"
]

module.exports = class TyleGenerator {
    /**
     * 
     * @param {Number} numberOfColors 
     * @returns {Tyle}
     */
    static genNextTyle(numberOfColors) {
        if (numberOfColors > 5)
            throw new Error("Cannot show more than 5 colors");
        const randGen = random.uniformInt(0, numberOfColors - 1);
        let colorId = randGen();
        return new Tyle(colors[colorId]);
    }
}