
 window.onload = function(){
 	allTanks = [];
	allSpirits = [];
	allBullets = [];
	allBricks = [];
	allBooms = [];	
 	gamestart = new GameStartModule();
 	gameover = new GameOverModule();
 	gameplay = new GamePlayModule();
 	score = new ScoreModule();
 	bonus = new BonusModule();

 	brick = gameMap();
 	brick.Creat();
	brick.Render();
	//brick.Creat();
	test = Test();
	spirit = Spirit();
	boom = Boom();
	tank = new Tank();
	bullet = new Bullet();  
 	timer = setInterval(function(){

		if(gameplay.stop){
			return
		}		
		if(gamestart.start) {
			if(gamestart.status === 1){
				gamestart.renderStatic();
			}
			if(gamestart.status === 2){
				gamestart.renderTank();
			}
			if(gamestart.status === 3){
				gamestart.stageframeShow();
			}
			if(gamestart.status === 4){
				gamestart.writeStage();
			}
			if(gamestart.status === 5){
				gamestart.stageframeClose();
			}
		}
		if(gameplay.play){
			if(gameplay.pause){return}
			if(gameplay.status === 0){
				gameplay.init();
			}
			if(gameplay.status === 1){
				gameplay.run();
			}
			
		}
		if(gameover.over){
			if(gameover.status === 0){
				gameover.renderOvertips();
			}
			if(gameover.status === 1){
				gameover.scoreFrame();
			}
			if(gameover.status === 2){
				gameover.finalFrame();
			}
		}
	},16);
}

 

 