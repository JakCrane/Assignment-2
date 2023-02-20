class Socket {
    constructor(x,y) {
        this.positionx = x;
        this.positiony = y;
        this.type = "empty";
        this.age = Math.random();
        this.typeMatch = 0;
        this.canMerge = false
        this.root = false
    }
    get leftType() {
        if (parseInt(this.positionx) == 0) {return null}
        let col = socketArr.filter(socket => socket.positionx == (parseInt(this.positionx) - 1))
        let row = col.filter(socket => socket.positiony == parseInt(this.positiony))
        return row[0].type
    } 
    get rightType() {
        if (parseInt(this.positionx) == 5) {return null}
        let col = socketArr.filter(socket => socket.positionx == (parseInt(this.positionx) + 1))
        let row = col.filter(socket => socket.positiony == parseInt(this.positiony))
        return row[0].type
    } 
    get aboveType() {
        if (parseInt(this.positiony) == 0) {return null}
        let col = socketArr.filter(socket => socket.positionx == parseInt(this.positionx))
        let row = col.filter(socket => socket.positiony == (parseInt(this.positiony) - 1))
        return row[0].type
    } 
    get belowType() {
        if (parseInt(this.positiony) == 5) {return null}
        let col = socketArr.filter(socket => socket.positionx == parseInt(this.positionx))
        let row = col.filter(socket => socket.positiony == (parseInt(this.positiony) + 1))
        return row[0].type
    } 
    get leftMergeReadiness() {
        if (parseInt(this.positionx) == 0) {return null}
        let col = socketArr.filter(socket => socket.positionx == (parseInt(this.positionx) - 1))
        let row = col.filter(socket => socket.positiony == parseInt(this.positiony))
        if (row[0].type == this.type) {return row[0].canMerge} 
        else {return false}
    } 
    get rightMergeReadiness() {
        if (parseInt(this.positionx) == 5) {return null}
        let col = socketArr.filter(socket => socket.positionx == (parseInt(this.positionx) + 1))
        let row = col.filter(socket => socket.positiony == parseInt(this.positiony))
        if (row[0].type == this.type) {return row[0].canMerge} 
        else {return false}
    } 
    get aboveMergeReadiness() {
        if (parseInt(this.positiony) == 0) {return null}
        let col = socketArr.filter(socket => socket.positionx == parseInt(this.positionx))
        let row = col.filter(socket => socket.positiony == (parseInt(this.positiony) - 1))
        if (row[0].type == this.type) {return row[0].canMerge} 
        else {return false}
    } 
    get belowMergeReadiness() {
        if (parseInt(this.positiony) == 5) {return null}
        let col = socketArr.filter(socket => socket.positionx == parseInt(this.positionx))
        let row = col.filter(socket => socket.positiony == (parseInt(this.positiony) + 1))
        if (row[0].type == this.type) {return row[0].canMerge} 
        else {return false}
    } 
    canMergeMethod() {
        this.typeMatch = 0
        if (this.type == this.leftType) {this.typeMatch++}
        if (this.type == this.rightType) {this.typeMatch++}
        if (this.type == this.aboveType) {this.typeMatch++}
        if (this.type == this.belowType) {this.typeMatch++}
        if (this.typeMatch >= 2) {
            this.canMerge = true; 
            mergeAttributePropogation(); 
            merge();
        } 
    }
}
class QueuePosition {
    constructor(i) {
        this.type = this.getRandomQueueType();
        this.number = `position${i}`;
    }
    getRandomQueueType() {
        let a = Math.random()
        if (a >= 0.95) {
            return "tree"
        } else if (a >= 0.8) {
            return "bush"
        } else {
            return "grass"
        }
    }
    getAndProgressQueue() {
        let oldType = queueArr[0].type
        for (let i = 0; i<2; i++) {queueArr[i].type = queueArr[i + 1].type}
        queueArr[2].type = this.getRandomQueueType()
        return oldType
    }
}
var socketArr = [];
var queueArr = [];
var scoreTotal = 0;
var scorePopup = 0;
document.addEventListener("DOMContentLoaded", function() {
    startGame(); 
    let socketsEl = document.getElementsByClassName("socket")
    for (let socketEl of socketsEl) {
        socketEl.addEventListener("click", function() {
            let socket = socketArr.filter(socket => socket.positionx == this.getAttribute("id").split("-")[0]).filter(socket => socket.positiony == this.getAttribute("id").split("-")[1])[0]
            socketArr.filter(socket => socket.root == true)[0].root = false
            if (socket.type != "empty") {return}
            for (let socketAger of socketArr) {socketAger.age++}
            socket.type = queueArr[0].getAndProgressQueue()
            socket.age = 0;
            socket.root = true;
            refreshQueue()
            canMerge()
            if (checkEnd()) {endGame()}
        });
    }
    document.getElementById("endGame").addEventListener("click", endGame())
    document.getElementById("refresh").addEventListener("click", refreshSockets())
});
startGame = () => {
    initialiseSockets();
    socketArr[0].root = true
    initialiseQueue();
    refreshQueue();
    canMerge();
    refreshSockets();
    scoreTotal = 0;
    document.getElementById("score").innerText = `Score: ${scoreTotal}`;
}
initialiseSockets = () => {
    let sockets = document.getElementsByClassName("socket")
    for (let socket of sockets) {
        let x = socket.getAttribute("id").split("-")[0];
        let y = socket.getAttribute("id").split("-")[1];
        socketArr.push(new Socket(x,y))
    }
    let randomPosition = generateRandomSocketPosition(10)
    for (let i = 0; i < 7; i++) {socketArr[randomPosition[i]].type = "grass"}
    socketArr[randomPosition[7]].type = "bush"
    socketArr[randomPosition[8]].type = "bush"
    socketArr[randomPosition[9]].type = "tree"
}
generateRandomSocketPosition = (n) => {
    let socketIndex = [];
    for (let socket in socketArr) {socketIndex.push(socket)};   
    const shuffled = socketIndex.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}
