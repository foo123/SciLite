(function() {
"use strict";

const $ = require('./SciLite.js');

// optionally use arbitrary precision arithmetic via Decimal
$._.decimal(require('./decimal.js'));

let ctx = null;

// extend with plugins
$.fn.exist = function(variable) {
    return ctx && $._.exist(variable, ctx) ? 1 : 0;
};
$.fn.clear = function() {
    ctx = null;
};
$.fn.eval = async function(code) {
    if (null == ctx) ctx = $._.createContext();
    return await $._.eval(code, ctx, 1, 1);
};
$._.MAXPRINTSIZE = 10;

const repl = require('repl').start({
    prompt: '>> ',
    writer: function(ans) {
        return null != ans ? $._.str(ans) : '';
    },
    eval: function(code, context, replResourceName, cb) {
        code = String(code).trim();
        if (!code.length) return cb(null, null);
        if (null == ctx) ctx = $._.createContext();
        $._.eval(code, ctx, 1, 1).then(ans => cb(null, ans)).catch(err => cb(err.toString(), ''));
    }
});
repl.on('reset', function() {
    ctx = null;
});

})();