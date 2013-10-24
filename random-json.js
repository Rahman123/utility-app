'use strict';
var randomString = require('random-string');

var TYPES = {
	DATE : "DATE",
	INTEGER : "INTEGER",
	DOUBLE : "DOUBLE",
	STRING : "STRING",
	TEXTAREA : "TEXTAREA",
	BOOLEAN : "BOOLEAN",
	URL : "URL",
	EMAIL : "EMAIL",
	CURRENCY : "CURRENCY"
};

var MAX_ARRAY_SIZE = 50;
var MAX_VALUE = 100000;
var CURRENCY_SYMBOLS = ['€','$','£'];

module.exports = function randomJson(options){
	options = options || {};
	if(!options.schema){
		return {error: 'Missing schema'};
	}
	var rnd = {};
	console.log(options);
	for(var v in options.schema){
		rnd[v] = _recursiveSchema(v, options.schema);
	}

	return rnd;
}

function _recursiveSchema(field,schema){
	if(!schema ) return "";
	var node = (field)?schema[field]:schema;
	if(!node) return "";

	if(typeof node === 'string'){
		if(node === TYPES.DATE){
			return randomDate(new Date(2000, 0, 1), new Date())
		}
		if(node === TYPES.STRING){
			return randomString({length: randomInteger(30,5), special: true});
		}
		if(node.indexOf(TYPES.INTEGER)===0){
			var opt = node.split(':');
			var max = (opt.length > 1)?opt[1]:null;
			var min = (opt.length > 2)?opt[2]:null;
			return randomInteger(max,min);
		}
		if(node.indexOf(TYPES.DOUBLE)===0){
			var opt = node.split(':');
			var precision = (opt.length > 1)?opt[1]:null;
			var max = (opt.length > 2)?opt[2]:null;
			var min = (opt.length > 3)?opt[3]:null;
			return randomDouble(precision,max,min);
		}
		if(node === TYPES.BOOLEAN){
			return randomBoolean();
		}
		if(node.indexOf(TYPES.URL)===0){
			var opt = node.split(':');
			var protocol = (opt.length > 1)?opt[1]:null;
			return randomURL(protocol);
		}
		if(node === TYPES.EMAIL){
			return randomEmail();
		}
		if(node === TYPES.CURRENCY){
			return randomCurrency();
		}
		if(node.indexOf(TYPES.TEXTAREA)===0){
			var opt = node.split(':');
			var wordsStyle = (opt.length > 1)?opt[1]:null;
			if(!wordsStyle)return randomString({length: randomInteger(2500,100), special: true});
			else return randomWordsString();
		}
		
	}
	else if(typeof node === 'object'){
		if(typeof node.length === 'undefined'){
			var subnode = {};
			for(var v in node){
				subnode[v] = _recursiveSchema(v,node);
			}
			return subnode;
		}else{
			var subnode = [];
			for(var i in node){

				var maxChild = randomInteger(MAX_ARRAY_SIZE);
				for(var x = 0; x < maxChild; x++){
					subnode.push(_recursiveSchema(null,node[i]));
				}
			}
			return subnode;
		}
	}
}


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomInteger(max,min){
	return parseInt(randomDouble(0,max,min));
}

function randomDouble(precision,max,min){
	if(max === null || typeof max === 'undefined' || max.toString().trim().length === 0) max = MAX_VALUE;
	if(min === null || typeof min === 'undefined' || min.toString().trim().length === 0) min = 0;
	max = parseFloat(max);
	min = parseFloat(min);
	if(max < min){
		var tmp = min;
		min = max;
		max = tmp;
	}

	precision = parseInt(precision);
	var result = (min + Math.random()*Math.abs(max-min));
	if(!(precision >=0)) precision = randomInteger(11,0);
	if(precision >= 0) return result.toFixed(precision);
	return result;
}

function randomBoolean(){
	return Math.random() > 0.5;
}

function randomURL(protocol){
	var url = '';
	if(!protocol){
		if(Math.random() > 0.5)	url+= 'http://';
		else url+= 'https://';
	}
	else
		url += protocol+'://';
	if(Math.random() > 0.2) url += 'www';
	else url += randomString({length: 5, numeric:false});

	url += '.';

	url += randomString({length: randomInteger(15,3)});

	url += '.';

	url += randomString({length: 1, numeric: false}) + randomString({length: randomInteger(3,1),numeric: false});

	if(Math.random() > 0.5){
		url += '/'+randomString({length: randomInteger(10,3)})+'.'+randomString({length:3});
	}

	return url.toLowerCase();

}

function randomEmail(){
	var email = '';
	email += randomString({length:randomInteger(7,1),numeric: false})
			+ randomInteger(2)
			+ ((Math.random()>0.5)?'.':'_')
			+ randomString({length:randomInteger(10,1),numeric: false})
			+'@'
			+ randomString({length: 1, numeric: false})+randomString({length:randomInteger(5,2),numeric: false})
			+'.'
			+randomString({length: 2,numeric: false});
	return email.toLowerCase();
}

function randomCurrency(){
	var symbol = randomInteger(3);
	if(symbol===3) symbol = 2;
	return CURRENCY_SYMBOLS[symbol] +' '+formatMoney(randomDouble(2,150000,0),2,'.',',');
}

/* 
decimal_sep: character used as deciaml separtor, it defaults to '.' when omitted
thousands_sep: char used as thousands separator, it defaults to ',' when omitted
*/
function formatMoney (n, decimals, decimal_sep, thousands_sep)
{ 
   var c = isNaN(decimals) ? 2 : Math.abs(decimals); //if decimal is zero we must take it, it means user does not want to show any decimal
   var d = decimal_sep || '.'; //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

   /*
   according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
   the fastest way to check for not defined parameter is to use typeof value === 'undefined' 
   rather than doing value === undefined.
   */   
   var t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep; //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

   var sign = (n < 0) ? '-' : '';

   //extracting the absolute value of the integer part of the number and converting to string
   var i = parseInt(n = Math.abs(n).toFixed(c)) + '';

   var j = ((j = i.length) > 3) ? j % 3 : 0; 
   return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
}

/*
	Random "words"
*/
function randomWordsString(){
	var str = '';
	for(var i = 0; i < randomInteger(2000,100); i++){
		str+=' '+randomString({length: randomInteger(10,2), numeric: false});
	}
	return str.toLowerCase();
}