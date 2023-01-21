var checkWord = require('check-if-word');
words = checkWord('en');

function checkIfWord(word) {
    return words.check(word);
}