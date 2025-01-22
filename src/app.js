import { Deck, } from './deck.js';
import { Location, } from './location.js';
import { SnapPoint, } from './snap-point.js';
import { Utility } from './utility.js';
import { PowerStackAI } from './power-stack-ai.js';
import { ContributionStackAI } from './contribution-stack-ai.js';
import { ColorMatchAI } from './color-match-ai.js';

// Initialize the app
const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
Utility.gameScene = new PIXI.Container();

// Set up center areas
const locations = [
  new Location('./assets/None.png', 'None', app.screen.width / 4, app.screen.height / 2),
  new Location('./assets/None.png', 'None', app.screen.width / 2, app.screen.height / 2),
  new Location('./assets/None.png', 'None', 3 * app.screen.width / 4, app.screen.height / 2),
];

// Set up card placement areas
const snapPoints = [
  new SnapPoint('./assets/Snap-Point.png', true, locations[0], locations[0].position.x, locations[0].position.y),
  new SnapPoint('./assets/Snap-Point.png', true, locations[1], locations[1].position.x, locations[1].position.y),
  new SnapPoint('./assets/Snap-Point.png', true, locations[2], locations[2].position.x, locations[2].position.y),
  new SnapPoint('./assets/Snap-Point.png', false, locations[0], locations[0].position.x, locations[0].position.y),
  new SnapPoint('./assets/Snap-Point.png', false, locations[1], locations[1].position.x, locations[1].position.y),
  new SnapPoint('./assets/Snap-Point.png', false, locations[2], locations[2].position.x, locations[2].position.y),
];
for(let i = 0; i < snapPoints.length / 2; i++){
  snapPoints[i].oppositeSnapPoint = snapPoints[i + snapPoints.length / 2];
  snapPoints[i + snapPoints.length / 2].oppositeSnapPoint = snapPoints[i];
}

// Initialize decks
const deck1 = new Deck(snapPoints.slice(0, 3), window.innerWidth - 160, window.innerHeight - 200, Utility.gameScene);
//Utility.ai = new PowerStackAI(snapPoints.slice(3, 6), 40, 50, Utility.gameScene, deck1);
Utility.ai = new ContributionStackAI(snapPoints.slice(3, 6), 40, 50, Utility.gameScene, deck1);
//Utility.ai = new ColorMatchAI(snapPoints.slice(3, 6), 40, 50, Utility.gameScene, deck1);

// Set up pass button and restart button
const passButton = new PIXI.Sprite(PIXI.Texture.from('./assets/Pass.png'));
passButton.position.set(window.innerWidth - 200, 50);
passButton.interactive = true;
passButton.on('click', () => {
  Utility.passTurn(deck1, Utility.ai.deck);
});

Utility.restartButton = new PIXI.Sprite(PIXI.Texture.from('./assets/Restart.png'));
Utility.restartButton.position.set(0, -200);
Utility.restartButton.interactive = true;
Utility.restartButton.on('click', () => {
  restart();
});

// Position objects on screen and add them to the scene
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
  
  initGame();
};

// Restart the game
const restart = () => {
  location.reload();
};

