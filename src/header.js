/**
*
* SciLite,
* A scientific computing environment similar to Octave/Matlab in pure JavaScript
* @version: @@VERSION@@
* @@DATE@@
* https://github.com/foo123/SciLite
*
**/
!function(root, name, factory) {
"use strict";
if (('object'===typeof module)&&module.exports) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if (('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/) /* AMD */
    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});
else if (!(name in root)) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];});
}(/* current root */          'undefined' !== typeof self ? self : this,
  /* module name */           "SciLite",
  /* module factory */        function ModuleFactory__$(undef) {
"use strict";

var decimal = null,
    complex = null,
    stdMath = Math,
    realMath = {},
    complexMath = {},
    ze, i,
    pi = stdMath.PI,
    e = stdMath.E,
    log_10 = stdMath.log(10),
    log_2 = stdMath.log(2),
    inf = Infinity,
    nan = NaN,
    eps = 1e-15,
    realmax = Number.MAX_VALUE,
    realmin = Number.MIN_VALUE,
    intmax = Number.MAX_SAFE_INTEGER,
    intmin = Number.MIN_SAFE_INTEGER,
    bitmax = intmax,
    O = 0, I = 1, J = -1,
    half = 0.5, two = 2, ten = 10,
    sqrt2 = stdMath.SQRT2,
    sqrt1_2 = stdMath.SQRT1_2,
    update = [],
    HAS = Object.prototype.hasOwnProperty,
    toString = Object.prototype.toString,
    is_array = Array.isArray || function(o) {return '[object Array]' === toString.call(o);},
    nop = function() {},

    // lib
    $ = {
        VERSION: "@@VERSION@@",
        // common functions
        _: {},
        // builtin functions
        fn: {},
        // symbolic computation
        sym: {
            fn: {}
        },
        // operators
        op: {},
        // constants
        constant: {
            pi: pi, e: e,
            eps: eps,
            realmax: realmax,
            realmin: realmin,
            intmax: intmax,
            intmin: intmin,
            inf: inf, Inf: inf,
            nan: nan, NaN: nan
        }
    },
    $_ = $._,
    constant = $.constant,
    fn = $.fn
;
