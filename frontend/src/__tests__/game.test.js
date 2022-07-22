"use strict";

const Game = require("../models/Game");
const GroupFinder = require("../models/GroupFinder");

test("user click, score and game over", () => {
    const minGroupSize = 2;
    let game;
    const height = 5;
    const width = 5;
    // Создаем игру
    do {
        game = new Game(width, height, 5, 0, 10, 9999, minGroupSize);
    } while (!GroupFinder.groupsLeft(game.cells, minGroupSize))
    let score = 0;
    do {
        for (let i = 0; i < width; ++i) {
            if (game.gameOver)
                break;
            for (let j = 0; j < height; j++) {
                if (game.gameOver)
                    break;
                const cell = game.cells[i][j];
                let group = GroupFinder.getGroup(game.cells, cell, minGroupSize);
                score += group.length;
                game.userClick(cell.x, cell.y);
            }
        }
    } while (!game.gameOver)
    expect(game.score).toBe(score);
    expect(game.gameOver).toBe(true);
});

test("user win", () => {
    const minGroupSize = 2;
    let game;
    const height = 5;
    const width = 5;
    do {
        game = new Game(width, height, 5, 0, 9999, 10, minGroupSize);
    } while (!GroupFinder.groupsLeft(game.cells, minGroupSize))

    do {
        for (let i = 0; i < width; ++i) {
            if (game.gameOver)
                break;
            for (let j = 0; j < height; j++) {
                if (game.gameOver)
                    break;
                const cell = game.cells[i][j];
                game.userClick(cell.x, cell.y);
            }
        }
    } while (!game.gameOver)
    expect(game.win).toBe(true);
});

test("shuffle tyles", () => {
    const height = 5;
    const width = 5;
    const game = new Game(width, height, 5, 3, 1, 10);
    let cells = game.cells;
    game.shuffleTyles();
    expect(JSON.stringify(cells)).not.toBe(JSON.stringify(game.cells));
    game.shuffleTyles();
    expect(JSON.stringify(cells)).not.toBe(JSON.stringify(game.cells));
    game.shuffleTyles();
    expect(JSON.stringify(cells)).not.toBe(JSON.stringify(game.cells));
});