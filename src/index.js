
var define = function(pack, unpack, apply) {
    return function(unpacked) {
        var packed = pack(unpacked);
        packed.__nonad__ = {
            pack: pack,
            unpack: unpack,
            apply: apply,
        };
        return packed;
    };
};

var unpack = function(packed) {
    if(!packed.__nonad__)
        return packed;
    var nonad = packed.__nonad__;
    delete packed.__nonad__;
    return unpack(nonad.unpack(packed));
};

var bind = function(fn, self) {
    return function() {
        var applyfn = function(args) {
            var foundIndex = args.reduce(function(found, arg, index) {
                if(found == -1 && arg.__nonad__)
                    return index;
                return found;
            }, -1);
            if(!~foundIndex)
                return fn.apply(self, args);
            var foundArg = args[foundIndex];
            var foundNonad = foundArg.__nonad__;
            delete foundArg.__nonad__;
            // NOT Function.prototype.apply
            var output = foundNonad['apply'](function(unpacked) {
                return applyfn([].concat(
                    args.slice(0, foundIndex),
                    [unpacked],
                    args.slice(foundIndex+1, args.length)
                ));
            }, foundArg, foundNonad.pack, foundNonad.unpack);
            foundArg.__nonad__ = foundNonad;
            output.__nonad__ = foundNonad;
            return output;
        };
        return applyfn([].slice.call(arguments));
    };
};


module.exports = function() {

};
module.exports.define = define;
module.exports.bind = bind;
module.exports.unpack = unpack;
