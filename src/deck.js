import { Card, } from './card.js';
import { Utility, } from './utility.js';
import { TutorialCard } from './tutorial-card.js';

export class Deck extends PIXI.Sprite
{
    constructor(snapPoints, x, y, scene)
    {
        super(PIXI.Texture.from('./assets/Deck.png'));

        this.deck = [];
        this.scene = scene;
        this.snapPoints = snapPoints;
        this.scoreText = null;
        this.energyText = null;
        this.position.set(x, y);
        this.scale.set(0.4);
        this.scene !== null ?? this.scene.addChild(this);
        this.hand = [];

        this.interactive = true;
        
        // Debug controls to draw all cards out of the deck
        this.on('click', () => {
            if(Utility.debugMode && !Utility.gameOver) this.drawRandomCard(1);
        });
    }

    // Add a new card to the deck
    addCard(cardURL, energyCost, power, type, modifiers, interactive)
    {
        this.deck.push(!Utility.isTutorial ? new Card(cardURL, this, energyCost, power, type, modifiers, interactive) : new TutorialCard(cardURL, this, energyCost, power, type, modifiers, interactive));
        this.deck[this.deck.length - 1].snapPoints = this.snapPoints;
        this.deck[this.deck.length - 1].zIndex = 1;
    }

    // Draw a random card out of the deck
    drawRandomCard(numCards)
    {
        for(let i = 0; i < numCards; i++)
        {
            if(this.deck.length > 0){
                const newCard = this.deck.splice(Math.random() * this.deck.length, 1)[0];
                this.hand.push(newCard);
                this.scene.addChild(newCard);

                this.organizeHand();
            }
        }
    }

    // Draw the top card out of the deck
    drawTopCard(numCards){
        for(let i = 0; i < numCards; i++)
        {
            if(this.deck.length > 0){
                const newCard = this.deck.splice(0, 1)[0];
                this.hand.push(newCard);
                this.scene.addChild(newCard);

                this.organizeHand();
            }
        }
    }

    // Organize the hand on screen
    organizeHand()
    {
        let index = -Math.trunc(this.hand.length / 2);

        this.hand.forEach(card => {
            card.position.set(window.innerWidth / 2 + 75 * index++, this.scoreText.y);
            card.zIndex = 2;
        });
    }
}