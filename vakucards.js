/*
vaku-cards.js
Copyright (c) 2021, B. Zoltán Gorza (ae-dschorsaanjo)

This code is under the BSD 2-clause (or "Simplified BSD") license.
For further information see the LICENSE file or visit
https://opensource.org/licenses/BSD-2-Clause.
*/

class VakuCard {
    _front = 'Vaku';
    _back = 'Cards';
    _answer = 'Flash';
    _frontFacing = true;

    /**
     * 
     * @param {string} front Front of the card (e.g. word)
     * @param {string} back Back of the card (e.g. definition)
     * @param {string} answer Possible answer if it's a quiz (e.g. short definition)
     * @param {boolean} backFirst Shows the back side first, effectively switching the roles.
     */
    constructor(front, back, answer = "", backFirst = false) {
        this._front = front;
        this._back = back;
        this._answer = answer;
        this._frontFacing = !backFirst;
    }

    /**
     * @returns The currently facing side as string.
     */
    show() {
        return this._frontFacing ? this._front : this._back;
    }

    /**
     * "Flips" which side of the card shows and then shows it.
     * @returns The currently facing side as string.
     */
    flip() {
        this._frontFacing = !this._frontFacing;
        return this.show()
    }

    /**
     * Regardless of which side is facing, it'll always set the card to
     * show the front side.
     */
    flipToFront() {
        this._frontFacing = true;
        return this._front;
    }

    /**
     * Regardless of which side is facing, it'll always set the card to
     * show the back side.
     */
    flipToBack() {
        this._frontFacing = false;
        return this._back;
    }

    get front() {
        return this._front;
    }

    get back() {
        return this._back;
    }

    get answer() {
        return this._answer || this._back;
    }

    // probably flip() will do this.
    // flipAndShow() {
    //     this.flip();
    //     return this.show();
    // }
}

const VakuGameSettings = Object.seal({
    numberOfCards: 1,
    numberOfAnswers: 2,
    backFirst: false,
    reset: function() {
        this.numberOfCards = 1;
        this.numberOfAnswers = 2;
        this.backFirst = false;
    }
});

/**
 * The deck's mode that also defines "game mode".
 * If the numerical value of choice is odd, the deck will be shuffled
 * and original order of declaration will not be honored.
 * If the number is lower than 6 then game mode is quiz, while if it's
 * greater of equal, then it's just regular flashcards.
 * If the number mod 7 equals 6 equals 0 or 1, then the size is fixed and
 * the number of used cards should be read from GameSettings.
 */
const VakuDeckMode = Object.freeze({
    FIXED_QUIZ: 0,
    FIXED_QUIZ_SHUFFLE: 1,
    FULL_QUIZ: 2,
    FULL_QUIZ_SHUFFLE: 3,
    UNTIL_QUIZ: 4,
    UNTIL_QUIZ_SHUFFLE: 5,
    FIXED: 6,
    FIXED_SHUFFLE: 7,
    FULL: 8,
    FULL_SHUFFLE: 9,
    valueToString: function(n) {
        let s = Object.keys(this).find(key => this[key] === n);
        return s[0].toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, " ");
    },
    toList: function() {
        return Object.keys(this).map(k => k[0].toUpperCase() + k.slice(1).toLowerCase().replace(/_/g, " "));
    }
});

class VakuDeck {
    _origCards = [];
    _cards = [];
    _mode = -1;
    _idx = 0;
    _isLast = false;
    _isFirst = true;

    constructor(mode, cards) {
        this._mode = mode;
        this._origCards = cards;
        this._init();
    }

    /**
     * Returns the next card (or stays at current if current is last).
     */
    get next() {
        const len = this._cards.length;
        this._isFirst = false;
        if (this._idx >= len - 2) {
            this._isLast = true;
        }
        if (this._idx < len - 1)
            return this._cards[++this._idx];
        else
            return this._cards[this._idx];
    }

    /**
     * Returns the current card.
     */
    get current() {
        return this._cards[this._idx];
    }

    /**
     * Return the previous card (or stays at current if current is first).
     */
    get previous() {
        this._isLast = false;
        if (this._idx < 2) {
            this._isFirst = true;
        }
        if (this._idx > 0)
            return this._cards[--this._idx];
        else
            return this._cards[this._idx];
    }

    get isFirst() {
        return this._isFirst;
    }

    get isLast() {
        return this._isLast;
    }

    get isQuiz() {
        return this._mode % 2;
    }

    get length() {
        return this._cards.length;
    }

    get mode() {
        return this._mode;
    }

    _init() {
        this._cards = [...this._origCards];
        if (this.isQuiz) {
            this._bogo(this._cards);
        }
        if (this._mode % 6 < 2) {
            this._cards.slice(0, VakuGameSettings.numberOfCards);
        }
        this._idx = 0;
        this._isLast = false;
        this._isFirst = true;
    }

    _bogo(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const k = Math.floor(Math.random() * (i + 1));
            [a[i], a[k]] = [a[k], a[i]];
        }
    }

    getAnswers() {
        const n = Math.min(this._cards.length, VakuGameSettings.numberOfAnswers);
        const a = [this.current.answer];
        let i = 0;
        while (a.length < n) {
            i = Math.floor(Math.random() * (this.length));
            if (i != this._idx) a.push(this._cards[i].answer);
        }
    }

    isRightAnswer(answer) {
        return this.current.answer == answer;
    }

    /**
     * Resets the deck (using same configuration).
     */
    reset() {
        this._init();
    }
}

class VakuParser {

}

class VakuGame {
    _deck;

    constructor(mode, cards) {
        if (Object.values(VakuDeckMode).includes(mode)) {
            this._mode = mode;
        }
        else {
            throw "Selected mode is not valid."
        }
        if (cards.length < 2) {
            throw "You need to have at least 2 cards.";
        }
        this._deck = new VakuDeck(mode, cards);
    }

    get modeString() {
        return VakuDeckMode.valueToString(this._deck.mode);
    }
}
    
let v = new VakuGame(VakuDeckMode.FULL_QUIZ_SHUFFLE, [new VakuCard('a', 'b'), new VakuCard('c', 'd')]);
console.log(v.modeString);


/*
 * NOTES (to self):
 * Cards supply the actual strings, Deck handles cards, supplies them, and also
 * supplies the multiple answers and checks provided answers, if the gamemode demands.
 * TODO write Game class or similar to handle actual game needs
 * 
 * (namely to provide game loop and handle GUI, incl. building, events and deconstructing within container).
 */