
// ~ Game Constants ~ 

//a cell display state
const HIDDEN = 0;
const VISIBLE = 1;

//a cell game state
const EMPTY = '';
const NUMBER = '|';
const MINE = '*';

const ON = 10;
const OFF = 11;


//	~ Global Vars ~

//a global var representing the game board
var gBoard = {	height: 10, width: 10, mines: 10, status: "" };

//the game current state
var gState = { status: ON, shownCount: 0, markedCount: 0 };

//the HTML game area
var gameArea = document.querySelector("#gameArea");

//the number of clean spaces needed to mark to winthe game
var gSquareCounter = (gBoard.height * gBoard.width) - gBoard.mines;

// ~ Sounds ~
var openBox = new Audio('audio/openBox.wav');

//	~ Main ~

//This funciton is called after the user submited the game board size and number of mines, it's used to start the game
function submitGameData(){

	//change game state
	gState.status = ON;
	
	//change message
	print('');
	
	//board data
	gBoard.height = document.getElementById('height').value;
	gBoard.width = document.getElementById('width').value;
	gBoard.mines = document.getElementById('mines').value;
	
	//reset square counter
	gSquareCounter = (gBoard.height * gBoard.width) - gBoard.mines;
	
	//init the matrix
	gBoard.matrix = null;
		
	//init the game board
	initGameBoard();
}

//a function for initializing the game board
function initGameBoard(){
	
	//create a matrix
	createEmptyMatrix();
	
	//place mines in the newly created matrix
	placeMines();
	
	//draw game board
	drawMatrix();
	
}

//A function for creating the boards matrix
function createEmptyMatrix(){
	
	// save board's height and width
	var height = gBoard.height;
	var width = gBoard.width;
		 
	//	create the board's matrix
	var resMatrix = new Array(height);
	
	for (var i = 0; i < height; i++) {

		resMatrix[i] = new Array(width);	
	}
	
	//update the global board
	gBoard.matrix = resMatrix;
	
	//init the matrix's cells
	for (var i = 0; i < height; i++) {
		
		for (var j = 0; j < width; j++) {
			
			gBoard.matrix[i][j] = { status: EMPTY, contains: '', display: HIDDEN, negs: 0, marked: false, classToSave: ''};
			
		}
	}
}

//A function for randomly placing mines on the game board
function placeMines(){
	
	var numOfMines = gBoard.mines;
	var row, col;
	var foundEmptySquare = false;
		
	//place every mine
	for (var i = 1; i <= numOfMines; i++) {

		//find an empty square in the matrix
		while(!foundEmptySquare){
		
			//pick a random row
			row = getRandomInt(0, gBoard.height - 1);

			//pick a random column
			col = getRandomInt(0, gBoard.width - 1);			
			
			//check if it's empty
			foundEmptySquare = isEmpty(row, col);
			
		}
		
		//place a mine in the empty square found
		gBoard.matrix[row][col].status = MINE;
		foundEmptySquare = false;
		
	}
	
}

//A function for counting the number of negs for a given cell
function negCounter(row, col){

	//init to 0
	var negCounter = 0;
	
	//itterate the (row, col) cell's negs
	for(var i = row - 1; i <= row + 1; i++){
		
		for(var j = col - 1 ; j <= col + 1; j++){
			
			//it's own cell: skip
			if(i === row && j === col){
				continue;
			}
			
			//check if it's defined
			else if(!isOutOfBorder(i, j)){
				
				var currentCell = gBoard.matrix[i][j];
			
				//if a mine exist in this place
				if (currentCell.status === MINE){
					
					//update negCounter
					negCounter++;
				}
			}
		}
	}
	
	//update current cell's status
	if (negCounter > 0){
		gBoard.matrix[row][col].status = NUMBER;
		
	}
	
//	console.log(negCounter, " negs");
	return negCounter;
}

//check if the cell exist or it's out of bound
function isOutOfBorder(i, j){
	
	// save board's height and width
	var height = gBoard.height;
	var width = gBoard.width;
	var isOutOfBorder = false;
	
	if ((i < 0 || height <= i) || (j < 0 || width <= j)){
		isOutOfBorder = true;
	}
	
	return isOutOfBorder;
}

//A function for checking if a given cell is empty
function isEmpty(i, j){	
	return (gBoard.matrix[i][j].status === EMPTY);
}

//A funciton for printing the board to the console
function drawMatrix(){
	
	//init HTML string
	var strToDraw = '';
	
	// save board's height and width
	var height = gBoard.height;
	var width = gBoard.width;
	
	//itterate the rows
	for (var i = 0; i < height; i++) {
		
		strToDraw += '<tr>'
		
		//itterate the cols
		for (var j = 0; j < width; j++) {

			//save current cell
			var currentCell = gBoard.matrix[i][j];
			
			//check the class name to add
			var classToAdd = convertConstToString(gBoard.matrix[i][j].status);
			
			//add it to the HTML string
			
			strToDraw += '<td class="' + classToAdd + '" id="('+ i + ',' + j + ')" oncontextmenu="addMark('+ i + ',' + j + '); return false;" onclick="cellClicked(this,' + i + ',' + j +')">' + gBoard.matrix[i][j].contains + '</td>';
			
		}
	
		strToDraw += '</tr>';
	}	
	
	gameArea.innerHTML = strToDraw;
}

