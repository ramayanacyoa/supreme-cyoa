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
    this.stats = {
      dharma: 50,
      aggression: 20,
      compassion: 50,
      honor: 55,
      strategy: 40
    };
    this.affection = {
      sita: 70,
      lakshmana: 75,
      hanuman: 50,
      sugriva: 35,
      vibhishana: 20,
      bharata: 80
    };
    this.skills = {
      archery: 1,
      swordplay: 1,
      leadership: 1,
      mantra: 0,
      medicine: 0
    };
  }

  applyEffects(effects = {}) {
    Object.entries(effects.stats || {}).forEach(([k, v]) => {
      this.stats[k] = Math.max(0, Math.min(100, this.stats[k] + v));
    });
    Object.entries(effects.affection || {}).forEach(([k, v]) => {
      this.affection[k] = Math.max(0, Math.min(100, (this.affection[k] || 0) + v));
    });
    if (effects.hp) this.health = Math.max(0, Math.min(this.maxHealth, this.health + effects.hp));
    if (effects.item) this.inventory.push(effects.item);
    if (effects.blessing) this.blessings.push(effects.blessing);
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
    return (player.affection[this.id] || 0) >= this.loyaltyGate;
  }
}

export class CombatSystem {
  static runTurn(player, enemy, action, companions = []) {
    const base = player.skills.archery * 8 + player.stats.strategy * 0.3;
    const aggressionBonus = player.stats.aggression * 0.2;
    const companionBonus = companions.filter((c) => c.isLoyal(player)).length * 4;
    const damage = Math.round(base + aggressionBonus + companionBonus + (action.power || 0));
    enemy.hp = Math.max(0, enemy.hp - damage);
    player.health = Math.max(0, player.health - Math.max(0, enemy.attack - player.stats.honor * 0.1));
    return { damage, enemyHp: enemy.hp, playerHp: player.health };
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
    return this.loadScene(choice.next);
  }
}
