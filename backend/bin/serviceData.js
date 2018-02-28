var Parser = require("./parser");

let Main = function () {
    this.objectParser = new Parser();
    this.init();
}

Main.prototype.init = function () {
    let self = this;
    setInterval(function () {
        self.objectParser = new Parser();
    }, 10 * 60 * 1000);
};

Main.prototype.getObjectParser = function () {
    return this.objectParser;
}

module.exports = Main;