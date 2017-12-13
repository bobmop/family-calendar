define([
    "underscore"
], function(
    _
) {
    var matchers = [{
        icon: "ambulance",
        words: [ "doctor", "arzt"]
    }, {
        icon: "birthday-cake",
        words: [ "birthday", "geburtstag" ]
    }, {
        icon: "check-square-o",
        words: [ "test", "prüfung" ]
    }, {
        icon: "glass",
        words: [ "party" ]
    }, {
        icon: "film",
        words: [ "film", "movie", "cinema", "kino"]
    }, {
        icon: "music",
        words: [ "music", "concert", "konzert", "festival" ]
    }, {
        icon: "suitcase",
        words: [ "visit", "besuch" ]
    }, {
        icon: "sun-o",
        words: [ "urlaub", "holiday"]
    }, {
        icon: "tree",
        words: [ "weihnacht", "christmas" ]
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
