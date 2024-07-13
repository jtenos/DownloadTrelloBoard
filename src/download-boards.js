const boardFileNames = []
const attachmentFileNames = []

async function downloadBoards() {
	const boardUrls = new Map();

	document.querySelectorAll("a.board-tile").forEach((elem) => {
		const hrefFields = elem.href.split("/");
		const boardID = hrefFields[4];
		const boardName = hrefFields[5];
		boardUrls.set(boardName, `https://trello.com/b/${boardID}.json`);
	});

	for (let [title, boardUrl] of boardUrls) {
		const boardFileName = `${title}.json`;
		boardFileNames.push(boardFileName)
		console.log(
			`Downloading board ${title} from ${boardUrl} to ${boardFileName}`
		);
		boardJSON = await tryDownloadFile(null, () => boardUrl, boardFileName);
		await downloadBoardAttachments(boardJSON, title);
	}
}

function downloadBoardAttachments(boardJSON, boardTitle) {
	return new Promise(resolve => {
		const reader = new FileReader();
		reader.onload = async function () {
			const boardData = JSON.parse(reader.result);
			for (let card of boardData.cards) {
				try {
					const cardID = card.id;
					for (let attachment of card.attachments.filter(a => a.isUpload)) {
						const attachmentFileName = attachment.fileName;
						const attachmentUrl = attachment.url;
						console.log(
							`Downloading attachment ${attachmentFileName} from ${attachmentUrl}`
						);
						const downloadFileName = `${boardTitle}__${cardID}__${attachmentFileName}`
						attachmentFileNames.push(downloadFileName)
						await tryDownloadFile(
							null,
							() => attachmentUrl,
							downloadFileName
						);
					}
				} catch (ex) {
					console.error(ex);
				}
			}
			resolve()
		};
		reader.readAsText(boardJSON);
	})
}

function waitFor100Ms() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 100);
	});
}

async function tryDownloadFile(data, getUrlFromData, fileName) {

	console.log('Waiting...')
	await waitFor100Ms()
	console.log('Waiting done')

	try {
		const fileUrl = getUrlFromData(data);
		const result = await fetch(fileUrl);
		const blob = await result.blob();
		const dataUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = dataUrl;
		a.download = fileName;
		a.click();
		return blob;
	} catch (ex) {
		console.error(ex);
	}
}

await downloadBoards();

console.log(`You should have ${boardFileNames.length} board files and ${attachmentFileNames.length} attachment files now.`)
