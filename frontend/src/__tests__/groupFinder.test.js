"use strict";

const Tyle = require("../models/Tyle");
const Board = require("../models/Board");
const GroupFinder = require("../models/GroupFinder");
const BaseCell = require("../models/BaseCell");

test("getGroup", () => {
    const isInGroup = cell => element => {
        return cell.x === element.x && cell.y === element.y;
    }

    const height = 4;
    const width = 4;
    const tyles = Array(16);
    tyles[0] = new Tyle("green");
    tyles[1] = new Tyle("green");
    tyles[2] = new Tyle("green");
    tyles[3] = new Tyle("green");
    tyles[4] = new Tyle("green");
    tyles[5] = new Tyle("red");
    tyles[6] = new Tyle("green");
    tyles[7] = new Tyle("green");
    tyles[8] = new Tyle("green");
    tyles[9] = new Tyle("red");
    tyles[10] = new Tyle("red");
    tyles[11] = new Tyle("green");
    tyles[12] = new Tyle("green");
    tyles[13] = new Tyle("green");
    tyles[14] = new Tyle("red");
    tyles[15] = new Tyle("green");
    const board = new Board(height, width, tyles);
    const cells = board.getCells();

    const location = new BaseCell(2, 1, new Tyle("red"));
    const group = GroupFinder.getGroup(cells, location);
    expect(group.findIndex(isInGroup(new BaseCell(1, 1)))).not.toBe(-1);
    expect(group.findIndex(isInGroup(new BaseCell(2, 1)))).not.toBe(-1);
    expect(group.findIndex(isInGroup(new BaseCell(2, 2)))).not.toBe(-1);
    expect(group.findIndex(isInGroup(new BaseCell(3, 2)))).not.toBe(-1);
});

test("groupsLeft", () => {
    const tyles = [
        new Tyle("red"),
        new Tyle("blue"),
        new Tyle("green"),
        new Tyle("blue"),
        new Tyle("green"),
        new Tyle("red"),
        new Tyle("red"),
        new Tyle("blue"),
        new Tyle("green")
    ];
    const emtpyBoard = new Board(3, 3, tyles);
    expect(GroupFinder.groupsLeft(emtpyBoard.getCells())).toBe(false);

    const tylesWithGroup = [
        new Tyle("red"),
        new Tyle("green"),
        new Tyle("red"),
        new Tyle("red"),
        new Tyle("green"),
        new Tyle("red"),
        new Tyle("blue"),
        new Tyle("blue"),
        new Tyle("blue")
    ]
    const boardWithGroup = new Board(3, 3, tylesWithGroup);
    expect(GroupFinder.groupsLeft(boardWithGroup.getCells())).toBe(true);
});