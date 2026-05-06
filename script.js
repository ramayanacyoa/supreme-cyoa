console.log("Update 1.0.13");

import { EXPANDED_SCENES, RAMAYANA_ARCS } from './engine_extensions/expandedScenes.js';
import { GameUI } from './ui/gameUI.js';
import {
  InventorySystem,
  KingdomSystem,
  PartySystem,
  QuestSystem,
  SaveLoadSystem,
  TimeSystem,
  canShowChoice,
  clamp,
  createDefaultState,
  normaliseState
} from './systems/gameSystems.js';

class StateManager {
  constructor() {
    this.state = createDefaultState();
  }
}

class SystemRegistry {
  constructor(stateRef) {
    this.stateRef = stateRef;
    this.rebind();
  }
  rebind() {
    const state = this.stateRef.state;
    this.inventory = new InventorySystem(state);
    this.quests = new QuestSystem(state);
    this.party = new PartySystem(state);
    this.time = new TimeSystem(state);
    this.kingdom = new KingdomSystem(state);
    this.saveLoad = new SaveLoadSystem(this.stateRef);
  }
}

class SceneManager {
  constructor(stateRef, systems) {
    this.stateRef = stateRef;
    this.systems = systems;
    this.scenes = this.buildScenes();
  }

  buildScenes() {
    const scenes = {};
    const sideEntrances = {
      ayodhya: 'ayodhya-council-1', exile: 'exile-side-1', forest: 'forest-side-1', kishkindha: 'kishkindha-side-1', lanka: 'lanka-side-1', return: 'return-side-1'
    };

    RAMAYANA_ARCS.forEach((arc, arcIndex) => {
      for (let i = 1; i <= 40; i += 1) {
        const id = `${arc}-${i}`;
        const nextArc = RAMAYANA_ARCS[Math.min(arcIndex + 1, RAMAYANA_ARCS.length - 1)];
        const next = i < 40 ? `${arc}-${i + 1}` : `${nextArc}-1`;
        scenes[id] = this.createCoreScene({ id, arc, index: i, next, side: sideEntrances[arc] });
      }
    });

    this.createEncounters().forEach((scene) => { scenes[scene.id] = scene; });
    EXPANDED_SCENES.forEach((scene) => { scenes[scene.id] = this.normaliseScene(scene); });
    scenes['dream-1'] = this.normaliseScene({
      id: 'dream-1',
      arc: 'slumberland',
      title: 'Slumberland Dream Gate',
      text: 'You enter a dream realm. Hidden truths alter lineage memory, but the world continues beyond sleep.',
      image: 'https://picsum.photos/seed/rkod-dream-gate/1200/700',
      characterImage: 'https://picsum.photos/seed/rkod-moon-sage/360/620',
      onEnter: () => {
        const lineage = this.stateRef.state.player.lineage;
        if (!lineage.includes('Dream Omen')) lineage.push('Dream Omen');
        this.systems.quests.start('Interpret the dream omen');
      },
      choices: [{ label: 'Awaken at the last camp', to: () => this.stateRef.state.world.lastScene || 'forest-1', time: 4 }]
    });
    return scenes;
  }

  createCoreScene({ id, arc, index, next, side }) {
    const isNightGate = index % 7 === 0;
    return this.normaliseScene({
      id,
      arc,
      title: `${arc.toUpperCase()} • Chapter ${index}`,
      text: `Day ${this.stateRef.state.world.day}: You face trials in ${arc}. Dharma, allies, inventory, and time now shape which paths remain open.`,
      image: `https://picsum.photos/seed/rkod-${arc}-${index}/1200/700`,
      characterImage: `https://picsum.photos/seed/rkod-hero-${arc}-${index}/360/620`,
      onEnter: () => this.applySceneMilestones(arc, index),
      choices: [
        { label: 'Follow dharma', to: next, dharma: 2, time: 2 },
        { label: 'Take tactical risk', to: next, stat: ['intelligence', 1], time: 2 },
        { label: 'Explore a regional side path', to: side, xp: 8, time: 3 },
        { label: 'Answer the night omen', to: 'dream-1', requiresPhase: 'Night', flag: ['nightOmenAnswered', true], time: 1 },
        { label: 'Use herbs to aid travelers', to: next, requiresItem: 'herbs', cost: ['herbs', 1], dharma: 3, kingdom: { faith: 2 }, time: isNightGate ? 3 : 2 }
      ]
    });
  }

