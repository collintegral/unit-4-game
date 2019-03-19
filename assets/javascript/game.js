var defaultTriceratops = {
        imagelink: "../images/triceratops.png",
        hp: 140,
        atk: 8,
        defatk: 8,
        alive: true,
        object: $("<img class='dinopic' id='triceratops' src='assets/images/triceratops.png'>"),
    }
    defaultStegosaurus = {
        imagelink: "../images/stegosaurus.png",
        hp: 200,
        atk: 4,
        defatk: 6,
        alive: true,
        object: $("<img class='dinopic' id='stegosaurus' src='assets/images/stegosaurus.png'>"),
    }
    defaultAnklyosaurus = {
        imagelink: "../images/anklyosaurus.png",
        hp: 150,
        atk: 6,
        defatk: 9,
        alive: true,
        object: $("<img class='dinopic id='anklyosaurus' src='assets/images/anklyosaurus.png'>"),
    }
    defaultScelidosaurus = {
        imagelink: "../images/scelidosaurus.png",
        hp: 100,
        atk: 10,
        defatk: 10,
        alive: true,
        object: $("<img class='dinopic' id='scelidosaurus' src='assets/images/scelidosaurus.png'>"),
    }
    defaultTrex = {
        imagelink: "../images/trex.png",
        hp: 200,
        atk: 10,
        defatk: 10,
        alive: true,
        object: $("<img class='dinopic' id='trex' src='assets/images/trex.png'>"),
    }

//The above stores the dinos' base values. The below makes the more dynamic objects.
var triceratops = defaultTriceratops,
    stegosaurus = defaultStegosaurus,
    anklyosaurus = defaultAnklyosaurus,
    scelidosaurus = defaultScelidosaurus,
    trex = defaultTrex;
var mainDinos = [triceratops, stegosaurus, anklyosaurus, scelidosaurus];
//For noting which dino the player picks or doesn't, as well as their current opponent's index within enemyDinos.
var playerDino = "", enemyDinos = [], targetDino = "", targetDinoIndex = 0, enemyCount = 3;

//In case this gets too cringy later, this lets me find it to change it easier.
var title = "DinoWars";

//In case I want to change the length of the message timer for wins and losses. In seconds.
var timeSet = 6;

//The various possible texts of the Instructions section.
var intro = "Strengthen your dinosaur by fighting others; watch your health! Press Start to begin.";
var playerSelection = "Select your fighter!";
var enemySelection = "Select your opponent!";
var fightTime = "Defeat your opponent!";
var trexAttack = "The scent of battle has attracted a mighty foe. Prove your strength!";
var endGame = "Press Retry to attempt another round with your current dinosaur, or Restart to choose a different dino.";
var enemyDefeated = "Your opponent has fallen. Congratulations!";
var playerLoss = "You have fallen. Your fossil will last for millenia.";
var playerVictory = "All opponents fall before you. The food chain is yours to command!";

//Pre-existing html elements.
var topbar = $("#topbar");
var instructions = $("#instructions");
var gameboard = $("#gameboard");
var botbar = $("#botbar");

//Will we be adding music? Who knows?
var jparktheme = $("#jparktheme");

//The various elements of the board for dynamic adding and removing.
var trexPicBox = $("<div class='col-md-4'>");
trexPicBox.append(trex.object);
var titleBox = $("<div class='col-md-8'>");
var titleHeader = $("<h1>");
titleBox.append(titleHeader.text(title));

//An array for columns holding all dinos evenly on the gameboard.
var dinoSelect1 = $("<div class='col-md-3'>"),
    dinoSelect2 = $("<div class='col-md-3'>"),
    dinoSelect3 = $("<div class='col-md-3'>"),
    dinoSelect4 = $("<div class='col-md-3'>");
var dinoSelect = [dinoSelect1, dinoSelect2, dinoSelect3, dinoSelect4];

//An array for divs to hold the enemy dinos, once those have been determined.
var dinoEnemy1 = $("<div class='enemy-dino'>"),
    dinoEnemy2 = $("<div class='enemy-dino'>"),
    dinoEnemy3 = $("<div class='enemy-dino'>");
var dinoEnemies = [dinoEnemy1, dinoEnemy2, dinoEnemy3];

//An array for columns holding only the dinos in combat
var fightDino1 = $("<div class='col-md-6'>"),
    fightDino2 = $("<div class='col-md-6'>");
var fightDinos = [fightDino1, fightDino2];

//A single column for when the gameboard holds only one element.
var soloDino = $("<div class='col-md-12'>");

//The possible buttons appearing in the botbar.
var startBtn = $("<button type='button' class='btn btn-dark'>");
startBtn.text("Start").click(gotoPlayerChoice());

var confirmBtn = $("<button type='button' class='btn btn-dark'>");
confirmBtn.text("Confirm Dino").click(playerSelect(), gotoEnemyChoice());

var attackBtn = $("<button type='button' class='btn btn-dark'>");
attackBtn.text("Attack!").click(attack());

var retryBtn = $("<button type='button' class='btn btn-dark'>");
retryBtn.text("Retry").click(retry(), gotoEnemyChoice());

var fullRestartBtn = $("<button type='button' class='btn btn-dark'>");
fullRestartBtn.text("Restart").click(fullRestart(), gotoPlayerChoice());

for (var i = 0; i < dinoSelect.length; i++) {
    dinoSelect[i].append(mainDinos[i].object).click(playerDino = mainDinos[i]);
};

