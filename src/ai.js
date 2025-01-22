import { Deck, } from './deck.js';
import { Utility } from './utility.js';




// Parent class for all AI
// Should be derived from

export class AI {
  constructor(snapPoints, x, y, scene, playerDeck) {
    this.deck = new Deck(snapPoints, x, y, scene);
    this.playerDeck = playerDeck;
    this.filteredHand = [];
    this.filteredSnapPoints = [];
    this.cardBack = './assets/FaceDown.png';
  }

  // Filter out any invalid playing options
  takeTurn() {
    let currentEnergy = parseInt(this.deck.energyText.text.split(' ')[1]);

    // Filter out any cards with too high cost
    this.filteredHand = this.deck.hand.filter(card => card.energyCost <= currentEnergy);

    // Filter out any lanes that are full
    this.filteredSnapPoints = this.deck.snapPoints.filter(snapPoint => {
      for (const quarter of snapPoint.snapPoints) {
        if (quarter.card === null) return true;
      }

      return false;
    });
  }

  // Play a card to the board
  playCard(card, snapPoint) {
    for (const quarter of snapPoint.snapPoints) {
      if (quarter.card === null) {
        quarter.card = card;
        card.location = snapPoint.location;
        card.currentSnapPoint = snapPoint;
        card.deck.hand.splice(card.deck.hand.indexOf(card), 1);
        card.pickupPosition.x = quarter.x;
        card.pickupPosition.y = quarter.y;
        Utility.placedCards.push(card);
        Utility.updateScore(card, snapPoint.location.type, card.deck.scoreText);
        card.texture = PIXI.Texture.from(card.textureURL);
        break;
      }
    }

    // Organize the cards on screen
    card.zIndex = 3;
    card.position.set(card.pickupPosition.x, card.pickupPosition.y);
    this.deck.organizeHand();
  }

}