// Build the decks for each player
const initGame = () => {
  Utility.isTutorial = false;
  
  // Player cards

  deck1.addCard('./assets/WC0P1.png', 1, 1, 'Water', [], true);
  deck1.addCard('./assets/WC0P1.png', 1, 1, 'Water', [], true);
  deck1.addCard('./assets/FC0P1.png', 1, 1, 'Fire', [], true);
  deck1.addCard('./assets/FC0P1.png', 1, 1, 'Fire', [], true);
  deck1.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);
  deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], true);
  deck1.addCard('./assets/WC1P0.png', 1, 0, 'Water', ['Water'], true);
  deck1.addCard('./assets/FC1P0.png', 1, 0, 'Fire', ['Fire'], true);
  // 2 costs
  deck1.addCard('./assets/FC2P0.png', 2, 0, 'Fire', ['Fire', 'Fire'], true);
  deck1.addCard('./assets/WC2P0.png', 2, 0, 'Water', ['Water', 'Water'], true);
  deck1.addCard('./assets/WC1P1.png', 2, 1, 'Water', ['Water'], true);
  deck1.addCard('./assets/FC1P1.png', 2, 1, 'Fire', ['Fire'], true);
  deck1.addCard('./assets/WC0P2.png', 2, 2, 'Water', [], true);
  deck1.addCard('./assets/FC0P2.png', 2, 2, 'Fire', [], true);
  deck1.addCard('./assets/FC2P0.png', 2, 0, 'Fire', ['Fire', 'Fire'], true);
  deck1.addCard('./assets/WC2P0.png', 2, 0, 'Water', ['Water', 'Water'], true);
  deck1.addCard('./assets/WC1P1.png', 2, 1, 'Water', ['Water'], true);
  deck1.addCard('./assets/FC1P1.png', 2, 1, 'Fire', ['Fire'], true);
  deck1.addCard('./assets/WC0P2.png', 2, 2, 'Water', [], true);
  deck1.addCard('./assets/FC0P2.png', 2, 2, 'Fire', [], true);
  // 3 Cost
  deck1.addCard('./assets/FC3P0.png', 3, 0, 'Fire', ['Fire', 'Fire', 'Fire'], true);
  deck1.addCard('./assets/WC3P0.png', 3, 0, 'Water', ['Water', 'Water', 'Water'], true);
  deck1.addCard('./assets/WC0P3.png', 3, 3, 'Water', [], true);
  deck1.addCard('./assets/FC0P3.png', 3, 3, 'Fire', [], true);
  deck1.addCard('./assets/WC2P1.png', 3, 1, 'Water', ['Water', 'Water'], true);
  deck1.addCard('./assets/FC2P1.png', 3, 1, 'Fire', ['Fire', 'Fire'], true);
  deck1.addCard('./assets/WC1P2.png', 1, 2, 'Water', ['Water'], true);
  deck1.addCard('./assets/FC1P2.png', 1, 2, 'Fire', ['Fire'], true);
  deck1.addCard('./assets/WC2P1.png', 3, 1, 'Water', ['Water', 'Water'], true);
  deck1.addCard('./assets/FC2P1.png', 3, 1, 'Fire', ['Fire', 'Fire'], true);
  deck1.addCard('./assets/WC1P2.png', 1, 2, 'Water', ['Water'], true);
  deck1.addCard('./assets/FC1P2.png', 1, 2, 'Fire', ['Fire'], true);

  // 4 Cost
  deck1.addCard('./assets/FC4P0.png', 4, 0, 'Fire', ['Fire', 'Fire', 'Fire', 'Fire'], true);
  deck1.addCard('./assets/WC4P0.png', 4, 0, 'Water', ['Water', 'Water', 'Water', 'Water'], true);
  
  deck1.addCard('./assets/FC3P1.png', 4, 1, 'Fire', ['Fire', 'Fire', 'Fire'], true);
  deck1.addCard('./assets/WC3P1.png', 4, 1, 'Water', ['Water', 'Water', 'Water'], true);
 
  deck1.addCard('./assets/WC2P2.png', 4, 2, 'Water', ['Water', 'Water'], true);
  deck1.addCard('./assets/FC2P2.png', 4, 2, 'Fire', ['Fire', 'Fire'], true);
  deck1.addCard('./assets/WC1P3.png', 4, 3, 'Water', ['Water'], true);
  deck1.addCard('./assets/FC1P3.png', 4, 3, 'Fire', ['Fire'], true);
  deck1.addCard('./assets/WC0P4.png', 4, 4, 'Water', [], true);
  deck1.addCard('./assets/FC0P4.png', 4, 4, 'Fire', [], true);

  // The cards the AI will use

  // POWER STACK AI DECK 
     /*
  //1 costs
  Utility.ai.deck.addCard('./assets/WC0P1.png', 1, 1, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/WC0P1.png', 1, 1, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P1.png', 1, 1, 'Fire', [], true);
  Utility.ai.deck.addCard('./assets/FC0P1.png', 1, 1, 'Fire', [], true);
  // 2 costs
  Utility.ai.deck.addCard('./assets/FC2P0.png', 2, 0, 'Fire', ['Fire', 'Fire'], true);
  Utility.ai.deck.addCard('./assets/WC2P0.png', 2, 0, 'Water', ['Water', 'Water'], true);
  Utility.ai.deck.addCard('./assets/WC1P1.png', 2, 1, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P1.png', 2, 1, 'Fire', ['Fire'], true);
  Utility.ai.deck.addCard('./assets/WC0P2.png', 2, 2, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P2.png', 2, 2, 'Fire', [], true);
  // 3 Cost

  Utility.ai.deck.addCard('./assets/WC0P3.png', 3, 3, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P3.png', 3, 3, 'Fire', [], true);
  Utility.ai.deck.addCard('./assets/WC1P2.png', 1, 2, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P2.png', 1, 2, 'Fire', ['Fire'], true);

  // 4 Cost
  Utility.ai.deck.addCard('./assets/WC2P2.png', 4, 2, 'Water', ['Water', 'Water'], true);
  Utility.ai.deck.addCard('./assets/FC2P2.png', 4, 2, 'Fire', ['Fire', 'Fire'], true);
  Utility.ai.deck.addCard('./assets/WC1P3.png', 4, 3, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P3.png', 4, 3, 'Fire', ['Fire'], true);
  Utility.ai.deck.addCard('./assets/WC0P4.png', 4, 4, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P4.png', 4, 4, 'Fire', [], true);
 */
 // Color Match
    /*
  //1 costs
  Utility.ai.deck.addCard('./assets/WC0P1.png', 1, 1, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/WC0P1.png', 1, 1, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P1.png', 1, 1, 'Fire', [], true);
  Utility.ai.deck.addCard('./assets/FC0P1.png', 1, 1, 'Fire', [], true);
  // 2 costs

  Utility.ai.deck.addCard('./assets/WC1P1.png', 2, 1, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P1.png', 2, 1, 'Fire', ['Fire'], true);
  Utility.ai.deck.addCard('./assets/WC0P2.png', 2, 2, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P2.png', 2, 2, 'Fire', [], true);
  // 3 Cost

  Utility.ai.deck.addCard('./assets/WC0P3.png', 3, 3, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P3.png', 3, 3, 'Fire', [], true);
  Utility.ai.deck.addCard('./assets/WC1P2.png', 1, 2, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P2.png', 1, 2, 'Fire', ['Fire'], true);

  // 4 Cost
  Utility.ai.deck.addCard('./assets/WC1P3.png', 4, 3, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P3.png', 4, 3, 'Fire', ['Fire'], true);
  Utility.ai.deck.addCard('./assets/WC0P4.png', 4, 4, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P4.png', 4, 4, 'Fire', [], true);
 */
  // CONTRIBUTION STACK AI DECK
  //1 costs
  Utility.ai.deck.addCard('./assets/WC0P1.png', 1, 1, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/WC0P1.png', 1, 1, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P1.png', 1, 1, 'Fire', [], true);
  Utility.ai.deck.addCard('./assets/FC0P1.png', 1, 1, 'Fire', [], true);
  // 2 costs
  Utility.ai.deck.addCard('./assets/WC1P1.png', 2, 1, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P1.png', 2, 1, 'Fire', ['Fire'], true);
  Utility.ai.deck.addCard('./assets/WC0P2.png', 2, 2, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P2.png', 2, 2, 'Fire', [], true);
  // 3 Cost
  Utility.ai.deck.addCard('./assets/WC0P3.png', 3, 3, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P3.png', 3, 3, 'Fire', [], true);
  Utility.ai.deck.addCard('./assets/WC2P1.png', 3, 1, 'Water', ['Water', 'Water'], true);
  Utility.ai.deck.addCard('./assets/FC2P1.png', 3, 1, 'Fire', ['Fire', 'Fire'], true);
  Utility.ai.deck.addCard('./assets/WC1P2.png', 1, 2, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P2.png', 1, 2, 'Fire', ['Fire'], true);

  // 4 Cost
  Utility.ai.deck.addCard('./assets/FC3P1.png', 4, 1, 'Fire', ['Fire', 'Fire', 'Fire'], true);
  Utility.ai.deck.addCard('./assets/WC3P1.png', 4, 1, 'Water', ['Water', 'Water', 'Water'], true);
  Utility.ai.deck.addCard('./assets/WC2P2.png', 4, 2, 'Water', ['Water', 'Water'], true);
  Utility.ai.deck.addCard('./assets/FC2P2.png', 4, 2, 'Fire', ['Fire', 'Fire'], true);
  Utility.ai.deck.addCard('./assets/WC1P3.png', 4, 3, 'Water', ['Water'], true);
  Utility.ai.deck.addCard('./assets/FC1P3.png', 4, 3, 'Fire', ['Fire'], true);
  Utility.ai.deck.addCard('./assets/WC0P4.png', 4, 4, 'Water', [], true);
  Utility.ai.deck.addCard('./assets/FC0P4.png', 4, 4, 'Fire', [], true);

  // Draw starting hand
  deck1.drawRandomCard(6);
  Utility.ai.deck.drawRandomCard(6);

  // Hide AI's cards
  Utility.ai.deck.hand.forEach(card => {
    card.texture = PIXI.Texture.from(Utility.ai.cardBack);
  });
}

init();