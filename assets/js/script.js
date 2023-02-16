document.addEventListener("DOMContentLoaded", function() {
    let socketsEl = document.getElementsByClassName("socket")
    let arrays = startGame();
    refresh(arrays);
//    while (() => {for (let socket of socketsArr) {if (socket.type == "empty") return true }}) {}
    for (let socketEl of socketsEl) {
        socketEl.addEventListener("click", function() {
            for (let socket of arrays[0]) {
                
                if (socket.position == socketEl.getAttribute('id')) {
                    if (socket.type != "empty") {return}
                    let newType = getAndProgressQueue(arrays)
                    socket.type = newType
                    console.log(socketEl.getAttribute('id'))
                    refresh(arrays)
                }
            }
        });
    }
    
});
startGame = () => {
    var socketsArr = initialiseSockets();
    var queueArr = initialiseQueue();
    console.log(socketsArr)
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
            age: 0,
            //canMerge: canMerge(socketsArr)
        }
    }
    let randomPosition = generateRandomSocketPosition(socketIndex,10)
    console.log(randomPosition)
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
        document.getElementById(`${socket.positionx}-${socket.positiony}`).setAttribute("class", `${socket.type} socket`)
    }
    for (let queue of arrays[1]) {
        console.log(queue.number)
        console.log(document.getElementById(`${queue.number}`))
        document.getElementById(`${queue.number}`).setAttribute("class", `${queue.type}`)
    }

}
getRandomQueueType = () => {
    let a = Math.random()
    console.log(a)
    if (a >= 0.95) {
        console.log("tree");
        return "tree"
    } else if (a >= 0.8) {
        console.log("bush");
        return "bush"
    } else {
        console.log("grass")
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
    console.log(queueArr)
    return oldType
}