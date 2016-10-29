
function Boom() {
	
	return {
		Creat:function(bullet,id){
			var obj = {};
			obj.id = id;
			obj.status = 0,
			obj.bgY = 0,
			obj.bgX = 64,
			obj.w = obj.h = 64;
			obj.bulletMoveTick = bullet.testTick;
			var x = bullet.x,
				y = bullet.y;
			switch(bullet.dir){
				case 't' : x = x + 4; y = y; break;
				case 'b' : x = x + 4; y = y + bullet.h; break;
				case 'l' : x = x; y = y + 4; break;
				case 'r' : x = x + bullet.w; y = y + 4; break;	
			}
			obj.x = x - 32;
			obj.y = y- 32;

			allBooms.push(obj);
		},
		//Big_Creat:function(){},
		Render:function(){
			//console.log('爆炸的render被main调用');
			cxt.save();
			cxt.translate(map.translateX,map.translateY);
			cxt.fillStyle = '#000';
			for(var i = 0;i < allBooms.length;i++){
				var boom = allBooms[i];
				if(boom.id === "small"){
					if(boom.bulletMoveTick === 0){
						cxt.drawImage(iBoom, boom.bgX, boom.bgY, boom.w, boom.h, boom.x, boom.y, boom.w, boom.h);
						}//tick = 0的时候，渲染一遍，之后不管它，tick = 5 的时候才renderboomafter
					boom.bulletMoveTick++;
					if(boom.bulletMoveTick === 5){
						this.RenderBoomAfter(boom.x,boom.y);
						allBooms.splice(i,1);
						}	
				}else{
					//bgX初始化为64，小boom图片的位置 status = 0
					//status = 1   中boom图片的位置在64+64 
					//status = 2    大boom图片的位置在64+64+64
					if( boom.bulletMoveTick === 0 ) {
						boom.status !== 0 && this.RenderBoomAfter(boom.x,boom.y);
						boom.bgX = 64 + boom.status*64;
						cxt.drawImage(iBoom, boom.bgX, boom.bgY, boom.w, boom.h, boom.x, boom.y, boom.w, boom.h);	
						//bulletMoveTick === 5 && boom.status ++,bulletMoveTick = 0;
					}
					//console.log(boom.status,boom.bgX);
					boom.bulletMoveTick++;
					if(boom.bulletMoveTick === 3 ){
						boom.bulletMoveTick = 0;
						boom.status ++;
					}
					if(boom.status > 2){
						this.RenderBoomAfter(boom.x,boom.y);
						allBooms.splice(i,1)
					}
					/*if(){
						boom.bgX = boom.bgX + boom.status*boom.w;
						cxt.drawImage(iBoom, boom.bgX, boom.bgY, boom.w, boom.h, boom.x, boom.y, boom.w, boom.h);
						boom.bulletMoveTick++;
						bulletMoveTick === 10 && boom.status = 2;
					}*/		
				}
			}		
			cxt.restore();	
		},
		RenderBoomAfter:function(boomX,boomY){
			var x = boomX,y = boomY;
			var w = 64;
			var h = 64;
			cxt.save();
			//cxt.translate( map.translateX, map.translateY);
			cxt.fillStyle = '#666666';
			cxt.fillRect(x, y, w, h);
			cxt.fillStyle = '#000';
			x <= 0 ? x = 0 : x = x;
			y <= 0 ? y = 0 : y = y;
			x + w >= 416 ? w = 416 - x : w = 64;
			y + h >= 416 ? h = 416 - y : h = 64;
			cxt.fillRect( x, y, w, h);
			x -= x % 16;
			y -= y % 16;
			var initX = x;
			for(var i = 0; i < 5; i++, y += 16){
				x = initX;
				for(var j = 0; j < 5; j++, x += 16){
					var brick = allBricks[y / 16 * 26 + x / 16];
					brick && brick.type != 0 && cxt.drawImage(iTerr, brick.bgX, brick.bgY, brick.w, brick.h, brick.x, brick.y, brick.w, brick.h);
				}
			}
			cxt.restore();
		}
	}
}