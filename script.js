let main = document.createElement("div");
main.id = "main";
document.body.append(main);

let form = document.createElement("form");
const heightParagraph = document.createElement("p");
let heightText = document.createTextNode("Height: ");
let heightInput = document.createElement("input");
heightInput.id = "height";
heightParagraph.append(heightText, heightInput);
const widthParagraph = document.createElement("p");
let widthText = document.createTextNode("Width: ");
let widthInput = document.createElement("input");
widthInput.id = "width";
widthParagraph.append(widthText, widthInput);
const minesParagraph = document.createElement("p");
let minesText = document.createTextNode("Mines: ");
let minesInput = document.createElement("input");
minesInput.id = "mines";
minesParagraph.append(minesText, minesInput);
const submitParagraph = document.createElement("p");
let submitButton = document.createElement("button");
submitButton.type = "button";
submitButton.innerText = "Generuj";
submitParagraph.append(submitButton);

form.append(heightParagraph, widthParagraph, minesParagraph, submitParagraph);

main.append(form);

let height, width, mines, minesLeft, minesStart;
let area;
let mined = false;
let rpmWarning = false, dataWarning = false, minesWarning = false, zeroWarning = false, nanWarning = false;

let plansza = [];

let table = document.createElement("table");

const timer = document.createElement("p");
timer.id = "bombsLeft";
let time = 0;
timer.innerText = "Grasz: " + time + " [s]";

let timeInterval;

form.addEventListener("input", function () {
    if (!isNaN(heightInput.value)) heightTxt = heightInput.value;
    if (!isNaN(widthInput.value)) widthTxt = widthInput.value;
    if (!isNaN(minesInput.value)) minesTxt = minesInput.value;
    setTimeout(function () {
        if (isNaN(heightInput.value)) heightInput.value = "";
        if (isNaN(widthInput.value)) widthInput.value = "";
        if (isNaN(minesInput.value)) minesInput.value = "";
    }, 1000);
})

function init() {
    if (!isNaN(heightInput.value)
        && !isNaN(widthInput.value)
        && !isNaN(minesInput.value)) {

        heightTxt = heightInput.value;
        widthTxt = widthInput.value;
        minesTxt = minesInput.value;

        height = parseInt(heightTxt);
        width = parseInt(widthTxt);
        area = height * width;
        mines = parseInt(minesTxt);
        minesLeft = mines;
        minesStart = mines;

        if (heightTxt == "" || widthTxt == "" || minesTxt == "") {
            if (!dataWarning) {
                let messageDiv = document.createElement("div");
                let message = document.createTextNode("Wpisz wszystkie dane!")
                messageDiv.classList.add("warning");
                messageDiv.append(message);
                main.append(messageDiv);
                dataWarning = !dataWarning;
            }
        } else {
            if (height <= 0 || width <= 0 || mines <= 0) {
                if (!zeroWarning) {
                    let messageDiv = document.createElement("div");
                    let message = document.createTextNode("Każda z wartości musi być większa od 0");
                    messageDiv.classList.add("warning");
                    messageDiv.append(message);
                    main.append(messageDiv);
                    zeroWarning = !zeroWarning;
                }
            } else {
                if (mines >= area) {
                    if (!minesWarning) {
                        let messageDiv = document.createElement("div");
                        let message = document.createTextNode("Za dużo min!");
                        messageDiv.classList.add("warning");
                        messageDiv.append(message);
                        main.append(messageDiv);
                        minesWarning = !minesWarning;
                    }
                } else {
                    const bombsLeftText = document.createElement("p");
                    bombsLeftText.id = "bombsLeft";
                    bombsLeftText.innerText = "Pozostało bomb: " + mines;
                    main.append(bombsLeftText);

                    main.append(timer);

                    timeInterval = setInterval(function () {
                        time++;
                        timer.innerText = "Grasz: " + time + " [s]";
                    }, 1000);

                    plansza.length = height;
                    for (let i = 0; i < height; i++) {
                        plansza[i] = [];
                        plansza[i].length = width;
                        for (let j = 0; j < width; j++) {
                            plansza[i][j] = {
                                value: 0,
                                around: 0,
                                element: null,
                                status: 0,
                                visible: false
                            };
                        }
                    }

                    for (let i = 0; i < height; i++) {
                        let line = document.createElement("tr");
                        for (let j = 0; j < width; j++) {
                            let cell = document.createElement("td")
                            cell.addEventListener("click", gamble);
                            cell.addEventListener("contextmenu", rightClick);
                            let img = document.createElement("img");
                            img.src = "img/klepa.png";
                            cell.append(img);
                            line.append(cell);

                            plansza[i][j].element = cell;
                        }
                        table.append(line);
                    }
                    console.table(plansza);
                    main.append(table);
                    submitButton.removeEventListener("click", init);
                }
            }
        }
    } else {
        alert("Podane dane muszą być liczbami!");
    }
}

