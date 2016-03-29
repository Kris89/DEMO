#程序设计上的大致结构

1.DOM结构上	
container里边装了四个section；

2.原理上  
结构上，container与四个section作为一个整体；  
container结构整体相对于浏览器窗口做css滑动；  
滑动以每个section 为单位进行（但是当loop为true并且边界操作时就要一次滑过多个页面）。  
基于以上，每次发生滑动事件，container都要获取到目标section的坐标值进行定位，然后才能发生移动。这一条是整个程序的要点。

3.数据结构上
四个section构成了sections数组； 
闭包内定义了闭包全局iIndex去作为sections[]的索引，以获取到当前section和目标section。  

4.要点的逻辑处理上  
触发流程：当前section页面，当前页面索引iIndex，然后某刻，keydown事件被触发→根据键盘值判断是向上翻页还是向下翻页去调用movesectionUp/Down→movesectionUp/Dow对当前iIndex值做出修改以确定目标section→把目标section的索引值传入scrollPage：scrllPage（sections[iIndex]），这样scrollPage进一步获取到了目标section的定位：sections[iIndex].position()→最后一步，传入目标section的定位值，css移动：initEffect（目标section的坐标：sections[iIndex].position(),sections[iIndex]）.
