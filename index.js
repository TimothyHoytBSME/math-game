
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
var formula = "??"
var formVal = "??";
const precision = 4;

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
                var isInChain = false
                if(verticalOrien){
                    piece = gameGrid[j][gridSize[0]-i-1]
                    isInChain = includesPoint(chain,[j,gridSize[0]-i-1])
                }else{
                    piece = gameGrid[i][j]
                    gridPos = [gridPos[0], gridPos[1]-marg*3]
                    isInChain = includesPoint(chain,[i,j])
                }
                pieceSize = size-marg;
                const pieceLeft = gridPos[0]+i*size+marg/2
                const pieceTop = gridPos[1]+j*size+marg/2
                

                // console.log('drawing piece', piece)
                var pieceColor = isInChain? [123,123,0] : piece.color
                fillRec([ pieceLeft, pieceTop, pieceSize, pieceSize], colText(pieceColor))


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
                            selected = [j, gridSize[0]-i-1]
                        }else{
                            selected = [i,j]
                        }
                        if((!includesPoint(chain,selected))&&(gameGrid[selected[0]][selected[1]].type == "number")){
                            chain.push([...selected])
                            upDateFormula()
                        }
                        
                        // console.log(chain)
                    }

                    if(((mX >= (pieceLeft+marg))&&(mX <= (pieceLeft+pieceSize-marg)))&&((mY >= (pieceTop+marg))&&(mY <= (pieceTop+pieceSize-marg)))){
                        
                        if(verticalOrien){
                            target = [j,gridSize[0]-i-1]
                        }else{
                            target = [i,j]
                        }
                        if((!includesPoint(chain,target))&&(chain.length>0)){
                            prev = chain[chain.length-1]
                            const choices = [
                                [prev[0],prev[1]+1],
                                [prev[0],prev[1]-1],
                                [prev[0]-1,prev[1]-1],
                                [prev[0]-1,prev[1]],
                                [prev[0]-1,prev[1]+1],
                                [prev[0]+1,prev[1]-1],
                                [prev[0]+1,prev[1]],
                                [prev[0]+1,prev[1]+1]
                            ]
                            // console.log('target',target, 'prev', prev)
                            // console.log('choices',choices)
                            if(includesPoint(choices,target)){
                                if(gameGrid[prev[0]][prev[1]].type == "number"){
                                    if(gameGrid[target[0]][target[1]].type == "operator"){
                                        // console.log('prevtargtype',gameGrid[prev[0]][prev[1]].type,gameGrid[target[0]][target[1]].type)
                                        chain.push([...target])
                                        upDateFormula()
                                    }
                                }else{
                                    if(gameGrid[target[0]][target[1]].type == "number"){
                                        chain.push([...target])
                                        upDateFormula()
                                    }
                                }
                            }
                        }else if(chain.length>0){
                            //todo remove chain back to target
                            var done = false
                            while(!done){
                                if(arrEq(chain[chain.length-1],target)){
                                    done = true
                                }else{
                                    chain.pop()
                                    upDateFormula()
                                }
                            }
                            
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


        //todo FORMULA TEXT

        const valtodisp = formula + " = " + formVal
        ctx.textAlign = "center"
        ctx.textBaseline = 'middle'
        if(verticalOrien){
            shadowText(gameCent[0], gameRec[3]*0.9+gameRec[1], valtodisp, "black")
            fillText(gameCent[0], gameRec[3]*0.9+gameRec[1], valtodisp, "white")
            
        }else{
            shadowText(gameCent[0], gameRec[3]*0.95+gameRec[1], valtodisp, "black")
            fillText(gameCent[0], gameRec[3]*0.95+gameRec[1], valtodisp, "white")
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

        var message2 = "INSTRUCTIONS LINE 2"
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

const upDateFormula = function(){
    var parenthCount = 0
    formula = ""
    for(var i=(chain.length-1); i>=0; i--){
        const currentVal = gameGrid[chain[i][0]][chain[i][1]].value
        
        formula = currentVal + formula
        
        if((currentVal == "÷")||(currentVal == "×")){
            //if it is, add closing parenth, then currentval
            
            if(chain[i-2]){
                prevOp = gameGrid[chain[i-2][0]][chain[i-2][1]].value
                if((prevOp =="+")||(prevOp == "-")){
                    //need parenth
                    parenthCount++
                    formula = ")" + formula
                }
            }
        }
    }

    for(var i = 0; i<parenthCount; i++){
        formula = "(" + formula
    }

    updateformval(parenthCount)
}

const updateformval = function(parCount){
    var formcopy = formula
    console.log('formula',formcopy)
    for(var i=0; i<parCount; i++){
        //todo replace inside parenth with equal value
        var inside = ""
        const start = parCount-i
        inside = formcopy[start]
        var stop = start + 1
        while(formcopy[stop] != ")"){
            inside = inside + formcopy[stop]
            stop++
        }
        const insideVal = getValFromText(inside).toString()
        const newform = formcopy.replace("("+inside+")",insideVal);
        formcopy = newform
        // console.log('formcopy',formcopy)

    }

    
    
    
    // console.log('attempting to calc', formcopy)
    const finalVal = getValFromText(formcopy).toString()
    console.log("FINALVAL",finalVal)
    if(!(finalVal == "??")){
        formVal = parseFloat(parseFloat(finalVal).toFixed(precision)).toString()
    }
    
    
}


const getValFromText = function(text){
    var textcopy = text
    var lastchar = textcopy[textcopy.length-1]
    if((lastchar == "+")||(lastchar == "-")||(lastchar == "×")||(lastchar == "÷")){
        textcopy = textcopy.slice(0,-1);
        // console.log('removed unused operator',textcopy)
    }


    var docalc = false
    for(var i=0; i< textcopy.length; i++){
        if((textcopy[i] == "+")||(textcopy[i] == "-")||(textcopy[i] == "×")||(textcopy[i] == "÷")){
            docalc = true
        }
    }

    var val = "??"

    if(docalc){
        // console.log('calculating',textcopy)

        var firstchar = textcopy[0]
        val = 1
        if(firstchar == "-"){
            val = -1
            textcopy = textcopy.slice(1,textcopy.length)
            // console.log('leading - removed', textcopy)
        }

        var firstnumtext = ""
        var done = false
        while(!done){
            if((textcopy[0] == "+")||(textcopy[0] == "-")||(textcopy[0] == "×")||(textcopy[0] == "÷")||(textcopy.length == 0)){
                done = true
            }else{
                firstnumtext = firstnumtext + textcopy[0]
                // console.log('building dec', firstnumtext)
                textcopy = textcopy.slice(1,textcopy.length)
            }
        }

        val = val*parseFloat(firstnumtext)
        // console.log('firstVal',val)

        for(var i=1; i<textcopy.length; i++){
            if(!isEven(i)){
                //apply num with op to prev val
                // console.log('currentchar',textcopy[i])
                const numb = parseInt(textcopy[i])
                const op = textcopy[i-1]
                switch(op) {
                    case "+":
                        val = val+numb
                        break;
                    case "-":
                        val = val-numb
                        break;
                    case "×":
                        val = val*numb
                        break;
                    case "÷":
                        val = val/numb
                        break;
                    default:
                        val = val
                }
                // console.log('valnextstep',val)
            }
        }
    }
    return val
}



const checkRelease = function(){
    if(gameActive){
        //Todo release action
        selected = [-1,-1]
        target = [-1,-1]
        chain = []
        formula = '??'
        formVal = "??"
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
                    value: "9",
                    type: "number"
                }

                piece.value = floor(random()*9+1).toString()

                if(random() < opRatio){
                    //operator
                    piece.value = ops[floor(random()*4)]
                    piece.type = "operator"
                    opCount++
                    
                }   


                row.push(piece)
            }
            gameGrid.push(row)
        }
        console.log('opCount',opCount)
        if(((opCount)<opMin)||((opCount)>opMax)){
            console.log('opMin', opMin, 'opMax', opMax)
            console.log('ratio out of range, redoing')
            opCount = 0;
            gameGrid = []
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

