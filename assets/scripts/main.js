const $ = (id, root = document) => root.getElementById(id);
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const badges = [
    'vue.js',
    'nuxt',
    'typescript',
    'sass',
    'go',
    'c',
    'nixos',
    'postgresql',
    'linux',
    'docker',
];

const createBadge = (name) =>
    `https://img.shields.io/badge/${name}-black.svg?style=for-the-badge&logo=${name}&logoColor=white`;

function placeWindow(box) {
    const area = $('border-container').getBoundingClientRect();
    const footerTop = $('footer').getBoundingClientRect().top;
    const borderLeft = $('border').getBoundingClientRect().left;

    const maxX =
        Math.max(0, window.innerWidth - borderLeft - box.offsetWidth) * 0.8;
    const maxY =
        Math.max(0, window.innerHeight - footerTop - box.offsetHeight) * 0.8;

    box.style.left = `${area.left + random(0, maxX)}px`;
    box.style.top = `${area.top + random(0, maxY)}px`;
}

class CoolWindow extends HTMLElement {
    static observedAttributes = ['icon'];

    constructor() {
        super();

        const template = $('window-template');
        this.attachShadow({ mode: 'open' }).append(
            template.content.cloneNode(true),
        );

        const root = this.shadowRoot;
        const box = (this.box = $('windowBox', root));
        const bar = $('titleBar', root);
        const close = $('closeBtn', root);
        let drag = null;

        bar.style.touchAction = 'none';
        bar.style.userSelect = 'none';

        bar.addEventListener('pointerdown', (e) => {
            if (
                e.target.closest('#closeBtn') ||
                (e.pointerType === 'mouse' && e.button !== 0)
            )
                return;

            drag = {
                id: e.pointerId,
                x: e.clientX,
                y: e.clientY,
                left: box.offsetLeft,
                top: box.offsetTop,
            };

            bar.setPointerCapture(e.pointerId);
        });

        bar.addEventListener('pointermove', (e) => {
            if (!drag || e.pointerId !== drag.id) return;

            const maxX = Math.max(0, innerWidth - box.offsetWidth);
            const maxY = Math.max(0, innerHeight - box.offsetHeight);

            box.style.left = `${Math.min(
                maxX,
                Math.max(0, drag.left + e.clientX - drag.x),
            )}px`;
            box.style.top = `${Math.min(
                maxY,
                Math.max(0, drag.top + e.clientY - drag.y),
            )}px`;
        });

        const stopDrag = (e) => {
            if (drag?.id === e.pointerId) drag = null;
        };

        bar.addEventListener('pointerup', stopDrag);
        bar.addEventListener('pointercancel', stopDrag);

        close.addEventListener('click', () => {
            this.style.display = 'none';
        });
    }

    connectedCallback() {
        if (this.positioned) return;
        this.positioned = true;
        placeWindow(this.box);
    }

    attributeChangedCallback(name, oldValue, value) {
        if (name === 'icon' && value) {
            $('window-icon', this.shadowRoot).src = value;
        }
    }
}

customElements.define('cool-window', CoolWindow);

async function loadTrack() {
    try {
        const response = await fetch(
            'https://lastfm-last-played.biancarosa.com.br/tyemil/latest-song',
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const { track } = await response.json();

        $('track-cover').src = track.image?.[1]?.['#text'] || '';
        $('track-artist').textContent = track.artist?.['#text'] || '';
        $('track-name').textContent = track.name || '';
    } catch (error) {
        console.error('Could not load the latest track:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTrack();

    const badgesEl = $('badges');
    const fragment = document.createDocumentFragment();

    badges.forEach((name, i) => {
        const img = document.createElement('img');
        img.src = createBadge(name);
        img.alt = name;
        fragment.append(img);

        if ((i + 1) % 3 === 0) fragment.append(document.createElement('br'));
    });

    badgesEl.append(fragment);

    document.querySelectorAll('[id^="app-"]').forEach((app) => {
        app.addEventListener('click', () => {
            const win = $(`window-${app.id.slice(4)}`);
            const box = win?.shadowRoot && $('windowBox', win.shadowRoot);
            if (!box) return;

            placeWindow(box);
        });
    });
});

document.querySelectorAll('#username .border-text').forEach((track) => {
    const text = track.textContent.trim();
    track.replaceChildren(
        ...Array.from({ length: 2 }, (_, i) => {
            const copy = document.createElement('span');
            copy.className = 'marquee-copy';
            copy.textContent = text;

            if (i) copy.setAttribute('aria-hidden', 'true');
            return copy;
        }),
    );
});
