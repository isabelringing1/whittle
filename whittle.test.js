const fs = require("fs");
const path = require("path");

test("all puzzles are solvable", async () => {
  const file1 = path.join(__dirname, "./", "public/data/puzzles.txt");
  const puzzleText = fs.readFileSync(file1, "utf8", function (err, data) {
    return data;
  });

  var dailyPuzzles = puzzleText.split("\n");
  var dailyPuzzleDict = {};
  for (var i = 0; i < dailyPuzzles.length; i++) {
    var tokens = dailyPuzzles[i].split(",");
    dailyPuzzleDict[tokens[0]] = {
      startingPhrase: tokens[1],
      number: i + 1,
    };
  }

  const file2 = path.join(__dirname, "./", "public/data/wl.txt");
  const wordsText = fs.readFileSync(file2, "utf8", function (err, data) {
    return data;
  });

  var words = wordsText.split("\n");
  var allPossibleWords = {};
  words.forEach((word) => {
    allPossibleWords[word] = true;
  });

  var allPhrasesAreWhittleable = true;
  for (var i = 0; i < Object.keys(dailyPuzzleDict).length; i++) {
    var id = Object.keys(dailyPuzzleDict)[i];
    var phrase = dailyPuzzleDict[id].startingPhrase;
    var phrasesToCheck = [phrase];
    var whittleable = false;

    while (phrasesToCheck.length > 0 && !whittleable) {
      var phrase = phrasesToCheck[phrasesToCheck.length - 1];
      phrasesToCheck.pop();
      for (var j = 0; j < phrase.length; j++) {
        var newPhrase = phrase.slice(0, j) + phrase.slice(j + 1);
        var words = newPhrase.split(" ");
        if (areValidWords(words, allPossibleWords)) {
          if (newPhrase.length == 1) {
            whittleable = true;
          } else {
            phrasesToCheck.push(newPhrase);
          }
        }
      }
    }

    if (!whittleable) {
      console.error(
        "Could not find a valid whittle for " +
          dailyPuzzleDict[id].startingPhrase
      );
      allPhrasesAreWhittleable = false;
      break;
    }
  }

  expect(allPhrasesAreWhittleable).toBe(true);
});

const areValidWords = (words, allPossibleWords) => {
  for (var i = 0; i < words.length; i++) {
    if (!(words[i] in allPossibleWords) && words[i].length > 0) {
      return false;
    }
  }
  return true;
};

test("no repeats", async () => {
  var dupeFound = false;
  const file1 = path.join(__dirname, "./", "public/data/puzzles.txt");
  const puzzleText = fs.readFileSync(file1, "utf8", function (err, data) {
    return data;
  });

  var dailyPuzzles = puzzleText.split("\n");
  var startingPhraseDict = {};
  for (var i = 0; i < dailyPuzzles.length; i++) {
    var tokens = dailyPuzzles[i].split(",");
    if (tokens[1] in startingPhraseDict) {
      dupeFound = true;
      break;
    }
    startingPhraseDict[tokens[1]] = true;
  }
  expect(dupeFound).toBe(false);
});
