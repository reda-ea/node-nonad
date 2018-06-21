
var nonad = require('../src');

function add(x, y) {
    return x + y;
}

function divide(x, y) {
    if(!y)
        throw new Error('divide by zero');
    console.log('divide by non zero');
    return x / y;
}

var Maybe = nonad.define(function(unpacked) {
    return {
        error: null,
        value: unpacked,
    };
}, function(packed) {
    if(packed.error)
        throw packed.error;
    return packed.value;
}, function(cb, packed, pack, unpack) {
    if(packed.error)
        return packed;
    try {
        return pack(cb(unpack(packed)));
    } catch(e) {
        return {
            error: e,
            value: unpack(packed),
        };
    }
});

var Logged = nonad.define(function(unpacked) {
    return {
        messages: [],
        value: unpacked,
    };
}, function(packed) {
    packed.messages.forEach(function(msg) {
        console.log(msg);
    });
    return packed.value;
}, function(cb, packed, pack, unpack) {
    var messages = packed.messages;
    var consolelog = console.log;
    console.log = function(msg) {
        messages = messages.concat(msg);
    };
    var value = cb(packed.value);
    console.log = consolelog;
    return {
        messages: messages,
        value: value,
    };

});

var x = nonad.bind(divide)(Logged(5), Maybe(2));

var y = nonad.bind(divide)(Maybe(3), nonad.bind(add)(5, -5));

var z = nonad.bind(add)(x, y);


console.log('unpacking');
console.log(nonad.unpack(x));
// console.log(nonad.unpack(y));
console.log(nonad.unpack(z));