initialiseQueue = () => {for (let i = 0; i<3; i++) {queueArr[i] = new QueuePosition(i)}}
/**
 * refreshes sockets
 */
refreshSockets = () => {
    
    for (let socket of socketArr) {
        if (socket.root) {document.getElementById(`${socket.positionx}-${socket.positiony}`).setAttribute("class", `${socket.type} socket root`)} 
        else {document.getElementById(`${socket.positionx}-${socket.positiony}`).setAttribute("class", `${socket.type} socket`)}
    }
}
refreshQueue = () => {
    for (let queue of queueArr) {
        document.getElementById(`${queue.number}`).setAttribute("class", `${queue.type}`)
    }
}
/**
 * can merge takes in sockets and checks if typeMatch > 1, if so it sets canMerge to true calls propogation and refreshes
 */
canMerge = () => {
    console.log(socketArr.filter(socket => socket.type != "empty")) //sometimes merging emptys which doesnt affect game play but is cringe
    for (let socket of socketArr.filter(socket => socket.type != "empty")) {socket.canMergeMethod()}
    console.log(socketArr.filter(socket => socket.type != "empty"))
    merge()
    refreshSockets()
}
/**
 * If a neighboring socket can merge it passes on the value
 */
mergeAttributePropogation = () => {
    for (let socket of socketArr.filter(socket => socket.canMerge == false)) {
        if (socket.leftMergeReadiness) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
        if (socket.rightMergeReadiness) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
        if (socket.aboveMergeReadiness) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
        if (socket.belowMergeReadiness) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
    }
}
merge = () => { //need to get it to display the socket being placed, then merge then display then repeat if needed
    let toMerge = []
    for (let socket of socketArr.filter(socket => socket.canMerge == true)) {toMerge.push(socket)}
    if (toMerge.length == 0) {console.log("no merges");return}
    toMerge.sort((a,b) => a.age < b.age ? -1:1)
    combine(toMerge)
    canMerge()
}
/**
 * takes in the array of sockets to merge and merges them onto the youngest socket
 * then resets type to empty and false canMerge
 */
combine = ([root, ...rest]) => {
    console.log("combine called")
    console.log(root, rest)
    switch (root.type) {
        case "grass": root.type = "bush"; scorePopup = 100; break;
        case "bush": root.type = "tree"; scorePopup = 400; break;
        case "tree": root.type = "hut"; scorePopup = 1600; break;
        case "hut": root.type = "house"; scorePopup = 6400; break;
    }
    scoreTotal += scorePopup
    document.getElementById("score-popup").innerText = `${scorePopup}`
    document.getElementById("score").innerText = `Score: ${scoreTotal}`
    root.canMerge = false
    for (let socket of rest) {
        socket.type = "empty"
        socket.canMerge = false
    }
}
checkEnd = () => {for (let socket of socketArr.filter(socket => socket.value == "empty")) {return true}}
endGame = () => {
    alert("you lose")
    //document.getElementById('score-card').setAttribute("id") = "unhidden-score-card"
}


//copied from online
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  

ask richey to sort refresh feature to see 3 then combo 
ask richey to sort position absolute
ask richey to sort event listeners firing when assigned