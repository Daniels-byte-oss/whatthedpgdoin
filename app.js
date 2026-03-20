/** * Селекторы элементов DOM 
 */
/** @type {NodeListOf<Element>} Список всех игровых ячеек (кнопок) */
let boxes = document.querySelectorAll(".box");
/** @type {Element} Кнопка сброса текущей игры */
let resetBtn = document.querySelector("#reset-btn");
/** @type {Element} Кнопка начала новой игры после завершения */
let newGameButton = document.querySelector("#new-btn");
/** @type {Element} Контейнер для вывода сообщения о результате */
let msgContainer = document.querySelector(".msg-container");
/** @type {Element} Основной контейнер с игровым полем */
let container = document.querySelector(".container");
/** @type {Element} Текстовое поле для вывода победителя или ничьей */
let msg = document.querySelector("#msg");

/** @type {number} Счетчик ходов для определения ничьей */
let count = 0;
/** @type {boolean} Очередность хода: true для "O", false для "X" */
let turnO = true;

/** * Массив выигрышных комбинаций (индексы ячеек)
 * @type {Array<Array<number>>} 
 */
const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [3, 4, 5], [6, 7, 8], [1, 4, 7],
    [2, 5, 8], [2, 4, 6]
];

/**
 * Сбрасывает состояние игры до начального.
 * Очищает поле, сбрасывает счетчик и переключает ход на игрока "O".
 */
const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    container.classList.remove("hide");
}

/**
 * Основной обработчик событий клика по ячейкам.
 * Устанавливает символ игрока, проверяет условия победы или ничьей.
 */
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        // Если уже есть победитель или достигнут лимит ходов — выходим
        if (count === 9 || checkWinner()) {
            return;
        }

        if (turnO) {
            // Ход игрока O
            box.innerText = "O";
            box.style.color = "white";
            turnO = false;
        } else {
            // Ход игрока X
            box.innerText = "X";
            box.style.color = "cyan";
            turnO = true;
        }

        box.disabled = true; // Блокируем нажатую ячейку
        count++;

        let isWinner = checkWinner();

        // Проверка на ничью (если 9 ходов и победителя нет)
        if (count === 9 && !isWinner) {
            drawGame();
        }
    });
});

/**
 * Блокирует все ячейки игрового поля.
 */
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

/**
 * Разблокирует все ячейки и очищает их содержимое.
 */
const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}

/**
 * Отображает экран с поздравлением победителя.
 * @param {string} winner - Символ победившего игрока ("X" или "O").
 */
const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    container.classList.add("hide");
    
    // Примечание: переменные hideDisplay и hide2 должны быть определены глобально, 
    // если они используются. В данном коде они отсутствуют выше.
    if (typeof hideDisplay !== 'undefined' && hideDisplay == "inline") {
        hide2.style.display = "none";
    }
    disableBoxes();
}

/**
 * Обрабатывает ситуацию ничьей.
 */
const drawGame = () => {
    if (!checkWinner()) {
        msg.innerText = "This Game is a Draw.";
        msgContainer.classList.remove("hide");
        container.classList.add("hide");
        disableBoxes();
    }
}

/**
 * Проверяет текущее состояние поля на соответствие выигрышным паттернам.
 * @returns {boolean} True, если найден победитель, иначе false.
 */
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        // Проверяем, что ячейки не пусты и их значения совпадают
        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                console.log("winner is ", pos1Val);
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

// Привязка событий к кнопкам сброса
newGameButton.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
