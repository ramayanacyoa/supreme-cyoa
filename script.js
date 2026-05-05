console.log("Update 1.0.12");

class StateManager {
  constructor() {
    this.state = {
      player: { name: 'Rama', level: 1, xp: 0, stats: { strength: 6, dharma: 50, intelligence: 6, agility: 6 }, lineage: [] },
      party: ['rama'], allies: { rama: { lvl: 1 }, hanuman: null, sugriva: null, vibhishana: null },
      inventory: { herbs: 3, arrows: 10 }, equipment: { weapon: null, charm: null },
      quests: { active: [], completed: [] }, kingdom: { tier: 1, food: 20, stone: 10, faith: 15 },
      world: { day: 1, phase: 'Day', dharma: 50, flags: {}, history: [], currentScene: 'ayodhya-1' }
    };
  }
  save() { localStorage.setItem('rkod_save', JSON.stringify(this.state)); }
  load() { const raw = localStorage.getItem('rkod_save'); if (raw) this.state = JSON.parse(raw); }
}

class SceneManager {
  constructor(state) { this.state = state; this.scenes = this.buildScenes(); }
  buildScenes() {
    const arcs = ['ayodhya', 'exile', 'forest', 'kishkindha', 'lanka', 'return'];
    const scenes = {};
    arcs.forEach((arc, ai) => {
      for (let i = 1; i <= 40; i++) {
        const id = `${arc}-${i}`;
        const nextArc = arcs[Math.min(ai + 1, arcs.length - 1)];
        const next = i < 40 ? `${arc}-${i + 1}` : `${nextArc}-1`;
        scenes[id] = {
          id, arc,
          title: `${arc.toUpperCase()} • Chapter ${i}`,
          text: `Day ${this.state.world.day}: You face trials in ${arc}. Your choices reshape allies, kingdom, and destiny.`,
          backgroundImage: `https://picsum.photos/seed/${arc + i}/1200/700`,
          characterImage: `https://picsum.photos/seed/hero${i}/360/620`,
          effects: () => this.applySceneEffects(arc, i),
          choices: [
            { label: 'Follow dharma', to: next, effect: () => this.state.world.dharma += 2 },
            { label: 'Take tactical risk', to: next, effect: () => this.state.player.stats.intelligence += 1 },
            { label: 'Explore hidden path', to: this.randomEncounter(id), effect: () => this.state.player.xp += 8 }
          ]
        };
      }
    });
    scenes['dream-1'] = { id:'dream-1', arc:'slumberland', title:'Slumberland Dream Gate', text:'You enter a dream realm. Hidden truths alter lineage memory.', backgroundImage:'https://picsum.photos/seed/dream/1200/700', characterImage:'https://picsum.photos/seed/moon/360/620', effects:()=>{this.state.player.lineage.push('Dream Omen');}, choices:[{label:'Awaken', to:this.state.world.currentScene}] };
    return scenes;
  }
  randomEncounter(returnTo) {
    const ids = ['encounter-sage','encounter-demon','encounter-merchant'];
    ids.forEach((id, idx) => {
      this.scenes[id] = { id, arc: 'encounter', title: `Encounter ${idx+1}`, text: 'A dynamic event reacts to your party, time, and dharma.', backgroundImage:`https://picsum.photos/seed/${id}/1200/700`, characterImage:`https://picsum.photos/seed/${id}p/360/620`, effects:()=>{this.state.player.xp += 5; this.state.kingdom.food += 1;}, choices:[{label:'Return to journey', to:returnTo}] };
    });
    return ids[Math.floor(Math.random() * ids.length)];
  }
  applySceneEffects(arc, i) {
    this.state.world.day += 1;
    this.state.world.phase = this.state.world.day % 2 === 0 ? 'Night' : 'Day';
    this.state.kingdom.food += 1;
    if (arc === 'kishkindha' && i === 2) this.state.allies.hanuman = { lvl: 1 };
    if (arc === 'kishkindha' && i === 10) this.state.allies.sugriva = { lvl: 1 };
    if (arc === 'lanka' && i === 15) this.state.allies.vibhishana = { lvl: 1 };
  }
  getScene(id) { return this.scenes[id]; }
}

class UIController {
  constructor(state) { this.state = state; this.hud = document.getElementById('hud'); }
  renderHUD() {
    const s = this.state;
    this.hud.innerHTML = `<h3>Hero</h3><p>${s.player.name} Lv.${s.player.level} XP:${s.player.xp}</p>
    <p>STR ${s.player.stats.strength} | INT ${s.player.stats.intelligence} | AGI ${s.player.stats.agility}</p>
    <p>Dharma: ${s.world.dharma}</p><h4>Party</h4><p>${Object.keys(s.allies).filter(k=>s.allies[k]).join(', ')}</p>
    <h4>Kingdom</h4><p>Tier ${s.kingdom.tier} • Food ${s.kingdom.food} • Faith ${s.kingdom.faith}</p>
    <h4>Quests</h4><p>Active: ${s.quests.active.length} | Done: ${s.quests.completed.length}</p><p>Time: Day ${s.world.day} (${s.world.phase})</p>`;
  }
  typeText(el, txt) { el.textContent=''; let i=0; el.classList.add('typing'); const tick=()=>{ if(i<txt.length){el.textContent+=txt[i++]; requestAnimationFrame(tick);} else el.classList.remove('typing');}; tick(); }
}

class GameEngine {
  constructor() {
    this.stateManager = new StateManager();
    this.sceneManager = new SceneManager(this.stateManager.state);
    this.ui = new UIController(this.stateManager.state);
    this.bindGlobalActions();
    this.renderScene(this.stateManager.state.world.currentScene);
  }
  bindGlobalActions() {
    document.getElementById('saveBtn').onclick = () => this.stateManager.save();
    document.getElementById('loadBtn').onclick = () => { this.stateManager.load(); this.renderScene(this.stateManager.state.world.currentScene); };
    document.getElementById('timelineBtn').onclick = () => document.getElementById('timelinePanel').classList.toggle('hidden');
    window.addEventListener('popstate', (e) => { if (e.state?.sceneId) this.renderScene(e.state.sceneId, true); });
  }
  renderScene(id, replace = false) {
    const scene = this.sceneManager.getScene(id);
    if (!scene) return;
    this.stateManager.state.world.currentScene = id;
    scene.effects?.();
    this.stateManager.state.world.history.push({ id, title: scene.title, at: new Date().toISOString() });
    const t = document.getElementById('sceneTitle'); const p = document.getElementById('sceneText');
    t.textContent = scene.title; this.ui.typeText(p, scene.text);
    bgImage.src = scene.backgroundImage; charImage.src = scene.characterImage;
    const choiceWrap = document.getElementById('choices'); choiceWrap.innerHTML = '';
    scene.choices.forEach(c => { const b = document.createElement('button'); b.textContent = c.label; b.onclick = () => { c.effect?.(); if (Math.random() < 0.04) return this.renderScene('dream-1'); this.renderScene(c.to); }; choiceWrap.appendChild(b); });
    this.ui.renderHUD(); this.renderTimeline();
    const url = `?scene=${encodeURIComponent(id)}#scene-${encodeURIComponent(id)}`;
    history[replace ? 'replaceState' : 'pushState']({ sceneId: id }, '', url);
  }
  renderTimeline() {
    const list = document.getElementById('timelineList');
    list.innerHTML = this.stateManager.state.world.history.slice(-30).map(h => `<li>${h.title}</li>`).join('');
  }
}
new GameEngine();
