// -*- coding: utf-8 -*-

var yun;
var qsc;
var cpm;

var lines = ["","",""]

var poplimit = 40
var poems = []
var CT = ""

var _cc = 1

// minimum frequency requirement for characters
var poplimit = 40
var resultlimit = 30
var maxtrial = 200

var Poem = {title : "", author : "", intro : "", content: "", prop: 1}

// js里可以想办法把平水韵做成json然后导入json
// js搞txt file感觉不够自然
// see: http://stackoverflow.com/questions/18366191/import-text-file-using-javascript
// function makeyun(){
// 	for (var i = 0; i < lines.length, i++){
// 		if ("声" in lines[i] && "：" in lines[i]){
// 			// string operations to get rid of comments
//             // append the lines to the yun object 
// 		}
// 	}
// }

// load yun json
function loadyun(){
    return $.getJSON( "yun.json", function(data){
        yun = data;
    });
}

// load qsc json
function loadqsc(){
    return $.getJSON( "qsc.json", function(data){
        qsc = data;
    });
}

// load qsc json
function loadcpm(){
    return $.getJSON( "cpm.json", function(data){
        cpm = data;
    });
}

// 在平水韵中找到一个字的平仄
function lookup(zi){
    // return an array of keys in yun (as strings)
    var keys = Object.keys(yun); 
    for (var i = 0; i < keys.length; i++){
        var character_sets = yun[keys[i]];

        for (var j = 0; j < character_sets.length; j ++){
            characters = character_sets[j];
            var found = characters.indexOf(zi);

            if (found > -1){
                // console.log("lookup",[keys[i], character_sets[j]])
                return [keys[i], character_sets[j]];

            }
        }

    }
}

function ispunc(zi){
    return (zi =="，" || zi =="。" || zi =="、" || zi =="；" || zi =="）")
}

// sort an json object by values, return list of lists
function sortdict(obj){
    // get the object into an array
    var unsorted = [];
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i ++){
        var value = obj[keys[i]];
        unsorted.push([keys[i], value]);
    }
    var sorted = unsorted.sort(function(a, b) {return b[1] - a[1];});
    return sorted;
}

function guessnext(zi){
    D = {};
    var contents = qsc['content'];
    var props = qsc["prop"];

    for (var j = 0; j < contents.length; j ++){
        c = contents[j];
        for (var i = 0; i < c.length; i += _cc){
            if (c.substring(i,i+_cc) == zi){

                if (!ispunc(c.substring(i+_cc,i+_cc*2))) {
                    x = c.substring(i+_cc,i+_cc*2);
                    if (Object.keys(D).indexOf(x) == -1){
                        D[x] = 0
                    }
                    D[x] += props[i];
                }

            }
        }
    }
    return D
}

function guesslast(zi,foo){
    var D = {};
    var contents = qsc['content'];
    var props = qsc["prop"];

    for (var j = 0; j < contents.length; j ++){
        var c = contents[j];
        for (var i = 0; i < c.length; i += _cc){
        
            if (c.substring(i,i+_cc) == zi && i > 0){

                if (!ispunc(c.substring(i-_cc,i))){

                    x =  c.substring(i-_cc,i);
                    if (Object.keys(D).indexOf(x) == -1){
                        D[x] = 0;
                    }
                        
                    D[x] += props[i];

                }
                    
            }
        }
    }
    return D;
}

function guesswithpos(zi,pos,dir){

    var D = {};

    var contents = qsc['content'];
    var props = qsc["prop"];

    for (var j = 0; j < contents.length; j ++){

        var c = contents[j];

        for (var i = 0; i < c.length; i += _cc){
            if (c.substring(i,i+_cc) == zi && i > 0){
                if (!ispunc( c.substring(i+dir*_cc,i+_cc+dir*_cc))) {

                    var pis = posinsent(c,i+_cc*dir)

                    if (midsent((pos[0]+(dir+1)/2)%pos[1],pos[1]) == midsent((pis[0]+(-dir+1)/2)%pis[1],pis[1])) {

                        x =  c.substring(i+dir*_cc,i+_cc+dir*_cc);
                        
                        if (Object.keys(D).indexOf(x) == -1){
                            D[x] = 0;
                            
                        }
                        D[x] += props[i];
                    }
                }

            }
                
        }
    }
    return D
}

function posinsent(c,ind){
    var start = 0;
    var end = c.length;

    for (var i = ind; i > 0; i -= _cc){
        if (i == 0 || ispunc(c.substring(i-_cc,i))) {
            start = i;
            break;
        }
    }

    for (var i = ind; i < c.length; i += _cc){
        if (i >= c.length-1 || ispunc(c.substring(i,i+_cc))) {
            end = i;
            break;
        }
    }

    if (end-start <= 0){
    }
        
    return [Math.floor((ind-start)/_cc),Math.floor((end-start)/_cc)]
}

