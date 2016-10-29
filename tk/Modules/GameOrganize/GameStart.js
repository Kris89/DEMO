function GameStartModule(){
	this.start = true,
	this.tick = 0,
	this.playtype = 1,
	this.status = 1
}

GameStartModule.prototype.renderStatic = function(){
	var y = 490 - this.tick * 2;
	if(this.tick < 207){
	cxt.save();
	//刷黑画布
	cxt.fillStyle = '#000';
	cxt.fillRect(0,0,538,490);
	//定义写的字
	cxt.fillStyle = '#fff';
	cxt.font = "22px Arial Black";
	cxt.textAlign = 'left';
	cxt.fillText("I-         00   HI-20000", 36,y);
	cxt.drawImage(iUI, 0, 0, 376, 140, 57, y + 36, 376,140);
	cxt.fillText("1 PLAYER", 190, y + 226);
	cxt.fillText("2 PLAYERS", 190, y + 256);
	cxt.fillText("CONSTRUCTION", 190, y + 286);
	cxt.restore();

	this.tick++;
	}else{
		this.tick = 0;
		this.status = 2;//status是配合ticker对游戏换面进行切换的数据
	}	
}
GameStartModule.prototype.renderTank = function(){
	var y = 276;
	switch(this.playtype){
		case 1: y = 276;break;
		case 2: y = 308;break;
		case 3: y = 340;break;
	}
	cxt.save();
	cxt.fillStyle = '#000';
	cxt.fillRect(150,275,32,96);
	this.tick % 6  < 3 ? cxt.drawImage(iTank, 1152, 0, 32, 32, 150, y, 32, 32) :
	cxt.drawImage(iTank, 1728, 0, 32, 32, 150, y, 32, 32);
	cxt.restore();
	this.tick++;
}

GameStartModule.prototype.stageframeShow = function(){
	var y = this.tick * 5;
	switch(this.playtype){
		case 1:gameplay.twogame = false;break;
		case 2:gameplay.twogame = true;break;
		case 3:console.log('我日啊，还有自定义地图');break;
	}
	if(this.tick >50){
		this.status = 4;
		this.tick = 0;
		return
	}
	cxt.save();
	cxt.fillStyle = '#000';
	cxt.fillRect(0,0,538,490);
	cxt.fillStyle = '#666';
	cxt.fillRect(0,0,538,y);
	cxt.fillRect(0,490,538,-y);
	cxt.restore();
	this.tick++;
}

GameStartModule.prototype.writeStage = function(){
		var stage = gameplay.nowpass + 1;
		cxt.save();
		cxt.fillStyle = '#666';
		cxt.fillRect(0,0,538,490);
		cxt.fillStyle = '#000';
		cxt.textAlign = 'center';
		cxt.font = "22px Arial Black";
		cxt.fillText('STAGE  ' + stage,260, 240);
		cxt.restore();
		this.tick++;
}

GameStartModule.prototype.stageframeClose = function(){
		console.log('幕布关闭gamplay即将开始');
		var y = this.tick * 5;
		if(this.tick < 50){
			cxt.save();
			cxt.fillStyle = '#666';
			cxt.fillRect(0,0,538,490);
			brick.Creat();
			brick.Render();
			cxt.fillStyle = '#666';
			cxt.fillRect(0,246-y,538,-(246-y));
			cxt.fillRect(0,246+y,538,246-y);
			cxt.restore();
			this.tick++;//gameplay.play = true;
				
		}else {
			if(gameplay.gonext.is){
				//gameplay.status = 0;
				gameplay.gonext.is = false;
				gameplay.tick = 0;
				gameplay.gonext.status = 0;
				this.tick = 0;
				this.status = 1;
				tank.enemy.created = 0;
				tank.enemy.tick = 0;
				//tank.enemy.nowNum = 0;
				tank.player1.status = 0;
				tank.player1.x = 128;
				tank.player1.y = 384;
				//tank.player1.dir = 't';
				allTanks.push(tank.player1);
				//地图在stageframe拉开的时候就重新生成了；

			}else{
				this.start = false;
				this.tick = 0;
				this.status = 1;
				//gameplay.ResetData();
				gameplay.play = true;
				//gameplay.status = 0;
				//tank.enemy.created = 0;
				
			}		
		}		
}//这个进程里调用了map模块









