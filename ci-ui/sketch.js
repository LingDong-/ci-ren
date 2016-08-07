var C = "浣溪沙\n\
正是少留残酒醒，分吴兴佐鼎调停。香红妆映烛荧荧。\n\
意气与人看鹤舞，衣香七十载刘伶。水横孤映小蜻蜓。"
var icon = []
var font = []
var bg = []
var iscale
var state = 0
var flip = 1
var counter = 0
var mtxt = ["Generative Chinese Poetry.","   Generating...","Done."]
var ctxt = mtxt[0]
var tn = 0
var slicer = 0
var bgoto = -1
var trans = 0
var cpm = {}

function preload() {
  icon[0] = loadImage("assets/ciren1.png");
  icon[1] = loadImage("assets/ciren2.png");
  icon[2] = loadImage("assets/ciren3.png");
  icon[3] = loadImage("assets/ciren4.png");
  bg[0] = loadImage("assets/bg1.png")
  bg[1] = loadImage("assets/bg2.png")
  font[0] = loadFont('assets/HelveticaNeue.otf');
  font[1] = loadFont('assets/Yingxue.ttf');
  font[2] = loadFont('assets/Libian.ttf');
  cpm = loadJSON('cpm.json')
}

function setup() {
  createCanvas(Math.min(2000,windowWidth), windowHeight)
  background(245,244,243)
}

function drawmt(){
  textFont(font[0],18);
  fill(100)
  
  noStroke()
  textAlign(CENTER);
  text(ctxt,width/2,height/2+15)  

  
}

function playbutton(x,y,er,tr, col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
    
    bgoto = 1
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  triangle(x-tr*0.8,y-tr*1.7,x-tr*0.8,y+tr*1.7,x+tr*1.7,y)

  
}

function replaybutton(x,y,er,tr, col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
    
    bgoto = 1
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  arc(x,y,tr*2,tr*2,PI/2,2*PI)
  line(x,y,x+tr,y)
  line(x+tr,y,x+tr,y-tr)
  //triangle(x-tr*0.8,y-tr*1.7,x-tr*0.8,y+tr*1.7,x+tr*1.7,y)
}

function copybutton(x,y,er,tr, col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  rect(x-tr*1.2,y-tr*1.3,tr*1.6,tr*2)
  rect(x-tr*0.4,y-tr*0.7,tr*1.6,tr*2)
  //triangle(x-tr*0.8,y-tr*1.7,x-tr*0.8,y+tr*1.7,x+tr*1.7,y)
}


function addbutton(x,y,er,tr, col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  line(x-tr,y,x+tr,y)
  line(x,y-tr,x,y+tr)
}
 


function infobutton(x,y,er,tr,col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  line(x,y-tr*0.4,x,y+tr)
  line(x,y-tr,x,y-tr*0.9)
  
  
}


function optionbutton(x,y,er,tr,col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
    bgoto = 4
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  line(x-tr,y-tr,x+tr,y-tr)
  line(x-tr,y,x+tr,y)
  line(x-tr,y+tr,x+tr,y+tr)
    
  
}

function cancelbutton(x,y,er,tr,col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
    bgoto = 0
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  line(x-tr,y-tr,x+tr,y+tr)
  line(x+tr,y-tr,x-tr,y+tr)
    
  
}


function scrollbutton(x,y,er,tr,col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  line(x-tr,y-tr,x+tr,y+tr)
  line(x+tr,y-tr,x-tr,y+tr)
    
  
}

function transtext(tn1,tn2){
  var tn = tn1
  
  if(ctxt.length==0 || slicer >0){
    tn = tn2
    ctxt = ""
  }
  if (tn== tn1){
    ctxt = ctxt.slice(0,-1)
    //print(ctxt)

  }else{
    ctxt = mtxt[tn2].slice(0,slicer)
    slicer = slicer + 1
    
    //print(ctxt)
  }

}