function midsent(x,l){
    if (x == 0){
        return true;
    }

    // 0123-456
    if (l == 7 && x == 4){
        return true;
    }
    // 01-23-45
    if (l == 6 && (x == 2 || x == 4)){
        return true;
    }
        
    // 01-234
    if (l == 5 && x == 2){
        return true;
    }
    // 01-23
    if (l == 4 && x == 2){
        return true;
    }
    return false;
}

function popularity(zi){
    var po = 0;
    var contents = qsc['content'];

    for (var j = 0; j < contents.length; j ++){
        var c = contents[j];
        //console.log("c:",c);
        for (var i = 0; i < c.length; i += _cc){
            //console.log("substring:",c.substring(i,i+_cc));
            if (c.substring(i,i+_cc) == zi){

                po += 1;
            }
        }
                
    }
    //console.log(po);
    return po
}

function isOK(pai,z,i,yg,usedyg){
    while (lookup(z) == undefined) { return false};
    lxj0 = lookup(z)[0];

    if ((lxj0 == "平" && (pai[i] == "1" || pai[i] == "0")) ||
       (lxj0 != "平" && (pai[i] == "2" || pai[i] == "0")) && popularity(z) > Math.floor(poplimit/2)){
        return true;
    }
    // console.log("yg", yg);
    // console.log('first condition:',yg.length == 0 && parseInt(pai[i]) >= 3);
    // console.log(parseInt(pai[i]) >= 3);
    // console.log((lxj0 == "平" && parseInt(pai[i])%2 == 1 ));
    // console.log((lxj0 != "平" && parseInt(pai[i])%2 == 0 ));
    // console.log(popularity(z) > poplimit);

    if (yg.length == 0 && parseInt(pai[i]) >= 3 && (
       (lxj0 == "平" && parseInt(pai[i])%2 == 1 ) ||
       (lxj0 != "平" && parseInt(pai[i])%2 == 0 )
       ) && popularity(z) > poplimit){
       //console.log("z:",z);
       usedyg.push(z);
       return true;
    }

    // console.log("first condition", yg.length != 0 && parseInt(pai[i]) >= 3);
    // console.log(lxj0 == "平" && parseInt(pai[i])%2 == 1);
    // console.log((yg.indexOf(z) > -1));
    // console.log((usedyg.indexOf(z) == -1));
    // console.log(popularity(z) > poplimit);

    if (yg.length != 0 && parseInt(pai[i]) >= 3 &&(
       (lxj0 == "平" && parseInt(pai[i])%2 == 1 ) ||
       (lxj0 != "平" && parseInt(pai[i])%2 == 0 )
       ) &&(yg.indexOf(z) > -1) && (usedyg.indexOf(z) == -1) && popularity(z) > poplimit){
        usedyg.push(z)
       return true;
    }

    return false;
}

function repeatOK(zi,result,output,pai){

    if (output.indexOf(zi) > -1){
        for (var i = 0; i < output.length; i += _cc){
            if (output.substring(i,i+_cc) == zi){
                if (i != 0){
                    return false;
                }

                var l = poswithstruct(getstruct(pai),Math.floor(result.length/_cc))[1];
                if (midsent(Math.floor(l-output.length/_cc),l)) {
                    return false;
                }

            }
        }
    }

    if (result.indexOf(zi) > -1){
        for (var i = 0; i < result.length; i += _cc){
            if (result.substring(i, i+_cc) == zi){
                var l = poswithstruct(getstruct(pai),Math.floor(result.length/_cc))[1];
                if ((! (i == result.length-_cc && Math.floor(l-output.length/_cc) == 0)) || Math.floor((result.length-i)/_cc)>20){
                    return false;
                }
            }
        }
    }

    return true;
}

function getstruct(pai){
    var a = pai.replaceAll(",","$").replaceAll(".","$").replaceAll("`","$").replaceAll("|","").replaceAll("*","");
    var b = a.split("$").slice(0,-1);
    var result = [];
    for (var i = 0; i < b.length; i ++){
        result.push(b[i].length)
    }
    return result;
}

function unmark(pai){
    return pai.replaceAll(",","").replaceAll(".","").replaceAll("`","").replaceAll("|","").replaceAll("*","").replaceAll("$","");
}

