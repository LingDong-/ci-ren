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
    $.getJSON( "ajax/test.json", function(data){
        yun = data;
    });
}

// 在平水韵中找到一个字的平仄
function lookup(zi){
    // return an array of keys in yun (as strings)
    var keys = Object.keys(yun); 
    for (var i = 0; i < keys.length, i++){
        var character_sets = yun[keys[i]];

        for (var j = 0; j < character_sets.length, j ++){
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

}

function guesslast(zi,foo){

}

function guesswithpos(zi,pos,dir){

    D = {};

    var contents = qsc['content'];

    for (var i = 0; i < contents.length; i ++){
        c = contents[i];

        for (var j = 0; j < c.length; i += _cc){
            if (c.substring(i,i+_cc) == zi && j > 0){
                if (!ispunc( c.substring(i+dir*_cc,i+_cc+dir*_cc))) {

                    pis = posinsent(c,i+_cc*dir)

                    if (midsent((pos[0]+(dir+1)/2)%pos[1],pos[1]) == midsent((pis[0]+(-dir+1)/2)%pis[1],pis[1])) {

                        x =  c.substring(i+dir*_cc,i+_cc+dir*_cc);
                        
                        if (Object.keys(D).indexOf(x) == -1){
                            D[x] = 0;
                            D[x] += p.prop;
                        }
                            
                    }
                }

            }
                
        }
    }
    return D
}

function posinsent(c,ind){
    start = 0;
    end = len(c);

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
    if (l == 7 and x == 4){
        return true;
    }
    // 01-23-45
    if (l == 6 and (x == 2 or x == 4){
        return true;
    }
        
    // 01-234
    if (l == 5 and x == 2){
        return true;
    }
    // 01-23
    if (l == 4 and x == 2){
        return true;
    }
    return false;
}

function popularity(zi){
    po = 0
    var contents = qsc['content'];

    for (var j = 0; j < contents.length; j ++){
        c = contents[j];

        for (var i = 0; i < c.length; i += _cc){
            if (c.substring(i,i+_cc) == zi){
                po += 1;
            }
        }
                
    }
    return po
}

function isOK(pai,z,i,yg,usedyg){

}

function repeatOK(zi,result,output,pai){

}

function getstruct(pai){

}

function unmark(pai){

}

function mark(pai,ci){

}

function splitbyy(pai){

}

function poswithstruct(struct,ind){

}

// http://stackoverflow.com/questions/894860/set-a-default-parameter-value-for-a-javascript-function
function write(pai,ys,dir = -1){

}

function getrandy(n,bounds=[20,1000]){
	
}