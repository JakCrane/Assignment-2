document.addEventListener("DOMContentLoaded", function() {
    let socketsEl = document.getElementsByClassName("socket")
    let arrays = startGame();
    canMerge(arrays[0]);
    refresh(arrays)
    for (let socketEl of socketsEl) {
        socketEl.addEventListener("click", function() {
            for (let socket of arrays[0]) {
                if (socket.position == socketEl.getAttribute('id')) {
                    if (socket.type != "empty") {return}
                    for (let socketAger of arrays[0]) {socketAger.age++}
                    let newType = getAndProgressQueue(arrays)
                    socket.type = newType
                    socket.age = 0
                    refresh(arrays)
                    setTimeout(5000)
                    canMerge(arrays[0])
                    refresh(arrays)
                    if (checkEnd(arrays[0])) {endGame()}
                }
            }
        });
    }
    let endGameButton = document.getElementById("endGame")
    endGameButton.addEventListener("click", endGame())
});
startGame = () => {
    var socketsArr = initialiseSockets();
    var queueArr = initialiseQueue();
    return [socketsArr, queueArr]
}
initialiseSockets = () => {
    var socketsArr = []
    var sockets = document.getElementsByClassName("socket")
    var socketIndex = (() => {
        let arr = [];
        for (let socket in sockets) {arr.push(socket)};
        return arr.slice(0, 36)})();
    for (let socket in socketIndex) {
        socketsArr[socket] = {
            position: sockets[socket].getAttribute("id"),
            positionx: sockets[socket].getAttribute("id").split("-")[0],
            positiony: sockets[socket].getAttribute("id").split("-")[1],
            type: "empty",
            age: Math.random(),
            typeMatch: 0,
            canMerge: false,
        }
    }
    let randomPosition = generateRandomSocketPosition(socketIndex,10)
    for (let i = 0; i < 7; i++) {
        socketsArr[randomPosition[i]].type = "grass"
    }
    socketsArr[randomPosition[7]].type = "bush"
    socketsArr[randomPosition[8]].type = "bush"
    socketsArr[randomPosition[9]].type = "tree"
    return socketsArr
}
generateRandomSocketPosition = (socketIndex,n) => {
    const shuffled = socketIndex.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n)
}
initialiseQueue = () => {
    var queueArr = []
    for (let i = 0; i<3; i++) {
        queueArr[i] = {
            type: getRandomQueueType(),
            number: `position${i}`,
        }
    }
    return queueArr
}
refresh = (arrays) => {
    for (let socket of arrays[0]) {
        if (socket.type != "empty") {
            if (socket.canMerge) {document.getElementById(`${socket.positionx}-${socket.positiony}`).setAttribute("class", `${socket.type} merge socket`)}
            else {document.getElementById(`${socket.positionx}-${socket.positiony}`).setAttribute("class", `${socket.type} socket`)}
        } else {document.getElementById(`${socket.positionx}-${socket.positiony}`).setAttribute("class", "empty socket")}
    }
    for (let queue of arrays[1]) {
        document.getElementById(`${queue.number}`).setAttribute("class", `${queue.type}`)
    }

}
getRandomQueueType = () => {
    let a = Math.random()
    if (a >= 0.95) {
        return "tree"
    } else if (a >= 0.8) {
        return "bush"
    } else {
        return "grass"
    }
}
getAndProgressQueue = (arrays) => {
    let queueArr = arrays[1];
    let oldType = queueArr[0].type
    for (let i = 0; i<2; i++) {
        queueArr[i].type = queueArr[i + 1].type
    }
    queueArr[2].type = getRandomQueueType()
    return oldType
}
canMerge = (socketArr) => {
    for (let socket of socketArr) {
        if (socket.type != "empty") {
            socket.typeMatch = 0
            if (socket.type == getLeftType(socket, socketArr)) {socket.typeMatch++}
            if (socket.type == getRightType(socket, socketArr)) {socket.typeMatch++}
            if (socket.type == getAboveType(socket, socketArr)) {socket.typeMatch++}
            if (socket.type == getBelowType(socket, socketArr)) {socket.typeMatch++}
            if (socket.typeMatch >= 2) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
        } 
    }
    merge(socketArr);
}
getLeftType = (socket, socketArr) => {
    let x = parseInt(socket.positionx)
    if (x == 0) {return null}
    let y = parseInt(socket.positiony)
    for (let socketLeft of socketArr) {
        if (socketLeft.positiony == y) {
            if (socketLeft.positionx == (x - 1)) {
                return socketLeft.type
            }
        }
    }
} 
getRightType = (socket, socketArr) => {
    let x = parseInt(socket.positionx)
    if (x == 5) {return null}
    let y = parseInt(socket.positiony)
    for (let socketRight of socketArr) {
        if (socketRight.positiony == y) {
            if (socketRight.positionx == (x + 1)) {
                return socketRight.type
            }
        }
    }
} 
getAboveType = (socket, socketArr) => {
    let x = parseInt(socket.positionx)
    let y = parseInt(socket.positiony)
    if (y == 0) {return null}
    for (let socketAbove of socketArr) {
        if (socketAbove.positiony == (y - 1)) {
            if (socketAbove.positionx == x) {
                return socketAbove.type
            }
        }
    }
} 
getBelowType = (socket, socketArr) => {
    let x = parseInt(socket.positionx)
    let y = parseInt(socket.positiony)
    if (y == 5) {return null}
    for (let socketBelow of socketArr) {
        if (socketBelow.positiony == (y + 1)) {
            if (socketBelow.positionx == x) {
                return socketBelow.type
            }
        }
    }
} 
mergeAttributePropogation = (socketArr) => {
    for (let socket of socketArr) {
        if (socket.canMerge == false) {
            if (getLeftMergeReadiness(socket, socketArr)) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
            if (getRightMergeReadiness(socket, socketArr)) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
            if (getAboveMergeReadiness(socket, socketArr)) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
            if (getBelowMergeReadiness(socket, socketArr)) {socket.canMerge = true; mergeAttributePropogation(socketArr)}
        }
    }
}
getLeftMergeReadiness = (socket, socketArr) => {
    let x = parseInt(socket.positionx)
    if (x == 0) {return null}
    let y = parseInt(socket.positiony)
    for (let socketLeft of socketArr) {
        if (socketLeft.positiony == y) {
            if (socketLeft.positionx == (x - 1)) {
                if (socketLeft.type == socket.type) {
                    return socketLeft.canMerge
                } else {
                    return false
                }         
            }
        }
    }
} 
getRightMergeReadiness = (socket, socketArr) => {
    let x = parseInt(socket.positionx)
    if (x == 5) {return null}
    let y = parseInt(socket.positiony)
    for (let socketRight of socketArr) {
        if (socketRight.positiony == y) {
            if (socketRight.positionx == (x + 1)) {
                if (socketRight.type == socket.type) {
                    return socketRight.canMerge
                } else {
                    return false
                } 
            }
        }
    }
} 
getAboveMergeReadiness = (socket, socketArr) => {
    let x = parseInt(socket.positionx)
    let y = parseInt(socket.positiony)
    if (y == 0) {return null}
    for (let socketAbove of socketArr) {
        if (socketAbove.positiony == (y - 1)) {
            if (socketAbove.positionx == x) {
                if (socketAbove.type == socket.type) {
                    return socketAbove.canMerge
                } else {
                    return false
                } 
            }
        }
    }
} 
getBelowMergeReadiness = (socket, socketArr) => {
    let x = parseInt(socket.positionx)
    let y = parseInt(socket.positiony)
    if (y == 5) {return null}
    for (let socketBelow of socketArr) {
        if (socketBelow.positiony == (y + 1)) {
            if (socketBelow.positionx == x) {
                if (socketBelow.type == socket.type) {
                    return socketBelow.canMerge
                } else {
                    return false
                } 
            }
        }
    }
} 
merge = (socketArr) => {
    console.log("merge called")
    let toMerge = []
    for (let socket of socketArr) {
        if (socket.canMerge) {
            toMerge.push(socket)
        }
    }
    if (toMerge.length == 0) {console.log("no merges");return}
    toMerge.sort((a,b) => a.age < b.age ? -1:1)
    combine(toMerge)
    canMerge(socketArr)
}
combine = ([root, ...rest]) => {
    console.log("combine called")
    console.log(root, rest)
    switch (root.type) {
        case "grass": root.type = "bush"; break;
        case "bush": root.type = "tree"; break;
        case "tree": root.type = "hut"; break;
        case "hut": root.type = "house"; break;
    }
    root.canMerge = false
    for (let socket of rest) {
        socket.type = "empty"
        socket.canMerge = false
        socket
    }
}
checkEnd = (socketArr) => {
    for (let socket of socketArr) {
        if (socket.value == "empty") {return false}
        return true
    }
}
endGame = () => {
    document.getElementById('score-card').setAttribute("id") = "unhidden-score-card"
}