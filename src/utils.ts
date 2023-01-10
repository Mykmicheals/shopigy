export var generateToken = function () {
    var token = Math.random().toString(36).slice(2); // remove `0.`
    return (token + token)
};