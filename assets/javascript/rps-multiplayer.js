// Initialize Firebase
var config = {
    apiKey: "AIzaSyCEuYcpbevjbif6balykLe2ovuxvLEsmNs",
    authDomain: "rpsmultiplayer-f9433.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-f9433.firebaseio.com",
    projectId: "rpsmultiplayer-f9433",
    storageBucket: "rpsmultiplayer-f9433.appspot.com",
    messagingSenderId: "450126282220"
};
firebase.initializeApp(config);
var database = firebase.database();

// Define global variables
var v_p1name = "";   // Player 1 name
var v_p1pick = "";   // Option chosen by player 1
var v_p1wins = 0;    // Number of times player 1 won
var v_p1losses = 0;  // Number of times player 1 lost
var v_p1ties = 0;    // Number of times player 1 tied
var v_p2name = "";   // Player 2 name
var v_p2pick = "";   // Option chosen by player 2
var v_p2wins = 0;    // Number of times player 2 won
var v_p2losses = 0;  // Number of times player 2 lost
var v_p2ties = 0;    // Number of times player 2 tied
var v_conversation = "";  // Full conversation chatted between the two players (in HTML format)
var v_message = "";  // Message to both players

// Write values in global variables out to the database
function updateDatabase() {
    database.ref().set({    
        p1name: v_p1name,
        p1pick: v_p1pick,
        p1wins: v_p1wins,
        p1losses: v_p1losses,
        p1ties: v_p1ties,
        p2name: v_p2name,
        p2pick: v_p2pick,
        p2wins: v_p2wins,
        p2losses: v_p2losses,
        p2ties: v_p2ties,
        conversation: v_conversation,
        message: v_message
    });

};

// Start a new game - reset all global variables and prompt for player names
$("#newGame").on("click", function () {
    event.preventDefault();
    v_p1name = "";
    v_p1pick = "";
    v_p1wins = 0;
    v_p1losses = 0;
    v_p1ties = 0;
    v_p2name = "";
    v_p2pick = "";
    v_p2wins = 0;
    v_p2losses = 0;
    v_p2ties = 0;
    v_conversation = "";
    v_message = "Waiting for Player 1 to sign in ..."
    // Display text box prompt for palyer names and submit button
    $("#enterPlayers").attr("hidden", false);
    // Hide the New Game button
    $("#newGame").attr("hidden", true);
    // Hide the game choice buttons
    $(".game").css("visibility", "hidden");
    updateDatabase();

});

// Reset the display for the next round.
function resetGame() {
    // Hide what was chosen during last round
    $(".choice").attr("hidden", true);
    // Display the game choice buttons
    $(".game").attr("hidden", false);
    $(".game").css("visibility", "visible");
    // Update the player instructions.
    v_message = "Make your choices ...";
    updateDatabase();
};

// Sign in new player and update the display
$("#signin").on("click", function() {
    event.preventDefault();
    // Obtain the name that is entered
    newName = $("#pname").val();
    // If player 1 name is blank, make new entry player 1.
    if (v_p1name.length === 0) {
        v_p1name = newName;
        // Display button to accept chats from Player 1
        $("#submit1").attr("hidden",false);
        updateDatabase();
    // If player 1 already recorded, make new entry player 2
    // and do not allow more players to join.
    } else {
        v_p2name = newName;
        updateDatabase();
        // Hide the text box and button for adding new players.
        $("#enterPlayers").attr("hidden", true);
        // Display the button to allow starting a new game.
        $("#newGame").attr("hidden", false);
        // Display button to accept chats from Player 2
        $("#submit2").attr("hidden", false);
        // Set the display up for the first round.
        resetGame();
    };
    $("#pname").val("");
});

// Determine which player won the game.
function determineWinner () {
    var winner = "";       // Flag indicating which player won or tie game
    var intervalID = 0;    // Timer interval id.

    // Determine winner based on each possible combination of choices.
    switch (v_p1pick) {
        case "rock":
            switch (v_p2pick) {
                case "rock":
                    winner = "tie";
                    break;
                case "paper":
                    winner = "p2";
                    break;
                case "scissors":
                    winner = "p1";
                    break;
            };
            // Set the image for Player 1 choice.
            $("#image1").attr("src","assets/images/rock.jpg")
            break;
        case "paper":
            switch (v_p2pick) {
                case "rock":
                    winner = "p1";
                    break;
                case "paper":
                    winner = "tie";
                    break;
                case "scissors":
                    winner = "p2";
                    break;
            };
            // Set the image for Player 1 choice.
            $("#image1").attr("src", "assets/images/paper.jpg")
            break;
        case "scissors":
            switch (v_p2pick) {
                case "rock":
                    winner = "p2";
                    break;
                case "paper":
                    winner = "p1";
                    break;
                case "scissors":
                    winner = "tie";
                    break;
            };
            // Set the image for Player 1 choice.
            $("#image1").attr("src", "assets/images/scissors.jpg")
        break;
    };

    // Set the image for Player 2 choice.
    switch (v_p2pick) {
        case "rock":
            $("#image2").attr("src", "assets/images/rock.jpg")
            break;
        case "paper":
            $("#image2").attr("src", "assets/images/paper.jpg")
            break;
        case "scissors":
            $("#image2").attr("src", "assets/images/scissors.jpg")
            break;
    };

    // Update each player's scores according to who won
    // and update the common message to both players.
    if (winner === "p1") {
        v_p1wins = v_p1wins + 1;
        v_p2losses = v_p2losses + 1;
        v_message = v_p1name + " wins!!";
    } else if (winner === "p2") {
        v_p2wins = v_p2wins + 1;
        v_p1losses = v_p1losses + 1;
        v_message = v_p2name + " wins!!";
    } else {
        v_p1ties = v_p1ties + 1;
        v_p2ties = v_p2ties + 1;
        v_message = "Tie Game!!";
    };

    // Reset the variables with each player's choices.
    v_p1pick = "";
    v_p2pick = "";

    updateDatabase();

    // Pause for 5 seconds before resetting the game for the next round.
    intervalID = setTimeout(resetGame, 5000);

};


