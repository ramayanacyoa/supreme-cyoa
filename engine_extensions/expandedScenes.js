export const RAMAYANA_ARCS = ['ayodhya', 'exile', 'forest', 'kishkindha', 'lanka', 'return'];

const imageFor = (seed) => `https://picsum.photos/seed/rkod-${seed}/1200/700`;
const portraitFor = (seed) => `https://picsum.photos/seed/rkod-portrait-${seed}/360/620`;

export const EXPANDED_SCENES = [
  { id: 'ayodhya-council-1', arc: 'ayodhya', title: 'Ayodhya Council: The Uneasy Dawn', text: 'Ministers whisper that the city celebrates too loudly. You may reassure them, investigate the rumor, or spend gold strengthening the granaries.', image: imageFor('ayodhya-council-1'), characterImage: portraitFor('council'), quest: 'Stabilize Ayodhya before exile', choices: [
    { label: 'Reassure the court', to: 'ayodhya-council-2', dharma: 2, time: 1 },
    { label: 'Investigate the rumor', to: 'ayodhya-council-3', stat: ['intelligence', 1], time: 2 },
    { label: 'Fund the granaries (5 gold)', to: 'ayodhya-council-4', requiresItem: 'gold', cost: ['gold', 5], kingdom: { food: 8, faith: 1 }, time: 1 }
  ] },
  { id: 'ayodhya-council-2', arc: 'ayodhya', title: 'Garlands in the Hall', text: 'Your words calm the palace. The people remember restraint more than ceremony.', image: imageFor('ayodhya-council-2'), choices: [{ label: 'Continue toward the decree', to: 'ayodhya-2', dharma: 1 }] },
  { id: 'ayodhya-council-3', arc: 'ayodhya', title: 'A Servant’s Warning', text: 'A servant reveals that fear has entered Kaikeyi’s chamber. The knowledge does not avert fate, but it prepares your heart.', image: imageFor('ayodhya-council-3'), choices: [{ label: 'Keep vigil', to: 'ayodhya-2', flag: ['kaikeyiWarning', true] }] },
  { id: 'ayodhya-council-4', arc: 'ayodhya', title: 'Granaries of Compassion', text: 'Storehouses open for widows and travelers. The kingdom grows steadier even as your own path darkens.', image: imageFor('ayodhya-council-4'), choices: [{ label: 'Return to the palace road', to: 'ayodhya-2' }] },
  ...makeChain('exile', 'River Oaths', 8, 'The river listens as exile becomes more than punishment; it becomes a vow.', 'forest-1'),
  ...makeChain('forest', 'Hermitage Shadows', 8, 'Sages ask for protection while the forest itself seems to test your patience.', 'kishkindha-1'),
  ...makeChain('kishkindha', 'Vanara Covenant', 8, 'Trust among the vanaras must be earned by courage, fairness, and visible results.', 'lanka-1'),
  ...makeChain('lanka', 'Ashen Ramparts', 8, 'Every step through Lanka weighs mercy against victory.', 'return-1'),
  ...makeChain('return', 'Coronation Echoes', 8, 'The road home asks whether triumph can become wise rule.', 'return-40'),
  { id: 'slumberland-rest', arc: 'slumberland', title: 'Slumberland: Lotus Threshold', text: 'You rest beneath a sky of floating lamps. Dream logic loosens wounds and reveals hidden routes.', image: imageFor('slumberland-rest'), characterImage: portraitFor('dream'), choices: [
    { label: 'Follow the blue lotus', to: 'slumberland-trial', temporaryEffect: 'Lotus Clarity', time: 8 },
    { label: 'Wake before the omen deepens', to: 'forest-1', dharma: 1, time: 6 }
  ] },
  { id: 'slumberland-trial', arc: 'slumberland', title: 'Slumberland: Trial of Mirrors', text: 'Mirrors show kingdoms saved by haste and ruined by haste. You wake with wisdom, but dawn has moved on without you.', image: imageFor('slumberland-trial'), choices: [{ label: 'Awaken changed', to: 'forest-2', stat: ['intelligence', 2], flag: ['dreamMirror', true], time: 4 }] }
];

function makeChain(arc, title, count, text, exitTo) {
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const id = `${arc}-side-${n}`;
    return {
      id,
      arc,
      title: `${title} ${n}`,
      text: `${text} ${n % 2 === 0 ? 'Night reveals consequences delayed by daylight.' : 'Daylight invites decisive action.'}`,
      image: imageFor(id),
      characterImage: portraitFor(id),
      choices: [
        { label: 'Choose the merciful answer', to: n === count ? exitTo : `${arc}-side-${n + 1}`, dharma: 2, time: 2 },
        { label: 'Take the strategic answer', to: n === count ? exitTo : `${arc}-side-${n + 1}`, stat: ['intelligence', 1], time: 2 },
        { label: 'Rest and enter Slumberland', to: 'slumberland-rest', requiresPhase: 'Night', time: 1 }
      ]
    };
  });
}
