define([
    "underscore"
], function(
    _
) {
    var matchers = [{
        icon: "ambulance",
        words: [ "doctor", "arzt", "orthopädie"]
    }, {
        icon: "birthday-cake",
        words: [ "birthday", "geburtstag" ]
    }, {
        icon: "check-square-o",
        words: [ "test", "prüfung" ]
    }, {
        icon: "eur",
        words: ["bezahlen"]
    }, {
        icon: "eyedropper",
        words: ["labor"]
    }, {
        icon: "glass",
        words: [ "party" ]
    }, {
        icon: "film",
        words: [ "film", "movie", "cinema", "kino"]
    }, {
        icon: "hand-scissors-o",
        words: ["friseur", "frisör"]
    }, {
        icon: "music",
        words: [ "music", "concert", "konzert", "festival" ]
    }, {
        icon: "newspaper-o",
        words: ["papier"]
    }, {
        icon: "spoon",
        words: ["brunch", "essen"]
    }, {
        icon: "suitcase",
        words: [ "visit", "besuch", "ausflug"]
    }, {
        icon: "sun-o",
        words: [ "urlaub", "holiday"]
    }, {
        icon: "tree",
        words: [ "weihnacht", "christmas" ]
    }, {
        icon: "university",
        words: ["schule", "gymnasium", "universität", "school", "univerity"]
    }, {
        icon: "paw",
        words: ["wild"]
    }];

    return function(text) {
        var match,
            text = text.toLowerCase();
        match = _.find(matchers, function(matcher) {
            return _.find(matcher.words, function(word) {
                if (text.match(word)) {
                    return true;
                }
            });
        });
        if (match) {
            return match.icon;
        }
        return "";
    }
});
