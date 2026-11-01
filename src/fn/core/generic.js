// generic functions
fn.clc = nop;
fn.disp = nop;
fn.clear = nop;
fn.help = nop;
fn.who = nop;
fn.whos = nop;
fn.exist = nop;
fn.warning = function(msg) {
    if (msg.length) console.warn('Warning: '+ (1 < arguments.length && fn.sprintf ? fn.sprintf.apply(null, [].slice.call(arguments)) : msg));
};
fn.error = function(msg) {
    throw new Error(1 < arguments.length && fn.sprintf ? fn.sprintf.apply(null, [].slice.call(arguments)) : (msg || 'error'));
};
fn.tofixed = function(x, d) {
    return is_num(x) ? x.toFixed(_(d || 32)) : x;
};
fn.toexponential = function(x) {
    return is_num(x) ? x.toExponential() : x;
};
