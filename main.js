// phina.js をグローバル領域に展開
phina.globalize();

var player;
var com;
var sprite=[];
var lock1=false;
var lock2=false;
var num1=0;
var num2=0;
var dice1;
var dice2;
var l;
var str;
var time =200;
var reload=false;

var id=['white','blue','red','green','yellow','black'];
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
    'bird': 'bird.png',
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



    //ランダム
    for(var i=1;i<grid.length-1;i++){
      var c= Math.floor(Math.random()*5);
      if(c==1){var r= Math.floor(Math.random()*6)+1; var t='+'+r; c=1}
      else if(c==2){var r= Math.floor(Math.random()*6)-6; var t=r;}
      else{var r=null; var t=''; c=0;}
      grid[i].color=c;
      grid[i].ev=r;
      grid[i].text=t;
      console.log(grid[i])
    }

    for(var i=0;i<grid.length;i++){
      var c = grid[i].color;
      sprite[i] = Sprite(id[c], 1, 1).addChildTo(group);
      sprite[i].setSize(64,64);
      var x= 80+80 * grid[i].x;
      var y= 80+80 * grid[i].y;
      sprite[i].setPosition(x,y);
      var label =Label({x:x,y:y,text:grid[i].text,fill:'black'}).addChildTo(this);
    }


    //初期位置
    player = Sprite('tomapiko', 48, 48).addChildTo(this);
    var n=grid.length-1;
    player.pos=n;
    player.setPosition(sprite[n].x-20,sprite[n].y);

    com = Sprite('bird', 48, 48).addChildTo(this);
    var n=grid.length-1;
    com.pos=n;
    com.setPosition(sprite[n].x+20,sprite[n].y);

    // ラベルを生成
    dice1 = Label({
      x : this.gridX.center()-50,
      y : this.gridY.center(),
      text:'',
      fill:'white',
    }).addChildTo(this);
    dice1.update=function(){
      if(!lock1){
        num1 = Math.floor(Math.random()*6+1);
        dice1.text=num1;
      }
    }

    dice2 = Label({
      x : this.gridX.center()+50,
      y : this.gridY.center(),
      text:'',
      fill:'white',
    }).addChildTo(this);
    dice2.update=function(){
      if(!lock2){
        num2 = Math.floor(Math.random()*6+1);
        dice2.text=num2;
      }
    }


    l=Label({x:320,y:160,text:'',fill:'white',stroke:'black',strokeWidth:5}).addChildTo(this);
  },

  update:function(){

  },

  onpointstart: function() {
    if(reload){location.reload();}
    if(!lock1){;
      lock1=true;
      PlayerMove();

      function PlayerMove(){

        var p=player.pos;
        var step=Math.min(num1,player.pos);
        var end = p-step;

        for(var i=0; i<step; i++){
          p--;
          player.tweener.moveTo(sprite[p].x-20,sprite[p].y,time).wait(100)
          .call(function() {
            player.pos--;
            if(player.pos==0){dice1.text='YOU';dice2.text='WIN'; lock2 =true; reload=true;}
            else if(player.pos==end){
              if(grid[end].ev==null){
                ComMove();
              }
              else{
                var s = grid[end].ev;
                var e = Math.min(grid.length-1,p-s);
                var v = Math.abs(p-e);
                l.setPosition(sprite[p].x,sprite[p].y-60);
                l.text=grid[end].text;
                l.alpha=1;
                l.tweener.wait(250).fadeOut(500).play();
                player.tweener.wait(500).moveTo(sprite[e].x-20,sprite[e].y,250+50*v).wait(100)
                .call(function() {
                  player.pos=e;
                  if(player.pos==0){dice1.text='YOU';dice2.text='WIN'; lock2 =true; reload=true;}
                  else{ComMove();}
                }).play()
              }
            }
          }).play();
        }

      }

      function ComMove(){
        if(!lock2){
          lock2=true;
          var c=com.pos;
          var step=Math.min(num2,com.pos);
          var end = c-step;

          for(var i=0; i<step; i++){
            c--;
            com.tweener.moveTo(sprite[c].x+20,sprite[c].y,time).wait(100)
            .call(function() {
              com.pos--;
              if(com.pos==0){dice1.text='CPU';dice2.text='WIN'; reload=true;}
              else if(com.pos==end){
                if(grid[end].ev==null){
                  lock1=false;
                  lock2=false;
                }
                else{
                  var s = grid[end].ev;
                  var e = Math.min(grid.length-1,c-s);
                  var v = Math.abs(c-e);
                  l.setPosition(sprite[c].x,sprite[c].y-60);
                  l.text=grid[end].text;;
                  l.alpha=1;
                  l.tweener.wait(250).fadeOut(500).play();
                  com.tweener.wait(500).moveTo(sprite[e].x+20,sprite[e].y,250+50*v).wait(100)
                  .call(function() {
                    com.pos=e;
                    if(com.pos==0){dice1.text='CPU';dice2.text='WIN'; lock2 =true; reload=true;}
                    else{lock1=false; lock2=false;}
                  }).play()
                }
              }
            }).play();
          }
        }
      }
    }
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
