export class SnapPoint extends PIXI.Sprite
{
    constructor(textureURL, isBelow, location, x = 0, y = 0)
    {
        super(PIXI.Texture.from(textureURL));

        this.anchor.set(0.5, 0.5); // Set the anchor point to the center of the object
        isBelow ? this.position.set(x, y + 200) : this.position.set(x, y - 200);
        this.alpha = 0.25;
        this.location = location;
        this.oppositeSnapPoint = null;

        // The contribution of each element to this location
        this.numElements = {
            Fire: 0,
            Water: 0,
        };

        // The card that is in each quarter of the location
        this.snapPoints = [
            {
                x: this.x - 40,
                y: this.y - 60,
                card: null,
            },
            {
                x: this.x + 40,
                y: this.y - 60,
                card: null,
            },
            {
                x: this.x - 40,
                y: this.y + 60,
                card: null,
            },
            {
                x: this.x + 40,
                y: this.y + 60,
                card: null,
            },
        ];
    }
}