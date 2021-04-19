// background
var path, pathImg;

// player
var mainCyclist, mainCyclist_cycling, mainCyclist_collided;

// automatic opponent cyclists(computer)
var pinkCyclist, pinkCyclist_cycling, pinkCyclist_collided, pinkCyclistsGroup;
var yellowCyclist, yellowCyclist_cycling, yellowCyclist_collided, yellowCyclistsGroup;
var redCyclist, redCyclist_cycling, redCyclist_collided, redCyclistsGroup;

// bell sound
var cycleBell_sound;
// check point sound
var checkPoint_sound;
// game over sound
var gameOver_sound;

// opponent cyclists group
var pinkCyclistsGroup, yellowCyclistsGroup, redCyclistsGroup;

// gameStates
// game states
var END = 0;
var PLAY = 1;
var gameState = PLAY;

// distance
var distance = 0;

// game over panel
var gameOver, gameOver;

// edges
var edges;

function preload() {
  // loading path image
  pathImg = loadImage("images/Road.png");

  // loading main Cyclist cycling animation
  mainCyclist_cycling = loadAnimation("images/mainPlayer1.png", "images/mainPlayer2.png");
  // loading main Cyclist collided animation
  mainCyclist_collided = loadAnimation("images/mainPlayer3.png");

  // loading pink Cyclist cycling animation
  pinkCyclist_cycling = loadAnimation("images/opponent1.png", "images/opponent2.png");
  // loading pink Cyclist collided animation
  pinkCyclist_collided = loadAnimation("images/opponent3.png");

  // loading yellow Cyclist cycling animation
  yellowCyclist_cycling = loadAnimation("images/opponent4.png", "images/opponent5.png");
  // loading yellow Cyclist collided animation
  yellowCyclist_collided = loadAnimation("images/opponent6.png");

  // loading red Cyclist cycling animation
  redCyclist_cycling = loadAnimation("images/opponent7.png", "images/opponent8.png");
  // loading red Cyclist collided animation
  redCyclist_collided = loadAnimation("images/opponent9.png");

  // loading cycle bell sound
  cycleBell_sound = loadSound("sound/bell.mp3");
  
  // loading checkPoint sound
  checkPoint_sound = loadSound("sound/checkPoint.mp3");
  
  // loading gameOver sound
  gameOver_sound = loadSound("sound/die.mp3");
  
  // loading gameOver image
  gameOverImg = loadImage("images/gameOver.png");
}

