var hero, bg ,heroImage ,ground ,platform
var gameState = "start"
var button, coinGroup, bricksGroup, coin
var score = 0

function preload()
{
	bgImage = loadImage("images/sunnyforest.jpg");
	heroImage = loadImage("images/stickman.png")
	heroJumpingImage = loadImage("images/stickmanjumping-removebg-preview.png")
	heroRunningImage = loadImage("images/stickmanrunning-removebg-preview.png")
	brickImage = loadImage("images/brownbrickwall.jpg")
	redBrickImage = loadImage("images/redbrickwall.jpg")
	colorBrickImage = loadImage("images/multicolorbrickwall.jpg")
	heroRunningLeftImage = loadImage("images/leftrunningstickman-removebg-preview.png")
	finishLineImage = loadImage("images/finishline.jpg")
	coinImage = loadImage("images/goldCoin.png")
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	bg = createSprite(windowWidth/2, windowHeight/2, windowWidth,windowHeight)
	bg.addImage("forest",bgImage);
	bg.velocityX = -4;
	bg.scale = 4;

	bricksGroup = new Group();
	
	hero = createSprite(50,520,20,20);
	hero.addImage("hero",heroImage);
	hero.addImage("heroJumping",heroJumpingImage);
	hero.addImage("heroRunning",heroRunningImage);
	hero.addImage("heroRunningLeft",heroRunningLeftImage);
	hero.scale = 0.35;
	hero.debug = true;
	hero.setCollider("rectangle", 0, 0 , 60, 460);
	
	ground = createSprite(20,590,windowWidth/2-100,windowHeight/2-200);
	ground.visible = false;

	coinGroup = new Group();

	tutorialTitle = new Tutorial(400,300);
	
}


function draw() {
  background(0);
 
  drawSprites();

  fill ("red");
  stroke("white");
  strokeWeight(4);
  textSize(20);
  text("Score: " + score,windowWidth-30,)
  
 //--------------------------------------START STATE--------------------------------------------------
 if(gameState === "start"){
  tutorialTitle.display();
 }
 //--------------------------------------PLAY STATE--------------------------------------------------
 else if(gameState === "play"){
	
	hero.collide(ground);
	//INFINITE BACKGROUND 
	if(bg.x<windowWidth/2){
	  bg.x = bg.width/2
	}

	// PLAYER CONTROLS 
	if(keyDown('space')){
		hero.velocityY = -10
		hero.changeImage("heroJumping")
	}
	else{
		hero.velocityY = hero.velocityY + 1
		hero.changeImage("hero")
	}
	if(keyDown(RIGHT_ARROW)){
		hero.velocityX = 10
		hero.changeImage("heroRunning")
	}
	else if(keyDown(LEFT_ARROW)){
		hero.velocityX = -10
		hero.changeImage("heroRunningLeft")
	}
	else{
		hero.velocityX = 0
		hero.changeImage(heroImage)
	}
	
	spawnPlatform();
	hero.collide(bricksGroup);
	camera.position.x = hero.x;
	
	//END CONDITION
	if(hero.position.y>windowHeight || hero.position.y<0 || hero.position.x<0){
		gameState = "end"
	}
    //SCORE
	if(hero.isTouching(coinGroup)){
		score += 5
		coinGroup[0].destroy()
	}
	//WIN CONDITION
	
	var flag = windowWidth * 2 + 100;
	var flagImage = createSprite(flag, windowHeight/2);
	flagImage.addImage(finishLineImage)
	flagImage.scale = 0.1
	if(hero.x>flag){
		gameState = "win";
	}
 }
 //--------------------------------------END STATE--------------------------------------------------
 else if (gameState == "end"){
	imageMode(CENTER)
	image(bgImage, windowWidth/2, windowHeight/2, windowWidth,windowHeight)
	bg.destroy()
	swal ({
		title:"GAME OVER",
		imageUrl:"https://i.pinimg.com/originals/f9/59/5c/f9595cfe41f1b81ef95376ddbbd2c35e.gif",
		imageSize: "200x200",
		text:"You Died. Would you like to play again?", 
		confirmButtonText:"PLAY"
		
	},
	function (isConfirm){
      if(isConfirm){
		window.location.reload()
	  }
	}
	)
	coinGroup.destroyEach()
	bricksGroup.destroyEach()

 }

 //--------------------------------------WIN STATE--------------------------------------------------
 else if(gameState = "win"){
	imageMode(CENTER);
	image(bgImage, windowWidth/2, windowHeight/2, windowWidth,windowHeight);
	bg.destroy();
	swal({
		title:"YOU WON",
		imageURL:"https://media.tenor.com/wGwD1kHjS4sAAAAM/you-win-8bit.gif",
		imageSize: "300x300" ,
		text: `You won and ended with   ${score}   points. ${"\n"}Would you like to play again?`,
		confirmButtonText:"PLAY"
	},
	function (isConfirm){
		if(isConfirm){
		  window.location.reload()
		}
	  })
 }
 
 
}

function spawnPlatform(){
	if(frameCount % 60 === 0){
		var platform = createSprite(windowWidth,random(windowHeight/2-100,windowHeight-100),random(100,200),random(20,40))
		platform.velocityX = -5
		//hero.collide(platform)
		coin = createSprite(platform.position.x,platform.position.y-90,90,20)
		coin.velocityX = -5
		coin.debug = true
		coin.addImage(coinImage)
		coin.scale = 0.09;
		coinGroup.add(coin)
		// platform.debug = true;
		var randomImages = Math.round(random(1,3))

		switch(randomImages){
         case 1:platform.addImage(brickImage);
		 platform.scale = 0.5
		 break
		 case 2:
			platform.addImage(redBrickImage)
			platform.scale = 0.45 
			break
		 case 3:platform.addImage(colorBrickImage)
			platform.scale = 0.55
		 	break
		}
		bricksGroup.add(platform);
	}
}

