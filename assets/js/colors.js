function fromPrimary(hexColor, l = 0.967) {
	let hex = hexColor.replace('#', '');
	let r = parseInt(hex.substring(0, 2), 16) / 255;
	let g = parseInt(hex.substring(2, 4), 16) / 255;
	let b = parseInt(hex.substring(4, 6), 16) / 255;

	let max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h, s;

	if (max === min) {
		h = s = 0;
	} else {
		let d = max - min;
		s = 1.0;
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	let p = 2 * l - q;

	const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	let finalR = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
	let finalG = Math.round(hue2rgb(p, q, h) * 255);
	let finalB = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

	const toHex = (val) => val.toString(16).padStart(2, '0');
	return `#${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`;
}

const colors = [
	{
		message: 'i hate spring',
		startMonth: 3,
		startDay: 1,
		endMonth: 5,
		endDay: 31,
		colors: ['#940074'],
		pattern: 'flower',
		patternOpacity: 0.3
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
		patternOpacity: 0.5

	},
	{
		message: 'fall is fine',
		startMonth: 9,
		startDay: 1,
		endMonth: 11,
		endDay: 30,
		colors: ['#9d1101'],
		pattern: 'acorn',
		patternOpacity: 0.3
	},
	{
		message: 'not a fan',
		startMonth: 12,
		startDay: 1,
		endMonth: 2,
		endDay: 28,
		colors: ['#004e78'],
		pattern: 'snowflake',
		patternOpacity: 0.4
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

const selectedColors = activePeriod?.colors || ['#000000'];

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

;(async () => {
	const message = document.getElementById('message-of-the-month');
	if (message && activePeriod.message) {
		message.innerText = `[${currentDay.toString().padStart(2, '0')}/${activePeriod.startMonth.toString().padStart(2, '0')}]: ${activePeriod.message}`;
	}

	document.documentElement.style.setProperty('--pattern-url', `url("/assets/patterns/${activePeriod.pattern}.svg")`);
	document.documentElement.style.setProperty('--pattern-opacity', activePeriod.patternOpacity);

	let color = selectedColors[0];

	document.documentElement.style.setProperty('--primary', color);
	document.documentElement.style.setProperty('--bg', fromPrimary(color));
	document.documentElement.style.setProperty('--text', fromPrimary(color, 0.14));
	document.documentElement.style.setProperty('--pattern', fromPrimary(color, 0.9));

	setTimeout(() => {
		document.documentElement.classList.add('cooked');
	}, 200);

	if (selectedColors.length <= 1) return;

	while (true) {
		for (let color of selectedColors) {
			document.documentElement.style.setProperty('--primary', color);
			document.documentElement.style.setProperty('--bg', fromPrimary(color));
			document.documentElement.style.setProperty('--text', fromPrimary(color, 0.14));
			document.documentElement.style.setProperty('--pattern', fromPrimary(color, 0.3));

			await sleep(7000);
		}
	}
})();
