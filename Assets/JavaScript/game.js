//list the character list object array
var characterList = [
  {
    name: "Jango Fett",
    health: 170,
    attack: 6,
    counter: 15,
    defaultAttack: 8,
    pic: "Assets/Media/Kenobi.jpg"
  },
  {
    name: "Mace Windu",
    health: 155,
    attack: 5,
    counter: 20,
    defaultAttack: 7,
    pic: "Assets/Media/maceWindu.jpeg"
  },
  {
    name: "Plo Koon",
    health: 160,
    attack: 7,
    counter: 10,
    defaultAttack: 5,
    pic: "Assets/Media/ploKoon.jpg"
  },
  {
    name: "General Grievous",
    health: 165,
    attack: 6,
    counter: 20,
    defaultAttack: 3,
    pic: "Assets/Media/Grievous.jpg"
  },
  {
    name: "Darth Maul",
    health: 195,
    attack: 6,
    counter: 15,
    defaultAttack: 8,
    pic: "Assets/Media/darthMaul.jpg"
  },
  {
    name: "Darth Revan",
    health: 190,
    attack: 8,
    counter: 25,
    defaultAttack: 10,
    pic: "Assets/Media/darthRevan.jpg"
  }
];

console.log(characterList);

//Global variables: character arrays, selected character, game running var
var gameRunning = false;
var fighterList = [];
var player = {};
var computer = {};
var playerPicked = false;
var computerPicked = false;
var newGameButton;
var intervalId;

//new game function
function newGame() {
  fighterList = [...characterList];
  console.log(characterList);
  player = {};
  computer = {}; 
  gameRunning = true;
  playerPicked = false;
  computerPicked = false;
  clearInterval(intervalId);
  $("#character-grid").hide();
  printCharacters(fighterList);
}

//list of fighters

function printCharacters(characterArray) {
  $("#character-list").empty();
  if (characterArray.length === 0) {
    $("#character-list").text("No characters left!");
    return false;
  }
  characterArray.forEach(function(characterInfo, i) {
    //character div
    var character = $("<div class='character'>");
    character
      .css({
        "background-image": "url(" + characterInfo.pic + ")"
      })
      .attr({ "data-id": i });
    var charStats = $("<div>");
    charStats
      .addClass("character-stats")
      .html(
        `<h3>${characterInfo.name}</h3>HP: ${
          characterInfo.health
        } <br/>Attack: ${characterInfo.attack}<br/>Counter: ${
          characterInfo.counter
        }`
      )
      .appendTo(character);

    $("#character-list").append(character);
  });
}

//send chosen player to the active player column in html
function activatePlayer(playerInfo, playerPosition, playerStats, playerTitle) {
  console.log(playerInfo, playerPosition);

  $(playerPosition).css({
    "background-image": "url(" + playerInfo.pic + ")"
  });

  $(playerStats)
    .html(
      `<h5>${playerInfo.name} - ${playerTitle}</h5>HP: ${
        playerInfo.health
      } <br/>Attack: ${playerInfo.attack} <br/>Counter: ${playerInfo.counter}`
    )
    .removeClass("defeated");
}

//Choose Fighter
$(document).on("click", ".character", function() {
  //get character id so we can pull it out of gameRoster array by it's index
  var playerID = $(this).attr("data-id");

  if (!playerPicked && gameRunning) {
    playerPicked = true;
    player = {
      ...characterList[playerID]
    };
    $("#character-grid").show();
    characterList.splice(playerID, 1);
    printCharacters(characterList);
    activatePlayer(player, "#player", "#player-stats", "Attacker");
  } else if (!computerPicked && gameRunning) {
    computerPicked = true;
    computer = {
      ...characterList[playerID]
    };
    $("#character-grid").show();
    characterList.splice(playerID, 1);
    printCharacters(characterList);
    activatePlayer(computer, "#computer", "#computer-stats", "Defender");
  } else {
    alert("Both players are active");
  }
});

//Function of attacking the Enemy
//scaling attack damage based on character stats
//when health reaches 0, enemy is defeated
//player health does not reset
//After first fight choose the next enemy

function attack() {
  //player attacks cpu
  computer.health -= player.attack;
  //player's attack increases
  player.attack += player.defaultAttack
  // check to see if defender has lost
  if (computer.health <= 0) {
      computerPicked = false;
      $("#computer-stats")
          .html(`<h3>Defeated!</h3><h4>${computer.name} - Defender</h4>HP: ${computer.health} <br/>Attack: ${computer.attack}<br/>Counter: ${computer.counter}`)
          .addClass("defeated");
      // check and see if there are anymore characters left
      if (fighterList.length === 0) {

          gameRunning = false;
          alert("You won! Start a new game!")
      }
      return false;
  }

  // cpu attacks player

  player.health -= computer.counter;

  $("#player-stats").html(`<h4>${player.name} - Attack</h4>HP: ${player.health} <br/>Attack: ${player.attack}<br/>Counter: ${player.counter}`);

  $("#computer-stats").html(`<h4>${computer.name} - Defender</h4>HP: ${computer.health} <br/> Attack: ${computer.attack}<br/>Counter: ${computer.counter}`);

  if (player.health <= 0) {
      playerPicked = false;
      computerPicked = false;
      gameRunning = false;
      $("#player-stats").html(`<h3> Defeated!</h3><h4>${player.name} - Defender</h4>HP: ${player.health} <br/>Attack: ${player.attack}<br/>Counter: ${player.counter}`).addClass("defeated")

      alert("You've lost! Start new game!")
  }
}


//Continue operation until last enemy and prompt a victory/restart

//onclick for the attack button
$("#attack").on("click", function () {
  if (playerPicked && computerPicked && gameRunning) {
      attack();
  }
  else {
      alert("You need to pick a player!")
  }
})
newGame();

//onclick for the start a new game button
$("button#new-game").click(newGame);
