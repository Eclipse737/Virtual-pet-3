var database ,dog,dog1,dog2
var position
//var form
var feed,add
var foodobject
var Feedtime
var Lastfeed
var lastfed;
var gardenimg,bedroomimg,washroomimg;
var readState,gameState;
//Create variables here

function preload()

{
  dogimg1 = loadImage("dogImg.png")
  dogimg2 = loadImage("dogImg1.png")
  gardenimg=loadImage("Garden.png")
  bedroomimg=loadImage("Bed Room.png")
  washroomimg=loadImage("Wash Room.png")
	//load images here
}

function setup() {
	createCanvas(1000, 500);
  database = firebase.database();
  console.log(database);
 
  foodobject=new Food()
  dog = createSprite(550,250,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
 
  var dogo = database.ref('Food');
  dogo.on("value", readPosition);
  feed = createButton("FEED DRAGO")
  feed.position(500,15)
  feed.mousePressed(FeedDog)
  add = createButton("ADD FOOD")
  add.position(400,15)
  add.mousePressed(AddFood)
  readState=database.ref("gameState")
  readState.on("value",function(data){
    gameState=data.val()
  })
  Feedtime=database.ref('FeedTime')
Feedtime.on('value',function(data){
lastfed=data.val()
})  
} 

function draw(){
 background(46,139,87);
 currentTime=hour()
 if(currentTime==(lastfed+1)){
  update("playing")
  foodobject.garden()

 }else
  if(currentTime==(lastfed+2)){
    update("sleeping")
    foodobject.bedroom()
 }
 else
 if(currentTime>(lastfed+2)&& currentTime<=(lastfed+4)){
  update("bathing")
  foodobject.washroom()
 }else{
   update("hungry")
   foodobject.display()
 }
 
 

 fill(255,255,254);
 textSize(15);
if(gameState!="Hungry"){
  feed.hide()
  add.hide()
  dog.remove()

}else{
  feed.show()
    add.show()
    dog.addImage(dogimg1)
  
}
drawSprites();
}
function readPosition(data){
  position = data.val();
  foodobject.updateFoodStock(position)
}




function writePosition(nazo){
  if(nazo>0){
    nazo=nazo-1
  }
  else{
    nazo=0
  }
  database.ref('/').set({
    'Food': nazo
  })

}
function AddFood(){
position++
database.ref('/').update({
  Food:position
}

)
}
function FeedDog(){

dog.addImage(dogimg2)
foodobject.updateFoodStock(foodobject.getFoodStock()-1)
 database.ref('/').update({
   Food:foodobject.getFoodStock(),
   FeedTime:hour ()
 })
}
function update(State){
  database.ref("/").update({
    gameState:State
  })
}
