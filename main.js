let aliens, aliensFrame, background, bullets, city, citySprite, display, displayContext, frames, invaderSprite, me, meSprite, spriteSheet

// setup display
display = document.getElementById('display')
display.width = 500
display.height = 500
displayContext = display.getContext('2d')


loadImage()

function loadImage() {
    spriteSheet = new Image()
    spriteSheet.src = 'invaders.png'
    spriteSheet.addEventListener('load', function () {
        invaderSprite = [
            [new Sprite(spriteSheet, 0, 0, 22, 16), new Sprite(spriteSheet, 0, 16, 22, 16)],
            [new Sprite(spriteSheet, 22, 0, 16, 16), new Sprite(spriteSheet, 22, 16, 16, 16)],
            [new Sprite(spriteSheet, 38, 0, 24, 16), new Sprite(spriteSheet, 38, 16, 24, 16)]
        ]
        meSprite = new Sprite(spriteSheet, 62, 0, 22, 16)
        citySprite = new Sprite(spriteSheet, 84, 8, 36, 24)
        init()
    })
}

function init() {

    frames = 0
    
    // --------------- Start setup object

    background = {
        x: 0,
        y: 0,
        show: backgroundShow,
    }

    me = {
        img: meSprite,
        x: display.width / 2,
        y: display.height - 30,
        sx: 62,
        sy: 0,
        sw: 22,
        sh: 16,
        speedX: 4,
        moveLeft: false,
        moveRight: false,
        show: meShow,
        update: meUpdate,
    }
    aliens = []
    aliensFrame = 0
    direction = 1
    let row = [1, 0, 0, 2, 2]
    for (let i = 0; i < row.length; i++) {

        for (let j = 0; j < 10; j++) {
            let aliensType = row[i]
            aliens.push({
                img: invaderSprite[aliensType],
                x: 30 + j * 30,
                y: 100 + i * 30,
                w: invaderSprite[aliensType][0].w,
                h: invaderSprite[aliensType][0].h
            })
        }
    }
    
    bullets = []
    
    city = {
        locationX : [ 100, 200, 300, 400 ],
        x : 0,
        y : display.height - 100,
        w : display.width,
        h : citySprite.h 
    }
    
    citySetup()  
    // --------------- End setup object
    runGame()
}

function runGame() {
    frames++
    show()
    update()
    requestAnimationFrame(runGame)
}

function update() {
    meUpdate()
    aliensUpdate()
    bulletsUpdate()
}

function show() {
    background.show()
    me.show()
    aliensShow()
    bulletsShow()
    cityShow()
}

function backgroundShow() {
    displayContext.fillStyle = 'black'
    displayContext.fillRect(background.x, background.y, display.width, display.height)
}

function meShow() {
    drawSprite(me.img, me.x, me.y)
}

function meUpdate() {
    if (me.moveLeft) {
        me.x -= me.speedX
    }
    if (me.moveRight) {
        me.x += me.speedX
    }
    if (me.x < 0) {
        me.x = 0
    }
    if (me.x > display.width - 22) {
        me.x = display.width - 22
    }
}

function aliensShow() {
    for (let i = 0; i < aliens.length; i++) {
        let a = aliens[i]
        drawSprite(aliens[i].img[aliensFrame], a.x, a.y)
    }
}

function aliensUpdate() {
    if (frames % 60 == 0) {
        let max = 0
        let min = display.width
        aliensFrame = aliensFrame == 0 ? 1 : 0
        for (let i = 0; i < aliens.length; i++) {
            let a = aliens[i]
            a.x += 30 * direction
            max = Math.max(max, a.x)
            min = Math.min(min, a.x)
        }

        if (max > display.width - 30 || min < 30) {
            direction *= -1
            for (let i = 0; i < aliens.length; i++) {
                let a = aliens[i]
                a.x += 30 * direction
                a.y += 30
            }
        }
    }
}

