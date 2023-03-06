class Socket {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.type = "empty";
        this.root = false;
        this.readyToMerge = false;
        this.age = Math.random();
        this.element = document.getElementById(`${x}-${y}`);
        this.special = false;
    }
    get leftType() {
        if (parseInt(this.x) == 0) {return null;}
        return socketArr.filter(socket => socket.x == (parseInt(this.x) - 1)).filter(socket => socket.y == parseInt(this.y))[0].type;
    }
    get rightType() {
        if (parseInt(this.x) == 5) {return null;}
        return socketArr.filter(socket => socket.x == (parseInt(this.x) + 1)).filter(socket => socket.y == parseInt(this.y))[0].type;
    } 
    get aboveType() {
        if (parseInt(this.y) == 0) {return null;}
        return socketArr.filter(socket => socket.x == parseInt(this.x)).filter(socket => socket.y == (parseInt(this.y) - 1))[0].type;
    } 
    get belowType() {
        if (parseInt(this.y) == 5) {return null;}
        return socketArr.filter(socket => socket.x == parseInt(this.x)).filter(socket => socket.y == (parseInt(this.y) + 1))[0].type;
    } 
    get leftMergeReadiness() {
        if (parseInt(this.x) == 0) {return null;}
        return socketArr.filter(socket => socket.x == (parseInt(this.x) - 1)).filter(socket => socket.y == parseInt(this.y))[0].readyToMerge;
    } 
    get rightMergeReadiness() {
        if (parseInt(this.x) == 5) {return null;}
        return socketArr.filter(socket => socket.x == (parseInt(this.x) + 1)).filter(socket => socket.y == parseInt(this.y))[0].readyToMerge;
    } 
    get aboveMergeReadiness() {
        if (parseInt(this.y) == 0) {return null;}
        return socketArr.filter(socket => socket.x == parseInt(this.x)).filter(socket => socket.y == (parseInt(this.y) - 1))[0].readyToMerge;
    } 
    get belowMergeReadiness() {
        if (parseInt(this.y) == 5) {return null;}
        return socketArr.filter(socket => socket.x == parseInt(this.x)).filter(socket => socket.y == (parseInt(this.y) + 1))[0].readyToMerge;
    } 
    get typeMatch() {
        if (this.type == "empty") return 0;
        let typeMatch = 0;
        if (this.type == this.leftType) {typeMatch++;}
        if (this.type == this.rightType) {typeMatch++;}
        if (this.type == this.aboveType) {typeMatch++;}
        if (this.type == this.belowType) {typeMatch++;}
        return typeMatch;
    }
    updateSocket() {
        this.age = 0;
        this.type = getAndProgressQueue();
        socketArr.map(socket => ++socket.age);
    }
    canMerge() {
        if (this.type == "empty") return false;
        if (this.typeMatch >= 2) {this.readyToMerge = true; return true;}
        if (this.type == this.leftType) {if (this.leftMergeReadiness) {this.readyToMerge = true; return true;}}
        if (this.type == this.rightType) {if (this.rightMergeReadiness) {this.readyToMerge = true; return true;}}
        if (this.type == this.aboveType) {if (this.aboveMergeReadiness) {this.readyToMerge = true; return true;}}
        if (this.type == this.belowType) {if (this.belowMergeReadiness) {this.readyToMerge = true; return true;}}
        return false; 
    }
}
class QueuePosition {
    constructor(i) {
        this.type = getRandomQueueType();
        this.number = `position${i}`;
    }    
}
var socketArr = [], queueArr = [], scoreTotal = 0, scorePopup = 0, soundNum = 0; //initialising variables
var place = new Audio('assets/sounds/mixkit-message-pop-alert-2354.mp3');
var myModal = new bootstrap.Modal(document.getElementById('myModal'));

document.addEventListener("DOMContentLoaded", function() {
    startGame(); 
    for (let socketEl of document.getElementsByClassName("socket")) {
        socketEl.addEventListener("click", function() {
            let socket = socketArr.filter(socket => socket.element == socketEl)[0]; //matching the socket in the arr to the element
            if (socket.type != "empty") {return;} //checking its empty (cannot interact with full sockets)
            socket.updateSocket();
            soundNum = 0;
            refreshSockets();
            merge();
            if (!checkEnd()) {refreshSockets(); endGame();}
        });
    }
    document.getElementById("end-button").addEventListener("click", endGame);
});
function startGame() {
    initialiseSockets();
    initialiseQueue();
    refreshQueue();
    if(!merge()) {refreshSockets();}
    try { for (let socket of socketArr.filter(socket => socket.special == true)) {socket.special = false;}}
    catch (error) {console.log("no initial specials");}
    scoreTotal = 0;
    document.getElementById("score").innerText = `Score: ${scoreTotal}`;
}
function initialiseSockets() {
    let sockets = document.getElementsByClassName("socket");
    for (let socket of sockets) {
        let x = socket.getAttribute("id").split("-")[0];
        let y = socket.getAttribute("id").split("-")[1];
        socketArr.push(new Socket(x,y));
    }
    let randomPosition = generateRandomSocketPosition(10);
    for (let i = 0; i < 7; i++) {socketArr[randomPosition[i]].type = "grass";}
    socketArr[randomPosition[7]].type = "bush";
    socketArr[randomPosition[8]].type = "bush";
    socketArr[randomPosition[9]].type = "tree";
}
function generateRandomSocketPosition(n) {
    let socketIndex = [];
    for (var i = 0; i < socketArr.length; i++) {socketIndex.push(i);}   
    const shuffled = socketIndex.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}
