export const campaignScenes = {
  forest_surpanakha: {
    title: "Panchavati: The Uninvited Flame",
    description: "At twilight, Surpanakha steps from the sal trees. Her laughter is honeyed, her gaze predatory. Sita senses danger. Lakshmana reaches for his blade.",
    choices: [
      { text: "Reject her calmly and invoke dharma.", next: "forest_khara_dushana", effects: { stats: { dharma: 8, compassion: 4, aggression: -3 }, affection: { sita: 5, lakshmana: 2 } } },
      { text: "Order Lakshmana to humiliate her publicly.", next: "forest_khara_dushana", effects: { stats: { honor: -8, aggression: 9 }, affection: { sita: -8, lakshmana: 6 } } },
      { text: "Interrogate her about Lanka before dismissing her.", next: "forest_khara_dushana", effects: { stats: { strategy: 7, dharma: 2 }, affection: { lakshmana: 3 } } }
    ]
  },
  forest_khara_dushana: {
    title: "Siege of Janasthana",
    description: "Khara and Dushana march with fourteen thousand rakshasas. The forest trembles under war drums. You must choose doctrine before battle begins.",
    choices: [
      { text: "Hold defensive lines with Lakshmana.", next: "forest_golden_deer", effects: { stats: { strategy: 8, honor: 4 }, affection: { lakshmana: 6, sita: 2 } } },
      { text: "Launch a direct solo assault.", next: "forest_golden_deer", effects: { stats: { aggression: 10, honor: 2 }, affection: { lakshmana: -4, sita: -3 }, hp: -15 } },
      { text: "Use mantra arrows to scatter enemies first.", next: "forest_golden_deer", effects: { stats: { strategy: 6, dharma: 3 }, affection: { lakshmana: 3 }, blessing: "Agni Arrow Rite" } }
    ]
  },
  forest_golden_deer: {
    title: "Maricha's Illusion",
    description: "A golden deer gleams with impossible beauty. Sita asks for it. Lakshmana warns of deceit. The cry of fate has already begun.",
    choices: [
      { text: "Pursue the deer personally.", next: "forest_abduction", effects: { stats: { compassion: 3, strategy: -2 }, affection: { sita: 7 } } },
      { text: "Send Lakshmana while you guard the hermitage.", next: "forest_abduction", effects: { stats: { strategy: 6 }, affection: { lakshmana: -5, sita: -2 } } },
      { text: "Refuse and perform a warding ritual.", next: "forest_abduction", effects: { stats: { dharma: 4, compassion: -3, strategy: 5 }, affection: { sita: -8 }, blessing: "Hermitage Ward" } }
    ]
  },
  forest_abduction: {
    title: "The Empty Threshold",
    description: "Maricha's dying cry mimics your voice. Sita compels Lakshmana to leave. Ravana arrives disguised as an ascetic, then seizes her skyward. Jatayu falls defending her.",
    choices: [
      { text: "Console Lakshmana and swear a measured rescue.", next: "kishkindha_meeting_sugriva", effects: { stats: { compassion: 8, honor: 4 }, affection: { lakshmana: 8 } } },
      { text: "Blame Lakshmana in rage.", next: "kishkindha_meeting_sugriva", effects: { stats: { aggression: 8, dharma: -7 }, affection: { lakshmana: -15 } } },
      { text: "Take Jatayu's counsel and chart Lanka immediately.", next: "kishkindha_meeting_sugriva", effects: { stats: { strategy: 10 }, affection: { lakshmana: 2 }, item: "Jatayu's Feather Map" } }
    ]
  },
  kishkindha_meeting_sugriva: { title: "Rishyamuka Pact", description: "Hanuman, disguised as a mendicant, tests your intent before bringing Sugriva forth.", choices: [
    { text: "Earn trust through truth and vow.", next: "kishkindha_vali_conflict", effects: { affection: { hanuman: 10, sugriva: 8 }, stats: { dharma: 5 } } },
    { text: "Offer military deal only.", next: "kishkindha_vali_conflict", effects: { affection: { sugriva: 5, hanuman: -4 }, stats: { strategy: 6 } } },
    { text: "Demand immediate obedience.", next: "kishkindha_vali_conflict", effects: { affection: { sugriva: -10, hanuman: -8 }, stats: { aggression: 7, honor: -5 } } }
  ]},
  kishkindha_vali_conflict: { title: "Brothers at War", description: "Sugriva recounts exile by Vali. Tara warns that intervention will stain your name unless justified.", choices: [
    { text: "Investigate both sides before action.", next: "kishkindha_vali_boss", effects: { stats: { dharma: 6, strategy: 5 }, affection: { sugriva: 3 } } },
    { text: "Promise Vali's death without inquiry.", next: "kishkindha_vali_boss", effects: { stats: { aggression: 8, honor: -6 }, affection: { sugriva: 8, hanuman: -3 } } },
    { text: "Challenge Vali openly.", next: "kishkindha_vali_boss", effects: { stats: { honor: 8 }, affection: { sugriva: -2, hanuman: 6 } } }
  ]},
  kishkindha_vali_boss: { title: "Boss: Vali, Lord of Kishkindha", description: "Phase 1 duel, Phase 2 fury, Phase 3 judgment. Tara and Angada witness the moral burden of your arrow.", choices: [
    { text: "Strike from cover to secure Sugriva's victory.", next: "kishkindha_alliance", effects: { stats: { strategy: 8, honor: -5 }, affection: { sugriva: 12, hanuman: -2 } } },
    { text: "Reveal yourself before the killing blow.", next: "kishkindha_alliance", effects: { stats: { honor: 7, dharma: 4 }, affection: { hanuman: 5, sugriva: 4 } } },
    { text: "Spare Vali and force reconciliation.", next: "kishkindha_alliance", effects: { stats: { compassion: 8, strategy: 3 }, affection: { sugriva: -12, hanuman: 8 } } }
  ]},
  kishkindha_alliance: { title: "Monsoon Oath", description: "Vanaras gather. Your command style now shapes loyalty for the Lanka campaign.", choices: [
    { text: "Train cadres and logistics first.", next: "search_hanuman_leap", effects: { stats: { strategy: 8 }, affection: { sugriva: 4, hanuman: 4 } } },
    { text: "Launch immediate scouting.", next: "search_hanuman_leap", effects: { stats: { aggression: 4 }, affection: { hanuman: 6 } } },
    { text: "Perform prayer-led war council.", next: "search_hanuman_leap", effects: { stats: { dharma: 6, honor: 4 }, blessing: "Wind Father's Grace" } }
  ]},
  search_hanuman_leap: { title: "Flight over the Ocean", description: "Hanuman prepares to leap. Your faith in him determines his morale modifiers in Lanka infiltration.", choices: [
    { text: "Entrust ring and full authority.", next: "search_lanka_guards", effects: { affection: { hanuman: 12 }, stats: { honor: 4 } } },
    { text: "Give strict orders with fallback routes.", next: "search_lanka_guards", effects: { stats: { strategy: 7 }, affection: { hanuman: 3 } } },
    { text: "Threaten consequences for failure.", next: "search_lanka_guards", effects: { stats: { aggression: 5 }, affection: { hanuman: -10 } } }
  ]},
  search_lanka_guards: { title: "Night of Lankini", description: "Hanuman confronts Lankini, patrol captains, and illusion demons at Lanka's gates.", choices: [
    { text: "Stealth route through temple roofs.", next: "search_ashoka_vatika", effects: { stats: { strategy: 8 } } },
    { text: "Create diversion with controlled fire.", next: "search_ashoka_vatika", effects: { stats: { aggression: 6 }, affection: { vibhishana: -4 } } },
    { text: "Invoke Rama's name and duel openly.", next: "search_ashoka_vatika", effects: { stats: { honor: 7, dharma: 2 }, affection: { hanuman: 4 } } }
  ]},
  search_ashoka_vatika: { title: "The Ashoka Grove", description: "Sita sits beneath the shimshupa tree, guarded by cruel rakshasis. Ravana's deadline looms.", choices: [
    { text: "Reveal ring and message of hope.", next: "war_setu", effects: { affection: { sita: 15, hanuman: 8 }, stats: { compassion: 6 } } },
    { text: "Offer immediate extraction.", next: "war_setu", effects: { affection: { sita: -5 }, stats: { aggression: 3, strategy: -2 } } },
    { text: "Request token for proof and vow war.", next: "war_setu", effects: { item: "Sita's Chudamani", stats: { honor: 5, strategy: 3 } } }
  ]},
  war_setu: { title: "Setu Construction System", description: "At the roaring shore, Nala and Nila request command priorities. Bridge integrity drives starting conditions for Lanka war phases.", choices: [
    { text: "Labor rotation + engineering discipline.", next: "war_indrajit", effects: { stats: { strategy: 10 }, item: "Setu Integrity: High" } },
    { text: "Speed-first forced march.", next: "war_indrajit", effects: { stats: { aggression: 6, honor: -3 }, item: "Setu Integrity: Fragile" } },
    { text: "Prayer rites before each milestone.", next: "war_indrajit", effects: { stats: { dharma: 8 }, blessing: "Ocean Lord's Passage" } }
  ]},
  war_indrajit: { title: "Boss: Indrajit, Master of Illusions", description: "Phase 1 serpent noose; Phase 2 invisible volley; Phase 3 yajna interruption. Companion trust unlocks counterplay.", choices: [
    { text: "Deploy Lakshmana with Vibhishana intel.", next: "war_kumbhakarna", effects: { affection: { lakshmana: 10, vibhishana: 12 }, stats: { strategy: 8 } } },
    { text: "Charge with vanara vanguard.", next: "war_kumbhakarna", effects: { stats: { aggression: 10 }, affection: { sugriva: 5, lakshmana: -6 }, hp: -18 } },
    { text: "Counter with divine astra timing.", next: "war_kumbhakarna", effects: { stats: { honor: 6, dharma: 4 }, blessing: "Garuda Release" } }
  ]},
  war_kumbhakarna: { title: "Boss: Kumbhakarna, Mountain of Hunger", description: "He breaks front lines like thunder. Morale checks trigger every wave; high Hanuman affection grants rescue saves.", choices: [
    { text: "Pin limbs with formation tactics.", next: "war_ravana", effects: { stats: { strategy: 9 }, affection: { hanuman: 6, sugriva: 4 } } },
    { text: "Duel him head-on.", next: "war_ravana", effects: { stats: { honor: 7, aggression: 6 }, hp: -20 } },
    { text: "Evacuate wounded before final strike.", next: "war_ravana", effects: { stats: { compassion: 10, dharma: 3 }, affection: { hanuman: 8, sita: 4 } } }
  ]},
  war_ravana: { title: "Final Boss: Ravana of Ten Crowns", description: "Phase 1 aerial chariot duel. Phase 2 shattered standards. Phase 3 brahmastra window at the heart's hidden locus.", choices: [
    { text: "Offer last chance of surrender.", next: "return_coronation", effects: { stats: { dharma: 10, honor: 6 }, affection: { vibhishana: 8 } } },
    { text: "Execute decisive annihilation.", next: "return_coronation", effects: { stats: { aggression: 12, compassion: -8 }, affection: { sita: -5 } } },
    { text: "Let companions coordinate final lock.", next: "return_coronation", effects: { stats: { strategy: 10 }, affection: { lakshmana: 6, hanuman: 6, sugriva: 6 } } }
  ]},
  return_coronation: { title: "Ayodhya Restored", description: "At coronation, public perception tracks your accumulated dharma, mercy, and wartime losses.", choices: [
    { text: "Prioritize justice reforms and welfare.", next: "uttara_exile", effects: { stats: { dharma: 7, compassion: 6 } } },
    { text: "Reward only military loyalists.", next: "uttara_exile", effects: { stats: { aggression: 5, honor: -4 } } },
    { text: "Delegate rule and seek ritual purity.", next: "uttara_exile", effects: { stats: { honor: 4, strategy: -3 } } }
  ]},
  uttara_exile: { title: "Whispers of the City", description: "Rumors question Sita's purity. Crown versus heart becomes your hardest check.", choices: [
    { text: "Stand by Sita publicly.", next: "uttara_lava_kusha", effects: { affection: { sita: 20 }, stats: { compassion: 9, dharma: 5 } } },
    { text: "Exile Sita to protect state stability.", next: "uttara_lava_kusha", effects: { affection: { sita: -30 }, stats: { strategy: 5, honor: -8 } } },
    { text: "Hold public council and legal inquiry.", next: "uttara_lava_kusha", effects: { stats: { dharma: 6, strategy: 6 }, affection: { sita: 5 } } }
  ]},
  uttara_lava_kusha: { title: "Valmiki's Refuge", description: "In forest exile, Sita gives birth to Lava and Kusha. Years pass in song, archery, and inheritance of memory.", choices: [
    { text: "Secretly provide protection.", next: "uttara_ashvamedha", effects: { stats: { compassion: 7 }, affection: { sita: 8 } } },
    { text: "Keep absolute distance.", next: "uttara_ashvamedha", effects: { stats: { honor: 3, compassion: -6 } } },
    { text: "Invite Valmiki for reconciliation terms.", next: "uttara_ashvamedha", effects: { stats: { dharma: 5, strategy: 4 } } }
  ]},
  uttara_ashvamedha: { title: "Ashvamedha Challenge", description: "The sacrificial horse is seized by Lava and Kusha. Father and sons meet first as rivals.", choices: [
    { text: "Fight without revealing identity.", next: "uttara_final_reunion", effects: { stats: { aggression: 6 }, affection: { bharata: -4 } } },
    { text: "Pause battle and hear their song.", next: "uttara_final_reunion", effects: { stats: { compassion: 8, dharma: 4 } } },
    { text: "Let Lakshmana negotiate honor duel.", next: "uttara_final_reunion", effects: { stats: { strategy: 5 }, affection: { lakshmana: 5 } } }
  ]},
  uttara_final_reunion: { title: "Earth's Verdict", description: "Sita calls upon Bhumi Devi and returns to the earth. Rama must choose how to conclude his mortal kingship.", choices: [
    { text: "Rule on in disciplined grief.", next: "ending_check", effects: { stats: { honor: 7, strategy: 4 } } },
    { text: "Renounce and depart for Sarayu.", next: "ending_check", effects: { stats: { dharma: 8 }, affection: { bharata: 4 } } },
    { text: "Harden the realm through fear.", next: "ending_check", effects: { stats: { aggression: 9, compassion: -9 } } }
  ]}
};

export function determineEnding(player) {
  const s = player.stats;
  const betrayed = player.flags?.betrayals?.length || 0;
  if (s.dharma >= 75 && s.compassion >= 65 && s.honor >= 65 && betrayed === 0) return "Ideal Dharma Ending";
  if (s.aggression >= 80 && s.strategy >= 60 && s.compassion <= 30) return "Ruthless Conqueror Ending";
  if (betrayed >= 2) return "Broken Oath Ending";
  return "Failed Ruler Ending";
}
