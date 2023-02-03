
const Version = "1.0-alpha-math"

var gridSize = [1,1]
var size = 10;
var selected = [-1,-1]
var target = [-1,-1]
var pieceSize = 1;
var textW = 1;
// var newColor = [0,0,0]
var backColor = [20,20,20];
// var gridHistory = []
var gameCent = []
var gameGrid = []
var gridDims = [6,5]
// var solution = []
// var undoBox = []
var newBox = []
// var resetBox = []
var menuBox = []
var returnBox = []
// var wonThis = false;
var gameActive = true;
// var isColorMode = true;
// var noMovesLeft = false;
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
var textH = 10
var currentGoal = "99999999.99";
var difficulty = 0 //must be integer between 0 and 2 (easy, challenge, impossible)
var difficulties = ["EASY","CHALLENGE","IMPOSSIBLE"]
var typesOfGoals = ["integer", "both", "decimal"]
var typOfGoalNum = 0
var typeOfGoal = "integer" // or "decimal" or "integer"
var score = [0,0,0,0,0,0,0]; //EASY(int,both,dec),CHALLENGE(int,both,dec),IMPOSSIBLE(int,both,dec)
var calculatingGoal = false;



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
                var pieceColor = isInChain? (formVal == currentGoal)? [0,123,0] : [123,123,0] : piece.color
                fillRec([ pieceLeft, pieceTop, pieceSize, pieceSize], colText(pieceColor))


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
                            formula = makeFormula(chain)
                            formVal = getValFromFormula(formula)
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
                                        formula = makeFormula(chain)
                                        formVal = getValFromFormula(formula)
                                    }
                                }else{
                                    if(gameGrid[target[0]][target[1]].type == "number"){
                                        chain.push([...target])
                                        formula = makeFormula(chain)
                                        formVal = getValFromFormula(formula)
                                    }
                                }
                            }
                        }else if(chain.length>0){
                            var done = false
                            while(!done){
                                if(arrEq(chain[chain.length-1],target)){
                                    done = true
                                }else{
                                    chain.pop()
                                    formula = makeFormula(chain)
                                    formVal = getValFromFormula(formula)
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
    textH = textW*0.375

    if(gameActive){
        undoBox = [gameRec[0]+textXoff, gameRec[1]+textYoff, textW, textH]
        // shadowText(undoBox[0], undoBox[1]+undoBox[3], "UNDO", undoBox[3], "black")
        // fillText(undoBox[0], undoBox[1]+undoBox[3], "UNDO", undoBox[3], "white")
        
        newBox = [gameRec[0]+gameRec[2]-textW, gameRec[1]+textYoff, textW*0.75, textH]
        shadowText(newBox[0], newBox[1]+newBox[3], "NEW", newBox[3], "black")
        fillText(newBox[0], newBox[1]+newBox[3], "NEW", newBox[3], "white")

        resetBox = [gameRec[0]+textXoff, gameRec[1]+gameRec[3]-textH, textW, textH]
        // shadowText(resetBox[0], resetBox[1]+resetBox[3], "RESET", resetBox[3], "black")
        // fillText(resetBox[0], resetBox[1]+resetBox[3], "RESET", resetBox[3], "white")

        menuBox = [gameRec[0]+gameRec[2]-textXoff*2-textW, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(menuBox[0], menuBox[1]+menuBox[3], "MENU", menuBox[3], "black")
        fillText(menuBox[0], menuBox[1]+menuBox[3], "MENU", menuBox[3], "white")

        ctx.textAlign = "center"
        ctx.textBaseline = 'middle'
        if(verticalOrien){
            shadowText(gameCent[0]+textH*3, gameRec[3]/10+gameRec[1], "SCORE", textH*0.75, "black")
            fillText(gameCent[0]+textH*3, gameRec[3]/10+gameRec[1], "SCORE", textH*0.75, "white")
            shadowText(gameCent[0]+textH*3, gameRec[3]/10+gameRec[1]+textH, score[difficulty*typesOfGoals.length + typOfGoalNum].toString(), textH*0.75, "black")
            fillText(gameCent[0]+textH*3, gameRec[3]/10+gameRec[1]+textH, score[difficulty*typesOfGoals.length + typOfGoalNum].toString(), textH*0.75, "white")

            shadowText(gameCent[0]-textH*3, gameRec[3]/10+gameRec[1], "GOAL", textH*0.75, "black")
            fillText(gameCent[0]-textH*3, gameRec[3]/10+gameRec[1], "GOAL", textH*0.75, "white")
            shadowText(gameCent[0]-textH*3, gameRec[3]/10+gameRec[1]+textH, currentGoal, textH*0.75, "black")
            fillText(gameCent[0]-textH*3, gameRec[3]/10+gameRec[1]+textH, currentGoal, textH*0.75, "white")
        }else{
            shadowText(gameRec[2]/10+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "black")
            fillText(gameRec[2]/10+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "white")
            shadowText(gameRec[2]/10+gameRec[0], gameCent[1]-textH*2, score[difficulty*typesOfGoals.length + typOfGoalNum].toString(), textH*0.75, "black")
            fillText(gameRec[2]/10+gameRec[0], gameCent[1]-textH*2, score[difficulty*typesOfGoals.length + typOfGoalNum].toString(), textH*0.75, "white")

            shadowText(gameRec[2]/10+gameRec[0], gameCent[1]+textH, "GOAL", textH*0.75, "black")
            fillText(gameRec[2]/10+gameRec[0], gameCent[1]+textH, "GOAL", textH*0.75, "white")
            shadowText(gameRec[2]/10+gameRec[0], gameCent[1]+textH*2, currentGoal, textH*0.75, "black")
            fillText(gameRec[2]/10+gameRec[0], gameCent[1]+textH*2, currentGoal, textH*0.75, "white")
        }
        ctx.textAlign = "left"
        ctx.textBaseline = 'bottom'

        const valtodisp = formula + " = " + formVal
        ctx.textAlign = "center"
        ctx.textBaseline = 'middle'
        if(verticalOrien){
            shadowText(gameCent[0], gameRec[3]*0.9+gameRec[1]-textH*0.5, valtodisp,textH*0.75, "black")
            fillText(gameCent[0], gameRec[3]*0.9+gameRec[1]-textH*0.5, valtodisp,textH*0.75, "white")
            
        }else{
            shadowText(gameCent[0], gameRec[3]*0.95+gameRec[1], valtodisp,textH*0.75, "black")
            fillText(gameCent[0], gameRec[3]*0.95+gameRec[1], valtodisp,textH*0.75, "white")
        }
        ctx.textAlign = "left"
        ctx.textBaseline = 'bottom'
        

        
        // if(noMovesLeft&&(!winner)&&(!wonThis)){
        //     const wid = Math.min(gameRec[2],gameRec[3])/2
        //     fillRec([gameCent[0]-wid/2,gameCent[1]-wid/2,wid,wid],colText(backColor))
        //     ctx.textAlign = 'center'
        //     ctx.textBaseline = 'middle'
        //     shadowText(gameCent[0], gameCent[1], "TRY AGAIN", textH, "black")
        //     fillText(gameCent[0], gameCent[1], "TRY AGAIN", textH, "red")
        //     ctx.textAlign = 'left'
        //     ctx.textBaseline = 'bottom'
        // }
        // if((winner)||wonThis){
        //     var wid = Math.min(gameRec[2],gameRec[3])
        //     fillRec([gameCent[0]-wid/2,gameCent[1]-wid/2,wid,wid],colText(backColor))
        //     if(!wonThis){
        //         wonThis = true;
        //         score[difficulty]++
        //         saveGame()
        //     }
        //     ctx.textBaseline = 'middle'
        //     ctx.textAlign = 'center'
        //     shadowText(gameCent[0], gameCent[1], "YOU WON!", textH, "black")
        //     fillText(gameCent[0], gameCent[1], "YOU WON!", textH, "green")
        //     ctx.textAlign = 'left'
        //     ctx.textBaseline = 'bottom'

        // }
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
        
        
        // if(winner||wonThis){
        //     pop_high.play()
        // }else if(noMovesLeft){
        //     pop_low.play()
        // }else{
        //     pop_mid.play()
        // }
        soundPlayed = true;
    }

    //////////////////////////////next frame////////////////////////////////
    window.requestAnimationFrame(mainLoop);
    dlastLapse = lapse;
}

const makeFormula = function(theChain){
    var parenthCount = 0
    var theFormula = ""
    for(var i=(theChain.length-1); i>=0; i--){
        const currentVal = gameGrid[theChain[i][0]][theChain[i][1]].value
        
        theFormula = currentVal + theFormula
        
        if((currentVal == "÷")||(currentVal == "×")){
            //if it is, add closing parenth, then currentval
            
            if(theChain[i-2]){
                prevOp = gameGrid[theChain[i-2][0]][theChain[i-2][1]].value
                if((prevOp =="+")||(prevOp == "-")){
                    //need parenth
                    parenthCount++
                    theFormula = ")" + theFormula
                }
            }
        }
    }

    for(var i = 0; i<parenthCount; i++){
        theFormula = "(" + theFormula
    }

    return theFormula
}

const getValFromFormula = function(theFormula){
    var parCount = 0
    var done = false;
    var ind = 0
    while(!done){
        // console.log(theFormula[ind])
        if(theFormula[ind] == "("){
            parCount++
        }else{
            done = true
        }
        ind++
    }

    var formcopy = theFormula
    // console.log('theFormula',formcopy)
    for(var i=0; i<parCount; i++){
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

    }

    
    
    
    // console.log('attempting to calc', formcopy)
    const finalVal = getValFromText(formcopy).toString()
    // console.log("FINALVAL",finalVal)
    if(!(finalVal == "??")){
        return parseFloat(parseFloat(finalVal).toFixed(precision)).toString()
    }

    return "??"
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
        if(formVal == currentGoal){
            console.log('match made')
            score[difficulty*typesOfGoals.length + typOfGoalNum]++
            ///////////todo delete and replace tile values:

            //if chain count is even, remove last (ends in op)
            if(isEven(chain.length)){
                // console.log('chain was even')
                chain.pop()
                // console.log('trimmed chain',chain)
            }

            //calc num ops (chain length -1)/2
            const numOps = (chain.length-1)/2
            // console.log('numOps',numOps)

            //TODO if typeofgoal is decimal, there was a division symbol, there must be one in new tiles
            var hadDiv = false;
            for(var i=0; i<chain.length; i++){
                if(gameGrid[chain[i][0]][chain[i][1]].value == "÷"){
                    hadDiv = true
                }
            }
            var divPlaced = true
            if(typeOfGoal == "decimal"){
                divPlaced = false
            }

            //pick same number of random tiles of chain to be ops, replace vals
            var changed = new Array(chain.length).fill(false)
            for(var i=0; i<numOps; i++){
                found = false;
                while(!found){
                    var randI = floor(random()*chain.length)
                    if(!changed[randI]){
                        var point = [...chain[randI]]
                        var newOp = ops[floor(random()*ops.length)]
                        if(!divPlaced){
                            newOp = "÷"
                            divPlaced = true
                        }
                        gameGrid[point[0]][point[1]].value = newOp
                        changed[randI] = true
                        found = true
                    }
                }
            }

            //replace remaining with random numbers
            for(var i=0; i<chain.length;i++){
                if(!changed[i]){
                    var point =[...chain[i]]
                    gameGrid[point[0]][point[1]].value = floor(random()*8+1)
                    changed[i]=true
                }
            }

            //generate new goal
            genGoal()
        }
        selected = [-1,-1]
        target = [-1,-1]
        chain = []
        formula = '??'
        formVal = "??"
    }
}

const doNew = function(){
    // if(wonThis){
    //     //TODO do next, otherwise, do new of same
    // }
    // wonThis = false;
    // gridHistory = []
    genGrid()
}

// const doReset = function(){
//     if(gridHistory.length > 0){
//         gameGrid = []
//         const prevGrid = JSON.parse(JSON.stringify(gridHistory[0]))
//         gameGrid = JSON.parse(JSON.stringify(prevGrid));
//         // gridHistory = []
//         saveGame()
//     }
// }

const click = function(){
    if(gameActive){


        // if((mdX > (undoBox[0]))&&(mdY > undoBox[1])&&(mdX < (undoBox[0]+undoBox[2]))&&(mdY<(undoBox[1]+undoBox[3]))&&(!wonThis)){
        //     console.log("undo clicked")
        //     if(gridHistory.length > 0){
        //         gameGrid = []
        //         const prevGrid = JSON.parse(JSON.stringify(gridHistory[gridHistory.length-1]))
        //         gameGrid = JSON.parse(JSON.stringify(prevGrid));
        //         gridHistory.pop()
        //         saveGame()
        //     }
        // }

        if((mdX > (newBox[0]))&&(mdY > newBox[1])&&(mdX < (newBox[0]+newBox[2]))&&(mdY<(newBox[1]+newBox[3]))){
            console.log("new clicked")
            doNew()
        }

        // if((mdX > (resetBox[0]))&&(mdY > resetBox[1])&&(mdX < (resetBox[0]+resetBox[2]))&&(mdY<(resetBox[1]+resetBox[3]))&&(!wonThis)){
        //     console.log("reset clicked")
        //     doReset()
        // }

        if((mdX > (menuBox[0]))&&(mdY > menuBox[1])&&(mdX < (menuBox[0]+menuBox[2]))&&(mdY<(menuBox[1]+menuBox[3]))){
            console.log("menu clicked")
            gameActive = false;
            theMenuDiv.style.visibility = "visible"
        }

        var wid = 0;
        if(verticalOrien){
            wid = gameRec[2]
        }else{
            wid = gameRec[3]
        }

        // if((mdX > (gameCent[0] - wid/2))&&(mdY > (gameCent[1] - wid/2))&&(mdX < (gameCent[0] + wid/2))&&(mdY < (gameCent[1] + wid/2))){
        //     console.log('clicked grid')
        //     if(wonThis){
        //         //do new
        //         doNew()
            
        //     }else if(noMovesLeft){
        //         //do reset
        //         doReset()
        //     }
        // }

    }else{
        if((mdX > (returnBox[0]))&(mdY > returnBox[1])&&(mdX < (returnBox[0]+returnBox[2]))&&(mdY<(returnBox[1]+returnBox[3]))){
            console.log("return clicked")
            theMenuDiv.style.visibility = "hidden"
            gameActive = true;
        }
    }
}

const genGrid = function(){

    console.log('generating new grid')
    gameGrid = []
    score[difficulty*typesOfGoals.length + typOfGoalNum] = 0;

    console.log("scores", score)
    const tot = gridDims[0]*gridDims[1]
    const opRatio = 0.3
    const opNum = 8
    var opCount = 0
    const ranGrid = function(){
        for(var i=0; i<gridDims[0]; i++){
            const row = []
            for(var j=0; j<gridDims[1]; j++){
                var piece = []
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
        // console.log('opCount',opCount)
        if(opCount != opNum){
            // console.log('opMin', opMin, 'opMax', opMax)
            console.log('Number of operators no good, redoing grid')
            opCount = 0;
            gameGrid = []
            ranGrid()
        }

        //todo if no division & typeofgoal is decimal
        if(typeOfGoal=="decimal"){
            var hasDivision = false
            for(var i=0; i<gridDims[0]; i++){
                for(var j=0; j<gridDims[1]; j++){
                    if(gameGrid[i][j].value == "÷"){
                        hasDivision = true
                    }
                }
            }
            if(!hasDivision){
                console.warn('No division found')
                opCount = 0;
                gameGrid = []
                ranGrid()
            }
        }
        
    }

    ranGrid()

    console.log('grid', gameGrid)

    //todo generate goal

    

    genGoal()


    saveGame()
}

var goalAttempts = 0;
const maxGoalAttempts = 10;

const genGoal = function(){
    goalAttempts++

    if(goalAttempts > maxGoalAttempts){
        goalAttempts = 0
        console.error('MAX GOAL ATTEMPTS REACHED, NEW GRID')
        genGrid()
    }

    const wid = Math.min(gameRec[2],gameRec[3])/2
    fillRec([gameCent[0]-wid/2,gameCent[1]-wid/2,wid,wid],colText(backColor))

    const minTiles = 3+difficulty*2  //needs to be odd, and at least 3
    var thisChain = []

    //find start tile (must be number)
    var startP = []
    var foundStart = false
    while(!foundStart){
        startP = [floor(random()*gridDims[0]),floor(random()*gridDims[1])]
        if(!isNaN(parseInt(gameGrid[startP[0]][startP[1]].value))){
            foundStart = true
        }else{
            // console.log('finding new start')
        }
    }
    thisChain.push(startP)
    // console.log('startFound',startP, gameGrid[startP[0]][startP[1]].value)
    
    while(thisChain.length < minTiles){
        //find next op/number pair

        //if operator not possible fail
        var choices = [
            [thisChain[thisChain.length-1][0],thisChain[thisChain.length-1][1]+1],
            [thisChain[thisChain.length-1][0],thisChain[thisChain.length-1][1]-1],
            [thisChain[thisChain.length-1][0]-1,thisChain[thisChain.length-1][1]-1],
            [thisChain[thisChain.length-1][0]-1,thisChain[thisChain.length-1][1]],
            [thisChain[thisChain.length-1][0]-1,thisChain[thisChain.length-1][1]+1],
            [thisChain[thisChain.length-1][0]+1,thisChain[thisChain.length-1][1]-1],
            [thisChain[thisChain.length-1][0]+1,thisChain[thisChain.length-1][1]],
            [thisChain[thisChain.length-1][0]+1,thisChain[thisChain.length-1][1]+1]
        ]
        // console.log('choices',choices)

        var opAvail = false;
        for (var i = 0; i<choices.length; i++){
            var p = [...choices[i]]
            var pisvalid = (p[0]>-1)? (p[1]>-1)? (p[0]<gridDims[0])? (p[1]<gridDims[1])? true : false : false : false : false
            // console.log("p is valid", p)
            if(!(includesPoint(thisChain,p))&&pisvalid){
                // console.log('p',p)
                var v = gameGrid[p[0]][p[1]].value
                // console.log('valtocheck', v)
                if((v==ops[0])||(v==ops[1])||(v==ops[2])||(v==ops[3])){
                    //is an available op
                    // console.log('OP AVAILABLE')
                    opAvail = true
                }
            }
        }

        if(!opAvail){
            //failed, restart
            console.log('failed to make goal, noOp dead end, retrying')
            genGoal()
            return
        }

        var nextPoint = getRandomNeighbor(thisChain[thisChain.length-1])
        while(!((!includesPoint(thisChain,nextPoint))&&(isNaN(parseInt(gameGrid[nextPoint[0]][nextPoint[1]].value))))){
            nextPoint = getRandomNeighbor(thisChain[thisChain.length-1])
        }

        thisChain.push(nextPoint)
        // console.warn('OPFOUND')
        


        //todo fail if start was 1 and this op is mult or div

        

        //todo fail if no number available, instead of random pick not number
         //if number not possible fail
        choices = [
            [thisChain[thisChain.length-1][0],thisChain[thisChain.length-1][1]+1],
            [thisChain[thisChain.length-1][0],thisChain[thisChain.length-1][1]-1],
            [thisChain[thisChain.length-1][0]-1,thisChain[thisChain.length-1][1]-1],
            [thisChain[thisChain.length-1][0]-1,thisChain[thisChain.length-1][1]],
            [thisChain[thisChain.length-1][0]-1,thisChain[thisChain.length-1][1]+1],
            [thisChain[thisChain.length-1][0]+1,thisChain[thisChain.length-1][1]-1],
            [thisChain[thisChain.length-1][0]+1,thisChain[thisChain.length-1][1]],
            [thisChain[thisChain.length-1][0]+1,thisChain[thisChain.length-1][1]+1]
        ]
        // console.log('choices',choices)

        var numAvail = false;
        for (var i = 0; i<choices.length; i++){
            var p = [...choices[i]]
            var pisvalid = (p[0]>-1)? (p[1]>-1)? (p[0]<gridDims[0])? (p[1]<gridDims[1])? true : false : false : false : false
            // console.log("p is valid", p)
            if(!(includesPoint(thisChain,p))&&pisvalid){
                // console.log('p',p)
                var v = gameGrid[p[0]][p[1]].value
                // console.log('valtocheck', v)
                if(!isNaN(parseInt(v))){
                    //is an available op
                    // console.log('num AVAILABLE')
                    numAvail = true
                }
            }
        }

        if(!numAvail){
            //failed, restart
            console.log('failed to make goal, noNum dead end, retrying')
            genGoal()
            return
        }

        var nextPoint = getRandomNeighbor(thisChain[thisChain.length-1])
        while(!((!includesPoint(thisChain,nextPoint))&&(!isNaN(parseInt(gameGrid[nextPoint[0]][nextPoint[1]].value))))){
            nextPoint = getRandomNeighbor(thisChain[thisChain.length-1])
        }

        thisChain.push(nextPoint)
        // console.warn('NUMFOUND')

        //todo fail if this op is mult or div and this num is 1
    }
    
    // console.log('goalChainBuilt',thisChain)

    const goalForm = makeFormula(thisChain)

    const theVal = getValFromFormula(goalForm)

    //todo fail if not obide by typOfGoal ("both", "decimal", "integer")
    

    if(!(typeOfGoal == "both")){
        if(isInt(parseFloat(theVal))){
            if(typeOfGoal == "decimal"){
                //failed, restart
                console.error('failed to make goal, not decimal, retrying')
                genGoal()
                return
            }
        }else{
            if(typeOfGoal == "integer"){
                //failed, restart
                console.error('failed to make goal, not integer, retrying')
                genGoal()
                return
            }
        }
    }
    

    currentGoal = theVal
    console.log('goalFormula',goalForm)
    console.log('goalVal',theVal)


}

const getRandomNeighbor = function(point){

    const choices = [
        [point[0],point[1]+1],
        [point[0],point[1]-1],
        [point[0]-1,point[1]-1],
        [point[0]-1,point[1]],
        [point[0]-1,point[1]+1],
        [point[0]+1,point[1]-1],
        [point[0]+1,point[1]],
        [point[0]+1,point[1]+1]
    ]

    var found = false;
    while(!found){
        var choice = choices[floor(random()*choices.length)]
        if((choice[0]>-1)&&(choice[1]>-1)){
            if(choice[0] < gridDims[0]){
                if(choice[1] < gridDims[1]){
                    //choice exists
                    found = true
                }
            }
        }
    }
    
    return choice
}

//todo save the necessities
const saveGame = function(){
    // const gameObj = {
    //     "gameGrid": gameGrid,
    //     "backColor": backColor,
    //     // "gridHistory": gridHistory,
    //     "score": score,
    //     "gridDims": gridDims
    // }

    // const gameString = JSON.stringify(gameObj)
    // window.localStorage.setItem(Version,gameString)
    // console.log("GAME SAVED")
}


//TODO Load game
/*
if (!(localStorage.getItem(Version) === null)) {
    //load game
    const gameObj = JSON.parse(window.localStorage.getItem(Version))
    gameGrid = gameObj.gameGrid
    backColor = gameObj.backColor
    // gridHistory = gameObj.gridHistory
    score = gameObj.score
    gridDims = gameObj.gridDims
    console.log('GAME LOADED FROM STORAGE')
    console.log(JSON.stringify(gameObj))
}else{

    genGrid()
}

*/

genGrid()

