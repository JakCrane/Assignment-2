
python3 -m http.server


Overarching style:
    this theme was meant to be a blend of retro arcade colours from the colour palette and the general wireframe structure of old flashgame websites like newsground

js validator: 
    Functions declared within loops referencing an outer scoped variable may lead to confusing semantics. (socketArr, socketEl, soundNum, refreshSockets, merge, checkEnd, endGame)
html validator:
    
css validator:

Purpose:
    I spent alot of my childhood playing free videogames from the online community so the purpose of my game is to be fun and the value of the game would be it is a good way to relieve stress.
Deployment:

Features - merge:
    Score / End game
        this section is there to add a competitive aspect to the game. to make it feel like youre playing against everyone else by being able to compare highscores like in the arcade game age. However if you start off poorly or make a mistake I thought it would be useful to be able to restart. 
    game body
        this is large and central on the screen. the general framework of this game was
    queue

How the code works - merge:
    The code initialises a class of socket objects and then works by altering the atributes of each socket then periodically updating what each socket should look like on the html. The logic of the merge function is when 3 or more sockets are connected (directly adjacent not diagonal) there must be atleast 1 socket with a type match with two of its neighbors. When this condition is satisfied it sets an attribute of readyToMerge to true and propagates this attribute value to all connected sockets. Once the value has stopped propagating it merges the sockets setting the most recently placed one to the value above its current, and the others back to empty. If 4 or more are connected then more points are rewarded and a slightly different sprite is shown. When no socket has the type attribute empty it is assumed that the game is lost and ends the game. The end game opens up a modal to reset the game and displays the final score.

How the code works - snake:
    The code works similarly to merge by having a class of tile objects and displaying them using a canvas. However, the snake game is directed using the arrow keys not the mouse and auto moves after a set time period. This logic works by changing the head position relative to a global direction variable. If the head tile moves either out of bounds or over a current snake tile then the game ends. If the head moves over a food tile then the global length variable is incremented by one the food attribute is set back to false and a new random tile is made a food tile. The age of the snake tile is used to calculate how long the snake should be and when a snake tile gets too old it is converted back to a blank tile

Future Features: 
    leader board:
        Because of how my javascript is set up alot of the values are public and able to be edited from the command line. This means that someone could break the code and add values or names I do not want being displayed in the webpage. Lacking time and sufficient knowledge to protect the code I decided to not add this into my game.
    snake size slider:
        Ideally I wanted a slider to be able to set the difficulty of the game. Due to the time pressure of the project, I couldnt add this function.

Known Bugs - merge:
    If the random starting position results in 3 grass being nexto eachother then they will combine at the start. This was ideal as it added variance to the starting positions but the score doesnt reset to 0 and special attribute doesnt reset to false. This means you can start with points. This doesnt affect functionality in the game but does make it look less professional and thought out.
    
    There are some inconsistencies with whether the special atribute is passed upwards to the socket made from merging special socket. This hasn't been fully playtested but has been noticed sometimes.

    If the sockets are ever full it ends the game, even if they have the possibility of merging down and freeing sockets.

Acknowledgements: 
    Richey Malhotra - Supervisor
    Bootstrap framework