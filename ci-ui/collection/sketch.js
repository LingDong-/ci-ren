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
		np = [np.split("|").join("<br>")]
	}

	var collection = localStorage.getItem("collection")

	if (collection == "" || collection == null){
		print("yo")
		collection = []
	}else{
		collection = JSON.parse(collection)
	}

	localStorage.setItem("collection",JSON.stringify(np.concat(collection)))
	var g = JSON.parse(localStorage.getItem("collection"))
	print(g)
  	document.getElementById("poems").innerHTML = g.join("<br>")
}

function draw() {
  
}