function draw() {
  //createCanvas(windowWidth, windowHeight)
  bgoto = -1
  
  //text("词人",10,10)
  background(245,244,243)
  image(bg[1],0,0)
  if (state == 0){
    iscale = 200//+Math.sin(frameCount/100)*5
    image(icon[1], width/2-iscale/2, height/2-iscale/2-120,dWidth=iscale,dHeight=iscale);
    drawmt()

    playbutton(width/2-120,height/2+150,24,7)
    optionbutton(width/2,height/2+150,24,9)
    infobutton(width/2+120,height/2+150,24,11)
    //rect(width/2-iscale/2,height/2-120-iscale/2,iscale,iscale)
    if (mouseX > width/2-iscale/2 && mouseX < width/2 + iscale/2 && mouseY > height/2-120-iscale/2 && mouseY < height/2-120 + iscale/2){
      bgoto = 1
    }

  }
  
  
  else if (state == 1){
    if (flip > -0.9){
      flip = cos(counter)-0.1
      counter = counter + 0.06
      transtext(0,1)
      //if (tn == 0){
      //  ctxt = ctxt.slice(0,-1)
      //}else{
      //  ctxt = mtxt[tn].slice(0,slicer)
      //  print(ctxt)
      //  slicer = slicer + 1
      //}
      //if (ctxt.length == 0){
      //  tn = 1
      //  ctxt = ""
      //}
      
    }else{
      flip = -1
      state = 2
    }
    //print(flip)
    var im = 0
    if (flip <= 0){
      im = 3
    }else{
      im = 1
    }
    image(icon[im], width/2-iscale/2*flip, height/2-iscale/2-120,dWidth=iscale*flip,dHeight=iscale);     
    drawmt()
    var trsp = 255-(1-flip)*255*3
    if (trsp > 1){
      playbutton(width/2-120,height/2+150,24+12*(1-flip),7+3.5*(1-flip),color(153,146,142,trsp))
      optionbutton(width/2,height/2+150,24,9,color(153,146,142,trsp))
      infobutton(width/2+120,height/2+150,24,11,color(153,146,142,trsp))
    }
    
  }else if (state == 2){
    if (flip > -2){
      flip -= 0.01
    }else{
      state = 3
      counter = 0
      slicer = 0
    }
    image(icon[0], width/2-iscale/2, height/2-iscale/2-120,dWidth=iscale,dHeight=iscale);
    
    image(icon[3],sx=0,sy=0,sWidth = 256,sHeight=256*(flip+2),
    dx=width/2-iscale/2, dy=height/2-iscale/2-120,dWidth=iscale,dHeight=iscale*(flip+2));
    drawmt()
    cancelbutton(width/2,height/2+150,24,9)
      
  }else if (state == 3){
    if (flip > -200){
      flip -= 2//sin(counter)
      //counter = counter + 1
    }
    transtext(1,2)
    drawmt()
    
    image(icon[0], width/2-iscale/2, height/2-iscale/2-120+flip,dWidth=iscale,dHeight=iscale); 
    background(245,244,243,min(255,-flip*10))
    image(bg[1],0,0)
    fill(252,251,249)
    var w = 10*min(flip+20,0)
    //print(flip)
    var h = 300
    stroke(240,237,234)
    //rect(width/2-w/2,height/2-40-h/2,w,h)
    
    fill(93,86,82,-flip*5)
    noStroke()
    textFont(font[2],36)
    text(C.split("\n").slice(0,1).join("\n"),width/2,height/2-150)
    textFont(font[1],24)
    textLeading(50);
    //print(flip)
    text(C.split("\n").slice(1).join("\n"),width/2,height/2-60)
    
    
    replaybutton(width/2-120,min(height/2+150-(flip*4+100)/4,height/2+150),24,11,color(153,146,142,-flip*2))
    copybutton(width/2,  min(height/2+150-(flip*4+200)/4,height/2+150),24,10,color(153,146,142,-flip*2))
    addbutton(width/2+120,min(height/2+150-(flip*4+300)/4,height/2+150),24,11,color(153,146,142,-flip*2))
  }else if (state == 4){
    var cpms = Object.keys(cpm)
    for (var i = 0; i < cpms.length; i++){
      fill(93,86,82)
      noStroke()
      textFont(font[2],24)
      text(cpms[i].split("").join("\n"),50*i+flip,100)
      flip -= 0.1
    }
    
  }
  
  //print(bgoto)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function smoothtrans(n,mf){
  var iid = window.setInterval(f,0.1)
  function f(){
    //background(245,244,243,255-(0.5*cos(trans*2*PI)+0.5)*255)
    //noLoop()
    //rect(0,0,width,height)
    trans = trans + 0.02
    //print(trans)
    if (trans > 0.5){
      //loop()
      //print("yo")
      state = n
      mf()
    }
    if (trans > 0.6){
      //noLoop()
    }
    if (trans >= 1){
      window.clearInterval(iid)
      //loop()
    }
  }
}

function mousePressed() {
  
  
  if (bgoto != -1){
    
    if (bgoto == 0){
      trans = 0
      smoothtrans(0,function(){counter = 0;flip=0;ctxt=mtxt[0];tn=0;slicer=0})

    }else if (bgoto == 1){
      ctxt = mtxt[1]
      tn = 1
      state = bgoto
      //flip = -1
      bgoto = -1
      
    }else{
      state = bgoto
    }
    bgoto = -1
    
  }
  /*
  if (state == 0) {

    if (mouseX > width/2-iscale/2 && mouseX < width/2 + iscale/2 && mouseY > height/2-120-iscale/2, mouseY < height/2-120 + iscale/2){
      state = 1
      print("hi")
    }
    
  } 
  */
}