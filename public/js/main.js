var allTheCharacters = [];
var allTheCharactersComp = [];
var theHuman = [];
var theComputer = [];
var turn = 0;
var allNames = [];
var allHumanNames = [];




// allTheCharacters.length = 18
// questions.length = 15

$(document).ready(function(event) {
    newGame();
    theFlasher();
    $('#card').fadeIn(600).css('display', 'flex');
});

var newGame = function() {
    $('.start-button').one('click', function(event) {
        turn == 0;
    });
};




// Get JSON and callback so JSON can be stored globally - Connect to MongoDB
$.getJSON('https://api.mlab.com/api/1/databases/guess-who/collections/characters?apiKey=uqMRuWlxeuNOKkDKdZhq-ONxMlrPvs5G', callback);
// Below line cannot connect directly from a browser. You need a server side component.
//$.getJSON('mongodb://localhost:27017/guessWho', callback);

// Populate faces and names in HTML
function callback(data) {
    /*optional stuff to do after success  */
    var $charNames = $('.char-names');
    var $faceImage = $('.faces');

    $.each(data, function(index, val) {
        console.log("success");
        /* iterate through array or object */
        /* .eq() method constructs new object from one element from set  */
        $charNames.eq(index).text(val.name);
        $faceImage.eq(index).attr('src', val.image);
        //Push all JSON to array
        allTheCharacters.push(val);
        allTheCharactersComp.push(val);
    });

}

console.log(allTheCharacters);
console.log(allTheCharactersComp);

// Start button click event
$('.start-button').on('click', function() {
    pickAPlayer();
    pickComputerPlayer();
    // alert("Now pick from an attribute from the dropdown menu");
    //$('.instructDialog').find('p').text('Great!!! Now pick an attribute from the dropdown menu');
    $('.dialogBox').find('h3').empty();
    $('.dialogBox').find('p').empty();
    $('.instructDialog').show().find('h3').text("PLAYER 1 - YOUR TURN TO PLAY");
    $('.instructDialog').show().find('p').text("Make your choice from 'PICK A FEATURE' menu on the left");
    var sound = new Howl({
        src: ['sounds/squiggle.mp3']
    });
    sound.play();
});

// Reset button click event
$('.reset-button').on('click', function() {
    window.location.reload();
});

// Pick random  H U M A N  player
function pickAPlayer() {
    //theHuman = [];
    random = Math.floor(Math.random() * allTheCharacters.length - 1);
    // console.log(allTheCharacters[random]);
    player1 = allTheCharacters[random];
    // Store human char in theHuman Array
    theHuman.push(player1);
    console.log(theHuman);
    $('.whoContainerTextHuman').text(theHuman[0].name);

    $.each(theHuman, function(index, val) {
        /* iterate through array or object */
        //console.log(val.image);
        $('img.who-player').fadeOut('200', function() {
            $(this).attr('src', val.image).css('width', '100px')
                .css('width', '100%')
                .css('height', 'auto')
                .css('margin', '4px')
                .css('padding', '6px').fadeIn('300');
        });
    });
}


// Pick random  C O M P U T E R  player
function pickComputerPlayer() {
    //theComputer = [];
    random = Math.floor(Math.random() * allTheCharacters.length - 1);
    // console.log(allTheCharacters[random]);
    comp1 = allTheCharacters[random];
    // Store human char in theComputer Array
    theComputer.push(comp1);
    console.log(theComputer);

    $('img.who-computer').fadeOut('200', function() {
        $(this).attr('src', 'img/comp-avatar.jpg').css('width', '100px')
            .css('width', '100%')
            .css('height', 'auto')
            .css('margin', '4px')
            .css('padding', '6px').fadeIn('300');
    });
}

// R E S E T  B U T T O N
function resetPlayer() {
    theHuman = [];
    theComputer = [];
    $('img.who-player, img.who-computer').attr('src', 'img/who-avatar.jpg')
        .css('width', '100%')
        .css('height', 'auto')
        .css('margin', '4px')
        .css('padding', '6px').fadeIn('300');
    console.log(theHuman);
    console.log(theComputer);
}

