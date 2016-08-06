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

function sortdict(mydict){

}

function guessnext(zi){

}

function guesslast(zi,foo){

}

function guesswithpos(zi,pos,dir){

    D = {}

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

}

function midsent(x,l){

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