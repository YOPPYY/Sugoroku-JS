// phina.js をグローバル領域に展開
phina.globalize();

var normal=1
var plus=1
var minus=1
var p_max=6;
var m_max=3;

var auto = true;
var turn;

var l1;
var l2;
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
    'tomapiko': 'tomapiko.png',
    'bird': 'bird.png',
  },
  sound:{
    'decide':'sound/決定、ボタン押下9.mp3',
    'step':'sound/カーソル移動7.mp3'
  }
};

phina.define('Title', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    var self=this;
    // 背景色を指定
    this.backgroundColor = '#444';
    Label({x:320,y:180,fontSize:50,text:'すごろくゲーム',fill:'white'}).addChildTo(this);
    Label({x:320,y:240,text:'ゲーム設定',fill:'white'}).addChildTo(this);
    // ラベルを生成
    var g=DisplayElement().addChildTo(this);
    var num=[]; var per=[];

    var st=['red','darkgray','blue'];
    var f=['pink','white','lightblue'];

    if(localStorage.getItem('SugorokuSetting')){
      var data=JSON.parse(localStorage.getItem('SugorokuSetting'));
      minus= parseInt(data[0]);
      normal= parseInt(data[1]);
      plus= parseInt(data[2]);
    }


    LabelDisp()


    function LabelDisp(){

      var arr=[minus,normal,plus];
      var sum= minus+normal+plus;

      for(var i in arr){
        if(num[i]){num[i].remove();}
        if(per[i]){per[i].remove();}
        var n = (arr[i]/sum)*100;
        if(!sum){n=33;}
        num[i]=Label({x:320+120*i-120,y:480,fontSize:40,text:arr[i],fill:f[i]}).addChildTo(g);
        per[i]=Label({x:320+120*i-120,y:680,fontSize:40,text:(n).toFixed(0)+'%',fill:f[i]}).addChildTo(g);
      }
    }

    var button=[];

    for(var i=0; i<3; i++){
      for(var j=0; j<2; j++){
        var t='';
        if(j==0){t='+';}  if(j==1){t='-';}
        var bt= Button({x:320+120*i-120,y:480+160*j-80,width:80,height:80,text:t,fill:f[i],stroke:st[i],fontColor:st[i]}).addChildTo(g);
        button.push(bt);
      }
    }
    button[0].onpointstart=function(){minus= Math.min(10,minus+1); LabelDisp();}
    button[1].onpointstart=function(){minus= Math.max( 0,minus-1); LabelDisp();}

    button[2].onpointstart=function(){normal= Math.min(10,normal+1); LabelDisp();}
    button[3].onpointstart=function(){normal= Math.max( 0,normal-1); LabelDisp();}

    button[4].onpointstart=function(){plus= Math.min(10,plus+1); LabelDisp();}
    button[5].onpointstart=function(){plus= Math.max( 0,plus-1); LabelDisp();}




    var start = Button({x:320,y:860,text:'スタート'}).addChildTo(this);
    start.onpointstart=function(){
      var setdata = JSON.stringify([minus,normal,plus]);
      localStorage.setItem('SugorokuSetting',setdata);
      self.exit('main');
    }




  },
});