// Procedure run each time database is updated.
database.ref().on("value", function (snapshot) {
    // Set global variables to values from the database.
    v_p1name = snapshot.val().p1name;
    v_p1pick = snapshot.val().p1pick;
    v_p1wins = snapshot.val().p1wins;
    v_p1losses = snapshot.val().p1losses;
    v_p1ties = snapshot.val().p1ties;
    v_p2name = snapshot.val().p2name;
    v_p2pick = snapshot.val().p2pick;
    v_p2wins = snapshot.val().p2wins;
    v_p2losses = snapshot.val().p2losses;
    v_p2ties = snapshot.val().p2ties;
    v_conversation = snapshot.val().conversation;
    v_message = snapshot.val().message;

    // Display the values in the appropriate places in the document.
    $("#d_p1name").text(v_p1name);
    $("#d_p1wins").text(v_p1wins);
    $("#d_p1losses").text(v_p1losses);
    $("#d_p1ties").text(v_p1ties);
    $("#d_p2name").text(v_p2name);
    $("#d_p2wins").text(v_p2wins);
    $("#d_p2losses").text(v_p2losses);
    $("#d_p2ties").text(v_p2ties);
    $("#messages").text(v_message);

    // Display the chat conversation in HTML
    $("#conversation").html(v_conversation);
    // The conversation Div is returned as an array with one item.
    var convoDiv = $("#conversation")[0];
    // Scroll to the bottom of the conversation to ensure most recent statements are displayed
    convoDiv.scrollTop = convoDiv.scrollHeight;

    // If the database contains a choice from both players, do the following:
    if (v_p1pick.length > 0 && v_p2pick.length > 0) {
        // Hide the game choice buttons
        $("#p1game").attr("hidden",true);
        // Display the image and text of the player's choice
        $("#p1choice").attr("hidden",false);
        $("#choice1Text").text(v_p1pick);

        $("#p2game").attr("hidden", true);
        $("#p2choice").attr("hidden", false);
        $("#choice2Text").text(v_p2pick);

        // Determine who won the round.
        determineWinner();
    }

    // If no name entered yet for Player 1 or Player 2, do the following:
    if (v_p1name.length === 0 || v_p2name.length === 0) {
        // Display common message indicating which player needs to sign in.
        if (v_p1name.length === 0) {
            v_message = "Waiting for Player 1 to sign in ...";
        } else {
            v_message = "Waiting for Player 2 to sign in ...";
        };
        // Display text box and button to allow players to sign in
        $("#enterPlayers").attr("hidden", false);
        // Hide button for starting a new game.
        $("#newGame").attr("hidden", true);
        $(".game").css("visibility", "hidden");
        updateDatabase();
    } else {
        // If both players are signed in:
        // Hide text box and button to not allow more players to sign in
        $("#enterPlayers").attr("hidden", true);
        // Display button to allow starting a new game.
        $("#newGame").attr("hidden", false);
        $(".game").css("visibility", "visible");
    };
});

// Function to process player clicking game choice button.
$(".gameButton").on("click", function() {
    // Determine the ID of the button that was clicked
    var thisButton = $(this).attr("id");
    // The player number is the first two characters of the id.
    var thisPlayer = thisButton.slice(0,2);
    // The choice made is the remainder of the id.
    var thisPick = thisButton.slice(2);

    // Display commen message that game is waiting on the "other" player to choose.
    switch (thisPlayer) {
        case "p1":
            v_p1pick = thisPick;
            // Hide the player's game choice buttons.
            $("#p1game").css("visibility","hidden");
            v_message = "Waiting for " + v_p2name + " to choose...";
            break;
        case "p2":
            v_p2pick = thisPick;
            $("#p2game").css("visibility", "hidden");
            v_message = "Waiting for " + v_p1name + " to choose...";
            break;
    };

    updateDatabase();

});

// Record the chat text from Player 1.
$("#submit1").on("click", function () {
    var pname = v_p1name;
    // chat text is added as a new Div that is color-coded and justified based on the player.
    var newP = "<div class='chatLeft'>";
    newP = newP + pname + ": " + $("#chat-input").val();
    newP = newP + "</div>";
    // Append the new Div to the current conversation.
    v_conversation = v_conversation + newP;
    // Reset the text in the chat box.
    $("#chat-input").val("");
    updateDatabase();
});

// Record the chat text from Player 2.
$("#submit2").on("click", function () {
    var pname = v_p2name;
    var newP = "<div class='chatRight'>";
    newP = newP + pname + ": " + $("#chat-input").val();
    newP = newP + "</div>";
    v_conversation = v_conversation + newP;
    $("#chat-input").val("");
    updateDatabase();
});


// When game first starts, sign in text box and button will be displayed and new game button is hidden.
// This will be immediately reversed if database shows players are already signed in. 
$("#enterPlayers").attr("hidden", false);
$("#newGame").attr("hidden", true);
$("#submit1").attr("hidden", true);
$("#submit2").attr("hidden", true);

$(".choice").attr("hidden", true);