function initialiseQueue() {for (let i = 0; i<3; i++) {queueArr[i] = new QueuePosition(i);}}
function refreshSockets() {
    for (let socket of socketArr) {
        if (socket.special) {
            document.getElementById(`${socket.x}-${socket.y}`).setAttribute("class", `socket ${socket.type}special`);
            document.getElementById(`${socket.x}-${socket.y}`).setAttribute("alt", `sokcet containing a large ${socket.type}`);
        }
        else {
            document.getElementById(`${socket.x}-${socket.y}`).setAttribute("class", `${socket.type} socket`);
            document.getElementById(`${socket.x}-${socket.y}`).setAttribute("alt", `socket containing ${socket.type}`);
        }
    }
    //if (soundNum == -2 || -1) {return;}
    //else if (soundNum == 0) {place.play();}
    //else if (soundNum == 1) {place.play();}
    //else if (soundNum == 2) {place.play();}
    //else if (soundNum == 3) {place.play();}
    //else {place.play();}
    //soundNum++;
}
function refreshQueue() {
    for (let queue of queueArr) {
        document.getElementById(`${queue.number}`).setAttribute("class", `${queue.type}`);
        document.getElementById(`${queue.number}`).setAttribute("alt", `${queue.type}`);
    }
}
function propagate() {
    for (let socket of socketArr.filter(socket => socket.type != "empty" && socket.type != "house" && socket.readyToMerge == false)) {
        if (socket.canMerge() == true) {propagate(); return;}
    }
}
function merge() { //need to get it to display the socket being placed, then merge then display then repeat if needed
    setTimeout( function onTick() {
        propagate();
        let toMerge = socketArr.filter(socket => socket.readyToMerge == true);
        if (toMerge.length == 0) {return false;}
        try {socketArr.filter(socket => socket.root == true)[0].root = false;}
        catch (error) {}
  		for (let socket of toMerge) {socket.readyToMerge = false;}
        toMerge.sort((a,b) => a.age < b.age ? -1:1);
        toMerge[0].root = true;
        switch (toMerge[0].type) {
            case "grass": toMerge[0].type = "bush"; scorePopup = 100; break;
            case "bush": toMerge[0].type = "tree"; scorePopup = 400; break;
            case "tree": toMerge[0].type = "hut"; scorePopup = 1600; break;
            case "hut": toMerge[0].type = "house"; scorePopup = 6400; break;
        }
        if (toMerge.length > 3) {
            toMerge[0].special = true;
            scorePopup *= 1.5;
        }
        scoreTotal += scorePopup;
        document.getElementById("score").innerText = `Score: ${scoreTotal}`;
        for (let socket of toMerge.filter(socket => socket.root == false)) {
            socket.type = "empty";
            socket.special = false;
        }
        refreshSockets();
        merge();
    }, 250);  
}
function checkEnd() {
    if (socketArr.filter(socket => socket.type == "empty").length == 0) {return false;}
    else {return true;}
}
function endGame() {
    document.getElementById("reset-button").addEventListener("click", restartGame);
    document.getElementById("reset-button").innerText = "Try Again";
    document.getElementById("modal-text").innerText = `Your final Score was: ${scoreTotal}`;
    myModal.show(); 
}
function restartGame() {
    for (let socket of socketArr) {
        socket.type = "empty";
        socket.root = false;
        socket.readyToMerge = false;
        socket.age = Math.random();
        socket.special = false;
    }
    let randomPosition = generateRandomSocketPosition(10);
    for (let i = 0; i < 7; i++) {socketArr[randomPosition[i]].type = "grass";}
    socketArr[randomPosition[7]].type = "bush";
    socketArr[randomPosition[8]].type = "bush";
    socketArr[randomPosition[9]].type = "tree";
    for (let i = 0; i<3; i++) {getAndProgressQueue();}
    if(!merge()) {refreshSockets();}
    try { for (let socket of socketArr.filter(socket => socket.special == true)) {socket.special = false;}}
		catch (error) {}
    scoreTotal = 0;
    document.getElementById("score").innerText = `Score: ${scoreTotal}`;
}
function getAndProgressQueue() {
    let oldType = queueArr[0].type;
    for (let i = 0; i<2; i++) {queueArr[i].type = queueArr[i + 1].type;}
    queueArr[2].type = getRandomQueueType();
    refreshQueue();
    return oldType;
}
function getRandomQueueType() {
    let a = Math.random();
    if (a >= 0.95) {
        return "tree";
    } else if (a >= 0.8) {
        return "bush";
    } else {
        return "grass";
    }
}