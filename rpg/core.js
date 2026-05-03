const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class Player {
  constructor(name) {
    this.name = name;
    this.health = 120;
    this.maxHealth = 120;
    this.energy = 60;
    this.level = 1;
    this.xp = 0;
    this.inventory = ["Forest Bow", "Traveler's Cloak"];
    this.blessings = [];
    this.resources = { food: 100, wood: 40, stone: 20, faith: 30, intel: 5 };
    this.camp = { level: 1, morale: 50, defense: 20, shrineTier: 1, workshopTier: 1 };
    this.stats = { dharma: 50, aggression: 20, compassion: 50, honor: 55, strategy: 40 };
    this.affection = { sita: 70, lakshmana: 75, hanuman: 50, sugriva: 35, vibhishana: 20, bharata: 80 };
    this.relationshipStates = {};
    this.skills = { archery: 1, swordplay: 1, leadership: 1, mantra: 0, medicine: 0 };
    this.flags = { betrayals: [], loyaltyPacts: [] };
    this.questLog = { main: [], side: [], dailies: [] };
    this.world = { chapter: "forest", completedScenes: [], activeEvent: null, rotatingChallenge: null };
    this.sceneHistory = [];
  }

  applyEffects(effects = {}) {
    Object.entries(effects.stats || {}).forEach(([k, v]) => { this.stats[k] = clamp((this.stats[k] || 0) + v, 0, 100); });
    Object.entries(effects.affection || {}).forEach(([k, v]) => { this.affection[k] = clamp((this.affection[k] || 0) + v, -100, 100); });
    Object.entries(effects.resources || {}).forEach(([k, v]) => { this.resources[k] = Math.max(0, (this.resources[k] || 0) + v); });
    if (effects.hp) this.health = clamp(this.health + effects.hp, 0, this.maxHealth);
    if (effects.item) this.inventory.push(effects.item);
    if (effects.blessing) this.blessings.push(effects.blessing);
    RelationshipSystem.evaluateAll(this);
  }
}

export class RelationshipSystem {
  static thresholds = [
    { id: "oathbound", min: 85, bonuses: { strategy: 5 }, synergy: true },
    { id: "trusted", min: 65, bonuses: { honor: 3 } },
    { id: "strained", min: 20, penalties: { strategy: -2 } },
    { id: "fractured", min: -20, betrayalRisk: true }
  ];

  static evaluate(player, companionId) {
    const value = player.affection[companionId] || 0;
    const state = this.thresholds.find((t) => value >= t.min) || this.thresholds[this.thresholds.length - 1];
    player.relationshipStates[companionId] = state.id;
    if (state.betrayalRisk && !player.flags.betrayals.includes(companionId)) player.flags.betrayals.push(companionId);
    if (state.synergy && !player.flags.loyaltyPacts.includes(companionId)) player.flags.loyaltyPacts.push(companionId);
    return state;
  }

  static evaluateAll(player) {
    Object.keys(player.affection).forEach((id) => this.evaluate(player, id));
  }
}

export class TraitSystem {
  static getTraitModifiers(player) {
    const s = player.stats;
    return {
      attackBonus: Math.floor((s.aggression + s.strategy) / 25),
      defenseBonus: Math.floor((s.honor + s.dharma) / 30),
      illusionResistance: clamp(Math.floor((s.dharma + s.strategy - s.aggression) / 10), 0, 15),
      compassionShield: s.compassion >= 70 ? 8 : 0,
      endingTag: s.dharma >= 75 && s.compassion >= 65 ? "benevolent" : s.aggression >= 80 ? "dominating" : "fractured"
    };
  }
}

export class CombatSystem {
  static runTurn(player, enemy, action, companions = []) {
    const trait = TraitSystem.getTraitModifiers(player);
    const loyaltyCompanions = companions.filter((c) => c.isLoyal(player));
    const synergyBonus = loyaltyCompanions.length * 4 + player.flags.loyaltyPacts.length * 2;
    const damage = Math.round(player.skills.archery * 8 + player.stats.strategy * 0.3 + player.stats.aggression * 0.2 + trait.attackBonus + synergyBonus + (action.power || 0));
    enemy.hp = Math.max(0, enemy.hp - damage);

    const enemyDamage = Math.max(0, enemy.attack - player.stats.honor * 0.1 - trait.defenseBonus - trait.compassionShield);
    player.health = Math.max(0, player.health - enemyDamage);
    return { damage, enemyHp: enemy.hp, playerHp: player.health, illusionResistance: trait.illusionResistance };
  }
}

export class Companion {
  constructor(id, name, role, loyaltyGate = 40) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.loyaltyGate = loyaltyGate;
    this.active = true;
  }

  isLoyal(player) {
    return (player.affection[this.id] || 0) >= this.loyaltyGate && !player.flags.betrayals.includes(this.id);
  }
}

export class SceneManager {
  constructor(scenes) {
    this.scenes = scenes;
    this.currentSceneId = "forest_surpanakha";
  }

  loadScene(id) {
    if (!this.scenes[id]) throw new Error(`Unknown scene: ${id}`);
    this.currentSceneId = id;
    return this.scenes[id];
  }

  choose(choice, player) {
    player.applyEffects(choice.effects);
    player.sceneHistory.push(this.currentSceneId);
    if (choice.meta?.questUpdate) player.questLog.main.push(choice.meta.questUpdate);
    if (choice.meta?.event) player.world.activeEvent = choice.meta.event;
    return this.loadScene(choice.next);
  }
}

export class SaveSystem {
  static exportState(gameState) {
    return JSON.stringify({ version: "2.0.0", timestamp: new Date().toISOString(), gameState }, null, 2);
  }

  static importState(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!parsed?.gameState) throw new Error("Invalid save file.");
    return parsed.gameState;
  }
}

export class DharmaSandbox {
  constructor(gameState) { this.gameState = gameState; }
  set(path, value) { this.#resolve(path).target[this.#resolve(path).key] = value; }
  triggerEvent(eventName) { this.gameState.player.world.activeEvent = eventName; }
  branchTo(sceneId) { this.gameState.sceneManager.currentSceneId = sceneId; }
  addCompanionAffection(id, amount) { this.gameState.player.affection[id] = (this.gameState.player.affection[id] || 0) + amount; RelationshipSystem.evaluate(this.gameState.player, id); }
  unlockAllBlessings() { this.gameState.player.blessings = ["Agni Arrow Rite", "Wind Father's Grace", "Garuda Release", "Ocean Lord's Passage"]; }

  #resolve(path) {
    const parts = path.split(".");
    const key = parts.pop();
    const target = parts.reduce((acc, p) => acc[p], this.gameState);
    return { target, key };
  }
}
