var C = "";
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
var scroller = 0
var cpm = {}
var cpms = []
var yun = {};
var qsc = {};
var progIntID;
var K = "";
var msg = ""
var msgtimer = 0

var htmlCopyBtn;
var onCopyBtn = false;
var onAddBtn = false;

var mousefire = 0
var currentCPM = "随机";
var rectcursx = 0
var canvas;
var nav;
var info = "";

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
  cpm = loadJSON('cpm.json');
  qsc = loadJSON('qsc.json');
  yun = loadJSON('yun.json');
  loadStrings('info.md', function(array){
    info = array.join('\n \n');

  } );
}

function setup() {

  canvas = createCanvas(Math.min(2000,windowWidth), windowHeight)
  canvas.position(0, 0);
  var currentURL = window.location.href;
  nav = createDiv('<ul>\
      <li><a href="' + currentURL + '/collection">My Collection</a></li>\
      <li><a href="https://github.com/LingDong-/ci-ren">Github</a></li>\
    </ul>')
  nav.position(windowWidth-270,24);
  
  
  
  background(245,244,243)
  new Clipboard('.btn');
  cpms = ["随机"].concat(Object.keys(cpm))
  // noLoop();
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
    
    bgoto = 0
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
  if (typeof htmlCopyBtn == 'undefined'){
    htmlCopyBtn = createButton('copy');
    htmlCopyBtn.class('btn');
    htmlCopyBtn.id("copybutton");
    htmlCopyBtn.attribute("data-clipboard-target", "#poem");

    // var copyBtn = document.querySelector('#copybutton');

    // copyBtn.addEventListener('click', function(event) {
    
    // // SelectText('poem');
    // var poemTextArea = document.querySelector('#poem');
    // poemTextArea.select();
    //   try {
    //     var successful = document.execCommand('copy');
    //     var msg = successful ? 'successful' : 'unsuccessful';
    //     console.log('Copying text command was ' + msg);
    //   } catch (err) {
    //     console.log('Oops, unable to copy');
    //   }
    // });
  }
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
    // click html copy button
    onCopyBtn = true;
    
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
    onAddBtn = true
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
 
function okbutton(x,y,er,tr,col1){
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
  line(x-tr,y,x-tr*0.2,y+tr)
  line(x-tr*0.2,y+tr,x+tr,y-tr)  
}

function infobutton(x,y,er,tr,col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
    bgoto = 5;
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
    flip = 0
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


function scrollRbutton(x,y,er,tr,col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
    scroller = max(-8,-abs(scroller-0.1)*1.5)
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  line(x-tr*0.4,y-tr,x+tr*0.6,y)
  line(x-tr*0.4,y+tr,x+tr*0.6,y)
    
  
}

function scrollLbutton(x,y,er,tr,col1){
  if (col1 === undefined){col1=color(153,146,142)}
  var sw = 1
  if (dist(mouseX,mouseY,x,y) <= er){
    //col1 = color(83,86,82)
    sw = 1.5
    scroller =min(8,abs(scroller+0.1)*1.5)
  }
  noFill()
  stroke(col1)
  strokeWeight(sw)
  ellipse(x,y,er*2,er*2);
  stroke(col1)
  strokeWeight(sw)
  noFill()
  line(x+tr*0.4,y-tr,x-tr*0.6,y)
  line(x+tr*0.4,y+tr,x-tr*0.6,y)
    
  
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
  onCopyBtn = false
  onAddBtn = false
  
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

    // load 
    // redraw();
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
      console.log("write poem");
      // progIntID = window.setInterval(drawProgress, 0.1);
       //noLoop();
      
      writePoem();
      //print(C)

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

    // redraw();
    
  }else if (state == 2){
     drawProgress();
      
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

    textFont(font[1],24)
    textLeading(50);
    //print(flip)
    
    var nc = (K+"\n"+C).split("\n").slice(1).join("\n").split("\n")
    for (var i = 0; i < nc.length; i++){
      if (textWidth(nc[i])>width-20){
        nc[i] = nc[i].split("。").join("。\n").slice(0,-1)
        
      }
    }
    nc = nc.join("\n").split("\n").join("\n")
    
    var hbase = max(100+50*nc.split("\n").length,height/2)
    text(nc,width/2,hbase+70-50*nc.split("\n").length)
    textFont(font[2],36)
    //print(C)
    text(K,width/2,hbase-50*nc.split("\n").length-20)    
    

    // add poem div
    var poemDiv = document.getElementById('poem');
    poemDiv.innerHTML = C;

    replaybutton(width/2-120,min(hbase+150-(flip*4+100)/4,hbase+150),24,11,color(153,146,142,-flip*2))
    copybutton(width/2,  min(hbase+150-(flip*4+200)/4,hbase+150),24,10,color(153,146,142,-flip*2))
    addbutton(width/2+120,min(hbase+150-(flip*4+300)/4,hbase+150),24,11,color(153,146,142,-flip*2))
  }else if (state == 4){
    
    
    fill(93,86,82)
    noStroke()
    textFont(font[1],40)
    text("词\n牌\n",width-50,max(70,height/2-170))
    
    for (var i = 0; i < cpms.length; i++){
      fill(93,86,82)
      noStroke()
      textFont(font[1],40)
      textFont(font[2],24)
      //cpm[cpms[i]][0].length+"\n"+
      text(cpms[i].split("").join("\n"),width-100-50*i+flip,max(60,height/2-180))
      
      noFill()
      stroke(193,186,182)
      
      
      if (mouseX > width-114-50*i+flip && mouseX < width-114-50*i+flip+50 &&
        mouseY > max(60,height/2-210) && mouseY < max(60,height/2-210)+200){
          //rect(width-114-50*i+flip,max(60,height/2-210),50,200)
          rectcursx = rectcursx*0.8+i*0.2
          if (mousefire == 1){
            currentCPM = cpms[i]
            mousefire = 0
          }
        }
      
    }
    if ( mouseY > max(60,height/2-210) && mouseY < max(60,height/2-210)+200){
      rect(width-114-50*rectcursx+flip,max(60,height/2-210),50,200)
    }
    stroke(93,86,82)
    strokeWeight(1)
    noFill()
    
    rect(width-114-50*cpms.indexOf(currentCPM)+flip,max(60,height/2-210),50,200)

    scrollLbutton(width/2-120,height/2+150,24,11)
    okbutton(width/2+120,height/2+150,24,10,color(153,146,142,trsp))
    scrollRbutton(width/2,height/2+150,24,11)
    flip = flip + scroller
    //console.log(flip,cpms.length*50)
    if (flip < 0){
      flip = flip*0.9
    }
    if (flip > cpms.length*50-width+100){
      flip = flip*0.9+(cpms.length*50-width+100)*0.1
    }
    scroller = scroller/1.3
    
    // add info page stuff
  } else if (state == 5){
    // add text
    
    textFont(font[0],20);
    fill(100)
    noStroke()
    textAlign(CENTER);

    text(info,width/2,height/3-15);
    // add return button
    okbutton(width/2,height/2+150,24,10,color(153,146,142,trsp));

  }
  
  if (msg != ""){
    
    
    noStroke()
    textFont(font[0],20)
    fill(103,98,96,min(255,400*sin(msgtimer*PI/100)))
    rect(width/2-textWidth(msg)/2-10,height-100-20,textWidth(msg)+20,28)
    fill(246,245,244)
    text(msg,width/2,height-100)
    msgtimer = msgtimer + 1
    if (msgtimer == 100){
      msg = ""
      msgtimer = 0
    }
    
  }
  
  
  
  //print(bgoto)
  mousefire = 0
  
}

function windowResized() {
  nav.position(windowWidth-270,24);
  resizeCanvas(windowWidth, windowHeight);
}

function smoothtrans(n,mf){
  var iid = window.setInterval(f,0.1)
  function f(){
    //background(245,244,243,255-(0.5*cos(trans*2*PI)+0.5)*255)
    //noLoop()
    //rect(0,0,width,height)
    trans = trans + 0.5
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
  // redraw(5);
  mousefire = 1
  console.log(state);
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
  if (onCopyBtn){
    $("#copybutton").click();    
    console.log("Press Cmd-C to Copy.")
    if ( Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0){
      msg = "Press cmd-c now to copy."
    }else{
      msg = "Copied to clipboard."
    }
  }
  if (onAddBtn){
    print(C)
    window.location.href = '/collection/?'+K+"|"+C.replaceAll("\n","|");
  }
}


function writePoem(){
  var cpmkeys = Object.keys(cpm);
  // var k = randomselect(cpmkeys);
  console.log(currentCPM)
  if (currentCPM == "随机"){
    K = randomselect(cpmkeys);//"浣溪沙";
  }else{
    K = currentCPM
  }
  //var start = new Date().getTime();

  console.log(K);
  /*
  var promise1 = new Promise(function(resolve, reject) {
    // do a thing, possibly async, then…
    write(cpm[K][0],[getrandy(3),getrandy(4),getrandy(5),getrandy(6)],-1)
    print("bababa")

    resolve("haha");

  });
  var promise2 = new Promise(function(resolve, reject) {
    drawProgress()
    print("gogogo")
    resolve("hoho")
  })
  */

  //p = new Promise(function(resolve){ write(cpm[K][0],[getrandy(3),getrandy(4),getrandy(5),getrandy(6)],-1)})
  //p = new Promise(function(resolve){ for(var i= 0;i<1000;i++){print(i)}; return true})
  write(cpm[K][0],[getrandy(3),getrandy(4),getrandy(5),getrandy(6)],-1);
  //promise.then(function(result){print("OK!")})
  //Promise.all(promise2,promise1).then(function(result){print("OK!")})
  //print(q)
  //var poem = K + '\n' + write(cpm[K][0],[getrandy(3),getrandy(4),getrandy(5),getrandy(6)],-1);
  // console.log(poem);
  // console.log("\n");
  

  //var end = new Date().getTime();
  //var time = end - start;
  //console.log('Execution time: ',time);
  //return poem;
}

function drawProgress(){
  //background(0,0,0)
  
  //console.log("flip", flip);
  if (flip > -2){
      // flip -= 0.01;
    }
  else{

    if (flip == -2){
      // window.clearInterval(progIntID);
    }
    state = 3
    counter = 0
    slicer = 0
  }
    // update poem
    //print(iscale);
    image(icon[0], width/2-iscale/2, height/2-iscale/2-120,dWidth=iscale,dHeight=iscale);
    
    image(icon[3],sx=0,sy=0,sWidth = 256,sHeight=256*(flip+2),
    dx=width/2-iscale/2, dy=height/2-iscale/2-120,dWidth=iscale,dHeight=iscale*(flip+2));
    drawmt()
    cancelbutton(width/2,height/2+150,24,9)

  // redraw();
}

//http://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}