import { AI } from "./ai.js";
import { Utility } from "./utility.js";

export class RandomAI extends AI {
    constructor(snapPoints, x, y, scene, playerDeck) {
        super(snapPoints, x, y, scene, playerDeck);
    }

    // Play a random card in a random location from the available options
    takeTurn() {
        do {
            super.takeTurn();

            if (this.filteredHand.length > 0 && this.filteredSnapPoints.length > 0) {
                const card = this.filteredHand[Math.floor(Math.random() * this.filteredHand.length)];
                const snapPoint = this.filteredSnapPoints[Math.floor(Math.random() * this.filteredSnapPoints.length)];

                Utility.checkEnergy(card, this.deck.energyText);
                this.playCard(card, snapPoint);
            }
        }
        while (this.filteredHand.length > 0 && this.filteredSnapPoints.length > 0);

        Utility.passTurn(this.playerDeck, this.deck);
    }
}