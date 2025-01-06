const table = document.querySelector('table');
for (let i = 0; i < 11; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 11; j++) {
        const cell = document.createElement('td');
        row.appendChild(cell);
    }
    table.appendChild(row);
}

function setValue(i, j, value) {
    const cell = table.rows[i].cells[j];
    cell.textContent = value;
}

function getValue(i, j) {
    const cell = table.rows[i].cells[j];
    return cell.textContent;
}

function setColor(i, j, color) {
    const cell = table.rows[i].cells[j];
    cell.style.backgroundColor = color;
}

function getColor(i, j) {
    const cell = table.rows[i].cells[j];
    return cell.style.backgroundColor;
}

function setListeners() {
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            table.rows[i].cells[j].addEventListener('click', function() {
                clickedOnCell(i, j);
            });
        }
    }
}

function clickedOnCell(i, j) {
    if (isWithinLimits(i, j) && (isEmpty(i, j) || parseInt(getValue(i, j)) < currentCard.value)) {
        setValue(i, j, currentCard.value);
        setColor(i, j, currentCard.color);
        if (hasWin(currentCard.color)) {
            alert(`${currentCard.color} wins!`);
            resetGame();
        } else {
            nextTurn();
        }
    } else {
        alert("Invalid move!");
    }
}

function isEmpty(i, j) {
    return getValue(i, j) === '';
}

function isCorrectAdjacency(i, j) {
    if (isEmpty(i, j)) return false;

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    for (const [di, dj] of directions) {
        const ni = i + di;
        const nj = j + dj;
        if (ni >= 0 && ni < 11 && nj >= 0 && nj < 11 && !isEmpty(ni, nj)) {
            return true;
        }
    }
    return false;
}

const redList = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
const greenList = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
const yellowList = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
const blueList = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];

const players = [
    { color: 'red', list: redList },
    { color: 'green', list: greenList },
    { color: 'yellow', list: yellowList },
    { color: 'blue', list: blueList }
];

let currentPlayerIndex = 0;
let currentCard = {};

function getAndRemoveRandomCard(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list.splice(randomIndex, 1)[0];
}

function hasWin(color) {
    const table = document.querySelector('table');
    const rows = table.rows.length;
    const cols = table.rows[0].cells.length;

    // Check horizontal and vertical
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (checkDirection(i, j, 0, 1, color) || checkDirection(i, j, 1, 0, color)) {
                return true;
            }
        }
    }

    // Check diagonal
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (checkDirection(i, j, 1, 1, color) || checkDirection(i, j, 1, -1, color)) {
                return true;
            }
        }
    }

    return false;
}

function checkDirection(i, j, di, dj, color) {
    const table = document.querySelector('table');
    let count = 0;

    for (let k = 0; k < 4; k++) {
        const ni = i + k * di;
        const nj = j + k * dj;

        if (ni >= 0 && ni < table.rows.length && nj >= 0 && nj < table.rows[0].cells.length) {
            if (getColor(ni, nj) === color) {
                count++;
            } else {
                break;
            }
        } else {
            break;
        }
    }

    return count === 4;
}

function isWithinLimits(i, j) {
    if (i < 0 || i >= 11 || j < 0 || j >= 11) {
        return false;
    }

    let minRow = 11, maxRow = -1, minCol = 11, maxCol = -1;

    for (let row = 0; row < 11; row++) {
        for (let col = 0; col < 11; col++) {
            if (!isEmpty(row, col)) {
                if (row < minRow) minRow = row;
                if (row > maxRow) maxRow = row;
                if (col < minCol) minCol = col;
                if (col > maxCol) maxCol = col;
            }
        }
    }

    const height = maxRow - minRow + 1;
    const width = maxCol - minCol + 1;

    return (i >= minRow - 1 && i <= maxRow + 1 && j >= minCol - 1 && j <= maxCol + 1) &&
           (height <= 6 && width <= 6);
}

function nextTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    drawCard();
}

function drawCard() {
    const player = players[currentPlayerIndex];
    const value = getAndRemoveRandomCard(player.list);
    currentCard = { color: player.color, value: value };
    document.getElementById('current-card').textContent = `${player.color} ${value}`;
}

function resetGame() {
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            setValue(i, j, '');
            setColor(i, j, '');
        }
    }
    players.forEach(player => {
        player.list = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
    });
    currentPlayerIndex = 0;
    drawCard();
}

function startGame() {
    const player = players[currentPlayerIndex];
    const value = getAndRemoveRandomCard(player.list);
    currentCard = { color: player.color, value: value };
    setValue(5, 5, value);
    setColor(5, 5, player.color);
    document.getElementById('current-card').textContent = `${player.color} ${value}`;
    document.getElementById('start-game').style.display = 'none';
    document.getElementById('place-card').style.display = 'block';
    nextTurn();
}

document.getElementById('start-game').addEventListener('click', startGame);

document.getElementById('place-card').addEventListener('click', function() {
    alert('Click on a cell to place the card.');
});

document.addEventListener('DOMContentLoaded', function() {
    setListeners();
});