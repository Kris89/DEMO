
//构造函数方法
function Tank(){
	this.rendertick = 0;
	this.enemy = {
		maxNum:4,
		nowNum:0,
		id:'npc',
		tick:0,
		created:0
	}
	this.player1 = {id:'player1',life:3}
	this.player2 = {id:'player2',life:3}
}

Tank.prototype.setTankBgdata = function(obj){
		if(obj.id === 'npc'){
			obj.bgX = obj.pos + obj.bgTopX + obj.tyre + obj.bonusTopX;
		}else{
			obj.bgX = obj.pos + obj.bgTopX + obj.tyre;
		}
}
Tank.prototype.setTankBgdata_dir = function(obj){
		switch(obj.dir){
			case 't':obj.pos = 0;break;
			case 'r':obj.pos = 1152;break;
			case 'b':obj.pos = 2304;break;
			case 'l':obj.pos = 3456;break;
		}
}
	//同时这个函数也负责创建或者覆盖所有跟obj.type有关的数据，这个后续再添加
Tank.prototype.setTankBgdata_bgtopX = function(obj){
		if(obj.id === 'npc'){
			switch(obj.type){
				case 1 :obj.bgTopX = 256;obj.bulletMax = 1;obj.bulletspeed = 4;break;
				case 2 :obj.speed = 2;obj.bgTopX = 320;obj.bulletspeed = 3;break;
				//这里不知道是一个什么bug,obj.speed设为3坦克就开始吃砖
				case 3 :obj.bgTopX = 384;obj.bulletspeed = 2;break;
				case 4 :obj.bgTopX = 448;obj.bulletspeed = 2;break;
			}
		}else{

			if(obj.id === 'player1'){
			//console.log(obj.id);
			switch(obj.type){
				case 1 :obj.bgTopX = 0 ;obj.bulletMax = 1;obj.bulletspeed = 4;break;
				case 2 :obj.bgTopX = 32 ;obj.bulletMax = 1;obj.bulletspeed = 5;break;
				case 3 :obj.bgTopX = 64 ;obj.bulletMax = 2;obj.bulletspeed = 5;break;
				case 4 :obj.bgTopX = 96 ;obj.bulletMax = 1;obj.bulletspeed = 5;break;
			}
		}
			if(obj.id === 'player2'){
				switch(obj.type){
					case 1 :obj.bgTopX = 128 ;break;
					case 2 :obj.bgTopX = 160 ;break;
					case 3 :obj.bgTopX = 192 ;break;
					case 4 :obj.bgTopX = 224 ;break;
				}
			}
		}
}
Tank.prototype.setTankBgdata_tyre = function(obj){
		obj.tyre = obj.tyre === 0 ? 576 : 0;
}
Tank.prototype.setTankBgdata_bonus = function(obj){
		if(obj.bonusTick % 20 === 0 && obj.bonus){
			obj.bonusTopX = obj.bonusTopX === 0 ? 32 : 0;
		}
		//console.log('obj.bonus');
		obj.bonusTick++;
}


Tank.prototype.Creat = function(id){
		var obj = id === 'npc' ? {id:'npc'} : id === 'player1' ? this.player1 : this.player2;
			obj.w = 32;
			obj.h = 32;
			//obj.speed = 2;
			obj.bgY = 0;
			obj.moveT = obj.moveB = obj.moveR = obj.moveL = false; 
			obj.status = 0;
			obj.tyre = 0;
			obj.bulletnowlen = 0;
			obj.btn = false;//这个数据在哪里被调用和维护？
		if(obj.id === 'npc'){
			obj.x = parseInt(Math.random()*3)*192;
			obj.y = 0;
			obj.dir = 'b';
			obj['move' + obj.dir.toUpperCase()] = true;
			obj.type = enemyData[gameplay.nowpass][this.enemy.created];
			obj.speed = 1;
			//obj.bonus = bonusMap[parseInt(Math.random()*20)];
			obj.bonus = true;
			obj.bonusTopX = 0;
			obj.bonusTick = 0;
			obj.tick = 0;
			obj.bultick = 0;
			obj.num = this.enemy.created;
			obj.over = false;//over是谁需要并维护的数据？	
		}else{
			obj.speed = 2;
			obj.dir = 't';
			obj.heap = 0;
			obj.pro = false;
			if(obj.id == 'player1'){
			obj.x = 128;
			obj.y = 384;
			obj.type = 1;
			}
		if(obj.id == 'player2'){
			obj.x = 
			obj.y = 
			obj.type = 1;
			}
		}	
		this.setTankBgdata_bgtopX(obj);
		this.setTankBgdata_dir(obj);
		obj.bonus && this.setTankBgdata_bonus(obj);
		this.setTankBgdata(obj);	
		allTanks.push(obj);
		(obj.id === 'player1') && (this.player1.life--,console.log(this.player1.life)) ;
	}

