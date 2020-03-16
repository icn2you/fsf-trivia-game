/******************************************************************************
FSWD:  Christopher B. Zenner
Date:  03/16/2020
File:  app.js
Ver.:  0.1.0 20200311
       
This JS script implements a basic trivia game in which the user is presented
with a question and four (4) options. The user is given 30 seconds to answer
the question. If the question is answered within the allotted timeframe, the 
game notifies the user if the answer is correct or incorrect, and then pro-
ceeds to the next question. If the question is not answered within the allot-
ted time frame, the game offers the correct answer, and the proceeds to the 
next question. Once all questions have been answered or missed, the game
displays the number of questions answered correctly and incorrectly. The user
is given the option to play again.
******************************************************************************/
const wonderWomenTriviaInstr = "Click the Start button to begin";
const dataset = wonderWomen;
const numQns = 10;
const timeout = 15;

class TriviaGame {
  // PROPERTIES
  name = "Trivia";
  instructions = "";
  #dataset = [];
  #defaultImages = {
    "correctGIF": null,
    "incorrectGIF": null,
    "unansweredGIF": null
  };
  #correct = 0;
  #incorrect = 0;
  #unanswered = 0;

  // METHODS
  /* *************************************************************
     Constructor Method
     - Create an object of type TriviaGame
     ************************************************************* */
  constructor(name, instr, qna, images) {
    this.name = name;
    this.instructions = instr;
    this.#dataset = qna;
    this.#defaultImages = images;
  }
    
  /* *************************************************************
     Accessor Methods
     - Get object properties
     ************************************************************* */
  getGameName() {
    return this.name;
  }

  getGameInstr() {
    return this.instructions;
  }

  getTriviaQnA() {
    // Return random trivia Q&A set
    var index = Math.floor(Math.random() * this.#dataset.length);

    // DEBUG:
    // console.log(this.#dataset);
    // console.log("size = " + this.#dataset.length);
    // console.log ("index = " + index);

    return this.#dataset[index];
  }

  getCorrectAnsGIF() {
    return this.#defaultImages.correctGIF;
  }

  getIncorrectAnsGIF () {
    return this.#defaultImages.incorrectGIF;
  }

  getUnansGIF () {
    return this.#defaultImages.unansweredGIF;
  }

  getNumCorrectAns() {
    return this.#correct;
  }

  getNumIncorrectAns() {
    return this.#incorrect;
  }

  getNumUnans() {
    return this.#unanswered;
  }

  /* *************************************************************
     getRandomQnA()
     - Retrieve a random question with answers from the dataset.
     ************************************************************* */      
  getRandomQnA() {
    // return ...;
  }

  /* *************************************************************
     incrementLosses()
     - Add a loss to player's tallies.
     ************************************************************* */      
  incrementCorrectAns() {
    this.#correct++;
  }
  
  /* *************************************************************
     incrementWins()
     - Add a win to player's tallies.
     ************************************************************* */    
  incrementIncorrectAns() {
    this.#incorrect++;
  }

  /* *************************************************************
     incrementWins()
     - Add a win to player's tallies.
     ************************************************************* */    
  incrementUnans() {
      this.#unanswered++;
  }

  /* *************************************************************
     swapCorrectAns()
     - Randomize position of correct answer. Return index of 
       correct answer.
     ************************************************************* */
  swapCorrectAns(ans) {
    var correctAns = ans[0],
        index = Math.floor(Math.random() * ans.length),
        swappedAns = ans[index];

    ans[index] = correctAns;
    ans[0] = swappedAns;
    
    return index;
  }  

  /* *************************************************************
     resetGameState()
     - Reset relevant game properties such that a new game is
       initialized.
     ************************************************************* */
  resetGameState() {
      // ...  
  }  
}

// Execute script once page is fully loaded
$(document).ready(function() {
  // Create game object.
  let wonderWomenTrivia = new TriviaGame("Real Wonder Women Trivia",
    wonderWomenTriviaInstr,
    dataset,
    {
      "correctGIF": { 
        "src": "https://media.giphy.com/media/RIuHHNa7UgFKo/source.gif",
        "alt": "Rose Nylund Strutting Her Stuff" 
      }, 
      "incorrectGIF": {
        "src": "https://media.giphy.com/media/5TC1o3oRE68Mg/source.gif",
        "alt": "..."
      }, 
      "unansweredGIF": {
        "src": "https://media.giphy.com/media/JzOyy8vKMCwvK/source.gif",
        "alt": "..."
      }
    });

  // Initialize stopwatch
  var stopwatch = timeout;

  // ********************************************
  // displayQnASet() - Trivia question w/answers
  // ********************************************
  function displayQnASet(qna) {
    // DEBUG:
    // console.log(qna);

    // console.log("before: " + qna.answers);
    var correctAnsID = wonderWomenTrivia.swapCorrectAns(qna.answers);
    // console.log("after: " + qna.answers);

    $("#question").text(qna.question);

    qna.answers.forEach(function(ans, i) {
      var optID = "opt-0" + (i + 1);

      $("#options").append('<button type="button" class="list-group-item list-group-item-action" id="' + optID + '">');
      $('#' + optID).text(ans);
    });

    return correctAnsID;
  }

  // ********************************************
  // displayResult() - Player feedback
  // ********************************************
  function displayResult(comment, img) {   
    $("#question").empty();
    $("#options").empty();

    $("#result-comment").text(comment);
    $("#result-img").append('<img>');
    $("#result-img > img").attr({
      src: img.src,
      alt: img.alt
    });
  }  

  // ********************************************
  // displaySecsLeft() - UI stopwatch
  // ********************************************
  function displaySecsLeft() {
    stopwatch--;
    $("#stopwatch").text(stopwatch);
  }

  // ********************************************
  // resetStopwatch() - UI stopwatch reset
  // ********************************************
  // function resetStopwatch(stopwatchID) {
  //   clearInterval(stopwatchID);
  // }

  // Once player clicks the Start Game button, launch a new game.
  $("#start-btn").on("click", function() {
    // Get rid of the start button.
    $("#game-launchpad").empty();
    // Initiate UI stopwatch.
    $("#stopwatch").text(stopwatch);

    // Grab interval ID so it can be reset.
    var intervalID = setInterval(displaySecsLeft, 1000);
    // Select Q&A set.
    var qAndAnsSet = wonderWomenTrivia.getTriviaQnA();
    // Display Q&A set and remember correct answer.
    var correctAns = displayQnASet(qAndAnsSet);
    // Allow user x seconds to answer question such that x = timeout.
    var timeoutID = setTimeout(function() {
      $("#stopwatch").text("Time's up!");
      clearInterval(intervalID);
    }, (timeout * 1000));

    // DEBUG:
    // console.log("correct ans: " + qAndAnsSet.answers[correctAns]);

    $("#options").on("click", function(event) {
      var targetID = "#" + event.target.id,
          targetIDContents = $(targetID).text();

      var timeToNextQuesID = setTimeout(function() {

      }, ((timeout / 3) * 1000));

      // DEBUG:
      // console.log("event target ID: " + targetID);
      // console.log("event target contents: " + targetIDContents);
      // console.log("correct ans: " + qAndAnsSet.answers[correctAns]);

      clearInterval(intervalID);
      clearTimeout(timeoutID);
  
      if (targetIDContents === qAndAnsSet.answers[correctAns]) {
        // DEBUG:
        // console.log("CORRECT!");
        wonderWomenTrivia.incrementCorrectAns();
        
        displayResult("CORRECT!", wonderWomenTrivia.getCorrectAnsGIF());
      } 
      else {
        console.log("WRONG!");
      }
    });
  });
});