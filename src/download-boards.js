const boardUrls = new Map()

document.querySelectorAll('a.board-tile').forEach(elem => {
	const hrefFields = elem.href.split('/')
	const boardID = hrefFields[4];
	const boardName = hrefFields[5]
	boardUrls.set(boardName, `https://trello.com/b/${boardID}.json`)
})

function writeFile(fileName, txt) {
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
