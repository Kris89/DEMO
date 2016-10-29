
function Spirit(){
	function findBaseBrick(){
		//因为地图的位置在map上就是固定的，所以直接数出来就行了。。。
		var obj = {
			x1:176,
			y1:368,
			x2:240,
			y2:416
		}
		return obj;
	}
	function setXy(){
		var x = parseInt(Math.random()*(map.w - 32));
			console.log(x);
		var	y = parseInt(Math.random()*(map.h - 32));
			console.log(y);
			
			return {x:x,y:y}
	}
	function setBg(type){
		var bgX = 4896 + type*32;
		return bgX
	}
	function Render(obj){
			cxt.save();
			cxt.translate(map.translateX,map.translateY);
			if(obj.tick !== 0 && obj.tick % 30 === 0){
				obj.splash = obj.splash === true ? false :true;
			}
			if(obj.splash){
				//console.log(obj);
				cxt.drawImage(iTank, obj.bgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);	
			}else{
				boom.RenderBoomAfter(obj.x,obj.y);
			}
			cxt.restore();
		}
	return{
		Creat:function(){
			var obj = {};
			//绘制spirit的地方：1,在地图上随机 2,回避基地
			//复杂一点其实应该把spirit一半画在砖块上一半画在轨道上 ??
			//var pos = setXy();
				obj.x = parseInt(Math.random()*(map.w - 32));
				obj.y = parseInt(Math.random()*(map.h - 32));
				obj.w = 32;
				obj.h = 32;
				//obj.type = parseInt(Math.random()*6),
				obj.type = 5;
				obj.bgX = setBg(obj.type);
				obj.bgY = 0;
				obj.tick = 0;
				obj.stopTime = 7;
				obj.splash = true;
				allSpirits.push(obj);
				//console.log("创建了一个闪烁奖励！");		
		},
		Splashing:function(){
			for (var i = 0; i < allSpirits.length; i++) {
				//console.log(allSpirits.length);
				var obj = allSpirits[i];
				var stopTime = parseInt(obj.stopTime * 1000 / 16);
				if(obj.tick === stopTime){
					obj.tick = 0;
					spirit.Clear(obj);
					spirit.Dele(i);
				}else{
					obj.tick++;
					Render(obj);
				}		
			}
		},
		Clear:function(obj){
			cxt.save();
			cxt.translate(map.translateX,map.translateY);
			boom.RenderBoomAfter(obj.x,obj.y);
			cxt.restore();
		},
		Dele:function(i){
			allSpirits.splice(i,1);
		}		
	}
}