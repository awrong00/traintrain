//fixed variables
var preset = {
  roles: [
    'Clean',
    'Drink',
    'Food',
    'Fun'
  ],
  stayTime: 5,
  transitTime: 30,
  jumpStartTime: 20,
  psgNum: 15,
  seatNum: 20,
  initialCleanRatio: 0.8
};

var c;

var ui = {
  size: [600, 400],
  marg: 10,
  player1: [0, 0, 1 / 6, 1 / 4],
  deck: [0, 1 / 4, 1, 3 / 4],
  trainState: [3 / 4, 0, 1 / 4, 3 / 16],
  aisle: 1 / 4
}

//changing variables
var state = {
  clean: [],
  seated: [],
  coin: 0,
  curRole: 0,
  inTransit: 1,
  boarding: 0
}

var yourState = {
  x: 0,
  y: 0,
  speed: 10,
  nearestSeat: NaN
}

//passenger states
var psgState = {
  inTime: [],
  inPos: [],
  dir: [],
  need: [],
  seated: [],
  seatNum: []
}

//time elements
var t0 = 0;
var t1;

function createNoiseMap(size) {
  var arr = [];
  for (var mapY = 0; mapY < size[1]; mapY++) {
    var arr2 = [];
    for (var mapX = 0; mapX < size[0]; mapX++) {
      var noiseScale = 0.02;
      var noiseVal = noise(mapX * noiseScale, mapY * noiseScale);
      arr2.push(noiseVal * 0.75);
    }
    arr.push(arr2);
  }
  return arr;
}

function setup() {
  frameRate(24);
  textAlign(LEFT, TOP);
  createCanvas(ui.size[0], ui.size[1]);
  background(0);

  c = {
    bg: color(0, 0, 0),
    line: color(255, 255, 255),
    inTransit: color(255, 120, 120),
    inStation: color(120, 255, 120),
    roles: [color(120, 120, 255),
      color(120, 255, 255),
      color(255, 255, 120),
      color(255, 120, 255)
    ],
    dirt: createNoiseMap(ui.size)
  };

  //set up state before game
  for (var seatNum = 0; seatNum < preset.seatNum; seatNum++) {
    var isClean = random(0, 1);
    if (isClean < preset.initialCleanRatio) {
      isClean = 1;
    } else {
      isClean = 0;
    }
    state.clean.push(isClean);
    state.seated.push(0);
  }

  for (var psgNum = 0; psgNum < preset.psgNum; psgNum++) {
    var inTime = random(0, preset.stayTime);
    var inPos = ui.h * ui.deck * ui.aisle - ui.marg * 2;
    inPos = random(-inPos / 2, inPos / 2);
    psgState.inTime.push(inTime);
    psgState.inPos.push(inPos);
    psgState.dir.push(1);
    psgState.need.push(0);
    psgState.seated.push(0);
  }
}

function keyPressed() {

}

function draw() {
  textSize(10);
  background(c.bg);
  noFill();
  stroke(c.line);
  drawBox(ui.player1);
  drawBox(ui.trainState);
  drawBox(ui.deck);

  //deck
  push();
  translate(ui.size[0] * ui.deck[0], ui.size[1] * ui.deck[1]);
  translate(ui.marg, ui.marg);
  var deckW = ui.size[0] * ui.deck[2] - ui.marg * 2;
  var deckH = ui.size[1] * ui.deck[3] - ui.marg * 2;
  var seatW = deckW / int(preset.seatNum / 2);
  var seatH = deckH * (1 - ui.aisle) / 2;
  var seat2Y = deckH - seatH;
  var aisleH = deckH - seatH * 2;

  for (var seatNum = 0; seatNum < preset.seatNum; seatNum++) {
    var seatX = int(seatNum / 2) * seatW;
    var seatY = 0;

    if (seatNum % 2) {
      seatY = seat2Y;
    }

    if (state.clean[seatNum] == 0) {
      push();
      noStroke();
      for (var dirtH = 0; dirtH < seatH; dirtH++) {
        for (var dirtW = 0; dirtW < seatW; dirtW++) {
          if (dirtW % 5 == 0 && dirtH % 5 == 0) {
            fill(c.dirt[seatY + dirtH][seatX + dirtW] * 255);
            rect(seatX + dirtW, seatY + dirtH, 5, 5);
          }
        }
      }
      pop();
    }

    stroke(c.line);
    push();
    if (seatNum == yourState.nearestSeat) {
      strokeWeight(3);
    }
    rect(seatX, seatY, seatW, seatH);
    pop();
    //pop();
  }

  //deck - you
  push();
  if (keyIsDown(RIGHT_ARROW)) {
    yourState.x = yourState.x + yourState.speed;
  }

  if (keyIsDown(LEFT_ARROW)) {
    yourState.x = yourState.x - yourState.speed;
  }

  if (keyIsDown(DOWN_ARROW)) {
    yourState.y = yourState.y + yourState.speed;
  }

  if (keyIsDown(UP_ARROW)) {
    yourState.y = yourState.y - yourState.speed;
  }

  yourState.x = constrain(yourState.x, -deckW / 2, deckW / 2);
  yourState.y = constrain(yourState.y, -aisleH / 2, aisleH / 2);
  
  var nearestSeat = int((yourState.x + deckW/2) / seatW) * 2
  if (yourState.y < -aisleH/8){
    yourState.nearestSeat = nearestSeat;
  } else if (yourState.y > aisleH/8){
    yourState.nearestSeat = nearestSeat + 1;
  } else { 
    yourState.nearestSeat = NaN;
  }
  
  translate(deckW / 2, deckH / 2);
  fill(c.roles[state.curRole]);
  circle(yourState.x, yourState.y, 15);
  pop();
  
  

  pop();


  noStroke();
  fill(c.roles[state.curRole]);
  addText('YOU\nRole: ' + preset.roles[state.curRole], ui.player1);

  if (state.inTransit) {
    fill(c.inTransit);
    addText('IN TRANSIT\nArriving in ' + 's', ui.trainState);
  } else {
    fill(c.inTrainsit);
    addText('IN STATION\nDeparting in ' + 's', ui.trainState);
  }
}


function drawBox(val) {
  rect(ui.size[0] * val[0] + ui.marg, ui.size[1] * val[1] + ui.marg, ui.size[0] * val[2] - ui.marg * 2, ui.size[1] * val[3] - ui.marg * 2);
}

function addText(txt, val) {
  text(txt, ui.size[0] * val[0] + ui.marg * 2, ui.size[1] * val[1] + ui.marg * 2);
}
