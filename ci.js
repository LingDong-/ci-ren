var yun;
var qsc;

var lines = ["","",""]

var poplimit = 40
var poems = []
var CT = ""

var _cc = 3

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
    $.getJSON( "ajax/yun.json", function(data){
        yun = data;
    });
}

// load qsc json
function loadqsc(){
    $.getJSON( "ajax/qsc.json", function(data){
        qsc = data;
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
                return [i, j];
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
    var sorted = unsorted.sort(function(a, b) {return a[1] - b[1];});
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

    for (var i = 0; i < contents.length; i ++){
        var c = contents[i];

        for (var j = 0; j < c.length; i += _cc){
            if (c.substring(i,i+_cc) == zi && j > 0){
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
    var end = len(c);

    for (var i = ind; i > 0; i -= _cc){
        if (i == 0 || ispunc(c.substring(i-_cc,i))) {
            start = i;
            break;
        }
    }

    for (var i = ind; i < c.length; i += _cc){
        if (i >= len(c)-1 || ispunc(c.substring(i,i+_cc))) {
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

        for (var i = 0; i < c.length; i += _cc){
            if (c.substring(i,i+_cc) == zi){
                po += 1;
            }
        }
                
    }
    return po
}

function isOK(pai,z,i,yg,usedyg){
    while (lookup(z) == null) {return false};
    lxj0 = lookup(z)[0];

    if ((lxj0 == "平" && (pai[i] == "1" || pai[i] == "0")) ||
       (lxj0 != "平" && (pai[i] == "2" || pai[i] == "0")) && popularity(z) > Math.floor(poplimit/2)){
        return true;
    }
       

    if (yg == [] && Math.floor(pai[i]) >= 3 && (
       (lxj0 == "平" && Math.floor(pai[i])%2 == 1 ) ||
       (lxj0 != "平" && Math.floor(pai[i])%2 == 0 )
       ) && popularity(z) > poplimit){

        usedyg.append(z);
       return true;
    }

    if (yg != [] && Math.floor(pai[i]) >= 3 &&(
       (lxj0 == "平" && Math.floor(pai[i])%2 == 1 ) ||
       (lxj0 != "平" && Math.floor(pai[i])%2 == 0 )
       ) &&(
       z in yg
       ) && (usedyg.indexOf(z) == -1) && popularity(z) > poplimit){
        usedyg.append(z)
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

                var l = poswithstruct(getstruct(pai),Math.floor(len(result)/_cc))[1];
                if (midsent(Math.floor(l-len(output)/_cc),l)) {
                    return false;
                }

            }
        }
    }

    if (result.indexOf(zi) > -1){
        for (var i = 0; i < result.length; i += _cc){
            if (result.substring(i, i+_cc) == zi){
                var l = poswithstruct(getstruct(pai),Math.floor(len(result)/_cc))[1];
                if ((! (i == len(result)-_cc && Math.floor(l-len(output)/_cc) == 0)) || Math.floor((len(result)-i)/_cc)>20){
                    return false;
                }
            }
        }
    }

    return true;
}

function getstruct(pai){
    var a = pai.replace(",","$").replace(".","$").replace("`","$").replace("|","").replace("*","");
    var b = a.split("$").slice(0,-1);
    var result = [];
    for (var i = 0; i < b.length; i ++){
        result.push(b[i].length)
    }
    return result;
}

function unmark(pai){
    return pai.replace(",","").replace(".","").replace("`","").replace("|","").replace("*","").replace("$","");
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
    np = np.join();

    if (np.indexOf("*") > -1){
        var rep = np.split("*")[0].split(".")[-1];
        np = np.replace("*",rep);
    }
        
    np = np.replace(",","，").replace(".","。").replace("`","、").replace("|","\n")
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
function write(pai,ys,dir = -1){

}

// 随机选择韵脚
function getrandy(n,bounds=[20,1000]){
    var ze = yun["上"]+yun["去"]+yun["入"];
    var ping = yun["平"]
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