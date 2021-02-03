var  dog, normal ,happyDog; 
var  database ,foodS ,foodStock;
var feed, addFood;
var fedTime, lastFed, foodObj
var bedroom, garden, washroom
var changestate, readstate, currentTime

function preload(){
	happyDog=loadImage("images/dogImg1.png")
  normal=loadImage("images/dogImg.png")
  bedroom=loadImage("images/Bed Room.png")
  garden=loadImage("images/Garden.png")
  washroom=loadImage("images/Wash Room.png")
}

function setup() {
	database = firebase.database();
  createCanvas(900,900);
   
  dog =createSprite(800, 200, 10,10);
  dog.addImage(normal);
  dog.scale=0.2
  
  foodStock = database.ref('food');
  foodStock.on("value",readStock)

  foodObj = new Food();
  
  feed = createButton("Feed the dog");
  feed.position(800,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background("green")
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  readstate = database.ref('gameState');
  readstate.on("value",function(data){
    gameState = data.val();
  });
  fill("green");
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   } else{
     feed.show();
     addFood.show();
     dog.addImage(normal)
   }
   currentTime = hour();
   if(currentTime == (lastFed+1)){
     update("Playing");
     foodObj.garden();
   } else if (currentTime == (lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  } else if (currentTime > (lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.bedroom();
  } else{
    update("Hungry")
    foodObj.display();
  }

  drawSprites();
}
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDog)

  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function update(){
  database.ref('/').update({
    gameState:state
  });
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}