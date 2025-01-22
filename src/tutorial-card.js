import { Utility } from './utility.js';

// A copy of the Card class that displays tutorial text since mouse events cannot be overriden in a child class
export class TutorialCard extends PIXI.Sprite
{
    static cardPlaced = false;

    constructor(textureURL, deck, energyCost, power, type, modifiers, interactive, x = 0, y = 0)
    {
        super(PIXI.Texture.from(textureURL));

        this.anchor.set(0.5, 0.5); // Set the anchor point to the center of the object
        this.scale.set(0.4);
        this.position.set(x, y);
        this.zIndex = 1;
        this.snapPoints = [];
        this.currentSnapPoint = null;
        this.location = null;
        this.isLocked = false;
        this.textureURL = textureURL;
        this.deck = deck;
        this.energyCost = energyCost;
        this.power = power;
        this.type = type;
        this.modifiers = modifiers;
        this.pickupPosition = {
            x: this.x,
            y: this.y,
        };

        this.interactive = interactive;
        this.on('mousedown', () => { 
            if(!Utility.gameOver && !this.isLocked)
            {
                this.scale.set(0.5);
                this.isMouseDown = true;
                this.zIndex = 2;
                this.pickupPosition.x = this.x;
                this.pickupPosition.y = this.y;

                if(this.location !== null)
                {
                    // Remove from placed cards list
                    Utility.placedCards.splice(Utility.placedCards.indexOf(this));

                    // Add card back to hand
                    this.deck.hand.push(this);

                    // Update score and energy texts
                    const scoreModifier = this.location.type === this.type ? this.power : 0;
                    this.deck.scoreText.text = `Score: ${parseInt(this.deck.scoreText.text.split(' ')[1]) - scoreModifier}`;
                    this.deck.energyText.text = `Energy: ${parseInt(this.deck.energyText.text.split(' ')[1]) + this.energyCost}`;
                    
                    // Unsnap the card and reorganize the area
                    const snapPointIndex = this.findSnapPointIndex();
                    const snapPoint = this.currentSnapPoint.snapPoints;
                    snapPoint[snapPointIndex].card = null;
                    for(let i = snapPointIndex; i < snapPoint.length - 1; i++){
                        if(snapPoint[i + 1].card === null) break;

                        snapPoint[i].card = snapPoint[i + 1].card;
                        snapPoint[i].card.position.set(snapPoint[i].x, snapPoint[i].y);
                        snapPoint[i + 1].card = null;
                    }

                    // Unset the location
                    this.location = null;
                }
            }
        });
        this.on('mouseup', () => {
            if(!Utility.gameOver){
                this.scale.set(0.4);
                this.isMouseDown = false;
                this.zIndex = 1;

                if(this.location === null)
                {
                    this.snapPoints.forEach(snapPoint => {
                        if(snapPoint === Utility.tutorialSnapPoint && this.x > snapPoint.x - 75 && this.x < snapPoint.x + 75 && this.y > snapPoint.y - 150 && this.y < snapPoint.y + 150)
                        {
                            for(const quarter of snapPoint.snapPoints)
                            {
                                if(quarter.card === null && Utility.checkEnergyAI(this, this.deck.energyText))
                                {
                                    quarter.card = this;
                                    this.location = snapPoint.location;
                                    this.currentSnapPoint = snapPoint;
                                    this.deck.hand.splice(this.deck.hand.indexOf(this), 1);
                                    this.pickupPosition.x = quarter.x;
                                    this.pickupPosition.y = quarter.y;
                                    Utility.placedCards.push(this);
                                    Utility.updateScore(this, snapPoint.location.type, this.deck.scoreText);

                                    if(!this.cardPlaced){
                                        Utility.tutorialText.text = Utility.tutorialTexts[Utility.tutorialIndex++];
                                        this.cardPlaced = true;
                                    }
                                    break;
                                }
                            }
                        }
                    });

                    this.position.set(this.pickupPosition.x, this.pickupPosition.y);
                    this.deck.organizeHand();
                }
            }
        });
        this.on('globalmousemove', (event) => {
            if(this.isMouseDown)
            {
                // Set the card position to the mouse position
                this.position.set(event.data.global.x, event.data.global.y);
            }
        });
    }

    findSnapPointIndex(){
        for(let i = 0; i < this.currentSnapPoint.snapPoints.length; i++){
            if(this.currentSnapPoint.snapPoints[i].card === this) return i;
        }
    }
}