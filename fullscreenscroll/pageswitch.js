
(function($){
	var defaults = {
		'container' : '#container',//容器
		'sections' : '.section',//子容器
		'easing' : 'ease',//特效方式，ease-in,ease-out,linear
		'duration' : 1000,//每次动画执行的时间
		'pagination' : true,//是否显示分页
		'loop' : false,//是否循环
		'keyboard' : true,//是否支持键盘
		'direction' : 'vertical',//滑动的方向 horizontal,vertical,
		'onpageSwitch' : function(pagenum){}
	};

	var win = $(window),
		container,sections;

	var opts = {},
		canScroll = true;

	var iIndex = 0;

	var arrElement = [];

	var SP = $.fn.switchPage = function(options){
		opts = $.extend({}, defaults , options||{});//$.extend()怎么用我并不清楚，但这里的意思是数据整合

		container = $(opts.container),//获取container dom
		sections = container.find(opts.sections);//获取container里section dom

		sections.each(function(){//now sections is a数组
			arrElement.push($(this));//$(this)获取.section的dom节点装入arrElement
		});

		return this.each(function(){//这个this是当前jQuery实例对象，不同于sections是一个数组
			//按照老师的讲解，这里这个each是为了实现链式调用，但我不知道这里这个each方法与sections.each()有什么异同
			//这里这个 return this.each()我不能理解
			if(opts.direction == "horizontal"){
			initLayout();
			}

			if(opts.pagination){
				initPagination();
			}

			if(opts.keyboard){
				keyDown();
			}

		});
	}

	//滚轮向上滑动事件
	//SP.moveSectionUp调用scrollPage()
	//moveSection修改iIndex；
	SP.moveSectionUp = function(){//这里注意SP.意思是这个movesectionup函数是定义在jQuery原型对象里的
		if(iIndex){//只有iIndex为零的时候才false
			iIndex--;
		}else if(opts.loop){//这一块在写代码的时候要去写详细的流程分析图
			iIndex = arrElement.length-1;
		}
		scrollPage(arrElement[iIndex]);
	};

	//滚轮向下滑动事件
	SP.moveSectionDown = function(){
		if(iIndex<(arrElement.length-1)){
			iIndex++;
		}else if(opts.loop){
			iIndex = 0;
		}
		scrollPage(arrElement[iIndex]);
	};

	//私有方法
	//页面滚动事件
	//页面滑动以每一页为单位，所以叫scrollPage
	//以每一页为单位，然后就是向上滑动一页，向下滑动一页
	function scrollPage(element){
		var dest = element.position();
		if(typeof dest === 'undefined'){ return; }//当iIndex=0时dest返回就是空的
		initEffects(dest,element);
	}

	//重写鼠标滑动事件
	$(document).on("mousewheel DOMMouseScroll", MouseWheelHandler);
	function MouseWheelHandler(e) {
		e.preventDefault();
		var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
		var delta = Math.max(-1, Math.min(1, value));
		if(canScroll){
			if (delta < 0) {
				SP.moveSectionDown();
			}else {
				SP.moveSectionUp();
			}
		}
		return false;//到了return false就是说本配置不支持滚轮事件
	}

	//横向布局初始化
	function initLayout(){
		var length = sections.length,
			width = (length*100)+"%",
			cellWidth = (100/length).toFixed(2)+"%";
		container.width(width).addClass("left");
		sections.width(cellWidth).addClass("left");
	}

	//初始化分页
	function initPagination(){
		var length = sections.length;
		if(length){

		}
		var pageHtml = '<ul id="pages"><li class="active"></li>';
		for(var i=1;i<length;i++){
			pageHtml += '<li></li>';
		}
		pageHtml += '</ul>';
		$("body").append(pageHtml);
	}

	//分页事件
	function paginationHandler(){
		var pages = $("#pages li");
		pages.eq(iIndex).addClass("active").siblings().removeClass("active");
	}

	//是否支持css的某个属性
	function isSuportCss(property){
		var body = $("body")[0];
		for(var i=0; i<property.length;i++){
			if(property[i] in body.style){
				return true;
			}
		}
		return false;
	}

	//渲染效果
	//initEffects()是实现移动效果的底层执行函数：
	//1.移动的dom节点是container；
	//2.根据当前.section去定位container，需要获取的参数就是.section的坐标值；
	//3.transition transform的正确使用；
	//4.给当前.section dom添加active伪类；
	//5.如果分页还要改变分页的样式
	function initEffects(dest,element){//dest参数是执行这一程序的核心参数
		var transform = ["-webkit-transform","-ms-transform","-moz-transform","transform"],
			transition = ["-webkit-transition","-ms-transition","-moz-transition","transition"];

		canScroll = false;//canScroll是为了解决什么问题的？
		if(isSuportCss(transform) && isSuportCss(transition)){
			var traslate = "";
			if(opts.direction == "horizontal"){
				traslate = "-"+dest.left+"px, 0px, 0px";//浏览器窗口固定不动；sections被装在container里；让container相对于浏览器移动
			}else{
				traslate = "0px, -"+dest.top+"px, 0px";
			}
			container.css({//移动的原理：
				//1.根据iIndex确定当前是哪个.section的dom节点;（这一歩是moveSection做的）
				//2.获取当前.section dom节点的位置坐标；（scrollPage()获取dest；dest.lef获取具体translate）
				//3.根据.section dom位置坐标去定位container；
				//4.滑过去
				"transition":"all "+opts.duration+"ms "+opts.easing,
				"transform":"translate3d("+traslate+")"
			});
			container.on("webkitTransitionEnd msTransitionend mozTransitionend transitionend",function(){
				canScroll = true;
			});
		}else{
			var cssObj = (opts.direction == "horizontal")?{left: -dest.left}:{top: -dest.top};
			container.animate(cssObj, opts.duration, function(){
				canScroll = true;
			});
		}
		element.addClass("active").siblings().removeClass("active");//element 为.section dom 在initeffects里只作用这一个地方
		if(opts.pagination){//检测是否分页
			paginationHandler();
		}
	}

	//窗口Resize
	var resizeId;
	win.resize(function(){
		clearTimeout(resizeId);
		resizeId = setTimeout(function(){
			reBuild();
		},500);
	});

	function reBuild(){
		var currentHeight = win.height(),
			currentWidth = win.width();

		var element = arrElement[iIndex];
		if(opts.direction == "horizontal"){
			var offsetLeft = element.offset().left;
			if(Math.abs(offsetLeft)>currentWidth/2 && iIndex <(arrElement.length-1)){
				iIndex ++;
			}
		}else{
			var offsetTop = element.offset().top;
			if(Math.abs(offsetTop)>currentHeight/2 && iIndex <(arrElement.length-1)){
				iIndex ++;
			}
		}
		if(iIndex){
			paginationHandler();
			var cuerrentElement = arrElement[iIndex],
				dest = cuerrentElement.position();
			initEffects(dest,cuerrentElement);
		}
	}

	//给window对象绑定键盘事件
	//keydown（）的函数调用为SP.moveSection
	//keydown():1.给window对象绑定键盘事件；设置设置回调函数；2.根据键盘值选择调用SP.moveSectionUp or SP.moveSectionDown
	function keyDown(){
		var keydownId;
		win.keydown(function(e){//win.keydown是window对象的keydown事件，其中keydown是jQuery整合好的浏览器事件
			clearTimeout(keydownId);//clearTimeout的使用，其实并不一定非要var keydownId
			keydownId = setTimeout(function(){//如果不清除setTimeout的话可能keydown事件只能触发一次
				var keyCode = e.keyCode;//读取window对象的keycode属性
				if(keyCode == 37||keyCode == 38){
					SP.moveSectionUp();//由keydown调用SP.moveSectionUp
				}else if(keyCode == 39||keyCode == 40){
					SP.moveSectionDown();
				}
			},150);
		});
	}
})(jQuery);