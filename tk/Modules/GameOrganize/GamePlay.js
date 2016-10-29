
//playmodle需要调用的模块
function GamePlayModule(){
	console.log('GamePlayModule被调用')
	this.play = false,
	this.gonext = {
		is:false,
		status:0
	}
	this.status = 0,
	this.tick = 0,
	this.nowpass = 0,
	this.pause = false,
	this.twogame = false,
	this.curStage = this.nowpass + 1;
}

GamePlayModule.prototype.init = function(){
	if(this.twogame){
		tank.Creat('player1');
		tank.Creat('player2');
	}else{
		tank.Creat('player1');
	}	
	this.status = 1;
}


GamePlayModule.prototype.run = function(){
 	tank.clear();//alltanks[]
 	spirit.Splashing();	//allspirits[]
    boom.Render();//allbooms[]
    tank.enemyCreat();//tank.enemy.created,tank.enemy.nownum
    tank.Move();//alltanks[]
    tank.Render(cxt); //alltanks[] 		    
	bullet.Clear();	//allbullets[]
	bullet.Move();//allbullets[]
	bullet.Render();//allbullets[]
	bonus.bonusTicker();//由tank spirit检测去调用setbonus，然后bonusticker响应
	this.gonext.is && this.GoNext();	
}

GamePlayModule.prototype.GoNext = function(){

	if(this.gonext.status === 0){
		if(this.tick < 200){
			this.tick++;
		}else{
			this.Cleardata();
			this.gonext.status = 1;
			this.tick = 0;
		}
	}
	if(this.gonext.status === 1){
		if(score.status === 0 ){
			score.renderStatic();
		}		
		//调用score模块之后就按照score模块的数据走了
		//score模块刚被调用，score.status score.tick score.tanktype score.num 都是初始值
		if(score.status === 1){
			score.Cacul();
		}
		if(score.status === 2){
			score.hold();
		}
	}
	if(this.gonext.status === 2){
		if(this.tick < 80){
			gamestart.writeStage();
			this.tick++;
			gamestart.tick--;//因为gamestart里的tick有自增，但是后续需要它置0，
							 //所以在这里每次进ticker再把它减回来
		}else{
			gamestart.stageframeClose();
		}
		
	}

	/*if(gameplay.tick === 0){
		if(score.status === 0 ){
			this.ResetData();
			score.renderStatic();
		}
		if(score.status === 1){
			score.Cacul();
		}
		if(score.status === 2){
			score.hold();
		}
	}	
	if(gameplay.tick === 1){
		if(gamestart.status === 1){
			if(gamestart.tick < 80){
				gamestart.writeStage();
			}else{
				gamestart.tick = 0;
				gamestart.status = 2;
			}			
		}
		if(gamestart.status === 2){
			gamestart.stageframeClose();
		}
	}*/
	
}

GamePlayModule.prototype.Cleardata = function(){
 allTanks.length = allSpirits.length = allBullets.length = allBricks.length = allBooms.length = 0;
 tank.enemy.nowNum = 0;
	
}