//The various functions that handle the background logic.
//The player attacks.
function attack() {
    //Injure the enemy and improve your attack.
    targetDino.hp -= targetDino.atk;
    playerDino.atk += playerDino.atk;

    //Defeat the enemy or take counter damage and possibly die.
    if (targetDino.hp <= 0) {
        targetDino.alive = false;

        //If the boss fight was won, go to the winscreen instead of the normal victory screen.
        if (targetDino === trex) {
            gotoWin();
        }
        // Otherwise just run the normal victory screen.
        opponentDefeated();
    }
    else {
        playerDino.hp -= playerDino.defatk;

        if (playerDino.hp <= 0) {
            playerDino.alive = false;
            playerDefeated();
        }
    }
}

//The timer for the messages declaring losses and victories.
function timeMessages(destination) {
    setTimeout(destination, 1000 * timeSet);
}

//The function processing which dino the player selects as their character.
function playerSelect() {
    for (var i = 0; i < mainDinos.length; i++) {
        if (mainDinos[i] != playerDino) {
                enemyDinos.push(mainDinos[i]);
                console.log(enemyDinos);
        }
    }

    for (var i = 0; i < enemyDinos.length; i++) {
        let index = i;
        let enemyItem = enemyDinos[index];
        let enemyBlock = dinoEnemies[index];
        console.log(index + " " + enemyItem + " " + enemyBlock)
        enemyBlock.click(enemySelect(enemyItem, index))
        enemyItem.object.appendTo();
    }

    gotoEnemyChoice();
}

//The function processing which dino to have the player fight.
function enemySelect(selection, index) {
    targetDino = selection;
    targetDinoIndex = index;
    gotoFight();
}

//The function for retrying -- does not clear currently selected playerDino.
function retry() {
    //Reset all dinos to default values.
    triceratops = defaultTriceratops;
    stegosaurus = defaultStegosaurus;
    anklyosaurus = defaultAnklyosaurus;
    scelidosaurus = defaultScelidosaurus;
    trex = defaultTrex;
    enemyCount = 3;
    dinoEnemies.forEach(function(entry) {entry.show()});
}

//The function for reseting all variables, including current dino.
function fullRestart() {
    retry();
    playerDino = null;
    enemyDinos = null;
    targetDino = null;
    targetDinoIndex = null;
}


//The various functions whose purpose is to alter the screen's contents as the game progresses.
//The opening screen.
function gotoIntro() {
    //Construct the basic topbar. This will only need to change in a few situations.
    topbar.empty().append(trexPicBox).append(titleBox);

    //Change the instructions to introductions.
    instructions.text(intro);

    //Make sure the gameboard is empty.
    gameboard.empty();

    //Set the botbar to hold the Start button.
    botbar.empty().append(startBtn);
}

//Choose your dino.
function gotoPlayerChoice() {
 //instructions change to playerSelection.
    instructions.text(playerSelection);

    //Gameboard holds each dino 'character' evenly.
    gameboard.empty();

    dinoSelect.forEach(function(entry) {
        gameboard.append(entry);
    });

    //Botbar is empty.
    botbar.empty();
}

//Choose your target.
function gotoEnemyChoice() {
    //Instructions change to enemySelection.
    instructions.text(enemySelection);

    //Gameboard shows the player on the left, and the enemies (up to 3) on the right.
    gameboard.empty().append(fightDino1, fightDino2);
    fightDino1.append(playerDino.object);
    dinoEnemies.forEach(function(entry) {fightDino2.append(entry)});

    //Botbar is empty.
    botbar.empty();
}

//Combat ensues.
function gotoFight() {
    //Instructions change to fightTime.
    instructions.text(fightTime);

    //Gameboard shows the player on the left and the enemy on the right evenly.
    gameboard.empty().append(fightDino1, fightDino2.empty());
    fightDino2.append(targetDino.object);
    //Botbar holds the attack button.
    botbar.empty().append(attackBtn);
}

//After defeating all opponents, the player fights the T-Rex from the title banner. The player cannot lose this fight.
function gotoBoss() {
    //The T-Rex in the topbar now disappears.
    topbar.empty().append(titleBox);

    //The instructions inform the player what's happening.
    instructions.text(trexAttack);
    
    //The gameboard shows the player on the left and the T-Rex on the right.
    gameboard.empty().append(fightDino1, fightDino2.empty());
    fightDino2.append(trex.object);

    trex = targetDino;
    //The botbar shows the Attack button.
    botbar.empty().append(attackBtn);
}

//Player victory over an opponent.
function opponentDefeated() {
    //A brief message congratulates the player before moving back to Enemy Selection.
    instructions.text(enemyDefeated);

    //Botbar button disappears to stop extra attacks.
    botbar.empty();

    //Hide the defeated dino, wait a time, then continue on.
    if (enemyCount > 0){
        enemyCount--;
        dinoEnemies[targetDinoIndex].hide();
        timeMessages(gotoEnemyChoice);
    }
    else {
        timeMessages(gotoBoss);
    }
}

//Player loss.
function playerDefeated() {
    //A brief message consoles the player before moving to gotoEnd.
    instructions.text(playerLoss);

    //Botbar button disappears to stop extra attacks.
    botbar.empty();

    //Wait a time, then continue on.
    timeMessages(gotoEnd);
}

//Player victory over all opponents.
function gotoWin() {
    //A brief message congratulates the player on the right side before moving to gotoEnd.
    instructions.text(playerVictory);

    //Botbar button disappears to stop extra attacks.
    botbar.empty();

    //Wait a time, then continue on.
    timeMessages(gotoEnd);
}

//Decide whether to play again.
function gotoEnd() {
    //Topbar regains its T-Rex if needed.
    topbar.empty().append(trexPicBox, titleBox);

    //Instructions change to EndGame.
    instructions.text(endGame);

    //Gameboard remains on the last shown screen to let the player see what happened. No change.

    //Botbar changes to the Retry and Restart buttons.
    botbar.empty().append(retryBtn, fullRestartBtn);
}

gotoIntro();