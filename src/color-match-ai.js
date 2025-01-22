import { AI } from "./ai.js";
import { Utility } from "./utility.js";

export class ColorMatchAI extends AI {
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
                let chosenCard = null; // The card the AI will play
                let chosenSnapPoint = null; // The snap point (lane) where the card will be played

                // Attempt to fill out all lanes by iterating over available snap points
                for (let snapPoint of this.filteredSnapPoints) {
                    // Get the current element type of the lane (Fire, Water, or None)
                    const type = snapPoint.location.type;

                    // If the lane has a defined element type (Fire or Water)
                    if (type !== "None" && type != null) {
                        // Filter the AI's hand for cards that match the lane's type
                        const matchingCards = this.filteredHand.filter(card => card.type === type);

                        // If matching cards are available
                        if (matchingCards.length > 0) {
                            // Select the card with the highest power and lowest modifiers
                            let highestPower = -1;
                            matchingCards.forEach(card => {
                                if (card.power > highestPower) {
                                    highestPower = card.power;
                                    chosenCard = card;
                                    chosenSnapPoint = snapPoint;
                                }
                            });
                        }
                    }

                    // If the lane has no defined element type (neutral lane)
                    if (type === "None" || type == null) {
                        // Try to spread cards evenly by choosing lanes that have no card yet
                        if (chosenSnapPoint === null) {
                            const neutralCards = this.filteredHand;
                            let maxPower = -1;

                            // Choose the card with the highest power for the neutral lane
                            neutralCards.forEach(card => {
                                if (card.power > maxPower) {
                                    maxPower = card.power;
                                    chosenCard = card;
                                    chosenSnapPoint = snapPoint;
                                }
                            });
                        }
                    }
                }

                // Play the chosen card if valid cards and snap points were found
                if (chosenCard && chosenSnapPoint) {
                    if(Utility.checkEnergy(chosenCard, this.deck.energyText)) 
                    this.playCard(chosenCard, chosenSnapPoint);
                }
            }
        }
        // Keep repeating as long as there are valid cards and lanes
        while (this.filteredHand.length > 0 && this.filteredSnapPoints.length > 0);

        // End the AI's turn and pass it to the player
        Utility.passTurn(this.playerDeck, this.deck);
    }
}
