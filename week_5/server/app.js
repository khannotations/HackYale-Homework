/* Copyright (C) 2013, Alex Reinking
 * All rights reserved.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
io = require('socket.io').listen(5349);
exec = require('child_process').exec;

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function select(board, set) {
    var ret = "";
    for(var i in set) {
        ret += board[set[i]];
    }
    return ret;
}

function freq(str, ch) {
    var f = 0;
    for(var i = 0; i < str.length; i++)
        if(str[i] === ch)
            f++;
    return f;
}

function opponent(player) {
    return (player === 'X') ? 'O' : 'X';
}

var groups = [[0,1,2], [3,4,5], [6,7,8], //rows
              [0,3,6], [1,4,7], [2,5,8], //cols
              [0,4,8], [2,4,6]];         //diags

function hasWinner(board) {
    for(var i in groups) {
        var group = select(board, groups[i]);
        if(freq(group, 'X') === 3)
            return 'X';
        else if(freq(group, 'O') === 3)
            return 'O';
    }
    return ' ';
}

function possibleMoves(board) {
    var moves = [];
    if(hasWinner(board) === ' ')
        for(var i = 0; i < board.length; i++)
            if(board[i] === ' ')
                moves.push(i);
    return moves;
}

function scoreForPlayer(board, player) {
    var score = 0;
    var opp = opponent(player);
    var none = ' ';

    for(var i = 0; i < groups.length; i++) {
        var group = select(board, groups[i]);
        if(freq(group, player) === 3) {
           score += 100;
        } else if(freq(group, player) === 2 && freq(group, none) === 1) {
           score += 10;
        } else if(freq(group, player) === 1 && freq(group, none) === 2) {
           score += 1;
        } else if(freq(group, opp) === 3) {
           score -= 100;
        } else if(freq(group, opp) === 2 && freq(group, none) === 1) {
           score -= 10;
        } else if(freq(group, opp) === 1 && freq(group, none) === 2) {
           score -= 1;
        }
    }

    return score;
}

function minimax(board, depth, player, me)
{
    var moves = possibleMoves(board);
    var bestScore = (player === me) ? -Infinity : Infinity;
    var currentScore;
    var bestPos = -1;
    
    if(moves.length === 0 || depth === 0) {
        bestScore = scoreForPlayer(board, me);
    } else {
        for(var i = 0; i < moves.length; i++) {
            board = board.replaceAt(moves[i], player);
            if(player === me) {
                currentScore = minimax(board, depth - 1, opponent(me), me).score;
                if(currentScore > bestScore) {
                    bestScore = currentScore;
                    bestPos = moves[i];
                }
            } else {
                currentScore = minimax(board, depth - 1, me, me).score;
                if(currentScore < bestScore) {
                    bestScore = currentScore;
                    bestPos = moves[i];
                }
            }
            board = board.replaceAt(moves[i], ' ');
        }
    }

    return { score: bestScore, move: bestPos };
}

var users = [];

io.sockets.on('connection', function(socket) {
    var screenName = null;

    socket.on('login', function(data) {
        if(!data.username) {
            socket.emit('error', { message: 'No user name.' });
            return;
        }
        for(var i in users) {
            if(users[i] === data.username) {
                socket.emit('error', { message: 'User name already in use.' });
                return;
            }
        }
        screenName = data.username;
        users.push(screenName);
        socket.on('send', function(data) {
            socket.broadcast.emit('message', { user: screenName, message: data.message });
        });
        socket.emit('success');
    });

    socket.on('disconnect', function() {
        if(!screenName) return;
        console.log(users);
        for(var i = users.length-1; i >= 0; i--){
	    if (users[i] === screenName) users.splice(i, 1);
        }
        console.log(users);
    });

    socket.on('hello', function() {
        exec('fortune', function(error, stdout, stderr) {
           socket.emit('hello', { message: stdout });
        });
    });

    socket.on('tictactoe', function(data) {
        var board = data.board;
        var player = data.cpu;
        var userData = (data.userData) ? data.userData : "";

        if(player != 'X' && player != 'O') {
            socket.emit('error', { message: 'Invalid player', userData: userData });
            return;
        }

        if(/^[XO ]{9}$/.exec(board) == null) {
            socket.emit('error', { message: 'Invalid board "' + board + '"', userData: userData });
            return;
        }

        var ai = minimax(board, 2, player, player);
        if(ai.move >= 0 && ai.move <= 8) {
            board = board.replaceAt(ai.move, player);
            socket.emit('move', { board: board, score: ai.score, userData: userData });
        }
        var winner = hasWinner(board);
        if(winner === player) {
            socket.emit('gameover', { winner: winner, message: 'Sorry! You lose!', userData: userData });
        } else if(winner === opponent(player)) {
            socket.emit('gameover', { winner: winner, message: 'Hooray! You won!', userData: userData });
        } else if(freq(board, ' ') === 0) {
            socket.emit('gameover', { winner: winner, message: "It's a tie. Let's play again.", userData: userData });
        }
    });
});
