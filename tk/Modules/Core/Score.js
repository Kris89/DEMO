function ScoreModule(){
	this.status = 0,
	this.tick = 0,
	this.tankType1 = false,
	this.tankType2 = false,
	this.tankType3 = false,
	this.tankType4 = false,
	this.num = [0,0,0,0]
}
//绘制score界面静态，调用函数，产生结果
ScoreModule.prototype.renderStatic = function(){
	cxt.save();
	cxt.textAlign = 'left';
	//cxt.translate(map.translateX,map.translateY);
	//把屏幕刷黑
	cxt.fillStyle = '#000';
	cxt.fillRect(0,0,538,490);
	//cxt.restore();
	//写字
	//cxt.save();
	cxt.fillStyle = '#b53120';
	cxt.font = "22px Arial Black";
	cxt.fillText('HI-SCORE',100,50);
	cxt.fillText("1-PLAYER", 50, 130);
	//换个颜色
	cxt.fillStyle = '#ea9e22';
	cxt.fillText("20000", 300, 50);
	//cxt.fillText('总分');
	//白色的分数文字
	cxt.fillStyle = '#fff';
	cxt.fillText("STAGE   "+(gameplay.nowPass + 1), 190, 90);
	cxt.fillText("PTS", 120, 210);
	cxt.drawImage(iMisc, 96, 0, 16, 16, 230, 195, 16, 16);
	cxt.drawImage(iTank, 256, 0, 32, 32, 250, 185, 32, 32);

	cxt.fillText("PTS", 120, 250);
	cxt.drawImage(iMisc, 96, 0, 16, 16, 230, 235, 16, 16);
	cxt.drawImage(iTank, 320, 0, 32, 32, 250, 225, 32, 32);

	cxt.fillText("PTS", 120, 290);
	cxt.drawImage(iMisc, 96, 0, 16, 16, 230, 275, 16, 16);
	cxt.drawImage(iTank, 384, 0, 32, 32, 250, 265, 32, 32);

	cxt.fillText("PTS", 120, 330);
	cxt.drawImage(iMisc, 96, 0, 16, 16, 230, 315, 16, 16);
	cxt.drawImage(iTank, 448, 0, 32, 32, 250, 305, 32, 32);

	cxt.fillRect(192, 361, 128, 3);
	cxt.fillText('TOTAL',90,400);
	

	cxt.restore();

	//对游戏进程进行推进的数据
	this.tankType1 = true;
	this.status = 1;
}

ScoreModule.prototype.Cacul = function(){
	var y = 0;
	cxt.save();
	cxt.textAlign = 'right';
	for (var i = 0; i < 4; i++) {
		//console.log(this['tankType'+(i + 1)]);
		if(this['tankType'+(i + 1)]){
			if(this.tick % 10 === 0){
				if(this.num[i] < scoredata[i]){
					this.num[i]++;
					this.tick++;
					y = scoreRenderY[i];
					cxt.fillStyle = '#000';
					cxt.fillRect(200,y - 20,25,30);
					cxt.fillStyle = '#fff';
					cxt.font = '22px Arial Black';
					cxt.fillText(this.num[i],220,y);
					cxt.fillStyle = '#000';
					cxt.fillRect(55,y - 20,60,30);
					cxt.fillStyle = '#fff';
					cxt.font = '22px Arial Black';
					cxt.fillText(this.num[i]*100,100,y);
				}else{
					//Game.Score.num = 0;
					this.tick = 0;
					this['tankType' + (i + 1)] = false;
					i < 3 ? this['tankType' + (i + 2)] = true:
					(	
						cxt.fillStyle = '#fff',
						cxt.font = '22px Arial Black',
						cxt.fillText(scoredata[0] + scoredata[1] + scoredata[2] + scoredata[3],240,400),
						this.status = 2
						)
							
				}
			}
		else{
			this.tick++;
			return
			}
		}
	}			
	cxt.restore();
}

ScoreModule.prototype.hold = function(){
	 if(this.tick < 80 )
	 {
	 	this.tick++ ;
	 }else{
	 	this.tick = 0;//重置当前程序数据为下一次调用做准备
	 	this.status = 0;//重置数据
	 	this.num = [0,0,0,0];
	 	var btn = gameplay.gonext.is;
	 	if(btn){
	 		gameplay.nowpass++;
	 		gameplay.gonext.status++;
	 	}else{
	 		gameover.status = 2;//设置进入下一个程序所需数据   
	 		console.log('hold结束，看看是重新进入ticker还是又进入over status 2 了')
	 	}
	 }
}