// Loop scorebpard images
// $('td.scoreboard').each(function(i) {
//     $(this).css('background-image', 'url(img/score-avatar.jpg)')
//         .css('width', '2.6vw')
//         .css('height', '4.4vh')
//         .css('background-size', 'cover')
//         .css('background-position', 'center center')
//         .css('padding', '3px');
// });



//Get <SELECT> values
function grabInputValue() {
    // click event on select submit
    $(".pickAFeatureBtn").on('click', function(e) {
        e.preventDefault();

        humanTurn();
        //setUpHumanTurnClick();
        console.log(turn);
    });
}
grabInputValue();


// H U M A N   T U R N   T O   P L A Y
function humanTurn() {
    allNames = [];
    remainingNames = [];

    //check if computerplayer has feature
    var Feature = $('.featureList').val();
    if (theComputer[0][Feature] === true) {
        //remove all with false feature because it matches and we don't want anyone with it
        allNames = allTheCharactersComp.filter(function(player, i) {
            $('.dialogBox').find('p')
                .text("YES! " + Feature + " is right! Remove non matching characters and click button to continue.")
                .append('<br><button class="okButton">CONTINUE</button>');
            $('.dialogBox').find('h3')
                .text("PLAYER 1");
            return allTheCharactersComp[i][Feature] === false;
        });

        remainingNames = allTheCharactersComp.filter(function(player, i) {
            return allTheCharactersComp[i][Feature] === true;
        });
    } else {
        //remove all with true feature because it doesn't match
        allNames = allTheCharactersComp.filter(function(player, i) {
            $('.dialogBox').find('p')
                .text("NO! " + Feature + " is wrong! Remove non matching characters and click button to continue.")
                .append('<br><button class="okButton">CONTINUE</button>');
            $('.dialogBox').find('h3')
                .text("PLAYER 1");
            return allTheCharactersComp[i][Feature] === true;
        });

        remainingNames = allTheCharactersComp.filter(function(player, i) {
            return allTheCharactersComp[i][Feature] === false;
        });
    }

    if (allNames.length === 0) {
        $('.dialogBox').find('p')
            .text("Nothing Matched! Click button to continue.")
            .append('<br><button class="okButton">CONTINUE</button>');
        //nothing matched in the list.
    } else {
        removeRedundantCharacterImages();
        var nameArray = [];
        for (var i = 0; i < allNames.length; i++) {
            nameArray.push(allNames[i].name);
        }

        // var nameString = nameArray.toString();
        // $('.dialogBox').find('p')
        //     .text("Click on " + nameString + " to remove them from the game! Then click button to continue.")
        //     .append('<br><button class="okButton">CONTINUE</button>');
        // $('.dialogBox').find('h3')
        //     .text("PLAYER 1");

    }

    //remove
    allTheCharactersComp = remainingNames;

    turn = 1;
    if (turn === 1) {
        setUpComputersTurnClick();
    } else {
        humanTurn();
    }
};

// C O M P U T E R  T U R N  E V E N T  H A N D L E R S

$('.yesButton').on('click', function() {
    computerTurn();
});
$('.noButton').on('click', function() {
    computerTurn();
});


// C O M P U T E R   T U R N   T O   P L A Y
function computerTurn() {
    console.log('computers turn');

    allHumanNames = [];
    remainingHumanNames = [];

    //check if computerplayer has feature
    var Feature = questions[0].key;
    if (theHuman[0][Feature] === true) {
        //remove all with false feature because it matches and we don't want anyone with it
        allHumanNames = allTheCharacters.filter(function(player, i) {
            return allTheCharacters[i][Feature] === false;
        });

        remainingHumanNames = allTheCharacters.filter(function(player, i) {
            return allTheCharacters[i][Feature] === true;
        });
    } else {
        //remove all with true feature because it doesn't match
        allHumanNames = allTheCharacters.filter(function(player, i) {
            return allTheCharacters[i][Feature] === true;
        });

        remainingHumanNames = allTheCharacters.filter(function(player, i) {
            return allTheCharacters[i][Feature] === false;
        });

    }

    //remove
    allTheCharacters = remainingHumanNames;

    // Update scoeboard
    $('.headCount').text(allTheCharacters.length);

    //check for all allTheCharactersComp.length === 0
    if (allTheCharacters.length === 1) {
        //display to screen human is loser
        //console.log(allTheCharacters[0]['name']);
        finalHumanName = allTheCharacters[0]['name'];
        $('.computerDialog').find('h3').text("YOU PATHETIC HUMAN!");
        $('.computerDialog')
            .show()
            .find('p').text("Your character is " + finalHumanName + " - YOU LOSE");
        $('.yesNoButtonsContainer').hide();
        // Play fail Sound
        var sound = new Howl({
            src: ['sounds/fail.mp3']
        });
        sound.play();

        return;
    }

    turn = 0;
    if (turn === 0) {
        setUpHumanTurnClick();
    } else {
        setUpComputersTurnClick();
    }
    console.log(allHumanNames.length);
    console.log(remainingHumanNames.length);

};


