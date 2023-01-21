var checkWord = require('check-if-word');
var words = checkWord('en');

export function checkIfWord(word) {
    return words.check(word);
}