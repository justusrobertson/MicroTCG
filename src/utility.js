  //Card Data object for JSON export
  class cardData {
    constructor(cost, power, type, modifier) {
      this.cost = cost;
      this.power = power;
      this.type = type;
      this.modifier = modifier;
    }
  }
export class Utility {
    // Globally accessible variables
    static placedCards = [];
    static isPlayer1Turn = true;
    static turn = 2;
    static gameOver = false;
    static energyStep = 1;
    static maxTurns = 4;
    static ai = null;
    static gameScene = null;
    static restartButton = null;

    // Tutorial variables
    static isTutorial = true;
    static tutorialText = null;
    static tutorialSnapPoint = null;
    static tutorialIndex = 0;
    static tutorialTexts = [
        `Welcome! Drag the leftmost card in your hand to the bottom-middle area.`,
        `Great! All cards have 3 components:
            Top-Left: Energy Cost - This is the cost to play a card on the field.
            Top-Right: Color Contribution - This is the amount a card contributes to the color of a lane.
            Center: Power - This is how many points a card is worth if its color matches the lane's color.
End your turn now to allow your opponent to play.`,
        `Since you played a card with 1 color contribution, the lane has changed colors.
Now let's play a card that will add to your score. Play the leftmost card in your hand to the bottom-middle area.`,
        `Great! Now when you end your turn, you will gain 1 point.`,
        `Looks like your opponent is gaining power in the left lane. Block them by
playing a card that has 2 color contribution.`,
        `Now when you end your turn, your equal color contributions will cancel out.`,
        `Nice work! Now your opponent has no score from that lane. Try stealing their
right lane now by playing a card with more contribution than they have.`,
        `After ending your turn, you should control that lane unless they match your contribution.`,
        `Looks like they regained control of the left lane, but you still managed
to steal the right lane. You won! Press Restart to move on.`,


//------------------------------------ Part 2 -----------------------/
    /*    `Let's start a fresh game to learn how to use colors. Play the leftmost card in the bottom-middle area.`,
        `Great! Let's end the turn to see what the opponent does.`,
        `Looks like the opponent has made the left lane blue but is not posing any threat yet. Let's bolster
the middle lane with a card that has 1 power.`,
        `Now once you end the turn you will have 1 point.`,
        `Looks like the opponent is beginning to stack blue cards on the left lane. Instead of blocking them this
time, try playing your blue card with 3 power to utilize the work they've already done.`,
        `Awesome! While blocking can be a good strategy if your opponent is playing high-power cards, there is also
value in using what your opponent has already created. Now end your turn to move into the final round of the game.`,
        `Looks like your opponent is trying to start something in the right lane. Let's try to steal it with your
4-Cost card.`,
        ``,
        `Amazing, you've won! Now that you have an understanding of how you can use colors to both block and match
your opponents, it is time to press Restart to play some practice matches. Good luck!`,*/


    ];
    static tutorialTextsCont = [
 
`Now that you have learned the basics, it's time to learn how to counter your opponent.
To counter, we first have to determine what tactic our opponent is playing, start by playing the 
leftmost card in the middle and pass the turn to see what they are up to.`,
``,
`It is still hard to say what they are planning so for just keep building up your own lane in the meanwhile!`,
"",
`A common tactic to winning is power stacking, which involves stacking all your high power cards in the same lane.`,
`While it is a valid tactic, it is easily countered by changing the location type, making all that power worth nothing.`,
`It seems your opponent is attempting to Power-Stack a lane with fire cards!`,
`Try to counter them by placing high Water-Contribution cards on your side to counter it.`,
`Very good! if you keep countering the lane with water cards none of those high power fire card will matter!`,
``,
`Amazing, you've won! Now that you have an understanding of how to counter your opponents, it is time to press Restart to play some practice matches. Good luck!`,

    ]

    static debugMode = false;
    static aiPlayed = false;

    // Ends the caller's turn
    static passTurn(deck1, deck2) {
        // Lock any played cards from change
        this.placedCards.forEach(card => {
            card.isLocked = true;
            this.updateLocation(card, card.currentSnapPoint);
        });
        this.placedCards = [];

        // Only run turn-passing code if the game is still running
        if (!this.gameOver) {
            // If game is still ongoing, end turn
            if (this.turn <= this.maxTurns || this.isPlayer1Turn) {
                // Update energy
                if (this.isPlayer1Turn) deck1.energyText.text = 'Energy: ' + Math.min((this.turn * this.energyStep), this.maxTurns * this.energyStep);
                else deck2.energyText.text = 'Energy: ' + (this.turn * this.energyStep);

                // Draw a card
                if (this.turn <= this.maxTurns) this.isPlayer1Turn ? this.isTutorial ? deck1.drawTopCard(1) : deck1.drawRandomCard(1) : deck2.drawRandomCard(1);
                
                // Hide the AI's hand
                deck2.hand.forEach(card => {
                    card.texture = PIXI.Texture.from(Utility.ai.cardBack);
                });

                // Update whose turn it is
                this.isPlayer1Turn = !this.isPlayer1Turn;
                if (this.isPlayer1Turn) 
                    {
                        this.turn++;
                        this.aiPlayed = false;
                    }
                
                else {
                    this.ai.takeTurn();
                    this.aiPlayed = true;
                }

                

                this.collectHandData(deck1.hand,deck2.hand);
                


            }
            // Otherwise, end game
            else {
                // Get scores and calculate the winner
                const playerScore = parseInt(deck1.scoreText.text.split(' ')[1]);
                const oppScore = parseInt(deck2.scoreText.text.split(' ')[1]);
                if (playerScore > oppScore) {
                    this.drawText(`You win!`, window.innerWidth / 2, window.innerHeight / 2, 'white', this.gameScene, 72);
                }
                else if (oppScore > playerScore) {
                    this.drawText(`You lose!`, window.innerWidth / 2, window.innerHeight / 2, 'white', this.gameScene, 72);
                }
                else {
                    this.drawText(`You tied!`, window.innerWidth / 2, window.innerHeight / 2, 'white', this.gameScene, 72);
                }

                this.gameOver = true;
                this.restartButton.position.set(window.innerWidth - 200, 150);
            }
        }
    }