// S E T  U P  C O M P U T E R  T U R N
function setUpComputersTurnClick() {
    $('.okButton').on('click', function(e) {
        // questions comes from questions.js file

        if (allTheCharactersComp.length === 1) {
            // Play winner sound
            var sound = new Howl({
                src: ['sounds/success.mp3']
            });
            sound.play();

            //display to screen winner
            finalComputerName = theComputer[0]['name'];
            finalComputerImage = theComputer[0]['image'];
            $('.dialogBox').find('p').text("YOU WON! " + finalComputerName + " - is my character");
            $('.whoContainerTextComp').text(finalComputerName);
            $('img.who-computer').fadeOut('200', function() {
                $(this).attr('src', finalComputerImage).css('width', '100px')
                    .css('width', '100%')
                    .css('height', 'auto')
                    .css('margin', '4px')
                    .css('padding', '6px').fadeIn('300');
            });
            return;
        }

        var theQuestion = questions[0 + 1].question;
        //var theQuestion = questions[0].question;
        //console.log(theQuestion);
        //alert('Button clicked!');
        $('.dialogBox').find('p').empty();
        $('.instructDialog').hide();
        $('.computerDialog').show().find('p').text(theQuestion);
        $('.computerDialog').show().find('h3').text("COMPUTER - IT'S MY TURN TO PLAY");
        questions.shift();
        //console.log(questions);
        $('.headCount').text(allTheCharacters.length);
    })
};



// S E T  U P   H U M A N   T U R N
function setUpHumanTurnClick() {
    // questions comes from questions.js file
    var theQuestion = questions[0].question;
    console.log(theQuestion);
    //alert('Button clicked!');
    $('.dialogBox').find('p').empty();
    $('.instructDialog').show().find('p').text("Make your choice from 'PICK A FEATURE' menu on the left");
    $('.computerDialog').hide();
    turn = 0;
};



function removeRedundantCharacterImages() {
    $redundantFace = $('.faces');
    $redundantFace.on('click', function(e) {
        e.preventDefault();
        // Fire Sound on click event
        var sound = new Howl({
            src: ['sounds/pinwheel.mp3']
        });
        sound.play();
        // Act on the event
        imgAttr = $(this).attr('src');
        // Use data attr in HTML to change src of image
        var newImgSrc = 'img/' + $(this).data('flipimg');
        var wrongXimg = 'img/wrong/correct-choice.jpg';
        // console.log(wrongXimg);
        // console.log(newImgSrc);
        if ($(this).attr('src') === newImgSrc) {
            $(this).fadeOut('200', function() {
                $(this).attr('src', 'img/wrong/correct-choice.jpg').fadeIn('200');
            })
        } else {
            $(this).fadeOut('200', function() {
                $(this).attr('src', newImgSrc).fadeIn('200');
            })
        }
    });
}

// for scoreboard flash effect
function theFlasher() {
    var target = $('.scoreCard');
    var backgrounds = [
        'url(../img/neon.png)',
        'url(../img/neon2.png)'
    ];
    var current = 0;

    function nextBackground() {
        target
            .css('background', backgrounds[current = ++current % backgrounds.length])
            .css('background-size', 'contain')
            .css('background-repeat', 'no-repeat')
            .css('background-position', 'center center');

        setTimeout(nextBackground, 2000);
    }
    setTimeout(nextBackground, 2000);
    target
        .css('background-size', 'contain');
};
