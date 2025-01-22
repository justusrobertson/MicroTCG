export class Location extends PIXI.Sprite
{
    constructor(textureURL, type, x = 0, y = 0)
    {
        super(PIXI.Texture.from(textureURL));

        this.anchor.set(0.5, 0.5); // Set the anchor point to the center of the object
        this.position.set(x, y);
        this.scale.set(1.5);
        this.type = type;
    }
}