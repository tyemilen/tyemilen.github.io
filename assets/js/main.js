document.addEventListener('DOMContentLoaded', () => {
	const originalTitle = document.title;
	const letters = originalTitle.split('');

	let index = 1;

	document.title = letters[0];
	function updateTitle() {
		document.title += letters[index] == ' ' ? letters[index] + ' ' : letters[index];

		if (index >= letters.length) {
			index = 1;
			document.title = letters[0];
		} else {
			++index;
		}
	}

	intervalId = setInterval(updateTitle, 300);
});