function mark(pai,ci){
    var np = pai.split("");
    var j = 0
    var punclist = [",",".","`","|","*"];

    for (var i = 0; i < np.length; i ++){

        if (punclist.indexOf(np[i]) == -1){
            np[i] = ci.substring(j,j+_cc);
            j += _cc;
        }
        else if (ci.substring(j,j+_cc) == ""){
            i = i + 1;
            break;
        }       
    }
        
    np = np.slice(0,i);
    np = np.join("");

    if (np.indexOf("*") > -1){
        var rep = np.split("*")[0].split(".")
        rep = rep[rep.length - 1];
        np = np.replaceAll("*",rep);
    }
        
    np = np.replaceAll(",","，").replaceAll(".","。").replaceAll("`","、").replaceAll("|","\n")
    return np;
}

function splitbyy(pai){   
    var upai = unmark(pai).split("");

    var nl = [];
    var ne = "";
    for (var i =0; i < upai.length; i ++){
        var s = upai[i];
        ne += s;
        if (Math.floor(s) >= 3){
            nl.push(ne);
            ne = "";
        }
    }

    return nl;
}

function poswithstruct(struct,ind){
    var s = 0;
    for (var i =0; i < struct.length; i ++){
        s = s + struct[i];
        if (ind < s){
            return [ind - (s - struct[i]), struct[i]];
        }
    }
}

// http://stackoverflow.com/questions/894860/set-a-default-parameter-value-for-a-javascript-function
function write(pai,ys,dir){
    // set up default value of dir
    dir = typeof dir !== 'undefined' ? dir : -1;

    var output = [];
    var result = "";
    var ygs = [];
    var yg = [[]];
    for (var i = 0; i < ys.length; i ++){
        ygs.push(lookup(ys[i])[1]);
    }
    // console.log("outside ygs",ygs);
    var usedyg = [];
    var trial = [];
    var PA;
    var solution
    
    // backtrack part
    function writeci(pai, col, strict){
        
        // flip 一开始设计的时候从 -1 到 -2
        // -1 是开始，-2是结束
        // 而用percentage的话0是开始，1是结束
        // 所以-percentage - 1 就map到flip
        function GGG(){
        flip = -mark(PA, result + output.join("")).length / PA.length - 1;
        //console.log(flip);
        //drawProgress();
        //console.log("column count", col);
        //window.setTimeout(function(){document.getElementById("p").innerHTML = ""+col},1)
        //document.getElementById("p").innerHTML = ""+col

        // set up default value for strict
        strict = typeof strict !== 'undefined' ? strict : true;
        // console.log("PA", PA);
        var x;
        // console.log("col", col);
        //console.log("os", mark(PA,output.join("")));

        var cmp_tmp = pai.length;
        if (dir != 1){
            cmp_tmp = -1;
        }
        
        if (col == cmp_tmp){
            // console.log("accidental return via dir", output);
            solution = output.join("");
        }
        else if (output[col] != ""){
            // console.log("accidental return via col");
            solution =  writeci(pai,col+dir);
        } else {
            // console.log("column count 2", col);
            if (parseInt(pai[col]) >= 3){

                yg[0] = ygs[parseInt(pai[col]) - 3];
                // console.log("ygs", ygs);
                if (dir == -1){
                    x = yg[0];
                } else if (dir == 1){
                    sd = sortdict(guesswithpos(output[col-dir], 
                        poswithstruct(getstruct(PA),col-dir + Math.floor(result.length/_cc)),dir));

                    var tmp = [];
                    for (var i = 0; i < sd.length; i ++){
                        tmp.push(sd[i][0])
                    };
                    sd = tmp;

                    // find the intersection of sd and yg; credit to squint: 
                    // http://stackoverflow.com/questions/11076067/finding-matches-between-multiple-javascript-arrays
                    var arrays = [sd, yg[0]];
                    x = arrays.shift().reduce(function(res, v) {
                        if (res.indexOf(v) === -1 && arrays.every(function(a) {
                            return a.indexOf(v) !== -1;
                        })) res.push(v);
                        return res;
                    }, []);
                }
            } else {

                sd = sortdict(guesswithpos(output[col-dir], 
                        poswithstruct(getstruct(PA),col-dir + Math.floor(result.length/_cc)),dir));
                var nsd = [];
                for (var i = 0; i < sd.length; i ++){
                    if (sd.length < 5 || (!strict) || sd[i][1] > Math.floor(poplimit/10)){
                        nsd.push(sd[i]);
                    }
                }

                var tmp = [];
                for (var i = 0; i < nsd.length; i ++){
                    tmp.push(nsd[i][0])
                };
                x = tmp;

                x = x.slice(0, Math.min(x.length,resultlimit));
            }

            x = shuffle(x);

            // console.log("x:",x);

            for (var j = 0; j < Math.min(x.length, resultlimit); j ++){
                // console.log(x[j]);

                if (!strict || (isOK(pai,x[j],col,yg[0],usedyg) && repeatOK(x[j],result,output.join(""),PA))){
                    // console.log("test correct char", x[j]);
                    trial[col] += 1;
                    if (dir == 1){

                        if (trial[col] > maxtrial+10){
                            return undefined;
                        }
                        else if (trial[col] > maxtrial){
                            strict = false;
                        }
                        else{
                            strict = true;
                        }
                    }       
                    output[col] = x[j];
                    // console.log("output",output[output.length-1]);
                    //var solution = writeci(pai,col+dir,strict);
                    writeci(pai,col+dir,strict);
                    //window.setTimeout("writeci(pai,col+dir,strict)",1)
                    if (solution != undefined){
                        //return solution;
                        return;
                    }

                    if (parseInt(pai[col])>= 3 &&  (usedyg.indexOf(x[j]) > -1)){
                        var ind = usedyg.indexOf(x[j]);
                        usedyg.splice(ind,1);
                    }
                    
                    output[col] = "";
                    
                }
            }
            solution = undefined;
        }
        }
        //sleep(0).then(GGG)
        GGG()
        
    }
    // console.log("PAI", pai);
    // console.log("PA", PA);
    PA = pai;
    // console.log("PA", PA);

    if (dir == -1){

        var s_list = splitbyy(pai);
        //print(s_list)
        var i = 0
        var id
        FFF = function(){            
          var s = s_list[i];
          // console.log(s);
          output = fillArray("", s.length);
          trial = fillArray(0,s.length);
          writeci(s,s.length-1);
          nl = solution
          if (nl == undefined){
              msg = "Failure. Press 'x' and try again."
              return ""
          }
          result += nl;
          print(result)
          i += 1
          if (i < s_list.length){
            //FFF()
            window.setTimeout(FFF,1)
          }else{
            print(mark(pai, result))
            C = mark(pai, result)
            flip = -2
            return mark(pai, result);
          }
        }
        //FFF()
        window.setTimeout(FFF,1)
        

    } else if (dir == 1){
        trial = fillArray(0,unmark(pai).length);
        output = fillArray("", unmark(pai).length);
        output[0] = "烂";
        for (var i = 0; i < Math.floor(CT.length / _cc); i ++ ){
            if (i < getstruct(pai).length){
                var sum = getstruct(pai).slice(0, i).reduce(function(a, b) {
                    return a + b;
                }, 0);

                output[sum] = CT.slice(i* _cc, i* _cc + _cc);
            }
        }
        nl = writeci(unmark(pai), 0);
        if (nl == undefined){
            return "";
        }
        result += nl;
    }
    return mark(pai, result);

}

