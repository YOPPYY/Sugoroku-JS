// phina.js をグローバル領域に展開
phina.globalize();

var num=0;
var roled=false;
var moving=false;
var player;
var sprite=[];
var target=46;
var id=['','white','red','blue','green','yellow','black'];
var ASSETS = {
  // 画像
  image: {
    'white': 'grid/white.png',
    'black': 'grid/black.png',
    'red': 'grid/red.png',
    'blue': 'grid/blue.png',
    'yellow': 'grid/yellow.png',
    'green': 'grid/green.png',
    'tomapiko': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko.png',
  },
};
// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = '#444';

    var group = DisplayElement().addChildTo(this);
    var data = [
      [5,4,2,2,2,2,1],
      [0,9,0,0,0,0,1],
      [1,4,2,4,2,2,1],
      [1,0,0,9,0,0,0],
      [1,2,2,4,2,2,1],
      [0,0,0,0,0,0,1],
      [1,2,4,1,2,2,1],
      [1,0,9,0,0,0,0],
      [1,2,4,2,1,4,1],
      [0,0,0,0,0,9,1],
      [5,2,2,2,2,4,1],
    ];

    var root = [
      [ 0, 1, 2, 3, 4, 5, 6],
      [-1,-1,-1,-1,-1,-1, 7],
      [14,13,12,11,10,9, 8],
      [15,-1,-1,-1,-1,-1,-1],
      [16,17,18,19,20,21,22],
      [-1,-1,-1,-1,-1,-1,23],
      [30,29,28,27,26,25,24],
      [31,-1,-1,-1,-1,-1,-1],
      [32,33,34,35,36,37,38],
      [-1,-1,-1,-1,-1,-1,39],
      [46,45,44,43,42,41,40],
    ];

    var ev = [
      [ 0,-12, 0, 0, 0, 0, 0],
      [-1,-1,-1,-1,-1,-1, 0],
      [ 0,12,0,-8, 0, 0, 0],
      [ 0,-1,-1,-1,-1,-1,-1],
      [ 0, 0, 0, 8, 0, 0, 0],
      [-1,-1,-1,-1,-1,-1, 0],
      [ 0, 0,-6, 0, 0, 0, 0],
      [ 0,-1,-1,-1,-1,-1,-1],
      [ 0, 0, 6, 0, 0,-4, 0],
      [-1,-1,-1,-1,-1,-1, 0],
      [ 0, 0, 0, 0, 0, 4, 0],
    ];

    for(var c=0;c<data.length;c++){
      for(var r=0;r<data[c].length;r++){
        switch (data[c][r]) {
          case 0:
          break;
          case 9:
          var path = Sprite(id[4], 1, 1).addChildTo(group);
          path.setSize(8,96);
          path.setPosition(80+80*r,80+80*c);
          break;
          default:
          sprite[root[c][r]] = Sprite(id[data[c][r]], 1, 1).addChildTo(group);
          sprite[root[c][r]].setSize(64,64);
          sprite[root[c][r]].setPosition(80+80*r,80+80*c);
          var t='';
          if(ev[c][r]>0){t='+'+ev[c][r];}
          else if(ev[c][r]<0){t=ev[c][r];}
          var label=Label({
            x:80+80*r,
            y:80+80*c,
            text:t,
            fill:'black',
          }).addChildTo(group);
          break;
        }
      }
    }

    player = Sprite('tomapiko', 64, 64).addChildTo(this);
    player.setPosition(80,80+80*10);

    // ラベルを生成
    var dice = Label({
      x : this.gridX.center(),
      y : this.gridY.center(),
      fill:'white',
    }).addChildTo(this);
    dice.update=function(){
      if(!roled && !moving){num = Math.floor(Math.random()*6+1); dice.text=num;}

    }
  },

  update:function(){

  },

  onpointstart: function() {
    if(!roled){
      roled=true;
      var goal=target-num;
      moving=true;
      for(var i=0;i<num;i++){
        target--;
        player.tweener.moveTo(sprite[target].x,sprite[target].y,300)
        .call(function() {
          if(player.x==sprite[goal].x && player.y==sprite[goal].y){moving=false;}
          
        }).play();
      }
    }
    else{
      if(!moving){roled=false;}
    }
  }

});


// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'main', // メインシーンから開始する
    // アセット読み込み
    assets: ASSETS,
  });
  // アプリケーション実行
  app.run();
});
