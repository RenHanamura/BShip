var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships:[
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess); 
		  if (ship.hits[index] === "hit") {
				view.displayMessage("Man, ya le habías dado a ese barco");
				return true;
			} else if (index >= 0) {
					ship.hits[index] = "hit";
					view.displayHit(guess);
					view.displayMessage("Eso te suma una baja");
					if (this.isSunk(ship)) {
						view.displayMessage("Hundiste un barco aaaaaaaaaa");
						this.shipsSunk++;
					}
					return true;
				}
		}
		view.displayMiss(guess);
		view.displayMessage("Fallaste");
		return false;
	},

	isSunk: function(ship) {
		for (i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
				this.ships[i].locations = locations;
		}
				console.log("si");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { 
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}

};

var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class","hit");

	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class","miss");
	}
};

var controller = {
	guesses: 0,
	processGuess: function(location) {
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Hundiste todos los barcos en " + this.guesses + " intentos.");
				var end = document.getElementById("guessInput").disabled = true;
			}
		}
	}
}

window.onload = init;

function init() {

	var guessClick = document.getElementsByTagName("td");
		for (var i = 0; i < guessClick.length; i++) {
			guessClick[i].onclick = answer;
		}

	model.generateShipLocations();
	view.displayMessage("Vamos a iniciar el juego, hay 3 barcos de 3 casillas cada uno");
}

function answer(eventObj) {
	var shot = eventObj.target;
	var location = shot.id;
	controller.processGuess(location);
}