Tank.prototype.Move = function(){
		var len = allTanks.length;
		for( var i = 0;i < len;i++){
		//	console.log(i);
			var obj = allTanks[i];
				obj.btn = false;
				if(obj.status === 0){
					continue
				} 
			if(obj.moveT || obj.moveL || obj.moveB || obj.moveR){
				obj.oldDir !== obj.dir &&  this.PosRevise(obj),this.setTankBgdata_dir(obj),this.setTankBgdata(obj);
				obj.id === 'npc' && this.setTankBgdata_bonus(obj),this.setTankBgdata(obj);
				this.setTankBgdata_tyre(obj);this.setTankBgdata(obj);
				if(obj.id === 'npc'){
					var NPCbullet = parseInt(1.5 * 1000 / 16);
					if(obj.bultick === NPCbullet){
						 obj.bultick = 0;
						// obj.bulletnowlen++;
						 obj.bullet = true;
						 bullet.Creat(obj,obj.bullet);
					}else{
						obj.bultick++;
					}		
				}
				if(test.Edge(obj) || test.Brick(obj) || test.TankTank(obj,i)){
					obj.btn = true;
				}
				if(obj.btn){
					if(obj.id === 'npc'){
					//敌军坦克 换向 + 换向延迟	
						var NPCchangeDirdelay = parseInt(0.5 * 1000 / 16);
						if(obj.tick === NPCchangeDirdelay ){
							obj.tick = 0;
							this.NPCchangeDir(obj);
							continue
						}else{
							obj.tick++;
							continue
						}
					}else{
						continue
					}	//原来写的是return 这里只能跳出循环而不能结束当前进程...
				}

				/*--------------------------------
				子弹与坦克的检测只能写在bullet.Move里
				因为写在tank.move里会造成只在坦克移动的时候才去检测周遭有无子弹*/
				//玩家坦克spirit检测
				if(obj.id !== 'npc'){
					test.Spirit(obj);
				}
				switch(obj.dir){
				case 't': obj.y -= obj.speed;break;
				case 'b': obj.y += obj.speed;break;
				case 'l': obj.x -= obj.speed;break;
				case 'r': obj.x += obj.speed;break;
			 	}
			}
		}
	}
Tank.prototype.PosRevise = function(obj){
		//坦克转弯后，中心点会正对砖块契合处
		if((obj.oldDir === 't' || obj.oldDir === 'b') && (obj.dir === 'l' || obj.dir === 'r')){
			if((obj.y + map.brickH) % map.brickH < map.brickH / 2){
				obj.y = obj.y - obj.y % map.brickH;
			}else{
				obj.y = obj.y + map.brickH - obj.y % map.brickH;
			}
		}else if((obj.oldDir === 'l' || obj.oldDir === 'r') && (obj.dir === 't' || obj.dir === 'b')){
			if((obj.x + map.brickW) % map.brickW > map.brickW / 2){
				obj.x = obj.x + map.brickW - obj.x % map.brickW;
			}else{	
				obj.x = obj.x - obj.x % map.brickW;
			}
		}
	}
