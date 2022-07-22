"use strict";

const BaseCell = require("../models/BaseCell");
const Board = require("../models/Board");
const Tyle = require("../models/Tyle");

const buildBoard = (height, width) => {
    const tyles = new Array(height * width);
    for (let i = 0; i < height * width; ++i) {
        tyles[i] = new Tyle("green");
    }
    return new Board(height, width, tyles);
};

test("Testing building cells", () => {
    const height = 5;
    const width = 5;
    const tyles = new Array(height * width);
    for (let i = 0; i < height * width; ++i) {
        tyles[i] = new Tyle("green");
    }
    let board = new Board(height, width, tyles);
    let cells = board.getCells();
    cells = cells.flat();
    for (let i = 0; i < cells.length; ++i) {
        expect(cells[i].tyleColor).toBe(tyles[i].color);
    }
});

test("Delete tyles", () => {
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const height = 5;
    const width = 5;
    const removeAmount = getRandom(1, 5);
    const removingCells = [];
    for (let i = 0; i < removeAmount; ++i) {
        removingCells[i] = new BaseCell(getRandom(0, width - 1), getRandom(0, height - 1));
    }
    const board = buildBoard(height, width);
    board.deleteTyles(removingCells);
    let cells = board.getCells();
    cells = cells.flat();
    for (const cell of cells) {
        if (removingCells.findIndex(element => { return cell.x === element.x && cell.y === element.y }) !== -1)
            expect(cell.tyleColor).toBeNull();
        else
            expect(cell.tyleColor).toBe("green");
    }
});

test("Fill empty", () => {
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const height = 5;
    const width = 5;
    const removingCells = [
        new BaseCell(1, 1),
        new BaseCell(1, 2),
        new BaseCell(2, 2),
        new BaseCell(3, 2),
        new BaseCell(3, 3),
        new BaseCell(3, 4),
    ];
    const newTyles = [
        new Tyle("red"),
        new Tyle("red"),
        new Tyle("red"),
        new Tyle("red"),
        new Tyle("red"),
        new Tyle("red"),
    ]
    const board = buildBoard(height, width);
    board.deleteTyles(removingCells);
    board.fillEmptyCells(newTyles);
    const cells = board.getCells();
    expect(cells[1][1].tyleColor).toBe("green");
    expect(cells[1][2].tyleColor).toBe("green");
    expect(cells[2][2].tyleColor).toBe("green");
    expect(cells[1][3].tyleColor).toBe("red");
    expect(cells[1][4].tyleColor).toBe("red");
    expect(cells[2][4].tyleColor).toBe("red");
    expect(cells[3][4].tyleColor).toBe("red");
    expect(cells[3][3].tyleColor).toBe("red");
    expect(cells[3][2].tyleColor).toBe("red");
});