  createEncounters() {
    return ['sage', 'demon', 'merchant'].map((kind) => this.normaliseScene({
      id: `encounter-${kind}`,
      arc: 'encounter',
      title: `${kind[0].toUpperCase() + kind.slice(1)} Encounter`,
      text: 'A dynamic event reacts to your party, time, dharma, and resources before returning you to the wider road.',
      image: `https://picsum.photos/seed/rkod-encounter-${kind}/1200/700`,
      characterImage: `https://picsum.photos/seed/rkod-encounter-${kind}-portrait/360/620`,
      onEnter: () => { this.systems.inventory.add(kind === 'merchant' ? 'arrows' : 'herbs', 1); },
      choices: [{ label: 'Return to the journey', to: () => this.stateRef.state.world.lastScene || 'ayodhya-1', time: 1 }]
    }));
  }

  normaliseScene(scene) {
    return {
      image: scene.image || scene.backgroundImage,
      characterImage: scene.characterImage,
      choices: [],
      ...scene,
      choices: (scene.choices || []).map((choice) => ({ time: 1, ...choice }))
    };
  }

  applySceneMilestones(arc, index) {
    const { party, quests } = this.systems;
    if (arc === 'ayodhya' && index === 1) quests.start('Prepare for exile with dignity');
    if (arc === 'exile' && index === 1) quests.complete('Prepare for exile with dignity');
    if (arc === 'forest' && index === 5) quests.start('Protect the hermitages');
    if (arc === 'kishkindha' && index === 2) party.add('hanuman', { lvl: 1, role: 'Devoted envoy' });
    if (arc === 'kishkindha' && index === 10) party.add('sugriva', { lvl: 1, role: 'Vanara king' });
    if (arc === 'lanka' && index === 15) party.add('vibhishana', { lvl: 1, role: 'Lanka defector' });
    if (arc === 'return' && index === 1) quests.complete('Protect the hermitages');
  }

  getScene(id) { return this.scenes[id]; }
}

class GameEngine {
  constructor() {
    this.stateManager = new StateManager();
    this.systems = new SystemRegistry(this.stateManager);
    this.sceneManager = new SceneManager(this.stateManager, this.systems);
    this.ui = new GameUI(this.stateManager, {
      onChoice: (choice) => this.choose(choice),
      onRest: () => this.rest(),
      onNavigate: (sceneId) => this.renderScene(sceneId)
    });
    this.bindGlobalActions();
    this.boot();
  }

  boot() {
    this.systems.saveLoad.load();
    this.stateManager.state = normaliseState(this.stateManager.state);
    this.systems.rebind();
    const routedScene = new URLSearchParams(window.location.search).get('scene') || window.location.hash.replace('#scene-', '');
    const startingScene = this.sceneManager.getScene(routedScene) ? routedScene : this.stateManager.state.world.currentScene;
    this.renderScene(startingScene, { replace: true, runEffects: false, recordHistory: false });
    this.systems.time.start(() => {
      this.systems.kingdom.generate('real-time');
      this.persistAndRefresh();
    });
  }

