console.log('Loading a web page');
var page = require('webpage').create();
// var url = 'https://mp.weixin.qq.com/s?__biz=MzAxNTMxMTc0MA==&mid=400973708&idx=1&sn=17039156089da3bcf9ed81170b9c6103&scene=21#wechat_redirect';
var lastHeight = 0;
var scrollStayTime = 500;
var printPdfStayTime = 2000;

var system = require('system');
var args = system.args;

if(args.length < 3){
	console.log("Error: invalid args");
	phantom.exit();
}
var dir = args[1];
var url = args[2];
// console.log("Args=" + args);

function printPdf(){
	var split = page.title.split("#");
	console.log("tile split.length=" + split.length + ", split=" + split);
	var name = page.title + ".pdf";

	if(split.length == 2){
		name = "#" + split[1].trim() + " " + split[0].trim() + ".pdf";	
	} 
	name = dir + name;
	var ret = page.render(name);
	console.log("PDF name=" + name + ", rsult=" + ret);
	phantom.exit();
}

page.viewportSize = {
	width: 720,
	height: 1280
};

function getTotalHeight(){
	return page.evaluate(function(){
		return document.body.scrollHeight;
	});
}

function getCurHeight(){
	return page.evaluate(function(){
		return document.body.scrollTop;
	});
}

function doScroll(){
	page.evaluate(function(){
		window.scrollTo(0, document.body.scrollTop + 1280);
	});

	var height = getTotalHeight();
	var curHeight = getCurHeight();

	console.log("doScroll curHeight=" + curHeight + ", totalHeight=" + height);

	if (curHeight == lastHeight) {
		console.log("end scroll.");
		setTimeout(printPdf, printPdfStayTime);
	} else {
		lastHeight = curHeight;
		setTimeout(doScroll, scrollStayTime);		
	}
}

function initScroll() {
	console.log("initScroll.");
	page.evaluate(function(){
		window.scrollTo(0, 0);
	});
	setTimeout(doScroll, scrollStayTime);
}

page.open(url, function (status) {
	console.log("loadFinish. title=" + page.title);
	if(page.title.length == 0){
		console.log("title is null, might be blocked.");
		phantom.exit();
		return;
	}
	setTimeout(initScroll, scrollStayTime);
});