function invokeCookie() {
    let mode = [height, width, minesStart];
    let nickInputDOM = document.getElementById("nick");
    let nick = nickInputDOM.value;
    addCookie(mode, nick);
}

function addCookie(mode, nick) {
    const daysToExpire = new Date(2147483647 * 1000).toUTCString();

    let encodedNick = encodeURIComponent(nick);

    if (document.cookie != "") {
        let newData = `${document.cookie.substring(6)}|${mode}?${encodedNick}?${time}`;
        document.cookie = `wpisy=${newData};expires=${daysToExpire}`;
    } else {
        document.cookie = `wpisy=${mode}?${encodedNick}?${time};expires=${daysToExpire}`;
    }

    let entries = document.cookie.split("=")[1].split("|");
    let data = [];

    for (let i = 0; i < entries.length; i++) {
        splittedEntry = entries[i].split("?");
        splittedEntry[1] = decodeURIComponent(splittedEntry[1]);
        let validTime = "";
        let minutes = Math.floor(splittedEntry[2] / 60);
        let seconds = splittedEntry[2] - minutes * 60;

        if (minutes == 0) {
            validTime = "00:";
        } else if (minutes < 10) {
            validTime = "0" + minutes + ":";
        } else {
            validTime = minutes + ":";
        }

        if (seconds == 0) {
            validTime += "00";
        } else if (seconds < 10) {
            validTime += "0" + seconds;
        } else {
            validTime += seconds;
        }

        function arrayToString(array) {
            array = array.split(",");
            let text = array[0];
            for (let i = 1; i < array.length; i++) {
                text += "|" + array[i];
            }
            return text;
        }

        obj = [
            splittedEntry[0],
            splittedEntry[1],
            validTime,
            splittedEntry[2]
        ]
        data.push(obj);
    }

    let modes = [];

    for (let i = 0; i < data.length; i++) {
        if (!modes.includes(data[i][0])) {
            modes.push(data[i][0]);
        }
    }

    let modesData = [];

    for (let i = 0; i < modes.length; i++) {
        let temp = [];
        for (let j = 0; j < data.length; j++) {
            if (modes[i] == data[j][0]) temp.push(data[j]);
        }
        modesData.push(temp);
    }

    let userModes = [];

    for (let i = 0; i < modesData.length; i++) {
        for (let j = 0; j < modesData[i].length; j++) {
            if (modesData[i][j][1] == nick) {
                userModes.push(modesData[i]);
                break;
            }
        }
    }

    for (let i = 0; i < userModes.length; i++) {
        for (let k = 0; k < userModes[i].length; k++) {
            for (let j = 0; j < userModes[i].length - 1; j++) {
                if (parseInt(userModes[i][j][3]) > parseInt(userModes[i][j + 1][3])) {
                    let temp = userModes[i][j];
                    userModes[i][j] = userModes[i][j + 1];
                    userModes[i][j + 1] = temp;
                    let tab = userModes;
                }
            }
        }
    }

    for (let i = 0; i < userModes.length; i++) {
        const leaderboard = document.createElement("table");
        leaderboard.id = `scores${i}`;
        leaderboard.classList.add("table");
        const header = document.createElement("tr");
        const th1 = document.createElement("th");
        const th1Text = document.createTextNode("tryb");
        th1.append(th1Text);
        const th2 = document.createElement("th");
        const th2Text = document.createTextNode("nick");
        th2.append(th2Text);
        const th3 = document.createElement("th");
        const th3Text = document.createTextNode("czas");
        th3.append(th3Text);
        header.append(th1, th2, th3);
        leaderboard.append(header);

        let len = 10;

        if (userModes[i].length < 10) len = userModes[i].length;

        for (let k = 0; k < len; k++) {
            const row = document.createElement("tr");
            for (let j = 0; j < userModes[i][k].length - 1; j++) {
                const cell = document.createElement("td");
                cell.innerText = userModes[i][k][j];
                row.append(cell);
            }
            leaderboard.append(row);
        }
        main.append(leaderboard);
    }

    const button = document.getElementById("cookie");
    button.removeEventListener("click", invokeCookie);
}

