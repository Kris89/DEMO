 function BonusModule(){
 	this.baseProStatus = 0,
	this.basePro = false,
	this.baseProTick = 0,
	this.playerPro = false,
	this.playerProTick = 0,
	this.player = null,
	this.npcFixed = false,
	this.npcFixedTick = 0
 } 
	
	//baseProHoldtime:5,
BonusModule.prototype.setBonus = function(type,player) {
		//console.log('setBonus被盗用')
		switch(type){
			case 0 :this.basePro = true;break;//铁锹
			case 1 :tank.setPlayerStronger(player);break;//星星
			case 2 :tank.addPlayerlife(player);break;//坦克
			case 3 :this.playerPro = true;this.player = player;break;//防护
			case 4 :tank.setNpcBoom();break;//爆炸
			case 5 :this.npcFixed = true;break;//定时
		}
}
BonusModule.prototype.bonusTicker = function(){
		//console.log('bonusTicker被调用')
		var basePro = this.basePro;
		var playerPro = this.playerPro;
		if(basePro){
			var holdtime = parseInt(5 * 1000 / 16);
			var splashtime = parseInt(3 * 1000 / 16);
				this.spiritbonus.baseProTick++;
			  //  console.log(spiritbonus.baseProTick);
			    if(this.baseProTick === holdtime){
			    	//基地进入闪烁状态
			    	this.baseProStatus = 1;
			    }
			    if(this.baseProTick === holdtime + splashtime){
			    	this.baseProStatus = 2;
			    	this.baseProTick = 0;
			    	this.basePro = false;
			    }
			    this.controlBaseProtect();
		}
		if(this.playerPro){
			//console.log('给坦克画上保护层了哟');
			var player = this.player;//这里存的应该是对象指针，每帧进来都对应对象的新数据
			var protime = parseInt(7 * 1000 / 16);
			this.playerProTick++;
			//console.log(spiritbonus.playerProTick);
			if(this.playerProTick < protime){
				//console.log('在protime时间内可以render');
				if(this.playerProTick % 6 < 3){
					this.renderPlayerProtect(player,32);
				}else{
					this.renderPlayerProtect(player,64);
				}
			}else{
				this.playerPro = false;
				this.playerProTick = 0;
				this.player.pro = false;
				this.player = null;
			}
		}
		if(this.npcFixed){
			this.npcFixedTime();
		}
}
BonusModule.prototype.controlBaseProtect = function(){
		//console.log('controlBaseProtect被调用')
		var status = this.baseProStatus;
		var tick = this.baseProTick;
		if(status === 0){
			brick.setBaseProtect(2);
		}
		if(status === 1){
			//console.log('达到预设的5s开始闪烁')
			if(tick % 40 < 20){
				brick.setBaseProtect(1);
			}else{
				brick.setBaseProtect(2);
			}	
		}
		if(status === 2){
			brick.setBaseProtect(1);
			this.baseProStatus = 0;
		}
}
BonusModule.prototype.renderPlayerProtect = function(player,bgx){
		//console.log(bgx);
		var x = player.x,
			y = player.y;
			player.pro = true;
			cxt.save();
			cxt.translate(map.translateX,map.translateY);
			cxt.drawImage(iMisc,bgx,0,32,32,x,y,32,32);
			cxt.restore();
}
BonusModule.prototype.npcFixedTime = function(){
		var holdtime = parseInt(7 * 1000 / 16);
		this.npcFixedTick++;
		//var dir = ['l','r','t','b'];
		if(this.npcFixedTick < holdtime){
			for (var i = 0; i < allTanks.length; i++) {
				var npc = allTanks[i];
				if(npc.id === 'npc'){
						npc['move' + npc.dir.toUpperCase()] = false;
					//}//利用dir数组把npc对象的moveX属性按个置假
				}//npc
			}//整体坦克的遍历数组
		}else{//否则到了定时的时限了
			for (var j = 0; j < allTanks.length; j++) {
				var obj = allTanks[j];
				if(obj.id === 'npc'){
					obj['move' + obj.dir.toUpperCase()] = true;
				}
			}
			this.npcFixed = false;
			this.npcFixedTick = 0;
		}
		
}