    // Recalculate the score from the given lane if the location changed types
    static recalculateScore(snapPoint, newType) {
        let score = parseInt(snapPoint.snapPoints[0].card.deck.scoreText.text.split(' ')[1]);
        let oppositeScore = snapPoint.oppositeSnapPoint.snapPoints[0].card !== null ? parseInt(snapPoint.oppositeSnapPoint.snapPoints[0].card.deck.scoreText.text.split(' ')[1]) : -1;

        snapPoint.snapPoints.forEach(card => {
            if (card.card !== null) {
                if (card.card.type === snapPoint.location.type) score -= card.card.power;
                else if (card.card.type === newType) score += card.card.power;
            }
        });
        snapPoint.oppositeSnapPoint.snapPoints.forEach(card => {
            if (card.card !== null) {
                if (card.card.type === snapPoint.location.type) oppositeScore -= card.card.power;
                else if (card.card.type === newType) oppositeScore += card.card.power;
            }
        });

        snapPoint.snapPoints[0].card.deck.scoreText.text = 'Score: ' + score;
        if (snapPoint.oppositeSnapPoint.snapPoints[0].card !== null) snapPoint.oppositeSnapPoint.snapPoints[0].card.deck.scoreText.text = 'Score: ' + oppositeScore;
    }

    // Utility function to draw text to the screen
    static drawText(text, x, y, fillColor, scene, fontSize = 26) {
        let textBox = new PIXI.Text(text);
        textBox.anchor.set(0.5, 0.5);
        textBox.position.set(x, y);
        textBox.zIndex = 3;
        textBox.style.fill = fillColor;
        textBox.style.fontSize = fontSize;
        scene.addChild(textBox);
        return textBox;
    }

    // Check if the player has enough energy to play a card. Remove that energy if so
    static checkEnergy(card, energyText) {
        const energy = parseInt(energyText.text.split(' ')[1]);

        if (energy >= card.energyCost) energyText.text = `Energy: ${energy - card.energyCost}`;
        else return false;

        return true;
    }
    static checkEnergyAI(card, energyText) {
        const energy = parseInt(energyText.text.split(' ')[1]);

        if (energy >= card.energyCost) 
        {return true;}
        else return false;

    }


    // Update the score when a card is placed at a location
    static updateScore(card, location, scoreText) {
        const score = parseInt(scoreText.text.split(' ')[1]);
        if (card.type === location) scoreText.text = `Score: ${score + card.power}`;
    }

    // Update the color of a location
    static updateLocation(card, snapPoint) {
        // Iterate through each type modifier on the card
        card.modifiers.forEach(type => {
            let shouldChange = true;
            snapPoint.numElements[type]++;

            // Only check for a type change if the types are not equal
            if (type !== snapPoint.location.type) {
                for (let i = 0; i < 2; i++) {
                    let element;

                    switch (i) {
                        case 0:
                            element = 'Fire';
                            break;
                        case 1:
                            element = 'Water';
                            break;
                    }
                    
                    if(type !== element){
                        // If the contribution of the current type is less than the current lane contribution, do not change
                        if (snapPoint.numElements[type] < snapPoint.numElements[element] || snapPoint.numElements[type] < snapPoint.oppositeSnapPoint.numElements[element]) {
                            shouldChange = false;
                            break;
                        }
                        // If the contribution of both types is equal, neutralize the lane
                        else if(snapPoint.numElements[type] === snapPoint.numElements[element] || snapPoint.numElements[type] === snapPoint.oppositeSnapPoint.numElements[element]){
                            type = 'None';
                            break;
                        }
                    }
                }

                // Change the lane type if necessary
                if (shouldChange || type === 'None') {
                    snapPoint.location.texture = PIXI.Texture.from(`./assets/${type}.png`);
                    this.recalculateScore(snapPoint, type);
                    snapPoint.location.type = type;
                }
            }
        });
    }

     static collectHandData(hand1, hand2)
    {
        const cardDataArray = {
            hand1: hand1.map(card => ({
            type: card.type,
            modifiers: card.modifiers,
            energyCost: card.energyCost,
            power: card.power
        })),
            hand2: hand2.map(card => ({
            type: card.type,
            modifiers: card.modifiers,
            energyCost: card.energyCost,
            power: card.power
        }))

    };
        
        // Convert the array to a JSON string
        const jsonString = JSON.stringify(cardDataArray, null, 2); // Pretty print with 2 spaces indentation
        
        // Output the JSON string (for example, to the console)
        console.log(jsonString);
    }

    
}