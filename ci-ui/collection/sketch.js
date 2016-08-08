var divs = []
var nav

function ispunc(x){
	return (x=="，" || x=="。" || x=="｀")
}

function setup() {
	var np = decodeURIComponent(window.location.href.split("?")[1])
	
	print(np)
	/*
	np = np.split("%")
	var uc = []
	var uci = ""
	for (var i = 0; i < np.length; i++){
		uci += np[i]
		if (uci.length == 6){
			uc.push("\\u"+uci)
			uci = ""
		}
	}
	print(uc.join(","))
	*/
	if (np == "clear"){
		localStorage.setItem("collection",[])
		np = []
	}else if (np == "undefined"){
		np = []
	}else{
		np = [np]//.split("|").join("<br>")]
	}

	var collection = localStorage.getItem("collection")

	if (collection == "" || collection == null){
		print("yo")
		collection = []
	}else{
		collection = JSON.parse(collection)
	}
	var conc = collection
	if (collection.indexOf(np[0])==-1){
		conc = np.concat(collection)
	}
	localStorage.setItem("collection",JSON.stringify(conc))
	var g = JSON.parse(localStorage.getItem("collection"))
	print(g)
  	//document.getElementById("poems").innerHTML = g.join("<br>")

  	//dbg = createDiv("")
  	//dbg.style("background-image", "url(assets/bg3.png)");
  	//dbg.size(windowWidth*2,windowHeight*0.8)
  	//dbg.position(0,windowHeight*0.1)
  	nav = createDiv('<ul>\
      <li><a href="/">Back</a></li>\
    </ul>')
  	nav.position(120,24);
  	var sx = 0
  	var lm = (windowHeight*0.8)/30
  	for (var i = 0 ; i<g.length; i++){
  		var pc = []
  		var lc = ""
  		for (var j = 0; j<g[i].length;j++){
  			if (g[i][j] == "|"){

  				for (var jk = lc.length; jk<lm+1; jk++){
  					lc += " "
  				}
  				pc.push(lc)
  				lc = ""
  			}else if (lc.length>lm){
  				lc = lc + g[i][j]
  				pc.push(lc)
  				lc = ""
  			}else if (lc.length == 0 && ispunc(g[i][j])){
  				//lc = lc + g[i][j]
  				pc[pc.length-1] += g[i][j]
  			}else{
  				lc = lc + g[i][j]
  			}
  		}
  		if (lc != ""){
  			pc.push(lc)
  		}
  		sx += pc.length*40+100
  		for (var j = 0; j< pc.length; j++){
  			var d = createDiv(pc[j].split("").join("<br>"))
  			d.position(sx-j*40,windowHeight*0.1+20)
  			d.style("font-family","Longzhao")
  			d.style("font-size","20px")
  			d.style("border-left","1px solid #999999")
  			d.style("color","#EEEEEE")
  			//var e = createDiv(pc[j].split("").join("<br>"))
  			d.style("padding","10px 9px")
  			//d.style("background-image", "url(assets/bg3.png)");
  			divs.push(d)
  		}
  		
  	}
  	var e = createDiv("<h1>词<br>集</h1>")
  	e.position(sx+100,windowHeight*0.1-20)
  	e2 = createDiv("............................")
  	e2.style("color","rgba(0,0,0,0)")
  	e2.position(sx+200,0)
  	//e2.hide()


}

function draw() {
  
}