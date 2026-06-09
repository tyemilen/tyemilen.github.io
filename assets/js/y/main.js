const colors = [
	{
		message: 'i hate spring',
		startMonth: 3,
		startDay: 1,
		endMonth: 5,
		endDay: 31,
		colors: ['#940074'],
		pattern: 'flower',
		patternOpacity: 0.3,
	},
	{
		message: 'all my homies are deeply in love with eachother',
		startMonth: 6,
		startDay: 1,
		endMonth: 6,
		endDay: 30,
		colors: [
			'#8f8f8f',
			'#FFAFB8',
			'#75D5FA',
			'#784F17',
			'#000000',
			'#b62f2f',
			'#FF8C00',
			'#f3e34f',
			'#00b436',
			'#24408E',
			'#732982',
		],
		pattern: 'paw',
		patternOpacity: 0.05,
	},
	{
		message: 'SUMMER IS THE BEST I LOVE THE WORLD AND EVERYTHING IN IT',
		startMonth: 6,
		startDay: 1,
		endMonth: 8,
		endDay: 31,
		colors: ['#009411'],
		pattern: 'sun',
		patternOpacity: 0.5,
	},
	{
		message: 'fall is fine',
		startMonth: 9,
		startDay: 1,
		endMonth: 11,
		endDay: 30,
		colors: ['#9d1101'],
		pattern: 'acorn',
		patternOpacity: 0.3,
	},
	{
		message: 'not a fan',
		startMonth: 12,
		startDay: 1,
		endMonth: 2,
		endDay: 28,
		colors: ['#004e78'],
		pattern: 'snowflake',
		patternOpacity: 0.4,
	},
];

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentDay = now.getDate();

const activePeriod = colors.find((c) => {
	const start = c.startMonth * 100 + c.startDay;
	const end = c.endMonth * 100 + c.endDay;
	const current = currentMonth * 100 + currentDay;

	if (start <= end) {
		return current >= start && current <= end;
	}

	return current >= start || current <= end;
});

async function loadTrack() {
	const res = await fetch('https://lastfm-last-played.biancarosa.com.br/tyemil/latest-song');
	console.log(res)
	const { track } = await res.json();

	console.log(track)
	const cover = document.getElementById('track-cover');
	const text = document.getElementById('track');

	if (cover) cover.src = track.image[1]['#text'];
	if (text) text.textContent = `${track.artist['#text']} - ${track.name}`;
}

(async () => {
	document.getElementById('month-icon').src = `/assets/patterns/${activePeriod.pattern}.svg`;
	await loadTrack()
})();

const SLUG = 'rawr';

const webringLeft = document.getElementById('webring-left');
const webringRight = document.getElementById('webring-right');

document.addEventListener('DOMContentLoaded', async () => {
	const data = await fetch(`https://webring.otomir23.me/${SLUG}/data`).then((r) => r.json());

	webringLeft.querySelector('p').innerText = data.prev.name;
	webringLeft.onclick = () => (window.location.href = data.prev.url);
	
	webringRight.querySelector('p').innerText = data.next.name;
	webringRight.onclick = () => (window.location.href = data.next.url);
});