// MainScene クラスを定義
phina.define('Main', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = '#444';

    var group = DisplayElement().addChildTo(this);

    //比率設定

    var p=[];

    for(var i =0; i<normal; i++){p.push(0);}
    for(var i =0; i<plus; i++){p.push(1);}
    for(var i =0; i<minus; i++){p.push(2);}

    if(p.length==0){p=[0,1,2]}

    //ランダム
    for(var i=1;i<grid.length-1;i++){
      var c = p[Math.floor(Math.random()*p.length)];
      if(c==1){var r= Math.floor(Math.random()*p_max)+1; var t='+'+r; c=1}
      else if(c==2){var r= Math.floor(Math.random()*m_max)-m_max; var t=r;}
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
      var label =Label({x:x,y:y,text:grid[i].text,fill:'white'}).addChildTo(this);
    }


    //初期位置
    com = Sprite('bird', 36, 26).setSize(48,48).addChildTo(this);
    var n=grid.length-1;
    com.pos=n;
    com.setPosition(sprite[n].x+20,sprite[n].y);

    player = Sprite('tomapiko', 64, 64).setSize(48,48).addChildTo(this);
    var n=grid.length-1;
    player.pos=n;
    player.setPosition(sprite[n].x-20,sprite[n].y);



    turn = Label({
      x : 320,
      y : 24,
      text:'1',
      fill:'white',
      align:'right'
    }).addChildTo(this);

    // ラベルを生成
    dice1 = Label({
      x : this.gridX.center()-50,
      y : this.gridY.center(),
      text:'',
      fill:'white',
      stroke:'black',
      strokeWidth:4,
    }).addChildTo(this);
    dice1.update=function(){
      if(!lock1){
        num1 = Math.floor(Math.random()*6+1);
        dice1.text=num1;
      }
      if(!reload){
        dice1.x=player.x;
        dice1.y=player.y-40;
      }
    }

    dice2 = Label({
      x : this.gridX.center()+50,
      y : this.gridY.center(),
      text:'',
      fill:'white',
      stroke:'black',
      strokeWidth:4,
    }).addChildTo(this);
    dice2.alpha=0;
    dice2.update=function(){
      if(!lock2){
        num2 = Math.floor(Math.random()*6+1);
        dice2.text=num2;
      }
      if(!reload){
        dice2.x=com.x;
        dice2.y=com.y-40;
      }
    }

     l1 = Label({
      x : 420,
      y : 24,
      text:'',
      fill:'white',
      align:'right'
    }).addChildTo(this);

     l2 = Label({
      x : 520,
      y : 24,
      text:'',
      fill:'white',
      align:'right'
    }).addChildTo(this);


    l=Label({x:320,y:160,text:'',fill:'white',stroke:'black',strokeWidth:4}).addChildTo(this);
  },

  update:function(){
    //l1.text=lock1;
    //l2.text=lock2;
  },

  onpointstart: function() {
    if(reload){location.reload();}

    if(!lock1){
      lock1=true;
      SoundManager.play('decide');
      PlayerMove();
    }


    function PlayerMove(){

      var p=player.pos;
      var step1=Math.min(num1,player.pos);
      var end1 = p-step1;
      dice1.stroke='green';
      player.tweener.wait(500).play(); //結果表示
      for(var i1=0; i1<step1; i1++){
        p--;
        player.tweener.moveTo(sprite[p].x-20,sprite[p].y,time)
        .call(function() {SoundManager.play('step');dice1.text--;  if(dice1.stroke!='black'){dice1.stroke='black';}})
        .wait(150)　//停止時間
        .call(function() {
          if(dice1.text=='0'){dice1.alpha=0;}
          player.pos--;

          if(player.pos==0){GameOver(0)}
          else if(player.pos==end1){
            if(grid[end1].ev==null){
              ComRole();
            }
            else{
              var s1 = grid[end1].ev;
              if(s1>0){var e1 = Math.max(0,p-s1); l.stroke='blue'}
              if(s1<0){var e1 = Math.min(grid.length-1,p-s1); l.stroke='red'}
              var v1 = p-e1;
              l.setPosition(sprite[p].x,sprite[p].y-60);
              l.text=grid[end1].text;
              l.alpha=1;
              dice1.text = Math.abs(v1)-1;
              l.tweener.wait(250).fadeOut(500).wait(0).call(function() {
                l.stroke='black';
                dice1.alpha=1;
                for(var j1=0; j1<Math.abs(v1); j1++){
                  if(v1>0)p--; if(v1<0)p++;
                  player.tweener.moveTo(sprite[p].x-20,sprite[p].y,time/2).wait(time/2)
                  .call(function() {
                    if(s1>0){player.pos--;}
                    if(s1<0){player.pos++;}
                    dice1.text--;
                    SoundManager.play('step');
                    if(dice1.text=='0'){dice1.alpha=0;}
                    if(player.pos==0){GameOver(0)}
                    else if(player.pos==e1){ComRole()}
                  }).play()
                }
              }).play();
            }
          }
        }).play();
      }


      function ComRole(){
        dice1.alpha=0;
        dice2.alpha=1;
        dice2.tweener.wait(500).call(function() {ComMove();}).play()

      }

      function ComMove(){

        if(!lock2){
          lock2=true;
          var c=com.pos;
          var step2=Math.min(num2,com.pos);
          var end2 = c-step2;
          dice2.stroke='purple';
          com.tweener.wait(500).play();
          for(var i2=0; i2<step2; i2++){
            c--;
            com.tweener.moveTo(sprite[c].x+20,sprite[c].y,time)
            .call(function() {dice2.text--; if(dice2.stroke!='black')dice2.stroke='black';})
            .wait(150)
            .call(function() {
              if(dice2.text=='0'){dice2.alpha=0;}
              com.pos--;
              if(com.pos==0){GameOver(1)}
              else if(com.pos==end2){
                if(grid[end2].ev==null){
                  ComEnd();
                }
                else{
                  var s2 = grid[end2].ev;
                  if(s2>0){var e2 = Math.max(0,c-s2); l.stroke='blue'}
                  if(s2<0){var e2 = Math.min(grid.length-1,c-s2); l.stroke='red'}
                  var v2 = c-e2;
                  l.setPosition(sprite[c].x,sprite[c].y-60);
                  l.text=grid[end2].text;
                  l.alpha=1;
                  dice2.text=Math.abs(v2)-1;
                  l.tweener.wait(250).fadeOut(500).wait(0).call(function() {
                    l.stroke='black';
                    dice2.alpha=1;
                    for(var j2=0; j2<Math.abs(v2); j2++){
                      if(v2>0)c--; if(v2<0)c++;
                      com.tweener.moveTo(sprite[c].x+20,sprite[c].y,time/2).wait(time/2)
                      .call(function() {
                        if(s2>0){com.pos--;}
                        if(s2<0){com.pos++;}
                        dice2.text--;
                        if(dice2.text=='0'){dice2.alpha=0;}
                        if(com.pos==0){GameOver(1)}
                        else if(com.pos==e2){ComEnd();}
                      }).play()
                    }
                  }).play();
                }
              }
            }).play();
          }
        }

        function ComEnd(){
          lock1=false; lock2=false; dice1.alpha=1; dice2.alpha=0; turn.text++;
          //if(auto){dice1.tweener.wait(500).call(function() {lock1=true; dice1=num1; PlayerMove()}).play();}
        }
      }

      function GameOver(n){
        if(n==0){dice1.stroke='red'; dice1.text='YOU WIN'; }
        if(n==1){dice1.stroke='blue'; dice1.text='YOU LOSE';}
        lock2=true;
        reload=true;
        dice2.alpha=0;
        dice1.alpha=1; dice1.x=320; dice1.y=480; dice1.fontSize=30;
      }
    }
  },

});


// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'title', // メインシーンから開始する
    // アセット読み込み
    assets: ASSETS,

    scenes: [
      {
        className: 'Title',
        label: 'title',
        next: 'main',
      },
      {
        className: 'Main',
        label: 'main',
      },
    ],

  });
  // アプリケーション実行
  app.run();
});
