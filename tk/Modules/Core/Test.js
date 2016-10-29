
function Test(){

//	console.log("test被调用")

	return {
		Edge:function(obj){
			//console.log('此次调用edge的obj.id为：' + obj.id);
			var btn = false;
			switch(obj.dir){
				case 't':(obj.y <= 0) &&(btn = true);break;
				case 'b':(obj.y >= map.h - obj.h) && (btn = true); break;
				case 'l':(obj.x <= 0) && (btn = true);break;
				case 'r':(obj.x >= map.w - obj.w) &&(btn = true) ;break; 
			}
			return btn;
		},
		Brick:function(obj){//子弹跟坦克的地图砖块检测都用这个模块

			if(obj.id != 'bullets' && (obj.x % map.brickW != 0 || obj.y % map.brickH != 0)){
				//console.log("坦克跟砖块没对上逢");
				return 
			}
			if(obj.id === 'npc' && obj.type === 2){console.log('NPC'+obj.type+'进行brick检测')};
			//obj为坦克对象
			//确定当前坦克对象的位置
			//obj.id !== 'bullets' && console.log('此次调用bricktest的obj.id为：' + obj.id);
			 var x = obj.x,
			 	 y = obj.y;
			 	// console.log(x,y);
			//利用地图砖块栅格系统+当前坦克位置锁定需要找到的砖块
			//问题来了，到底需要哪块砖？
			//js里两个数做除法会返回小数，需要调用parseint处理成整数，but为什么不用math.rond??
			var brickW = map.brickW,
				brickH = map.brickH,
				rowNum = map.row;
				//colunmNum = map.colunm;
			//标志当前坦克所在行列的tag数据
			var tagColunm = parseInt(obj.x / brickW),
				secColunm = parseInt((obj.x+obj.w)/brickW),
				tagRow = parseInt(obj.y / brickH),
				secRow = parseInt((obj.y+obj.h)/brickH),
				tankBrick = tagRow*rowNum + tagColunm,
				bulBrick = secRow*rowNum + tagColunm;

				var bulTfirst = tankBrick,
					bulTsecond = tagRow*rowNum + secColunm,
					bulBfirst = bulBrick,
					bulBsecond = secRow*rowNum + secColunm,
					bulLfirst = tankBrick,
					bulLsecond = secRow*rowNum + tagColunm,
					bulRfirst = tagRow*rowNum + secColunm,
					bulRsecond = secRow*rowNum + secColunm;
			//则缝对齐的情况下，当前tank正好覆盖的砖块在allbicks[tankbrick]
			//这里有个特别巧妙的地方，因为allbrick数组从0开始计数，所以tankbrick正好是坦克跟砖块重叠那块砖
			//而不是重叠砖块前边的那一块砖；实际只判断坦克位置正前方的两块砖
			var Tfirst = (tagRow - 1)*rowNum + tagColunm,
				Tsecond = (tagRow - 1)*rowNum + (secColunm-1),
				Bfirst = secRow * rowNum + tagColunm,
				Bsecond = secRow * rowNum + (secColunm-1),
				Lfirst = (tagColunm - 1) + tagRow*rowNum,
				Lsecond =(tagColunm - 1) + (tagRow + 1)*rowNum,
				Rfirst = (secColunm ) + tagRow*rowNum,//Lfirst+ 3,
				Rsecond = (secColunm ) + (tagRow+1)*rowNum;//Lsecond+3;
			//对于子弹的检测是这样的，因为游戏像素的设置，子弹正好跨两块砖上
			
			var btn = false,
				brick1 = {},
				brick2 = {};

			switch(obj.dir){		
			case 't' :
			if(obj.id === 'bullets'){brick1 = allBricks[bulTfirst];
				//console.log(brick1);
				//console.log(bulTfirst);
				brick2 = allBricks[bulTsecond];}
			else{brick1 = allBricks[Tfirst];brick2 = allBricks[Tsecond];}break;

			case 'l' :
			if(obj.id === 'bullets'){
				//console.log("子弹左边检测");
			//	console.log(bulLfirst);
				brick1 = allBricks[bulLfirst];
				brick2 = allBricks[bulLsecond];}
			else{//console.log("左边检测");
			brick1 = allBricks[Lfirst];brick2 = allBricks[Lsecond];
			//console.log(Lfirst,Lsecond);
			//console.log(brick1,brick2);
		}break;
			
			case 'b' :
			if(obj.id === 'bullets'){brick1 = allBricks[bulBfirst];
				//console.log("子弹下边检测");
				//console.log(bulBfirst);
				//console.log(allBricks[bulBfirst].stopMove);
				//console.log(allBricks[bulBfirst].type);
				brick2 = allBricks[bulBsecond];}
			else{brick1 = allBricks[Bfirst];
				brick2 = allBricks[Bsecond];
				//console.log(Bfirst,Bsecond);
				//console.log(brick1,brick2);
			}break;
				
			case 'r' :
			if(obj.id === 'bullets'){brick1 = allBricks[bulRfirst];
				//console.log("子弹右边检测");
				//console.log(bulRfirst);
				brick2 = allBricks[bulRsecond];}
			else{//console.log("右边检测");
			brick1 = allBricks[Rfirst];brick2 = allBricks[Rsecond];
			//console.log(Rfirst,Rsecond);
			//console.log(brick1,brick2);
		}break;
			
		}
			if(obj.id === 'bullets') {
				if(brick1.base || brick2.base){
					brick.baseBroke();
					bullet.Hide(obj);
					boom.Creat(obj,'big');
					gameover.over = true;
					gameplay.play = false;//并没有管理gameplay的数据
					return true
				}
				else{
					var btn1 = brick.BulletChange_BrickData(brick1,obj);
					var btn2 = brick.BulletChange_BrickData(brick2,obj);
					if(btn1 || btn2){
						return true;
					}
				}			
			}else{
				if(brick1.stopMove || brick2.stopMove){
					btn = true;
					return btn;	
				}
			}		
		},
		TankTank:function(obj,obji){
			var x = obj.x,
				y = obj.y,
				w = obj.w,
				h = obj.h,
				gap = obj.speed,
				btn = false;
			for (var i = 0; i < allTanks.length; i++) {
				if(i === obji){
					//console.log('不对它自己进行检测tanktank');
					continue
				}
				var tank = allTanks[i];
				switch(obj.dir){
					case 't':((tank.y === y-h)&&((x-w<tank.x)&&(tank.x<x+w)))&&(btn=true);break;
					case 'b':((tank.y === y+h)&&((x-w<tank.x)&&(tank.x<x+w)))&&(btn=true);break;
					case 'l':((tank.x === x-w)&&((y-h<tank.y)&&(tank.y<y+h)))&&(btn=true);break;
					case 'r':((tank.x === x+w)&&((y-h<tank.y)&&(tank.y<y+h)))&&(btn=true);break;
				}
			}
		//	console.log(btn);
			return btn;
		},
		BulletBullet:function(obj,obji){
			//只针对tank1/2的子弹进行检测
			var w = obj.w,
				h = obj.h,
				x = obj.x,
				y = obj.y;
			var btn = false;
				for (var i = 0; i < allBullets.length; i++) {
					if(i === obji){
						continue
					}
					var bul = allBullets[i];
					if(
						((x <= bul.x + w && bul.x <= x + w) && (bul.y + h >= y && bul.y <= y)) ||
						((x <= bul.x + w && bul.x <= x + w) && ( y + h >= bul.y && y + h <= bul.y +h))||
						((y + h<= bul.y + h && bul.y <= y + h) && ( x + w >= bul.x && x <= bul.x + w)) ||
						((y + h<= bul.y + h && bul.y <= y + h) && ( x + w >= bul.x && x <= bul.x + w))
					){
						btn = true;
					}
					if(btn){
						bullet.Hide(bul);
						bul.dele = true;
						return btn
					}
				}
		},
		BulletTank:function(bul){
			var x = bul.x,
				y = bul.y,
				w = bul.w,
				h = bul.h,
				btn = false;
			for (var i = 0; i < allTanks.length; i++) {
				var tk = allTanks[i];
				if(bul.parent.id === tk.id){
					//console.log('这是同一个/方坦克发出的子弹，不对当前子弹跟坦克进行检测');
					continue
				}
				
				if(
				((x + w <= tk.x && tk.x <= x ) && ( y + h >= tk.y && y <= tk.y +tk.h)) ||
				((x <= tk.x + tk.w && tk.x + tk.w <= x + w) && ( y + h >= tk.y && y <= tk.y +tk.h)) ||
				((y <= tk.y && tk.y <= y + h) && ( x + w >= tk.x && x <= tk.x + tk.w)) ||
				((y <= tk.y +tk.h && y + h >= tk.y) && ( x + w >= tk.x && x <= tk.x + tk.w))
				 ){	
				 	if(tk.pro){
				 		console.log('子弹不引起爆炸')
				 		return true
				 	}else{
					 	//隐藏当前坦克；创建big boom ；删除当前坦克对象；btn置true；跳出循环
					 	bullet.Hide(tk);
						boom.Creat(bul,'big');
						tank.Bulleted(tk,i);
						btn = true;
						break
				 	}
				}
			}		
			return btn
		},
		Spirit:function(player){
			var x = player.x,
				y = player.y,
				w = player.w,
				h = player.h;
				//btn = false;
				for (var i = 0; i < allSpirits.length; i++) {
					var sp = allSpirits[i];
					if (
					((x + w <=sp.x && sp.x <= x ) && ( y + h >= sp.y && y <= sp.y +sp.h)) ||
					((x <= sp.x + sp.w && sp.x + sp.w <= x + w) && ( y + h >= sp.y && y <= sp.y +sp.h)) ||
					((y <= sp.y && sp.y <= y + h) && ( x + w >= sp.x && x <= sp.x + sp.w)) ||
					((y <= sp.y +sp.h && y + h >= sp.y) && ( x + w >= sp.x && x <= sp.x + sp.w))	
					) {
						spirit.Clear(sp);
						bonus.setBonus(sp.type,player);
						spirit.Dele(i);
					}
				}
		}
	}
}