function setup() {
  // creating canvas
  createCanvas(1200, 300);

  // creating path // background
  path = createSprite(100, 150);
  path.addImage(pathImg);
  // Moving background(path)
  path.velocityX = -5;

  // creating main Cyclist
  mainCyclist = createSprite(70, 150);
  // adding main Cyclist cycling animation
  mainCyclist.addAnimation("mainCyclist cycling", mainCyclist_cycling);
  // adding main Cyclist collided animation
  mainCyclist.addAnimation("mainCyclist collided", mainCyclist_collided);
  mainCyclist.scale = 0.07;
  //mainCyclist.debug = true;
  mainCyclist.debug = false;
  // set collider for mainCyclist
  // setting collider for main Cyclist
  mainCyclist.setCollider("rectangle", 0, 0, 1200, 1300);

  // creating game over panel
  gameOver = createSprite(650, 150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;

  // creating new group(pinkCyclistsGroup)
  pinkCyclistsGroup = new Group();
  // creating new group(yellowCyclistsGroup)
  yellowCyclistsGroup = new Group();
  // creating new group(redCyclistsGroup)
  redCyclistsGroup = new Group();
}

function draw() {
  // setting background of the canvas
  background(0);
  
  // drawSprites function to draw sprites(display sprites)
  drawSprites();
  
  // displaying distance
  textSize(20);
  fill(255);
  text("Distance: " + distance + " metres", 900, 30);
  
  // Writing if statement for game's PLAY state
  if (gameState === PLAY) {

    // calculating distance
    distance = distance + Math.round(getFrameRate() / 60);

    // setting the path's x velocity
    path.velocityX = -(6 + 3 * distance / 100);

    // making the mainCyclist(player) move with mouse up and down
    mainCyclist.y = World.mouseY;

    // creating edgeSprites(creating edges as Sprites) 
    edges = createEdgeSprites();

    // Making the mainCyclist colliding with edges
    mainCyclist.collide(edges);
    
    if (distance > 0 && distance % 100 === 0) {
      checkPoint_sound.play();
    }
    
    // code to reset the background
    // making the background(path) infinitive
    if (path.x < 0) {
      path.x = width / 2;
    }

    // code to play cycle bell sound
    // playing cycle bell sound when space key is pressed
    if (keyDown("space")) {
      cycleBell_sound.play();
    }

    // creating continous opponent players(cyclists)
    var select_oppPlayer = Math.round(random(1, 3));

    if (World.frameCount % 100 === 0) {
      if (select_oppPlayer === 1) {
        spawnPinkCyclists();
      } else if (select_oppPlayer === 2) {
        spawnYellowCyclists();
      } else {
        spawnRedCyclists();
      }
    }
    
    // if statements for when opponent cyclists collide with the main cyclist(player)

    if (pinkCyclistsGroup.isTouching(mainCyclist)) {
      gameState = END;
      pinkCyclist.velocityY = 0;
      pinkCyclist.addAnimation("opponentpinkCyclist", pinkCyclist_collided);
      yellowCyclistsGroup.destroyEach();
      redCyclistsGroup.destroyEach();
      gameOver_sound.play();
    }

    if (yellowCyclistsGroup.isTouching(mainCyclist)) {
      gameState = END;
      yellowCyclist.velocityY = 0;
      yellowCyclist.addAnimation("opponentyellowCyclist", yellowCyclist_collided);
      pinkCyclistsGroup.destroyEach();
      redCyclistsGroup.destroyEach();
      gameOver_sound.play();
    }

    if (redCyclistsGroup.isTouching(mainCyclist)) {
      gameState = END;
      redCyclist.velocityY = 0;
      redCyclist.addAnimation("opponentredCyclist", redCyclist_collided);
      pinkCyclistsGroup.destroyEach();
      yellowCyclistsGroup.destroyEach();
      gameOver_sound.play();
    }
    
    console.info("The game has started");

    // Writing if statement for game's END state
  } else if (gameState === END) {
    // Add code to show restart game instrution in text here
    
    gameOver.visible = true;
    
    // Displaying instructions to restart the game after END state
    
    textSize(20);
    fill(255);
    text("Press Up Arrow to Restart the game!", 500, 200);

    textSize(20);
    fill(255);
    text("Or simply click on GAME OVER.", 525, 220);

    // setting the mainCyclist's x velocity to 0
    path.velocityX = 0;
    // setting the mainCyclist's y velocity to 0
    mainCyclist.velocityY = 0;
    // changing mainCyclist's animation from cycling to collided animation
    mainCyclist.changeAnimation("mainCyclist collided", mainCyclist_collided);

    /* setting opponent cyclists group's each cyclists x velocity to 0
    and setting opponent cyclists group's each cyclists lifetime to -1
    so that they are not destroyed in the END state */

    pinkCyclistsGroup.setVelocityXEach(0);
    pinkCyclistsGroup.setLifetimeEach(-1);

    yellowCyclistsGroup.setVelocityXEach(0);
    yellowCyclistsGroup.setLifetimeEach(-1);

    redCyclistsGroup.setVelocityXEach(0);
    redCyclistsGroup.setLifetimeEach(-1);
    
    console.warn("Game Over!");

    // write condition for calling reset( )
    /* writng if statement for when mouse is pressed over gameOver or up key pressed then
    calling reset function */
    if ((mousePressedOver(gameOver)) || (keyDown("up"))) {
      reset();
      console.info("The game is played once again.");
    }
  }

  // Logging path's x velocity in the console
  //console.log(path.velocityX);
  // Logging the gameState in the console
  //console.log("The gameState is " + gameState, "frameCount => " + frameCount);
}

function spawnPinkCyclists() {
  // creating pinkCyclist sprites
  pinkCyclist = createSprite(1100, Math.round(random(50, 250)));
  pinkCyclist.scale = 0.06;
  pinkCyclist.velocityX = -(6 + 2 * distance / 100);
  pinkCyclist.addAnimation("opponentpinkCyclist", pinkCyclist_cycling);
  pinkCyclist.setLifetime = 170;
  pinkCyclistsGroup.add(pinkCyclist);
  //pinkCyclist.debug = true;
  pinkCyclist.debug = false;
  pinkCyclist.setCollider("rectangle", 0, 0, 1200, 1300);
}

function spawnYellowCyclists() {
  // creating yellowCyclists sprites
  yellowCyclist = createSprite(1100, Math.round(random(50, 250)));
  yellowCyclist.scale = 0.06;
  yellowCyclist.velocityX = -(6 + 2 * distance / 100);
  yellowCyclist.addAnimation("opponentyellowCyclist", yellowCyclist_cycling);
  yellowCyclist.setLifetime = 170;
  yellowCyclistsGroup.add(yellowCyclist);
  //yellowCyclist.debug = true;
  yellowCyclist.debug = false;
  yellowCyclist.setCollider("rectangle", 0, 0, 1200, 1300);
}

function spawnRedCyclists() {
  // creating redCyclists sprites
  redCyclist = createSprite(1100, Math.round(random(50, 250)));
  redCyclist.scale = 0.06;
  redCyclist.velocityX = -(6 + 2 * distance / 100);
  redCyclist.addAnimation("opponentredCyclist", redCyclist_cycling);
  redCyclist.setLifetime = 170;
  redCyclistsGroup.add(redCyclist);
  //redCyclist.debug = true;
  redCyclist.debug = false;
  redCyclist.setCollider("rectangle", 0, 0, 1200, 1300);
}

// create reset function here
// reset function
function reset() {
  // writng code for things to be changed after reset function
  gameState = PLAY;
  gameOver.visible = false;
  pinkCyclistsGroup.destroyEach();
  yellowCyclistsGroup.destroyEach();
  redCyclistsGroup.destroyEach();
  mainCyclist.changeAnimation("mainCyclist cycling", mainCyclist_cycling);
  distance = 0;
  
  // Logging the count of reset frame called in the console
  console.count("Reset frame is called");
}

// ******************************************************** \\
                        // Done \\
// ******************************************************** \\