  bindGlobalActions() {
    document.getElementById('saveBtn').addEventListener('click', () => this.systems.saveLoad.save());
    document.getElementById('loadBtn').addEventListener('click', () => {
      if (this.systems.saveLoad.load()) {
        this.systems.rebind();
        this.renderScene(this.stateManager.state.world.currentScene, { replace: true, runEffects: false, recordHistory: false });
      }
    });
    document.getElementById('timelineBtn').addEventListener('click', () => document.getElementById('timelinePanel').classList.toggle('hidden'));
    document.getElementById('resetBtn').addEventListener('click', () => {
      localStorage.removeItem('rkod_save_v2');
      localStorage.removeItem('rkod_save');
      this.stateManager.state = createDefaultState();
      this.systems.rebind();
      this.renderScene('ayodhya-1', { replace: true, runEffects: false });
    });
    window.addEventListener('popstate', (event) => {
      const sceneId = event.state?.sceneId;
      if (sceneId) this.renderScene(sceneId, { replace: true, runEffects: false, recordHistory: false });
    });
  }

  choose(choice) {
    if (!canShowChoice(choice, this.stateManager.state)) return;
    this.applyChoice(choice);
    const destination = typeof choice.to === 'function' ? choice.to() : choice.to;
    if (Math.random() < this.stateManager.state.settings.dreamChance && this.stateManager.state.world.phase === 'Night') {
      this.renderScene('dream-1');
      return;
    }
    this.renderScene(destination || this.stateManager.state.world.currentScene);
  }

  rest() {
    const state = this.stateManager.state;
    const hours = state.world.phase === 'Night' ? 1 : (18 - state.world.hour + 24) % 24 || 10;
    this.systems.time.advance(hours, 'rest');
    if (state.world.phase === 'Night') this.renderScene('slumberland-rest');
    else this.persistAndRefresh();
  }

  applyChoice(choice) {
    const state = this.stateManager.state;
    if (choice.cost) this.systems.inventory.remove(choice.cost[0], choice.cost[1]);
    if (choice.dharma) state.world.dharma = clamp(state.world.dharma + choice.dharma, 0, 100);
    if (choice.xp) state.player.xp += choice.xp;
    if (choice.stat) state.player.stats[choice.stat[0]] = (state.player.stats[choice.stat[0]] || 0) + choice.stat[1];
    if (choice.kingdom) Object.entries(choice.kingdom).forEach(([key, value]) => { state.kingdom[key] = (state.kingdom[key] || 0) + value; });
    if (choice.flag) state.world.flags[choice.flag[0]] = choice.flag[1];
    if (choice.temporaryEffect && !state.player.temporaryEffects.includes(choice.temporaryEffect)) state.player.temporaryEffects.push(choice.temporaryEffect);
    this.systems.time.advance(choice.time ?? 1, 'choice');
    this.systems.kingdom.generate('choice');
    state.world.timelineReceipts.push(`${choice.label} → ${state.world.phase}, Day ${state.world.day}`);
    choice.effect?.(state, this.systems);
  }

  renderScene(id, options = {}) {
    const { replace = false, runEffects = true, recordHistory = true } = options;
    const scene = this.sceneManager.getScene(id) || this.sceneManager.getScene('ayodhya-1');
    const state = this.stateManager.state;
    if (!scene) return;

    const previous = state.world.currentScene;
    state.world.lastScene = previous !== scene.id ? previous : state.world.lastScene;
    state.world.currentScene = scene.id;
    state.world.sceneEntries[scene.id] = (state.world.sceneEntries[scene.id] || 0) + 1;

    if (runEffects) scene.onEnter?.(state, this.systems);
    if (recordHistory) {
      state.world.history.push({ id: scene.id, title: scene.title, at: new Date().toISOString(), day: state.world.day, phase: state.world.phase });
    }

    this.ui.renderAll(scene, this.sceneManager.scenes);
    const url = `?scene=${encodeURIComponent(scene.id)}#scene-${encodeURIComponent(scene.id)}`;
    window.history[replace ? 'replaceState' : 'pushState']({ sceneId: scene.id }, '', url);
    this.systems.saveLoad.save();
  }

  persistAndRefresh() {
    const scene = this.sceneManager.getScene(this.stateManager.state.world.currentScene);
    this.ui.renderAll(scene, this.sceneManager.scenes);
    this.systems.saveLoad.save();
  }
}

document.addEventListener('DOMContentLoaded', () => new GameEngine());
