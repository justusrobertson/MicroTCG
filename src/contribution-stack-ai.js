import { AI } from "./ai.js";
import { Utility } from "./utility.js";

export class ContributionStackAI extends AI {
    constructor(snapPoints, x, y, scene, playerDeck) {
        // Call the parent AI constructor to initialize deck, playerDeck, etc.
        super(snapPoints, x, y, scene, playerDeck);
    }

    // The AI's logic for taking a turn
    takeTurn() {
        do {
            // Call the parent class's takeTurn to filter valid cards and lanes
            super.takeTurn();

            // Check if there are valid cards and lanes available
            if (this.filteredHand.length > 0 && this.filteredSnapPoints.length > 0) {
                let topSnapPoint = null; // The snap point (lane) with the best score
                let topScore = -1;        // The highest score found so far
                let topType = '';         // The element type (Fire/Water) the AI will focus on

                let chosenCard = null;    // The card the AI will play

                // Loop through the available lanes (snap points) to evaluate them
                for (let snapPoint of this.filteredSnapPoints) {
                    // Get the current element type of the lane (Fire, Water, or None)
                    const type = snapPoint.location.type;

                    // If the lane has a defined element type (not neutral or empty)
                    if (type !== "None" && type !=null)
                    {
                        // Check if any of the opponent's cards in the opposite snap points match the lane's type
                        if (snapPoint.oppositeSnapPoint.snapPoints.some(quarter => quarter.card && quarter.card.type === type)) 
                        
                        {
                            // Calculate the score for this lane by summing the power of cards matching the lane's type
                            let score = 0;
                            for (let quarter of snapPoint.oppositeSnapPoint.snapPoints) 
                            {
                                // Stop if there is no card in the opposite snap point
                                if (quarter.card === null) break;

                                // Add the card's power if its type matches the lane's type
                                if (quarter.card.type === type) score += quarter.card.power;
                            }

                            // Update the top snap point and type if this lane's score is higher than the previous top score
                            if (score > topScore) 
                            {
                                topScore = score;
                                topSnapPoint = snapPoint;

                                // Determine the element type the AI should counter with
                                if (snapPoint.snapPoints[0].card !== null && snapPoint.snapPoints[0].card.power > 0 && snapPoint.snapPoints[0].card.type == type) 
                                {
                                    topType = type === 'Fire' ? 'Water' : 'Fire'; // Choose the opposite element if there's a card with power
                                } 
                                else 
                                {
                                    topType = type; // Otherwise, stick with the lane's current type
                                }
                            }
                            
                        }
                    }
                    // If the lane is neutral (no defined element type)
                    else if (topSnapPoint === null || topScore === 0) 
                    {
                        let score = {
                            Fire: 0,
                            Water: 0,
                        };

                        // Calculate scores for Fire and Water by checking the opponent's cards
                        for (let quarter of snapPoint.oppositeSnapPoint.snapPoints) 
                            {
                            if (quarter.card === null) break;

                            // Add power values based on card type (Fire or Water)
                            if (quarter.card.type === 'Fire') score.Fire += quarter.card.power;
                            else score.Water += quarter.card.power;
                            }

                        // Find the maximum score between Fire and Water and update the lane and type accordingly
                        const maxType = Math.max(score.Fire, score.Water);
                        if (maxType > topScore) 
                            {
                            topScore = maxType;
                            topSnapPoint = snapPoint;
                            topType = maxType === score.Fire ? 'Fire' : 'Water'; // Set the element type with the highest score
                            }
                    }
                }

                // Filter AI's hand to only include cards that don't match the top type (for counter-play)
                const typeFilteredHand = this.filteredHand.filter(card => card.type !== topType);

                // If the lane's score is 0 (neutral)
                if (topScore === 0) {
                    // Check if the lane already has any scored cards (cards with power > 0)
                    const isLaneScored = topSnapPoint.snapPoints.some(quarter => {
                        if (quarter.card !== null) return quarter.card.power > 0;
                        else return false;
                    });

                    let maxCon = -1;  // Maximum number of modifiers on a card
                    let minPow = 5;   // Minimum power value of a card

                    // If there are cards in typeFilteredHand, choose based on lane scoring status
                    typeFilteredHand.length > 0 ?
                    typeFilteredHand.forEach(card => {
                        if (isLaneScored) {
                            // If the lane is scored, pick the card with the most modifiers
                            if (card.modifiers.length > maxCon) {
                                chosenCard = card;
                                maxCon = card.modifiers.length;
                            }
                        } else if (card.power < minPow) {
                            // If the lane is not scored, pick the card with the lowest power
                            chosenCard = card;
                            minPow = card.power;
                        }
                    })
                    :
                    // If no typeFilteredHand cards are available, fall back to filteredHand and repeat the logic
                    this.filteredHand.forEach(card => {
                        if (isLaneScored) {
                            if (card.modifiers.length > maxCon) {
                                chosenCard = card;
                                maxCon = card.modifiers.length;
                            }
                        } else if (card.power < minPow) {
                            chosenCard = card;
                            minPow = card.power;
                        }
                    });
                }
                // If the lane has a non-zero score (contested)
                else {
                    let maxCon = -1;  // Maximum number of modifiers
                    let maxPow = -1;  // Maximum power

                    // If there are cards in typeFilteredHand, choose the one with the most modifiers
                    typeFilteredHand.length > 0 ?
                    typeFilteredHand.forEach(card => {
                        if (card.modifiers.length > maxCon) {
                            chosenCard = card;
                            maxCon = card.modifiers.length;
                        }
                    })
                    :
                    // Otherwise, choose the card with the highest power from the full hand
                    this.filteredHand.forEach(card => {
                        if (card.power > maxPow) {
                            chosenCard = card;
                            maxPow = card.power;
                        }
                    });
                }

                // Play the chosen card by checking if there's enough energy and placing it on the top lane
               if( Utility.checkEnergy(chosenCard, this.deck.energyText))
                this.playCard(chosenCard, topSnapPoint);
            }
        }
        // Keep repeating as long as there are valid cards and lanes
        while (this.filteredHand.length > 0 && this.filteredSnapPoints.length > 0);

        // End the AI's turn and pass it to the player
        Utility.passTurn(this.playerDeck, this.deck);
    }
}
