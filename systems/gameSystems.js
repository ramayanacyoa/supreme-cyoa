export const SAVE_KEY = 'rkod_save_v2';
export const LEGACY_SAVE_KEY = 'rkod_save';
export const FALLBACK_SCENE_IMAGE = 'assets/images/fallback-scene.svg';
export const FALLBACK_CHARACTER_IMAGE = 'assets/images/fallback-character.svg';

const DEFAULT_STATE = {
  version: '1.0.13',
  player: {
    name: 'Rama',
    level: 1,
    xp: 0,
    stats: { strength: 6, dharma: 50, intelligence: 6, agility: 6 },
    lineage: [],
    temporaryEffects: []
  },
  party: ['rama'],
  allies: { rama: { lvl: 1, role: 'Prince of Ayodhya' }, hanuman: null, sugriva: null, vibhishana: null, sita: null, lakshmana: null },
  inventory: { herbs: 3, arrows: 10, gold: 25 },
  equipment: { weapon: null, charm: null },
  quests: { active: ['Honor the path of dharma'], completed: [] },
  kingdom: { tier: 1, food: 20, stone: 10, faith: 15, gold: 25, lastGeneratedAt: Date.now() },
  world: {
    day: 1,
    hour: 8,
    phase: 'Day',
    dharma: 50,
    flags: {},
    history: [],
    timelineReceipts: [],
    currentScene: 'ayodhya-1',
    lastScene: null,
    sceneEntries: {}
  },
  settings: { realtimeProgression: true, dreamChance: 0.04 }
};

export function createDefaultState() {
  return structuredClone(DEFAULT_STATE);
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normaliseState(rawState = {}) {
  const state = createDefaultState();
  const merged = deepMerge(state, rawState);
  merged.version = '1.0.13';
  merged.inventory.gold ??= merged.kingdom.gold ?? 0;
  merged.kingdom.gold ??= merged.inventory.gold ?? 0;
  merged.world.hour ??= merged.world.phase === 'Night' ? 20 : 8;
  merged.world.timelineReceipts ??= [];
  merged.world.sceneEntries ??= {};
  merged.player.temporaryEffects ??= [];
  merged.settings ??= { realtimeProgression: true, dreamChance: 0.04 };
  merged.world.phase = getPhase(merged.world.hour);
  return merged;
}

function deepMerge(target, source) {
  Object.entries(source || {}).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = deepMerge(target[key] ?? {}, value);
    } else {
      target[key] = value;
    }
  });
  return target;
}

export class InventorySystem {
  constructor(state) { this.state = state; }
  add(item, amount = 1) { this.state.inventory[item] = (this.state.inventory[item] || 0) + amount; }
  remove(item, amount = 1) {
    if (!this.has(item, amount)) return false;
    this.state.inventory[item] -= amount;
    if (this.state.inventory[item] <= 0) delete this.state.inventory[item];
    return true;
  }
  has(item, amount = 1) { return (this.state.inventory[item] || 0) >= amount; }
}

export class QuestSystem {
  constructor(state) { this.state = state; }
  start(quest) {
    if (!this.state.quests.active.includes(quest) && !this.state.quests.completed.includes(quest)) this.state.quests.active.push(quest);
  }
  complete(quest) {
    this.state.quests.active = this.state.quests.active.filter((q) => q !== quest);
    if (!this.state.quests.completed.includes(quest)) this.state.quests.completed.push(quest);
  }
}

export class PartySystem {
  constructor(state) { this.state = state; }
  add(id, data = {}) {
    this.state.allies[id] = { lvl: 1, ...data };
    if (!this.state.party.includes(id)) this.state.party.push(id);
  }
  remove(id) {
    this.state.allies[id] = null;
    this.state.party = this.state.party.filter((member) => member !== id);
  }
  has(id) { return Boolean(this.state.allies[id]); }
}

export class TimeSystem {
  constructor(state) { this.state = state; this.intervalId = null; }
  start(onTick) {
    this.stop();
    if (!this.state.settings.realtimeProgression) return;
    this.intervalId = window.setInterval(() => {
      this.advance(1, 'real-time');
      onTick?.();
    }, 30000);
  }
  stop() { if (this.intervalId) window.clearInterval(this.intervalId); this.intervalId = null; }
  advance(hours = 1, reason = 'choice') {
    const world = this.state.world;
    world.hour += hours;
    while (world.hour >= 24) { world.hour -= 24; world.day += 1; }
    world.phase = getPhase(world.hour);
    world.flags.lastTimeReason = reason;
    return world.phase;
  }
}

export class KingdomSystem {
  constructor(state) { this.state = state; }
  generate(reason = 'passive') {
    const k = this.state.kingdom;
    const phaseBonus = this.state.world.phase === 'Day' ? 2 : 1;
    k.food += k.tier * phaseBonus;
    k.faith += this.state.world.phase === 'Night' ? 1 : 0;
    k.gold += k.tier;
    this.state.inventory.gold = k.gold;
    k.lastGeneratedAt = Date.now();
    this.state.world.flags.lastKingdomTick = reason;
  }
}

export class SaveLoadSystem {
  constructor(stateRef) { this.stateRef = stateRef; }
  save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.stateRef.state));
    return true;
  }
  load() {
    const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
    if (!raw) return false;
    this.stateRef.state = normaliseState(JSON.parse(raw));
    return true;
  }
}

export function getPhase(hour) { return hour >= 6 && hour < 18 ? 'Day' : 'Night'; }

export function canShowChoice(choice, state) {
  if (choice.requiresItem && (state.inventory[choice.requiresItem] || 0) <= 0) return false;
  if (choice.requiresParty && !state.party.includes(choice.requiresParty)) return false;
  if (choice.requiresPhase && state.world.phase !== choice.requiresPhase) return false;
  if (choice.requiresFlag && !state.world.flags[choice.requiresFlag]) return false;
  return true;
}
