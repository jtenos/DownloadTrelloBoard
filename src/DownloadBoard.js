const fileName = "zzzzzz.json";

const fs = require("fs");

getFileContents(fileName).then((txt) => {
	const info = JSON.parse(txt);
	info.cards.forEach((c) => {
		const id = c.id
		const attachments = c.attachments
		console.log(`Card ID: ${id}`)
		console.log('Attachments:')
		attachments.forEach((a) => {
			console.log(`  ${a.url}`)
		})
	});
});

function getFileContents(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, "utf8", (err, txt) => {
			if (err) {
				reject(err);
			} else {
				resolve(txt);
			}
		});
	});
}
