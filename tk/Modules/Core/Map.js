
//工厂方法
function gameMap(){

	function setBrick_Type(){
	//	console.log(gameplay);
		for(var i = 0;i < mapData[gameplay.nowpass].length ;i++){
			var obj = {};
			obj.type = mapData[gameplay.nowpass][i];
			allBricks.push(obj);
		}	
	}
	function setBrick_PositionXy(){
			var k = 0;
		//	console.log('执行setBrick_PositionXy');
			for(var i = 0;i < map.row;i++ ){
				//console.log(i);
				for (var j = 0; j < map.colunm; j++) {
					//console.log(j);
					
					allBricks[k].y = i*map.brickH;
					allBricks[k].x = j*map.brickW;
					k++;
				//	console.log('allBricks[k]:'+k);
				}
			}
		
		
	}
	function setBrick_BgX(){
		//console.log('执行setBrick_BgX');
		for (var i = 0; i < allBricks.length ; i++) {
			var obj = allBricks[i];
				obj.bgX = obj.type*16;
				obj.bgY = 0;
				obj.w = map.brickW;
				obj.h = map.brickH;
				var type = obj.type;
				if(obj.type === 2){
					//console.log(i);
				}
			(type === 1 || type === 2 || type === 4 || type === 6 || type === 7 || type === 8 || type === 9)
			 && (obj.stopMove = true);
			(type === 6 || type === 7 || type === 8 || type === 9) && (obj.base = true);
		}
	}
	function renderBase(obj){
		cxt.save();
		cxt.translate(map.translateX,map.translateY);	
		cxt.drawImage(iTerr, obj.bgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);	
		cxt.restore();
	}
	return {
		Creat:function(){
			setBrick_Type();
			setBrick_PositionXy();
			setBrick_BgX();
		},
		Render:function(){
		cxt.save();
		//cxt.fillStyle = '#666';
		//cxt.fillRect(0,0,538,490);
		cxt.translate(map.translateX, map.translateY);
		cxt.fillStyle = '#000';
		cxt.fillRect(0, 0, map.w, map.h);
		var len = mapData[gameplay.nowpass].length;
		//type = 0的砖块为黑色，和地图底色一样，无需再次渲染
		for(var i  = 0; i < len ; i++){
			var obj = allBricks[i];
			//console.log(obj.type);
		obj.type !== 0 && cxt.drawImage(iTerr, obj.bgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
		}
		//console.log('allBricks.length:'+allBricks.length)
		cxt.restore();
		},
		BulletChange_BrickData:function(brick,bullet){
			if(brick.type === 1){
				if(brick.x > bullet.x + bullet.w || brick.x + brick.w < bullet.x ||
				 brick.y > bullet.y + bullet.h || brick.y + brick.h < bullet.y){//这块是为了检测子弹在不在轨道上？，？？
					return false;
				}
				else{
					switch(bullet.dir){
						case 't' :brick.h -= bullet.attack * 8;break;
						case 'b' :brick.h -=bullet.attack * 8;brick.bgY = 8;brick.y += bullet.attack * 8;break;
						case 'l' :brick.w -=bullet.attack * 8;brick.bgX = 24;break;
						case 'r' :brick.w -=bullet.attack * 8;brick.x += bullet.attack * 8;break;
					}
					
					if (brick.w <= 0 || brick.h <= 0){
						brick.w = brick.h = 0;
						brick.type = 0;
						brick.stopMove = false;
					}
				//	console.log(map.tick);
					map.tick++;
					
					return true;
				}
			}
			if(brick.type === 2){
			//	console.log(brick.type);
				if (bullet.type === 2 ){
					brick.w = brick.h = 0;
					brick.type = 0;
					brick.stopMove = false;
				}
				return true;
			}
		},
		setBaseProtect:function(type){
			var baseBrick = base.findBaseBrick();//获取基地外层砖块
			for (var i = 0; i < baseBrick.length; i++) {
				var j = baseBrick[i],
				brick = allBricks[j];
				console.log(j);
				brick.type = type;
				brick.bgX = brick.type*16;
				brick.bgY = 0;
				brick.w = map.brickW;
				brick.h = map.brickH;
				brick.y = parseInt(j / 26) * map.brickH;
				brick.x =parseInt(j % 26) * map.brickW;
				brick.stopMove = true;
				renderBase(brick);
			}//重置基地砖块数据
		},
		baseBroke:function(){
			for (var i = 0; i < base.length; i++) {
				console.log( base.length);
				var b = base[i];
					allBricks[b].bgX = 16*(10 + i);
					renderBase(allBricks[b]);
			}
		}
	}
}

