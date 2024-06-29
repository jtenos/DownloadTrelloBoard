// Execute board-urls.js in the console first, which populates the boardUrls variable
// Should look like this:
const boardUrls = new Map()
boardUrls.set('First list name', 'https://trello.com/b/whatever.json')
boardUrls.set('Second list name', 'https://trello.com/b/whatever.json')


function writeFile(fileName, txt) {
	// This runs in a browser
	return new Promise((resolve, reject) => {
		const blob = new Blob([txt], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		a.click();
		resolve();
	});
}

function downloadFile(url, fileName) {
	// This runs in a browser
	return fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const txt = JSON.stringify(data, null, 2);
			return writeFile(fileName, txt);
		});
}

for (let [title, url] of boardUrls) {
	const fileName = `${title}.json`;
	downloadFile(url, fileName).then(() => {
		console.log(`Downloaded ${title}`);
	})
}
