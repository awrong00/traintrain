var preset = {
  roles: ['Clean',
    'Drink',
    'Food',
    'Fun'
  ],

  stayTime: 5,
  transitTime: 30,
  jumpStartTime: 20,
  psgNum: 15


};


var curRole = 0;
var inTransit = true;
var t0 = 0;
var t1;
var money = 0;
var dirty = [];
var seated = [];
var psg = [];
var startBoarding = 0;

function setup() {
  createCanvas(800, 600);

  frameRate(24);
  textAlign(LEFT, TOP);
  for (var j = 0; j < 20; j++) {
    dirty.push(int(random(0, 2)));
    seated.push(0);
  }
  for (var m = 0; m < preset.psgNum; m++) {
    psg.push(1);

  }

}

function draw() {
  textSize(12);
  t = millis() / 1000 + preset.jumpStartTime;
  t1 = t - t0;


  if (inTransit == true && int(t1) == preset.transitTime + 1) {
    inTransit = false;
    t0 = t;
    t1 = 0;
    startBoarding = 1;
  } else if (inTransit == false && int(t1) == preset.stayTime + 1) {
    inTransit = true;
    t0 = t;
    t1 = 0;
  }

  background(220);

  push();
  translate(20, 20);
  noFill();
  stroke(0);
  rect(0, 0, 100, 150);

  noStroke();
  fill(0);
  text('YOU\nRole: ' + preset.roles[curRole], 5, 5);
  pop();

  push();
  translate(580, 20);

  noFill();
  stroke(0);
  rect(0, 0, 200, 50);

  noStroke();
  fill(0);
  if (inTransit) {
    text('IN TRANSIT\nArriving in ' + (preset.transitTime - int(t1)) + 's', 5, 5);
  } else {
    text('IN STATION\nDeparting in ' + (preset.stayTime - int(t1)) + 's', 5, 5);
  }

  pop();

  push();
  noFill();
  stroke(0);
  translate(20, 190);
  rect(0, 0, 760, 200);

  for (var i = 0; i < 20; i++) {
    push();
    if (i % 2) {
      translate(50 * (i - 1) / 2, 125);

    } else {
      translate(50 * i / 2, 0);
    }
    noFill();
    if (dirty[i]) {
      fill(150);
    } else if (seated[i]) {
      fill(10);
    }
    rect(0, 0, 50, 75);
    pop();
  }

  translate(0, 100);
  strokeWeight(2);
  if (inTransit && startBoarding) {
    for (var p = 0; p < psg.length; p++) {





      if (psg[p]) {
        var pos = t1 * 100 % 710 - p * 15;
        if (pos > 0 && pos < 500) {
          var table = int(pos / 50);
          if (seated[table * 2] == 0 && dirty[table * 2] == 0) {
            psg[p] = 0;
            seated[table * 2] = 1;
          } else if (seated[table * 2 + 1] == 0 && dirty[table * 2 + 1] == 0) {
            psg[p] = 0;
            seated[table * 2 + 1] = 1;
          }
          circle(pos, 0, 10);

        }
      }
    }

  }
  pop();


  push();
  translate(140, 20);
  noStroke();
  fill(0);
  textSize(30);
  text('$' + money, 5, 5);
  pop();
}