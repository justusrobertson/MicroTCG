import { AI } from "./ai.js";
import { Utility } from "./utility.js";

export class TutorialAI extends AI {
    constructor(snapPoints, x, y, scene, playerDeck) {
        super(snapPoints, x, y, scene, playerDeck);
    }

    // Play specific moves each turn
    takeTurn() {
            super.takeTurn();
            const card = this.filteredHand[0];
            let snapPoint;

            switch(Utility.turn){
                case 2:
                    snapPoint = this.filteredSnapPoints[0];
                    break;
                case 3:
                    snapPoint = this.filteredSnapPoints[0];
                    Utility.tutorialSnapPoint = this.filteredSnapPoints[0].oppositeSnapPoint;
                    break;
                case 4:
                    snapPoint = this.filteredSnapPoints[2];
                    Utility.tutorialSnapPoint = this.filteredSnapPoints[2].oppositeSnapPoint;
                    break;
                default:
                    snapPoint = this.filteredSnapPoints[0];
                    break;
            }

                Utility.checkEnergy(card, this.deck.energyText);
                this.playCard(card, snapPoint);

        Utility.passTurn(this.playerDeck, this.deck);
    }
}