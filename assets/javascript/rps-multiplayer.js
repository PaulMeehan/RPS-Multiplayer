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
console.log("database initalized");

var v_p1name = "";
var v_p1pick = "";
var v_p1wins = 0;
var v_p1losses = 0;
var v_p1ties = 0;
var v_p2name = "";
var v_p2pick = "";
var v_p2wins = 0;
var v_p2losses = 0;
var v_p2ties = 0;

function updateDatabase() {
    console.log("updateDatabase");
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
        p2ties: v_p2ties
    })
};

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
    $("#enterPlayers").attr("hidden", false);
    $("#newGame").attr("hidden", true);
    // $(".players").css("visibility", "hidden");
    $(".game").css("visibility", "hidden");
    updateDatabase();

});

function resetGame() {
    console.log("resetGame");
    $(".choice").attr("hidden", true);
    $(".game").attr("hidden", false);
    $(".game").css("visibility", "visible");
    $("#messages").text("Make your choices ...");
};

$("#signin").on("click", function() {
    event.preventDefault();
    newName = $("#pname").val();
    if (v_p1name.length === 0) {
        v_p1name = newName;
        // $("#player1").css("visibility","visible");
        updateDatabase();
    } else {
        v_p2name = newName;
        // $("#player2").css("visibility", "visible");
        updateDatabase();
        $("#enterPlayers").attr("hidden", true);
        $("#newGame").attr("hidden", false);
        resetGame();
    };
    $("#pname").val("");
});

function determineWinner () {
    console.log("determineWinner");
    var winner = "";
    var intervalID = 0;

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
            $("#image1").attr("src", "assets/images/scissors.jpg")
        break;
    };

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

    if (winner === "p1") {
        v_p1wins = v_p1wins + 1;
        v_p2losses = v_p2losses + 1;
        $("#messages").text(v_p1name + " wins!!");
    } else if (winner === "p2") {
        v_p2wins = v_p2wins + 1;
        v_p1losses = v_p1losses + 1;
        $("#messages").text(v_p2name + " wins!!");
    } else {
        v_p1ties = v_p1ties + 1;
        v_p2ties = v_p2ties + 1;
        $("#messages").text("Tie Game!!");
    };

    v_p1pick = "";
    v_p2pick = "";

    updateDatabase();

    intervalID = setTimeout(resetGame, 5000);

};


database.ref().on("value", function (snapshot) {
    console.log("database ref value");
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

    $("#d_p1name").text(v_p1name);
    $("#d_p1wins").text(v_p1wins);
    $("#d_p1losses").text(v_p1losses);
    $("#d_p1ties").text(v_p1ties);
    $("#d_p2name").text(v_p2name);
    $("#d_p2wins").text(v_p2wins);
    $("#d_p2losses").text(v_p2losses);
    $("#d_p2ties").text(v_p2ties);

    if (v_p1pick.length > 0 && v_p2pick.length > 0) {
        $("#p1game").attr("hidden",true);
        $("#p1choice").attr("hidden",false);
        $("#choice1Text").text(v_p1pick);
        $("#p2game").attr("hidden", true);
        $("#p2choice").attr("hidden", false);
        $("#choice2Text").text(v_p2pick);

        determineWinner();
    }

    if (v_p1name.length === 0 || v_p2name.length === 0) {
        if (v_p1name.length === 0) {
            $("#messages").text("Waiting for Player 1 to sign in ...");
        } else {
            $("#messages").text("Waiting for Player 2 to sign in ...");
        };
        $("#enterPlayers").attr("hidden", false);
        $("#newGame").attr("hidden", true);
        $(".game").css("visibility", "hidden");
    } else {
        $("#enterPlayers").attr("hidden", true);
        $("#newGame").attr("hidden", false);
        $(".game").css("visibility", "visible");
    };
});


$(".gameButton").on("click", function() {
    console.log("gameButton");
    var thisButton = $(this).attr("id");
    console.log(thisButton);
    var thisPlayer = thisButton.slice(0,2);
    var thisPick = thisButton.slice(2);

    switch (thisPlayer) {
        case "p1":
            v_p1pick = thisPick;
            $("#p1game").css("visibility","hidden");
            $("#messages").text("Waiting for " + v_p2name + " to choose...");
            break;
        case "p2":
            v_p2pick = thisPick;
            $("#p2game").css("visibility", "hidden");
            $("#messages").text("Waiting for " + v_p1name + " to choose...");
            break;
    };

    updateDatabase();

});

// Start the game with the new game button displayed if players are already in the database.
// Otherwise, display the prompt for player names.

console.log("here");
$("#enterPlayers").attr("hidden", false);
$("#newGame").attr("hidden", true);

$(".choice").attr("hidden", true);

console.log("Bottom");