// 随机选择韵脚
function getrandy(n,bounds){
    bounds = typeof bounds !== 'undefined' ? bounds : [20,1000];
    var ze = yun["上"].concat(yun["去"]).concat(yun["入"]);
    var ping = yun["平"];

    var pick = ""
    while (pick == "" || lookup(pick)[1].length <bounds[0] || lookup(pick)[1].length >bounds[1]){

        if (n%2 == 1){
            pick = randomselect(ping)[0]
        }
            
        if (n%2 == 0){
            pick = randomselect(ze)[0]
        }
            
    }

    return pick;
}

function randomselect(arr){
    var rand = Math.random();
    rand *= arr.length; 
    rand = Math.floor(rand);
    return arr[rand];
}

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // console.log("shuffle")
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// http://stackoverflow.com/questions/12503146/create-an-array-with-same-element-repeated-multiple-times-in-javascript
function fillArray(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) {
    a = a.concat(a);
    // console.log("fillArray");
  }
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

// http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
function sleep (time) {
	return new Promise(function(resolve){ setTimeout(resolve, time)});
}


// testing scripts
/*
$.when(loadyun(), loadqsc(), loadcpm()).done(function(a1, a2, a3, a4){
    for (var i = 0; i < 1; i ++){

        var cpmkeys = Object.keys(cpm);
        var k = randomselect(cpmkeys);
        // var k = "十六字令";
        var start = new Date().getTime();

        console.log(k);
        console.log(write(cpm[k][0],[getrandy(3),getrandy(4),getrandy(5),getrandy(6)],-1))
        console.log("\n");
        

        var end = new Date().getTime();
        var time = end - start;
        console.log('Execution time: ',time);
    }
});
*/
