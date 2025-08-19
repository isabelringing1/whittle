const getDateStringFormatted = (date = null) => {
  if (date == null) {
    date = new Date();
  }
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return month + " " + day + nth(day) + ", " + year;
};

const getDateString = (date = null) => {
  if (date == null) {
    date = new Date();
  }
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return month + "/" + day + "/" + year;
};

const getStatusClassName = (percentComplete, hasStarted = true) => {
  if (percentComplete == 0 || !hasStarted) {
    return "not-started";
  } else if (percentComplete > 0 && percentComplete < 50) {
    return "low";
  } else if (percentComplete >= 50 && percentComplete < 80) {
    return "medium";
  } else if (percentComplete >= 80 && percentComplete < 100) {
    return "high";
  } else if (percentComplete >= 100) {
    return "complete";
  }
};

const nth = (d) => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const getMovesLength = (moves) =>
  moves.filter(function (move) {
    return move != "hint";
  }).length;

const copyStats = (moves, isPerfect, number, tomorrow = false) => {
  var moveString = "";
  for (var i = 0; i < moves.length; i++) {
    if (moves[i] == "combo") {
      moveString += "🟣";
    } else if (moves[i] == "success") {
      moveString += "🟢";
    } else if (moves[i] == "fail") {
      moveString += "🔴";
    } else if (moves[i] == "hint") {
      moveString += "💡";
    }
  }
  if (isPerfect) {
    moveString = "⭐️" + moveString + "⭐️";
  }
  var text = "Whittle #" + number + ": " + moveString;
  if (tomorrow) {
    text = "🅱️hittle #" + number + ": " + moveString;
  }
  navigator.share({
    text: text,
    url: window.location.href,
  });
};

const generatePossibleWords = (
  phrase,
  allPossibleWords,
  flagCombos = false
) => {
  var validPhrases = [phrase];
  var newPossibleWords = {};
  var phrasesSeen = {};
  var words = phrase.split(" ");
  for (var i = 0; i < words.length; i++) {
    newPossibleWords[words[i]] = true;
  }

  while (validPhrases.length > 0) {
    var phrase = validPhrases[validPhrases.length - 1];
    validPhrases.pop();
    for (var i = 0; i < phrase.length; i++) {
      var removedSpace = phrase[i] == " ";
      var newPhrase = phrase.slice(0, i) + phrase.slice(i + 1);
      var words = newPhrase.split(" ");
      if (areValidWords(words, allPossibleWords)) {
        for (var j = 0; j < words.length; j++) {
          if (!(words[j] in newPossibleWords) && words[j].length > 0) {
            if (removedSpace && flagCombos) {
              newPossibleWords["*" + words[j]] = true;
            } else {
              newPossibleWords[words[j]] = true;
            }
          }
        }
        if (!(newPhrase in phrasesSeen)) {
          validPhrases.push(newPhrase);
          phrasesSeen[newPhrase] = true;
        }
      }
    }
  }
  return newPossibleWords;
};

const areValidWords = (words, allPossibleWords) => {
  for (var i = 0; i < words.length; i++) {
    if (!(words[i] in allPossibleWords) && words[i].length > 0) {
      return false;
    }
  }
  return true;
};

export {
  getDateString,
  getDateStringFormatted,
  getStatusClassName,
  copyStats,
  generatePossibleWords,
  areValidWords,
  getMovesLength,
};
