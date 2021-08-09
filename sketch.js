//Declaring variables.
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;

function preload(){
  //Loading images.
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
}

function setup() {

  //Giving a server to our database.
  database=firebase.database();
  
  //Creating canvas.
  createCanvas(1000,400);

  //Creating food.
  foodObj = new Food();

  //Reading how much food is left.
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  //Creating dog sprite.
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  //Creating feed button and assigning properties to it.
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  //Creating add food button and assigning values to it.
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {

  background(46,139,87);

  foodObj.display();

  //Adding feed time the the project.
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed=data.val();

  });
 
  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
  
  drawSprites();
}

//function to read food Stock.
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last feed timing.
function feedDog(){

  dog.addImage(happyDog);
  
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
      foodObj.updateFoodStock(food_stock_val *0);
  }else{
      foodObj.updateFoodStock(food_stock_val -1);
  }
  
  //Updating food quantity and feeding time.  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
   
}

//function to add food stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}