function addMark(i, j){
	
	console.log('Right');
	
	var currCell = gBoard.matrix[i][j];
	var elCell = document.getElementById('(' + i + ',' + j + ')');
	
	//does not contain a mark
	if (!currCell.marked){	
		
		//save the current class for this cell
		currCell.classToSave = elCell.classList[0];
		
		//change to marked
		elCell.className = 'marked';
		currCell.marked = true;	
	}
	
	//contains a mark, remove it
	
	else{
		//return the previos classes
		elCell.className = currCell.classToSave;
		currCell.marked = false;
	}		
}

//A function for converting a const to a string
function convertConstToString(input){
	
	var classToAdd = "";
	
	switch(input){
		case EMPTY:
			classToAdd = "empty";
			break;
		case MINE:
			classToAdd = "mine";
			break;
		case HIDDEN:
			classToAdd = "hidden";
			break;
		case VISIBLE:
			classToAdd = "visible";
			break;			
		default:
			break;
	}	
	
	return classToAdd;
}

//when a cell is clicked this function will run
function cellClicked(elCell, i, j){
	
	if (gState.status === OFF){
		return;
	}
	
	//play music
	openBox.play();
	
	//save the current cell
	var currentCell = gBoard.matrix[i][j];
 
	//if landed on a mine, game over
	if (currentCell.status === MINE){
	
		gameOver();
	}
	
	//else, call recursive expand function
	else{
		
		expand(i, j);
	
		//check if won the game
		if (gSquareCounter === 0){
			
			print("Very Nice! You have won!");
			revealAll();
		
		
		}

	}
}

//A recursive funtion that expands the soduko board according to the mine sweeper rules
function expand(i, j){
	
	//out of bounds
	if(isOutOfBorder(i, j)){
		return;
	}
	
	//in bounds
	else{
		
		//save the current cell
		var currentCell = gBoard.matrix[i][j];
		var elCell = document.getElementById('(' + i + ',' + j + ')');
		
		//already visited
		if(currentCell.visited){
			return;
		}
	
		//mark true
		currentCell.visited = true;
	
		//status: MINE - return
		if (currentCell.status === MINE){
			return;
		}
		
		//not a mine, continue
		else{

			
			//check how many negs it has
			currentCell.negs = negCounter(i, j);

			//status: NUMBER
			if (currentCell.status === NUMBER){
				
				//update its content
				currentCell.contains = currentCell.negs;

				elCell.innerHTML = currentCell.contains;

				// reveal cell
				reveal(i, j);
				
				//decrese counter
				gSquareCounter--;
				print('Only ' + gSquareCounter + ' more to go!');

				
			}
		
			//status: EMPTY
			else{

				//reveal cell
				reveal(i, j);
				
				//decrese counter
				gSquareCounter--;
				print('Only ' + gSquareCounter + ' more to go!');

				//recursively call to all sides
				
				//go up-left
				expand(i-1, j-1); 
				
				//go up
				expand(i-1, j); 
				
				//go up-right
				expand(i-1, j+1);
				
				//go left
				expand(i, j-1);

				//go right
				expand(i, j+1);
				
				//go down-left
				expand(i+1, j-1);
				
				//go down
				expand(i+1, j);	
				
				//go down-right
				expand(i+1, j+1);

			}
		}
	}
}

//A function that reveals the given cell
function reveal(i, j){
	
	var curentCell = gBoard.matrix[i][j];
	var elCell = document.getElementById('(' + i + ',' + j + ')');
	
	curentCell.display = VISIBLE;
	elCell.className += ' ' + convertConstToString(VISIBLE);
	elCell.style.opacity = '1';
}

//Returns a random integer between min (included) and max (included)
function getRandomInt(min, max) {	
  return Math.floor(Math.random() * (max - min + 1)) + min;
	
}

//A function that is called uppon game over
function gameOver(){
	
	gState.status = OFF;
	print("Game Over!");
	
	revealAll();
	
}

function print(msg){
		document.getElementById("messageArea").innerHTML = msg;
}

//reveal board
function revealAll(){
	
	// save board's height and width
	var height = gBoard.height;
	var width = gBoard.width;
	
	//itterate the rows
	for (var i = 0; i < height; i++) {
				
		//itterate the cols
		for (var j = 0; j < width; j++) {
			
			var elCell = document.getElementById('(' + i + ',' + j + ')');
			elCell.style.opacity = '1';
		}
	}
}






