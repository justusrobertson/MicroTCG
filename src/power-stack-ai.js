import { AI } from "./ai.js";
import { Utility } from "./utility.js";

// PowerStackAI class extends the base AI class
export class PowerStackAI extends AI {
    constructor(snapPoints, x, y, scene, playerDeck) {
        // Initialize base AI properties
        super(snapPoints, x, y, scene, playerDeck);
        this.chosenSnapPoint = null;  // Lane the AI will focus on
        this.chosenType = null;       // Element type to prioritize (Fire or Water)
    }

    // AI decision-making for taking a turn
    takeTurn() {
        // If it's the first turn, initialize strategy
        if (!this.chosenSnapPoint) {
            this.initializeStrategy();
        }
        else if(this.chosenSnapPoint.snapPoints[3].card!=null)
        {
            this.newStrategy();
        }

        do {
            // Filter available cards and lanes
            super.takeTurn();
            if (this.filteredHand.length > 0 && this.filteredSnapPoints.length > 0) {
                const chosenCard = this.findHighestPowerCard(); // Decide which card to play
                if (chosenCard) {
                    if(Utility.checkEnergy(chosenCard, this.deck.energyText)) // Check if enough energy
                    this.playCard(chosenCard, this.chosenSnapPoint); // Play the chosen card
                }
            }
        } while (this.filteredHand.length > 0 && this.filteredSnapPoints.length > 0);

        // End the turn and pass it to the player
        Utility.passTurn(this.playerDeck, this.deck);
    }

    // Initialize AI's strategy for the game
    initializeStrategy() {
        // Choose a lane where the opponent hasn't played any card
        this.chosenSnapPoint = this.deck.snapPoints.find(snapPoint => 
            snapPoint.oppositeSnapPoint.snapPoints[0].card === null
        );

        // Count the number of Fire and Water cards in AI's hand
        const cardCounts = this.deck.hand.reduce((counts, card) => {
            counts[card.type] = (counts[card.type] || 0) + 1;
            return counts;
        }, {});

        // Choose the element type with the most cards
        this.chosenType = cardCounts['Fire'] >= (cardCounts['Water'] || 0) ? 'Fire' : 'Water';
    }

       // Initialize AI's strategy for the game
       newStrategy() {
        // Choose a lane where the opponent hasn't played any card
        this.chosenSnapPoint = this.deck.snapPoints.find(snapPoint => 
            snapPoint.snapPoints[0].card === null
        );

        // Count the number of Fire and Water cards in AI's hand
        const cardCounts = this.deck.hand.reduce((counts, card) => {
            counts[card.type] = (counts[card.type] || 0) + 1;
            return counts;
        }, {});

        // Choose the element type with the most cards
        this.chosenType = cardCounts['Fire'] >= (cardCounts['Water'] || 0) ? 'Fire' : 'Water';
    }
 
 



    // Find the card with the highest contribution in modifiers
    findHighestContributionCard() {
        return this.filteredHand.reduce((maxCard, card) => card.modifiers.length > (maxCard?.modifiers.length || -1) ? card : maxCard, null);
    }

    // Find the highest power card from the filtered hand
    findHighestPowerCard() {
    // Initialize a variable to keep track of the maximum card
    let maxCard = null;

    // Iterate over each card in the filtered hand
    for (let i = 0; i < this.filteredHand.length; i++) 
    {
        let card = this.filteredHand[i];
        // Check if maxCard is null (first iteration) or if the current card has higher power
        if (maxCard === null || ( card.power >= maxCard.power && card.type == this.chosenType)) {
            // Update maxCard to the current card if its power is greater
            maxCard = card;
        }
    }
    // Return the card with the maximum power
    if(maxCard.type!==this.chosenType)
    {
        this.newStrategy();
        for (let i = 0; i < this.filteredHand.length; i++) 
            {
                let card = this.filteredHand[i];
                // Check if maxCard is null (first iteration) or if the current card has higher power
                if (card.power > maxCard.power && card.type == this.chosenType) {
                    // Update maxCard to the current card if its power is greater
                    maxCard = card;
                }
            }
    }
    return maxCard;


    }
}
