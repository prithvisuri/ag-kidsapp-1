
const rhymes = [
  { title: 'Twinkle Twinkle Little Star', id: 'yCjJyiqpAuU' },
  { title: 'Baby Shark', id: 'XqZsoesa55w' },
  { title: 'Wheels on the Bus', id: 'e_04ZrNroTo' },
  { title: 'Old MacDonald Had a Farm', id: '_6HzoUcx3eo' },
  { title: 'Johny Johny Yes Papa', id: 'F4tHL8reNCs' },
  { title: 'ABC Song', id: '75p-N9YKqNo' },
  { title: 'Row Row Row Your Boat', id: '7otAJa3jui8' }, // ChuChu TV
  { title: 'Humpty Dumpty', id: 'nrv495corBc' }, // ChuChu TV (Safe Embed)
  { title: 'Baa Baa Black Sheep', id: '0FxhksvgHcw' }, // ChuChu TV
  { title: 'Five Little Monkeys', id: '0j6AZhZFb7A' }, // ChuChu TV
  { title: 'Itsy Bitsy Spider', id: 'w_lCi8U49mY' }, // Super Simple Songs
  { title: 'If You\'re Happy and You Know It', id: 'mHLLclRQ10o' },
  { title: 'Head, Shoulders, Knees & Toes', id: 'r41-kFRX2Xs' } // Backup: EIBd-QoEBQ0
];

export function initRhymes() {
  const grid = document.getElementById('video-list');
  if (!grid) return;
  grid.innerHTML = '';

  rhymes.forEach(rhyme => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <iframe 
        width="100%" 
        height="200" 
        src="https://www.youtube.com/embed/${rhyme.id}" 
        title="${rhyme.title}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
      <div class="video-title">${rhyme.title}</div>
    `;
    grid.appendChild(card);
  });
}
