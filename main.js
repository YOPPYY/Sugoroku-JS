// phina.js をグローバル領域に展開
phina.globalize();

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
    'tomapiko': 'https://cdn.jsdelivr.net/gh/phinajs/phina.js@develop/assets/images/tomapiko_ss.png',
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
          var sprite = Sprite(id[4], 1, 1).addChildTo(group);
          sprite.setSize(8,96);
          sprite.setPosition(80+80*r,80+80*c);
          break;
          default:
          var sprite = Sprite(id[data[c][r]], 1, 1).addChildTo(group);
          sprite.setSize(64,64);
          sprite.setPosition(80+80*r,80+80*c);
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
        /*
        if(data[c][r]!=0){
          var sprite = Sprite(id[data[c][r]], 1, 1).addChildTo(group);
          sprite.setSize(64,64);
          sprite.setPosition(80+80*r,80+80*c);
          var label=Label({
            x:80+80*r,
            y:80+80*c,
            text:ev[c][r],
            fill:'black',
          }).addChildTo(group)
        }*/
      }
    }

    // ラベルを生成
    this.label = Label('Hello, phina.js!').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center(); // y 座標
    this.label.fill = 'white'; // 塗りつぶし色
  },
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
