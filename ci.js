var yun = {ping : [], shang : [], qu : [], ru : []}

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
function makeyun(){
	for (var i = 0; i < lines.length, i++){
		if ("声" in lines[i] && "：" in lines[i]){
			// string operations to get rid of comments
            // append the lines to the yun object 
		}
	}
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

// 分析数据库每一行信息类型
function linetype(sc,i){

}

function classify(){

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

}

function posinsent(c,ind){

}

function midsent(x,l){

}

function popularity(zi){

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