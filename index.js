
const Version = "1.0-alpha-math"

var gridSize = [1,1]
var size = 10;
var selected = [-1,-1]
var target = [-1,-1]
var pieceSize = 1;
var textW = 1;
// var newColor = [0,0,0]
var backColor = [20,20,20];
var gridHistory = []
var gameCent = []
var gameGrid = []
var gridDims = [6,5]
// var solution = []
var undoBox = []
var newBox = []
var resetBox = []
var menuBox = []
var returnBox = []
var score = 0;
var wonThis = false;
var gameActive = true;
// var isColorMode = true;
var noMovesLeft = false;
// const colTolerance = 4;  //fundamental 
// const grayTolerance = 2; //fundamental
// const genTolMult = 10; //fundamental
// var matchTolerance = 300;
// var genTolerance = 200;
const ops = ["+","×","-","÷"]
var chain = []


//Main Animation Loop
const mainLoop = function(){
    const currTime = new Date();
    const lapse = currTime - startTime
    // const frameLapse = lapse - dlastLapse
    
    

    //clearframe
    ctx.fillStyle = "rgb(0, 0, 0)"; ctx.fillRect(0, 0, cWidth, cHeight);

    /////////////////////////draw/////////////////////////

    //gameRec
    fillRec(gameRec, colText(backColor))
    
    gameCent = [gameRec[0]+gameRec[2]/2, gameRec[1] + gameRec[3]/2]

    if(gameActive){

        //gridcalcs
        if(verticalOrien){
            gridSize[0] = gridDims[1]
            gridSize[1] = gridDims[0]
            size = (gameRec[2]-marg*2)/gridSize[0]
        }else{
            gridSize[1] = gridDims[1]
            gridSize[0] = gridDims[0]
            size = (gameRec[3]-marg*8)/gridSize[1]
        }
        // console.log('gridSize', gridSize)
        //pieces
        for(var i = 0; i<gridSize[0]; i++){
            for(var j = 0; j<gridSize[1]; j++){
                
                const gridSizePix = [gridSize[0]*size, gridSize[1]*size]
                var gridPos = [gameCent[0]-gridSizePix[0]/2, gameCent[1]-gridSizePix[1]/2]
                var piece = [1,1,1]
                if(verticalOrien){
                    piece = gameGrid[j][gridSize[0]-i-1]
                }else{
                    piece = gameGrid[i][j]
                    gridPos = [gridPos[0], gridPos[1]-marg*3]
                }
                pieceSize = size-marg;
                const pieceLeft = gridPos[0]+i*size+marg/2
                const pieceTop = gridPos[1]+j*size+marg/2
                
                // console.log('drawing piece', piece)
                fillRec([ pieceLeft, pieceTop, pieceSize, pieceSize], colText(piece.color))


                //todo draw piece.value
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                // shadowText(pieceLeft+pieceSize/2, pieceTop+pieceSize/2, piece.value, pieceSize/2, "black")
                fillText(pieceLeft+pieceSize/2, pieceTop+pieceSize/2, piece.value, pieceSize/2, "white")
                ctx.textAlign = 'left'
                ctx.textBaseline = 'bottom'


                if(mouseDownCan){
                    if(((mdX >= pieceLeft)&&(mdX <= (pieceLeft+pieceSize)))&&((mdY >= pieceTop)&&(mdY <= (pieceTop+pieceSize)))){
                        if(verticalOrien){
                            selected = [gridSize[0]-i-1, j]
                        }else{
                            selected = [i,j]
                        }
                        
                    }

                    if(((mX >= pieceLeft)&&(mX <= (pieceLeft+pieceSize)))&&((mY >= pieceTop)&&(mY <= (pieceTop+pieceSize)))){
                        
                        if(verticalOrien){
                            target = [gridSize[0]-i-1, j]
                        }else{
                            target = [i,j]
                        }
                    }
                }else{
                    selected = [-1,-1]
                    target = [-1,-1]
                }
            }
        }

        //////////////////////////evaluation////////////////////////

        noMovesLeft = false //change to true when algorithm is correct
        var winner = false

        //no moves/winner  algorithm
        for(var i = 0; i<gameGrid.length; i++){
            for(var j = 0; j<gameGrid[0].length; j++){
                // todo calculate winner = true
                // todo calculate nomoremoves = true
            }
        }
    }else{
        //paused


    }

    
    

    /////////////////////////////text/////////////////////////////////////

    
    if(verticalOrien){
        textW = gameRec[2]/5
    }else{
        textW = gameRec[3]/5
    }
    
    const textXoff = textW/8
    const textYoff = textW/12
    const textH = textW*0.375

    if(gameActive){
        undoBox = [gameRec[0]+textXoff, gameRec[1]+textYoff, textW, textH]
        shadowText(undoBox[0], undoBox[1]+undoBox[3], "UNDO", undoBox[3], "black")
        fillText(undoBox[0], undoBox[1]+undoBox[3], "UNDO", undoBox[3], "white")
        
        newBox = [gameRec[0]+gameRec[2]-textW, gameRec[1]+textYoff, textW*0.75, textH]
        shadowText(newBox[0], newBox[1]+newBox[3], "NEW", newBox[3], "black")
        fillText(newBox[0], newBox[1]+newBox[3], "NEW", newBox[3], "white")

        resetBox = [gameRec[0]+textXoff, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(resetBox[0], resetBox[1]+resetBox[3], "RESET", resetBox[3], "black")
        fillText(resetBox[0], resetBox[1]+resetBox[3], "RESET", resetBox[3], "white")

        menuBox = [gameRec[0]+gameRec[2]-textXoff*2-textW, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(menuBox[0], menuBox[1]+menuBox[3], "MENU", menuBox[3], "black")
        fillText(menuBox[0], menuBox[1]+menuBox[3], "MENU", menuBox[3], "white")

        ctx.textAlign = "center"
        ctx.textBaseline = 'middle'
        if(verticalOrien){
            shadowText(gameCent[0], gameRec[3]/8+gameRec[1], score.toString(), "black")
            fillText(gameCent[0], gameRec[3]/8+gameRec[1], score.toString(), "white")
            
        }else{
            shadowText(gameRec[2]/8+gameRec[0], gameCent[1], score.toString(), "black")
            fillText(gameRec[2]/8+gameRec[0], gameCent[1], score.toString(), "white")
        }
        ctx.textAlign = "left"
        ctx.textBaseline = 'bottom'

        
        
        if(noMovesLeft&&(!winner)&&(!wonThis)){
            const wid = Math.min(gameRec[2],gameRec[3])/2
            fillRec([gameCent[0]-wid/2,gameCent[1]-wid/2,wid,wid],colText(backColor))
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            shadowText(gameCent[0], gameCent[1], "TRY AGAIN", textH, "black")
            fillText(gameCent[0], gameCent[1], "TRY AGAIN", textH, "red")
            ctx.textAlign = 'left'
            ctx.textBaseline = 'bottom'
        }
        if((winner)||wonThis){
            var wid = Math.min(gameRec[2],gameRec[3])
            fillRec([gameCent[0]-wid/2,gameCent[1]-wid/2,wid,wid],colText(backColor))
            if(!wonThis){
                wonThis = true;
                score++
                saveGame()
            }
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            shadowText(gameCent[0], gameCent[1], "YOU WON!", textH, "black")
            fillText(gameCent[0], gameCent[1], "YOU WON!", textH, "green")
            ctx.textAlign = 'left'
            ctx.textBaseline = 'bottom'

        }
    }else{
        //paused
        returnBox = [gameRec[0]+gameRec[2]-textXoff*5-textW, gameRec[1]+gameRec[3]-textH, textW*2, textH]
        shadowText(returnBox[0], returnBox[1]+returnBox[3], "RETURN", returnBox[3], "black")
        fillText(returnBox[0], returnBox[1]+returnBox[3], "RETURN", returnBox[3], "white")

        ctx.textAlign = 'center'
        var message1 = "INSTRUCTIONS HERE"
        shadowText(gameCent[0], gameCent[1], message1, textH, "black")
        fillText(gameCent[0], gameCent[1], message1, textH, "white")

        var message2 = "MATCH BACKGROUND"
        shadowText(gameCent[0], gameCent[1]+textH, message2, textH, "black")
        fillText(gameCent[0], gameCent[1]+textH, message2, textH, "white")

        ctx.textAlign = 'left'
    }

    //////////////////////////////////////////cursor////////////////////////////
    if(!isMobileDevice){
        fillCir([mX, mY, 12], 'rgba(0,0,0,0.5)')
        fillCir([mX, mY, 10], 'rgba(255,255,255,0.5)')
    }


    if((!soundPlayed)&&(audioAllowed)){
        
        
        if(winner||wonThis){
            pop_high.play()
        }else if(noMovesLeft){
            pop_low.play()
        }else{
            pop_mid.play()
        }
        soundPlayed = true;
    }

    //////////////////////////////next frame////////////////////////////////
    window.requestAnimationFrame(mainLoop);
    dlastLapse = lapse;
}

const checkRelease = function(){
    if(gameActive){
        //Todo release action
        selected = [-1,-1]
        target = [-1,-1]
    }
}

const doNew = function(){
    if(wonThis){
        //TODO do next, otherwise, do new of same
    }
    wonThis = false;
    gridHistory = []
    genGrid()
}

const doReset = function(){
    if(gridHistory.length > 0){
        gameGrid = []
        const prevGrid = JSON.parse(JSON.stringify(gridHistory[0]))
        gameGrid = JSON.parse(JSON.stringify(prevGrid));
        gridHistory = []
        saveGame()
    }
}

const click = function(){
    if(gameActive){


        if((mdX > (undoBox[0]))&&(mdY > undoBox[1])&&(mdX < (undoBox[0]+undoBox[2]))&&(mdY<(undoBox[1]+undoBox[3]))&&(!wonThis)){
            console.log("undo clicked")
            if(gridHistory.length > 0){
                gameGrid = []
                const prevGrid = JSON.parse(JSON.stringify(gridHistory[gridHistory.length-1]))
                gameGrid = JSON.parse(JSON.stringify(prevGrid));
                gridHistory.pop()
                saveGame()
            }
        }

        if((mdX > (newBox[0]))&&(mdY > newBox[1])&&(mdX < (newBox[0]+newBox[2]))&&(mdY<(newBox[1]+newBox[3]))){
            console.log("new clicked")
            doNew()
        }

        if((mdX > (resetBox[0]))&&(mdY > resetBox[1])&&(mdX < (resetBox[0]+resetBox[2]))&&(mdY<(resetBox[1]+resetBox[3]))&&(!wonThis)){
            console.log("reset clicked")
            doReset()
        }

        if((mdX > (menuBox[0]))&&(mdY > menuBox[1])&&(mdX < (menuBox[0]+menuBox[2]))&&(mdY<(menuBox[1]+menuBox[3]))){
            console.log("menu clicked")
            gameActive = false;
        }

        //todo click grid to reset or new if noMovesLeft and/or won
        var wid = 0;
        if(verticalOrien){
            wid = gameRec[2]
        }else{
            wid = gameRec[3]
        }

        if((mdX > (gameCent[0] - wid/2))&&(mdY > (gameCent[1] - wid/2))&&(mdX < (gameCent[0] + wid/2))&&(mdY < (gameCent[1] + wid/2))){
            console.log('clicked grid')
            if(wonThis){
                //do new
                doNew()
            
            }else if(noMovesLeft){
                //do reset
                doReset()
            }
        }

    }else{
        if((mdX > (returnBox[0]))&(mdY > returnBox[1])&&(mdX < (returnBox[0]+returnBox[2]))&&(mdY<(returnBox[1]+returnBox[3]))){
            console.log("return clicked")
            gameActive = true;
        }
    }
}

const genGrid = function(){

    console.log('generating new grid')
    gameGrid = []
    const tot = gridDims[0]*gridDims[1]
    const opRatio = 0.3
    const opMin = 0.9*opRatio*tot
    const opMax = 1.1*opRatio*tot
    var opCount = 0
    const ranGrid = function(){
        for(var i=0; i<gridDims[0]; i++){
            const row = []
            for(var j=0; j<gridDims[1]; j++){
                var piece = []
                //todo, make actual pieces
                piece = {
                    color: [123,123,123],
                    value: "9"
                }

                piece.value = floor(random()*9+1).toString()

                if(random() < opRatio){
                    //operator
                    piece.value = ops[floor(random()*4)]
                    opCount++
                }   


                row.push(piece)
            }
            gameGrid.push(row)
        }
        if(((opCount)<opMin)||((opCount)>opMax)){
            console.log('opMin', opMin, 'opMax', opMax)
            console.log('ratio out of range, redoing',opCount)
            opCount = 0;
            ranGrid()
        }
    }

    ranGrid()

    console.log('grid', gameGrid)

    saveGame()
}

const saveGame = function(){
    const gameObj = {
        "gameGrid": gameGrid,
        "backColor": backColor,
        "gridHistory": gridHistory,
        "score": score,
        "gridDims": gridDims
    }

    const gameString = JSON.stringify(gameObj)
    window.localStorage.setItem(Version,gameString)
    console.log("GAME SAVED")
}

/*
if (!(localStorage.getItem(Version) === null)) {
    //load game
    const gameObj = JSON.parse(window.localStorage.getItem(Version))
    gameGrid = gameObj.gameGrid
    backColor = gameObj.backColor
    gridHistory = gameObj.gridHistory
    score = gameObj.score
    gridDims = gameObj.gridDims
    console.log('GAME LOADED FROM STORAGE')
    console.log(JSON.stringify(gameObj))
}else{

    genGrid()
}

*/

genGrid()

