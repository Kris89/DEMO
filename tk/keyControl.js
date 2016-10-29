
document.onkeydown = function(ev){
				var ev = ev || event;
				var key = ev.keyCode;
				if(gamestart.start){
					if(gamestart.status === 1){
						(key === 13) && (
							gamestart.tick = 206,
							gamestart.renderStatic()
							)
					}
					if(gamestart.status === 2){
						switch(key){
							case 38:console.log('向上');gamestart.playtype--;(gamestart.playtype < 1) && (gamestart.playtype = 1);break;
							case 40: gamestart.playtype++;(gamestart.playtype > 3) && (gamestart.playtype = 3);break;
							case 13: (gamestart.tick > 70) && (gamestart.status = 3,gamestart.tick = 0);break; 
						}
					}
					if(gamestart.status === 4){
						switch(key){
							case 38:gamestart.stage++;(gamestart.stage > 38) && (gamestart.stage = 38);break;
							case 40:gamestart.stage--;(gamestart.stage < 1) && (gamestart.stage = 1);break;
							case 13:(gamestart.tick > 70) &&
							 (	
							 	console.log('key 13按下'),
							 	gamestart.status = 5,
							 	gamestart.tick = 0
							 	//game.nowpass = Game.Start.stage
							 	);break;
						}
					}
				}
				if(gameplay.play){
				(key === 87 || key === 83 || key === 65 ||key === 68 ) && (tank.player1.oldDir = tank.player1.dir);
				switch(key){
					case 87 :tank.player1.dir = 't';tank.player1.moveT = true;break;
					case 83 :tank.player1.dir = 'b';tank.player1.moveB = true;break;
					case 65 :tank.player1.dir = 'l';tank.player1.moveL = true;break;
					case 68 :tank.player1.dir = 'r';tank.player1.moveR = true;break;
					case 74 :if(tank.player1.bulletnowlen < tank.player1.bulletMax){
							 //console.log(tank1.bulletnowlen);
							 tank.player1.bulletnowlen++;
							 tank.player1.bullet = true;
							 bullet.Creat(tank.player1,tank.player1.bullet);
					}else{
						 tank.player1.bullet = false;
						 bullet.Creat(tank.player1,tank.player1.bullet);
					}break;
					case 32: gameplay.pause = gameplay.pause ===  false ? true : false;break;
				}
			}
		}


document.onkeyup = function(){
	var ev = ev || event;
	var key = ev.keyCode;
	switch(key){
		case 87 :tank.player1.moveT = false;break;
		case 83 :tank.player1.moveB = false;break;
		case 65 :tank.player1.moveL = false;break;
		case 68 :tank.player1.moveR = false;break;
	}
}