function neighbourZeros(posY, posX) {
    if (!plansza[posY][posX].visible) {
        plansza[posY][posX].visible = !plansza[posY][posX].visible;
        area--;
        plansza[posY][posX].element.removeEventListener("click", gamble);
        plansza[posY][posX].element.removeEventListener("contextmenu", rightClick);
        plansza[posY][posX].element.addEventListener("contextmenu", rpm);
        plansza[posY][posX].element.innerHTML = plansza[posY][posX].around;
    }
    if (plansza[posY][posX].around == 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;
                if ((posY + i < height && posY + i > -1) &&
                    (posX + j < width && posX + j > -1)) {
                    if (!plansza[posY + i][posX + j].visible) {
                        plansza[posY + i][posX + j].visible = !plansza[posY + i][posX + j].visible;
                        area--;
                        plansza[posY + i][posX + j].element.removeEventListener("click", gamble);
                        plansza[posY + i][posX + j].element.removeEventListener("contextmenu", rightClick);
                        plansza[posY + i][posX + j].element.addEventListener("contextmenu", rpm);
                        plansza[posY + i][posX + j].element.innerHTML = plansza[posY + i][posX + j].around;
                        const newY = posY + i;
                        const newX = posX + j;
                        if (plansza[posY + i][posX + j].around == 0) neighbourZeros(newY, newX);
                    }
                }
            }
        }
    }
}

