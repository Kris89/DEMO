


function GameOverModule(){
	console.log('GameOverModule被调用了吗')
	this.over = false,
	this.tick = 0,
	//console.log(this.tick)
	this.status = 0
}
GameOverModule.prototype.renderOvertips = function(){
			console.log('画布重新画了吗？')
			var y = 390 - this.tick * 2;
			if(this.tick > 100){
				this.tick = 0;
				this.status = 1;
				return
			}
			cxt.save();
			cxt.translate(map.translateX,map.translateY);
			//先清除
			cxt.fillStyle = '#000';
			cxt.fillRect(0,0,416,416);
			cxt.restore();
	
			brick.Render();
		    tank.Move();
		    tank.Render();			    	
			bullet.Move();
			bullet.Render();

			cxt.save();
			cxt.fillStyle = "#b53120";
			cxt.font = '22px Arial Black';
			cxt.textAlign = 'center';
			//从390的位置出现，停到190的位置
			cxt.fillText("G A M E", 242, y - 2 ); 
			cxt.fillText("O V E R", 242, y + 20);

			cxt.restore();
			this.tick++;
}

GameOverModule.prototype.scoreFrame = function(){
	if(score.status === 0){
		score.renderStatic();
	}
	if(score.status === 1){
		score.Cacul();
	}
	if(score.status === 2){
		score.hold();
		//this.status = 2;
	}
}
GameOverModule.prototype.finalFrame = function(){
	if(this.tick < 100){
		cxt.save();
		cxt.fillStyle = '#000';
		cxt.fillRect(0,0,538,490);
		cxt.drawImage(iUI, 0, 155, 376, 165, 140, 160, 376, 165);
		cxt.restore();
		this.tick++;
	}else{
		this.tick = 0;
		this.status = 0;
		this.over = false;
		gamestart.start = true;
		gamestart.status = 1;
		gameplay.Cleardata();//对run模块所有数组做删除
		gameplay.status = 0;
		tank.enemy.created = 0;
		tank.enemy.nowNum = 0;
		tank.enemy.tick = 0;
		gameplay.nowpass = 0;
	}
	
}
