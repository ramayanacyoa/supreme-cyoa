import { FALLBACK_CHARACTER_IMAGE, FALLBACK_SCENE_IMAGE, canShowChoice } from '../systems/gameSystems.js';

export class GameUI {
  constructor(stateRef, handlers) {
    this.stateRef = stateRef;
    this.handlers = handlers;
    this.nodes = {
      app: document.getElementById('app'),
      playerName: document.getElementById('playerName'),
      dharmaValue: document.getElementById('dharmaValue'),
      goldValue: document.getElementById('goldValue'),
      timeValue: document.getElementById('timeValue'),
      quests: document.getElementById('questList'),
      party: document.getElementById('partyList'),
      inventory: document.getElementById('inventoryList'),
      kingdom: document.getElementById('kingdomStatus'),
      sceneCard: document.getElementById('sceneCard'),
      title: document.getElementById('sceneTitle'),
      text: document.getElementById('sceneText'),
      bg: document.getElementById('bgImage'),
      character: document.getElementById('charImage'),
      choices: document.getElementById('choices'),
      timeline: document.getElementById('timelineList'),
      receipts: document.getElementById('receiptList')
    };
    this.typingRun = 0;
  }

  renderAll(scene, scenes) {
    this.renderTopBar();
    this.renderPanels();
    this.renderScene(scene, scenes);
    this.renderTimeline();
  }

  renderTopBar() {
    const state = this.stateRef.state;
    this.nodes.app.dataset.phase = state.world.phase.toLowerCase();
    this.nodes.playerName.textContent = state.player.name;
    this.nodes.dharmaValue.textContent = state.world.dharma;
    this.nodes.goldValue.textContent = state.inventory.gold || 0;
    this.nodes.timeValue.textContent = `Day ${state.world.day} • ${String(state.world.hour).padStart(2, '0')}:00 • ${state.world.phase}`;
  }

  renderPanels() {
    const state = this.stateRef.state;
    this.nodes.quests.innerHTML = listOrEmpty(state.quests.active, 'No active quests');
    this.nodes.party.innerHTML = listOrEmpty(state.party.map((id) => formatLabel(id)), 'Rama walks alone');
    this.nodes.inventory.innerHTML = listOrEmpty(Object.entries(state.inventory).map(([item, amount]) => `${formatLabel(item)} × ${amount}`), 'Inventory empty');
    this.nodes.kingdom.innerHTML = `
      <li>Tier ${state.kingdom.tier}</li>
      <li>Food ${state.kingdom.food}</li>
      <li>Stone ${state.kingdom.stone}</li>
      <li>Faith ${state.kingdom.faith}</li>
    `;
  }

  renderScene(scene, scenes) {
    const state = this.stateRef.state;
    this.nodes.sceneCard.classList.remove('scene-enter');
    requestAnimationFrame(() => this.nodes.sceneCard.classList.add('scene-enter'));
    this.nodes.title.textContent = scene.title;
    this.typeText(scene.text);
    this.setImage(this.nodes.bg, scene.image || scene.backgroundImage || FALLBACK_SCENE_IMAGE, FALLBACK_SCENE_IMAGE);
    this.setImage(this.nodes.character, scene.characterImage || FALLBACK_CHARACTER_IMAGE, FALLBACK_CHARACTER_IMAGE);
    this.nodes.choices.innerHTML = '';
    scene.choices.filter((choice) => canShowChoice(choice, state)).forEach((choice) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice-button';
      button.textContent = choice.label;
      button.addEventListener('click', () => this.handlers.onChoice(choice));
      this.nodes.choices.appendChild(button);
    });
    const restButton = document.createElement('button');
    restButton.type = 'button';
    restButton.className = 'choice-button choice-button-secondary';
    restButton.textContent = state.world.phase === 'Night' ? 'Rest: Enter Slumberland' : 'Make Camp Until Night';
    restButton.addEventListener('click', () => this.handlers.onRest());
    this.nodes.choices.appendChild(restButton);
    if (!this.nodes.choices.children.length) {
      const fallback = document.createElement('button');
      fallback.type = 'button';
      fallback.className = 'choice-button';
      fallback.textContent = 'Return to the known road';
      fallback.addEventListener('click', () => this.handlers.onNavigate(state.world.lastScene || 'ayodhya-1'));
      this.nodes.choices.appendChild(fallback);
    }
  }

  renderTimeline() {
    const state = this.stateRef.state;
    this.nodes.timeline.innerHTML = state.world.history.slice(-30).map((entry) => `<li>${entry.title}<span>${entry.phase} • Day ${entry.day}</span></li>`).join('') || '<li>No scenes visited yet.</li>';
    this.nodes.receipts.innerHTML = state.world.timelineReceipts.slice(-12).map((entry) => `<li>${entry}</li>`).join('') || '<li>No consequences recorded yet.</li>';
  }

  setImage(node, src, fallback) {
    if (node.dataset.currentSrc === src) return;
    node.classList.add('image-fading');
    const next = new Image();
    next.onload = () => {
      node.src = src;
      node.dataset.currentSrc = src;
      requestAnimationFrame(() => node.classList.remove('image-fading'));
    };
    next.onerror = () => {
      node.src = fallback;
      node.dataset.currentSrc = fallback;
      requestAnimationFrame(() => node.classList.remove('image-fading'));
    };
    next.src = src;
  }

  typeText(text) {
    this.typingRun += 1;
    const run = this.typingRun;
    const target = this.nodes.text;
    target.textContent = '';
    target.classList.add('typing');
    let i = 0;
    const tick = () => {
      if (run !== this.typingRun) return;
      if (i < text.length) {
        target.textContent += text[i++];
        window.requestAnimationFrame(tick);
      } else {
        target.classList.remove('typing');
      }
    };
    tick();
  }
}

function listOrEmpty(items, emptyText) {
  if (!items.length) return `<li>${emptyText}</li>`;
  return items.map((item) => `<li>${item}</li>`).join('');
}

function formatLabel(value) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