// lewy klik
function gamble() {
    let posX = 0;
    let posY = 0;
    let clickedOnBoard = null;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (plansza[i][j].element == this) {
                posX = j;
                posY = i;
                break;
            }
        }
    }

    clickedOnBoard = plansza[posY][posX];

    if (mines > 0) {
        while (mines > 0) {
            let y = Math.floor(Math.random() * height);
            let x = Math.floor(Math.random() * width);

            if ((plansza[y][x].value == 0) &&
                (posX != x || posY != y)) {
                // (posX != x && posY != y)) {

                plansza[y][x].value = -1;

                mines--;

                // obliczanie liczby min
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i == 0 && j == 0) continue;
                        if ((y + i < height && y + i > -1) &&
                            (x + j < width && x + j > -1)) {
                            plansza[y + i][x + j].around++;
                        }
                    }
                }
            }
        }
        console.table(plansza);
    }
    if (clickedOnBoard.value == -1) {
        clearInterval(timeInterval);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                plansza[i][j].element.removeEventListener("click", gamble);
                plansza[i][j].element.removeEventListener("contextmenu", rightClick);
                plansza[i][j].element.addEventListener("contextmenu", rpm);
                if (plansza[i][j].value == -1) {
                    let img1 = document.createElement("img");
                    img1.src = "img/pbomb.png";
                    while (plansza[i][j].element.firstElementChild) {
                        plansza[i][j].element.firstElementChild.remove();
                    }
                    plansza[i][j].element.append(img1);
                }
            }
        }

        let img = document.createElement("img");
        img.src = "img/bomb.png";
        while (clickedOnBoard.element.firstElementChild) {
            clickedOnBoard.element.firstElementChild.remove();
        }
        clickedOnBoard.element.append(img);

        let messageDiv = document.createElement("div");
        let message = document.createTextNode("Przegrałeś!");
        messageDiv.classList.add("lose");
        messageDiv.append(message);
        main.append(messageDiv);
    } else {
        neighbourZeros(posY, posX);

        if (area == minesStart) {
            clearInterval(timeInterval);
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    plansza[i][j].element.removeEventListener("click", gamble);
                    plansza[i][j].element.removeEventListener("contextmenu", rightClick);
                    plansza[i][j].element.addEventListener("contextmenu", rpm);
                    if (plansza[i][j].value == -1) {
                        let img1 = document.createElement("img");
                        img1.src = "img/flaga.png";
                        while (plansza[i][j].element.firstElementChild) {
                            plansza[i][j].element.firstElementChild.remove();
                        }
                        plansza[i][j].element.append(img1);
                    }
                }
            }
            let currentState = document.getElementById("bombsLeft");
            currentState.innerText = "Pozostało bomb: 0";
            let messageDiv = document.createElement("div");
            let message = document.createTextNode("Wygrałeś!")
            messageDiv.classList.add("win");
            messageDiv.append(message);
            const nickParagraph = document.createElement("p");
            let nickText = document.createTextNode("Podaj nick: ");
            let nickInput = document.createElement("input");
            nickInput.id = "nick";
            nickParagraph.append(nickText, nickInput);
            let cookieButton = document.createElement("button");
            cookieButton.id = "cookie";
            cookieButton.type = "button";
            cookieButton.innerText = "Dodaj do rankingu";
            main.append(messageDiv, nickParagraph, cookieButton);

            cookieButton.addEventListener("click", invokeCookie);
        }
    }

    mined = true;
}

function rightClick(e) {
    e.preventDefault();

    let posX = 0;
    let posY = 0;
    let clickedOnBoard = null;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (plansza[i][j].element == this) {
                posX = j;
                posY = i;
                break;
            }
        }
    }

    if (mined) {
        clickedOnBoard = plansza[posY][posX];

        let previousStatus = 0;
        previousStatus = clickedOnBoard.status;

        if (previousStatus == 1) minesLeft++;

        clickedOnBoard.status++;

        if (clickedOnBoard.status > 2) {
            clickedOnBoard.status = 0;

            let img = document.createElement("img");
            img.src = "img/klepa.png";

            while (clickedOnBoard.element.firstElementChild) {
                clickedOnBoard.element.firstElementChild.remove();
            }
            clickedOnBoard.element.append(img);
        } else if (clickedOnBoard.status == 1) {
            minesLeft--;
            let img = document.createElement("img");
            img.src = "img/flaga.png";

            while (clickedOnBoard.element.firstElementChild) {
                clickedOnBoard.element.firstElementChild.remove();
            }
            clickedOnBoard.element.append(img);
        }
        else if (clickedOnBoard.status == 2) {
            let img = document.createElement("img");
            img.src = "img/pyt.png";

            while (clickedOnBoard.element.firstElementChild) {
                clickedOnBoard.element.firstElementChild.remove();
            }
            clickedOnBoard.element.append(img);
        }

        let currentState = document.getElementById("bombsLeft");
        currentState.innerText = "Pozostało bomb: " + minesLeft;
    } else {
        if (!rpmWarning) {
            let messageDiv = document.createElement("div");
            let message = document.createTextNode("Najpierw odkryj pole!")
            messageDiv.classList.add("warning");
            messageDiv.append(message);
            main.append(messageDiv);
            rpmWarning = !rpmWarning;
        }
    }
}

function rpm(e) {
    e.preventDefault();
}

submitButton.addEventListener("click", init);