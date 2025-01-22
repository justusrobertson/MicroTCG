import { Deck, } from './deck.js';
import { Location, } from './location.js';
import { SnapPoint, } from './snap-point.js';
import { Utility } from './utility.js';
import { TutorialAI } from './tutorial-ai.js';

// Initialize the app
const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
Utility.gameScene = new PIXI.Container();

// Set up center areas
const locations = [
    new Location('./assets/None.png', 'None', app.screen.width / 4, app.screen.height / 2),
    new Location('./assets/None.png', 'None', app.screen.width / 2, app.screen.height / 2),
    new Location('./assets/None.png', 'None', 3 * app.screen.width / 4, app.screen.height / 2),
];

// Set up playing areas
const snapPoints = [
    new SnapPoint('./assets/Snap-Point.png', true, locations[0], locations[0].position.x, locations[0].position.y),
    new SnapPoint('./assets/Snap-Point.png', true, locations[1], locations[1].position.x, locations[1].position.y),
    new SnapPoint('./assets/Snap-Point.png', true, locations[2], locations[2].position.x, locations[2].position.y),
    new SnapPoint('./assets/Snap-Point.png', false, locations[0], locations[0].position.x, locations[0].position.y),
    new SnapPoint('./assets/Snap-Point.png', false, locations[1], locations[1].position.x, locations[1].position.y),
    new SnapPoint('./assets/Snap-Point.png', false, locations[2], locations[2].position.x, locations[2].position.y),
];
for (let i = 0; i < snapPoints.length / 2; i++) {
    snapPoints[i].oppositeSnapPoint = snapPoints[i + snapPoints.length / 2];
    snapPoints[i + snapPoints.length / 2].oppositeSnapPoint = snapPoints[i];
}

// Initialize decks
const deck1 = new Deck(snapPoints.slice(0, 3), window.innerWidth - 160, window.innerHeight - 200, Utility.gameScene);
Utility.ai = new TutorialAI(snapPoints.slice(3, 6), 40, 50, Utility.gameScene, deck1);

// Set up pass and restart buttons
const passButton = new PIXI.Sprite(PIXI.Texture.from('./assets/Pass.png'));
passButton.position.set(window.innerWidth - 200, 50);
passButton.interactive = true;
passButton.on('click', () => {
    if (Utility.tutorialIndex % 2 == 0) {
        Utility.placedCards.forEach(card => card.placedCard = false);
        Utility.tutorialText.text = Utility.tutorialTexts[Utility.tutorialIndex++];
        Utility.passTurn(deck1, Utility.ai.deck);
    }
});

Utility.restartButton = new PIXI.Sprite(PIXI.Texture.from('./assets/Restart.png'));
Utility.restartButton.position.set(0, -200);
Utility.restartButton.interactive = true;
Utility.restartButton.on('click', () => {
    if (Utility.gameOver) restart();
});

// Position things on screen and add them to the scene
const init = () => {
    document.body.appendChild(app.view);
    app.view.style.position = 'absolute';
    app.view.style.left = (window.innerWidth - app.screen.width) / 2 + 'px';
    app.view.style.top = (window.innerHeight - app.screen.height) / 2 + 'px';

    app.stage.addChild(Utility.gameScene);

    Utility.gameScene.sortableChildren = true;

    deck1.deck = [];
    deck1.hand = [];
    Utility.ai.deck.deck = [];
    Utility.ai.deck.hand = [];

    Utility.gameScene.addChild(passButton);
    Utility.gameScene.addChild(Utility.restartButton);

    snapPoints.forEach(snapPoint => Utility.gameScene.addChild(snapPoint));

    locations.forEach(location => Utility.gameScene.addChild(location));

    deck1.scoreText = Utility.drawText('Score: 0', app.screen.width - 75, app.screen.height - 25, 'white', Utility.gameScene);
    deck1.energyText = Utility.drawText('Energy: 1', app.screen.width - 200, app.screen.height - 25, 'white', Utility.gameScene);
    Utility.ai.deck.scoreText = Utility.drawText('Score: 0', 75, 25, 'white', Utility.gameScene);
    Utility.ai.deck.energyText = Utility.drawText('Energy: 1', 200, 25, 'white', Utility.gameScene);

    initTutorial();
};

// Take the player to the next part of the game
const restart = () => {
    window.location.href = './color-tutorial.html';
};

// Add cards to the deck and start tutorial
const initTutorial = () => {
    // Starting hand
    deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], true);
    deck1.addCard('./assets/FC1P1.png', 2, 1, 'Fire', ['Fire'], true);
    deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], false);
    deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], false);
    deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], false);
    deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], false);

    // Cards to draw
    deck1.addCard('./assets/FC2P1.png', 3, 1, 'Fire', ['Fire', 'Fire'], true);

    deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], false);

    deck1.addCard('./assets/FC2P2.png', 4, 2, 'Fire', ['Fire', 'Fire'], true);

    deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], false);

    // The cards the AI will use
    Utility.ai.deck.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);
    Utility.ai.deck.addCard('./assets/WC1P1.png', 2, 1, 'Water', ['Water'], true);
    Utility.ai.deck.addCard('./assets/WC1P2.png', 3, 2, 'Water', ['Water'], true);
    Utility.ai.deck.addCard('./assets/WC3P1.png', 4, 1, 'Water', ['Water'], true);

    // Random cards to fill the deck
    Utility.ai.deck.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);
    Utility.ai.deck.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);
    Utility.ai.deck.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);
    Utility.ai.deck.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);
    Utility.ai.deck.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);
    Utility.ai.deck.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);

    // Draw starting hands
    deck1.drawTopCard(6);
    Utility.ai.deck.drawTopCard(6);

    // Hide the AI's hand
    Utility.ai.deck.hand.forEach(card => {
        card.texture = PIXI.Texture.from(Utility.ai.cardBack);
    });

    // Initialize tutorial
    Utility.tutorialText = Utility.drawText(Utility.tutorialTexts[Utility.tutorialIndex++], window.innerWidth / 2, window.innerHeight / 4, 'white', Utility.gameScene, 32);
    Utility.tutorialSnapPoint = snapPoints[1];
};

init();