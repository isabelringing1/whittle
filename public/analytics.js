function reportWonTodaysPuzzle(puzzleId) {
	gtag("event", "level_end", {
		level_name: puzzleId,
		success: true,
	});
}

function reportFoundEveryWord(puzzleId) {
	gtag("event", "unlock_achievement", {
		achievement_id: puzzleId,
	});
}

export { reportWonTodaysPuzzle, reportFoundEveryWord };
