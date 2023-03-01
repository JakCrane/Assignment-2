
python3 -m http.server

wanted to add: 
    leader board
    accessiblity

things i would fix given infinite time:
    score doesnt reset to 0 and socket.special doesnt reset to false if there is a combo at the beginning of the game
    if the sockets are ever full it ends the game, even if they merge

Overarching style:
    this theme was meant to be a blend of retro arcade colours from the colour palette and the general wireframe structure of old flashgame websites like newsground

js validator: 
    Functions declared within loops referencing an outer scoped variable may lead to confusing semantics. (socketArr, socketEl, soundNum, refreshSockets, merge, checkEnd, endGame)
html validator:
    
css validator:


Features - merge:
    Score / End game
        this section is there to add a competitive aspect to the game. to make it feel like youre playing against everyone else by being able to compare highscores like in the arcade game age. However if you start off poorly or make a mistake I thought it would be useful to be able to restart. 
    game body
        this is large and central on the screen. the general framework of this game was
    queue