Tank.prototype.Render = function(){
		//console.log(allTanks.length);
		cxt.save();
		cxt.translate(map.translateX,map.translateY);
		for(var i = 0;i<allTanks.length;i++){
			var obj = allTanks[i];
			if(obj.status === 0){
				this.tankStatusZ(obj);
			}	
			if(obj.status === 1){
				cxt.drawImage(iTank, obj.bgX, obj.bgY, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
			}		
		}
		cxt.restore();
	}

Tank.prototype.NPCchangeDir = function(obj){
		obj.oldDir = obj.dir;
		obj['move'+ obj.oldDir.toUpperCase()] = false;
		var d = ['t','b','l','r'];
		obj.dir = d[parseInt(Math.random()*4)];
		obj['move' + obj.dir.toUpperCase()] = true;
	}
Tank.prototype.Bulleted = function(obj,i){
	if(obj.id !== 'npc'){
		//id = tank1 2 
		if(obj.heap){
			obj.type--;
			this.setTankBgdata_bgtopX(obj);
			this.setTankBgdata(obj);
			obj.heap = 0;
			return;
		}else{
		allTanks.splice(i,1);
		if(this.player1.life >= 0){	
			this.Creat('player1');
			console.log(this.player1.life);
			}else{
				gameplay.play = false;
				gameover.over = true;
			}
		}
	}else{
		obj.bonus && spirit.Creat();
		allTanks.splice(i,1);
		this.enemy.nowNum--;
		//console.log(this.enemy.nowNum);
		}
}
Tank.prototype.enemyCreat = function(){
	if(gameplay.nowpass === 1){console.log(this.enemy.created);console.log('enemyCreat被调用')}
		var t = 0;
		if( this.enemy.created < 20 ){
			if(this.enemy.nowNum >= this.enemy.maxNum){
				return 
			}
			if(this.enemy.created === 0){
				t = parseInt(1 * 1000 / 16);
				if(this.enemy.tick === t){
					this.enemy.tick = 0;
					this.Creat('npc');
					this.enemy.created++;
					this.enemy.nowNum++;
				}else{
					(gameplay.nowpass === 1) && (console.log(this.enemy.tick))
					this.enemy.tick++;
					return
				}
			}else{
				t = parseInt( 3 * 1000 / 16);
				if(this.enemy.tick === t){
					this.enemy.tick = 0;
					this.Creat('npc');
					this.enemy.created++;
					this.enemy.nowNum++;
				}else{
					this.enemy.tick++;
					return
				}  
			}	
		}else{
			if(this.enemy.nowNum === 0){	
				if(this.enemy.tick < parseInt(2 * 1000 / 16)){
					this.enemy.tick++;
				}else{
					this.enemy.tick = 0;
					gameplay.gonext.is = true;
				}
			}
			return
		}
}
Tank.prototype.clear = function(){
					cxt.save();
					cxt.translate(map.translateX, map.translateY);
					//清除所有坦克
					cxt.fillStyle = '#000';
					for(var i = 0; i < allTanks.length; i++){
						var obj = allTanks[i];
						cxt.fillRect(obj.x, obj.y, obj.w, obj.h);
						}
					cxt.restore();
}
Tank.prototype.tankStatusZ = function(obj){
		this.rendertick++;
		var holdtime = parseInt(1 * 1000 / 16);
		if(this.rendertick < holdtime){
			cxt.drawImage(iTank, 4608 + 32 * [parseInt(this.rendertick % 18 / 6)],
			 0, obj.w, obj.h, obj.x, obj.y, obj.w, obj.h);
		}else{
			//(obj.id !== 'npc') && (obj.pro = true);
			//(obj.id ==='npc') && (obj.status = 1);
			obj.status = 1;
			this.rendertick = 0;
		}
	}

	/*
	setPlayerStronger:function(obj){
		if(obj.type < 4){
			obj.type++;
			this.setTankBgdata_bgtopX(obj);
			this.setTankBgdata(obj);
			if(obj.type === 4){
				obj.heap = 1;
				console.log(obj.heap);
			}
		}
	},
	addPlayerlife:function(obj){
		if(player1.life < 6){
			player1.life++;
			console.log(tank1.life);
		}
	}
	playerPro:function(obj){
		this.rendertick++;
		var holdtime = parseInt( 3 * 1000 / 16);
		if(this.rendertick < holdtime){
			if(this.rendertick % 6 < 3){
				cxt.drawImage(iMisc,32,0,32,32,obj.x,obj.y,32,32);
			}
			else{
				cxt.drawImage(iMisc,64,0,32,32,obj.x,obj.y,32,32);
			}
		}else{
			obj.pro = false;
			obj.status = 1;
			this.rendertick = 0;
		}
	}

*/