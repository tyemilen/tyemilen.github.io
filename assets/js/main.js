const usernames = [
    {
        selector: '#username-1',
        stretch: 2.2,
        shrink: 0.8,
        curve: -90,
    },
    {
        selector: '#username-2',
        stretch: 2,
        shrink: 0.15,
        curve: 80,
    },
];

function curveUsername(el, settings) {
    const { stretch = 2.2, shrink = 0.35, curve = 45 } = settings;

    const text = el.textContent;
    if (!text) return;

    const style = getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize) || 28;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = style.font;

    const spacing = parseFloat(style.letterSpacing) || 0;
    const chars = [...text];

    const widths = chars.map((char) =>
        Math.max(1, ctx.measureText(char).width + spacing),
    );

    const scales = chars.map((_, i) => {
        const t = i / Math.max(1, chars.length - 1);
        return Math.max(0.05, 1 - shrink * t);
    });

    const advances = widths.map((width, i) => width * stretch * scales[i]);

    const total = advances.reduce((sum, width) => sum + width, 0);

    el.replaceChildren();
    el.style.width = `${total}px`;
    el.style.height = `${curve + fontSize}px`;

    let x = 0;

    chars.forEach((char, i) => {
        const t = (x + advances[i] / 2) / total;
        const y = -curve * Math.sin(Math.PI * t);

        const angle = Math.atan(
            -((curve * Math.PI) / total) * Math.cos(Math.PI * t),
        );

        const scale = scales[i];

        const letter = document.createElement('span');
        letter.className = 'letter';
        letter.textContent = char;
        letter.style.animationDelay = `${i * 25}ms`;
        letter.style.left = `${x + advances[i] / 2}px`;
        letter.style.top = `${y}px`;
        letter.style.fontSize = `${fontSize}px`;

        letter.style.transform =
            `translate(-50%, -50%) ` +
            `rotate(${angle}rad) ` +
            `scale(${stretch * scale}, ${scale})`;

        el.appendChild(letter);
        x += advances[i];
    });
    el.classList.add('is-ready');
}

usernames.forEach((settings) => {
    document.querySelectorAll(settings.selector).forEach((el) => {
        curveUsername(el, settings);
    });
});

document.getElementById('mybtn').onclick = async () => {
    await navigator.clipboard.writeText(`
<a href="https://rawr.rs/" target="_blank" style="image-rendering:pixelated">
	<img src="https://rawr.rs/assets/88x31.png" alt="doeki's 88x31 button">
</a>`);
};

async function loadTrack() {
    const res = await fetch(
        'https://lastfm-last-played.biancarosa.com.br/tyemil/latest-song',
    );
    const { track } = await res.json();

    const cover = document.getElementById('track-cover');
    const text = document.getElementById('track');

    if (cover) cover.src = track.image[1]['#text'];
    if (text) text.textContent = `${track.artist['#text']} - ${track.name}`;
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadTrack();
});
