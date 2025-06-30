function reportWonTodaysPuzzle(puzzleId, isDaily) {
	gtag("event", "level_end", {
		level_name: puzzleId,
		success: isDaily,
	});
}

function reportFoundEveryWord(puzzleId) {
	gtag("event", "unlock_achievement", {
		achievement_id: puzzleId,
	});
}

export { reportWonTodaysPuzzle, reportFoundEveryWord };
