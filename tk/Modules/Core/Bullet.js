


function Bullet(){
	console.log("调用子弹构造函数");
}

Bullet.prototype = {
	Creat:function(objParent,bullet){
		//bullet的绘制需要知道其发射坦克的炮嘴位置，所以createbulet的调用需要在获取到坦克对象的时候发生
		//我方坦克创建子弹的时机在于keydown+j事件
		if(!bullet){
			//console.log("达到子弹上限不能创建子弹")
			return
		}
		//console.log(objParent.id);
		var parent = objParent,
			obj = {};
			obj.w = 8;
			obj.h = 8;
			obj.bgy = 0;
			obj.speed = parent.bulletspeed;
			obj.parent = parent;
			obj.status = 1; 
			obj.dir = parent.dir;
			obj.id = "bullets";
			obj.testTick = 0;
			obj.dele = false;
			if(parent.id !== 'npc' && parent.type === 4){
				obj.type = 2;
				obj.attack = 2;

			}else{
				obj.type = 1;
				obj.attack = 1;
			}
			 
			//这段赋值不是只能在create被调用的时候进行一次吗？
			//为毛tank改变方向了子弹也改变方向？？
		switch(obj.dir){
			case 't':obj.bgx = 0;obj.x = parent.x + parent.w/2 - obj.w/2;obj.y = parent.y - obj.h;break;
			case 'r':obj.bgx = 8;obj.x = parent.x +parent.w;obj.y = parent.y - obj.h/2 + parent.h/2;break;
			case 'b':obj.bgx = 16;obj.x = parent.x + parent.w/2 - obj.w/2;obj.y = parent.y + parent.h;break;
			case 'l':obj.bgx = 24;obj.x = parent.x - obj.w;obj.y = parent.y - obj.h/2 + parent.h/2;break;
		}

		allBullets.push(obj);
		//if(obj.parent.id === 'tank1'){console.log('tank1创建子弹了');}
		//console.log(obj);
		//console.log(allBullets.length);

	},
	Render:function(){
		cxt.save();
		cxt.translate(map.translateX,map.translateY);
		for (var i = 0; i < allBullets.length; i++) {
			var obj = allBullets[i];
			cxt.drawImage(iMisc,obj.bgx,obj.bgy,obj.w,obj.h,obj.x,obj.y,obj.w,obj.h);
			//if (obj.parent.id === 'tank1') {console.log('绘制了tank1的子弹');}
		}
		cxt.restore();
	},
	Move:function(){
		for (var i = 0; i < allBullets.length; i++) {
			var obj = allBullets[i];
			//console.log(obj);
			//console.log("bullet Move被"+ obj.parent.id+"调用");
			if(test.Edge(obj) || test.Brick(obj)){
				this.Hide(obj);
			//obj.testTick === 0 && 
			boom.Creat(obj,"small");//传入子弹的临时变量，由哪颗子弹引起的爆炸就传入哪颗子弹的数据
				
			//	boom.RenderBoomAfter();
			obj.parent.bulletnowlen--;	
			allBullets.splice(i,1);
			//obj.testTick++;
				continue
			}
			if(obj.parent.id === 'tank1'){
				//console.log("进入检测tank1的bullet bullet");
				if(test.BulletBullet(obj,i)){
					//console.log('要删除了哟');
					this.Hide(obj);
					obj.dele = true;
					obj.parent.bulletnowlen--;
					//obj = null;
					//console.log('tank1被置null');
					this.Delet();
					//console.log('删除/消失了吗');
					continue
				}
			}
			//子弹坦克检测
			if(test.BulletTank(obj)){
				//console.log('bullet tank test true')
				this.Hide(obj);
				if(obj.parent.id !== 'npc'){
					obj.parent.bulletnowlen--;
				}
				obj.dele = true;
				this.Delet();
				continue
			}

			switch(obj.dir){
				case 't':obj.y = obj.y - obj.speed;break;
				case 'b':obj.y = obj.y + obj.speed;break;
				case 'l':obj.x = obj.x - obj.speed;break;
				case 'r':obj.x = obj.x + obj.speed;break;
			}
		}		
	},
	Clear:function(obj){
		cxt.save();
		cxt.translate(map.translateX,map.translateY);
		cxt.fillstyle = "#000";
		for (var i = 0; i < allBullets.length; i++) {
			var obj = allBullets[i];
			cxt.fillRect(obj.x,obj.y,obj.w,obj.h);
		}	
		cxt.restore();
	},
	Hide:function(obj){
		cxt.save();
		cxt.translate(map.translateX,map.translateY);
		cxt.fillstyle = "#000";
		cxt.fillRect(obj.x,obj.y,obj.w,obj.h);
		cxt.restore();
	},
	Delet:function(){
		//console.log('要对dele=true进行删除');
		for (var i = 0; i < allBullets.length; i++) {
			var del1 = allBullets[i];
			if(del1.dele){
				//console.log(obj);
				allBullets.splice(i,1);
			}
		}
		for (var i = 0; i < allBullets.length; i++) {
			var del2 = allBullets[i];
			if(del2.dele){
				allBullets.splice(i,1);
			}
		}	
	}

	
}