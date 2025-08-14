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

function reportHint(puzzleId) {
  gtag("event", "spend_virtual_currency", {
    item_name: puzzleId,
  });
}

export { reportWonTodaysPuzzle, reportFoundEveryWord, reportHint };