function Bullets( x, y, speedY, w, h, color ){
    this.x = x
    this.y = y
    this.speedY = speedY
    this.w = w
    this.h = h
    this.color = color
}

function createBullet(){
    bullets.push( new Bullets( me.x + me.sw/2, me.y, 15, 2, 4, 'red'))
}

function bulletsShow(){
    for( let i = 0; i < bullets.length; i ++ ){
        let b = bullets[i]
        displayContext.fillStyle = b.color
        displayContext.fillRect( b.x, b.y, b.w, b.h )
    }
}

function bulletsUpdate(){
    for( let i = 0; i < bullets.length; i ++ ){
        let b = bullets[i]
        b.y -= b.speedY
        
        if( b.y > display.width || b.y < 100 ){
            bullets.splice( i, 1)
        }
        
        for( let j = 0; j < aliens.length; j ++ ){
            let a = aliens[j]
            if( isIntersect( b.x, b.y, b.w, b.h, a.x, a.y, a.w, a.h )){
                aliens.splice( j, 1)
                bullets.splice( i, 1)
            }
        }
        if( city.y < b.y + b.h && b.y < city.y + city.h  ){
            if( isCityHit( b.x, b.y )){
                bullets.splice( i, 1)
            }
        }
    }
    
    if( Math.random() < 0.1 && aliens.length > 0 ){
        let x = Math.floor( Math.random() * ( aliens.length - 1))
        let a = aliens[x]
        
        for( let i = 0; i < aliens.length; i ++ ){
            let b = aliens[i]
            if(isIntersect( a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)){
                a = b
            }
        }
        
        bullets.push( new Bullets( a.x + a.w/2, a.y + a.h , -10, 2, 4, 'white'))
    }
}

function citySetup(){
    city.img = document.createElement('canvas')
    city.img.width = display.width
    city.img.height = city.h
    city.cityContext = city.img.getContext('2d')
    for( let i = 0; i < city.locationX.length; i ++ ){
        city.cityContext.drawImage(spriteSheet, 84, 8, 36, 24, city.locationX[i] - 20, 0, 36, 24)
    }
    
}

function cityShow(){
    displayContext.drawImage( city.img, 0, display.height - 100 )
}

function isCityHit( x, y ){
    y -= city.y
    let imageData = city.cityContext.getImageData( x, y, 1, 1)
    if( imageData.data[3] !== 0 ){
        genDamage( x, y )
        return true
    }
    return false
}

function genDamage(x, y){
    x = Math.floor(x / 2) * 2;
    y = Math.floor(y / 2) * 2;
    // draw dagame effect to canva
    city.cityContext.clearRect(x - 2, y - 2, 4, 4);
    city.cityContext.clearRect(x + 2, y - 4, 2, 4);
    city.cityContext.clearRect(x + 4, y, 2, 2);
    city.cityContext.clearRect(x + 2, y + 2, 2, 2);
    city.cityContext.clearRect(x - 4, y + 2, 2, 2);
    city.cityContext.clearRect(x - 6, y, 2, 2);
    city.cityContext.clearRect(x - 4, y - 4, 2, 2);
    city.cityContext.clearRect(x - 2, y - 6, 2, 2);
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        me.moveLeft = true
        me.moveRight = false
    }
    if (event.keyCode == 39) {
        me.moveLeft = false
        me.moveRight = true
    }
    if (event.keyCode == 32) {
         createBullet()
    }
})

document.addEventListener('keyup', function (event) {
    if (event.keyCode == 37) {
        me.moveLeft = false
    }
    if (event.keyCode == 39) {
        me.moveRight = false
    }
    if (event.keyCode == 32) {
        createBullet()
    }
})

function Sprite(img, x, y, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function drawSprite(obj, x, y) {
    displayContext.drawImage(spriteSheet, obj.x, obj.y, obj.w, obj.h, x, y, obj.w, obj.h)
}

function isIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah
}
