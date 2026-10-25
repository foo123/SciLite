/**
*
* SciLite,
* A scientific computing environment similar to Octave/Matlab/SciPy in pure JavaScript
* @version: 0.12.0
* 2026-10-25 23:28:10
* https://github.com/foo123/SciLite
*
**//**
*
* SciLite,
* A scientific computing environment similar to Octave/Matlab/SciPy in pure JavaScript
* @version: 0.12.0
* 2026-10-25 23:28:10
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

var tensorview = null,
    decimal = null,
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
    KEYS = Object.keys,
    is_array = Array.isArray || function(o) {return '[object Array]' === toString.call(o);},
    nop = function() {},
    variable = null,
    expr = null,

    // lib
    $ = {
        VERSION: "0.12.0",
        // common functions
        _: {},
        // builtin functions
        fn: {},
        // user-defined functions
        "@fn": {},
        // symbolic computation
        sym: {
            fn: {}
        },
        // operators
        op: {},
        // constants
        constant: {
            __version__: "0.12.0",
            pi: pi, e: e,
            eps: eps,
            realmax: realmax,
            realmin: realmin,
            intmax: intmax,
            intmin: intmin,
            inf: inf, Inf: inf,
            nan: nan, NaN: nan,
            "true": I, "false": O,
            on: "on", off: "off",
            "0": O, "1": I, "-1": J,
            "1/2": half, "2": two, "10": ten
        }
    },
    $_ = $._,
    constant = $.constant,
    fn = $.fn
;
// nd-array support via TensorView
$_.tensorview = function(TensorView) {
    if ("function" === typeof TensorView)
    {
        tensorview = TensorView;
    }
};

// arbitrary precision arithmetic
$_.decimal = function(Decimal) {
    if ("function" === typeof Decimal)
    {
        decimal = Decimal;
        if (!HAS.call(decimal.prototype, '_valueof'))
        {
            // add some needed methods
            decimal.prototype._valueof = null;
            decimal.prototype.$valueOf = function() {
                if (null == this._valueof)
                {
                    this._valueof = parseFloat(this.toFixed(9));
                }
                return this._valueof;
            };
            decimal.prototype.sign = function() {
                return decimal.sign(this);
            };
        }
        O = decimal(0);
        I = decimal(1);
        J = decimal(-1);
        half = decimal(0.5);
        two = decimal(2);
        ten = decimal(10);
        log_10 = decimal(stdMath.log(10));
        log_2 = decimal(stdMath.log(2));
        sqrt2 = decimal(stdMath.SQRT2);
        sqrt1_2 = decimal(stdMath.SQRT1_2);
        constant.eps = decimal(eps);
        constant.pi = decimal(pi);
        constant.e = decimal(e);
        constant.realmax = decimal(realmax);
        constant.realmin = decimal(realmin);
        constant.intmax = decimal(intmax);
        constant.intmin = decimal(intmin);
        constant.bitmax = decimal(bitmax);
    }
    else
    {
        decimal = null;
        O = 0;
        I = 1;
        J = -1;
        half = 0.5;
        two = 2;
        ten = 10;
        log_2 = stdMath.log(2);
        log_10 = stdMath.log(10);
        sqrt2 = stdMath.SQRT2;
        sqrt1_2 = stdMath.SQRT1_2;
        constant.eps = eps;
        constant.pi = pi;
        constant.e = e;
        constant.realmax = realmax;
        constant.realmin = realmin;
        constant.intmax = intmax;
        constant.intmin = intmin;
        constant.bitmax = bitmax;
    }
    constant["true"] = I;
    constant["false"] = O;
    constant["0"] = O;
    constant["1"] = I;
    constant["-1"] = J;
    constant["1/2"] = half;
    constant["2"] = two;
    constant["10"] = ten;
    if (complex)
    {
        i = new complex(O, I);
        ze = new complex(constant.e, O);
        constant["i"] = i;
        constant["j"] = i;
    }
    update.forEach(function(u) {u();});
};

// utils
function not_supported(fn)
{
    throw (String(fn) + ": input(s) not supported");
}
function merge(output, args)
{
    var n = args.length, i, k, o;
    for (i=0; i<n; ++i)
    {
        o = args[i];
        if (is_obj(o))
        {
            for (k in o)
            {
                if (HAS.call(o, k))
                {
                    output[k] = o[k];
                }
            }
        }
    }
    return output;
}
function is_instance(x, C)
{
    return x instanceof C;
}
function is_callable(x)
{
    return "function" === typeof x;
}
$_.is_array = is_array;
function is_obj(x)
{
    return "[object Object]" === toString.call(x);
}
$_.is_obj = is_obj;
function is_string(x)
{
    return "string" === typeof x;
}
$_.is_string = is_string;
function is_nan(x)
{
    return /*(is_complex(x) && (is_nan(x.re) || is_nan(x.im))) ||*/ (is_decimal(x) && x.isNaN()) || (Number.isNaN(x));
}
$_.is_nan = is_nan;
function is_inf(x)
{
    return (is_decimal(x) && !x.isFinite()) || (is_number(x) && !isFinite(x));
}
$_.is_inf = is_inf;
function is_number(x)
{
    return "number" === typeof x;
}
$_.is_number = is_number;
function is_decimal(x)
{
    return (null != decimal) && (x instanceof decimal);
}
$_.is_decimal = is_decimal;
function is_num(x)
{
    return ("number" === typeof x) || ((null != decimal) && (x instanceof decimal));
}
function is_int(x)
{
    return (is_decimal(x) && x.isInt()) || (is_number(x) && Number.isInteger(x));
}
$_.is_int = is_int;
function is_complex(x)
{
    return (null != complex) && (x instanceof complex);
}
$_.is_complex = is_complex;
function is_real(x)
{
    var iscomplex = is_complex(x);
    return (iscomplex && n_eq(O, x.im)) || !iscomplex;
}
$_.is_real = is_real;
function is_scalar(x, strict)
{
    if (is_number(x) || is_complex(x) || is_decimal(x)) return true;
    if (false === strict)
    {
        if (is_vector(x, false) && (1 === x.length)) return true;
        if (is_matrix(x, false) && (1 === x.length) && (1 === x[0].length)) return true;
    }
    return false;
}
$_.is_scalar = is_scalar;
function is_vector(x, no_cell)
{
    if ((null != x) && x.$scilitecell$) return false === no_cell ? (1 === x.$scilitecell$.length) : false;
    return is_array(x) && is_scalar(x[0]);
}
$_.is_vector = is_vector;
function is_matrix(x, no_cell)
{
    if ((null != x) && x.$scilitecell$) return false === no_cell ? (2 === x.$scilitecell$.length) : false;
    return is_array(x) && is_array(x[0]) && is_scalar(x[0][0]);
}
$_.is_matrix = is_matrix;
function is_cell(x)
{
    return is_array(x) && !!x.$scilitecell$;
}
//$_.is_cell = is_cell;
function is_0d(x)
{
    if ((null != x) && x.$scilitecell$) return 1 > x.$scilitecell$.length;
    return !is_array(x);
}
function is_1d(x)
{
    if ((null != x) && x.$scilitecell$) return 1 === x.$scilitecell$.length;
    return is_array(x) && !is_array(x[0]);
}
function is_2d(x, strict)
{
    if ((null != x) && x.$scilitecell$) return true === strict ? (2 === x.$scilitecell$.length) : (1 < x.$scilitecell$.length);
    if (!is_array(x) || !is_array(x[0])) return false;
    return true === strict ? !is_array(x[0][0]) : true;
}
function is_nd(x)
{
    if ((null != x) && x.$scilitecell$) return 2 < x.$scilitecell$.length;
    return is_array(x) && is_array(x[0]) && is_array(x[0][0]);
}
function data_type(x)
{
    if (variable && is_instance(x, variable))
    {
        return 'variable';
    }
    else if (is_string(x))
    {
        return 'string';
    }
    else if (is_scalar(x) || is_nan(x))
    {
        return 'numeric';
    }
    else if (is_array(x))
    {
        if (x.$scilitecell$) return '';
        return x.length ? data_type(x[0]) : '';
    }
    return '';
}
function check_type(type, j, res)
{
   if (j < type.length)
   {
       var typej = type[j];
       if ("c" !== typej)
       {
           if (is_array(res)) type[j] = "c";
           else if (is_string(res)) type[j] = "" === typej || "s" === typej ? "s" : "c";
           else if (is_scalar(res)) type[j] = "" === typej || "n" === typej ? "n" : "c";
           else type[j] = "c";
       }
   }
   return res;
}
function array(n, v)
{
    n = stdMath.max(0, stdMath.round(n));
    var i, arr = new Array(n), callable = is_callable(v);
    for (i=0; i<n; ++i) arr[i] = callable ? v(i, arr) : v;
    return arr;
}
$_.array = array;
function matrix(rows, cols, v)
{
    rows = stdMath.max(0, stdMath.round(rows));
    cols = stdMath.max(0, stdMath.round(cols));
    var r, c, row, mat = new Array(rows), callable = is_callable(v);
    for (r=0; r<rows; ++r)
    {
        mat[r] = row = new Array(cols);
        for (c=0; c<cols; ++c)
        {
            row[c] = callable ? v(r, c, mat) : v;
        }
    }
    return mat;
}
$_.matrix = matrix;
function ndarray(dims, v)
{
    var callable = is_callable(v), dims1 = dims.slice(1);
    return dims.length ? array(dims[0], function(i, ndarr) {
        if (dims.length > 1)
        {
            return ndarray(dims1, function(j) {
                return callable ? v([i].concat(j), ndarr) : v;
            });
        }
        return callable ? v([i], ndarr) : v;
    }) : [];
}
ndarray.indices = function(dims, f) {
    var n = dims.length;
    if (0 < n)
    {
        var i = array(n, 0), d = n-1;
        for (;;)
        {
            f(i);
            while ((0 <= d) && (i[d]+1 >= dims[d])) --d;
            if (0 > d) return;
            ++i[d];
            while (d+1 < n) i[++d] = 0;
        }
    }
};
ndarray.project = function project(x, d, i, j, matchsize, loose) {
    j = j || 0;
    if (is_array(x) && (j < i.length))
    {
        if (':' === i[j]) return x.map(function(xj) {return project(xj, d, i, j+1, matchsize, loose);});

        if ((0 === j) && ('loose' === loose))
        {
            if ((2 === d.length) && (1 === d[0]) && (0 === i[0]) && !is_array(x[0]))
            {
                // handle row-vec and vec as equivalent
                if (('matchsize' === matchsize) && (i[j+1] >= x.length)) throw "dimensions do not match";
                return x[i[j+1]];
            }
            else if ((1 === d.length) && (1 === x.length) && is_1d(x[0]))
            {
                // handle vec and row-vec as equivalent
                if (('matchsize' === matchsize) && (i[j] >= x[0].length)) throw "dimensions do not match";
                return x[0][i[j]];
            }
            else if ((2 === d.length) && (1 === d[1]) && !is_array(x[0]))
            {
                // handle col-vec and vec as equivalent
                if (('matchsize' === matchsize) && (i[j] >= x.length)) throw "dimensions do not match";
                return x[i[j]];
            }
            else if ((1 === d.length) && is_array(x[0]) && (1 === x[0].length))
            {
                // handle vec and col-vec as equivalent
                if (('matchsize' === matchsize) && (i[j] >= x.length)) throw "dimensions do not match";
                return x[i[j]][0];
            }
            else if ((2 === d.length) && (1 === d[0]) && (0 === i[0]) && is_array(x[0]) && (1 === x[0].length))
            {
                // handle row-vec and col-vec as equivalent
                if (('matchsize' === matchsize) && (i[j+1] >= x.length)) throw "dimensions do not match";
                return x[i[j+1]][0];
            }
            else if ((2 === d.length) && (1 === d[1]) && (1 === x.length) && is_1d(x[0]))
            {
                // handle col-vec and row-vec as equivalent
                if (('matchsize' === matchsize) && (i[j] >= x[0].length)) throw "dimensions do not match";
                return x[0][i[j]];
            }
        }

        if (('matchsize' === matchsize) && ((i[j] >= x.length) || (j+1 < i.length && !is_array(x[0]))))
        {
            throw "dimensions do not match";
        }

        return project(x[i[j]], d, i, j+1, matchsize, loose);
    }
    return x;
};
ndarray.val = function(a, i, v) {
    var j = 0, n = i.length, aa = a;
    for (;j+1<n;)
    {
        if (!is_array(a) || (i[j] >= a.length)) throw "invalid array or array index";
        a = a[i[j++]];
    }
    if (!is_array(a) || (i[j] >= a.length)) throw "invalid array or array index";
    if (2 < arguments.length) a[i[j]] = v;
    return a[i[j]];
};
$_.ndarray = ndarray;
function cellarray(array, dims)
{
    array.$scilitecell$ = dims || [];
    return array;
}
function rowvec(n, v)
{
    return array(n, v);
}
function vec2row(vec)
{
    if (vec && vec.$scilitecell$)
    {
        return is_0d(vec) ? cellarray([[vec]], [1, 1]) : (is_1d(vec) ? cellarray([vec.map(copy)], [1].concat(vec.$scilitecell$)) : vec);
    }
    else
    {
        return is_0d(vec) ? [[vec]] : (is_1d(vec) ? [vec] : vec);
    }
}
fn.rowvec = vec2row;
function colvec(n, v)
{
    return matrix(n, 1, v);
}
function vec2col(vec)
{
    if (vec && vec.$scilitecell$)
    {
        return is_0d(vec) ? cellarray([[vec]], [1, 1]) : (is_1d(vec) ? cellarray(vec.map(function(vi) {return [vi];}), vec.$scilitecell$.concat(1)) : vec);
    }
    else
    {
        return is_0d(vec) ? [[vec]] : (is_1d(vec) ? vec.map(function(vi) {return [vi];}) : vec);
    }
}
fn.colvec = vec2col;
function sca(x, real)
{
    if (is_num(x))
    {
        return x;
    }
    else if (is_complex(x))
    {
        return real ? x.re : x;
    }
    else if (is_vector(x, false) && (1 === x.length))
    {
        return sca(x[0], real);
    }
    else if (is_matrix(x, false) && (1 === x.length) && (1 === x[0].length))
    {
        return sca(x[0][0], real);
    }
    else if (is_nd(x))
    {
        var sizex = size(x);
        if (arr_eq(sizex, array(sizex.length, 1)))
        {
            return sca(ndarray.project(x, sizex, array(sizex.length, 0)), real);
        }
    }
    return x;
}
$_.sca = sca;
function vec(x)
{
    if (null == x)
    {
        return x;
    }
    else if (/*is_matrix(x)*/is_2d(x, true))
    {
        var xx = null;
        if (1 === ROWS(x)) xx = x[0];
        else if (1 === COLS(x)) xx = x.map(function(xi) {return xi[0];});
        if (xx)
        {
            if (x.$scilitecell$) xx = cellarray(xx === x[0] ? xx.slice() : xx, [xx.length]);
            return xx;
        }
    }
    else if (is_0d(x))
    {
        return [x];
    }
    return x;
}
$_.vec = vec;

function ROWS(mat)
{
    if ((null != mat) && mat.$scilitecell$) return mat.$scilitecell$[0] || 0;
    return mat.length;
}
function COLS(mat)
{
    if ((null != mat) && mat.$scilitecell$) return mat.$scilitecell$[1] || 0;
    return mat[0].length;
}
function ROW(mat, i)
{
    return mat[i];
}
function COL(mat, j)
{
    return array(mat.length, function(i) {return mat[i][j];});
}
function _(x)
{
    return ("number" === typeof x) ? x : (is_decimal(x) ? (x.$valueOf()) : (is_complex(x) ? x.valueOf() : x));
}
function __(x)
{
    if (null != decimal)
    {
        if ("number" === typeof x) return decimal(x);
        else if (is_complex(x) && (("number" === typeof x.re) || ("number" === typeof x.im))) return new complex("number" === typeof x.re ? decimal(x.re) : x.re, "number" === typeof x.im ? decimal(x.im) : x.im);
    }
    return x;
}
function tonumber(x)
{
    if (is_array(x)) return x.map(tonumber);
    else if (is_scalar(x)) return _(x);
    return x;
}
$_.tonumber = tonumber;
function todecimal(x)
{
    if (is_array(x)) return x.map(todecimal);
    else if (is_scalar(x)) return __(x);
    return x;
}
$_.todecimal = todecimal;

function copy(x)
{
    if (is_array(x))
    {
        var xx = x.map(copy);
        if (x.$scilitecell$) xx.$scilitecell$ = x.$scilitecell$.slice();
        return xx;
    }
    return x;
}
$_.copy = copy;
function copyobj(o)
{
    return merge({}, [o]);
}
function apply(f, x, iscomplex)
{
    if (is_num(x))
    {
        return f(x);
    }
    if (is_complex(x))
    {
        if (iscomplex) return f(x);
        else if (n_eq(x.im, O)) return f(x.re);
    }
    if (is_array(x))
    {
        return x.map(function(xi) {return apply(f, xi, iscomplex);});
    }
    return x;
}
$_.apply = apply;
function apply2(f, x, y, iscomplex)
{
    if (is_num(x) && is_num(y))
    {
        return f(x, y);
    }
    if (is_scalar(x) && is_scalar(y))
    {
        if (iscomplex) return f(complexify(x), complexify(y));
        else if (is_real(x) && is_real(y)) return f(realify(x), realify(y));
        else return nan;
    }
    if (is_array(x) && is_array(y))
    {
        return x.map(function(xi, i) {return apply2(f, xi, y[i], iscomplex);});
    }
    return nan;
}
$_.apply2 = apply2;
function apply_(f, x, t, nargout)
{
    nargout = nargout || 1;
    var i = 0, n = x.length,
        xa = null, sz = null,
        type = [], promises = [],
        fx_ = null, fx = null;

    function set_(i, res)
    {
        if ((1 < nargout) && is_array(res))
        {
            res = vec(res);
            fx_.forEach(function(fxj, j) {
                if (j < res.length) ndarray.val(fxj, i, check_type(type, j, res[j]));
            });
        }
        else
        {
            ndarray.val(fx_[0], i, check_type(type, 0, res));
        }
    }
    function ret_()
    {
        fx_.forEach(function(fxj, j) {
            if ((xa && xa.$scilitecell$) || ("c" === type[j]))
            {
                fx_[j] = cellarray(fxj, sz.slice());
            }
        });
        return 1 < nargout ? fx_ : (fx_[0]);
    }

    for (; i<n; ++i)
    {
        if (is_array(x[i]) && (!xa || (xa && !xa.$scilitecell$ && x[i].$scilitecell$)))
        {
            xa = x[i];
            if (xa.$scilitecell$) break;
        }
    }

    if (xa)
    {
        // some x is array
        sz = is_1d(xa) ? [xa.length] : size(xa);
        type = array(nargout, "");
        fx_ = array(nargout, function() {return ndarray(sz, null);});
        ndarray.indices(sz, function(i) {
            var res = f.apply(null, x.map(function(xk) {
                xk = ndarray.project(xk, sz, i, 0, 'matchsize', 'loose');
                return t ? t(xk) : xk;
            }));
            if (is_instance(res, Promise))
            {
                promises.push(res.then((function(i) {
                    return function(res) {set_(i, res);}
                ;})(i.slice())));
            }
            else
            {
                set_(i, res);
            }
        });
        fx = promises.length ? Promise.all(promises).then(ret_) : ret_();
    }
    else
    {
        // every x is scalar
        fx = f.apply(null, t ? x.map(function(xk) {return t(xk);}) : x);
    }

    return fx;
}
$_.apply_ = apply_;
function group_apply(type, f, f0, ferr, x, dim, dir)
{
    dir = "reverse" === dir ? "reverse" : "forward";
    var fv, sizex, view, aux, d;
    if (is_scalar(x))
    {
        return "block" === type ? f([x]) : x;
    }
    else if (is_vector(x))
    {
        if ("block" === type)
        {
            return f(x);
        }
        else if ("block-series" === type)
        {
            return f(x);
        }
        else if ("series" === type)
        {
            fv = f0;
            return ("reverse" === dir ? x.slice().reverse() : x).map(function(xi) {
                fv = f(fv, xi);
                return fv;
            });
        }
        else
        {
            return x.reduce(function(fv, xi) {
                return f(fv, xi);
            }, f0);
        }
    }
    else if (is_2d(x))
    {
        sizex = size(x);
        view = tensorview(x, {shape:sizex, ndarray:sizex});
        if (null == dim)
        {
            dim = 2 === sizex.length ? [1] : [(sizex.reduce(function(dim, sz, di) {
                if ((null == dim) && (1 < sz)) dim = di;
                return dim;
            }, null) || 0) + 1];
        }
        if (is_array(dim) && ("all" === dim[0]))
        {
            dim = "all";
        }
        if (is_int(dim))
        {
            dim = [dim];
        }
        if (is_vector(dim))
        {
            dim = dim.map(_);
            if ("block-series" === type)
            {
                d = dim[0]-1;
                aux = {};
                ndarray.indices(sizex.filter(function(_, di) {return d !== di;}), function(i) {
                    var dj = 0;
                    aux[i.join(',')] = f(view.slice(array(sizex.length, function(di) {
                        return d === di ? ':' : (i[dj++]);
                    })).toArray());
                });
                return squeeze(ndarray(sizex, function(i) {
                    return aux[i.slice(0, d).concat(i.slice(d+1)).join(',')][i[d]];
                }));
            }
            if ("series" === type)
            {
                d = dim[0]-1;
                aux = {};
                ndarray.indices(sizex.filter(function(_, di) {return d !== di;}), function(i) {
                    var dj = 0;
                    fv = f0;
                    aux[i.join(',')] = view.slice(array(sizex.length, function(di) {
                        return d === di ? ("reverse" === dir ? '-1:-1:0' : ':') : (i[dj++]);
                    })).map(function(xi) {
                        fv = f(fv, xi);
                        return fv;
                    }).toArray();
                });
                return squeeze(ndarray(sizex, function(i) {
                    return aux[i.slice(0, d).concat(i.slice(d+1)).join(',')][i[d]];
                }));
            }
            aux = array(sizex.length, function(i) {return i+1;}).filter(function(di) {return -1 === dim.indexOf(di);});
            if (aux.length)
            {
                if (sizex.length > 2)
                {
                    return squeeze(ndarray(array(sizex.length, function(di) {return -1 < dim.indexOf(di+1) ? 1 : sizex[di];}), function(i) {
                        if ("block" === type)
                        {
                            return f(view.slice(sizex.map(function(_, di) {
                                return -1 < dim.indexOf(di+1) ? ':' : (i[di]);
                            })).toArray());
                        }
                        else
                        {
                            fv = f0;
                            view.slice(sizex.map(function(_, di) {
                                return -1 < dim.indexOf(di+1) ? ':' : (i[di]);
                            })).forEach(function(xi) {
                                fv = f(fv, xi);
                            });
                            return fv;
                        }
                    }));
                }
                else
                {
                    return squeeze(ndarray(aux.map(function(di) {return sizex[di-1];}), function(i) {
                        var dj = 0;
                        if ("block" === type)
                        {
                            return f(view.slice(sizex.map(function(_, di) {
                                return -1 < dim.indexOf(di+1) ? ':' : (i[dj++]);
                            })).toArray());
                        }
                        else
                        {
                            fv = f0;
                            view.slice(sizex.map(function(_, di) {
                                return -1 < dim.indexOf(di+1) ? ':' : (i[dj++]);
                            })).forEach(function(xi) {
                                fv = f(fv, xi);
                            });
                            return fv;
                        }
                    }));
                }
            }
            else
            {
                dim = "all";
            }
        }
        if ("all" === dim)
        {
            if ("block" === type)
            {
                return f(view.toArray());
            }
            else
            {
                fv = f0;
                view.forEach(function(xi) {
                    fv = f(fv, xi);
                });
                return fv;
            }
        }
    }
    return ferr;
}
$_.group_apply = group_apply;

function roundoff(x, eps)
{
    eps = __(eps);
    if (is_num(eps) && n_gt(eps, O))
    {
        if (is_scalar(x))
        {
            return le(scalar_abs(x), eps) ? O : x;
        }
        else if (is_array(x))
        {
            return x.map(function(xi) {
                return roundoff(xi, eps);
            });
        }
        else
        {
            return x;
        }
    }
    return x;
}

$_.exist = function(variable, ctx) {
    return is_obj(ctx) && is_string(variable) && HAS.call(ctx, variable) ? 1 : 0;
};

function namevalue(defaults)
{
    if (!is_instance(this, namevalue)) return new namevalue(defaults);
    this._ = {};
    if (defaults) this.fill(defaults/*, 'defaults'*/);
}
namevalue.prototype = {
    constructor: namevalue,
    _: null,
    has: function(name) {
        return HAS.call(this._, name);
    },
    get: function(name, default_value) {
        return HAS.call(this._, name) ? this._[name] : default_value;
    },
    set: function(name, value) {
        this._[name] = value;
        return this;
    },
    fill: function(namevalues, mode) {
        var nv = is_instance(namevalues, namevalue) ? namevalues._ : namevalues;
        if (is_obj(nv))
        {
            var _ = this._;
            KEYS(nv).forEach('defaults' === mode ? function(name) {
                if (!HAS.call(_, name)) _[name] = nv[name];
            } : function(name) {
                _[name] = nv[name];
            });
        }
        return this;
    },
    all: function() {
        return KEYS(this._);
    },
    clone: function() {
        var self = this;
        return namevalue(self.all().reduce(function(_, name) {
            _[name] = copy(self._[name]);
            return _;
        }, {}));
    }
};
$_.namevalue = namevalue;

function namevalueargs(f, nv, repeatable)
{
    repeatable = 'repeatable' === repeatable;
    return nv ? function(/*..args*/) {
        var args = [].slice.call(arguments),
            NameValueDefaults = namevalue(KEYS(nv).reduce(function(_, name) {
                _[name] = copy(nv[name]);
                return _;
            }, {})), NameValueArgs,
            NameValueAltArgs, AltBackup,
            i, nexti = -1, a, arg, n;

        for (i=0,n=args.length; i<n; ++i)
        {
            if (is_instance(args[i], namevalue))
            {
                NameValueArgs = args[i]; // Name=Value args present
                break;
            }
        }
        a = args;
        args = [];
        for (i=0,n=a.length; i<n; ++i)
        {
            arg = a[i];
            if (i === nexti)
            {
                nexti = -1;
                continue;
            }
            else if (is_instance(arg, namevalue))
            {
                // Name=Value arguments
                /*NameValueArgs = arg;
                if (NameValueAltArgs)
                {
                    NameValueArgs.fill(NameValueAltArgs, 'defaults');
                    NameValueAltArgs = null;
                }*/
                if (repeatable && (!args.length || (arg !== args[args.length-1])))
                {
                    args.push(arg); // in-place
                }
                continue;
            }
            else if (!NameValueArgs && is_string(arg) && (i+1 < a.length) && NameValueDefaults.has(arg))
            {
                // older alternative "Name",Value argument pairs
                /*if (NameValueArgs)
                {
                    NameValueArgs.set(arg, a[i+1]);
                }
                else
                {*/
                    if (!NameValueAltArgs)
                    {
                        NameValueAltArgs = {};
                        AltBackup = [];
                    }
                    else if (repeatable && HAS.call(NameValueAltArgs, arg))
                    {
                        args.push(namevalue(NameValueAltArgs)); // in-place
                        // assume new namevalue args
                        NameValueAltArgs = {};
                        AltBackup = [];
                    }
                    NameValueAltArgs[arg] = a[i+1];
                    AltBackup.push(arg);
                    AltBackup.push(a[i+1]);
                /*}*/
                nexti = i+1;
                continue;
            }
            if (NameValueAltArgs)
            {
                if (repeatable)
                {
                    args.push(namevalue(NameValueAltArgs)); // in-place
                }
                else
                {
                    // "Name",Value argument pairs are not last, push them back
                    args.push.apply(args, AltBackup);
                }
                NameValueAltArgs = null;
                AltBackup = null;
            }
            args.push(arg);
        }
        AltBackup = null;
        a = null;
        // Name=Value arguments
        if (repeatable)
        {
            if (NameValueAltArgs)
            {
                args.push(namevalue(NameValueAltArgs));
                NameValueAltArgs = null;
            }
            args = args.map(function(arg) {
                if (is_instance(arg, namevalue))
                {
                    arg.fill(NameValueDefaults, 'defaults');
                }
                return arg;
            }); // NameValues args in-place
        }
        else
        {
            if (NameValueAltArgs)
            {
                if (NameValueArgs) NameValueArgs.fill(NameValueAltArgs, 'defaults');
                else NameValueArgs = namevalue(NameValueAltArgs);
            }
            if (NameValueArgs)
            {
                NameValueDefaults.fill(NameValueArgs);
            }
            args.push(NameValueDefaults); // NameValue args last
        }

        return f.apply(null, args);
    } : f;
}
$_.namevalueargs = namevalueargs;

function varargout(f, nargout_default)
{
    if (!is_callable(f))
    {
        if (is_array(f))
        {
            f.$scilitevarargout$ = true;
        }
        return f;
    }
    if (null == nargout_default) nargout_default = 1;
    var f_with_nargout = function(/*..args*/) {
        var args = [].slice.call(arguments), ans;
        args.unshift(nargout_default); // nargout=nargout_default
        ans = f.apply(null, args);
        if (is_instance(ans, Promise))
        {
            ans = ans.then(function(ans) {
                if ((1 < nargout_default) && is_array(ans)) ans.$scilitevarargout$ = true;
                return ans;
            })
        }
        else
        {
            if ((1 < nargout_default) && is_array(ans)) ans.$scilitevarargout$ = true;
        }
        return ans;
    };
    f_with_nargout.nargout = function(nargout) {
        var fnargout = function(/*..args*/) {
            var args = [].slice.call(arguments), ans;
            args.unshift(nargout); // nargout=nargout
            ans = f.apply(null, args);
            if (is_instance(ans, Promise))
            {
                ans = ans.then(function(ans) {
                    if (((1 < nargout) || (1 < nargout_default)) && is_array(ans)) ans.$scilitevarargout$ = true;
                    return ans;
                })
            }
            else
            {
                if (((1 < nargout) || (1 < nargout_default)) && is_array(ans)) ans.$scilitevarargout$ = true;
            }
            return ans;
        };
        fnargout.nargout = f_with_nargout.nargout;
        return fnargout;
    };
    return f_with_nargout;
}
$_.varargout = varargout;

function $fn(name, func)
{
    var fn = null;
    return varargout(async function(nargout /*..args*/) {
        if (!fn)
        {
            // compile it
            var entry = $["@fn"][name];
            await $_.eval(func);
            fn = $["@fn"][name];
            $["@fn"][name] = entry;
        }
        // invoke it
        return await fn.nargout(nargout).apply(null, [].slice.call(arguments, 1));
    });
}
$_.$fn = $fn;

function num2str(x)
{
    if (is_nan(x))
    {
        x = 'nan';
    }
    else if (is_inf(x))
    {
        x = (n_lt(x, O) ? '-' : '') + 'inf';
    }
    else if (is_int(x))
    {
        x = String(x);
    }
    else if (is_num(x))
    {
        var absx = scalar_abs(x);
        x = n_lt(absx, 1e-12) || n_gt(absx, 1e-5) ? (x.toFixed(4).replace(/\.0{4}$/, '')) : String(x);
    }
    else if (is_complex(x))
    {
        x = String(x);
    }
    return x;
}
$_.num2str = num2str;
$_.MAXPRINTSIZE = inf;
function celltexify(x)
{
    if (is_array(x))
    {
        x = (x.$scilitecell$ ? '\\text{cell }' : (x.length ? '\\text{'+data_type(x)+' }' : '')) + size(x).join(' \\times ');
    }
    else if (is_callable(x))
    {
        x = '\\text{function()}';
    }
    else
    {
        x = texify(x);
    }
    return '\\{' +  x + '\\}';
}
function texify(x)
{
    var tex;
    if (null == x)
    {
        // pass
        x = '';
    }
    else if (-1 < [tensorview.cdots, tensorview.vdots, tensorview.ddots].indexOf(x))
    {
        x = x.toTex();
    }
    else if (is_string(x))
    {
        x = '\\mathsf{\\text{"' + x + '"}}';
    }
    else if (is_nan(x))
    {
        x = '\\text{nan}';
    }
    else if (is_num(x))
    {
        x = ([eps,realmax,realmin,intmax,intmin]).reduce(function(v, c) {return v || n_eq(x, c);}, false) ? (String(x).split('e').join('\\text{e}')) : (num2str(x).split('e').join('\\text{e}').split('nan').join('\\text{nan}').split('inf').join('\\text{inf}'));
    }
    else if (is_complex(x))
    {
        x = String(x).split('e').join('\\text{e}').split('nan').join('\\text{nan}').split('inf').join('\\text{inf}');
    }
    else if (is_2d(x))
    {
        // 2d or nd array
        x = tensorview.stringify('tex', x, size(x), x.$scilitecell$ ? celltexify : texify, $_.MAXPRINTSIZE, 1, true, x.$scilitecell$ ? '\\text{cell }' : (x.length ? '\\text{'+data_type(x)+' }' : ''));
    }
    else if (is_array(x))
    {
        tex = x.$scilitecell$ ? celltexify : texify;
        if (x.length > $_.MAXPRINTSIZE)
        {
            x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat(tensorview.cdots).concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
        }
        x = x.map(tex).join(' \\hskip 1em ');
    }
    else if (("object" === typeof x) || ("function" === typeof x))
    {
        // pass
        x = '';
    }
    else
    {
        x = String(x);
    }
    return x;
}
$_.tex = function(x) {
    if (is_array(x))
    {
        if (x.length)
        {
            if (x.$scilitevarargout$)
            {
                x = "\\[" + x.map(texify).join("\\]\n\\[") + "\\]";
            }
            else if (is_array(x[0]))
            {
                x = "\\[" + texify(x) + "\\]";
            }
            else
            {
                var tex = x.$scilitecell$ ? celltexify : texify;
                if (x.length > $_.MAXPRINTSIZE)
                {
                    x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat(tensorview.vdots).concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
                }
                //x = "\\[" + x.map(tex).join(' \\hskip 1em ') + "\\]";
                x = "\\[" + x.map(tex).join("\\]\n\\[") + "\\]";
            }
        }
        else
        {
            x = x.$scilitecell$ ? "\\[" + '\\text{cell }' + size(x).join(' \\times ') + "\\]" : '';
        }
    }
    else
    {
        x = texify(x);
        if (x.length) x = "\\[" + x + "\\]";
    }
    return x;
};
function cellstringify(x)
{
    if (is_array(x))
    {
        x = (x.$scilitecell$ ? 'cell ' : (x.length ? data_type(x)+' ' : '')) + size(x).join("\u00D7");
    }
    else if (is_callable(x))
    {
        x = 'function()';
    }
    else
    {
        x = stringify(x);
    }
    return '{' +  x + '}';
}
function stringify(x)
{
    var str;
    if (null == x)
    {
        // pass
        x = '';
    }
    else if (-1 < [tensorview.cdots, tensorview.vdots, tensorview.ddots].indexOf(x))
    {
        x = x.toString();
    }
    else if (is_string(x))
    {
        // pass
        x = '"' + x + '"';
    }
    else if (is_nan(x))
    {
        x = 'nan';
    }
    else if (is_num(x))
    {
        x = ([eps,realmax,realmin,intmax,intmin]).reduce(function(v, c) {return v || n_eq(x, c);}, false) ? String(x) : num2str(x);
    }
    else if (is_complex(x))
    {
        x = String(x);
    }
    else if (is_2d(x))
    {
        // 2d or nd array
        x = tensorview.stringify('str', x, size(x), x.$scilitecell$ ? cellstringify : stringify, $_.MAXPRINTSIZE, 1, true, x.$scilitecell$ ? 'cell ' : (x.length ? data_type(x)+' ' : ''));
    }
    else if (is_array(x))
    {
        str = x.$scilitecell$ ? cellstringify : stringify;
        if (x.length > $_.MAXPRINTSIZE)
        {
            x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat(tensorview.cdots).concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
        }
        x = x.map(str).join('  ');
    }
    else if (("object" === typeof x) || ("function" === typeof x))
    {
        // pass
        x = '';
    }
    else
    {
        x = String(x);
    }
    return x;
}
$_.str = function(x) {
    if (is_array(x))
    {
        if (x.length)
        {
            if (x.$scilitevarargout$)
            {
                x = x.map(stringify).join("\n\n");
            }
            else if (is_array(x[0]))
            {
                x = stringify(x);
            }
            else
            {
                var str = x.$scilitecell$ ? cellstringify : stringify;
                if (x.length > $_.MAXPRINTSIZE)
                {
                    x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat(tensorview.vdots).concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
                }
                x = x.map(str).join("\n");
            }
        }
        else
        {
            x = x.$scilitecell$ ? 'cell ' + size(x).join("\u00D7") : '';
        }
    }
    else
    {
        x = stringify(x);
    }
    return x;
};
function realify(x)
{
    if (is_array(x)) return x.map(realify);
    else if (is_complex(x)) return n_eq(x.im, O) ? x.re : x;
    return x;
}
function complexify(x)
{
    if (!complex) return x;
    if (is_array(x)) return x.map(complexify);
    else if (is_num(x)) return new complex(__(x), O);
    return x;
}
// primitive numeric ops (overloaded)
function n_eq(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a === b;
        else return b.eq(a);
    }
    return a.eq(b);
}
$_.neq = n_eq;
function n_lt(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a < b;
        else return b.gt(a);
    }
    return a.lt(b);
}
$_.nlt = n_lt;
function n_gt(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a > b;
        else return b.lt(a);
    }
    return a.gt(b);
}
$_.ngt = n_gt;
function n_le(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a <= b;
        else return b.gte(a);
    }
    return a.lte(b);
}
$_.nle = n_le;
function n_ge(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a >= b;
        else return b.lte(a);
    }
    return a.gte(b);
}
$_.nge = n_ge;
function n_add(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a+b;
        else return b.add(a);
    }
    return a.add(b);
}
$_.nadd = n_add;
function n_sub(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a-b;
        else return b.neg().add(a);
    }
    return a.sub(b);
}
$_.nsub = n_sub;
function n_mul(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a*b;
        else return b.mul(a);
    }
    return a.mul(b);
}
$_.nmul = n_mul;
function n_div(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a/b;
        else return decimal(a).div(b);
    }
    return a.div(b);
}
$_.ndiv = n_div;
function n_pow(a, b)
{
    if (is_nan(a) || is_nan(b))
    {
        return nan;
    }
    if (is_number(a))
    {
        if (is_number(b))
        {
            return (0 > a) && !is_int(b) ? (realify((new complex(a)).pow(b))) : (stdMath.pow(a, b));
        }
        else
        {
            return (0 > a) && !is_int(b) ? realify((new complex(decimal(a))).pow(b)) : (decimal(a).pow(b));
        }
    }
    return n_gt(O, a) && !is_int(b) ? realify((new complex(a)).pow(decimal(b))) : a.pow(b);
}
$_.npow = n_pow;
function n_mod(a, b)
{
    if (is_number(a))
    {
        if (is_number(b)) return a % b;
        else return decimal(a).mod(b);
    }
    return a.mod(b);
}
$_.nmod = n_mod;
function n_neg(a)
{
    return is_number(a) ? -a : (a.neg());
}
$_.nneg = n_neg;
function n_inv(a)
{
    return is_number(a) ? 1/a : I.div(a);
}
$_.ninv = n_inv;

function arr_eq(a, b)
{
    if (a.length !== b.length) return 0;
    for (var i=0,n=a.length; i<n; ++i)
    {
        if (!eq(a[i], b[i])) return 0;
    }
    return 1;
}

// numeric ops (overloaded)
function eq(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a === b ? 1 : 0;
        else if (is_scalar(b)) return a === String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return eq(a, bi);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) === b ? 1 : 0;
        else if (is_num(b)) return n_eq(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_eq(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return eq(a, bi);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) === b ? 1 : 0;
        else if (is_num(b)) return n_eq(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return n_eq(a.re, b.re) && n_eq(a.im, b.im) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return eq(a, bi);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return eq(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "eq: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return eq(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "eq: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a[j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if (a.length !== b.length) throw "eq: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return eq(a[i], bi);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return eq(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "eq: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return eq(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "eq: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return eq(a[i][j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "eq: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return eq(a[i], bi);});
        }
    }
    else if (is_nd(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return eq(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "eq: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return eq(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "eq: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return eq(ai, b[i]);});
        }
        else if (is_nd(b))
        {
            if (!arr_eq(size(a), size(b))) throw "eq: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return eq(ai, b[i]);});
        }
    }
    return 0;
}
$_.eq = eq;
function ne(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a === b ? 0 : 1;
        else if (is_scalar(b)) return a === String(b) ? 0 : 1;
        else if (is_vector(b)) return b.map(function(bi) {return ne(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return ne(a, bi);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) === b ? 0 : 1;
        else if (is_num(b)) return n_eq(a, b) ? 0 : 1;
        else if (is_complex(b)) return n_eq(b.re, a) && n_eq(b.im, O) ? 0 : 1;
        else if (is_vector(b)) return b.map(function(bi) {return ne(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return ne(a, bi);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) === b ? 0 : 1;
        else if (is_num(b)) return n_eq(a.re, b) && n_eq(a.im, O) ? 0 : 1;
        else if (is_complex(b)) return n_eq(a.re, b.re) && n_eq(a.im, b.im) ? 0 : 1;
        else if (is_vector(b)) return b.map(function(bi) {return ne(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return ne(a, bi);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return ne(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "ne: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ne(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "ne: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a[j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if (a.length !== b.length) throw "ne: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return ne(a[i], bi);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return ne(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "ne: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return ne(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "ne: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return ne(a[i][j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "ne: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return ne(a[i], bi);});
        }
    }
    else if (is_nd(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return ne(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "ne: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ne(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "ne: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ne(ai, b[i]);});
        }
        else if (is_nd(b))
        {
            if (!arr_eq(size(a), size(b))) throw "ne: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ne(ai, b[i]);});
        }
    }
    return 0;
}
$_.ne = ne;
function lt(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a < b ? 1 : 0;
        else if (is_scalar(b)) return a < String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return lt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return lt(a, bi);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) < b ? 1 : 0;
        else if (is_num(b)) return n_lt(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_lt(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return lt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return lt(a, bi);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) < b ? 1 : 0;
        else if (is_num(b)) return n_lt(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_lt(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_lt(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return lt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return lt(a, bi);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return lt(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "lt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return lt(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "lt: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a[j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if (a.length !== b.length) throw "lt: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return lt(a[i], bi);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return lt(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "lt: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return lt(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "lt: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return lt(a[i][j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "lt: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return lt(a[i], bi);});
        }
    }
    else if (is_nd(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return lt(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "lt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return lt(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "lt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return lt(ai, b[i]);});
        }
        else if (is_nd(b))
        {
            if (!arr_eq(size(a), size(b))) throw "lt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return lt(ai, b[i]);});
        }
    }
    return 0;
}
$_.lt = lt;
function gt(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a > b ? 1 : 0;
        else if (is_scalar(b)) return a > String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return gt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return gt(a, bi);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) > b ? 1 : 0;
        else if (is_num(b)) return n_gt(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_gt(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return gt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return gt(a, bi);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) > b ? 1 : 0;
        else if (is_num(b)) return n_gt(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_gt(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_gt(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return gt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return gt(a, bi);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return gt(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "gt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return gt(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "gt: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a[j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if (a.length !== b.length) throw "gt: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return gt(a[i], bi);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return gt(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "gt: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return gt(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "gt: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return gt(a[i][j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "gt: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return gt(a[i], bi);});
        }
    }
    else if (is_nd(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return gt(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "gt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return gt(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "gt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return gt(ai, b[i]);});
        }
        else if (is_nd(b))
        {
            if (!arr_eq(size(a), size(b))) throw "gt: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return gt(ai, b[i]);});
        }
    }
    return 0;
}
$_.gt = gt;
function le(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a <= b ? 1 : 0;
        else if (is_scalar(b)) return a <= String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return le(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return le(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return le(a, bi);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) <= b ? 1 : 0;
        else if (is_num(b)) return n_le(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_le(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return le(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return le(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return le(a, bi);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) <= b ? 1 : 0;
        else if (is_num(b)) return n_le(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_le(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_le(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return le(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return le(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return le(a, bi);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return le(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "le: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return le(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "le: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return le(a[j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if (a.length !== b.length) throw "le: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return le(a[i], bi);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return le(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "le: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return le(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "le: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return le(a[i][j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "le: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return le(a[i], bi);});
        }
    }
    else if (is_nd(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return le(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "le: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return le(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "le: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return le(ai, b[i]);});
        }
        else if (is_nd(b))
        {
            if (!arr_eq(size(a), size(b))) throw "le: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return le(ai, b[i]);});
        }
    }
    return 0;
}
$_.le = le;
function ge(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a >= b ? 1 : 0;
        else if (is_scalar(b)) return a >= String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return ge(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return ge(a, bi);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) >= b ? 1 : 0;
        else if (is_num(b)) return n_ge(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_ge(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return ge(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return ge(a, bi);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) >= b ? 1 : 0;
        else if (is_num(b)) return n_ge(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_ge(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_ge(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return ge(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a, b[i][j]);});
        else if (is_nd(b)) return b.map(function(bi) {return ge(a, bi);});
    }
    else if (is_vector(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return ge(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "ge: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ge(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if (a.length !== COLS(b)) throw "ge: inputs have incompatible dimensions";
            return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a[j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if (a.length !== b.length) throw "ge: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return ge(a[i], bi);});
        }
    }
    else if (is_matrix(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return matrix(ROWS(a), COLS(a), function(i, j) {return ge(a[i][j], b);});
        }
        else if (is_vector(b))
        {
            if (COLS(a) !== b.length) throw "ge: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return ge(a[i][j], b[j]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "ge: inputs have incompatible dimensions";
            return matrix(ROWS(a), COLS(a), function(i, j) {return ge(a[i][j], b[i][j]);});
        }
        else if (is_nd(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "ge: inputs have incompatible dimensions";
            return b.map(function(bi, i) {return ge(a[i], bi);});
        }
    }
    else if (is_nd(a))
    {
        if (is_string(b) || is_scalar(b))
        {
            return a.map(function(ai) {return ge(ai, b);});
        }
        else if (is_vector(b))
        {
            if (a.length !== b.length) throw "ge: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ge(ai, b[i]);});
        }
        else if (is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "ge: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ge(ai, b[i]);});
        }
        else if (is_nd(b))
        {
            if (!arr_eq(size(a), size(b))) throw "ge: inputs have incompatible dimensions";
            return a.map(function(ai, i) {return ge(ai, b[i]);});
        }
    }
    return 0;
}
$_.ge = ge;
function scalar_sign(x)
{
    return is_complex(x) ? x.sign() : realMath.sign(x);
}
$_.ssign = scalar_sign;
function scalar_add(a, b)
{
    if (is_num(a) && is_num(b)) return n_add(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.add(b);
    else if (is_complex(b) && is_scalar(a)) return b.add(a);
    return nan;
}
$_.sadd = scalar_add;
function scalar_sub(a, b)
{
    if (is_num(a) && is_num(b)) return n_sub(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.sub(b);
    else if (is_complex(b) && is_scalar(a)) return b.neg().add(a);
    return nan;
}
$_.ssub = scalar_sub;
function scalar_mul(a, b)
{
    if (is_num(a) && is_num(b)) return n_mul(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.mul(b);
    else if (is_complex(b) && is_scalar(a)) return b.mul(a);
    return nan;
}
$_.smul = scalar_mul;
function scalar_div(a, b)
{
    if (is_num(a) && is_num(b)) return n_div(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.div(b);
    else if (is_complex(b) && is_scalar(a)) return b.inv().mul(a);
    return nan;
}
$_.sdiv = scalar_div;
function scalar_pow(a, b)
{
    if (is_num(a) && is_num(b)) return n_pow(a, b);
    else if (is_complex(a) && is_scalar(b)) return a.pow(b);
    else if (is_complex(b) && is_scalar(a)) return (new complex(a, O)).pow(b);
    return nan;
}
$_.spow = scalar_pow;
function scalar_neg(a)
{
    if (is_num(a)) return n_neg(a);
    else if (is_complex(a)) return a.neg();
    return nan;
}
$_.sneg = scalar_neg;
function scalar_conj(a)
{
    if (is_num(a)) return a;
    else if (is_complex(a)) return a.conj();
    return nan;
}
$_.sconj = scalar_conj;
function scalar_inv(a)
{
    if (is_num(a)) return n_eq(a, O) ? inf : n_inv(a);
    else if (is_complex(a)) return n_eq(a.abs(), O) ? new complex(inf, n_lt(a.im, O) ? inf : -inf) : a.inv();
    return nan;
}
$_.sinv = scalar_inv;
function scalar_abs(a)
{
    if (is_num(a)) return realMath.abs(a);
    else if (is_complex(a)) return a.abs();
    return nan;
}
$_.sabs = scalar_abs;
function scalar_angle(a)
{
    if (is_num(a)) return (n_lt(a, O) ? constant.pi : O);
    else if (is_complex(a)) return a.angle();
    return nan;
}
$_.sangle = scalar_angle;
function add(a, b)
{
    if (is_string(a) && is_string(b))
    {
        // concat
        return a+b;
    }
    else if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_add(a, b);
    }
    else if (is_nd(a) && is_nd(b))
    {
        // ndarray-ndarray
        if (arr_eq(size(a), size(b)))
        {
            return a.map(function(ai, i) {
                return add(ai, b[i]);
            });
        }
        else
        {
            throw "add: array dimensions do not match";
        }
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return add(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "add: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return add(ai, b[i]);
            });
        }
        else
        {
            throw "add: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // array-scalar
        return a.map(function(ai) {return add(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-array
        return b.map(function(bi) {return add(a, bi);});
    }
    not_supported("add");
}
$_.add = add;
function sub(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_sub(a, b);
    }
    else if (is_nd(a) && is_nd(b))
    {
        // ndarray-ndarray
        if (arr_eq(size(a), size(b)))
        {
            return a.map(function(ai, i) {
                return sub(ai, b[i]);
            });
        }
        else
        {
            throw "sub: array dimensions do not match";
        }
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return sub(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "sub: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return sub(ai, b[i]);
            });
        }
        else
        {
            throw "sub: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // array-scalar
        return a.map(function(ai) {return sub(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-array
        return b.map(function(bi) {return sub(a, bi);});
    }
    not_supported("sub");
}
$_.sub = sub;
function dotmul(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_mul(a, b);
    }
    else if (is_nd(a) && is_nd(b))
    {
        // ndarray-ndarray
        if (arr_eq(size(a), size(b)))
        {
            return a.map(function(ai, i) {
                return dotmul(ai, b[i]);
            });
        }
        else
        {
            throw "dotmul: array dimensions do not match";
        }
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return dotmul(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "dotmul: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return dotmul(ai, b[i]);
            });
        }
        else
        {
            throw "dotmul: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // array-scalar
        return a.map(function(ai) {return dotmul(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-array
        return b.map(function(bi) {return dotmul(a, bi);});
    }
    not_supported("dotmul");
}
$_.dotmul = dotmul;
fn.times = dotmul;
function dotdiv(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_div(a, b);
    }
    else if (is_nd(a) && is_nd(b))
    {
        // ndarray-ndarray
        if (arr_eq(size(a), size(b)))
        {
            return a.map(function(ai, i) {
                return dotdiv(ai, b[i]);
            });
        }
        else
        {
            throw "dotdiv: array dimensions do not match";
        }
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return dotdiv(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "dotdiv: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return dotdiv(ai, b[i]);
            });
        }
        else
        {
            throw "dotdiv: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // array-scalar
        return a.map(function(ai) {return dotdiv(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-array
        return b.map(function(bi) {return dotdiv(a, bi);});
    }
    not_supported("dotdiv");
}
$_.dotdiv = dotdiv;
function dotpow(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_pow(a, b);
    }
    else if (is_nd(a) && is_nd(b))
    {
        // ndarray-ndarray
        if (arr_eq(size(a), size(b)))
        {
            return a.map(function(ai, i) {
                return dotpow(ai, b[i]);
            });
        }
        else
        {
            throw "dotpow: array dimensions do not match";
        }
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return a.map(function(ai, i) {
                var bi = b[i];
                return ai.map(function(aij, j) {
                    return dotpow(aij, bi[j]);
                });
            });
        }
        else
        {
            throw "dotpow: matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector
        if (a.length === b.length)
        {
            return a.map(function(ai, i) {
                return dotpow(ai, b[i]);
            });
        }
        else
        {
            throw "dotpow: vector dimensions do not match";
        }
    }
    else if (is_array(a))
    {
        // array-scalar
        return a.map(function(ai) {return dotpow(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-array
        return b.map(function(bi) {return dotpow(a, bi);});
    }
    not_supported("dotpow");
}
$_.dotpow = dotpow;
fn.power = dotpow;
function mul_tri(A, B, type)
{
    // faster matrix-matrix mul for A,B nxn triangular
    if (COLS(A) === ROWS(B))
    {
        if ("lower" === type)
        {
            // lower triangular
            return matrix(ROWS(A), COLS(B), function(i, j) {
                if (j > i) return O; // lower triangular
                for (var cij=O,k=j,kmax=i; k<=kmax; ++k)
                {
                    // j <= i
                    // A[i][:]  = x(1) .. x(i) .. 0
                    // B[:][j]' =   0  .. x(j) .. x(n)
                    cij = scalar_add(cij, scalar_mul(A[i][k], B[k][j]));
                }
                return cij;
            });
        }
        else
        {
            // upper triangular
            return matrix(ROWS(A), COLS(B), function(i, j) {
                if (j < i) return O; // upper triangular
                for (var cij=O,k=i,kmax=j; k<=kmax; ++k)
                {
                    // j >= i
                    // A[i][:]  =  0   .. x(i) .. x(n)
                    // B[:][j]' = x(1) .. x(j) .. 0
                    cij = scalar_add(cij, scalar_mul(A[i][k], B[k][j]));
                }
                return cij;
            });
        }
    }
    throw "mul: matrix-matrix dimensions do not match";
}
$_.mult = mul_tri;
function mul(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        // scalar-scalar
        return scalar_mul(a, b);
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        // matrix-matrix
        if (COLS(a) === ROWS(b))
        {
            // TODO maybe optimize matrix-matrix multiplication (eg use Strassen algorithm)
            var rows = ROWS(a), cols = COLS(b), rc = ROWS(b);
            return matrix(rows, cols, function(i, j) {
                for (var cij=O,k=0; k<rc; ++k)
                {
                    cij = scalar_add(cij, scalar_mul(a[i][k], b[k][j]));
                }
                return cij;
            });
        }
        else
        {
            throw "mul: matrix-matrix dimensions do not match";
        }
    }
    else if (is_vector(a) && is_matrix(b))
    {
        // vector-matrix
        if (a.length === ROWS(b))
        {
            var rows = 1, cols = COLS(b), rc = a.length;
            return /*array(cols, */matrix(rows, cols, function(i, j) {
                for (var cij=O,k=0; k<rc; ++k)
                {
                    cij = scalar_add(cij, scalar_mul(a[k], b[k][j]));
                }
                return cij;
            });
        }
        else
        {
            throw "mul: vector-matrix dimensions do not match";
        }
    }
    else if (is_matrix(a) && is_vector(b))
    {
        // matrix-vector
        if (COLS(a) === b.length)
        {
            var rows = ROWS(a), cols = 1, rc = b.length;
            return /*array(rows, */matrix(rows, cols, function(i, j) {
                for (var cij=O,k=0; k<rc; ++k)
                {
                    cij = scalar_add(cij, scalar_mul(a[i][k], b[k]));
                }
                return cij;
            });
        }
        else
        {
            throw "mul: matrix-vector dimensions do not match";
        }
    }
    else if (is_vector(a) && is_vector(b))
    {
        // vector-vector outer
        var rows = a.length, cols = b.length;
        return matrix(rows, cols, function(i, j) {
            return scalar_mul(a[i], b[j]);
        });
    }
    else if (is_array(a))
    {
        // array-scalar
        return a.map(function(ai) {return mul(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-array
        return b.map(function(bi) {return mul(a, bi);});
    }
    not_supported("mul");
}
$_.mul = mul;
function pow(a, b)
{
    if (is_scalar(a) && is_scalar(b))
    {
        return scalar_pow(a, b);
    }
    else if (is_matrix(a) && (ROWS(a) === COLS(a)) && is_int(b))
    {
        // matrix pow
        b = _(b);
        if (0 > b)
        {
            b = -b;
            a = inv(a);
            if (!a || !a.length) throw "pow: no inverse";
        }
        if (0 === b)
        {
            return eye(ROWS(a));
        }
        else if (1 === b)
        {
            return a;
        }
        else if (2 === b)
        {
            return mul(a, a);
        }
        else
        {
            // exponentiation by squaring
            var pow = eye(ROWS(a));
            while (0 !== b)
            {
                if (b & 1) pow = mul(pow, a);
                b >>= 1;
                if (0 < b) a = mul(a, a);
            }
            return pow;
        }
    }
    not_supported("pow");
}
$_.pow = pow;
fn.mpower = pow;

function neg(a)
{
    if (is_scalar(a)) return scalar_neg(a);
    if (is_array(a)) return a.map(neg);
    return a;
}
$_.neg = neg;

function get(mat /*, ..slices*/)
{
    // indices start from 1 to end
    // B=A(:,[5 6]); B=get(A,':','4,5');
    var is_var = variable && is_instance(mat, variable);
    if (is_var) mat = mat.get(true);
    if (!is_array(mat)) return mat;
    var has_b = '()' === arguments[1] || '{}' === arguments[1],
        b = has_b ? arguments[1] : '()', iscell = is_cell(mat),
        slices = [].slice.call(arguments, has_b ? 2 : 1),
        sz = is_1d(mat) ? [mat.length] : size(mat), sz2, tot, ret;
    if (1 === slices.length)
    {
        tot = 0;
        if (is_array(slices[0]) && arr_eq(sz, size(slices[0])) && all(slices[0], function(v) {
            tot += 1 === _(v) ? 1 : 0;
            return 0 === _(v) || 1 === _(v);
        }))
        {
            ret = tensorview(mat, {shape:sz, ndarray:sz}).select(tonumber(slices[0])).permute(array(sz.length, function(i) {return sz.length-1-i;}));
            if (is_var)
            {
                if ((1 === tot) && ('{}' === b || !iscell)) ret = ret.get(array(ret.dimension, 0));
            }
            else
            {
                ret = ret.toArray();
                if ((1 === ret.length) && ('{}' === b || !iscell)) ret = ret[0];
                else if (iscell) ret = cellarray(ret, [ret.length]);
            }
        }
        else
        {
            slices = slices.map(function(slice) {return is_array(slice) ? vec(slice) : slice;});
            tot = _(prod(sz));
            if (':' === slices[0])
            {
                // colon op
                sz2 = [tot, 1];
            }
            else
            {
                sz2 = [tot];
            }
            ret = tensorview(mat, {shape:sz, ndarray:sz}).permute(array(sz.length, function(i) {return sz.length-1-i;})).reshape(sz2);
            if (':' !== slices[0])
            {
                ret = ret.slice(slices.map(function(slice, dim) {
                    if (is_string(slice))
                    {
                        return slice;
                    }
                    else if (is_int(slice))
                    {
                        var index = _(slice);
                        if (1 <= index && index <= tot) return index-1;
                        throw "get: index out of bounds";
                    }
                    else if (is_vector(slice))
                    {
                        return slice.map(function(index) {
                            index = _(index);
                            if (1 <= index && index <= tot) return index-1;
                            throw "get: index out of bounds";
                        });
                    }
                    else
                    {
                        throw "get: invalid range";
                    }
                }));
            }
            if (is_var)
            {
                if ((':' !== slices[0]) && (1 === ret.length) && ('{}' === b || !iscell)) ret = ret.get(array(ret.dimension, 0));
            }
            else
            {
                ret = ':' === slices[0] ? ret.toNDArray() : ret.toArray();
                if ((':' !== slices[0]) && (1 === ret.length) && ('{}' === b || !iscell)) ret = ret[0];
                else if (iscell) ret = cellarray(ret, ':' === slices[0] ? sz2.slice() : [ret.length]);
            }
        }
    }
    else if ((1 < slices.length) && (slices.length < sz.length))
    {
        slices = slices.map(function(slice) {return is_array(slice) ? vec(slice) : slice;});
        tot = _(prod(sz));
        sz2 = array(slices.length, function(dim) {
            if (dim+1 === slices.length) return tot;
            tot /= sz[dim];
            return sz[dim];
        });
        ret = tensorview(mat, {shape:sz,ndarray:sz}).permute(array(sz.length, function(i) {return sz.length-1-i;})).reshape(sz2.reverse()).permute(array(sz2.length, function(i) {return sz2.length-1-i;})).slice(slices.map(function(slice, dim) {
            dim = sz2.length-1-dim;
            if (is_string(slice))
            {
                return slice;
            }
            else if (is_int(slice))
            {
                var index = _(slice);
                if (1 <= index && index <= sz2[dim]) return index-1;
                throw "get: index out of bounds";
            }
            else if (is_vector(slice))
            {
                return slice.map(function(index) {
                    index = _(index);
                    if (1 <= index && index <= sz2[dim]) return index-1;
                    throw "get: index out of bounds";
                });
            }
            else
            {
                throw "get: invalid range";
            }
        }));
        if (1 === ret.length)
        {
            ret = ret.get(array(ret.dimension, 0));
            if (iscell && ('()' === b)) ret = cellarray([ret], [1]);
        }
        else if (0 === ret.length)
        {
            ret = [];
            if (iscell && ('()' === b)) ret = cellarray([ret], [1]);
        }
        else if (is_var)
        {
            // pass
        }
        else
        {
            if (iscell && ('()' === b)) ret = cellarray(ret.toNDArray(), ret.shape());
            else ret = ret.toNDArray();
        }
    }
    else
    {
        slices = slices.map(function(slice) {return is_array(slice) ? vec(slice) : slice;});
        ret = tensorview(mat, {shape:sz, ndarray:sz}).slice(slices.reduce(function(slices, slice, dim) {
            var szdim = dim >= sz.length ? 1 : (sz[dim]), index;
            if (is_string(slice))
            {
                if (dim < sz.length) slices.push(slice);
                else if ('0' !== slice) throw "get: index out of bounds";
            }
            else if (is_int(slice))
            {
                index = _(slice);
                if (1 <= index && index <= szdim)
                {
                    if (dim < sz.length) slices.push(index-1);
                }
                else
                {
                    throw "get: index out of bounds";
                }
            }
            else if (is_vector(slice))
            {
                slice = slice.map(function(index) {
                    index = _(index);
                    if (1 <= index && index <= szdim) return index-1;
                    throw "get: index out of bounds";
                });
                if (dim < sz.length) slices.push(slice);
            }
            else
            {
                throw "get: invalid range";
            }
            return slices;
        }, [])).squeeze(2); // remove trivial dimensions after 2d
        if (1 === ret.length)
        {
            ret = ret.get(array(ret.dimension, 0));
            if (iscell && ('()' === b)) ret = cellarray([ret], [1]);
        }
        else if (0 === ret.length)
        {
            ret = [];
            if (iscell && ('()' === b)) ret = cellarray([ret], [1]);
        }
        else if (is_var)
        {
            // pass
        }
        else
        {
            if (iscell && ('()' === b)) ret = cellarray(ret.toNDArray(), ret.shape());
            else ret = ret.toNDArray();
        }
    }
    return ret;
}
$_.get = get;
function set(mat /*, ..slices, val*/)
{
    // indices start from 1 to end
    // B(:,[2 3])=A; set(B,':','1,2', A);
    var val = arguments[arguments.length-1], is_view = is_instance(val, tensorview),
        has_b = 3 <= arguments.length && ('()' === arguments[1] || '{}' === arguments[1]),
        b = has_b ? arguments[1] : '()';
    if (!is_array(mat)) return is_view ? copy(val.data) : val;
    if ('{}' === b)
    {
        val = is_view ? [val.data] : [val];
        is_view = false;
    }
    var slices = [].slice.call(arguments, has_b ? 2 : 1, -1),
        iscell = is_cell(mat), iscellv = is_cell(is_view ? val.data : val),
        sz = is_1d(mat) ? [mat.length] : size(mat), sz2,
        szv = '{}' === b ? [1] : (is_view ? val.shape() : (is_1d(val) ? [val.length] : size(val))),
        tot, concat_dim = [-1, -1];
    if (!mat.length && slices.length)
    {
        slices = slices.map(function(slice) {return is_array(slice) ? vec(slice) : slice;});
        slices.forEach(function(slice, dim) {
            if (!(((dim < szv.length) && (':' === slice)) || ((dim >= szv.length) && (1 === _(slice)))))
            {
                throw "set: invalid range";
            }
        });
        mat = is_view ? val.reshape(szv.concat(array(slices.length-szv.length, 1))) : tensorview(val, {shape:szv.concat(array(slices.length-szv.length, 1))});
        if (iscell || iscellv)
        {
            mat = cellarray(mat.toNDArray(), mat.shape());
        }
        else
        {
            mat = mat.toNDArray();
        }
    }
    else if (sz.length < slices.length)
    {
        slices = slices.map(function(slice) {return is_array(slice) ? vec(slice) : slice;});
        slices.forEach(function(slice, dim) {
            if (!(((dim < sz/*v*/.length) && (':' === slice)) || ((dim === slices.length-1) && (2 === _(slice))) || ((dim >= sz/*v*/.length) && (dim < slices.length-1) && (1 === _(slice)))))
            {
                throw "set: invalid range";
            }
        });
        mat = tensorview(mat, {shape: sz.concat(array(slices.length-sz.length, 1))}).concat(is_view ? val.reshape(sz/*v*/.concat(array(slices.length-sz/*v*/.length, 1))) : tensorview(val, {shape: sz/*v*/.concat(array(slices.length-sz/*v*/.length, 1))}), slices.length-1);
        if (iscell)
        {
            mat = cellarray(mat.toNDArray(), mat.shape());
        }
        else
        {
            mat = mat.toNDArray();
        }
    }
    else if ((1 < slices.length) && (slices.length < sz.length))
    {
        slices = slices.map(function(slice) {return is_array(slice) ? vec(slice) : slice;});
        tot = _(prod(sz));
        sz2 = array(slices.length, function(dim) {
            if (dim+1 === slices.length) return tot;
            tot /= sz[dim];
            return sz[dim];
        });
        tensorview(mat, {shape:sz,ndarray:sz}).permute(array(sz.length, function(i) {return sz.length-1-i;})).reshape(sz2.reverse()).permute(array(sz2.length, function(i) {return sz2.length-1-i;})).slice(slices.map(function(slice, dim) {
            dim = sz2.length-1-dim;
            if (is_string(slice))
            {
                return slice;
            }
            else if (is_int(slice))
            {
                var index = _(slice);
                if (1 <= index && index <= sz2[dim]) return index-1;
                throw "set: index out of bounds";
            }
            else if (is_vector(slice))
            {
                return slice.map(function(index) {
                    index = _(index);
                    if (1 <= index && index <= sz2[dim]) return index-1;
                    throw "set: index out of bounds";
                });
            }
            else
            {
                throw "set: invalid range";
            }
        })).setFrom(is_view ? val : tensorview(val, {shape:is_array(val) ? szv : null, ndarray:is_array(val) ? szv : null}), copy);
    }
    else if (is_int(slices[slices.length-1]) && (sz[sz.length-1]+1 === _(slices[slices.length-1])))
    {
        mat = tensorview(mat, {shape: sz}).concat(is_view ? val.reshape(szv.concat(array(slices.length-szv.length, 1))) : tensorview(val, {shape: !is_array(val) ? (sz.slice(0, -1).concat(1)) : (szv.concat(array(slices.length-szv.length, 1)))}), slices.length-1);
        if (iscell)
        {
            mat = cellarray(mat.toNDArray(), mat.shape());
        }
        else
        {
            mat = mat.toNDArray();
        }
    }
    else if (1 === slices.length)
    {
        if (is_array(slices[0]) && arr_eq(sz, size(slices[0])) && all(slices[0], function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            tensorview(mat, {shape:sz, ndarray:sz}).select(tonumber(slices[0])).setFrom(is_view ? val : tensorview(val, {shape:is_array(val) ? szv : null, ndarray:is_array(val) ? szv : null}), copy);
        }
        else
        {
            slices = slices.map(function(slice) {return is_array(slice) ? vec(slice) : slice;});
            tot = _(prod(sz));
            concat_dim[0] = sz.indexOf(tot);
            slices = slices.map(function(slice, dim) {
                if (is_string(slice))
                {
                    return slice;
                }
                else if (is_int(slice))
                {
                    var index = _(slice);
                    if (1 <= index && index <= tot)
                    {
                        return index-1;
                    }
                    else if (-1 < concat_dim[0] && index === tot+1)
                    {
                        concat_dim[1] = concat_dim[0];
                        return index-1;
                    }
                    throw "set: index out of bounds";
                }
                else if (is_vector(slice))
                {
                    return slice.map(function(index) {
                        index = _(index);
                        if (1 <= index && index <= tot)
                        {
                            return index-1;
                        }
                        else if (-1 < concat_dim[0] && index === tot+1)
                        {
                            concat_dim[1] = concat_dim[0];
                            return index-1;
                        }
                        throw "set: index out of bounds";
                    });
                }
                else
                {
                    throw "set: invalid range";
                }
            });
            if (-1 < concat_dim[1])
            {
                mat = tensorview(mat, {shape: sz}).concat(is_view ? val.reshape(szv.concat(array(slices.length-szv.length, 1))) : tensorview(val, {shape: !is_array(val) ? (sz.slice(0, concat_dim[1]).concat(1).concat(sz.slice(concat_dim[1]+1))) : (szv.concat(array(slices.length-szv.length, 1)))}), concat_dim[1]);
                if (iscell)
                {
                    mat = cellarray(mat.toNDArray(), mat.shape());
                }
                else
                {
                    mat = mat.toNDArray();
                }
            }
            else
            {
                tensorview(mat, {shape:sz, ndarray:sz}).permute(array(sz.length, function(i) {return sz.length-1-i;})).reshape([tot]).slice(slices).setFrom(is_view ? val : tensorview(val, {shape:is_array(val) ? szv : null, ndarray:is_array(val) ? szv : null}), copy);
            }
        }
    }
    else
    {
        slices = slices.map(function(slice) {return is_array(slice) ? vec(slice) : slice;});
        slices = slices.map(function(slice, dim) {
            if (is_string(slice))
            {
                return slice;
            }
            else if (is_int(slice))
            {
                var index = _(slice);
                if (1 <= index && index <= sz[dim])
                {
                    return index-1;
                }
                else if (index === sz[dim]+1)
                {
                    concat_dim[0] = dim;
                    return index-1;
                }
                throw "set: index out of bounds";
            }
            else if (is_vector(slice))
            {
                return slice.map(function(index) {
                    index = _(index);
                    if (1 <= index && index <= sz[dim])
                    {
                        return index-1;
                    }
                    else if (index === sz[dim]+1)
                    {
                        concat_dim[0] = dim;
                        return index-1;
                    }
                    throw "set: index out of bounds";
                });
            }
            else
            {
                throw "set: invalid range";
            }
        });
        if (-1 < concat_dim[0])
        {
            mat = tensorview(mat, {shape: sz}).concat(is_view ? val.reshape(szv.concat(array(slices.length-szv.length, 1))) : tensorview(val, {shape: !is_array(val) ? (sz.slice(0, concat_dim[0]).concat(1).concat(sz.slice(concat_dim[0]+1))) : (szv.concat(array(slices.length-szv.length, 1)))}), concat_dim[0]);
            if (iscell)
            {
                mat = cellarray(mat.toNDArray(), mat.shape());
            }
            else
            {
                mat = mat.toNDArray();
            }
        }
        else
        {
            tensorview(mat, {shape:sz, ndarray:sz}).slice(slices).setFrom(is_view ? val : tensorview(val, {shape:is_array(val) ? szv : null, ndarray:is_array(val) ? szv : null}), copy);
        }
    }
    return mat;
}
$_.set = set;
function hypot(a, b)
{
    a = stdMath.abs(a);
    b = stdMath.abs(b);
    var r = 0;
    if (0 === a)
    {
        return b;
    }
    else if (0 === b)
    {
        return a;
    }
    else if (a > b)
    {
        r = b/a;
        return a*stdMath.sqrt(1 + r*r);
    }
    else if (a < b)
    {
        r = a/b;
        return b*stdMath.sqrt(1 + r*r);
    }
    return a*stdMath.SQRT2;
}
function n_hypot(a, b)
{
    if (is_number(a) && is_number(b)) return hypot(a, b);
    return realMath.sqrt(n_add(n_mul(a, a), n_mul(b, b)));
}
function hypotn(args)
{
    var max = 0;
    args = args.map(function(ai) {
        ai = scalar_abs(ai);
        if (max < ai) max = ai;
        return ai;
    });
    return 0 === max ? 0 : (max*stdMath.sqrt(args.reduce(function(sum, ai) {
        if (ai === max)
        {
            return sum + 1;
        }
        else
        {
            var r = ai/max;
            return sum + r*r;
        }
    }, 0)));
}

/*function zsin(side, hypotenuse)
{
    return scalar_div(imag(scalar_mul(side, scalar_conj(hypotenuse))), scalar_mul(abs(side), abs(hypotenuse)));
}
function zcos(side, hypotenuse)
{
    return scalar_div(real(scalar_mul(side, scalar_conj(hypotenuse))), scalar_mul(abs(side), abs(hypotenuse)));
}*/

function normal()
{
    // Box-Muller
    var u1 = 0, u2 = 0, r, z0, z1;
    if (is_number(normal.z1))
    {
        z1 = normal.z1;
        normal.z1 = null;
        return z1;
    }
    while (0 === u1 || 1 === u1) u1 = stdMath.random();
    while (0 === u2 || 1 === u2) u2 = stdMath.random();
    r = stdMath.sqrt(-2.0*stdMath.log(u1));
    z0 = r*stdMath.cos(2.0*pi*u2);
    z1 = r*stdMath.sin(2.0*pi*u2);
    normal.z1 = z1;
    return z0;
}

function d_euclidean(a, b)
{
    var d = 1 === arguments.length ? a : sub(a, b);
    return d.reduce(function(n, di) {
        return n && (is_number(di) || (is_complex(di) && is_number(di.re) && is_number(di.im)));
    }, true) ? hypotn(d) : realMath.sqrt(real(dot(d, d)));
}
function d_sqeuclidean(a, b)
{
    var d = 1 === arguments.length ? a : sub(a, b);
    return real(dot(d, d));
}
function d_seuclidean(a, b, std)
{
    var d = dotdiv(sub(a, b), std);
    return real(dot(d, d));
}
function d_mahalanobis(a, mean, invCov)
{
    var d = sub(a, mean);
    return real(dot(vec(mul(d, invCov)), d));
}
function d_minkowski(a, b, p)
{
    // p-norm
    if (2 === arguments.length) p = b;
    if (n_eq(p, I))
    {
        return 2 === arguments.length ? d_cityblock(a) : d_cityblock(a, b);
    }
    else if (n_eq(p, two))
    {
        return 2 === arguments.length ? d_euclidean(a) : d_euclidean(a, b);
    }
    else if (is_inf(p))
    {
        return 2 === arguments.length ? d_chebychev(a) : d_chebychev(a, b);
    }
    return scalar_pow(sum(dotpow(abs(2 === arguments.length ? a : sub(a, b)), p)), n_inv(p));
}
function d_chebychev(a, b)
{
    return max(abs(1 === arguments.length ? a : sub(a, b)));
}
function d_cityblock(a, b)
{
    // manhattan
    return sum(abs(1 === arguments.length ? a : sub(a, b)));
}
function d_cosine(a, b)
{
    return scalar_sub(I, scalar_div(scalar_div(dot(a, b), realMath.sqrt(real(dot(a, a)))), realMath.sqrt(real(dot(b, b)))));
}
function d_correlation(a, b)
{
    return d_cosine(sub(a, mean(a)), sub(b, mean(b)));
}
function d_hamming(a, b)
{
    return __(a.reduce(function(d, ai, i) {
        return d + 1 - eq(ai, b[i]);
    }, 0) / a.length);
}
function d_jaccard(a, b)
{
    return __(1 - a.reduce(function(d, ai, i) {
        return d + eq(ai, b[i]);
    }, 0) / a.length);
}
function d_kullbackleibler(a, b, symmetric)
{
    // compute the Kullback-Leibler divergence
    // normalize A and B to sum to unity (make them represent probability density functions)
    var d, p;
    if (is_matrix(a) && is_matrix(b))
    {
        a = add(sub(a, min(min(a))), eps);
        b = add(sub(b, min(min(b))), eps);
        a = dotdiv(a, sum(sum(a)));
        b = dotdiv(b, sum(sum(b)));
        d = sum(sum(add(sub(dotmul(a, fn.log(dotdiv(a, b))), a), b)));
        if (symmetric)
        {
            p = sum(sum(add(sub(dotmul(b, fn.log(dotdiv(b, a))), b), a)));
            d = scalar_mul(scalar_add(d, p), half);
        }
    }
    else
    {
        a = add(sub(a, min(a)), eps);
        b = add(sub(b, min(b)), eps);
        a = dotdiv(a, sum(a));
        b = dotdiv(b, sum(b));
        d = sum(add(sub(dotmul(a, fn.log(dotdiv(a, b))), a), b));
        if (symmetric)
        {
            p = sum(add(sub(dotmul(b, fn.log(dotdiv(b, a))), b), a));
            d = scalar_mul(scalar_add(d, p), half);
        }
    }
    return d;
}

function norm2(x)
{
    return x.reduce(function(n, xi) {
        return scalar_add(n, scalar_mul(xi, scalar_conj(xi)));
    }, O);
}
// plotting functions
$_.PALETTE = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#00ffff",
  "#ff00ff",
  "#ffff00",
  "#4eca8e",
  "#df7c26",
  "#e6e641",
  "#6da20b",
  "#37ed75",
  "#a20ac4",
  "#e6efd2",
  "#22ad51",
  "#2c7496",
  "#bb3e25",
  "#42cda8",
  "#c02a98",
  "#404ad4",
  "#3f8c36",
  "#d15fec",
  "#c4f84d",
  "#eb5291",
  "#38b3e0",
  "#29790c",
  "#4f17e8"
];
function figure()
{
    var self = this;
    if (!is_instance(self, figure)) return new figure();
    self.data = [];
}
figure.prototype = {
    constructor: figure,

    canvas: null,

    // figure params
    type: '',
    data: null,
    no: 0,
    xscale: 'linear',
    yscale: 'linear',
    xlabel: '',
    ylabel: '',
    title: '',

    // figure axes
    xmin: 0,
    xmax: 1,
    ymin: 0,
    ymax: 1,
    scx: 1,
    scy: 1,
    sc: 1,

    // padding
    pt: 45,
    pb: 60,
    pl: 70,
    pr: 20,

    style: function(style, kth) {
        var linedash = {
                "-" : [],          //Solid
                "--": [15,5],      //Dashed
                ":" : [5,5],       //Dotted
                "-.": [15,5,5,5],  //Dash-dotted
            },
            color_ = {
                "red": "r",
                "green": "g",
                "blue": "b",
                "cyan": "c",
                "magenta": "m",
                "yellow": "y",
                "black": "k",
                "white": "w"
            },
            color = {
                "r": [1, 0, 0],
                "g": [0, 1, 0],
                "b": [0, 0, 1],
                "c": [0, 1, 1],
                "m": [1, 0, 1],
                "y": [1, 1, 0],
                "k": [0, 0, 0],
                "w": [1, 1, 1]
            },
            palette = [
                "b",
                "r",
                "g",
                "y",
                "c",
                "m",
                "k",
                "w"
            ],
            val, k
        ;
        if (is_string(style))
        {
            val = style;
            style = {
                Color: color[palette[(kth || 0) % palette.length]].slice(),
                LineWidth: 2,
                LineStyle: '-',
                _LineStyle: linedash['-'].slice()
            };
            for (k in color)
            {
                if (-1 < val.indexOf(k))
                {
                    style.Color = color[k].slice();
                    break;
                }
            }
            for (k in linedash)
            {
                if (('-' !== k) && (-1 < val.indexOf(k)))
                {
                    style.LineStyle = k;
                    style._LineStyle = linedash[k].slice();
                    break;
                }
            }
        }
        else if (is_obj(style))
        {
            if (is_string(style.Color))
            {
                if (HAS.call(color_, style.Color))
                {
                    style.Color = color[color_[style.Color]].slice();
                }
                else if (HAS.call(color, style.Color))
                {
                    style.Color = color[style.Color].slice();
                }
                else
                {
                    style.Color = color[palette[(kth || 0) % palette.length]].slice();
                }
            }
            else if (is_array(style.Color) && is_vector(val=vec(style.Color)) && (3 === val.length))
            {
                style.Color = tonumber(val);
            }
            else
            {
                style.Color = color[palette[(kth || 0) % palette.length]].slice();
            }

            if (is_num(style.LineWidth))
            {
                style.LineWidth = 2*tonumber(style.LineWidth);
            }
            else
            {
                style.LineWidth = 2;
            }

            if (is_string(style.LineStyle) && HAS.call(linedash, style.LineStyle))
            {
                style._LineStyle = linedash[style.LineStyle].slice();
            }
            else
            {
                style.LineStyle = '-';
                style._LineStyle = linedash['-'].slice();
            }
        }
        else
        {
            style = {
                Color: color[palette[(kth || 0) % palette.length]].slice(),
                LineWidth: 2,
                LineStyle: '-',
                _LineStyle: linedash['-'].slice()
            };
        }
        return style;
    },
    parse: function(args, type, defaultEmpty) {
        var fig = this, i = 0, j, kth = 0, n, v, x, y, z, s;
        if ('pie' === type)
        {
            while (i < args.length)
            {
                if (is_array(args[i]) && is_vector(v=vec(args[i])))
                {
                    fig.data.push({
                        y:tonumber(v)
                    });
                }
                i += 1;
            }
        }
        else if ('plot3' === type)
        {
            while (i < args.length)
            {
                x = null; y = null; z = null;
                if (is_array(args[i]) && is_vector(v=vec(args[i])))
                {
                    x = v;
                }
                if (is_array(args[i+1]) && is_vector(v=vec(args[i+1])))
                {
                    y = v;
                }
                if (is_array(args[i+2]) && is_vector(v=vec(args[i+2])))
                {
                    z = v;
                }
                if (x && y && z)
                {
                    i += 3;
                    s = get_style(args[i]);
                    if (s) i += 1;
                    else s = {};
                    fig.data.push({
                        x:tonumber(x),
                        y:tonumber(y),
                        z:tonumber(z),
                        style:fig.style(s, kth++)
                    });
                }
                else
                {
                    i += 1;
                }
            }
        }
        else
        {
            while (i < args.length)
            {
                x = null; y = null;
                if (is_array(args[i]) && is_vector(v=vec(args[i])))
                {
                    x = v;
                }
                if (is_array(args[i+1]) && (is_matrix(args[i+1]) || is_vector(vec(args[i+1]))))
                {
                    y = vec(args[i+1]);
                    i += 2;
                }
                else if (x)
                {
                    y = x;
                    x = colon(1, y.length);
                    i += 1;
                }
                if (x && y)
                {
                    x = tonumber(x);
                    if (is_matrix(y))
                    {
                        for (j=0,n=COLS(y); j<n; ++j)
                        {
                            s = get_style(args[i]);
                            if (s) i += 1;
                            else s = {};
                            fig.data.push({
                                x:x,
                                y:tonumber(COL(y, j)),
                                style:fig.style(s, kth++)
                            });
                        }
                    }
                    else
                    {
                        s = get_style(args[i]);
                        if (s) i += 1;
                        else s = {};
                        fig.data.push({
                            x:x,
                            y:tonumber(y),
                            style:fig.style(s, kth++)
                        });
                    }
                }
                else
                {
                    i += 1;
                }
            }
        }
        return fig;
    }
};
function get_style(arg)
{
    return is_instance(arg, namevalue) && arg.has('Color') ? arg._ : (is_string(arg) ? arg : null);
}
$_.figure = figure;
$_.createCanvas = function(w, h) {};
$_.currentCanvas = function() {};
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
(['floor','ceil','round','sign','abs','exp','log','log10','log2','sqrt','sin','cos','tan','sinh','cosh','tanh','asin','acos','atan','asinh','acosh','atanh']).forEach(function(f) {
    if ('log' === f)
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath.log(x) : x.ln();
        };
    }
    else if ('log10' === f)
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath.log10(x) : x.log(ten);
        };
    }
    else if ('log2' === f)
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath.log2(x) : x.log(two);
        };
    }
    else
    {
        realMath[f] = function(x) {
            return is_number(x) ? stdMath[f](x) : x[f]();
        };
    }
});
realMath.atan2 = function(y, x) {
    return n_eq(O, x) && n_eq(O, y) ? O : (is_number(y) && is_number(x) ? stdMath.atan2(y, x) : decimal.atan2(y, x));
};
realMath.fix = function(x) {
    return n_lt(x, O) ? realMath.ceil(x) : realMath.floor(x);
};
$_.realMath = realMath;
complex = function complex(re, im, type) {
    var self = this;
    if (!is_instance(self, complex)) return new complex(re, im, type);
    if (is_complex(re))
    {
        self.re = re.re;
        self.im = re.im;
    }
    else
    {
        im = im || O;
        if ('polar' === type)
        {
            self._rho = realMath.abs(re);
            self.re = n_mul(self._rho, realMath.cos(im));
            self.im = n_mul(self._rho, realMath.sin(im));
        }
        else
        {
            self.re = re;
            self.im = im;
        }
    }
};
complex.prototype = {
    constructor: complex,
    re: 0,
    im: 0,
    _rho: null,
    _rho2: null,
    _theta: null,
    _sgn: null,
    _str: null,
    abs: function(sq) {
        var self = this;
        if (null == self._rho)
        {
            self._rho = n_hypot(self.re, self.im);
        }
        return self._rho;

    },
    norm2: function() {
        var self = this;
        if (null == self._rho2)
        {
            self._rho2 = n_pow(self.abs(), two);
        }
        return self._rho2;

    },
    angle: function() {
        var self = this;
        if (null == self._theta)
        {
            self._theta = /*n_eq(self.re, O) ? __((n_lt(self.im, O) ? -1 : 1)*pi/2) :*/ realMath.atan2(self.im, self.re);
        }
        return self._theta;
    },
    sign: function() {
        var self = this;
        if (null == self._sgn)
        {
            self._sgn = !n_eq(self.im, O) ? self.div(self.abs())/*new complex(realMath.cos(self.angle()), realMath.sin(self.angle()))*/ : realMath.sign(self.re);
            if (is_complex(self._sgn)) self._sgn._sgn = self._sgn;
        }
        return self._sgn;
    },
    add: function(other) {
        var self = this;
        if (is_num(other))
        {
            return new complex(n_add(self.re, other), self.im);
        }
        else
        {
            return new complex(n_add(self.re, other.re), n_add(self.im, other.im));
        }
    },
    sub: function(other) {
        var self = this;
        if (is_num(other))
        {
            return new complex(n_sub(self.re, other), self.im);
        }
        else
        {
            return new complex(n_sub(self.re, other.re), n_sub(self.im, other.im));
        }
    },
    mul: function(other) {
        var self = this;
        if (is_num(other))
        {
            return new complex(n_eq(self.re, O) ? O : n_mul(self.re, other), n_eq(self.im, O) ? O : n_mul(self.im, other));
        }
        else
        {
            // fast complex multiplication
            var x1 = self.re, x2 = other.re,
                y1 = self.im, y2 = other.im,
                k1 = n_mul(x1, n_add(x2, y2)),
                k2 = n_mul(y2, n_add(x1, y1)),
                k3 = n_mul(x2, n_sub(y1, x1));
            return new complex(n_sub(k1, k2), n_add(k1, k3));
        }
    },
    div: function(other) {
        var self = this;
        if (is_num(other))
        {
            return new complex(n_eq(self.re, O) ? O : n_div(self.re, other), n_eq(self.im, O) ? O : n_div(self.im, other));
        }
        else
        {
            // fast complex multiplication for inverse
            var m = other.norm2(),
                x1 = self.re,
                x2 = n_div(other.re, m),
                y1 = self.im,
                y2 = n_neg(n_div(other.im, m)),
                k1 = n_mul(x1, n_add(x2, y2)),
                k2 = n_mul(y2, n_add(x1, y1)),
                k3 = n_mul(x2, n_sub(y1, x1));
            return new complex(n_sub(k1, k2), n_add(k1, k3));
        }
    },
    pow: function(other) {
        var self = this, invother;
        if (is_nan(other))
        {
            return nan;
        }
        if (is_num(other))
        {
            return new complex(n_pow(self.abs(), other), n_mul(self.angle(), other), 'polar');
        }
        if (is_complex(other))
        {
            var rho = self.abs(), theta = self.angle();
            return (new complex(n_pow(rho, other.re), n_mul(other.im, realMath.log(rho)), 'polar')).mul(new complex(realMath.exp(n_neg(n_mul(other.im, theta))), n_mul(theta, other.re), 'polar'));
        }
    },
    neg: function() {
        return new complex(n_neg(this.re), n_neg(this.im));
    },
    conj: function() {
        return new complex(this.re, n_neg(this.im));
    },
    inv: function() {
        var self = this, m = self.norm2();
        return new complex(n_div(self.re, m), n_neg(n_div(self.im, m)));
    },
    toString: function() {
        var self = this;
        if (null == self._str)
        {
            self._str = num2str(self.re) + (n_lt(self.im, O) ? ' - ' : ' + ') + num2str(realMath.abs(self.im))+'i';
        }
        return self._str;
    },
    valueOf: function() {
        return _(this.re);
    }
};
i = new complex(O, I);
ze = new complex(constant.e, O);
constant["i"] = i;
constant["j"] = i;

complexMath = {
    floor: function(z) {
        return new complex(realMath.floor(z.re), realMath.floor(z.im));
    },
    ceil: function(z) {
        return new complex(realMath.ceil(z.re), realMath.ceil(z.im));
    },
    round: function(z) {
        return new complex(realMath.round(z.re), realMath.round(z.im));
    },
    fix: function(z) {
        return new complex(realMath.fix(z.re), realMath.fix(z.im));
    },
    sign: function(z) {
        return z.sign();
    },
    sqrt: function(z) {
        return new complex(realMath.sqrt(z.abs()), n_div(z.angle(), two), 'polar');
    },
    exp: function(z) {
        return ze.pow(z);
    },
    log: function(z) {
        return new complex(realMath.log(z.abs()), z.angle());
    },
    log10: function(z) {
        return complexMath.log(z).div(log_10);
    },
    log2: function(z) {
        return complexMath.log(z).div(log_2);
    },
    sin: function(z) {
      return new complex(n_mul(realMath.sin(z.re), realMath.cosh(z.im)), n_mul(realMath.cos(z.re), realMath.sinh(z.im)));
    },
    cos: function(z) {
      return new complex(n_mul(realMath.cos(z.re), realMath.cosh(z.im)), n_neg(n_mul(realMath.sin(z.re), realMath.sinh(z.im))));
    },
    tan: function(z) {
        return complexMath.sin(z).div(complexMath.cos(z));
    },
    sinh: function(z) {
      return new complex(n_mul(realMath.sinh(z.re), realMath.cos(z.im)), n_mul(realMath.cosh(z.re), realMath.sin(z.im)));
    },
    cosh: function(z) {
      return new complex(n_mul(realMath.cosh(z.re), realMath.cos(z.im)), n_mul(realMath.sinh(z.re), realMath.sin(z.im)));
    },
    tanh: function(z) {
        return complexMath.sinh(z).div(complexMath.cosh(z));
    },
    asin: function(z) {
        return i.neg().mul(complexMath.log(i.mul(z).add(complexMath.sqrt(complex(I, O).sub(z.pow(two))))));
    },
    acos: function(z) {
        return i.neg().mul(complexMath.log(z.add(i.mul(complexMath.sqrt(complex(I, O).sub(z.pow(two)))))));
    },
    atan: function(z) {
        return i.div(two).mul(complexMath.log(i.add(z).div(i.sub(z))));
    },
    asinh: function(z) {
        return complexMath.log(z.add(complexMath.sqrt(z.pow(two).add(I))));
    },
    acosh: function(z) {
        return complexMath.log(z.add(complexMath.sqrt(z.pow(two).sub(I))));
    },
    atanh: function(z) {
        return complexMath.log(z.add(I).div(z.neg().add(I))).div(two);
    }
};
$_.complexMath = complexMath;
fn.complex = complex;

(['floor','ceil','round','fix','sign','exp','log','log10','log2','sin','cos','tan','sinh','cosh','tanh','asin','acos','atan','asinh','acosh','atanh']).forEach(function(f) {
    fn[f] = complexMath[f] ? function(x) {
        return apply(function(x) {
            return is_complex(x) ? complexMath[f](x) : realMath[f](x);
        }, x, true);
    } : function(x) {
        return apply(function(x) {
            return realMath[f](x);
        }, x, false);
    };
});
fn.atan2 = function(y, x) {
    return apply2(function(y, x) {
        return realMath.atan2(y, x);
    }, y, x, false);
};
fn.sqrt = function(x) {
    return apply(function(x) {
        return is_complex(x) ? complexMath.sqrt(x) : (n_gt(O, x) ? new complex(O, realMath.sqrt(n_neg(x))) : realMath.sqrt(x));
    }, x, true);
};
(['sqrt','pow','log']).forEach(function(f) {
    fn['real'+f] = function(x) {
        return apply(function(x) {
            x = realify(x);
            if (is_complex(x)) not_supported("real"+f);
            var y = realMath[f](x);
            return is_nan(y) || !is_real(y) ? not_supported("real"+f) : y;
        }, x, true);
    };
});

fn.tofixed = function(x, d) {
    return is_num(x) ? x.toFixed(d || 10) : x;
};
// some special functions,
// eg erf, erfc, gamma, gammaln, gammainc, beta, betaln, betainc, ..
// TODO add more and/or improve speed and/or accuracy if needed
var __a1 =  0.254829592,
    __a2 = -0.284496736,
    __a3 =  1.421413741,
    __a4 = -1.453152027,
    __a5 =  1.061405429,
    __p  =  0.3275911,

    __p10 = 0.56418958354775629,
    __q10 = 2.06955023132914151,
    __p21 = 2.71078540045147805,
    __p20 = 5.80755613130301624,
    __q21 = 3.47954057099518960,
    __q20 = 12.06166887286239555,
    __p31 = 3.47469513777439592,
    __p30 = 12.07402036406381411,
    __q31 = 3.72068443960225092,
    __q30 = 8.44319781003968454,
    __p41 = 4.00561509202259545,
    __p40 = 9.30596659485887898,
    __q41 = 3.90225704029924078,
    __q40 = 6.36161630953880464,
    __p51 = 5.16722705817812584,
    __p50 = 9.12661617673673262,
    __q51 = 4.03296893109262491,
    __q50 = 5.13578530585681539,
    __p61 = 5.95908795446633271,
    __p60 = 9.19435612886969243,
    __q61 = 4.11240942957450885,
    __q60 = 4.48640329523408675,

    //__A  =  1.98,
    //__B  =  1.135,
    //__sqrt_pi = realMath.sqrt(constant.pi),

    __G = 7,
    __gP = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
    ],

    __sqrt_2pi = realMath.sqrt(n_mul(constant['2'], constant.pi)),
    __log_sqrt_2pi = n_mul(constant['1/2'], realMath.log(n_mul(constant['2'], constant.pi))),
    __log_pi = realMath.log(constant.pi),
    __12 = 12,
    __eps = 1e-15
;
update.push(function() {
__a1 = __( 0.254829592);
__a2 = __(-0.284496736);
__a3 = __( 1.421413741);
__a4 = __(-1.453152027);
__a5 = __( 1.061405429);
__p  = __( 0.3275911);

__p10 = __(0.56418958354775629);
__q10 = __(2.06955023132914151);
__p21 = __(2.71078540045147805);
__p20 = __(5.80755613130301624);
__q21 = __(3.47954057099518960);
__q20 = __(12.06166887286239555);
__p31 = __(3.47469513777439592);
__p30 = __(12.07402036406381411);
__q31 = __(3.72068443960225092);
__q30 = __(8.44319781003968454);
__p41 = __(4.00561509202259545);
__p40 = __(9.30596659485887898);
__q41 = __(3.90225704029924078);
__q40 = __(6.36161630953880464);
__p51 = __(5.16722705817812584);
__p50 = __(9.12661617673673262);
__q51 = __(4.03296893109262491);
__q50 = __(5.13578530585681539);
__p61 = __(5.95908795446633271);
__p60 = __(9.19435612886969243);
__q61 = __(4.11240942957450885);
__q60 = __(4.48640329523408675);

//__A  = __(1.98);
//__B  = __(1.135);
//__sqrt_pi = realMath.sqrt(constant.pi);

__gP = [
    __(0.99999999999980993),
    __(676.5203681218851),
    __(-1259.1392167224028),
    __(771.32342877765313),
    __(-176.61502916214059),
    __(12.507343278686905),
    __(-0.13857109526572012),
    __(9.9843695780195716e-6),
    __(1.5056327351493116e-7)
];

__sqrt_2pi = realMath.sqrt(n_mul(constant['2'], constant.pi));
__log_sqrt_2pi = n_mul(constant['1/2'], realMath.log(n_mul(constant['2'], constant.pi)));
__log_pi = realMath.log(constant.pi);

__12 = __(12);
__eps = __(1e-15);
});

// utils
function monotone_inverse_bisearch(f, y, min_x, max_x, min_f, max_f, lim_0, lim_1, dir)
{
    // find inverse x s.t f(x) <= y, f(.) is monotone
    // using binary search between min_x and max_x
    dir = -1 === dir ? -1 : 1; // increasing or decreasing
    if (null == min_f) min_f = O;
    if (null == max_f) max_f = I;
    if (is_nan(y)) return nan;
    else if (n_le(y, min_f)) return 0 > dir ? (null == lim_1 ? inf : lim_1) : (null == lim_0 ? -inf : lim_0);
    else if (n_ge(y, max_f)) return 0 > dir ? (null == lim_0 ? -inf : lim_0) : (null == lim_1 ? inf : lim_1);

    var two = constant['2'], x, fx;
    for (;;)
    {
        x = n_div(n_add(min_x, max_x), two);
        fx = f(x);
        if (is_nan(fx))
        {
            x = nan;
            break; // fails
        }
        if (n_gt(fx, y))
        {
            if (0 > dir)
            {
                min_x = x;
            }
            else
            {
                max_x = x;
            }
        }
        else if (n_lt(fx, y))
        {
            if (n_lt(n_sub(y, fx), __eps) || n_lt(n_sub(max_x, min_x), __eps)) break;
            if (0 > dir)
            {
                max_x = x;
            }
            else
            {
                min_x = x;
            }
        }
        else
        {
            break;
        }
    }
    return x;
}
function monotone_inverse_newton(f, df, y, min_x, max_x, min_f, max_f, lim_0, lim_1, dir)
{
    // find inverse x s.t f(x) ~ y, f(.) is monotone
    // using Newton's method between min_x and max_x
    dir = -1 === dir ? -1 : 1; // increasing or decreasing
    if (null == min_f) min_f = O;
    if (null == max_f) max_f = I;
    if (is_nan(y)) return nan;
    else if (n_le(y, min_f)) return 0 > dir ? (null == lim_1 ? inf : lim_1) : (null == lim_0 ? -inf : lim_0);
    else if (n_ge(y, max_f)) return 0 > dir ? (null == lim_0 ? -inf : lim_0) : (null == lim_1 ? inf : lim_1);

    var x = n_div(n_add(min_x, max_x), constant['2']), fx, dfx, max_iter = 100, tries;
    for (;max_iter;max_iter--)
    {
        fx = n_sub(f(x), y);
        tries = 10;
        while ((is_nan(fx) || is_inf(fx)) && (tries--))
        {
            x = n_add(min_x, n_mul(n_sub(max_x, min_x), __(stdMath.random())));
            fx = n_sub(f(x), y);
        }
        if (is_nan(fx) || is_inf(fx))
        {
            if (is_nan(fx)) x = nan;
            break; // fails
        }
        if (n_lt(scalar_abs(fx), __eps)) break;
        x = n_sub(x, n_div(fx, n_add(df(x), __eps)));
    }
    return x;
}

// erf
function erf(x)
{
    // https://en.wikipedia.org/wiki/Error_function#Bounds_and_numerical_approximations
    x = real(x);
    var sgn = n_lt(x, O) ? -1 : 1, t, erfx;
    if (sgn < 0) x = n_neg(x);
    t = n_inv(n_add(n_mul(__p, x), I));
    erfx = n_mul(sgn, n_sub(
    I, n_mul(n_add(n_mul(n_add(n_mul(n_add(n_mul(n_add(n_mul(__a5, t), __a4), t), __a3), t), __a2), t), __a1), n_mul(t, realMath.exp(n_neg(n_mul(x, x)))))));
    return erfx;
}

// erfc
function erfc(x)
{
    // https://en.wikipedia.org/wiki/Error_function#Bounds_and_numerical_approximations
    x = real(x);
    //return n_div(n_mul(n_sub(I, realMath.exp(n_neg(n_mul(__A, x)))), realMath.exp(n_neg(n_mul(x, x)))), n_mul(__B, n_mul(__sqrt_pi, x)));
    // better approximation
    var is_neg = n_lt(x, O), x2, erfcx;
    if (is_neg) x = n_neg(x);
    x2 = n_mul(x, x);
    erfcx = n_mul(
        realMath.exp(n_neg(x2)),
        n_mul(
        n_mul(
        n_mul(
        n_mul(
        n_mul(
            n_div(
                __p10,
                n_add(x, __q10)
            ),
            n_div(
                n_add(x2, n_add(n_mul(__p21, x), __p20)),
                n_add(x2, n_add(n_mul(__q21, x), __q20))
            )
        ),
            n_div(
                n_add(x2, n_add(n_mul(__p31, x), __p30)),
                n_add(x2, n_add(n_mul(__q31, x), __q30))
            )
        ),
            n_div(
                n_add(x2, n_add(n_mul(__p41, x), __p40)),
                n_add(x2, n_add(n_mul(__q41, x), __q40))
            )
        ),
            n_div(
                n_add(x2, n_add(n_mul(__p51, x), __p50)),
                n_add(x2, n_add(n_mul(__q51, x), __q50))
            )
        ),
            n_div(
                n_add(x2, n_add(n_mul(__p61, x), __p60)),
                n_add(x2, n_add(n_mul(__q61, x), __q60))
            )
        )
    );
    if (is_neg) erfcx = n_sub(constant['2'], erfcx);
    return erfcx;
}

// erfinv
function erfinv(x)
{
    x = real(x);
    if (n_lt(x, J) || n_gt(x, I)) return nan;
    return monotone_inverse_bisearch(
        erf,
        x, __(-100), __(100), J, I
    );
}

// erfcinv
function erfcinv(x)
{
    x = real(x);
    if (n_lt(x, O) || n_gt(x, constant['2'])) return nan;
    return monotone_inverse_bisearch(
        erfc,
        x, __(-100), __(100), O, constant['2'], -inf, inf, -1
    );
}

function factorial(n)
{
    // https://en.wikipedia.org/wiki/Factorial
    // simple factorial
    if (is_int(n) && n_ge(n, O))
    {
        n = realMath.floor(n);
        var f;
        if (n_ge(__12, n))
        {
            // pre-computed
            f = __(([1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600 /*MAX: 2147483647*/])[_(n)]);
        }
        else
        {
            for (f=__(479001600); n_lt(__12, n); n=n_sub(n, I)) f = n_mul(f, n);
        }
        return f;
    }
    return gamma(scalar_add(n, I));
}
function logfactorial(n)
{
    // https://en.wikipedia.org/wiki/Factorial
    // simple log factorial
    if (is_int(n) && n_ge(n, O))
    {
        n = realMath.floor(n);
        var f;
        if (n_ge(__12, n))
        {
            // pre-computed
            f = realMath.log(__(([1,1,2,6,24,120,720,5040,40320,362880,3628800,39916800,479001600 /*MAX: 2147483647*/])[_(n)]));
        }
        else
        {
            for (f=realMath.log(__(479001600)); n_lt(__12, n); n=n_sub(n, I)) f = n_add(f, realMath.log(n));
        }
        return f;
    }
    return gammaln(scalar_add(n, I));
}
function binom(n, k, inverse)
{
    // https://en.wikipedia.org/wiki/Binomial_coefficient
    // binomial = B(n,m) = B(n-1,m-1)+B(n-1,m) = n!/m!(n-m)! = Gamma(n+1)/Gamma(k+1)Gamma(n-k+1)
    var Bnk, i;
    if (is_int(n) && is_int(k) && n_le(O, k) && n_le(k, n))
    {
        if (n_eq(n, k) || n_eq(k, O))
        {
            Bnk = I;
        }
        else
        {
            // this is faster and will not overflow unnecesarily for default arithmetic
            n = n_sub(n, k);
            k = _(k);
            if ('inverse' === inverse)
            {
                for (Bnk=n_div(I, n_add(n, I)),i=2; i<=k; ++i)
                {
                    //Bnk /= (n+i)/i;
                    Bnk = n_div(Bnk, n_add(I, n_div(n, i)));
                }
            }
            else
            {
                for (Bnk=n_add(n, I),i=2; i<=k; ++i)
                {
                    //Bnk *= (n+i)/i;
                    Bnk = n_mul(Bnk, n_add(I, n_div(n, i)));
                }
                Bnk = realMath.round(Bnk);
            }
        }
    }
    else
    {
        if ('inverse' === inverse)
        {
            Bnk = scalar_mul(scalar_div(gamma(scalar_add(scalar_sub(n, k), I)), gamma(scalar_add(n, I))), gamma(scalar_add(k, I)));
        }
        else
        {
            Bnk = scalar_div(scalar_div(gamma(scalar_add(n, I)), gamma(scalar_add(k, I))), gamma(scalar_add(scalar_sub(n, k), I)));
        }
    }
    return Bnk;
}
function logbinom(n, k, inverse)
{
    // https://en.wikipedia.org/wiki/Binomial_coefficient
    // log binomial = log(B(n,m)) = log(n!)-log(m!)-log((n-m)!) = LogGamma(n+1)-LogGamma(k+1)-LogGamma(n-k+1)
    var Bnk, i;
    if (is_int(n) && is_int(k) && n_le(O, k) && n_le(k, n))
    {
        if (n_eq(n, k) || n_eq(k, O))
        {
            Bnk = O;
        }
        else
        {
            // this is faster and will not overflow unnecesarily for default arithmetic
            n = n_sub(n, k);
            k = _(k);
            for (Bnk=realMath.log(n_add(n, I)),i=2; i<=k; ++i)
            {
                //Bnk *= (n+i)/i;
                Bnk = n_add(Bnk, realMath.log(n_add(I, n_div(n, i))));
            }
        }
    }
    else
    {
        Bnk = scalar_sub(scalar_sub(gammaln(scalar_add(n, I)), gammaln(scalar_add(k, I))), gammaln(scalar_add(scalar_sub(n, k), I)));
    }
    return 'inverse' === inverse ? scalar_neg(Bnk) : Bnk;
}

function gamma(z)
{
    // gamma(z) function
    // https://en.wikipedia.org/wiki/Gamma_function
    // https://en.wikipedia.org/wiki/Lanczos_approximation
    // accuracy at least within 13 decimal places
    if (n_lt(real(z), constant['1/2']))
    {
        // Lanczos is not valid for this real(z). Use reflection formula.
        return scalar_div(constant.pi, scalar_mul(fn.sin(scalar_mul(constant.pi, z)), gamma(scalar_sub(I, z))));
    }
    else
    {
        z = realify(z);
        z = scalar_sub(z, I);
        if (is_int(z) && n_ge(z, O))
        {
            return factorial(z); // reduces to factorial
        }
        else
        {
            var z_1_2 = scalar_add(z, constant['1/2']),
                t = scalar_add(z_1_2, __G),
                x = scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                __gP[0],
                scalar_div(__gP[1], scalar_add(z, 1))
                ),
                scalar_div(__gP[2], scalar_add(z, 2))
                ),
                scalar_div(__gP[3], scalar_add(z, 3))
                ),
                scalar_div(__gP[4], scalar_add(z, 4))
                ),
                scalar_div(__gP[5], scalar_add(z, 5))
                ),
                scalar_div(__gP[6], scalar_add(z, 6))
                ),
                scalar_div(__gP[7], scalar_add(z, 7))
                ),
                scalar_div(__gP[8], scalar_add(z, 8))
                );
            return scalar_mul(scalar_mul(__sqrt_2pi, scalar_pow(t, z_1_2)), scalar_mul(fn.exp(scalar_neg(t)), x));
        }
    }
}
function gammaln(z)
{
    // log-gamma(z) function
    // https://en.wikipedia.org/wiki/Gamma_function
    // https://en.wikipedia.org/wiki/Lanczos_approximation
    // accuracy at least within 13 decimal places
    if (!is_real(z)) return nan;
    z = real(z);
    if (n_lt(z, O)) return nan;
    if (n_lt(z, constant['1/2']))
    {
        // Lanczos is not valid for this real(z). Use reflection formula.
        return scalar_sub(scalar_sub(__log_pi, fn.log(fn.sin(scalar_mul(constant.pi, z)))), gammaln(scalar_sub(I, z)));
    }
    else
    {
        z = scalar_sub(z, I);
        if (is_int(z) && n_ge(z, O))
        {
            return logfactorial(z); // reduces to log factorial
        }
        else
        {
            var z_1_2 = scalar_add(z, constant['1/2']),
                t = scalar_add(z_1_2, __G),
                x = scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                scalar_add(
                __gP[0],
                scalar_div(__gP[1], scalar_add(z, 1))
                ),
                scalar_div(__gP[2], scalar_add(z, 2))
                ),
                scalar_div(__gP[3], scalar_add(z, 3))
                ),
                scalar_div(__gP[4], scalar_add(z, 4))
                ),
                scalar_div(__gP[5], scalar_add(z, 5))
                ),
                scalar_div(__gP[6], scalar_add(z, 6))
                ),
                scalar_div(__gP[7], scalar_add(z, 7))
                ),
                scalar_div(__gP[8], scalar_add(z, 8))
                );
            return scalar_add(scalar_add(__log_sqrt_2pi, scalar_sub(scalar_mul(z_1_2, fn.log(t)), scalar_neg(t))), fn.log(x));
        }
    }
}
function gammainc(x, a, type)
{
    // gammainc(x,a) regularized incomplete gamma function
    // https://en.wikipedia.org/wiki/Incomplete_gamma_function
    if (!is_real(x) || !is_real(a)) return nan;
    x = real(x); a = real(a);
    if (n_lt(a, O)) return nan;
    var Ga = 'scaledlower' === type || 'scaledupper' === type ? a : n_mul(n_div(n_pow(x, a), gamma(a)), realMath.exp(n_neg(x))),
        t = n_eq(Ga, a) ? I : n_div(Ga, a),
        g = t;
    for (var k=1,N=25; k<=N; ++k) // power series up to N terms
    {
        t = n_mul(t, n_div(x, n_add(a, k)));
        g = n_add(g, t);
        if ((5 < k) && n_lt(scalar_abs(t), __eps)) break;
    }
    return 'scaledupper' === type ? n_sub(n_mul(gamma(n_add(a, I)), n_div(realMath.exp(x), n_pow(x, a))), g) : ('upper' === type ? n_sub(I, g) : g);
}
function gammaincinv(y, a, type)
{
    // gammaincinv(y,a) inverse regularized incomplete gamma function
    // https://en.wikipedia.org/wiki/Incomplete_gamma_function
    if (!is_real(y) || !is_real(a)) return nan;
    y = real(y); a = real(a);
    if (n_lt(a, O) || n_lt(y, O) || n_gt(y, I)) return nan;
    var s = 'scaledupper' === type || 'upper' === type ? -1 : 1,
        g = n_mul(gamma(a), s);
    return monotone_inverse_newton(
        function(x) {return gammainc(x, a, type);},
        function(x) {return n_neg(n_div(n_mul(n_pow(x, n_sub(a, I)), realMath.exp(n_neg(x))), g));},
        y, O, __(1e6), O, I, O, inf, s
    );
}

function beta(z, w)
{
    // beta(z, w) function
    // https://en.wikipedia.org/wiki/Beta_function
    if (!is_real(z) || !is_real(w)) return nan;
    z = real(z); w = real(w);
    if (n_lt(z, O) || n_lt(w, O)) return nan;
    if (n_eq(z, O) || n_eq(w, O)) return n_eq(z, w) ? nan : inf;
    if (is_int(z) && is_int(w))
    {
        // reduces to inverse binomial coeff
        return n_mul(n_add(z, w), n_div(binom(n_add(z, w), w, 'inverse'), n_mul(z, w)));
    }
    return scalar_mul(scalar_div(gamma(z), gamma(scalar_add(z, w))), gamma(w));
}
function betaln(z, w)
{
    // log-beta(z, w) function
    // https://en.wikipedia.org/wiki/Beta_function
    if (!is_real(z) || !is_real(w)) return nan;
    z = real(z); w = real(w);
    if (n_lt(z, O) || n_lt(w, O)) return nan;
    if (is_int(z) && is_int(w))
    {
        // reduces to inverse log-binomial coeff
        return n_add(realMath.log(n_add(z, w)), n_sub(logbinom(n_add(z, w), w, 'inverse'), realMath.log(n_mul(z, w))));
    }
    return scalar_add(scalar_sub(gammaln(z), gammaln(scalar_add(z, w))), gammaln(w));
}
function _betainc_cont_frac(x, z, w, regularized)
{
    var p, q, p1, p0,
        q1, q0, r0, r,
        m, k, ak, bk
    ;
    p1 = I;
    p0 = O;
    q1 = O;
    q0 = I;
    bk = I;
    ak = n_div(
        n_mul(n_div(n_pow(x, z), z), n_pow(n_sub(I, x), w)),
        'regularized' === regularized ? beta(z, w) : I
    );
    p = ak;
    q = I;
    r = ak;
    p1 = p0; p0 = p;
    q1 = q0; q0 = q;
    r0 = r;
    for (k=1;;++k)
    {
        if (k & 1)
        {
            m = (k-1) >> 1;
            ak = n_neg(n_div(n_mul(n_mul(x, n_add(z, m)), n_add(n_add(z, w), m)), n_mul(n_add(z, 2*m), n_add(z, 2*m+1))));
        }
        else
        {
            m = k >> 1;
            ak = n_div(n_mul(x, n_mul(n_sub(w, m), m)), n_mul(n_add(z, 2*m), n_add(z, 2*m-1)));
        }
        p = n_add(n_mul(bk, p0), n_mul(ak, p1));
        q = n_add(n_mul(bk, q0), n_mul(ak, q1));
        r = n_div(p, q);

        if ((5 < k) && n_lt(scalar_abs(n_sub(r, r0)), __eps)) break;

        p1 = p0; p0 = p;
        q1 = q0; q0 = q;
        r0 = r;
    }
    return r;
}
/*function _betainc_series_10(x, z, w)
{
}
function _betainc_series_11(x, z, w)
{
}
function _betainc_erfc(x, z, w)
{
}*/
function betainc(x, z, w, tail)
{
    // regularized incomplete beta(x, z, w) function
    // https://en.wikipedia.org/wiki/Beta_function

    if (!is_real(x) || !is_real(z) || !is_real(w)) return nan;
    x = real(x); z = real(z); w = real(w);

    if (n_lt(x, O) || n_gt(x, I) || n_lt(z, O) || n_lt(w, O)) return nan;

    if (n_eq(x, O)) return 'upper' === tail ? I : O;
    else if (n_eq(x, I)) return 'upper' === tail ? O : I;

    var xt = n_div(z, n_add(z, w)), b;
    /*
    // "Computation of the regularized incomplete Beta function",
    // Vera Egorova, Amparo Gil, Javier Segura, Nico M. Temme, 2023
    if (n_gt(z, 50) && n_gt(w, 50) && n_gt(n_add(z, w), 700) && n_lt(scalar_abs(n_sub(x, xt)), 0.2))
    {
        //Use the error function approximation in Section 2.3.1.
        b = _betainc_erfc(x, z, w);
    }
    else if (n_gt(z, 100) && n_lt(w, 10))
    {
        if (n_lt(x, 0.85))
        {
            //Use the series expansion (10).
            b = _betainc_series_10(x, z, w);
        }
        else
        {
            //Use the continued fraction (5).
            b = _betainc_cont_frac(x, z, w, 'regularized');
        }
    }
    else
    {
        if (n_gt(w, n_div(n_mul(n_sub(I, x), z), x)))
        {
            //Use the continued fraction (5).
            b = _betainc_cont_frac(x, z, w, 'regularized');
        }
        else
        {
            //Use the series expansion (11).
            b = _betainc_series_11(x, z, w);
        }
    }
    */
    if (n_ge(x, xt))
    {
        // use reflection, more efficient
        b = n_sub(I, _betainc_cont_frac(n_sub(I, x), w, z, 'regularized'));
    }
    else
    {
        // converges rapidly for x < xt
        b = _betainc_cont_frac(x, z, w, 'regularized');
    }
    return 'upper' === tail ? n_sub(I, b) : b;
}
function betaincinv(y, z, w, tail)
{
    // betaincinv(y,z,w) inverse regularized incomplete beta function
    // https://en.wikipedia.org/wiki/Beta_function
    if (!is_real(y) || !is_real(z) || !is_real(w)) return nan;
    y = real(y); z = real(z); w = real(w);

    if (n_lt(y, O) || n_gt(y, I) || n_lt(z, O) || n_lt(w, O)) return nan;
    var s = 'upper' === tail ? -1 : 1, b = n_mul(beta(z, w), s);
    return monotone_inverse_newton(
        function(x) {return betainc(x, z, w, tail);},
        function(x) {return n_div(n_mul(n_pow(x, n_sub(z, I)), n_pow(n_sub(I, x), n_sub(w, I))), b);},
        y, O, I, O, I, O, I, s
    );
}

// add them
fn.erf = function(x) {
    return apply(erf, x, true);
};
fn.erfc = function(x) {
    return apply(erfc, x, true);
};
fn.erfinv = function(x) {
    return apply(erfinv, x, true);
};
fn.erfcinv = function(x) {
    return apply(erfcinv, x, true);
};
fn.factorial = function(n) {
    return apply(factorial, n, false);
};
fn.logfactorial = function(n) {
    return apply(logfactorial, n, false);
};
fn.gamma = function(x) {
    return apply(gamma, x, true);
};
fn.gammaln = function(x) {
    return apply(gammaln, x, true);
};
fn.gammainc = function(x, a, type) {
    return apply_(function(x, a) {return gammainc(x, a, type);}, [x, a]);
};
fn.gammaincinv = function(y, a, type) {
    return apply_(function(y, a) {return gammaincinv(y, a, type);}, [y, a]);
};
fn.beta = function(z, w) {
    return apply_(beta, [z, w]);
};
fn.betaln = function(z, w) {
    return apply_(betaln, [z, w]);
};
fn.betainc = function(x, z, w, tail) {
    return apply_(function(x, z, w) {return betainc(x, z, w, tail);}, [x, z, w]);
};
fn.betaincinv = function(y, z, w, tail) {
    return apply_(function(y, z, w) {return betaincinv(y, z, w, tail);}, [y, z, w]);
};
function real(x)
{
    return apply(function(x) {return is_complex(x) ? x.re : x;}, x, true);
}
fn.real = real;
function imag(x)
{
    return apply(function(x) {return is_complex(x) ? x.im : 0;}, x, true);
}
fn.imag = imag;
function conj(x)
{
    return apply(scalar_conj, x, true);
}
fn.conj = conj;
function abs(x)
{
    return apply(scalar_abs, x, true);
}
fn.abs = abs;
function angle(x)
{
    return apply(scalar_angle, x, true);
}
fn.angle = angle;
function norm(x, p)
{
    if (null == p) p = two;
    if (is_inf(p))
    {
        x = vec(x);
        if (is_scalar(x))
        {
            return scalar_abs(x);
        }
        else if (is_vector(x))
        {
            return n_lt(p, O) ? min(abs(x)) : max(abs(x));
        }
        else if (is_matrix(x))
        {
            if (n_gt(p, O))
            {
                return max(sum(abs(transpose(x))));
            }
        }
    }
    else if (is_num(p))
    {
        x = vec(x);
        if (n_eq(p, I))
        {
            if (is_scalar(x))
            {
                return scalar_abs(x);
            }
            else if (is_vector(x))
            {
                return sum(abs(x));
            }
            else if (is_matrix(x))
            {
                return max(sum(abs(x)));
            }
        }
        else if (n_eq(p, two))
        {
            if (is_scalar(x))
            {
                return scalar_abs(x);
            }
            else if (is_vector(x))
            {
                return d_euclidean(x);
            }
            else if (is_matrix(x))
            {
                return max(svd(x, null, false, false));
            }
        }
        else if (n_gt(p, O))
        {
            if (is_scalar(x))
            {
                return scalar_abs(x);
            }
            else if (is_vector(x))
            {
                return d_minkowski(x, p);
                //return n_pow(sum(x.map(function(xi) {return scalar_pow(scalar_abs(xi), p);})), n_inv(p));
            }
        }
    }
    else if ('fro' === p)
    {
        if (is_matrix(x))
        {
            return realMath.sqrt(trace(real(mul(ctranspose(x), x))));
        }
    }
    not_supported("norm");
}
fn.norm = norm;
/*function arrayfun(fn, arrays, nargout)
{
    nargout = nargout || 1;
    var arr = arrays.reduce(function(arr, a) {return arr ? arr : (is_array(a) ? a : arr);}, null),
        sz = is_array(arr) /*&& !arrays[0].$scilitecell$* / ? (is_1d(arr) ? [arr.length] : size(arr)) : [], output, promises = [], type, res;

    if (arrays.length !== arrays.filter(function(arr) {return !is_array(arr) /*&& !arr.$scilitecell$* / || arr_eq(sz, is_1d(arr) ? [arr.length] : size(arr));}).length) not_supported("arrayfun");

    arrays = arrays.map(function(arr) {return is_array(arr) ? tensorview(arr, {shape:sz, ndarray:sz}) : arr;});
    output = array(nargout, sz.length ? function() {return tensorview(ndarray(sz, null), {shape:sz, ndarray:sz});} : null);
    type = array(nargout, "");

    if ((1 < nargout) && is_callable(fn.nargout)) fn = fn.nargout(nargout);

    function set(i, res)
    {
        if ((1 < nargout) && is_array(res))
        {
            res = vec(res);
            output.forEach(function(outj, j) {
                if (j >= res.length) return;
                if (i)
                {
                    outj.set(i, check_type(type, j, res[j]));
                }
                else
                {
                    output[j] = res[j];
                }
            });
        }
        else if (i)
        {
            output[0].set(i, check_type(type, 0, res));
        }
        else
        {
            output[0] = res;
        }
        return res;
    }
    function ret()
    {
        return sz.length ? (1 < nargout ? output.map(function(out, j) {return "c" === type[j] ? cellarray(out.toNDArray(), sz.slice()) : (out.toNDArray());}) : (arr ? ("c" === type[0] ? cellarray(output[0].toNDArray(), sz.slice()) : (output[0].toNDArray())) : (output[0].get([0])))) : (1 < nargout ? output : (output[0]));
    }

    if (sz.length)
    {
        ndarray.indices(sz, function(i) {
            var res = fn.apply(null, arrays.map(function(arr) {return is_instance(arr, tensorview) ? arr.get(i) : arr;}));
            if (is_instance(res, Promise))
            {
                promises.push(res.then((function(i) {return function(res) {return set(i, res);};})(i.slice())));
            }
            else
            {
                set(i, res);
            }
        });
    }
    else
    {
        res = fn.apply(null, arrays);
        if (is_instance(res, Promise))
        {
            promises.push(res.then(function(res) {return set(null, res);}));
        }
        else
        {
            set(null, res);
        }
    }
    return promises.length ? Promise.all(promises).then(ret) : ret();
}*/
fn.arrayfun = varargout(function(nargout, fn/*..arrays*/) {
    if (!is_callable(fn) || (3 > arguments.length)) not_supported("arrayfun");
    //return arrayfun(fn, [].slice.call(arguments, 2), nargout);
    if ((1 < nargout) && is_callable(fn.nargout)) fn = fn.nargout(nargout);
    return apply_(fn, [].slice.call(arguments, 2), null, nargout);
});
function cell(/*args*/)
{
    var args = arguments, dims = [0, 0];
    if (1 === args.length)
    {
        // single dim, or vector of dims passed as arg
        dims = vec(args[0]).map(_);
    }
    else if (1 < args.length)
    {
        // dims passed as args
        dims = [].map.call(args, _);
    }
    if (1 > dims.length) dims = [0, 0];
    else if (2 > dims.length) dims.push(dims[0]);
    return cellarray(ndarray(dims, function() {return [];}), dims);
}
fn.cell = cell;
fn.iscell = function(x) {
    return is_cell(x) ? 1 : 0;
};function zeros()
{
    var dims = [].slice.call(arguments);
    if (!dims.length) return O;
    if ((1 === dims.length) && is_vector(dims[0])) dims = dims[0];
    dims = fn.fix(dims).map(_);
    if (1 === dims.length) dims = [dims[0], dims[0]];
    return ndarray(dims, O);
}
fn.zeros = zeros;
function ones()
{
    var dims = [].slice.call(arguments);
    if (!dims.length) return I;
    if ((1 === dims.length) && is_vector(dims[0])) dims = dims[0];
    dims = fn.fix(dims).map(_);
    if (1 === dims.length) dims = [dims[0], dims[0]];
    return ndarray(dims, I);
}
fn.ones = ones;
function eye(n, d)
{
    if (null == d) d = I;
    if (null == n) n = 1;
    if (is_vector(n)) n = n[0];
    n = sca(n, true);
    return matrix(_(n), _(n), function(i, j) {
        return i === j ? d : O;
    });
}
fn.eye = function(n) {
    return eye(fn.fix(n), I);
};
function rand()
{
    var dims = [].slice.call(arguments);
    if (!dims.length) return __(stdMath.random());
    if ((1 === dims.length) && is_vector(dims[0])) dims = dims[0];
    dims = fn.fix(dims).map(_);
    if (1 === dims.length) dims = [dims[0], dims[0]];
    return ndarray(dims, function() {
        return __(stdMath.random());
    });
}
fn.rand = rand;
function randi(n/*, dims*/)
{
    var imax, imin = 1, dims = [].slice.call(arguments, 1);
    n = fn.fix(n);
    if (is_vector(n) && (2 <= n.length))
    {
        imin = _(n[0]);
        imax = _(n[1]);
    }
    else
    {
        imax = _(sca(n, true));
    }
    if (!dims.length) return __(imin + stdMath.round(stdMath.random()*(imax - imin)));
    if ((1 === dims.length) && is_vector(dims[0])) dims = dims[0];
    dims = fn.fix(dims).map(_);
    if (1 === dims.length) dims = [dims[0], dims[0]];
    return ndarray(dims, function() {
        return __(imin + stdMath.round(stdMath.random()*(imax - imin)));
    });
}
fn.randi = randi;
function randn()
{
    var dims = [].slice.call(arguments);
    if (!dims.length) return __(normal());
    if ((1 === dims.length) && is_vector(dims[0])) dims = dims[0];
    dims = fn.fix(dims).map(_);
    if (1 === dims.length) dims = [dims[0], dims[0]];
    return ndarray(dims, function() {
        return __(normal());
    });
}
fn.randn = randn;
function magic(n)
{
    // adapted from Octave
    var odd = n & 1,
        even = 1 - odd,
        doubly_even = 0 === (/*n%4*/n&3),
        nn = n*n, n2 = (n-odd) >> 1,
        n22, n12, n21,
        k, I, J, t, m2, m;

    if (odd) // odd order
    {
        // O(n^2)
        return matrix(n, n, function(i, j) {
            var A = (i+1+j+1+(n-3)/2) % n,
                B = (i+1+2*(j+1)-2) % n;
            if (0 > A) A += n;
            if (0 > B) B += n;
            return n*A + B + 1;
        });
    }

    else if (doubly_even) // doubly-even order
    {
        // O(n^2)
        k = 0;
        return matrix(n, n, function(i, j) {
            ++k;
            return (((i+1)/*%4*/ & 3) >> 1 === ((j+1)/*%4*/ & 3) >> 1) ? (nn - (k-1)) : (k);
        });
    }

    else //if (even) // singly-even order
    {
        // O((n/2)^2)
        n22 = n2*n2;
        m2 = magic(n2);
        m = matrix(n, n, function(i, j) {
            if (i < n2)
            {
                return j < n2 ? m2[i][j] : (m2[i][j-n2]+2*n22);
            }
            else if (j < n2)
            {
                return i < n2 ? m2[i][j] : (m2[i-n2][j]+3*n22);
            }
            else
            {
                return m2[i-n2][j-n2]+n22;
            }
        });
        k = (n2-1)/2;
        if (k > 1)
        {
            for (I=1; I<=n2; ++I)
            {
                for (J=2; J<=k; ++J)
                {
                    t = m[I-1][J-1];
                    m[I-1][J-1] = m[I+n2-1][J-1];
                    m[I+n2-1][J-1] = t;
                }
                for (J=n-k+2; J<=n; ++J)
                {
                    t = m[I-1][J-1];
                    m[I-1][J-1] = m[I+n2-1][J-1];
                    m[I+n2-1][J-1] = t;
                }
            }
        }
        for (I=1; I<=k; ++I)
        {
            t = m[I-1][0];
            m[I-1][0] = m[I+n2-1][0];
            m[I+n2-1][0] = t;
        }
        for (I=k+2; I<=n2; ++I)
        {
            t = m[I-1][0];
            m[I-1][0] = m[I+n2-1][0];
            m[I+n2-1][0] = t;
        }
        t = m[k][k-1];
        m[k][k-1] = m[k+n2][k-1];
        m[k+n2][k-1] = t;
        return m;
    }
}
fn.magic = function(n) {
    n = sca(fn.fix(n), true);
    n = is_int(n) ? _(n) : null;
    if (!is_int(n) || (2 >= n)) return 1 === n ? [[I]] : [];
    var m = magic(n);
    return matrix(n, n, function(i, j) {return __(m[i][j]);});
};
function pascal(n)
{
    // adapted from https://github.com/foo123/FILTER.js
    return matrix(n, n, function(i, j, mat) {
        return 0 === i ? 1 : (0 === j ? 1 : (mat[i-1][j]+mat[i][j-1]));
    });
}
fn.pascal = function(n) {
    if (1 < arguments.length) not_supported("pascal");
    n = fn.fix(sca(n, true));
    n = is_int(n) ? _(n) : null;
    if (!is_int(n) || (0 >= n)) return [];
    var p = pascal(n);
    return matrix(n, n, function(i, j) {return __(p[i][j]);});
};
fn.rosser = function() {
    return [
    [ __(  611), __( 196),  __(-192), __( 407), __(  -8), __( -52),  __( -49),  __(  29)],
    [ __(  196), __( 899),  __( 113), __(-192), __( -71), __( -43),  __(  -8),  __( -44)],
    [ __( -192), __( 113),  __( 899), __( 196), __(  61), __(  49),  __(   8),  __(  52)],
    [ __(  407), __(-192),  __( 196), __( 611), __(   8), __(  44),  __(  59),  __( -23)],
    [ __(   -8), __( -71),  __(  61), __(   8), __( 411), __(-599),  __( 208),  __( 208)],
    [ __(  -52), __( -43),  __(  49), __(  44), __(-599), __( 411),  __( 208),  __( 208)],
    [ __(  -49), __(  -8),  __(   8), __(  59), __( 208), __( 208),  __(  99),  __(-911)],
    [ __(   29), __( -44),  __(  52), __( -23), __( 208), __( 208),  __(-911),  __(  99)]
    ];
};fn.vander = function(v) {
    v = vec(v);
    if (!is_vector(v)) not_supported("vander");
    return v.map(function(vi) {
        return array(v.length, function(j, vij) {
            return 0 === j ? I : scalar_mul(vij[j-1], vi);
        }).reverse();
    });
};
fn.toeplitz = function(c, r) {
    if (1 === arguments.length)
    {
        r = vec(c);
        return matrix(r.length, r.length, function(i, j) {
            return i === j ? r[0] : (j > i ? r[stdMath.abs(i-j)] : scalar_conj(r[stdMath.abs(i-j)]));
        });
    }
    else
    {
        c = vec(c);
        r = vec(r);
        return matrix(c.length, r.length, function(i, j) {
            return i === j ? c[0] : (j > i ? r[stdMath.abs(i-j)] : c[stdMath.abs(i-j)]);
        });
    }
};fn.hankel = function(c, r) {
    var m, n, p;
    if (1 === arguments.length)
    {
        c = vec(c);
        m = c.length;
        return matrix(m, m, function(i, j) {
            return j > m-1-i ? O : c[(i+j) % m];
        });
    }
    else
    {
        c = vec(c);
        r = vec(r);
        m = c.length;
        n = r.length;
        //p = c.concat(r.slice(1));
        return matrix(n, n, function(i, j) {
            return i+j-1 >= m ? r[i+j - m] : c[(i+j) % m];//p[i+j-1];
        });
    }
};function hadamard(n)
{
    if (1 === n)
    {
        return [[I]];
    }
    if (2 === n)
    {
        return [[I, I], [I, J]];
    }
    if (4 === n)
    {
        return [[I, I, I, I], [I, J, I, J], [I, I, J, J], [I, J, J, I]];
    }
    if (0 === (n % 4))
    {
        var HH = hadamard(n/2);
        return HH.length ? kron([[I, I], [I, J]], HH) : [];
    }
    return [];
}
fn.hadamard = function(n) {
    return hadamard(_(n));
};fn.hilb = function(n) {
    n = _(sca(n, true));
    return matrix(n, n, function(i, j) {
        return __(1 / (i+1 + j+1 - 1));
    });
};
fn.invhilb = function(n) {
    n = _(sca(n, true));
    var h = fn.hilb(n);
    // exact or approximate inverse
    return n < 10 ? inv(h) : ainv(h);
};function linspace(a, b, n)
{
    if (null == n) n = 100;
    n = _(n);
    var step = n_div(n_sub(b, a), n-1), ans = new Array(n);
    for (var i=0,ai=a; i<n; ++i,ai=n_add(ai, step)) ans[i] = ai;
    return ans;
}
fn.linspace = linspace;
function logspace(a, b, n)
{
    if (null == n) n = 100;
    n = _(n);
    var step = n_pow(n_div(b, a), 1/(n-1)), ans = new Array(n);
    for (var i=0,ai=a; i<n; ++i,ai=scalar_mul(ai, step)) ans[i] = ai;
    return ans;
}
fn.logspace = logspace;
function meshgrid(x, y)
{
    var X, Y;
    if (null == y)
    {
        y = x;
    }
    x = vec(x); y = vec(y);
    if (is_vector(x) && is_vector(y))
    {
        X = matrix(y.length, x.length, function(i, j) {
            return x[j];
        });
        Y = matrix(y.length, x.length, function(i, j) {
            return y[i];
        });
        return [X, Y];
    }
    not_supported("meshgrid");
}
fn.meshgrid = varargout(function(nargout, x, y) {
    return meshgrid(x, y);
}, 2);
function ndgrid(nargout, x)
{
    x = x.map(function(xi) {return vec(xi);});
    var k, ans = [],
        dims = array(nargout, function(i) {
            return (1 === x.length ? x[0] : x[i]).length;
        })
    ;
    for (k=0; k<nargout; ++k)
    {
        ans.push(ndarray(dims, function(i) {
            return (1 === x.length ? x[0] : x[k])[i[k]];
        }));
    }
    return 1 === nargout ? ans[0] : ans;
}
fn.ndgrid = varargout(function(nargout) {
    return ndgrid(nargout, [].slice.call(arguments, 1));
});
function colon(a, b, c)
{
    var ans, sz, i, n;
    if ((1 === arguments.length) && is_array(a))
    {
        // a(:)
        if (is_2d(a))
        {
            /*var rows = ROWS(a), cols = COLS(a), i, j, k;
            ans = new Array(cols*rows);
            for (k=0,j=0; j<cols; ++j)
            {
                for (i=0; i<rows; ++i)
                {
                    ans[k++] = a[i][j];
                }
            }
            return ans;*/
            sz = size(a);
            // use octave-compatible columnwise-ordering by permuting back and forth
            ans = tensorview(a, {shape:sz,ndarray:sz}).permute(array(sz.length, function(i) {return sz.length-1-i;})).toArray();
            if (a.$scilitecell$) ans = cellarray(ans, [ans.length]);
            return ans;
        }
        return a;
    }
    else
    {
        // a:b:c
        if ((null != c) && (null != b))
        {
            // three inputs
        }
        else if (null != b)
        {
            // two inputs
            c = b;
            b = I;
        }
        else
        {
            // one input
            c = a;
            b = I;
            a = I;
        }
        a = sca(a, true);
        b = sca(b, true);
        c = sca(c, true);
        n = stdMath.max(0, stdMath.floor(stdMath.abs(_(n_div(n_sub(c, a), b))))+1);
        if (n_gt(b, O) && n_le(a, c))
        {
            ans = new Array(n);
            for (i=0; n_le(a, c); a=n_add(a, b),++i) ans[i] = a;
            if (null == ans[n-1]) ans[n-1] = min([a, c]);
        }
        else if (n_lt(b, O) && n_ge(a, c))
        {
            ans = new Array(n);
            for (i=0; n_ge(a, c); a=n_add(a, b),++i) ans[i] = a;
            if (null == ans[n-1]) ans[n-1] = max([a, c]);
        }
        else
        {
            ans = [];
        }
        return ans;
    }
}
fn.colon = function(a, b, c) {
    if ((1 === arguments.length) && is_array(a))
    {
        // a(:)
        return vec2col(colon(a));
    }
    return colon.apply(null, arguments);
};
function cat_horz(A, B)
{
    if (is_0d(A) && is_0d(B))
    {
        return [A, B];
    }
    else if (is_1d(A) && is_1d(B))
    {
        return A.concat(B);
    }
    else if (is_2d(A, true) && is_2d(B, true) && (ROWS(A) === ROWS(B)))
    {
        return A.map(function(Ai, i) {
            return Ai.concat(B[i]);
        });
    }
    throw "incompatible array dimensions";
}
function cat_vert(A, B)
{
    if (is_0d(A) && is_0d(B))
    {
        return [[A], [B]];
    }
    else if (is_1d(A) && is_1d(B))
    {
        return A.concat(B);
    }
    else if (is_2d(A, true) && is_2d(B, true) && (COLS(A) === COLS(B)))
    {
        return A.concat(B);
    }
    throw "incompatible array dimensions";
}
function cat(dim, A, B)
{
    var sizeA = size(A), sizeB = size(B);
    if (dim > sizeA.length)
    {
        sizeA = sizeA.concat(array(dim-sizeA.length, 1));
    }
    if (dim > sizeB.length)
    {
        sizeB = sizeB.concat(array(dim-sizeB.length, 1));
    }
    return tensorview(A, {shape:sizeA}).concat(tensorview(B, {shape:sizeB}), dim-1).toNDArray();
    /*if (2 === dim)
    {
        return cat_horz(A, B);
    }
    if (1 === dim)
    {
        return cat_vert(A, B);
    }
    not_supported("cat");*/
}
fn.cat = function(dim, A, B /*,..*/) {
    dim = _(dim);
    var ans = [], i;
    ans = arguments[1];
    for (i=2; i<arguments.length; ++i)
    {
        ans = cat(dim, ans, arguments[i]);
    }
    /*if (1 === dim)
    {
        // vert
        ans = arguments[1];
        for (i=2; i<arguments.length; ++i)
        {
            ans = cat("vert", ans, arguments[i]);
        }
    }
    else if (2 === dim)
    {
        // horz
        ans = arguments[1];
        for (i=2; i<arguments.length; ++i)
        {
            ans = cat("horz", ans, arguments[i]);
        }
    }*/
    return ans;
};
fn.horzcat = function(A, B /*,..*/) {
    var ans, i;
    // horz
    ans = arguments[0];
    for (i=1; i<arguments.length; ++i)
    {
        ans = cat(2, ans, arguments[i]);
    }
    return ans;
};
fn.vertcat = function(A, B /*,..*/) {
    var ans, i;
    // vert
    ans = arguments[0];
    for (i=1; i<arguments.length; ++i)
    {
        ans = cat(1, ans, arguments[i]);
    }
    return ans;
};
function transpose(x)
{
    var ans;
    if (is_2d(x, true))
    {
        ans = matrix(COLS(x), ROWS(x), function(i, j) {
            return x[j][i];
        });
        if (x.$scilitecell$) ans = cellarray(ans, [x.$scilitecell$[1], x.$scilitecell$[0]].concat(x.$scilitecell$.slice(2)));
        return ans;
    }
    return x;
}
fn.transpose = function(x) {
    if (is_1d(x)) x = vec2row(x);
    return transpose(x);
};
function ctranspose(x)
{
    var ans;
    if (is_2d(x, true))
    {
        ans = matrix(COLS(x), ROWS(x), function(i, j) {
            return is_scalar(x[j][i]) ? scalar_conj(x[j][i]) : x[j][i];
        });
        if (x.$scilitecell$) ans = cellarray(ans, [x.$scilitecell$[1], x.$scilitecell$[0]].concat(x.$scilitecell$.slice(2)));
        return ans;
    }
    else if (is_1d(x))
    {
        ans = x.map(function(xi) {
            return is_scalar(xi) ? scalar_conj(xi) : xi;
        });
        if (x.$scilitecell$) ans = cellarray(ans, x.$scilitecell$.slice());
        return ans;
    }
    else if (is_scalar(x))
    {
        return scalar_conj(x);
    }
    return x;
}
fn.ctranspose = function(x) {
    if (is_1d(x)) x = vec2row(x);
    return ctranspose(x);
};
function diag(x, k)
{
    k = _(k || 0);
    if (is_0d(x))
    {
        return [[x]];
    }
    x = vec(x);
    if (is_1d(x))
    {
        return matrix(x.length, x.length, function(i, j) {
            return k === i - j ? x[i] : O;
        });
    }
    if (is_2d(x, true))
    {
        return x.reduce(function(diag, xi, i) {
            return xi.reduce(function(diag, xij, j) {
                if (k === i - j) diag.push(xij);
                return diag;
            }, diag);
        }, []);
    }
    not_supported("diag");
}
fn.diag = diag;
function blkdiag(matrices)
{
    var rows = 0, cols = 0, k = 0,
        mat, mat_rows, mat_cols,
        offset_row = 0, offset_col = 0;
    matrices.forEach(function(mat, i) {
        if (is_0d(mat)) matrices[i] = mat = [[mat]];
        if (is_1d(mat)) matrices[i] = mat = diag(mat);
        if (!is_2d(mat, true)) not_supported("blkdiag");
        rows += ROWS(mat);
        cols += COLS(mat);
    });
    mat = matrices[k];
    mat_rows = ROWS(mat);
    mat_cols = COLS(mat);
    return matrix(rows, cols, function(row, col) {
        if (row >= offset_row+mat_rows)
        {
            offset_row += mat_rows;
            offset_col += mat_cols;
            mat = matrices[++k];
            mat_rows = ROWS(mat);
            mat_cols = COLS(mat);
        }
        return (col < offset_col) || (col >= offset_col+mat_cols) ? O : (mat[row-offset_row][col-offset_col]);
    });
}
fn.blkdiag = function(/*..args*/) {
    return blkdiag([].slice.call(arguments));
};
function tril(x, k)
{
    if (is_2d(x, true))
    {
        k = _(k || 0);
        return matrix(ROWS(x), COLS(x), function(i, j) {
            return j <= i+k ? x[i][j] : O;
        });
    }
    not_supported("tril");
}
fn.tril = tril;
function triu(x, k)
{
    if (is_2d(x, true))
    {
        k = _(k || 0);
        return matrix(ROWS(x), COLS(x), function(i, j) {
            return j >= i+k ? x[i][j] : O;
        });
    }
    not_supported("triu");
}
fn.triu = triu;
function repmat(x)
{
    var n = [].slice.call(arguments, 1), sz = size(x);
    if (is_array(n[0])) n = n[0];
    n = n.map(_);
    if (1 === n.length) n = array(sz.length, n[0]);
    if (is_array(x))
    {
        if (sz.length < n.length) sz = sz.concat(array(n.length-sz.length, 1));
        else if (n.length < sz.length) n = n.concat(array(sz.length-n.length, 1));
    }
    if (!is_array(x) || (sz.length === n.length))
    {
        if (is_1d(x)) x = [x];
        return ndarray(is_array(x) ? n.map(function(ni, i) {return sz[i]*ni;}) : n, function(indices) {
            return indices.reduce(function(arr, index, dim) {
                return (dim < sz.length) && is_array(arr) ? arr[index % sz[dim]] : arr;
            }, x);
        });
    }
   return x;
}
fn.repmat = repmat;
function repelem(x, n)
{
    if (is_array(x))
    {
        if (is_2d(x))
        {
            // higher-dim array
            var sz = size(x), rn = [].slice.call(arguments, 1).map(_);
            if (sz.length === rn.length)
            {
                return ndarray(sz.map(function(di, i) {return di*rn[i];}), function(indices) {
                    return indices.reduce(function(arr, index, dim) {return arr[stdMath.floor(index / rn[dim])];}, x);
                });
            }
        }
        else
        {
            // 1-dim array
            if (is_array(n)) n = vec(n);
            if (is_vector(n))
            {
                if (n.length === x.length)
                {
                    var cnt = 0, i = -1;
                    return array(_(sum(n)), function(j) {
                        if (j === cnt) {++i; cnt += _(n[i]);}
                        return x[i];
                    });
                }
            }
            else if (is_int(n))
            {
                n = _(n);
                var i = -1;
                return array(n*x.length, function(j) {
                    if (0 === (j % n)) ++i;
                    return x[i];
                });
            }
        }
    }
    return x;
}
fn.repelem = repelem;
function reshape(x/*sz, rows, cols*/)
{
    var sz = [].slice.call(arguments, 1), rem,
        sizex = is_2d(x) ? size(x) : [x.length], total = _(prod(sizex));

    if ((1 === sz.length) && is_array(sz[0]) && sz[0].length) sz = vec(sz[0]);

    rem = sz.reduce(function(total, s) {
        return is_array(s) && !s.length ? total : stdMath.floor(total / _(s));
    }, total);

    sz = sz.map(function(s) {
        return is_array(s) && !s.length ? rem : _(s);
    });
    function ret(o)
    {
        return x.$scilitecell$ ? cellarray(o.toNDArray(), o.shape()) : (o.toNDArray());
    }

    // use octave-compatible columnwise-ordering by permuting back and forth
    //return ret(tensorview(tensorview(x, {shape:sizex,ndarray:sizex}).permute(array(sizex.length, function(i) {return sizex.length-1-i;})).toArray(), {shape:sz.reverse()}).permute(array(sz.length, function(i) {return sz.length-1-i;})));
    return ret(tensorview(x, {shape:sizex,ndarray:sizex}).permute(array(sizex.length, function(i) {return sizex.length-1-i;})).reshape(sz.reverse()).permute(array(sz.length, function(i) {return sz.length-1-i;})));
}
fn.reshape = reshape;
function permute(x, dimorder)
{
    return tensorview(x).permute(vec(dimorder).map(function(di) {return _(di)-1;})).toNDArray();
}
fn.permute = function(x, dimorder) {
    return permute(x, dimorder);
};
function squeeze(x, dim)
{
    if (is_array(x))
    {
        if (null == dim) dim = 1;
        if ((1 === x.length) && (2 < dim))
        {
            // squeeze only higher dimensions than 2
            return squeeze(x[0], dim+1);
        }
        else
        {
            return x.map(function(xi) {
                return squeeze(xi, dim+1);
            });
        }
    }
    else
    {
        return x;
    }
}
fn.squeeze = function(x) {
    return is_nd(x) ? squeeze(x) : x;
};
function rot90(x, k)
{
    if (is_2d(x))
    {
        var sizex, order, rows, cols, view,
            ret = x.$scilitecell$ ? function(o) {
                return cellarray(o.toNDArray(), o.shape());
            } : function(o) {
                return o.toNDArray();
            };
        if (null == k) k = 1;
        k = stdMath.round(_(k)) % 4;
        if (0 > k) k += 4;
        if (is_nd(x))
        {
            // nd array
            sizex = size(x);
            rows = sizex[0];
            cols = sizex[1];
            view = tensorview(x, {shape:sizex, ndarray:sizex});
            if (1 === k)
            {
                order = [1, 0].concat(array(sizex.length-2, function(i) {return 2+i;}));
                return ret(view.permute(order).slice(order.map(function(oi) {return 1 === oi ? '-1:-1:0' : ':';})));
            }
            else if (3 === k)
            {
                order = [1, 0].concat(array(sizex.length-2, function(i) {return 2+i;}));
                return ret(view.permute(order).slice(order.map(function(oi) {return 0 === oi ? '-1:-1:0' : ':';})));
            }
            else if (2 === k)
            {
                order = array(sizex.length, function(i) {return i;});
                return ret(view.slice(order.map(function(oi) {return 0 === oi || 1 === oi ? '-1:-1:0' : ':';})));
            }
        }
        else
        {
            rows = ROWS(x);
            cols = COLS(x);
            if (1 === k)
            {
                return ret(matrix(cols, rows, function(j, i) {return x[i][cols-1-j];}));
            }
            else if (3 === k)
            {
                return ret(matrix(cols, rows, function(j, i) {return x[rows-1-i][j];}));
            }
            else if (2 === k)
            {
                return ret(matrix(rows, cols, function(i, j) {return x[rows-1-i][cols-1-j];}));
            }
        }
    }
    return x;
}
fn.rot90 = function(x, k) {
    if (is_1d(x)) x = vec2row(x);
    return rot90(x, k);
};
function flip(x, dim)
{
    if (is_0d(x))
    {
        return x;
    }
    else if (is_1d(x))
    {
        return x.slice().reverse();
    }
    else if (is_2d(x))
    {
        dim = _(dim);
        var sizex = size(x),
            view = tensorview(x, {shape:sizex, ndarray:sizex});
        return view.slice(sizex.map(function(sz, di) {
            if (null == dim)
            {
                if (1 !== sz)
                {
                    dim = di+1;
                    return '-1:-1:0';
                }
                return ':';
            }
            return di+1 === dim ? '-1:-1:0' : ':';
        })).toNDArray();
        /*var rows = ROWS(x), cols = COLS(x);
        if (1 === dim)
        {
            return matrix(rows, cols, function(row, col) {
                return x[rows-1-row][col];
            });
        }
        else if (2 === dim)
        {
            return matrix(rows, cols, function(row, col) {
                return x[row][cols-1-col];
            });
        }
        return x;*/
    }
    not_supported("flip");
}
fn.flip = flip;
fn.fliplr = function(x) {
    return flip(x, 2);
};
fn.flipud = function(x) {
    return flip(x, 1);
};
function cmp_str(a, b)
{
    var sa = String(a), sb = String(b);
    return sa < sb ? -1 : (sa > sb ? 1 : 0);
}
function cmp_real(a, b)
{
    var ra = real(a), rb = real(b),
        ia = imag(a), ib = imag(b),
        r = n_lt(ra, rb) ? -1 : (n_gt(ra, rb) ? 1 : 0),
        i = n_lt(ia, ib) ? -1 : (n_gt(ia, ib) ? 1 : 0);
    return r || i;
}
function cmp_abs(a, b)
{
    var aba = scalar_abs(a), abb = scalar_abs(b),
        ana = scalar_angle(a), anb = scalar_angle(b),
        ab = n_lt(aba, abb) ? -1 : (n_gt(aba, abb) ? 1 : 0),
        an = n_lt(ana, anb) ? -1 : (n_gt(ana, anb) ? 1 : 0);
    return ab || an;
}
function sort(x, dim, dir, cmp, with_indices)
{
    var ans;
    if (!is_array(x))
    {
        // 0d
        return x;
    }
    else if (is_1d(x))
    {
        // 1d
        if (null == cmp) cmp = is_string(x[0]) ? cmp_str : (is_real(x) ? cmp_real : cmp_abs);
        ans = x.map(function(v, i) {return {v:v, i:i};}).sort('descend' === dir ? function(a, b) {
            return cmp(b.v, a.v) || (a.i - b.i);
        } : function(a, b) {
            return cmp(a.v, b.v) || (a.i - b.i);
        });
        return with_indices ? [ans.map(function(vi) {return vi.v;}), ans.map(function(vi) {return vi.i+1;})] : ans.map(function(vi) {return vi.v;});
    }
    else if (is_2d(x, true))
    {
        // 2d
        if (1 === dim)
        {
            if (with_indices)
            {
                ans = array(COLS(x), function(c) {
                    var col = COL(x, c);
                    return sort(col, dim, dir, null == cmp ? (is_string(col[0]) ? cmp_str : (is_real(col) ? cmp_real : cmp_abs)) : cmp, true);
                });
                return [matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[j][0][i];
                }), matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[j][1][i];
                })];
            }
            else
            {
                ans = array(COLS(x), function(c) {
                    var col = COL(x, c);
                    return sort(col, dim, dir, null == cmp ? (is_string(col[0]) ? cmp_str : (is_real(col) ? cmp_real : cmp_abs)) : cmp, false);
                });
                return matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[j][i];
                });
            }
        }
        else if (2 === dim)
        {
            if (with_indices)
            {
                ans = array(ROWS(x), function(r) {
                    var row = ROW(x, r);
                    return sort(row, dim, dir, null == cmp ? (is_string(row[0]) ? cmp_str : (is_real(row) ? cmp_real : cmp_abs)) : cmp, true);
                });
                return [matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[i][0][j];
                }), matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[i][1][j];
                })];
            }
            else
            {
                ans = array(ROWS(x), function(r) {
                    var row = ROW(x, r);
                    return sort(row, dim, dir, null == cmp ? (is_string(row[0]) ? cmp_str : (is_real(row) ? cmp_real : cmp_abs)) : cmp, false);
                });
                return matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[i][j];
                });
            }
        }
    }
    not_supported("sort");
}
fn.sort = varargout(namevalueargs(function(nargout, x, dim, dir) {
    var nv = arguments[arguments.length-1]._, cmp = null;
    if ('real' === nv.ComparisonMethod) cmp = cmp_real;
    else if ('abs' === nv.ComparisonMethod) cmp = cmp_abs;
    else if ('str' === nv.ComparisonMethod) cmp = cmp_str;
    if (nv === dim)
    {
        dim = 1;
        dir = 'ascend';
    }
    else if (nv === dir)
    {
        dir = 'ascend';
    }
    if (null == dir) dir = 'ascend';
    if (null == dim) dim = 1;
    dim = _(dim);
    return sort(x, dim, dir, cmp, 1 < nargout);
}, {
    ComparisonMethod: null
}));
function unique(x, ord, occ, rows, nargout)
{
    if (!is_array(x)) not_supported("unique");
    nargout = nargout || 1;
    x = colon(x);
    var ans = [], found = {},
        ia = null, ic = null;
    x.forEach(function(v, i) {
        var k = String(v);
        if (HAS.call(found, k))
        {
            found[k][1] = i;
        }
        else
        {
            found[k] = [i, i];
            ans.push(v);
        }
    });
    if ("sorted" === ord) ans = sort(ans);
    if (1 < nargout)
    {
        ia = ans.map(function(v) {return found[String(v)]["last" === occ ? 1 : 0] + 1;});
    }
    if (2 < nargout)
    {
        found = ans.map(function(v) {return String(v);});
        ic = x.map(function(v) {return found["last" === occ ? 'lastIndexOf' : 'indexOf'](String(v)) + 1;});
    }
    return 1 < nargout ? [ans, ia, ic] : ans;
}
function uniquetol(x, tol, occ, rows, nargout)
{
    if (!is_array(x)) not_supported("uniquetol");
    if (null == tol) tol = 1e-12;
    nargout = nargout || 1;
    tol = __(scalar_abs(tol));
    x = colon(x);
    var ans = [],
        ia = 1 < nargout ? [] : null,
        ic = 2 < nargout ? new Array(x.length) : null,
        xx = is_real(x) ? x : abs(x),
        t = n_mul(tol, max(abs(x))),
        m_x, m_i;

    for (;;)
    {
        m_i = 0;
        m_x = x.reduce("highest" === occ ? function(m_x, xi, i) {
            if (null != xi)
            {
                if ((null == m_x) || n_gt(xx[i], m_x))
                {
                    m_x = xi;
                    m_i = i;
                }
            }
            return m_x;
        } : function(m_x, xi, i) {
            if (null != xi)
            {
                if ((null == m_x) || n_lt(xx[i], m_x))
                {
                    m_x = xi;
                    m_i = i;
                }
            }
            return m_x;
        }, null);

        if (null == m_x) break;

        ans.push(m_x);
        if (ia) ia.push(m_i+1);
        x = x.map(function(xi, i) {
            if ((null != xi) && n_le(scalar_abs(scalar_sub(xi, m_x)), t))
            {
                if (ic) ic[i] = ans.length;
                return null;
            }
            return xi;
        });
    }
    return 1 < nargout ? [ans, ia, ic] : ans;
}
fn.unique = varargout(function(nargout, x) {
    var ord = "sorted", occ = "first", rows = '', i = 2;
    if ("stable" === arguments[i] || "sorted" === arguments[i]) ord = arguments[i++];
    if ("first" === arguments[i] || "last" === arguments[i]) occ = arguments[i++];
    //if ("rows" === arguments[i]) rows = 'rows';
    return unique(x, ord, occ, rows, nargout);
});
fn.uniquetol = varargout(function(nargout, x) {
    var tol = 1e-12, occ = "lowest", rows = '', i = 2;
    if (is_scalar(arguments[i])) tol = real(arguments[i++]);
    if ("lowest" === arguments[i] || "highest" === arguments[i]) occ = arguments[i++];
    //if ("rows" === arguments[i]) rows = 'rows';
    return uniquetol(x, tol, occ, rows, nargout);
});
function intersect(x, y, ord, rows, nargout)
{
    if (!is_array(x) || !is_array(y)) not_supported("intersect");
    nargout = nargout || 1;
    x = colon(x);
    y = colon(y);
    var ans = [], found = {},
        ia = null, ib = null;
    x.forEach(function(v, i) {
        var k = String(v);
        if (!HAS.call(found, k))
        {
            found[k] = [i, -1];
        }
    });
    y.forEach(function(v, i) {
        var k = String(v);
        if (HAS.call(found, k))
        {
            found[k][1] = i;
            ans.push(v);
        }
    });
    if ("sorted" === ord) ans = sort(ans);
    if (1 < nargout)
    {
        ia = ans.map(function(v) {return found[String(v)][0] + 1;});
    }
    if (2 < nargout)
    {
        ib = ans.map(function(v) {return found[String(v)][1] + 1;});
    }
    return 1 < nargout ? [ans, ia, ib] : ans;
}
fn.intersect = varargout(function(nargout, x, y) {
    var ord = "sorted", rows = '', i = 3;
    if ("rows" === arguments[i]) rows = arguments[i++];
    if ("stable" === arguments[i] || "sorted" === arguments[i]) ord = arguments[i++];
    if ("rows" === arguments[i]) rows = 'rows';
    return intersect(x, y, ord, rows, nargout);
});
function union(x, y, ord, rows, nargout)
{
    if (!is_array(x) || !is_array(y)) not_supported("union");
    nargout = nargout || 1;
    x = colon(x);
    y = colon(y);
    var ans = [], found = {},
        ia = null, ib = null;
    x.forEach(function(v, i) {
        var k = String(v);
        if (!HAS.call(found, k))
        {
            found[k] = [i, -1];
            ans.push(v);
        }
    });
    y.forEach(function(v, i) {
        var k = String(v);
        if (!HAS.call(found, k))
        {
            found[k] = [-1, i];
            ans.push(v);
        }
        else if (0 > found[k][1])
        {
            found[k][1] = i;
        }
    });
    if ("sorted" === ord) ans = sort(ans);
    if (1 < nargout)
    {
        ia = ans.map(function(v) {return found[String(v)][0] + 1;}).filter(function(i) {return 0 < i;});
    }
    if (2 < nargout)
    {
        ib = ans.map(function(v) {return found[String(v)][1] + 1;}).filter(function(i) {return 0 < i;});
    }
    return 1 < nargout ? [ans, ia, ib] : ans;
}
fn.union = varargout(function(nargout, x, y) {
    var ord = "sorted", rows = '', i = 3;
    if ("rows" === arguments[i]) rows = arguments[i++];
    if ("stable" === arguments[i] || "sorted" === arguments[i]) ord = arguments[i++];
    if ("rows" === arguments[i]) rows = 'rows';
    return union(x, y, ord, rows, nargout);
});
function min(x, y, dim, ComparisonMethod, method)
{
    if ("ComparisonMethod" === ComparisonMethod)
    {
        if (("real" !== method) && ("abs" !== method)) method = "auto";
    }
    else
    {
        method = "auto";
    }
    //y = vec(y); // not supported yet
    var cmp = "auto" === method ? (is_real(x) ? cmp_real : cmp_abs) : ("abs" === method ? cmp_abs : cmp_real);
    return group_apply("value", function(min, xi) {
        return -1 === cmp(xi, min) ? xi : min;
    }, inf, nan, vec(x), vec(dim));
}
fn.min = min;
function max(x, y, dim, ComparisonMethod, method)
{
    if ("ComparisonMethod" === ComparisonMethod)
    {
        if (("real" !== method) && ("abs" !== method)) method = "auto";
    }
    else
    {
        method = "auto";
    }
    //y = vec(y); // not supported yet
    var cmp = "auto" === method ? (is_real(x) ? cmp_real : cmp_abs) : ("abs" === method ? cmp_abs : cmp_real);
    return group_apply("value", function(max, xi) {
        return -1 === cmp(max, xi) ? xi : max;
    }, -inf, nan, vec(x), vec(dim));
}
fn.max = max;
function sum(x, dim)
{
    return group_apply("value", function(sum, xi) {
        return scalar_add(sum, xi);
    }, O, nan, vec(x), vec(dim));
}
fn.sum = sum;
function prod(x, dim)
{
    return group_apply("value", function(prod, xi) {
        return scalar_mul(prod, xi);
    }, I, nan, vec(x), vec(dim));
}
fn.prod = prod;
function dot(a, b, asreal)
{
    asreal = true === asreal;
    a = vec(a);
    b = vec(b);
    if (is_scalar(a) && is_scalar(b))
    {
        return scalar_mul(a, asreal ? b : scalar_conj(b));
    }
    else if (is_vector(a) && is_vector(b))
    {
        if (a.length === b.length)
        {
            return a.reduce(function(sum, ai, i) {
                return scalar_add(sum, scalar_mul(ai, asreal ? b[i] : scalar_conj(b[i])));
            }, 0);
        }
    }
    else if (is_matrix(a) && is_matrix(b))
    {
        if ((ROWS(a) === ROWS(b)) && (COLS(a) === COLS(b)))
        {
            return array(COLS(a), function(column) {
                return dot(COL(a, column), COL(b, column), asreal);
            });
        }
    }
    return 0;
}
fn.dot = dot;
fn.cross = function(a, b) {
    a = vec(a); b = vec(b);
    if (!is_vector(a) || (3 !== a.length)) throw "cross: input 1 not vector of length 3";
    if (!is_vector(b) || (3 !== b.length)) throw "cross: input 2 not vector of length 3";
    return [
        scalar_sub(scalar_mul(a[1], b[2]), scalar_mul(a[2], b[1])),
        scalar_sub(scalar_mul(a[2], b[0]), scalar_mul(a[0], b[2])),
        scalar_sub(scalar_mul(a[0], b[1]), scalar_mul(a[1], b[0]))
    ];
};
function kron(x, y)
{
    var xrows, xcols, yrows, ycols;
    if (is_matrix(x))
    {
        if (is_matrix(y))
        {
            xrows = ROWS(x);
            xcols = COLS(x);
            yrows = ROWS(y);
            ycols = COLS(y);
            return matrix(xrows*yrows, xcols*ycols, function(i, j) {
                return mul(x[stdMath.floor(i / yrows)][stdMath.floor(j / ycols)], y[i % yrows][j % ycols]);
            });
        }
        else if (is_vector(y))
        {
            xrows = ROWS(x);
            xcols = COLS(x);
            yrows = 1;
            ycols = y.length;
            return matrix(xrows*yrows, xcols*ycols, function(i, j) {
                return mul(x[i][stdMath.floor(j / ycols)], y[j % ycols]);
            });
        }
    }
    else if (is_vector(x))
    {
        if (is_vector(y))
        {
            return matrix(x.length, y.length, function(i, j) {
                return mul(x[i], y[j]);
            });
        }
        else if (is_matrix(y))
        {
            xrows = x.length;
            xcols = 1;
            yrows = ROWS(y);
            ycols = COLS(y);
            return matrix(xrows*yrows, xcols*ycols, function(i, j) {
                return mul(x[stdMath.floor(i / yrows)], y[i % yrows][j % ycols]);
            });
        }
    }
    return mul(x, y);
}
fn.kron = kron;
function diff(x, dim)
{
    x = vec(x);
    if (is_vector(x))
    {
        return 1 < x.length ? array(x.length-1, function(i) {
            return scalar_sub(x[i+1], x[i]);
        }) : [];
    }
    else if (is_2d(x))
    {
        var sizex = size(x), view = tensorview(x, {shape:sizex, ndarray:sizex}), aux = {};
        ndarray.indices(sizex.filter(function(_, di) {return dim !== di+1;}), function(i) {
            var dj = 0;
            aux[i.join(',')] = diff(view.slice(array(sizex.length, function(di) {
                return dim === di+1 ? ':' : (i[dj++]);
            })).toArray());
        });
        return squeeze(ndarray(sizex.map(function(sz, di) {return dim === di+1 ? sz-1 : sz;}), function(i) {
            return aux[i.slice(0, dim-1).concat(i.slice(dim)).join(',')][i[dim-1]];
        }));
    }
    not_supported("diff");
}
fn.diff = function(x, n, dim) {
    if (null == n) n = 1;
    if (!is_int(n)) not_supported("diff");
    n = _(n);
    var sizex = size(x);
    if (null == dim)
    {
        dim = 2 === sizex.length ? 1 : (sizex.reduce(function(dim, sz, di) {
            if ((null == dim) && (1 < sz)) dim = di;
            return dim;
        }, null) || 0) + 1;
    }
    dim = _(dim);
    while (0 < n--) x = diff(x, dim);
    return x;
};
function trapz(x, y, dim)
{
    if (is_vector(y))
    {
        var i, n, ans;
        if ((null == x) || is_scalar(x))
        {
            if (null == x) x = I/*scalar_div(scalar_abs(scalar_sub(y[n], y[0])), n+1)*/;
            for (i=0,n=y.length-1,ans=O; i<n; ++i)
            {
                ans = scalar_add(ans, scalar_mul(x, scalar_div(scalar_add(y[i+1], y[i]), two)));
            }
            return ans;
        }
        else if (is_vector(x))
        {
            if (x.length === y.length)
            {
                for (i=0,n=x.length-1,ans=O; i<n; ++i)
                {
                    ans = scalar_add(ans, scalar_mul(scalar_abs(scalar_sub(x[i+1], x[i])), scalar_div(scalar_add(y[i+1], y[i]), two)));
                }
                return ans;
            }
            throw "trapz: x,y dimensions do not match";
        }
    }
    else if (is_2d(y))
    {
        var sizey = size(y), view = tensorview(y, {shape:sizey, ndarray:sizey}), aux = {};
        if (null == dim)
        {
            dim = 2 === sizey.length ? 1 : (sizey.reduce(function(dim, sz, di) {
                if ((null == dim) && (1 < sz)) dim = di;
                return dim;
            }, null) || 0) + 1;
        }
        dim = _(dim);
        ndarray.indices(sizey.filter(function(_, di) {return dim !== di+1;}), function(i) {
            var dj = 0;
            aux[i.join(',')] = trapz(x, view.slice(array(sizey.length, function(di) {
                return dim === di+1 ? ':' : (i[dj++]);
            })).toArray());
        });
        return squeeze(ndarray(sizey.map(function(sz, di) {return dim === di+1 ? 1 : sz;}), function(i) {
            return aux[i.slice(0, dim-1).concat(i.slice(dim)).join(',')];
        }));
    }
    not_supported("trapz");
}
fn.trapz = function(x, y, dim) {
    if (3 > arguments.length)
    {
        if (is_array(y))
        {
            dim = null;
        }
        else if (is_array(x))
        {
            dim = is_int(y) ? y : null;
            y = x;
            x = null;
        }
    }
    return trapz(is_array(x) ? vec(x) : x, vec(y), dim);
};
function cumtrapz(x, y, dim)
{
    return group_apply("block-series", function(y) {
        if ((null == x) || is_scalar(x))
        {
            return y.map(function(yi, i) {
                return trapz(x, y.slice(0, i+1));
            });
        }
        else if (is_vector(x))
        {
            if (x.length === y.length)
            {
                return y.map(function(yi, i) {
                    return trapz(x.slice(0, i+1), y.slice(0, i+1));
                });
            }
            throw "cumtrapz: x,y dimensions do not match";
        }
    }, null, false, vec(y), dim);
}
fn.cumtrapz = function(x, y, dim) {
    if (3 > arguments.length)
    {
        if (is_array(y))
        {
            dim = null;
        }
        else if (is_array(x))
        {
            dim = is_int(y) ? y : null;
            y = x;
            x = null;
        }
    }
    return cumtrapz(is_array(x) ? vec(x) : x, vec(y), dim);
};
function cum(x, f, dir, dim)
{
    if (null == dir) dir = "forward";
    return group_apply("series", function(accum, xi) {
        return null == accum ? xi : f(accum, xi);
    }, null, false, vec(x), vec(dim), dir);
}
fn.cumsum = function(x, dim, dir) {
    var ans = cum(x, scalar_add, dir, dim);
    if (false === ans) not_supported("cumsum");
    return ans;
};
fn.cumprod = function(x, dim, dir) {
    var ans = cum(x, scalar_mul, dir, dim);
    if (false === ans) not_supported("cumprod");
    return ans;
};
fn.cummin = function(x, dim, dir) {
    var cmp = is_real(x) ? cmp_real : cmp_abs,
        ans = cum(x, function(a, b) {return -1 === cmp(a, b) ? a : b;}, dir, dim);
    if (false === ans) not_supported("cummin");
    return ans;
};
fn.cummax = function(x, dim, dir) {
    var cmp = is_real(x) ? cmp_real : cmp_abs,
        ans = cum(x, function(a, b) {return 1 === cmp(a, b) ? a : b;}, dir, dim);
    if (false === ans) not_supported("cummax");
    return ans;
};
function mov(x, f, kb, kf, dim)
{
    return group_apply("block-series", function(x) {
        var n = x.length;
        return array(n, function(i) {
            return f(x.slice(stdMath.max(0, i-kb), stdMath.min(n-1, i+kf)+1));
        });
    }, null, false, vec(x), vec(dim));
}
fn.movsum = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, sum, kb, kf, dim);
    if (false === ans) not_supported("movsum");
    return ans;
};
fn.movprod = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, prod, kb, kf, dim);
    if (false === ans) not_supported("movprod");
    return ans;
};
fn.movmean = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, mean, kb, kf, dim);
    if (false === ans) not_supported("movmean");
    return ans;
};
fn.movmin = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, min, kb, kf, dim);
    if (false === ans) not_supported("movmin");
    return ans;
};
fn.movmax = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, max, kb, kf, dim);
    if (false === ans) not_supported("movmax");
    return ans;
};
function bitshift(x, k)
{
    return apply(function(x) {return is_int(x) ? (n_lt(k, O) ? (_(x) >> (-_(k))) : (_(x) << _(k))) : x}, x, true);
}
fn.bitshift = bitshift;
function bitand(x, y)
{
    if (is_int(x))
    {
        if (is_int(y)) return _(x) & _(y);
        else if (is_array(y)) return y.map(function(yi) {return bitand(x, yi);});
    }
    else if (is_array(x))
    {
        if (is_int(y)) return x.map(function(xi) {return bitand(xi, y);});
        else if (is_array(y) && (x.length === y.length)) return x.map(function(xi, i) {return bitand(xi, y[i]);});
    }
    return 0;
}
fn.bitand = bitand;
function bitor(x, y)
{
    if (is_int(x))
    {
        if (is_int(y)) return _(x) | _(y);
        else if (is_array(y)) return y.map(function(yi) {return bitor(x, yi);});
    }
    else if (is_array(x))
    {
        if (is_int(y)) return x.map(function(xi) {return bitor(xi, y);});
        else if (is_array(y) && (x.length === y.length)) return x.map(function(xi, i) {return bitor(xi, y[i]);});
    }
    return 0;
}
fn.bitor = bitor;
function bitxor(x, y)
{
    if (is_int(x))
    {
        if (is_int(y)) return _(x) ^ _(y);
        else if (is_array(y)) return y.map(function(yi) {return bitxor(x, yi);});
    }
    else if (is_array(x))
    {
        if (is_int(y)) return x.map(function(xi) {return bitxor(xi, y);});
        else if (is_array(y) && (x.length === y.length)) return x.map(function(xi, i) {return bitxor(xi, y[i]);});
    }
    return 0;
}
fn.bitxor = bitxor;
function nd_size(x)
{
    return is_array(x) ? ([x.length]).concat(nd_size(x[0])) : [];
}
function size(x)
{
    var dims = [].slice.call(arguments, 1), sizex;
    if (is_array(dims[0])) dims = vec(dims[0]);
    if ((null != x) && x.$scilitecell$)
    {
        // cell array with given dims
        sizex = x.$scilitecell$.slice();
        if (sizex.length < 1) sizex = [1, 1];
        else if (sizex.length < 2) sizex.unshift(sizex[0] ? 1 : 0);
    }
    else if (is_2d(x))
    {
        // 2d or ndarray
        sizex = nd_size(x);
    }
    else if (is_1d(x))
    {
        // vector
        sizex = x.length ? [1, x.length] : [0, 0];
    }
    else
    {
        // scalar
        sizex = [1, 1];
    }
    return dims.length ? dims.map(function(dim) {return sizex[_(dim)-1];}) : sizex;
    //return [];
}
fn.size = varargout(function(nargout, x) {
    var sz = size.apply(null, [].slice.call(arguments, 1));
    if (1 < nargout)
    {
        if (sz.length < nargout) sz.push.apply(sz, array(nargout-sz.length, 1));
        else if (sz.length > nargout) sz.length = nargout;
    }
    return sz;
});
function length(x)
{
    if (is_array(x)) return x.length ? stdMath.max.apply(null, size(x)) : 0;
    return null == x ? 0 : 1;
}
fn.length = length;
function ndims(x)
{
    return 2 + size(x).slice(2)/*.filter(function(d) {return 1 < d;})*/.length;
}
fn.ndims = ndims;
function numel(x)
{
    return prod(size(x));
}
fn.numel = numel;
fn.rows = function(x) {
    return size(x, 1);
};
fn.columns = function(x) {
    return size(x, 2);
};
function _sub2ind(dims, indices)
{
    var array_indices = indices.filter(function(ind) {return is_array(ind);});
    if (array_indices.length)
    {
        return array_indices[0].map(function(_, j) {
            return _sub2ind(dims, indices.map(function(i) {return is_array(i) ? i[j] : i;}));
        });
    }
    else
    {
        // use octave-compatible columnwise-ordering by permuting back and forth
        return tensorview(0, {shape:dims.slice().reverse()}).index(indices.map(function(i) {return _(i)-1;}).reverse())+1;
    }
}
function _ind2sub(dims, ind)
{
    if (is_array(ind))
    {
        var indices = array(dims.length, function() {return array(ind.length, 0);});
        ind.forEach(function(ind, i) {
            _ind2sub(dims, ind).forEach(function(_indices, j) {
                indices[j][i] = _indices;
            });
        });
        return indices;
    }
    else
    {
        // use octave-compatible columnwise-ordering by permuting back and forth
        return 1 === dims.length ? [_(ind), 1] : (tensorview(0, {shape:dims.slice().reverse()}).indices(_(ind)-1).map(function(i) {return i+1;}).reverse());
    }
}
function sub2ind(dims/*, i, j*/)
{
    var indices = [].slice.call(arguments, 1);
    if (1 === indices.length && is_array(indices[0])) indices = indices[0];
    return _sub2ind(vec(dims), indices);

    /*if (is_vector(i))
    {
        j = i[1];
        i = i[0];
    }
    i = _(i); j = _(j);
    return 1 === dims.length ? i : ((i-1)+_(dims[0])*(j-1)+1);*/
}
function ind2sub(dims, ind)
{
    dims = vec(dims);
    return _ind2sub(dims, ind);

    /*ind = _(ind);
    return 1 === dims.length ? [ind, 1] : [((ind-1) % _(dims[0])) + 1, stdMath.floor((ind-1) / _(dims[0])) + 1];*/
}
fn.sub2ind = function(/*args*/) {
    return sub2ind.apply(null, [].slice.call(arguments));
};
fn.ind2sub = varargout(function(nargout, dims, ind) {
    return ind2sub(dims, ind);
});
function find(x, check, n, dir, nargout)
{
    nargout = nargout || 1;
    if (null == n) n = inf;
    if (is_array(x))
    {
        var row = 1 < nargout ? [] : null,
            col = 1 < nargout ? [] : null,
            val = 2 < nargout ? [] : null,
            xx = colon(x),
            tot = xx.length,
            rows = x.length,
            cols = rows ? tot/rows : 0,
            r = 1, c = 1,
            ind = [],
            i, xi, di = 'last' === dir ? -1 : 1;

        for (i='last' === dir ? tot-1 : 0; 0 <= i && i < tot && ind.length < n; i+=di)
        {
            xi = xx[i];
            if (r > rows)
            {
                ++c;
                r = 1;
            }
            if ('last' === dir)
            {
                if (check(xi, rows-r+1, cols-c+1))
                {
                    ind.push(i+1);
                    if (row) row.push(rows-r+1);
                    if (col) col.push(cols-c+1);
                    if (val) val.push(xi);
                }
            }
            else
            {
                if (check(xi, r, c))
                {
                    ind.push(i+1);
                    if (row) row.push(r);
                    if (col) col.push(c);
                    if (val) val.push(xi);
                }
            }
            ++r;
        }
        return 1 < nargout ? [row, col, val] : ind;
    }
    return [];
}
$_.find = find;
fn.find = varargout(function(nargout, x, n, dir) {
    return find(x, function(x) {return !eq(x, O);}, is_int(n) ? _(n) : null, dir || 'first', nargout);
});
function all(x, check)
{
    if (is_scalar(x))
    {
        return check(x, 1, 1) ? 1 : 0;
    }
    else if (is_vector(x, false))
    {
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (!check(x[i], i+1, 1)) return 0;
        }
        return 1;
    }
    else if (is_matrix(x, false))
    {
        for (var i=0,rows=ROWS(x),cols=COLS(x); i<rows; ++i)
        {
            for (var j=0; j<cols; ++j)
            {
                if (!check(x[i][j], i+1, j+1)) return 0;
            }
        }
        return 1;
    }
    else if (is_nd(x))
    {
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (!all(x[i], function(xi) {return check.apply(null, [xi, i+1].concat([].slice.call(arguments, 1)));})) return 0;
        }
        return 1;
    }
    return 0;
}
$_.all = all;
fn.all = function(x) {
    return all(x, function(x) {return !eq(x, O);});
};
function any(x, check)
{
    if (is_scalar(x))
    {
        return check(x, 1, 1) ? 1 : 0;
    }
    else if (is_vector(x, false))
    {
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (check(x[i], i+1, 1)) return 1;
        }
    }
    else if (is_matrix(x, false))
    {
        for (var i=0,rows=ROWS(x),cols=COLS(x); i<rows; ++i)
        {
            for (var j=0; j<cols; ++j)
            {
                if (check(x[i][j], i+1, j+1)) return 1;
            }
        }
    }
    else if (is_nd(x))
    {
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (any(x[i], function(xi) {return check.apply(null, [xi, i+1].concat([].slice.call(arguments, 1)));})) return 1;
        }
    }
    return 0;
}
$_.any = any;
fn.any = function(x) {
    return any(x, function(x) {return !eq(x, O);});
};
function isequal(a, b, with_nan)
{
    if (is_string(a) && is_string(b))
    {
        return a === b ? 1 : 0;
    }
    else if (is_nan(a) && is_nan(b))
    {
        return with_nan ? 1 : 0;
    }
    else if (is_scalar(a) && is_scalar(b))
    {
        return eq(a, b) ? 1 : 0;
    }
    else if (is_array(a) && is_array(b))
    {
        if (a.length !== b.length) return 0;
        for (var i=0,n=a.length; i<n; ++i)
        {
            if (!isequal(a[i], b[i], with_nan)) return 0;
        }
        return 1;
    }
    return 0;
}
fn.isequal = function(/*args*/) {
    var n = arguments.length, i = 0, ans = 1;
    if (1 < n)
    {
        ans = isequal(arguments[0], arguments[1], false);
        i = 2;
    }
    while (ans && (i < n))
    {
        ans = isequal(arguments[0], arguments[i++], false);
    }
    return ans;
};
fn.isequaln = function(/*args*/) {
    var n = arguments.length, i = 0, ans = 1;
    if (1 < n)
    {
        ans = isequal(arguments[0], arguments[1], true);
        i = 2;
    }
    while (ans && (i < n))
    {
        ans = isequal(arguments[0], arguments[i++], true);
    }
    return ans;
};fn.isnumeric = function isnumeric(x) {
    if (is_array(x)) return x.length === x.filter(isnumeric).length ? 1 : 0;
    return is_scalar(x) ? 1 : 0;
};fn.isnan = function isnan(x) {
    if (is_array(x)) return x.map(isnan);
    if (is_complex(x)) return is_nan(x.re) || is_nan(x.im) ? 1 : 0;
    return is_nan(x) ? 1 : 0;
};
fn.anynan = function anynan(x) {
    if (is_array(x)) return 0 < x.filter(anynan).length ? 1 : 0;
    if (is_complex(x)) return is_nan(x.re) || is_nan(x.im) ? 1 : 0;
    return is_nan(x) ? 1 : 0;
};fn.isinf = function isinf(x) {
    if (is_array(x)) return x.map(isinf);
    if (is_num(x)) return is_inf(x) ? 1 : 0;
    if (is_complex(x)) return is_inf(x.re) || is_inf(x.im) ? 1 : 0;
    return 0;
};fn.isfinite = function isfinite(x) {
    if (is_array(x)) return x.map(isfinite);
    if (is_num(x)) return !is_inf(x) ? 1 : 0;
    if (is_complex(x)) return !is_inf(x.re) && !is_inf(x.im) ? 1 : 0;
    return 0;
};
fn.allfinite = function allfinite(x) {
    if (is_array(x)) return x.length === x.filter(allfinite).length ? 1 : 0;
    if (is_num(x)) return !is_inf(x) ? 1 : 0;
    if (is_complex(x)) return !is_inf(x.re) && !is_inf(x.im) ? 1 : 0;
    return 0;
};fn.isreal = function(x) {
    return all(x, is_real);
};
fn.isempty = function(x) {
    if (is_array(x))
    {
        if (is_2d(x)) return !x[0].length ? 1 : 0;
        else return !x.length ? 1 : 0;
    }
    return 0;
};
fn.string = function string(x) {
    if (is_array(x))
    {
        return x.map(string);
    }
    if (is_string(x))
    {
        return x;
    }
    return String(x);
};
fn.strlength = function(str) {
    if (is_string(str))
    {
        return str.length;
    }
    not_supported("strlength");
};
fn['char'] = function tochar(x) {
    x = vec(x);
    if (is_array(x))
    {
        return x.map(tochar);
    }
    if (is_string(x))
    {
        return x.split('');
    }
    if (is_int(x))
    {
        return String.fromCharCode(_(x));
    }
    return String(x);
};
fn.lower = fn.tolower = function tolower(x) {
    if (is_array(x))
    {
        return x.map(tolower);
    }
    else if (is_string(x))
    {
        return x.toLowerCase();
    }
    return x;
};
fn.upper = fn.toupper = function toupper(x) {
    if (is_array(x))
    {
        return x.map(toupper);
    }
    else if (is_string(x))
    {
        return x.toUpperCase();
    }
    return x;
};
fn.strjoin = function(str, delim) {
    delim = delim || " ";
    delim = vec(delim);
    str = vec(str);
    var n = str.length, m = delim.length, j = 0;
    if (1 !== m && 1 < n && n > m+1) throw "strjoin: delimiter array length must be at least str array length minus one";
    return str.reduce(function(joined, s, i) {
        return joined + String(s) + (i+1 < n ? String(delim[(j++) % m]) : "");
    }, "");
};
// TODO
fn.join = fn.strjoin;
fn.strsplit = varargout(namevalueargs(function(nargout, str, delim) {
    if (!is_string(str)) not_supported("strsplit");
    var nv = arguments[arguments.length-1]._;
    if (null == delim)
    {
        delim = new RegExp('[ \\f\\n\\r\\t\\v]'+(_(nv.CollapseDelimiters) ? '+' : ''), 'g');
    }
    else
    {
        delim = new RegExp('(' + vec(delim).map(function(delim) {
            return 'RegularExpression' === nv.DelimiterType ? String(delim) : (' ' === delim ? '[ \\f\\n\\r\\t\\v]' : RegExp.escape(String(delim)));
        }).join('|') + ')'+(_(nv.CollapseDelimiters) ? '+' : ''), 'g');
    }
    var m, start = 0, splits = [], matches = 1 < nargout ? [] : null, ans;
    while (null !== (m=delim.exec(str)))
    {
        if (1 < nargout) matches.push(m[0]);
        splits.push(str.slice(start, m.index));
        start = m.index + m[0].length;
        if (!m[0].length) ++delim.lastIndex;
    }
    splits.push(str.slice(start));
    ans = 1 < nargout ? [splits, matches] : splits;
    //ans = str.split(delim);
    return ans;
}, {
    CollapseDelimiters: 1,
    DelimiterType: 'Simple'
}));
// TODO
fn.split = fn.strsplit;
function pad_(s, n, c, right)
{
    if (null == c) c = ' ';
    var str = String(s), l = str.length, p = l < n ? new Array(n-l+1).join(c) : '';
    return right ? (str+p) : (p+str);
}
function justify(value, prefix, leftJustify, minWidth, zeroPad, customPadChar)
{
    var sv = String(value), diff = minWidth - sv.length;
    if (diff > 0)
    {
        if (leftJustify || !zeroPad)
            sv = pad_(sv, minWidth, customPadChar, leftJustify);
        else
            sv = sv.slice(0, prefix.length) + pad_('', diff, '0', true) + sv.slice(prefix.length);
    }
    return sv;
}
function formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad)
{
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && ({
    '2': '0b',
    '8': '0',
    '16': '0x'
    })[base] || '';
    value = prefix + pad_(number.toString(base), precision||0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
}
function formatString(value, leftJustify, minWidth, precision, zeroPad, customPadChar)
{
    if (null != precision) value = value.slice(0, precision);
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
}
var sprintf_format_re = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
function sprintf()
{
    // adapted from https://github.com/foo123/Contemplate
    var i = 1, fmt = arguments[0], a = arguments, is_charvector = false, ret;
    if (is_array(fmt))
    {
        fmt = fmt.join('');
        is_charvector = true;
    }
    var do_format = function do_format(substring, valueIndex, flags, minWidth, _x_, precision, type) {
        var number, prefix, method, textTransform, value;
        if ('%%' == substring) return '%';

        // parse flags
        var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false,
            j, customPadChar = ' ', flagsl = flags.length;
        for (j=0; flags && j < flagsl; ++j)
        {
            switch (flags.charAt(j))
            {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case "'":
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if (!minWidth) minWidth = 0;
        else if ('*' == minWidth) minWidth = +_(a[i++]);
        else if ('*' == minWidth.charAt(0)) minWidth = +_(a[minWidth.slice(1, -1)]);
        else minWidth = +minWidth;

        // Note: undocumented perl feature:
        if (0 > minWidth)
        {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth))
        {
            throw 'sprintf: (minimum-)width must be finite';
        }

        if (!precision) precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
        else if ('*' == precision) precision = +_(a[i++]);
        else if ('*' == precision.charAt(0)) precision = +_(a[precision.slice(1, -1)]);
        else precision = +precision;

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
        if (is_array(value)) value = value.join('');

        switch (type)
        {
            case 's':
                return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return formatString(String.fromCharCode(+_(value)), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
            case 'u':
                return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = _(value || 0);
                number = stdMath.round(number - number % 1); // Plain Math.round doesn't just truncate
                prefix = number < 0 ? '-' : positivePrefix;
                value = prefix + pad_(String(stdMath.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f': // Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = _(value || 0);
                prefix = number < 0 ? '-' : positivePrefix;
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                value = prefix + stdMath.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    };
    ret = fmt.replace(sprintf_format_re, do_format);
    if (is_charvector) ret = ret.split('');
    return ret;
}
fn.sprintf = function(/*..args*/) {
    return sprintf.apply(null, [].slice.call(arguments));
};
function create_regexp(expression, opts)
{
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp
    opts = opts || {};
    return new RegExp(expression, KEYS(opts).reduce(function(f, o) {
        if (opts[o] && (-1 < ['g','i','m','s'].indexOf(o))) f += o;
        return f;
    }, 'd'));
}
function apply_regexp(str, re, opts)
{
    // TODO support dynamic regular expressions
    opts = opts || {};
    re.lastIndex = 0; // reset, just in case
    var m, matches = [];
    while (null !== (m=re.exec(str)))
    {
        if (m[0].length || opts['emptymatch'])
        {
            matches.push({
                match:  m[0],
                start:  m.index,
                end:    m.index + m[0].length,
                tokens: (m.indices || []).slice(1).map(function(ind, i) {
                    return {
                        match:  m[i+1],
                        start:  ind[0],
                        end:    ind[1],
                        name:   null
                    };
                }),
                namedTokens: KEYS((m.indices || []).groups || {}).map(function(name) {
                    var ind = m.indices.groups[name];
                    return {
                        match:  str.slice(ind[0], ind[1]),
                        start:  ind[0],
                        end:    ind[1],
                        name:   name
                    };
                })
            });
            if (!m[0].length) ++re.lastIndex;
            else if (!opts['g']) break;
        }
    }
    return matches;
}
function regexp_ret(i, args, opts)
{
    opts = opts || {};
    var n = args.length, ret = [];
    for (i=i||0; i<n; ++i)
    {
        if ('start' === args[i])
        {
            ret.push('start');
        }
        else if ('end' === args[i])
        {
            ret.push('end');
        }
        else if ('tokenExtents' === args[i])
        {
            ret.push('tokenExtents');
        }
        else if ('match' === args[i])
        {
            ret.push('match');
        }
        else if ('tokens' === args[i])
        {
            ret.push('tokens');
        }
        else if ('names' === args[i])
        {
            ret.push('names');
        }
        else if ('split' === args[i])
        {
            ret.push('split');
        }
        else if ('all' === args[i])
        {
            opts['g'] = 1;
        }
        else if ('once' === args[i])
        {
            opts['g'] = 0;
        }
        else if ('ignorecase' === args[i])
        {
            opts['i'] = 1;
        }
        else if ('matchcase' === args[i])
        {
            opts['i'] = 0;
        }
        else if ('stringanchors' === args[i])
        {
            opts['m'] = 0;
        }
        else if ('lineanchors' === args[i])
        {
            opts['m'] = 1;
        }
        else if ('dotall' === args[i])
        {
            opts['s'] = 1;
        }
        else if ('dotexceptnewline' === args[i])
        {
            opts['s'] = 0;
        }
        else if ('noemptymatch' === args[i])
        {
            opts['emptymatch'] = 0;
        }
        else if ('emptymatch' === args[i])
        {
            opts['emptymatch'] = 1;
        }
        else if ('literalspacing' === args[i])
        {
            opts['literalspacing'] = 1;
        }
        else if ('freespacing' === args[i])
        {
            opts['literalspacing'] = 0;
        }
        else if ('nowarnings' === args[i])
        {
            opts['warnings'] = 0;
        }
        else if ('warnings' === args[i])
        {
            opts['warnings'] = 1;
        }
    }
    if (!ret.length) ret = ['start'];
    return ret;
}
function regexp(str, expression, ret, opts, nargout)
{
    nargout = nargout || 1;
    var matches = apply_regexp(str, create_regexp(expression, opts), opts),
        ans = ret.map(function(r) {
            var ret = [], start = 0;
            if ('start' === r)
            {
                ret = matches.map(function(match) {
                    return match.start+1;
                });
            }
            else if ('end' === r)
            {
                ret = matches.map(function(match) {
                    return match.end+1;
                });
            }
            else if ('tokenExtents' === r)
            {
                ret = matches.reduce(function(ret, match) {
                    ret.push.apply(ret, match.tokens.map(function(tok) {
                        return [tok.start+1, tok.end+1];
                    }));
                    return ret;
                }, []);
            }
            else if ('match' === r)
            {
                ret = matches.map(function(match) {
                    return match.match;
                });
            }
            else if ('tokens' === r)
            {
                ret = matches.reduce(function(ret, match) {
                    ret.push.apply(ret, match.tokens.map(function(tok) {
                        return tok.match;
                    }));
                    return ret;
                }, []);
            }
            else if ('names' === r)
            {
                ret = matches.reduce(function(ret, match) {
                    ret.push.apply(ret, match.namedTokens.map(function(tok) {
                        return [tok.name, tok.match];
                    }));
                    return ret;
                }, []);
                ret = cellarray(ret, ret.length ? [ret.length, 2] : [0, 0]);
            }
            else if ('split' === r)
            {
                ret = matches.reduce(function(ret, match, index) {
                    ret.push(str.slice(start, match.start));
                    start = match.end;
                    if (index+1 === matches.length) ret.push(str.slice(start));
                    return ret;
                }, []);
            }
            return ret;
        })
    ;

    if (ans.length > nargout) ans.length = nargout;
    else if (ans.length < nargout) ans.push.apply(ans, array(nargout-ans.length, function() {return [];}));

    return 1 === nargout ? ans[0] : ans;
}
fn.regexp = varargout(function(nargout, str, expression/*, ..args*/) {
    var opts = {'g':1,'i':0,'m':0,'s':1,'emptymatch':0,'literalspacing':1,'warnings':0},
        ret = regexp_ret(3, arguments, opts);
    return apply_(function(str, expression) {return regexp(str, expression, ret, opts, nargout);}, [str, expression], null, nargout);
});
fn.regexpi = varargout(function(nargout, str, expression/*, ..args*/) {
    var opts = {'g':1,'i':1,'m':0,'s':1,'emptymatch':0,'literalspacing':1,'warnings':0},
        ret = regexp_ret(3, arguments, opts);
    return apply_(function(str, expression) {return regexp(str, expression, ret, opts, nargout);}, [str, expression], null, nargout);
});fn.dec2bin = function dec2bin(x) {
    if (is_array(x))
    {
        return x.map(dec2bin);
    }
    else if (is_number(x))
    {
        return x.toString(2);
    }
    else if (is_decimal(x))
    {
        return x.toBinary();
    }
    return x;
};
fn.bin2dec = function bin2dec(x) {
    if (is_array(x))
    {
        return x.map(bin2dec);
    }
    else if (is_string(x))
    {
        return parseInt(x, 2);
    }
    return x;
};
fn.dec2hex = function dec2hex(x) {
    if (is_array(x))
    {
        return x.map(dec2hex);
    }
    else if (is_number(x))
    {
        return x.toString(16);
    }
    else if (is_decimal(x))
    {
        return x.toHexadecimal();
    }
    return x;
};
fn.hex2dec = function hex2dec(x) {
    if (is_array(x))
    {
        return x.map(hex2dec);
    }
    else if (is_string(x))
    {
        return parseInt(x, 16);
    }
    return x;
};
// adapted from https://github.com/foo123/Abacus
function SWAPR(m, i, j)
{
    // swap rows i and j
    if (i !== j)
    {
        var t = m[i];
        m[i] = m[j];
        m[j] = t;
    }
    return m;
}
function SWAPC(m, i, j)
{
    // swap columns i and j
    if (i !== j)
    {
        var k, n = m.length, t;
        for (k=0; k<n; ++k)
        {
            t = m[k][i];
            m[k][i] = m[k][j];
            m[k][j] = t;
        }
    }
    return m;
}
function ADDR(m, i, j, a, b, k0)
{
    // add (a multiple of) row j to (a multiple of) row i
    var k, n = m[0].length;
    if (null == a) a = I;
    if (null == b) b = I;
    for (k=k0||0; k<n; ++k)
        m[i][k] = scalar_add(scalar_mul(b, m[i][k]), scalar_mul(a, m[j][k]));
    return m;
}
function ADDC(m, i, j, a, b, k0)
{
    // add (a multiple of) column j to (a multiple of) column i
    var k, n = m.length;
    if (null == a) a = I;
    if (null == b) b = I;
    for (k=k0||0; k<n; ++k)
        m[k][i] = scalar_add(scalar_mul(b, m[k][i]), scalar_mul(a, m[k][j]));
    return m;
}
function MULR(m, i0, i1, a, b, c, d)
{
    var j, l = m[0].length, x, y;
    for (j=0; j<l; ++j)
    {
        x = m[i0][j]; y = m[i1][j];
        m[i0][j] = scalar_add(scalar_mul(a, x), scalar_mul(b, y));
        m[i1][j] = scalar_add(scalar_mul(c, x), scalar_mul(d, y));
    }
    return m;
}
function MULC(m, j0, j1, a, b, c, d)
{
    var i, l = m.length, x, y;
    for (i=0; i<l; ++i)
    {
        x = m[i][j0]; y = m[i][j1];
        m[i][j0] = scalar_add(scalar_mul(a, x), scalar_mul(c, y));
        m[i][j1] = scalar_add(scalar_mul(b, x), scalar_mul(d, y));
    }
    return m;
}
function EQU(m1, m2)
{
    if (is_scalar(m2))
    {
        if (is_scalar(m1)) return eq(m1, m2);
        else return m1.filter(function(m1i) {return EQU(m1i, m2);}).length === m1.length;
    }
    else if (is_array(m2))
    {
        if (is_scalar(m1)) return EQU(m2, m1);
        return (m1.length === m2.length) && m1.filter(function(m1i, i) {return EQU(m1i, m2[i]);}).length === m2.length;
    }
    return false;
}
function slice(A, r1, c1, r2, c2)
{
    var rows = ROWS(A), columns = COLS(A);
    if (!rows || !columns) return [];
    if (is_array(r1) && is_array(c1))
    {
        r1 = r1.filter(function(i) {return 0 <= i && i < rows;});
        c1 = c1.filter(function(j) {return 0 <= j && j < columns;});
        return matrix(r1.length, c1.length, function(i, j) {
            return A[r1[i]][c1[j]];
        });
    }
    else
    {
        if (null == r1) r1 = 0;
        if (null == c1) c1 = 0;
        if (null == r2) r2 = rows-1;
        if (null == c2) c2 = columns-1;
        if (0 > r1) r1 += rows;
        if (0 > c1) c1 += columns;
        if (0 > r2) r2 += rows;
        if (0 > c2) c2 += columns;
        r1 = stdMath.max(0, stdMath.min(rows-1, r1));
        r2 = stdMath.max(0, stdMath.min(rows-1, r2));
        c1 = stdMath.max(0, stdMath.min(columns-1, c1));
        c2 = stdMath.max(0, stdMath.min(columns-1, c2));
        return r1 <= r2 && c1 <= c2 ? matrix(r2-r1+1, c2-c1+1, function(i, j) {
            return A[r1+i][c1+j];
        }) : [];
    }
}
function concat(A, B, axis)
{
    axis = axis || 'horz';
    var rA = ROWS(A), cA = COLS(A), rB = ROWS(B), cB = COLS(B);
    if ('vert' === axis)
    {
        // |  A  |
        // | --- |
        // |  B  |
        return matrix(rA+rB, stdMath.max(cA, cB), function(i, j) {
            if (j >= cA)
                return i < rA ? O : B[i-rA][j];
            else if (j >= cB)
                return i < rA ? A[i][j] : O;
            else
                return i < rA ? A[i][j] : B[i-rA][j];
        });
    }
    else //if ('horz' === axis)
    {
        // | A | B |
        return matrix(stdMath.max(rA, rB), cA+cB, function(i, j) {
            if (i >= rA)
                return j < cA ? O : B[i][j-cA];
            else if (i >= rB)
                return j < cA ? A[i][j] : O;
            else
                return j < cA ? A[i][j] : B[i][j-cA];
        });
    }
}
function is_tri(A, type, strict, eps, setzero, setcopy)
{
    var nr = ROWS(A), nc = COLS(A), n, r, c, tol;
    if ((false !== strict) && (nr !== nc)) return false;

    eps = __(eps || 0);
    n = stdMath.min(nr, nc);
    tol = n_gt(eps, O) ? n_mul(n_div(sum(array(n, function(i) {return scalar_abs(A[i][i]);})), n), eps) : O;
    for (r=0; r<n; ++r)
    {
        //tol = n_mul(scalar_abs(A[r][r]), eps);
        if (('lower' === type) || ('diagonal' === type))
        {
            for (c=r+1; c<n; ++c) if (!le(scalar_abs(A[r][c]), tol)) return false;
        }
        if (('upper' === type) || ('diagonal' === type))
        {
            for (c=0; c<r; ++c) if (!le(scalar_abs(A[r][c]), tol)) return false;
        }
    }
    if (nr > nc)
    {
        // should be all zero
        //tol = n_mul(scalar_abs(A[n-1][n-1]), eps);
        for (r=n; r<nr; ++r)
        {
            for (c=0; c<nc; ++c) if (!le(scalar_abs(A[r][c]), tol)) return false;
        }
    }
    else if (nr < nc)
    {
        // should be all zero
        //tol = n_mul(scalar_abs(A[n-1][n-1]), eps);
        for (c=n; c<nc; ++c)
        {
            for (r=0; r<nr; ++r) if (!le(scalar_abs(A[r][c]), tol)) return false;
        }
    }
    if ((true === setzero) && n_gt(eps, O))
    {
        if (setcopy && setcopy._) A = setcopy._ = copy(A);
        if (('upper' === type) || ('diagonal' === type))
        {
            for (r=0; r<n; ++r)
            {
                for (c=0; c<r; ++c)
                {
                    A[r][c] = O;
                }
            }
        }
        if (('lower' === type) || ('diagonal' === type))
        {
            for (r=0; r<n; ++r)
            {
                for (c=r+1; c<n; ++c)
                {
                    A[r][c] = O;
                }
            }
        }
        if (nr > nc)
        {
            // should be all zero
            for (r=n; r<nr; ++r)
            {
                for (c=0; c<nc; ++c)
                {
                    A[r][c] = O;
                }
            }
        }
        else if (nr < nc)
        {
            // should be all zero
            for (c=n; c<nc; ++c)
            {
                for (r=0; r<nr; ++r)
                {
                    A[r][c] = O;
                }
            }
        }
    }
    return true;
}
function solve_tri(type, T, y, eps, free_vars)
{
    eps = __(eps || 0);
    if (y) y = vec(y);
    var n = ROWS(T), fk = 0, fn = free_vars ? free_vars.length : 0;
    if ("lower" === type)
    {
        // lower triangular, forward substitution
        return array(n, function(m, x) {
            if (free_vars && n_le(scalar_abs(T[m][m]), eps))
            {
                //if (n_le(scalar_abs(Tx), eps))
                    return fk < fn ? free_vars[fk++] : (free_vars[fn-1] || O); // free variable
            }
            else
            {
                for (var Tx=O,i=0; i<m; ++i) Tx = scalar_add(Tx, scalar_mul(T[m][i], x[i]));
                Tx = scalar_sub(y ? y[m] : O, Tx);
                return scalar_div(Tx, T[m][m]);
            }
        });
    }
    else
    {
        // upper triangular, backward substitution
        return array(n, function(m, x) {
            if (free_vars && n_le(scalar_abs(T[n-1-m][n-1-m]), eps))
            {
                //if (n_le(scalar_abs(Tx), eps))
                    return fk < fn ? free_vars[fk++] : (free_vars[fn-1] || O); // free variable
            }
            else
            {
                for (var Tx=O,i=0; i<m; ++i) Tx = scalar_add(Tx, scalar_mul(T[n-1-m][n-1-i], x[i]));
                Tx = scalar_sub(y ? y[n-1-m] : O, Tx);
                return scalar_div(Tx, T[n-1-m][n-1-m]);
            }
        }).reverse();
    }
}
function compute_givens(f, g)
{
    /*
    "On Computing Givens Rotations Reliably and Efficiently",
    DAVID BINDEL, JAMES DEMMEL, WILLIAM KAHAN, OSNI MARQUES,
    ACM Transactions on Mathematical Software, Vol. 28, No. 2, June 2002
    */
    // f, g may be real or complex
    var c, s, r, sf, af, n;
    if (eq(g, O))
    {
        c = I;
        s = O;
        //r = f;
    }
    else if (eq(f, O))
    {
        c = O;
        s = scalar_sign(scalar_conj(g));
        if (eq(s, O)) s = I;
        //r = scalar_abs(g);
    }
    else
    {
        sf = scalar_sign(f);
        af = scalar_abs(f);
        n = n_hypot(af, scalar_abs(g));
        c = scalar_div(af, n);
        s = scalar_div(scalar_mul(sf, scalar_conj(g)), n);
        //r = scalar_mul(sf, n);
    }
    return [c, s/*, r*/]; // skip r
}
function compute_jacobi(alpha, beta, gamma)
{
    // Compute the Jacobi/Givens rotation
    //
    //   [ c -s ] [ alpha beta  ] [  c s ] = [ alpha_new 0        ]
    //   [ s  c ] [ beta  gamma ] [ -s c ]   [ 0         beta_new ]
    //
    if (eq(beta, O))
    {
        return [
            [I, O],
            [O, I]
        ];
    }
    else
    {
        var b = scalar_div(scalar_sub(gamma, alpha), scalar_mul(beta, two)),
            t = scalar_div(scalar_sign(b), scalar_add(scalar_add(scalar_abs(b), fn.sqrt(scalar_pow(b, two))), I));
            c = scalar_inv(fn.sqrt(scalar_add(I, scalar_pow(t, two)))),
            s = scalar_mul(c, t);
        return [
            [c,             s],
            [scalar_neg(s), c]
        ];
    }
}
/*function givens(n, p, q, f, g)
{
    var givens_rot = compute_givens(f, g),
        c = givens_rot[0], s = givens_rot[1];
    return matrix(n, n, function(i, j) {
        if (i === j)
        {
            return (p === i) || (q === j) ? c : I;
        }
        else if ((p === i) && (q === j) || (p === j) && (q === i))
        {
            return i < j ? scalar_neg(s) : s;
        }
        return O;
    });
}*/
function rotmul(type, G, p, q, A, i1, i2)
{
    var n, i, j, B = A, Ap, Aq,
        Gpp, Gpq, Gqp, Gqq;
    if ((2 === G.length) && is_scalar(G[0]))
    {
        // c, s
        Gpp = G[0];
        Gpq = scalar_neg(G[1]);
        Gqp = G[1];
        Gqq = G[0];
    }
    else if ((2 === G.length) && (2 === G[0].length))
    {
        // jacobi/givens compact matrix
        Gpp = G[0][0];
        Gpq = G[0][1];
        Gqp = G[1][0];
        Gqq = G[1][1];
    }
    else
    {
        // jacobi/givens full matrix
        Gpp = G[p][p];
        Gpq = G[p][q];
        Gqp = G[q][p];
        Gqq = G[q][q];
    }
    if ('right' === type)
    {
        /*
        a1 b1 c1 d1 | 1 0  0 0  = a1 (G[:,i]*A[1,:]) c1 (G[:,j]*A[1,:])
        a2 b2 c2 d2 | 0 c -s 0  = a2 (G[:,i]*A[2,:]) c2 (G[:,j]*A[2,:])
        a3 b3 c3 d3 | 0 s  c 0  = a3 (G[:,i]*A[3,:]) c3 (G[:,j]*A[3,:])
        a4 b4 c4 d4 | 0 0  0 1  = a4 (G[:,i]*A[4,:]) c4 (G[:,j]*A[4,:])
        */
        // A(:, [k l]) = A(:, [k l])*G;
        n = ROWS(A);
        if (null == i1) i1 = 0;
        if (null == i2) i2 = n-1;
        for (i=i1; i<=i2; ++i)
        {
            Ap = A[i][p]; Aq = A[i][q];
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[j][p], A[i][j]));
            }*/
            B[i][p] = scalar_add(scalar_mul(Gpp, Ap), scalar_mul(Gqp, Aq));
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[j][q], A[i][j]));
            }*/
            B[i][q] = scalar_add(scalar_mul(Gpq, Ap), scalar_mul(Gqq, Aq));
        }
    }
    else//if ('left' === type)
    {
        /*
        1 0  0 0 | a1 b1 c1 d1 = a1 b1 c1 d1
        0 c -s 0 | a2 b2 c2 d2 = (G[i,:]*A[:,1]) (G[i,:]*A[:,2]) (G[i,:]*A[:,3]) (G[i,:]*A[:,4])
        0 s  c 0 | a3 b3 c3 d3 = (G[j,:]*A[:,1]) (G[j,:]*A[:,2]) (G[j,:]*A[:,3]) (G[j,:]*A[:,4])
        0 0  0 1 | a4 b4 c4 d4 = a4 b4 c4 d4
        */
        // A([k l], :) = G'*A([k l], :);
        n = COLS(A);
        if (null == i1) i1 = 0;
        if (null == i2) i2 = n-1;
        for (i=i1; i<=i2; ++i)
        {
            Ap = A[p][i]; Aq = A[q][i];
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[p][j], A[j][i]));
            }*/
            B[p][i] = scalar_add(scalar_mul(Gpp, Ap), scalar_mul(Gpq, Aq));
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[q][j], A[j][i]));
            }*/
            B[q][i] = scalar_add(scalar_mul(Gqp, Ap), scalar_mul(Gqq, Aq));
        }
    }
    return B;
}
function jacobi_sweep(A, nsweeps)
{
    if (null == nsweeps) nsweeps = 1;
    var n = ROWS(A), sweep, k, l, J;

    for (sweep=1; sweep<=nsweeps; ++sweep)
    {
        for (k=1; k<n; ++k)
        {
            for (l=0; l<k; ++l)
            {
                J = compute_jacobi(A[k][k], A[k][l], A[l][l]);
                A = rotmul('right', J, k, l, rotmul('left', ctranspose(J), k, l, A));
            }
        }
    }
    return A;
}
function compute_householder(A, hh, i1, i2, j1, j2, eps)
{
    /*
    "Unitary Triangularization of a Nonsymmetric Matrix",
    Householder, A. S.,
    Journal of the ACM. 5 (4): 339–342.  1958
    */
    // v(0) is always 1, rest is the essential part
    if (null == eps) eps = constant.eps;
    var c0, c, normc, b, bc;
    if (is_vector(A))
    {
        c0 = A[i1];
        if (i1 === i2)
        {
            normc = O;
        }
        else
        {
            c = A.slice(i1+1, i2+1);
            normc = real(dot(c, c));
        }
    }
    else if (j1 === j2)
    {
        c0 = A[i1][j1];
        if (i1 === i2)
        {
            normc = O;
        }
        else
        {
            c = A.slice(i1+1, i2+1).map(function(Ai) {return Ai[j1];});
            normc = real(dot(c, c));
        }
    }
    else//if (i1 === i2)
    {
        c0 = A[i1][j1];
        if (j1 === j2)
        {
            normc = O;
        }
        else
        {
            c = A[i1].slice(j1+1, j2+1);
            normc = real(dot(c, c));
        }
    }
    if (n_le(normc, eps) && n_le(n_pow(scalar_abs(imag(c0)), two), eps))
    {
        hh.beta = real(c0);
        hh.tau = O;
        hh.v.forEach(function(vi, i) {
            hh.v[i] = 0 === i ? I : O;
        });
    }
    else
    {
        b = realMath.sqrt(n_add(real(scalar_mul(c0, scalar_conj(c0))), normc));
        if (n_ge(real(c0), O)) b = scalar_neg(b);
        bc = scalar_sub(c0, b);
        hh.beta = b;
        hh.tau = scalar_conj(scalar_div(scalar_neg(bc), b));
        if (is_vector(A))
        {
            hh.v.forEach(function(vi, i) {
                hh.v[i] = 0 === i ? I : scalar_div(A[i+i1], bc);
            });
        }
        else if (j1 === j2)
        {
            hh.v.forEach(function(vi, i) {
                hh.v[i] = 0 === i ? I : scalar_div(A[i+i1][j1], bc);
            });
        }
        else//if (i1 === i2)
        {
            hh.v.forEach(function(vi, i) {
                hh.v[i] = 0 === i ? I : scalar_div(A[i1][i+j1], bc);
            });
        }
    }
    return hh;
}
function hh_mul(type, hh, A, i1, i2, j1, j2)
{
    var n, i, j,
        v = hh.v, vA,
        vl = v.length,
        tau = hh.tau,
        B = A;
    if (eq(tau, O))
    {
        return B;
    }
    if ('right' === type)
    {
        // -- B = AH
        // B(j1:j2,i1:i2) = A(j1:j2,i1:i2)-(A(j1:j2,i1:i2)*v)*(tau*v’);
        n = ROWS(A);
        if (null == i1) i1 = 0;
        if (null == i2) i2 = COLS(A)-1;
        if (null == j1) j1 = 0;
        if (null == j2) j2 = n-1;
        vA = array(j2-j1+1, function(j) {
            for (var vA=O,i=0; i<vl; ++i)
            {
                vA = scalar_add(vA, scalar_mul(v[i], A[j+j1][i+i1]));
            }
            return vA;
        });
        for (j=j1; j<=j2; ++j)
        {
            for (i=i1; i<=i2; ++i)
            {
                B[j][i] = scalar_sub(A[j][i], scalar_mul(vA[j-j1], scalar_mul(tau, scalar_conj(v[i-i1]))));
            }
        }
    }
    else//if ('left' === type)
    {
        // -- B = HA
        // B(i1:i2,j1:j2) = A(i1:i2,j1:j2)-(tau*v)*(v’*A(i1:i2,j1:j2));
        n = COLS(A);
        if (null == i1) i1 = 0;
        if (null == i2) i2 = ROWS(A)-1;
        if (null == j1) j1 = 0;
        if (null == j2) j2 = n-1;
        vA = array(j2-j1+1, function(j) {
            for (var vA=O,i=0; i<vl; ++i)
            {
                vA = scalar_add(vA, scalar_mul(scalar_conj(v[i]), A[i+i1][j+j1]));
            }
            return vA;
        });
        for (j=j1; j<=j2; ++j)
        {
            for (i=i1; i<=i2; ++i)
            {
                B[i][j] = scalar_sub(A[i][j], scalar_mul(scalar_mul(tau, v[i-i1]), vA[j-j1]));
            }
        }
    }
    return B;
}
/*function francis_poly(H, i, j)
{
    // Get shifts via trailing submatrix
    var //i = ROWS(H)-1, j = COLS(H)-1,
        trHH  = scalar_add(H[i-1][j-1], H[i][j]),
        detHH = scalar_sub(scalar_mul(H[i-1][j-1], H[i][j]), scalar_mul(H[i-1][j], H[i][j-1])),
        f1, f2, f3, r1, r2, b, c
    ;

    f1 = scalar_pow(trHH, 2);
    f2 = scalar_mul(detHH, 4);
    if (gt(f1, f2)) // Real eigenvalues
    {
        // Use the one closer to H(n,n)
        f3 = fn.sqrt(scalar_sub(f1, f2));
        r1 = scalar_div(scalar_add(trHH, f3), 2);
        r2 = scalar_div(scalar_sub(trHH, f3), 2);
        if (lt(scalar_abs(scalar_sub(r1, H[i][j])), scalar_abs(scalar_sub(r2, H[i][j]))))
        {
            r2 = r1;
        }
        else
        {
            r1 = r2;
        }
        // z^2 + bz + c = (z-sigma_1)(z-sigma_2)
        b = scalar_neg(scalar_add(r1, r2));
        c = scalar_mul(r1, r2);
    }
    else
    {
        // In the complex case, we want the char poly for HH
        b = scalar_neg(trHH);
        c = detHH;
    }
    return [b, c];
}*/
function gauss_jordan(A, with_pivots, odim, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A),
        dim = columns, pivots,
        det, pl = 0, r, i, i0, p0,
        lead, leadc, imin, im, min,
        a, z, m, aug, find_dupl;
    eps = __(eps || 0);
    if (is_tri(A, "upper", false, eps))
    {
        return with_pivots ? [A, array(dim, function(col) {return [col, col];}).filter(function(pivot) {return (pivot[0] < rows) && (pivot[1] < columns) && !le(scalar_abs(A[pivot[0]][pivot[1]]), eps);}), prod(diag(A)), eye(rows)] : A;
    }
    // original dimensions, eg when having augmented matrix
    if (is_array(odim)) dim = stdMath.min(dim, odim[1]);
    m = concat(A, eye(rows));
    pivots = new Array(dim);
    lead = 0; leadc = 0; det = I;
    find_dupl = function find_dupl(k0, k) {
        k = k || 0;
        for (var p=pl-1; p>=0; --p)
            if (k0 === pivots[p][k])
                return p;
        return -1;
    };
    for (r=0; r<rows; ++r)
    {
        if (dim <= lead) break;

        i = r;
        while (le(scalar_abs(m[i][lead]), eps))
        {
            ++i;
            if (rows <= i)
            {
                i = r; ++lead;
                if (dim <= lead)
                {
                    lead = -1;
                    break;
                }
            }
        }
        if (-1 === lead) break; // nothing to do

        i0 = i;
        imin = -1; min = null; z = 0;
        // find row with min abs leading value non-zero for current column lead
        for (i=i0; i<rows; ++i)
        {
            a = scalar_abs(m[i][lead]);
            if (le(a, eps)) ++z;
            else if ((null == min) || lt(a, min)) {min = a; imin = i;}
        }
        for (;;)
        {
            if (-1 === imin) break; // all zero, nothing else to do
            if (rows-i0 === z+1)
            {
                // only one non-zero, swap row to put it first
                if (r !== imin)
                {
                    SWAPR(m, r, imin);
                    // determinant changes sign for row swaps
                    det = scalar_neg(det);
                }
                if (lt(m[r][lead], O))
                {
                    ADDR(m, r, r, O, J, lead); // make it positive
                    // determinant is multiplied by same constant for row multiplication, here simply changes sign
                    det = scalar_neg(det);
                }
                i = imin; i0 = r;
                while ((0 <= i) && (-1 !== (p0=find_dupl(i)))) {i0 -= pl-p0; i = i0;}
                pivots[pl++] = [i, lead/*, leadc*/]; // row/column/original column of pivot
                // update determinant
                det = r < dim ? scalar_mul(det, m[r][r/*lead*/]) : O;
                break;
            }
            else
            {
                z = 0; im = imin;
                for (i=i0; i<rows; ++i)
                {
                    if (i === im) continue;
                    // subtract min row from other rows
                    ADDR(m, i, im, scalar_neg(scalar_div(m[i][lead], m[im][lead])), I, lead);
                    // determinant does not change for this operation

                    // find again row with min abs value for this column as well for next round
                    a = scalar_abs(m[i][lead]);
                    if (le(a, eps)) ++z;
                    else if (lt(a, min)) {min = a; imin = i;}
                }
            }
        }

        ++lead; //++leadc;
    }
    if (pl < dim) det = O;

    aug = slice(m, 0, columns, rows-1, rows+columns-1);
    m = slice(m, 0, 0, rows-1, columns-1);
    // truncate if needed
    if (pivots.length > pl) pivots.length = pl;

    return with_pivots ? [m, pivots, det, aug] : m;
}
var ref = gauss_jordan;
/*function largest_eig(A, N, eps, valueonly)
{
    // power method
    var iter,
        A_t,
        k, prev_k,
        v, prev_v,
        w, prev_w;

    k = O;
    if (true === valueonly)
    {
        v = array(N, function() {return new complex(__(stdMath.random() || 0.1), O);});
        v = dotdiv(v, norm(v));
        for (iter=1; iter<=100; ++iter)
        {
            prev_k = k;
            prev_v = v;
            v = vec(mul(A, v));
            k = dot(v, prev_v);
            if (!eq(v[0], O))
            {
                v = dotdiv(v, scalar_sign(v[0]));
            }
            v = dotdiv(v, norm(v));
            if (n_le(realMath.abs(n_sub(real(k), real(prev_k))), eps) && n_le(realMath.abs(n_sub(imag(k), imag(prev_k))), eps)) break;
        }
        return k;
    }
    else
    {
        A_t = ctranspose(A);
        v = array(N, function() {return new complex(__(stdMath.random() || 0.1), O);});
        v = dotdiv(v, norm(v));
        w = array(N, function() {return new complex(__(stdMath.random() || 0.1), O);});
        w = dotdiv(w, norm(w));
        for (iter=1; iter<=100; ++iter)
        {
            prev_k = k;
            prev_v = v;
            prev_w = w;
            v = vec(mul(A, v));
            w = vec(mul(A_t, w));
            k = dot(v, prev_v);
            if (!eq(v[0], O))
            {
                v = dotdiv(v, scalar_sign(v[0]));
            }
            if (!eq(w[0], O))
            {
                w = dotdiv(w, scalar_sign(w[0]));
            }
            v = dotdiv(v, norm(v));
            w = dotdiv(w, norm(w));
            if (n_le(realMath.abs(n_sub(real(k), real(prev_k))), eps) && n_le(realMath.abs(n_sub(imag(k), imag(prev_k))), eps)) break;
        }
        return [k, v, w];
    }
}*/
fn.planerot = varargout(function(nargout, x) {
    x = vec(x);
    if (!is_vector(x) || (2 !== x.length)) not_supported("planerot");
    var g = compute_givens(x[0], x[1]),
        G = [
            [g[0],              g[1]],
            [scalar_neg(g[1]),  g[0]]
        ];
    return 1 < nargout ? [G, mul(G, vec2col(x))] : G;
});fn.ref = varargout(function(nargout, x, tol) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("ref");
    var ans = ref(x, true, null, tol);
    return 1 < nargout ? [ans[0], ans[1].map(function(pi) {return pi[1]+1;})] : ans[0];
});
function rref(A, with_pivots, odim, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A), dim = columns,
        pivots, det, pl, lead, r, i, j, l, a, g, rf, aug;
    eps = __(eps || 0);
    // original dimensions, eg when having augmented matrix
    if (is_array(odim)) dim = stdMath.min(dim, odim[1]);
    // build rref incrementaly from ref
    rf = ref(A, true, odim, eps);
    a = concat(rf[0], rf[3]);
    pivots = rf[1]; det = rf[2];
    pl = pivots.length;
    for (r=0; r<pl; ++r)
    {
        lead = pivots[r][1];
        for (i=0; i<r; ++i)
        {
            if (le(scalar_abs(a[i][lead]), eps)) continue;

            ADDR(a, i, r, scalar_neg(a[i][lead]), a[r][lead]);
            if (!eq(a[i][pivots[i][1]], I))
            {
                ADDR(a, i, i, O, scalar_inv(a[i][pivots[i][1]]), pivots[i][1]);
            }
        }
    }
    if (!eq(a[pl-1][pivots[pl-1][1]], I))
    {
        ADDR(a, pl-1, pl-1, O, scalar_inv(a[pl-1][pivots[pl-1][1]]), pivots[pl-1][1]);
    }
    aug = slice(a, 0, columns, rows-1, rows+columns-1);
    a = slice(a, 0, 0, rows-1, columns-1);
    return with_pivots ? [a, pivots, det, aug] : a;
}
fn.rref = varargout(function(nargout, x, tol) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("rref");
    var ans = rref(x, true, null, tol);
    return 1 < nargout ? [ans[0], ans[1].map(function(pi) {return pi[1]+1;})] : ans[0];
});
function linsolve(A, b, opts)
{
    // adapted from https://github.com/foo123/Abacus
    if (is_scalar(A) && is_scalar(b)) return scalar_div(b, A);

    if (!is_matrix(A)) return []; // invalid
    b = vec(b);
    if (!is_vector(b) && !is_matrix(b)) return []; // invalid

    // solve linear system, when exactly solvable
    var k = COLS(A), br, bc;

    if (ROWS(A) !== k) return []; // no solution

    if (is_vector(b))
    {
        br = b.length;
        bc = 1;
    }
    else
    {
        br = ROWS(b);
        bc = COLS(b);
    }
    if (k !== br) return []; // no solution

    // A*X = B <=> ref(A.t|I) = R|T <=> iif R.t*P = B has solutions P => X = T.t*P
    var tmp = ref(transpose(A), true),
        pivots = tmp[1],
        rank = pivots.length,
        Tt, Rt, p, i, j, c, t;

    if (rank !== k) return []; // no solution

    Tt = transpose(tmp[3]);
    Rt = transpose(tmp[0]);
    if (is_vector(b))
    {
        // R.t*P can be easily solved by substitution
        p = array(k, O);
        for (i=0; i<k; ++i)
        {
            if (eq(Rt[i][i], O)) return []; // no solution
            for (t=O,j=0; j<i; ++j) t = scalar_add(t, scalar_mul(Rt[i][j], p[j]));
            p[i] = scalar_div(scalar_sub(b[i], t), Rt[i][i]);
        }
        // X = T.t*P
        return array(k, function(i) {
            return array(k, function(j) {
                return scalar_mul(p[j], Tt[i][j]);
            }).reduce(function(s, pti) {
                return scalar_add(s, pti);
            }, O);
        });
    }
    else
    {
        // R.t*P can be easily solved by substitution
        p = zeros(k, bc);
        for (i=0; i<k; ++i)
        {
            if (eq(Rt[i][i], O)) return []; // no solution
            for (c=0; c<bc; ++c)
            {
                for (t=O,j=0; j<i; ++j) t = scalar_add(t, scalar_mul(Rt[i][j], p[j][c]));
                p[i][c] = scalar_div(scalar_sub(b[i][c], t), Rt[i][i]);
            }
        }
        // X = T.t*P
        return matrix(k, bc, function(i, c) {
            return array(k, function(j) {
                return scalar_mul(p[j][c], Tt[i][j]);
            }).reduce(function(s, pti) {
                return scalar_add(s, pti);
            }, O);
        });
    }
}
fn.linsolve = linsolve;
function mldivide(A, b)
{
    return linsolve(A, b);
}
function nullspace(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var columns, ref, pivots,
        free_vars, pl, tmp, LCM;

    columns = COLS(A);
    tmp = rref(A, true, null, eps);
    ref = tmp[0];
    pivots = tmp[1];
    pl = pivots.length;
    free_vars = pivots.reduce(function(c, p) {
        var i = 0;
        while ((i < c.length) && (p[1] > c[i])) ++i;
        if ((i < c.length) && (p[1] === c[i])) c.splice(i, 1);
        return c;
    }, array(columns, function(i) {return i;}));
    // exact integer rref, find LCM of pivots
    LCM = pl ? pivots.reduce(function(LCM, p, i) {
        return scalar_mul(LCM, ref[i][p[1]]);
    }, I) : I;
    return free_vars.map(function(free_var) {
        var p, g, i, vec = array(columns, function(j) {return j === free_var ? LCM : O;});
        for (p=0; p<pl; ++p)
        {
            i = pivots[p][1];
            if (i <= free_var)
            {
                // use exact (fraction-free) integer algorithm, which normalises rref NOT with 1 but with LCM of pivots
                vec[i] = scalar_sub(vec[i], scalar_mul(scalar_div(LCM, ref[p][i]), ref[p][free_var]));
            }
        }

        return vec; // column vector
    });
}
fn['null'] = function(x, tol) {
    return nullspace(x, tol);
};
function rowspace(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var pivots = ref(A, true, null, eps);
    return pivots[1].map(function(p) {
        return A[p[0]];
    }); // row vector
}
fn.rowspace = function(A, tol) {
    return rowspace(A, tol);
};
function colspace(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var pivots = ref(A, true, null, eps);
    return pivots[1].map(function(p) {
        return array(A.length, function(i) {
            return A[i][p[1]];
        });
    }); // column vector
}
fn.colspace = function(A, tol) {
    return colspace(A, tol);
};
function rank(A)
{
    // adapted from https://github.com/foo123/Abacus
    var pivots = ref(A, true);
    return pivots[1].length;
}
fn.rank = function(A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("rank");
    return rank(A);
};
function inv(A)
{
    // adapted from https://github.com/foo123/Abacus
    // matrix inverse
    if (is_scalar(A)) return scalar_inv(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) return [];
    var rows = ROWS(A), columns = rows, ref;
    if (1 === rows)
    {
        return [[scalar_inv(A[0][0])]];
    }
    else
    {
        // compute inverse through augmented rref (Gauss-Jordan method)
        ref = rref(A, true);
        if (eq(ref[0][rows-1][columns-1], O))
        {
            // not full-rank, no inverse
            return [];
        }
        else
        {
            // full-rank, has inverse
            return ref[3].map(function(ai, i) {
                return ai.map(function(aug_ij) {
                    return scalar_div(aug_ij, ref[0][i][i]);
                });
            });
        }
    }
}
function ainv(A)
{
    // approximate inverse, via 16 terms of Neumann series
    if (ROWS(A) !== COLS(A)) return [];
    var In = eye(ROWS(A)), invA = In, AA = sub(In, A), i;
    for (i=0; i<4; ++i)
    {
        invA = mul(invA, add(In, AA));
        if (i+1 < 4) AA = mul(AA, AA);
    }
    return invA;
}
fn.inv = function(A) {
    if (is_scalar(A)) x = [[A]];
    if (!is_matrix(A)) not_supported("inv");
    return inv(A);
};
fn.ainv = function(A) {
    if (is_scalar(A)) x = [[A]];
    if (!is_matrix(A)) not_supported("ainv");
    return ainv(A);
};
function rankf(A, ref)
{
    // adapted from https://github.com/foo123/Abacus
    // rank factorization
    var rows = ROWS(A), columns = COLS(A), pivots, rank, F, C;
    if (!ref) ref = rref(A, true);
    pivots = ref[1];
    rank = pivots.length;
    C = slice(A, array(rows, function(i) {return i;}), array(rank, function(j) {return pivots[j][1];}));
    F = slice(ref[0], 0, 0, rank-1, columns-1).map(function(rref_i, i) {
        return rref_i.map(function(rref_ij, j) {
            j = i;
            while ((j+1 < columns) && eq(rref_i[j], O)) ++j;
            return scalar_div(rref_ij, rref_i[j]);
        });
    });
    return [C, F];
}
fn.rankf = function(A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("rankf");
    return rankf(A);
};
function pinv(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    // pseudo-matrix inverse
    if (is_scalar(A)) return scalar_inv(A);
    if (!is_matrix(A)) return [];
    var rows = ROWS(A), columns = COLS(A), ref, rank, rf, h, C, F;
    if (EQU(A, 0))
    {
        // zero matrix, pinv is transpose
        return transpose(A);
    }
    else if (1 === rows && 1 === columns)
    {
        // scalar, pinv is inverse
        return [[scalar_inv(A[0][0])]];
    }
    else if (1 === rows || 1 === columns)
    {
        // vector, pinv is transpose divided by square norm
        C = norm2(A);
        return matrix(columns, rows, function(j, i) {
            return scalar_div(scalar_conj(A[i][j]), C);
        });
    }
    else
    {
        ref = rref(A, true, null, eps || 0);
        rank = ref[1].length;
        if (rank === columns)
        {
            // linearly independent columns
            if (rows === columns)
            {
                // invertible, pinv is inverse
                return ref[3].map(function(ai, i) {
                    return ai.map(function(aug_ij) {
                        return scalar_div(aug_ij, ref[0][i][i]);
                    });
                });
            }
            else
            {
                // A+ = inv(Ah * A) * Ah
                h = ctranspose(A);
                return mul(inv(mul(h, A)), h);
            }
        }
        else if (rank === rows)
        {
            // linearly independent rows
            // A+ = Ah * inv(A * Ah)
            h = ctranspose(A);
            return mul(h, inv(mul(A, h)));
        }
        else
        {
            // general matrix, through rank factorisation
            // A = C F <=> A+ = F+ C+
            // where F+ = Fh * inv(F * Fh) and C+ = inv(Ch * C) * Ch
            rf = rankf(A, ref);
            C = rf[0];
            h = ctranspose(C);
            C = mul(inv(mul(h, C)), h);
            F = rf[1];
            h = ctranspose(F);
            F = mul(h, inv(mul(F, h)));
            return mul(F, C);
        }
    }
}
fn.pinv = function(A, tol) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("pinv");
    return pinv(A, tol);
};
fn.cond = function(A, p) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("cond");
    var invA = inv(A);
    if (!invA || !invA.length) return inf;
    if (null == p) p = 2;
    return scalar_mul(norm(A, p), norm(invA, p));
};
function trace(x)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_matrix(x))
    {
        return x.reduce(function(trace, xi, i) {
            return scalar_add(trace, i < xi.length ? x[i][i] : 0);
        }, 0);
    }
    not_supported("trace");
}
fn.trace = trace;
function detr(m, n)
{
    var ii, zr, zc,
        s, det,
        a, b, c,
        d, e, f,
        g, h, i;

    function reduce(m, n, row, col)
    {
        return matrix(n-1, n-1, function(r, c) {
            if (r >= row) ++r;
            if (c >= col) ++c;
            return m[r][c];
        });
    }

    if (1 === n)
    {
        // explicit formula for 1x1, trivial
        det = m[0][0];
    }
    else if (2 === n)
    {
        // explicit formula for 2x2
        a = m[0][0]; b = m[0][1];
        c = m[1][0]; d = m[1][1];
        det = scalar_sub(scalar_mul(a, d), scalar_mul(b, c));
    }
    else if (3 === n)
    {
        // explicit formula for 3x3
        a = m[0][0]; b = m[0][1]; c = m[0][2];
        d = m[1][0]; e = m[1][1]; f = m[1][2];
        g = m[2][0]; h = m[2][1]; i = m[2][2];
        det = scalar_sub(
            scalar_sub(
                scalar_sub(
                    scalar_add(scalar_add(scalar_mul(scalar_mul(a, e), i), scalar_mul(scalar_mul(b, f), g)), scalar_mul(scalar_mul(c, d), h)),
                    scalar_mul(scalar_mul(c, e), g)
                ),
                scalar_mul(scalar_mul(b, d), i)
            ),
            scalar_mul(scalar_mul(a, f), h)
        );
    }
    else //if (3 < n)
    {
        // use row or col with the most zeros
        for (zr=0,zc=0,ii=0; ii<n; ++ii)
        {
            if (eq(m[0][ii], O)) ++zr;
            if (eq(m[ii][0], O)) ++zc;
        }
        s = I; det = O;
        if (zc > zr)
        {
            // expand along 1st col
            for (ii=0; ii<n; ++ii)
            {
                if (!eq(m[ii][0], O)) det = scalar_add(det, scalar_mul(m[ii][0], scalar_mul(s, detr(reduce(m, n, ii, 0), n-1))));
                s = I === s ? J : I;
            }
        }
        else
        {
            // expand along 1st row
            for (ii=0; ii<n; ++ii)
            {
                if (!eq(m[0][ii], O)) det = scalar_add(det, scalar_mul(m[0][ii], scalar_mul(s, detr(reduce(m, n, 0, ii), n-1))));
                s = I === s ? J : I;
            }
        }
    }
    return det;
}
function det(A, explicit, eps)
{
    // adapted from https://github.com/foo123/Abacus
    // determinant
    eps = __(eps || 0);
    var n = ROWS(A);
    if (n !== COLS(A))
    {
        // not square, zero
        return O;
    }
    else if (1 === n)
    {
        // scalar, trivial
        return A[0][0];
    }
    else if (is_tri(A, "lower", true, eps) || is_tri(A, "upper", true, eps))
    {
        // triangular, product of diagonal entries
        return A.reduce(function(det, ai, i) {
            return scalar_mul(det, A[i][i]);
        }, I);
    }
    else
    {
        // compute either recursively or via ref
        return true === explicit ? detr(A, n) : (ref(A, true, null, eps)[2]);
    }
}
fn.det = function(A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("det");
    return det(A, false, 1e-15);
};
function charpoly(A)
{
    // adapted from https://github.com/foo123/Abacus
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("charpoly");
    var rows = ROWS(A), columns = COLS(A), k, n, M, coeff;
    n = rows;
    coeff = new Array(n+1);
    M = zeros(n, n); // zero
    coeff[n] = I;
    for (k=1; k<=n; ++k)
    {
        M = mul(A, M).map(function(vi, i) {
            return vi.map(function(vij, j) {
                return i === j ? scalar_add(vij, coeff[n-k+1]) : vij;
            });
        });
        coeff[n-k] = scalar_div(trace(mul(A, M)), -k);
    }
    return realify(coeff.reverse());
}
fn.charpoly = charpoly;
function minor(A, ai, aj, cofactor)
{
    var rows = ROWS(A), columns = COLS(A), m;
    if (rows !== columns) return null;
    if (1 >= rows) return 0;
    ai = +(ai||0); aj = +(aj||0);
    if (ai < 0 || ai >= rows || aj < 0 || aj >= columns) return null;
    m = det(matrix(rows-1, columns-1, function(i, j) {
        if (i >= ai) ++i;
        if (j >= aj) ++j;
        return A[i][j];
    }));
    if ((true === cofactor) && ((ai+aj)&1)) m = scalar_neg(m);
    return m;
}
function adjoint(A)
{
    // adapted from https://github.com/foo123/Abacus
    return matrix(COLS(A), ROWS(A), function(j, i) {
        return minor(A, i, j, true);
    });
}
fn.adjoint = function(A) {
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("adjoint");
    return adjoint(A);
};
function balance(A, pnorm, wantt)
{
    if (null == pnorm) pnorm = two;
    /*
    "ON MATRIX BALANCING AND EIGENVECTOR COMPUTATION",
    RODNEY JAMES, JULIEN LANGOU, BRADLEY R. LOWERY
    https://arxiv.org/abs/1401.5766
    */
    var n = ROWS(A), n1 = n-1,
        B = todecimal(A),
        T = wantt ? array(n, I) : null,
        col = new Array(n1),
        row = new Array(n1),
        i, j, ji, f, c, r,
        eps = __(1e-10),
        converged, iter;
    for (iter=1; iter<=100; ++iter)
    {
        converged = 0;
        for (i=0; i<n; ++i)
        {
            for (j=0; j<n1; ++j)
            {
                ji = j >= i ? j+1 : j;
                col[j] = B[ji][i];
                row[j] = B[i][ji];
            }
            c = norm(col, pnorm);
            r = norm(row, pnorm);
            if (n_eq(r, O) || n_eq(c, O))
            {
                ++converged;
                continue;
            }
            f = realMath.sqrt(n_div(r, c));
            if (n_le(realMath.abs(n_sub(f, I)), eps)) ++converged;
            if (wantt) T[i] = n_mul(f, T[i]);
            for (j=0; j<n; ++j)
            {
                B[j][i] = scalar_mul(B[j][i], f);
            }
            for (j=0; j<n; ++j)
            {
                B[i][j] = scalar_div(B[i][j], f);
            }
        }
        if (n === converged) break;
    }
    return wantt ? [T, B] : B;
}
fn.balance = varargout(function(nargout, A, noperm) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("balance");
    var ans = balance(A, two, 1 < nargout);
    return 2 < nargout ? [ans[0], array(ROWS(A), function(i) {return i+1;})/*noperm*/, ans[1]] : (1 < nargout ? [diag(ans[0]), ans[1]] : ans);
});
function hess(A, B, wantq, eps)
{
    var n = ROWS(A);
    eps = __(eps || 0);
    if (null == B)
    {
        var Q = wantq ? eye(n) : null,
            H = copy(A), G, G_t,
            k, i;
        for (k=1; k<=n-2; ++k)
        {
            // produces some reflected signs from Octave's hess
            for (i=n; i>=k+2; --i)
            {
                if (n_le(scalar_abs(H[i-1][k-1]), n_mul(scalar_abs(H[i-1-1][k-1]), eps)))
                {
                    // pass
                }
                else
                {
                    //G = givens(n, i-1-1, i-1, H[i-1-1][k-1], H[i-1][k-1]);
                    //G_t = ctranspose(G);
                    G = compute_givens(H[i-1-1][k-1], H[i-1][k-1]);
                    G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                    if (wantq) Q = rotmul('right', G, i-1-1, i-1, Q);//mul(Q, G);
                    H = rotmul('left', G_t, i-1-1, i-1, rotmul('right', G, i-1-1, i-1, H));//mul(G_t, mul(H, G));
                }
                H[i-1][k-1] = O; // zero-out any round-off
            }
        }
        return wantq ? [Q, H] : H;
    }
    else
    {
        var QR = qr(B, true, false, eps),
            Q = QR[0],
            Q_t = ctranspose(Q),
            Z = eye(n),
            AA = mul(Q_t, A),
            BB = mul(Q_t, B),
            k, i, Rl, Rl_t, Rr;
        for (k=1; k<=n-2; ++k)
        {
            for (i=n; i>=k+2; --i)
            {
                if (n_le(scalar_abs(AA[i-1][k-1]), n_mul(scalar_abs(AA[i-1-1][k-1]), eps)))
                {
                    // pass
                }
                else
                {
                    //Rl = givens(n, i-1-1, i-1, AA[i-1-1][k-1], AA[i-1][k-1]);
                    //Rl_t = ctranspose(Rl);
                    Rl = compute_givens(AA[i-1-1][k-1], AA[i-1][k-1]);
                    Rl_t = [scalar_conj(Rl[0]), scalar_neg(scalar_conj(Rl[1]))];
                    if (wantq) Q = rotmul('right', Rl, i-1-1, i-1, Q);//mul(Q, Rl);
                    AA = rotmul('left', Rl_t, i-1-1, i-1, AA);//mul(Rl_t, AA);
                    BB = rotmul('left', Rl_t, i-1-1, i-1, BB);//mul(Rl_t, BB);
                }
                AA[i-1][k-1] = O; // zero-out any round-off

                if (n_le(scalar_abs(BB[i-1][i-1-1]), n_mul(scalar_abs(BB[i-1][i-1]), eps)))
                {
                    // pass
                }
                else
                {
                    //Rr = givens(n, i-1-1, i-1, scalar_neg(BB[i-1][i-1]), BB[i-1][i-1-1]);
                    Rr = compute_givens(scalar_neg(BB[i-1][i-1]), BB[i-1][i-1-1]);
                    if (wantq) Z = rotmul('right', Rr, i-1-1, i-1, Z);//mul(Z, Rr);
                    AA = rotmul('right', Rr, i-1-1, i-1, AA);//mul(AA, Rr);
                    BB = rotmul('right', Rr, i-1-1, i-1, BB);//mul(BB, Rr);
                }
                BB[i-1][i-1-1] = O; // zero-out any round-off
            }
        }
        return [AA, BB, Q, Z];
    }
}
fn.hess = varargout(function(nargout, A, B) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("hess");
    if (2 < arguments.legnth)
    {
        if (is_scalar(B)) B = [[B]];
        if (!is_matrix(B) || (ROWS(B) !== COLS(B))) not_supported("hess");
        return hess(A, B, 2 < nargout);
    }
    else
    {
        return hess(A, null, 1 < nargout);
    }
});
function ldl(A, triangle)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A),
        i, j, jj, k, sum, D, L,
        upper_triangle = "upper" === triangle;
    D = zeros(rows, rows);
    L = eye(rows);

    for (i=0; i<rows; ++i)
    {
        for (j=0; j<i; ++j)
        {
            for (k=0,sum=O; k<j; ++k)
                sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[j][k])), D[k][k]));

            L[i][j] = scalar_div(scalar_sub(upper_triangle ? A[j][i] : A[i][j], sum), D[j][j]);
        }

        for (k=0,sum=O; k<i; ++k)
            sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[i][k])), D[k][k]));

        D[i][i] = scalar_sub(A[i][i], sum);

        if (le(D[i][i], O))
        {
            // not positive-definite
            return [];
        }
    }
    return [L, D];
}
fn.ldl = varargout(function(nargout, A, triangle) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A)) /*|| !EQU(A, ctranspose(A))*/) not_supported("ldl");
    var ans = ldl(A, triangle);
    if (!ans.length) not_supported("ldl");
    if (2 < nargout) ans.push(eye(ROWS(A)));
    return ans;
}, 2);
fn.chol = varargout(function(nargout, A, triangle) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A)) /*|| !EQU(A, ctranspose(A))*/) not_supported("chol");
    triangle = triangle || "upper";
    var ans = ldl(A, triangle);
    if (!ans.length) not_supported("chol");
    return "lower" === triangle ? (mul(ans[0], fn.sqrt(ans[1]))) : ctranspose(mul(ans[0], fn.sqrt(ans[1])));
});
function lu(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var n, m, dim, P, L, U, DD,
        oldpivot, k, i, j, kpivot,
        NotFound, Ukk, Uik, defficient;
    eps = __(eps || 0);
    n = ROWS(A);
    m = COLS(A);
    /*
    Completely Fraction free LU factoring(CFFLU)
    Input: A nxm matrix A, with m >= n.
    Output: Four matrices P, L, D, U, where:
        P is a nxn permutation matrix,
        L is a nxn lower triangular matrix,
        D is a nxn diagonal matrix,
        U is a nxm upper triangular matrix
        and P*A = L*inv(D)*U
    */
    defficient = false;
    U = copy(A);
    L = eye(n);
    DD = array(n, O);
    P = eye(n);
    oldpivot = I;
    for (k=0; k<n-1; ++k)
    {
        if (le(scalar_abs(U[k][k]), eps))
        {
            kpivot = k+1;
            NotFound = true;
            while ((kpivot < n) && NotFound)
            {
                if (!le(scalar_abs(U[kpivot][k]), eps))
                    NotFound = false;
                else
                    ++kpivot;
            }
            if (n <= kpivot)
            {
                // matrix is rank-defficient
                defficient = true;
                break;
            }
            else
            {
                SWAPR(U, k, kpivot);
                SWAPR(P, k, kpivot);
            }
        }
        Ukk = U[k][k];
        L[k][k] = Ukk;
        DD[k] = scalar_mul(oldpivot, Ukk);
        for (i=k+1; i<n; ++i)
        {
            Uik = U[i][k];
            L[i][k] = Uik;
            for (j=k+1; j<m; ++j)
            {
                U[i][j] = scalar_div(scalar_sub(scalar_mul(Ukk, U[i][j]), scalar_mul(U[k][j], Uik)), oldpivot);
            }
            U[i][k] = O;
        }
        oldpivot = U[k][k];
    }
    if (defficient) return [];
    DD[n-1] = oldpivot;
    return [DD, L, U, P];
}
fn.lu = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("lu");
    var ans = lu(A), invD;
    if (!ans.length) throw "lu: defficient matrix";
    invD = diag(ans[0].map(function(di) {return scalar_inv(di);}));
    return 2 < nargout ? [mul(ans[1], invD), ans[2], ans[3]] : [mul(transpose(ans[3]), mul(ans[1], invD)), ans[2]];
}, 2);
function qr(A, wantq, wantp, eps)
{
    var m = ROWS(A), n = COLS(A),
        Q = wantq ? eye(m) : null,
        R = A, P, p, t,
        T = {_:1},
        colnorms, max,
        i, j, k, G, G_t, hh;
    eps = __(eps || 0);
    if (is_tri(R, "upper", false, eps, true, T))
    {
        R = T._;
    }
    else
    {
        R = copy(A);
        if (wantp)
        {
            hh = {};
            P = array(n, function(j) {return j;});
            colnorms = array(n, function(col) {
                return norm(COL(R, col), two);
            });
            for (j=0; j<n; ++j)
            {
                p = j;
                max = colnorms[p];
                for (i=j+1; i<n; ++i)
                {
                    if (n_gt(colnorms[i], max))
                    {
                        p = i;
                        max = colnorms[p];
                    }
                }
                if (n_eq(max, O)) break;
                if (j !== p)
                {
                    t = colnorms[j];
                    colnorms[j] = colnorms[p];
                    colnorms[p] = t;
                    t = P[j];
                    P[j] = P[p];
                    P[p] = t;
                    for (i=0; i<m; ++i)
                    {
                        t = R[i][j];
                        R[i][j] = R[i][p];
                        R[i][p] = t;
                    }
                }

                /*
                // qr via givens rotations
                for (i=m-1; i>=(j+1); --i)
                {
                    if (n_le(scalar_abs(R[i][j]), n_mul(scalar_abs(R[i-1][j]), eps)))
                    {
                        R[i][j] = O;
                    }
                    else
                    {
                        //G = givens(m, i-1, i, R[i-1][j], R[i][j]);
                        //G_t = ctranspose(G);
                        G = compute_givens(R[i-1][j], R[i][j]);
                        G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                        R = rotmul('left', G_t, i-1, i, R);//mul(G_t, R);
                        if (wantq) Q = rotmul('right', G, i-1, i, Q);//mul(Q, G);
                    }
                }
                */

                // qr via householder reflections
                hh.v = array(m-j, O);
                compute_householder(R, hh, j, m-1, j, j, eps);
                // -- R := HR
                R = hh_mul('left', hh, R, j);//R(j:end,:) = R(j:end,:)-(tau*w)*(w'*R(j:end,:));
                // zero-out round-off remainders
                for (i=j+1; i<m; ++i) R[i][j] = O;
                // -- Q := QH
                if (wantq) Q = hh_mul('right', hh, Q, j);//Q(:,j:end) = Q(:,j:end)-(Q(:,j:end)*w)*(tau*w)';

                for (i=j+1; i<n; ++i)
                {
                    colnorms[i] = n_sub(colnorms[i], n_pow(scalar_abs(R[j][i]), two));
                }
            }
        }
        else
        {
            /*
            // qr via givens rotations
            // produces some reflected signs from Octave's qr
            for (j=0; j<n; ++j)
            {
                for (i=m-1; i>=(j+1); --i)
                {
                    if (n_le(scalar_abs(R[i][j]), n_mul(scalar_abs(R[i-1][j]), eps)))
                    {
                        R[i][j] = O;
                    }
                    else
                    {
                        //G = givens(m, i-1, i, R[i-1][j], R[i][j]);
                        //G_t = ctranspose(G);
                        G = compute_givens(R[i-1][j], R[i][j]);
                        G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                        R = rotmul('left', G_t, i-1, i, R);//mul(G_t, R);
                        if (wantq) Q = rotmul('right', G, i-1, i, Q);//mul(Q, G);
                    }
                }
            }
            */
            // qr via householder reflections
            hh = {};
            for (j=0; j<n; ++j)
            {
                // -- Find H = I-tau*w*w' to put zeros below R(j,j)
                hh.v = array(m-j, O);
                compute_householder(R, hh, j, m-1, j, j, eps);
                // -- R := HR
                R = hh_mul('left', hh, R, j);//R(j:end,:) = R(j:end,:)-(tau*w)*(w'*R(j:end,:));
                // zero-out round-off remainders
                for (i=j+1; i<m; ++i) R[i][j] = O;
                // -- Q := QH
                if (wantq) Q = hh_mul('right', hh, Q, j);//Q(:,j:end) = Q(:,j:end)-(Q(:,j:end)*w)*(tau*w)';
            }
        }
    }
    return wantq && wantp ? [Q, R, P ? matrix(n, n, function(i, j) {return i === P[j] ? I : O;}) : eye(n)] : (wantq ? [Q, R] : R);
}
fn.qr = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("qr");
    return qr(A, 1 < nargout, 2 < nargout);
});
function real_qr_shift(A, i, sI, s, type)
{
    var ii, sc;
    sI[0] = A[i][i]
    sI[1] = A[i-1][i-1];
    sI[2] = scalar_mul(A[i][i-1], A[i-1][i]);
    if ('wilkinson' === type)
    {
        // Wilkinson shift
        s[0] = scalar_add(s[0], sI[0]);
        for (ii=0; ii<=i; ++ii) A[ii][ii] = scalar_sub(A[ii][ii], sI[0]);
        sc = scalar_add(scalar_abs(A[i][i-1]), scalar_abs(A[i-1][i-2]));
        sI[0] = scalar_mul(sc, 0.75);
        sI[1] = scalar_mul(sc, 0.75);
        sI[2] = scalar_mul(scalar_mul(sc, sc), -0.4375);
    }
    else if ('matlab' === type)
    {
        // MATLAB shift
        sc = scalar_div(scalar_sub(sI[1], sI[0]), two);
        sc = scalar_add(scalar_mul(sc, sc), sI[2]);
        if (gt(sc, O))
        {
            sc = fn.sqrt(sc);
            if (lt(sI[1], sI[0])) sc = scalar_neg(sc);
            sc = scalar_add(sc, scalar_div(scalar_sub(sI[1], sI[0]), two));
            sc = scalar_div(scalar_sub(sI[0], sI[2]), sc);
            s[0] = scalar_add(s[0], sc);
            for (ii=0; ii<=i; ++ii) A[ii][ii] = scalar_sub(A[ii][ii], sc);
            sI[0] = __(0.964); sI[1] = sI[2] = sI[0];
        }
    }
}
function split22block(A, U, i, s, forcesplit)
{
    // compute the eigenvalues of 2x2 block submatrix
    // by solving the quadratic characteristic equation
    var p = scalar_div(scalar_sub(A[i-1][i-1], A[i][i]), two),
        q = scalar_add(scalar_mul(p, p), scalar_mul(A[i][i-1], A[i-1][i])),
        G, G_t, z;

    // incorporate shift
    A[i][i] = scalar_add(A[i][i], s[0]);
    A[i-1][i-1] = scalar_add(A[i-1][i-1], s[0]);

    if (forcesplit || ge(q, O))
    {
        // force split, or
        // 2 real eigenvalues, so block 2x2 submatrix can be diagonalized
        z = fn.sqrt(q);
        G = compute_givens(ge(p, O) ? scalar_add(p, z) : scalar_sub(p, z), A[i][i-1]);
        G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
        A = rotmul('left', G_t, i-1, i, A, i-1, null);//m_matT.rightCols(size - i + 1).applyOnTheLeft(i-1, i, rot.adjoint());
        A = rotmul('right', G, i-1, i, A, 0, i);//m_matT.topRows(i + 1).applyOnTheRight(i-1, i, rot);
        A[i][i-1] = O;
        if (U) U = rotmul('right', G, i-1, i, U);//m_matU.applyOnTheRight(i-1, i, rot);
    }

    if (i > 1) A[i-1][i-2] = O;
}
function complex_qr_shift(A, i, exceptional)
{
    if (exceptional)
    {
        // exceptional shift, avoid slow convergence heuristic
        return scalar_add(scalar_abs(real(A[i][i-1])), scalar_abs(real(A[i-1][i-2])));
    }
    else
    {
        // closest eigenvalue estimate as shift
        var T00 = A[i-1][i-1],
            T01 = A[i-1][i  ],
            T10 = A[i  ][i-1],
            T11 = A[i  ][i  ],
            normT = n_add(n_add(scalar_abs(T00), scalar_abs(T10)), n_add(scalar_abs(T01), scalar_abs(T11))),
            b, c, D, Det, Tr, e1, e2, n1, n2;
        T00 = scalar_div(T00, normT);
        T01 = scalar_div(T01, normT);
        T10 = scalar_div(T10, normT);
        T11 = scalar_div(T11, normT);
        b = scalar_mul(T01, T10);
        c = scalar_sub(T00, T11);
        D = fn.sqrt(scalar_add(scalar_mul(c, c), scalar_mul(b, 4)));
        Det = scalar_sub(scalar_mul(T00, T11), b);
        Tr = scalar_add(T00, T11);
        e1 = scalar_div(scalar_add(Tr, D), two);
        e2 = scalar_div(scalar_sub(Tr, D), two);
        n1 = scalar_abs(e1);
        n2 = scalar_abs(e2);
        if (n_gt(n1, n2))
        {
            e2 = scalar_div(Det, e1);
        }
        else if (!n_eq(n2, O))
        {
            e1 = scalar_div(Det, e2);
        }
        return n_lt(scalar_abs(scalar_sub(e1, T11)), scalar_abs(scalar_sub(e2, T11))) ? scalar_mul(e1, normT) : scalar_mul(e2, normT);
    }
}
function subdiagonal_negligible(A, i, eps)
{
    if (n_le(scalar_abs(A[i+1][i]), n_mul(n_add(scalar_abs(A[i][i]), scalar_abs(A[i+1][i+1])), eps)))
    {
        A[i+1][i] = O;
        return true;
    }
    return false;
}
function subdiagonal_negligible_entry(A, i, eps)
{
    while (i > 0)
    {
        if (n_le(scalar_abs(A[i][i-1]), n_mul(n_add(scalar_abs(A[i-1][i-1]), scalar_abs(A[i][i])), eps))) break;
        --i;
    }
    return i;
}
function schur(A, wantu, mode, eps)
{
    /*
    "Understanding the QR Algorithm", David S. Watkins, 1982
    "Understanding the QR Algorithm, Part II", David S. Watkins, 2001
    "Francis's Algorithm", David S. Watkins, 2011
    */
    // adapted from https://github.com/PX4/eigen

    // schur decomposition via qr algorithm
    var n = ROWS(A),
        i, k, im,
        il, iu = n-1,
        H, U, normH,
        T = {_:1},
        s, sI,
        G, G_t, Hmm,
        v, hh,
        r, sc,
        lhs, rhs,
        iter = 0,
        total_iter = 0,
        max_iter = 0, tol;

    eps = __(eps || 1e-10);

    if (is_tri(A, "upper", true, eps, true, T))
    {
        // already upper triangular
        return wantu ? [eye(n), T._] : T._;
    }

    // reduce to hessenberg form
    // that is invariant under qr algorithm and reduces computations
    H = hess(A, null, wantu, eps);
    if (wantu)
    {
        U = H[0];
        H = H[1];
    }

    max_iter = 100 * n;
    if ("complex" === mode)
    {
        // complex qr algorithm for hessenberg matrix with shifts and deflation
        // rows 0,...,il-1 are decoupled from the rest because H(il,il-1) is zero
        // rows il,...,iu is the part we are working on
        // rows iu+1,...,end are already brought in triangular form
        for (;;)
        {
            // find the bottom row of the active submatrix
            while (iu > 0)
            {
                if (!subdiagonal_negligible(H, iu-1, eps)) break;
                iter = 0;
                --iu;
            }

            // whole matrix is triangularized
            if (0 >= iu) break;

            ++iter;
            ++total_iter;
            if (total_iter >= max_iter) break;

            // find the top row of the active submatrix
            il = iu-1;
            while ((il > 0) && !subdiagonal_negligible(H, il-1, eps)) --il;

            // qr step with shift via givens rotation
            s = complex_qr_shift(H, iu, (iter === 10 || iter === 20) && (iu > 1));
            G = compute_givens(scalar_sub(H[il][il], s), H[il+1][il]);
            G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];

            H = rotmul('left', G_t, il, il+1, H, il, null);//m_matT.rightCols(m_matT.cols() - il).applyOnTheLeft(il, il + 1, rot.adjoint());
            H = rotmul('right', G, il, il+1, H, 0, stdMath.min(il+2, iu));//m_matT.topRows((std::min)(il + 2, iu) + 1).applyOnTheRight(il, il + 1, rot);
            H[il+1][il] = O;
            if (wantu) U = rotmul('right', G, il, il+1, U);//m_matU.applyOnTheRight(il, il + 1, rot);

            for (i=il+1; i<iu; ++i)
            {
                //rot.makeGivens(m_matT.coeffRef(i, i - 1), m_matT.coeffRef(i + 1, i - 1), &m_matT.coeffRef(i, i - 1));
                G = compute_givens(H[i][i-1], H[i+1][i-1]);
                G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                H[i][i-1] = scalar_add(scalar_mul(G[0], H[i][i-1]), scalar_mul(G[1], H[i+1][i-1]));
                H[i+1][i-1] = O;
                H = rotmul('left', G_t, i, i+1, H, i, null);//m_matT.rightCols(m_matT.cols() - i).applyOnTheLeft(i, i + 1, rot.adjoint());
                H = rotmul('right', G, i, i+1, H, 0, stdMath.min(i+2, iu));//m_matT.topRows((std::min)(i + 2, iu) + 1).applyOnTheRight(i, i + 1, rot);
                if (wantu) U = rotmul('right', G, i, i+1, U);//m_matU.applyOnTheRight(i, i + 1, rot);
            }
        }
    }
    else
    {
        // real qr algorithm for hessenberg matrix with shifts and deflation
        // rows 0,...,il-1 are decoupled from the rest because H(il,il-1) is zero
        // rows il,...,iu is the part we are working on
        // rows iu+1,...,end are already brought in triangular form
        normH = norm(H, inf/*I*/);
        tol = n_mul(normH, n_mul(eps, eps));
        //tol = n_gt(normH, constant.realmin) ? normH : constant.realmin;
        s = [O];
        sI = [O, O, O];
        while (iu >= 0)
        {
            il = subdiagonal_negligible_entry(H, iu, eps);

            if (il === iu)
            {
                // 1 root
                H[iu][iu] = scalar_add(H[iu][iu], s[0]);
                if (iu > 0) H[iu][iu-1] = O;
                --iu;
                iter = 0;
            }
            else if (il+1 === iu)
            {
                // 2 roots
                split22block(H, U, iu, s, 'realcomplex' === mode);
                iu -= 2;
                iter = 0;
            }
            else
            {
                // francis qr algorithm
                ++iter;
                ++total_iter;
                if (total_iter >= max_iter) break;
                v = [O, O, O];

                real_qr_shift(H, iu, sI, s, (iter > 0) && ((iter % 16) === 0) ? ((iter % 32) !== 0 ? 'wilkinson' : 'matlab') : 'none');

                // init francis qr step
                for (im=iu-2; im>=il; --im)
                {
                    Hmm = H[im][im];
                    r = scalar_sub(sI[0], Hmm);
                    sc = scalar_sub(sI[1], Hmm);
                    v[0] = scalar_add(scalar_div(scalar_sub(scalar_mul(r, sc), sI[2]), H[im+1][im]), H[im][im+1]);
                    v[1] = scalar_sub(scalar_sub(scalar_sub(H[im+1][im+1], Hmm), r), sc);
                    v[2] = H[im+2][im+1];
                    if (im === il) break;
                    lhs = scalar_mul(H[im][im-1], scalar_add(scalar_abs(v[1]), scalar_abs(v[2])));
                    rhs = scalar_mul(v[0], scalar_add(scalar_add(scalar_abs(H[im-1][im-1]), scalar_abs(Hmm)), scalar_abs(H[im+1][im+1])));
                    if (lt(scalar_abs(lhs), scalar_mul(rhs, eps))) break;
                }

                // francis qr step
                hh = {};
                hh.v = [I, O, O];
                for (k=im; k<=iu-2; ++k)
                {
                    //Matrix<Scalar, 2, 1> ess;
                    if (k === im)
                    {
                        //v = firstHouseholderVector;
                        //v.makeHouseholder(ess, tau, beta);
                        compute_householder(v, hh, 0, 2, 0, 0);
                    }
                    else
                    {
                        //v = m_matT.template block<3, 1>(k, k - 1);
                        //v.makeHouseholder(ess, tau, beta);
                        compute_householder(H, hh, k, k+2, k-1, k-1);
                    }

                    if (!eq(hh.beta, O))
                    {
                        if ((k === im) && (k > il))
                        {
                            H[k][k-1] = scalar_neg(H[k][k-1]);
                        }
                        else if (k !== im)
                        {
                            H[k][k-1] = hh.beta;
                        }

                        H = hh_mul('left', hh, H, k, k+2, k, null);//m_matT.block(k, k, 3, size - k).applyHouseholderOnTheLeft(ess, tau, workspace);
                        H = hh_mul('right', hh, H, k, k+2, 0, stdMath.min(iu, k+3));//m_matT.block(0, k, (std::min)(iu, k + 3) + 1, 3).applyHouseholderOnTheRight(ess, tau, workspace);
                        if (wantu) U = hh_mul('right', hh, U, k, k+2);//m_matU.block(0, k, size, 3).applyHouseholderOnTheRight(ess, tau, workspace);
                    }
                }

                //Matrix<Scalar, 2, 1> v = m_matT.template block<2, 1>(iu - 1, iu - 2);
                //Matrix<Scalar, 1, 1> ess;
                //v.makeHouseholder(ess, tau, beta);
                hh.v = [I, O];
                compute_householder(H, hh, iu-1, iu, iu-2, iu-2);

                if (!eq(hh.beta, O))
                {
                    H[iu-1][iu-2] = hh.beta;
                    H = hh_mul('left', hh, H, iu-1, iu, iu-1, null);//m_matT.block(iu - 1, iu - 1, 2, size - iu + 1).applyHouseholderOnTheLeft(ess, tau, workspace);
                    H = hh_mul('right', hh, H, iu-1, iu, 0, iu);//m_matT.block(0, iu - 1, iu + 1, 2).applyHouseholderOnTheRight(ess, tau, workspace);
                    if (wantu) U = hh_mul('right', hh, U, iu-1, iu);//m_matU.block(0, iu - 1, size, 2).applyHouseholderOnTheRight(ess, tau, workspace);
                }

                // zero-out round-off remainders
                for (i=im+2; i<=iu; ++i)
                {
                    H[i][i-2] = O;
                    if (i > im+2) H[i][i-3] = O;
                }
            }
        }
    }
    return wantu ? [U, H] : H;
}
fn.schur = varargout(function(nargout, A, mode) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("schur");
    return schur(A, 1 < nargout, "complex" === mode || !fn.isreal(A) ? "complex" : "real");
});
/*function eig_pow(A, wantv, wantw, eps)
{
    // eig power iteration method
    eps = __(eps || 1e-10);
    var e, d, v, w,
        n, N = ROWS(A),
        V = new Array(N),
        W = new Array(N),
        D = array(N, O);

    A = copy(A);
    for (n=0; n<N; ++n)
    {
        e = largest_eig(A, N, eps);
        d = e[0];
        v = e[1];
        w = e[2];
        D[n] = d;
        V[n] = v;
        W[n] = w;
        A = sub(A, mul(mul(scalar_div(d, dot(v, w, true)), v), w));
    }
    return [
    realify(D),
    realify(transpose(V)),
    realify(transpose(W))
    ];
}*/
function eig_schur(A, wantv, wantw, eps)
{
    // triangularize via schur
    // eigenvalues are on diagonal
    // eigenvectors can be found from the nullspace of A-λI via fast backsubstitution
    var Q = schur(A, true, fn.isreal(A) ? "realcomplex" : "complex", eps),
        i, j, n,
        D, V, W,
        v, w,
        sortperm, lambda,
        Alambda, AlambdaT,
        multiplicity, free;
    A = Q[1];
    Q = Q[0];
    n = ROWS(A);
    D = array(n, function(i) {return realify(A[i][i]);});

    if (wantv || wantw)
    {
        sortperm = array(n, function(i) {return i;}).sort(function(i, j) {
            var a = D[i],
                b = D[j],
                aa = scalar_abs(a),
                ab = scalar_abs(b),
                ra = real(a),
                rb = real(b);
            return (n_gt(ab, aa) ? 1 : (n_lt(ab, aa) ? -1 : (n_gt(rb, ra) ? 1 : (n_lt(rb, ra) ? -1 : 0)))) || (j-i);
        });

        if (wantv)
        {
            V = new Array(n);
            Alambda = copy(A);
        }
        if (wantw)
        {
            W = new Array(n);
            AlambdaT = ctranspose(A);
        }
        free = array(n, O);

        for (i=0; i<n; ++i)
        {
            multiplicity = 1;
            lambda = D[sortperm[i]];
            j = i-1;
            while ((j >= 0) && n_le(scalar_abs(scalar_sub(lambda, D[sortperm[j]])), eps))
            {
                ++multiplicity;
                --j;
            }
            // generate new independent eigenvector if possible
            // based on multiplicity of eigenvalue
            free[multiplicity-1] = I;
            if (wantv)
            {
                for (j=0; j<n; ++j) Alambda[j][j] = scalar_sub(A[j][j], lambda);
                v = solve_tri("upper", Alambda, null, eps, free);
                V[sortperm[i]] = dotdiv(v, norm(v));
            }
            if (wantw)
            {
                for (j=0; j<n; ++j) AlambdaT[j][j] = scalar_sub(conj(A[j][j]), lambda);
                w = solve_tri("lower", AlambdaT, null, eps, free);
                W[sortperm[i]] = dotdiv(w, norm(w));
            }
            free[multiplicity-1] = O;
        }
    }
    return [
    D,
    wantv ? mul(Q, realify(transpose(V))) : null,
    wantw ? mul(ctranspose(Q), realify(ctranspose(W))) : null
    ];
}
function ordeig(T)
{
    var n = ROWS(T), i = 0, eig = new Array(n),
        a, b, c, d, p, q, D;
    for (;i<n;)
    {
        if ((i+1 < n) && !eq(T[i+1][i], O))
        {
            // 2x2 block, complex conjugate values
            //eig[i] = new complex(T[i][i], T[i][i+1]);
            //++i;
            //eig[i] = new complex(T[i][i], T[i][i-1]);
            //++i;
            a = T[i][i];
            b = T[i][i+1];
            c = T[i+1][i];
            d = T[i+1][i+1];
            p = scalar_add(a, d);
            q = scalar_sub(scalar_mul(a, d), scalar_mul(b, c));
            D = fn.sqrt(scalar_sub(scalar_mul(p, p), scalar_mul(q, 4)));
            eig[i] = scalar_div(scalar_add(p, D), two);
            eig[i+1] = scalar_div(scalar_sub(p, D), two);
            i += 2;
        }
        else
        {
            // 1x1 block, diagonal value
            eig[i] = T[i][i];
            i += 1;
        }
    }
    return eig;
}
fn.ordeig = function(T) {
    if (arguments.length > 1) not_supported("ordeig");
    if (is_scalar(T)) T = [[T]];
    if (!is_matrix(T) || (ROWS(T) !== COLS(T))) not_supported("ordeig");
    return ordeig(T);
};
fn.eig = varargout(function(nargout, A, nobalance) {
    if (is_matrix(nobalance)) not_supported("eig");
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("eig");
    var T = null, ans;
    if ('nobalance' !== nobalance)
    {
        // always balance the matrix, unless explicitly bypassed
        if (1 < nargout)
        {
            T = balance(A, null, true);
            A = T[1];
            T = T[0];
        }
        else
        {
            A = balance(A, null, false);
        }
    }
    if (1 < nargout)
    {
        //ans = eig_pow(A, 1 < nargout, 2 < nargout, 1e-16);
        ans = eig_schur(A, 1 < nargout, 2 < nargout, 1e-16);
        return [T && ans[1] ? mul(diag(T), ans[1]) : ans[1], diag(ans[0]), T && ans[2] ? mul(diag(T.map(function(ti) {return n_inv(ti);})), ans[2]) : ans[2]];
    }
    else
    {
        if (is_tri(A, "lower", true, 1e-16))
        {
            // lower triangular
            // pass
        }
        else
        {
            // triangularize via schur, schur checks if already upper triangular
            A = schur(A, false, fn.isreal(A) ? "realcomplex" : "complex", 1e-16);
        }
        // get eigenvalues from diagonal
        return realify(array(ROWS(A), function(i) {return A[i][i];}));
        /*
        return realify(is_tri(A, 'upper', true, 1e-16) || is_tri(A, 'lower', true, 1e-16) ? array(ROWS(A), function(i) {
                return A[i][i];
            }) : roots(charpoly(A)));
        */
    }
});
function svd(A, eta, wantu, wantv)
{
    /* adapted from:
    Peter Businger, Gene Golub,
    Algorithm 358:
    Singular Value Decomposition of a Complex Matrix,
    Communications of the ACM,
    Volume 12, Number 10, October 1969, pages 564-565.
    https://github.com/johannesgerer/jburkardt-f77/blob/master/toms358/toms358.f
    */
    // produces some columns with reflected signs from Octave's svd
    if (!is_num(eta)) eta = eps;
    eta = __(eta)
    var n = COLS(A), m = ROWS(A), svdT;

    if (m < n)
    {
        // compute transpose svd and return transpose result
        svdT = svd(transpose(A), eta, wantv, wantu);
        return wantu && wantv ? [transpose(svdT[2]), svdT[1], transpose(svdT[0])] : (wantu || wantv ? [transpose(svdT[0]), svdT[1]] : svdT);
    }

    var nu = wantu ? m : 0,
        nv = wantv ? n : 0,
        p = 0,
        a = copy(A),
        u = nu ? zeros(m, nu) : null,
        s = array(n, O),
        v = nv ? zeros(n, nv) : null,
        tol = n_div(constant.realmin, eta),
        x, y, z, w, q,
        e, r, g, f, h, sn, cs,
        i, j, k, l,
        kk, k1, l1, ll,
        iter, max_iter = 100,
        b = new Array(n),
        c = new Array(n),
        t = new Array(n),
        goto_240;

    // complex a
    // complex u
    // complex v
    // complex q
    // complex r
    // real sn
    // real cs
    // real b
    // real c
    // real f
    // real g
    // real h
    // real s
    // real t
    // real w
    // real x
    // real y
    // real z
    //
    //  Householder reduction.
    //
    c[1-1] = O;
    for (k=1; k<=n; ++k)
    {
        //10    continue
        k1 = k + 1;
        //
        //  Elimination of A(I,K), I = K+1, ..., M.
        //
        z = O;
        for (i=k; i<=m; ++i)
        {
            z = n_add(z, n_add(n_pow(real(a[i-1][k-1]), two), n_pow(imag(a[i-1][k-1]), two)));
        }

        b[k-1] = O;

        if (n_gt(z, tol))
        {
            z = realMath.sqrt(z);
            b[k-1] = z;
            w = scalar_abs(a[k-1][k-1]);

            if (n_eq(w, O))
            {
                q = I;
            }
            else
            {
                q = scalar_div(a[k-1][k-1], w);
            }

            a[k-1][k-1] = scalar_mul(q, n_add(z, w));

            if (k !== n+p)
            {
                for (j=k1; j<=n+p; ++j)
                {
                    q = O;
                    for (i=k; i<=m; ++i)
                    {
                        q = scalar_add(q, scalar_mul(scalar_conj(a[i-1][k-1]), a[i-1][j-1]));
                    }
                    q = scalar_div(q, n_mul(z, n_add(z, w)));
                    for (i=k; i<=m; ++i)
                    {
                        a[i-1][j-1] = scalar_sub(a[i-1][j-1], scalar_mul(q, a[i-1][k-1]));
                    }
                }

                //
                //  Phase transformation.
                //
                q = scalar_neg(scalar_sign(scalar_conj(a[k-1][k-1])));
                for (j=k1; j<=n+p; ++j)
                {
                    a[k-1][j-1] = scalar_mul(q, a[k-1][j-1]);
                }
            }
        }

        //
        //  Elimination of A(K,J), J = K+2, ..., N
        //
        if (k === n)
        {
            //go to 140
            break;
        }

        z = O;
        for (j=k1; j<=n; ++j)
        {
            z = n_add(z, n_add(n_pow(real(a[k-1][j-1]), two), n_pow(imag(a[k-1][j-1]), two)));
        }

        c[k1-1] = O;

        if (n_gt(z, tol))
        {
            z = realMath.sqrt(z);
            c[k1-1] = z;
            w = scalar_abs(a[k-1][k1-1]);

            if (n_eq(w, O))
            {
                q = I;
            }
            else
            {
                q = scalar_div(a[k-1][k1-1], w);
            }

            a[k-1][k1-1] = scalar_mul(q, n_add(z, w));

            for (i=k1; i<=m; ++i)
            {
                q = O;
                for (j=k1; j<=n; ++j)
                {
                    q = scalar_add(q, scalar_mul(scalar_conj(a[k-1][j-1]), a[i-1][j-1]));
                }
                q = scalar_div(q, n_mul(z, n_add(z, w)));
                for (j=k1; j<=n; ++j)
                {
                    a[i-1][j-1] = scalar_sub(a[i-1][j-1], scalar_mul(q, a[k-1][j-1]));
                }
            }

            //
            //  Phase transformation.
            //
            q = scalar_neg(scalar_sign(scalar_conj(a[k-1][k1-1])));
            for (i=k1; i<=m; ++i)
            {
                a[i-1][k1-1] = scalar_mul(a[i-1][k1-1], q);
            }
        }

        //k = k1;
        //go to 10
    }

    //
    //  Tolerance for negligible elements.
    //
    //140   continue
    e = O;
    for (k=1; k<=n; ++k)
    {
        s[k-1] = b[k-1];
        t[k-1] = c[k-1];
        e = max([e, n_add(s[k-1], t[k-1])]);
    }

    e = n_mul(eta, e);

    //
    //  Initialization of U and V.
    //
    if (0 < nu)
    {
        for (j=1; j<=nu; ++j)
        {
            u[j-1][j-1] = I;
        }
    }

    if (0 < nv)
    {
        for (j=1; j<=nv; ++j)
        {
            v[j-1][j-1] = I;
        }
    }

    //
    //  QR diagonalization.
    //
    for (kk=1; kk<=n; ++kk)
    {
        k = n + 1 - kk;
        //
        //  Test for split.
        //
        for (iter=1; iter<=max_iter; ++iter)
        {
            //220     continue
            goto_240 = true;
            for (ll=1; ll<=k; ++ll)
            {
                l = k + 1 - ll;
                if (n_le(realMath.abs(t[l-1]), e))
                {
                    //go to 290
                    goto_240 = false;
                    break;
                }
                if (n_le(realMath.abs(s[l-1-1]), e))
                {
                    //go to 240
                    goto_240 = true;
                    break;
                }
            }

            //
            //  Cancellation of E(L).
            //
            if (goto_240)
            {
                //240     continue
                cs = O;
                sn = I;
                l1 = l - 1;

                for (i=l; i<=k; ++k)
                {
                    f = n_mul(sn, t[i-1]);
                    t[i-1] = n_mul(cs, t[i-1]);

                    if (n_le(realMath.abs(f), e))
                    {
                        //go to 290
                        break;
                    }

                    h = s[i-1];
                    w = n_hypot(f, h);
                    s[i-1] = w;
                    cs = n_div(h, w);
                    sn = n_neg(n_div(f, w));

                    if (0 < nu)
                    {
                        for (j=1; j<=n; ++j)
                        {
                            x = real(u[j-1][l1-1]);
                            y = real(u[j-1][i-1]);
                            u[j-1][l1-1] = n_add(n_mul(x, cs), n_mul(y, sn));
                            u[j-1][i-1]  = n_sub(n_mul(y, cs), n_mul(x, sn));
                        }
                    }

                    if (0 < p)
                    {
                        for (j=n+1; j<=n+p; ++j)
                        {
                            q = a[l1-1][j-1];
                            r = a[i-1][j-1];
                            a[l1-1][j-1] = scalar_add(scalar_mul(q, cs), scalar_mul(r, sn));
                            a[i-1][j-1]  = scalar_sub(scalar_mul(r, cs), scalar_mul(q, sn));
                        }
                    }
                }
            }

            //
            //  Test for convergence.
            //
            //290     continue
            w = s[k-1];

            if (l === k)
            {
                //go to 360
                break;
            }

            //
            //  Origin shift.
            //
            x = s[l-1];
            y = s[k-1-1];
            g = t[k-1-1];
            h = t[k-1];
            f = n_div(n_add(n_mul(n_sub(y, w), n_add(y, w)), n_mul(n_sub(g, h), n_add(g, h))), n_mul(two, n_mul(h, y)));
            g = n_hypot(f, I);
            if (n_lt(f, O))
            {
                g = n_neg(g);
            }
            f = n_div(n_add(n_mul(n_sub(x, w), n_add(x, w)), n_mul(n_sub(n_div(y, n_add(f, g)), h), h)), x);

            //
            //  QR step.
            //
            cs = I;
            sn = I;
            l1 = l + 1;

            for (i=l1; l1<=k; ++l1)
            {
                g = t[i-1];
                y = s[i-1];
                h = n_mul(sn, g);
                g = n_mul(cs, g);
                w = n_hypot(h, f);
                t[i-1-1] = w;
                cs = n_div(f, w);
                sn = n_div(h, w);
                f = n_add(n_mul(x, cs), n_mul(g, sn));
                g = n_sub(n_mul(g, cs), n_mul(x, sn));
                h = n_mul(y, sn);
                y = n_mul(y, cs);

                if (0 < nv)
                {
                    for (j=1; j<=n; ++j)
                    {
                        x = real(v[j-1][i-1-1]);
                        w = real(v[j-1][i-1]);
                        v[j-1][i-1-1] = n_add(n_mul(x, cs), n_mul(w, sn));
                        v[j-1][i-1]   = n_sub(n_mul(w, cs), n_mul(x, sn));
                    }
                }

                w = n_hypot(h, f);
                s[i-1-1] = w;
                cs = n_div(f, w);
                sn = n_div(h, w);
                f = n_add(n_mul(cs, g), n_mul(sn, y));
                x = n_sub(n_mul(cs, y), n_mul(sn, g));

                if (0 < nu)
                {
                    for (j=1; j<=n; ++j)
                    {
                        y = real(u[j-1][i-1-1]);
                        w = real(u[j-1][i-1]);
                        u[j-1][i-1-1] = n_add(n_mul(y, cs), n_mul(w, sn));
                        u[j-1][i-1]   = n_sub(n_mul(w, cs), n_mul(y, sn));
                    }
                }

                if (0 < p)
                {
                    for (j=n+1; j<=n+p; ++j)
                    {
                        q = a[i-1-1][j-1];
                        r = a[i-1][j-1];
                        a[i-1-1][j-1] = scalar_add(scalar_mul(q, cs), scalar_mul(r, sn));
                        a[i-1][j-1]   = scalar_sub(scalar_mul(r, cs), scalar_mul(q, sn));
                    }
                }
            }

            t[l-1] = O;
            t[k-1] = f;
            s[k-1] = x;
            //go to 220
        }

        //
        //  Convergence.
        //
        //360     continue
        if (n_lt(w, O))
        {
            s[k-1] = n_neg(w);
            if (0 < nv)
            {
                for (j=1; j<=n; ++j)
                {
                    v[j-1][k-1] = scalar_neg(v[j-1][k-1]);
                }
            }
        }
    }

    //
    //  Sort the singular values.
    //
    for (k=1; k<=n; ++k)
    {
        g = -1;
        j = k;

        for (i=k; i<=n; ++i)
        {
            if (n_gt(s[i-1], g))
            {
                g = s[i-1];
                j = i;
            }
        }

        if (j !== k)
        {
            s[j-1] = s[k-1];
            s[k-1] = g;

            //
            //  Interchange V(1:N,J) and V(1:N,K).
            //
            if (0 < nv)
            {
                for (i=1; i<=n; ++i)
                {
                    q           = v[i-1][j-1];
                    v[i-1][j-1] = v[i-1][k-1];
                    v[i-1][k-1] = q;
                }
            }

            //
            //  Interchange U(1:N,J) and U(1:N,K).
            //
            if (0 < nu)
            {
                for (i=1; i<=n; ++i)
                {
                    q           = u[i-1][j-1];
                    u[i-1][j-1] = u[i-1][k-1];
                    u[i-1][k-1] = q;
                }
            }

            //
            //  Interchange A(J,N1:NP) and A(K,N1:NP).
            //
            if (0 < p)
            {
                for (i=n+1; i<=n+p; ++i)
                {
                    q           = a[j-1][i-1];
                    a[j-1][i-1] = a[k-1][i-1];
                    a[k-1][i-1] = q;
                }
            }
        }
    }

    //
    //  Back transformation.
    //
    if (0 < nu)
    {
        for (kk=1; kk<=n; ++kk)
        {
            k = n + 1 - kk;
            if (!n_eq(b[k-1], O))
            {
                q = scalar_neg(scalar_sign((a[k-1][k-1])));

                for (j=1; j<=nu; ++j)
                {
                    u[k-1][j-1] = scalar_mul(q, u[k-1][j-1]);
                }

                for (j=1; j<=nu; ++j)
                {
                    q = O;
                    for (i=k; i<=m; ++i)
                    {
                        q = scalar_add(q, scalar_mul(scalar_conj(a[i-1][k-1]), u[i-1][j-1]));
                    }
                    q = scalar_div(q, scalar_mul(scalar_abs(a[k-1][k-1]), b[k-1]));
                    for (i=k; i<=m; ++i)
                    {
                        u[i-1][j-1] = scalar_sub(u[i-1][j-1], scalar_mul(q, (a[i-1][k-1])));
                    }
                }
            }
        }
    }

    if (0 < nv)
    {
        if (2 <= n)
        {
            for (kk=2; kk<=n; ++kk)
            {
                k = n + 1 - kk;
                k1 = k + 1;

                if (!n_eq(c[k1-1], O))
                {
                    q = scalar_neg(scalar_sign(scalar_conj(a[k-1][k1-1])));
                    for (j=1; j<=nv; ++j)
                    {
                        v[k1-1][j-1] = scalar_mul(q, v[k1-1][j-1]);
                    }

                    for (j=1; j<=nv; ++j)
                    {
                        q = O;
                        for (i=k1; i<=n; ++i)
                        {
                            q = scalar_add(q, scalar_mul((a[k-1][i-1]), v[i-1][j-1]));
                        }
                        q = scalar_div(q, scalar_mul(scalar_abs(a[k-1][k1-1]), c[k1-1]));
                        for (i=k1; i<=n; ++i)
                        {
                            v[i-1][j-1] = scalar_sub(v[i-1][j-1], scalar_mul(q, scalar_conj(a[k-1][i-1])));
                        }
                    }
                }
            }
        }
    }
    return wantu && wantv ? [realify(u), s, realify(v)] : (wantu || wantv ? [realify(u || v), s] : s);
}
fn.svd = varargout(function(nargout, x, eps) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("svd");
    if (1 < nargout)
    {
        var ans = svd(x, eps, 1 < nargout, 2 < nargout);
        return [ans[0], diag(ans[1]), ans[2]];
    }
    else
    {
        return svd(x, eps, false, false);
    }
});
function int_gauss_jordan(A, hermite, wantu)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A),
        dim = columns, pl = 0, r, i, i0, p0,
        lead, imin, im, min, a, z, m, eps = O;
    m = wantu ? concat(A, eye(rows)) : A;
    lead = 0;
    for (r=0; r<rows; ++r)
    {
        if (dim <= lead) break;

        i = r;
        while (le(scalar_abs(m[i][lead]), eps))
        {
            ++i;
            if (rows <= i)
            {
                i = r; ++lead;
                if (dim <= lead)
                {
                    lead = -1;
                    break;
                }
            }
        }
        if (-1 === lead) break; // nothing to do

        i0 = i;
        imin = -1; min = null; z = 0;
        // find row with min abs leading value non-zero for current column lead
        for (i=i0; i<rows; ++i)
        {
            a = scalar_abs(m[i][lead]);
            if (le(a, eps)) ++z;
            else if ((null == min) || lt(a, min)) {min = a; imin = i;}
        }
        for (;;)
        {
            if (-1 === imin) break; // all zero, nothing else to do
            if (rows-i0 === z+1)
            {
                // only one non-zero, swap row to put it first
                if (r !== imin)
                {
                    SWAPR(m, r, imin);
                }
                if (lt(m[r][lead], O))
                {
                    // make it positive
                    ADDR(m, r, r, O, J, lead);
                }
                if (hermite)
                {
                    a = m[r][lead];
                    for (i=0; i<r; ++i)
                    {
                        if (ge(scalar_abs(m[i][lead]), a))
                        {
                            // make strictly smaller
                            ADDR(m, i, r, scalar_neg(fn.floor(scalar_div(m[i][lead], a))), I, lead);
                        }
                        if (lt(m[i][lead], O))
                        {
                            // make positive
                            ADDR(m, i, r, I, I, lead);
                        }
                    }
                }
                i = imin; i0 = r;
                break;
            }
            else
            {
                z = 0; im = imin;
                for (i=i0; i<rows; ++i)
                {
                    if (i === im) continue;
                    // subtract min row from other rows
                    ADDR(m, i, im, scalar_neg(fn.floor(scalar_div(m[i][lead], m[im][lead]))), I, lead);

                    // find again row with min abs value for this column as well for next round
                    a = scalar_abs(m[i][lead]);
                    if (le(a, eps)) ++z;
                    else if (lt(a, min)) {min = a; imin = i;}
                }
            }
        }

        ++lead;
    }
    return wantu ? [slice(m, 0, columns, rows-1, rows+columns-1), slice(m, 0, 0, rows-1, columns-1)] : m;
}
var iref = int_gauss_jordan;
fn.hermiteForm = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("hermiteForm");
    return iref(fn.round(fn.real(A)), true, 1 < nargout);
});
function snf(A, wantl, wantr)
{
    // adapted from https://github.com/foo123/Abacus
    var rows, columns, dim, left, right,
        last_j, i, j, upd, ii, jj, non_zero, i1, i0, g,
        coef1, coef2, coef3, coef4, coef5, tmp, tmp2;
    rows = ROWS(A);
    columns = COLS(A);
    dim = stdMath.min(rows, columns);
    if (wantl) left = eye(rows);
    if (wantr) right = eye(columns);
    last_j = -1;
    for (i=0; i<rows; ++i)
    {
        non_zero = false;
        for (j=last_j+1; j<columns; ++j)
        {
            for (i0=0; i0<rows; ++i0)
                if (!n_eq(A[i0][j], O))
                    break;
            if (i0 < rows)
            {
                non_zero = true;
                break;
            }
        }
        if (!non_zero) break;

        if (n_eq(A[i][j], O))
        {
            for (ii=0; ii<rows; ++ii)
                if (!n_eq(A[ii][j], O))
                    break;
            MULR(A, i, ii, O, I, I, O);
            if (wantl) MULC(left, i, ii, O, I, I, O);
        }
        MULC(A, j, i, O, I, I, O);
        if (wantr) MULR(right, j, i, O, I, I, O);
        j = i;
        upd = true;
        while (upd)
        {
            upd = false;
            for (ii=i+1; ii<rows; ++ii)
            {
                if (n_eq(A[ii][j], O)) continue;
                upd = true;
                if (!n_eq(O, n_mod(A[ii][j], A[i][j])))
                {
                    g = n_xgcd([A[i][j], A[ii][j]]);
                    coef1 = g[1]; coef2 = g[2];
                    coef3 = n_div(A[ii][j], g[0]);
                    coef4 = n_div(A[i][j], g[0]);
                    MULR(A, i, ii, coef1, coef2, n_neg(coef3), coef4);
                    if (wantl) MULC(left, i, ii, coef4, n_neg(coef2), coef3, coef1);
                }
                coef5 = n_div(A[ii][j], A[i][j]);
                MULR(A, i, ii, I, O, n_neg(coef5), I);
                if (wantl) MULC(left, i, ii, I, O, coef5, I);
            }
            for (jj=j+1; jj<columns; ++jj)
            {
                if (n_eq(A[i][jj], O)) continue;
                upd = true;
                if (!n_eq(O, n_mod(A[i][jj], A[i][j])))
                {
                    g = n_xgcd([A[i][j], A[i][jj]]);
                    coef1 = g[1]; coef2 = g[2];
                    coef3 = n_div(A[i][jj], g[0]);
                    coef4 = n_div(A[i][j], g[0]);
                    MULC(A, j, jj, coef1, n_neg(coef3), coef2, coef4);
                    if (wantr) MULR(right, j, jj, coef4, coef3, n_neg(coef2), coef1);
                }
                coef5 = n_div(A[i][jj], A[i][j]);
                MULC(A, j, jj, I, n_neg(coef5), O, I);
                if (wantr) MULR(right, j, jj, I, coef5, O, I);
            }
        }
        last_j = j;
    }
    for (i1=0; i1<dim; ++i1)
    {
        for (i0=i1-1; i0>=0; --i0)
        {
            g = n_xgcd([A[i0][i0], A[i1][i1]]);
            if (n_eq(g[0], O)) continue;
            coef1 = g[1]; coef2 = g[2];
            coef3 = n_div(A[i1][i1], g[0]);
            coef4 = n_div(A[i0][i0], g[0]);
            tmp = n_mul(coef2, coef3);
            tmp2 = n_sub(I, n_mul(coef1, coef4));
            MULR(A, i0, i1, I, coef2, coef3, n_sub(tmp, I));
            if (wantl) MULC(left, i0, i1, n_sub(I, tmp), coef2, coef3, J);
            MULC(A, i0, i1, coef1, tmp2, I, n_neg(coef4));
            if (wantr) MULR(right, i0, i1, coef4, tmp2, I, n_neg(coef1));
        }
    }
    return wantl && wantr ? [A/*diagonal center matrix*/, left/*left matrix*/, right/*right matrix*/] : (wantl ? [A, left] : (wantr ? [A, right] : A));
}
fn.smithForm = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported('smithForm');
    var ans = snf(fn.round(fn.real(A)), 1 < nargout, 1 < nargout);
    return 1 < nargout ? [ans[1], ans[2], ans[0]] : ans;
});
function sqrtm_tri(T, stat)
{
    /*
    "Computing matrix functions",
    Nicholas J. Higham, Awad H. Al-Mohy,
    Acta Numerica (2010), pp. 159–208,
    Algorithm 4.6 based on Schur method due to Bjorck and Hammarling (1983)
    */
    // sqrtm of upper triangular matrix
    var n = ROWS(T),
        U = matrix(n, n, O),
        i, j, k, kl, UU, p, q,
        stat_ = {err:0};
    for (j=0; j<n; ++j)
    {
        U[j][j] = fn.sqrt(T[j][j]);
        kl = j-1;
        for (i=j-1; i>=0; --i)
        {
            for (UU=O,k=i+1; k<=kl; ++k)
            {
                UU = scalar_add(UU, scalar_mul(U[i][k], U[k][j]));
            }
            p = scalar_sub(T[i][j], UU);
            q = scalar_add(U[i][i], U[j][j]);
            if (eq(p, O))
            {
                U[i][j] = O;
            }
            else if (eq(q, O))
            {
                stat_.err = 1;
                U[i][j] = scalar_div(p, q);
            }
            else
            {
                U[i][j] = scalar_div(p, q);
            }
        }
    }
    if (stat && (null != stat.err)) stat.err = stat_.err;
    return U;
}
function sqrtm(A, stat)
{
    /*
    "A new stable and avoiding inversion iteration for computing matrix square root",
    Li ZHU, Keqi YE, Yuelin ZHAO, Feng WU, Jiqiang HU, Wanxie ZHONG, 2022
    https://arxiv.org/abs/2206.10346
    */
    /*
    var max_iter = 100;
    var n = ROWS(A),
        X, Xnext,
        Y, Ynext,
        In, I34,
        one_fourth = __(0.25),
        three_fourths = __(0.75),
        m, a, iter, eps = __(1e-10);
    // estimate of 2-norm of A for convergence test
    m = realMath.sqrt(n_mul(norm(A, I), norm(A, inf)));
    eps = n_mul(eps, m);
    In = eye(n);
    I34 = eye(n, three_fourths);
    a = half;
    m = scalar_div(a, m);
    X = dotmul(A, fn.sqrt(m));
    Y = sub(In, dotmul(A, m));
    for (iter=1; iter<=max_iter; ++iter)
    {
        Xnext = mul(X, add(In, dotmul(half, Y)));
        if (n_le(max(max(abs(sub(Xnext, X)))), eps)) break;
        Ynext = mul(mul(Y, Y), add(I34, dotmul(one_fourth, Y)));
        X = Xnext; Y = Ynext;
    }
    return realify(X); // -> A^(1/2)
    */

    /*
    "Computing matrix functions",
    Nicholas J. Higham, Awad H. Al-Mohy,
    Acta Numerica (2010), pp. 159–208,
    Algorithm 4.6 based on Schur method due to Bjorck and Hammarling (1983)
    */
    var QT = schur(A, true, "complex"),
        Q = QT[0], T = QT[1];
    return mul(mul(Q, sqrtm_tri(T, stat)), ctranspose(Q));
}
fn.sqrtm = varargout(function(nargout, A) {
    if (2 < nargout) throw "sqrtm: output not supported";
    if (is_scalar(A)) return 1 < nargout ? [fn.sqrt(A), O] : fn.sqrt(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sqrtm");
    if (1 === ROWS(A)) return 1 < nargout ? [[[fn.sqrt(A[0][0])]], O] : [[fn.sqrt(A[0][0])]];
    var sqrtA = sqrtm(A);
    return 1 < nargout ? [sqrtA, scalar_div(norm(sub(A, mul(sqrtA, sqrtA)), I), norm(A, I))] : sqrtA;
});
function expm(A, with_neg)
{
    /*
    "Nineteen Dubious Ways to Compute the Exponential of a Matrix, Twenty-Five Years Later",
    Cleve Moler, Charles Van Loan,
    SIAM REVIEW, 2003
    */
    // exp(A) by scaling, power series approximation and squaring

    with_neg = 'with_neg' === with_neg;

    var n = ROWS(A),
        eps = __(1e-15),
        i, N = 25, sgn = -1,
        In = eye(n), An,
        expA, expA_neg, expA_prev,
        converged_1 = false, converged_2 = !with_neg,
        k = max([O, n_add(I, realMath.floor(realMath.log2(norm(A, inf))))]);

    // down-scaling by a power of 2
    A = dotdiv(A, n_pow(two, k));

    // power series of exp(A) up to N terms,
    // I + A + A^2/2! + A^3/3! + ..
    // in general converges
    An = A;
    expA = add(In, An);
    expA_neg = with_neg ? sub(In, An) : In;
    for (i=2; i<=N; ++i)
    {
        sgn = -sgn;
        An = dotdiv(mul(A, An), __(i));
        /*if (!converged_1)
        {*/
            //expA_prev = expA;
            expA = add(expA, An);
            //if (n_le(max(max(abs(sub(expA, expA_prev)))), eps)) converged_1 = true; // converged
        /*}*/
        if (with_neg/*!converged_2*/)
        {
            //expA_prev = expA_neg;
            expA_neg = 0 > sgn ? sub(expA_neg, An) : add(expA_neg, An);
            //if (n_le(max(max(abs(sub(expA_neg, expA_prev)))), eps)) converged_2 = true; // converged
        }
        if (i > 5 && n_le(max(max(abs(An))), eps)) break;
        //if (converged_1 && converged_2) break; // converged
    }

    // fast squaring
    for (i=1,k=_(k); i<=k; ++i) expA = mul(expA, expA);
    if (with_neg) for (i=1; i<=k; ++i) expA_neg = mul(expA_neg, expA_neg);

    return with_neg ? {'+':expA, '-':expA_neg} : expA;
}
fn.expm = function(A) {
    if (is_scalar(A)) return fn.exp(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("expm");
    if (1 === ROWS(A)) return [[fn.exp(A[0][0])]];
    return expm(A);
};
function logm_tri(T, stat)
{
    // log(A) by inverse squaring(sqrt), Taylor approximation and inverse scaling
    // for upper triangular T
    var n = ROWS(T),
        BT = balance(T, null, true),
        B = BT[0],
        In = eye(n),
        theta = __(0.013325),
        s = 0, tries = 0,
        An, logA, i, N,
        stat_ = {err:0};

    T = BT[1];

    // inverse squaring (sqrt)
    while (n_gt(norm(sub(T, In), inf), theta))
    {
        T = sqrtm_tri(T, stat_);
        ++s;
        ++tries;
        if (tries > 20) stat_.err = 1;
        if (stat_.err) break;
    }

    T = sub(T, In);
    An = T;
    // Taylor expansion of log(I+A) up to N terms,
    // A - A^2/2 + A^3/3 - A^4/4 + ..
    logA = An;
    if (!stat_.err)
    {
        for (i=2,N=10; i<=N; ++i)
        {
            An = mul_tri(T, An);
            logA = i & 1 ? add(logA, dotdiv(An, __(i))) : sub(logA, dotdiv(An, __(i)));
        }
    }

    // inverse scaling
    if (0 < s) logA = dotmul(logA, n_pow(two, s));

    if (stat && (null != stat.err)) stat.err = stat_.err;
    return mul(mul(diag(B), logA), diag(B.map(function(bi) {return n_inv(bi);})));
}
function logm(A, stat)
{
    var QT = schur(A, true, "complex"),
        Q = QT[0], T = QT[1];
    return mul(mul(Q, logm_tri(T, stat)), ctranspose(Q));
}
fn.logm = varargout(function(nargout, A) {
    var logA, stat = {err:0};
    if (is_scalar(A))
    {
        logA = fn.log(A);
    }
    else
    {
        if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("logm");
        logA = logm(A, stat);
    }
    return 1 < nargout ? [logA, stat.err] : logA;
});
function sgn(z)
{
    if (n_eq(real(z), O))
    {
        return n_eq(imag(z), O) ? I : realMath.sign(imag(z));
    }
    else
    {
        return realMath.sign(real(z));
    }
}
function signm_tri(T)
{
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/acoshm.m
    // sign(T) for upper triangular T
    var n = ROWS(T),
        S = eye(n),
        i, j, k,
        p, d, s;
    for (i=0; i<n; ++i)
    {
        S[i][i] = sgn(T[i][i]);
    }
    for (p=0; p<n-1; ++p)
    {
        for (i=0; i<n-p; ++i)
        {
            j = i+p;
            d = scalar_sub(T[j][j], T[i][i]);

            // solve via S^2 = I if we can.
            if (!eq(S[i][i], scalar_neg(S[j][j])))
            {
                // get S(i,j) from S^2 = I.
                for (k=i+1; k<=j-1; ++k)
                {
                    S[i][j] = scalar_div(scalar_mul(scalar_neg(S[i][k]), S[k][j]), scalar_add(S[i][i], S[j][j]));
                }
            }
            else
            {
                // get S(i,j) from S*T = T*S.
                s = scalar_mul(T[i][j], scalar_sub(S[j][j], S[i][i]));
                if (p > 0)
                {
                    for (k=i+1; k<=j-1; ++k)
                    {
                        s = scalar_add(s, scalar_sub(scalar_mul(T[i][k], S[k][j]), scalar_mul(S[i][k], T[k][j])));
                    }
                }
                S[i][j] = scalar_div(s, d);
            }
        }
    }
    return S;
}
function signm(A)
{
    var QT = schur(A, true, "complex"), Q = QT[0], T = QT[1];
    return mul(mul(Q, signm_tri(T)), ctranspose(Q));
}
fn.signm = function(A) {
    if (is_scalar(A)) return fn.sign(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("signm");
    if (1 === ROWS(A)) return [[fn.sign(A[0][0])]];
    return signm(A);
};
fn.cosm = function(A) {
    if (is_scalar(A)) return fn.cos(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("cosm");
    if (1 === ROWS(A)) return [[fn.cos(A[0][0])]];
    var exp = expm(dotmul(A, i), 'with_neg');
    return dotdiv(add(exp['+'], exp['-']), two);//dotdiv(add(expm(dotmul(A, i)), expm(dotmul(A, scalar_mul(J, i)))), two);
};
fn.sinm = function(A) {
    if (is_scalar(A)) return fn.sin(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sinm");
    if (1 === ROWS(A)) return [[fn.sin(A[0][0])]];
    var exp = expm(dotmul(A, i), 'with_neg');
    return dotdiv(sub(exp['+'], exp['-']), scalar_mul(two, i));//dotdiv(sub(expm(dotmul(A, i)), expm(dotmul(A, scalar_mul(J, i)))), scalar_mul(two, i));
};
fn.coshm = function(A) {
    if (is_scalar(A)) return fn.cosh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("coshm");
    if (1 === ROWS(A)) return [[fn.cosh(A[0][0])]];
    var exp = expm(A, 'with_neg');
    return dotdiv(add(exp['+'], exp['-']), two);//dotdiv(add(expm(A), expm(dotmul(A, J))), two);
};
fn.sinhm = function(A) {
    if (is_scalar(A)) return fn.sinh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sinhm");
    if (1 === ROWS(A)) return [[fn.sinh(A[0][0])]];
    var exp = expm(A, 'with_neg');
    return dotdiv(sub(exp['+'], exp['-']), two);//dotdiv(sub(expm(A), expm(dotmul(A, J))), two);
};
/*function normAm(A, m)
{
    return norm(pow(A, m), inf);
    var n = ROWS(A), e, j, c, mv;
    // for positive matrices only
    e = ones(n, 1);
    A = ctranspose(A);
    for (j=1; j<=m; ++j)
    {
        e = mul(A, e);
    }
    c = norm(e, inf);
    //mv = m;
    return c;//[c, mv];
}*/
function acosm(A)
{
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/acosm.m

    // Beta values for the backward error analysis.
    var beta = [
     __(0.000034417071) // k = 1
    ,__(0.004807320816) // k = 2
    ,__(0.039685094175) // k = 3
    ,__(0.126262963075) // k = 4
    ,__(0.258567093540) // k = 5
    ,__(0.416519074566) // k = 6
    ,__(0.580947286323) // k = 7
    ,__(0.738997052037) // k = 8
    ,__(0.883885725911) // k = 9
    ,__(1.013025759393) // k = 10
    ,__(1.126269612452) // k = 11
    ,__(1.224699157280) // k = 12
    ],
    n = ROWS(A),
    WT = schur(A, true, "complex"),
    W = WT[0], T = WT[1],
    In = eye(n),
    s = 0,
    k = 0,
    d = diag(T),
    d2, d3, d4, d5,
    a2, a3, a4,
    p, q, P, Q,
    Z, powZ, ZZ, S1, S2;

    if (any(d, function(d) {return n_eq(imag(d), O) && (n_eq(real(d), J) || n_eq(real(d), I));}))
    {
        fn.warning("acosm: input must not have an eigenvalue of 1 or -1 else result may be unreliable!");
    }

    // Compute lower bound on the number of square roots required.
    while (gt(norm(sub(I, d), inf), beta[7]))
    {
        ++s;
        d = fn.sqrt(dotdiv(add(I, d), two));
    }
    for (i=1; i<=s; ++i)
    {
        T = sqrtm_tri(dotdiv(add(In, T), two));
    }

    // Determine degree of approximant.
    while (0 === k)
    {
        Z = sub(In, T);

        powZ = mul_tri(Z, Z);
        d2 = n_pow(norm(powZ, inf), 1/2);
        powZ = mul_tri(Z, powZ);
        d3 = n_pow(norm(powZ, inf), 1/3);
        a2 = n_gt(d2, d3) ? d2 : d3;
        if (n_le(a2, beta[0])) {k = 1; break;}
        if (n_le(a2, beta[1])) {k = 2; break;}
        powZ = mul_tri(Z, powZ);
        d4 = n_pow(norm(powZ, inf), 1/4);
        a3 = n_gt(d3, d4) ? d3 : d4;
        if (n_le(a3, beta[2])) {k = 3; break;}
        if (n_le(a3, beta[3])) {k = 4; break;}
        if (n_le(a3, beta[4])) {k = 5; break;}
        powZ = mul_tri(Z, powZ);
        d5 = n_pow(norm(powZ, inf), 1/5);
        a4 = n_gt(d4, d5) ? d4 : d5;
        a4 = n_lt(a3, a4) ? a3 : a4;
        if (n_le(a4, beta[5])) {k = 6; break;}
        if (n_le(a4, beta[6])) {k = 7; break;}
        if (n_le(a4, beta[7])) {k = 8; break;}

        T = sqrtm_tri(dotdiv(add(In, T), two));
        ++s;
    }

    // Pade coefficients obtained with Mathematica (rounded to floating point).
    // For better efficiency the Pade approximants should be evaluated
    // using the Paterson-Stockmeyer algorithm.
    if (1 === k)
    {
        p = [
        I,
        __(-0.1417)
        ];

        q = [
        I,
        __(-0.2250)
        ];
    }
    else if (2 === k)
    {
        p = [
        I,
        __(-0.3891),
        __(0.0187)
        ];

        q = [
        I,
        __(-0.4724),
        __(0.0393)
        ];
    }
    else if (3 === k)
    {
        p = [
        I,
        __(-0.6381843806),
        __(0.0998258508),
        __(-0.0024223030)
        ];

        q = [
        I,
        __(-0.7215177140),
        __(0.1412023270),
        __(-0.0062410636)
        ];
    }
    else if (4 === k)
    {
        p = [
        I,
        __(-0.8877087699),
        __(0.2433623027),
        __(-0.0212197774),
        __(0.0003104661)
        ];

        q = [
        I,
        __(-0.9710421032),
        __(0.3055324779),
        __(-0.0340541349),
        __(0.0009394670)
        ];
    }
    else if (5 === k)
    {
        p = [
        I,
        __(-1.1374227978),
        __(0.4493652033),
        __(-0.0719901333),
        __(0.0040450280),
        __(-0.0000395692)
        ];

        q = [
        I,
        __(-1.2207561311),
        __(0.5323448809),
        __(-0.0990433864),
        __(0.0072305607),
        __(-0.0001367979)
        ];
    }
    else if (6 === k)
    {
        p = [
        I,
        __(-1.3872329589),
        __(0.7178511241),
        __(-0.1703500659),
        __(0.0182193375),
        __(-0.0007178871),
        __(0.0000050248)
        ];

        q = [
        I,
        __(-1.4705662922),
        __(0.8216483151),
        __(-0.2168279980),
        __(0.0271898450),
        __(-0.0014099871),
        __(0.0000194672)
        ];
    }
    else if (7 === k)
    {
        p = [
        I,
        __(-1.6370982760),
        __(1.0488276715),
        __(-0.3319213490),
        __(0.0537536569),
        __(-0.0041439924),
        __(0.0001211160),
        __(-0.0000006365)
        ];

        q = [
        I,
        __(-1.7204316094),
        __(1.1734469723),
        __(-0.4030308611),
        __(0.0730391826),
        __(-0.0066542668),
        __(0.0002586530),
        __(-0.0000027240)
        ];
    }
    else if (8 === k)
    {
        p = [
        I,
        __(-1.8869980457),
        __(1.4422987012),
        __(-0.5723275787),
        __(0.1254739271),
        __(-0.0149128371),
        __(0.0008717583),
        __(-0.0000196760),
        __(0.0000000805)
        ];

        q = [
        I,
        __(-1.9703313790),
        __(1.5877429828),
        __(-0.6732761377),
        __(0.1609063722),
        __(-0.0215156706),
        __(0.0014963185),
        __(-0.0000453099),
        __(0.0000003763)
        ];
    }
    else
    {
        p = [I];

        q = [I];
    }

    ZZ = array(p.length, function(i, ZZ) {
        return 0 === i ? In : (1 === i ? Z : mul_tri(Z, ZZ[i-1]));
    });
    P = zeros(n, n);
    Q = zeros(n, n);
    ZZ.forEach(function(ZZi, i) {
        P = add(P, dotmul(p[i], ZZi));
        Q = add(Q, dotmul(q[i], ZZi));
    });
    S1 = linsolve(Q, P);
    S2 = mul(dotmul(S1, sqrt2), sqrtm_tri(Z));
    S2 = dotmul(n_pow(two, s), S2);
    return mul(mul(W, S2), ctranspose(W));
}
fn.acosm = function(A) {
    if (is_scalar(A)) return fn.acos(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("acosm");
    if (1 === ROWS(A)) return [[fn.acos(A[0][0])]];
    return acosm(A);
};
fn.asinm = function(A) {
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/asinm.m
    if (is_scalar(A)) return fn.asin(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("asinm");
    if (1 === ROWS(A)) return [[fn.asin(A[0][0])]];
    return sub(eye(ROWS(A), __(pi/2)), acosm(A));
};
function acoshm(A)
{
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/acoshm.m
    var n = ROWS(A),
        QT = schur(A, true, "complex"),
        Q = QT[0],
        T = QT[1],
        d = diag(T),
        In = eye(n);
    if (any(d, function(d) {return n_eq(imag(d), O) && n_lt(O, real(d)) && n_le(real(d), I);}))
    {
        return mul(mul(Q, logm_tri(add(T, mul_tri(sqrtm_tri(sub(T, In)), sqrtm_tri(add(T, In)))))), ctranspose(Q));
    }
    else
    {
        // let acosm issue errors for eigenvals 1 or -1.
        return dotmul(mul(mul(Q, mul_tri(signm_tri(dotmul(T, scalar_mul(J, i))), acosm(T))), ctranspose(Q)), i);
    }
}
fn.acoshm = function(A) {
    if (is_scalar(A)) return fn.acosh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("acoshm");
    if (1 === ROWS(A)) return [[fn.acosh(A[0][0])]];
    return acoshm(A);
};
fn.asinhm = function(A) {
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/asinhm.m
    if (is_scalar(A)) return fn.asinh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("asinhm");
    if (1 === ROWS(A)) return [[fn.asinh(A[0][0])]];
    return dotmul(fn.asinm(dotmul(A, scalar_mul(J, i))), i);
};
/*
"Blind beamforming for non Gaussian signals",
Jean-Francois Cardoso and Antoine Souloumiac, 1993

"On the performance of orthogonal source separation algorithms",
Jean-Francois Cardoso, 1994

"High-order contrasts for independent component analysis",
Jean-Francois Cardoso, 1999
*/

// jadeR.m
// adapted from Cardoso's 2013 version of jadeR.m
// https://www2.iap.fr/users/cardoso/compsep_classic.html
fn.jadeR = $fn("jadeR", `function B =  jadeR(X, m)
%   B = jadeR(X, m) is an m*n matrix such that Y=B*X are separated sources
%    extracted from the n*T data matrix X.
%   If m is omitted,  B=jadeR(X)  is a square n*n matrix (as many sources as sensors)
%
% Blind separation of real signals with JADE.  Version 1.9.   August 2013
%
% Usage:
%   * If X is an nxT data matrix (n sensors, T samples) then
%     B=jadeR(X) is a nxn separating matrix such that S=B*X is an nxT
%     matrix of estimated source signals.
%   * If B=jadeR(X,m), then B has size mxn so that only m sources are
%     extracted.  This is done by restricting the operation of jadeR
%     to the m first principal components.
%   * Also, the rows of B are ordered such that the columns of pinv(B)
%     are in order of decreasing norm; this has the effect that the
%     'most energetically significant' components appear first in the
%     rows of S=B*X.

% Finding the number of sources
[n,T]	= size(X);
if nargin==1, m=n ; end; 	% Number of sources defaults to # of sensors
if m>n, error("jadeR: more sources than sensors are not supported"); end;

% Mean removal
X	= X - mean(X')' * ones(1,T);

%%% whitening & projection onto signal subspace
[U,D]     = eig((X*X')/T) ; %% An eigen basis for the sample covariance matrix
[Ds,k]    = sort(diag(D)) ; %% Sort by increasing variance
PCs       = n:-1:n-m+1    ; %% The m most significant princip. comp. by decreasing variance

%% --- PCA  ----------------------------------------------------------
B         = U(:,k(PCs))'    ; % At this stage, B does the PCA on m components

%% --- Scaling  ------------------------------------------------------
scales    = sqrt(Ds(PCs)) ; % The scales of the principal components .
B         = diag(1./scales)*B  ; % Now, B does PCA followed by a rescaling = sphering

%% --- Sphering ------------------------------------------------------
X         = B*X;  %% We have done the easy part: B is a whitening matrix and X is white.

%clear U D Ds k PCs scales ;
U = 0;
D = 0;
Ds = 0;
k = 0;
PCs = 0;
scales = 0;

%%% Estimation of the cumulant matrices.
X = X';
dimsymm 	= (m*(m+1))/2;	% Dim. of the space of real symm matrices
nbcm 		= dimsymm  ; 	% number of cumulant matrices
CM 		= zeros(m,m*nbcm);  % Storage for cumulant matrices
R 		= eye(m);  	%%
Qij 		= zeros(m);	% Temp for a cum. matrix
Xim		= zeros(m,1);	% Temp
Xijm		= zeros(m,1);	% Temp
Uns		= ones(1,m);    % for convenience
Range     = 1:m ; % will index the columns of CM where to store the cumulant matrices.
for im = 1:m
  Xim = X(:,im) ;
  Xijm= Xim.*Xim ;
  %% Note to myself: the -R on next line can be removed: it does not affect
  %% the joint diagonalization criterion
  Qij           = ((Xijm(:,Uns).*X)' * X)/T - R - 2 * R(:,im)*R(:,im)' ;
  CM(:,Range)	= Qij ;
  Range         = Range  + m ;
  for jm = 1:im-1
    Xijm        = Xim.*X(:,jm) ;
    Qij         = sqrt(2) *(((Xijm(:,Uns).*X)' * X)/T - R(:,im)*R(:,jm)' - R(:,jm)*R(:,im)') ;
    CM(:,Range)	= Qij ;
    Range       = Range  + m ;
  end ;
end;

%%% Joint diagonalization of the cumulant matrices
if 0, 	%% Init by diagonalizing a *single* cumulant matrix.  It seems to save
	%% some computation time 'sometimes'.  Not clear if initialization is really worth
	%% it since Jacobi rotations are very efficient.  On the other hand, it does not
	%% cost much...
	[V,D]	= eig(CM(:,1:m)); % Selectng a particular cumulant matrix.
	for u=1:m:m*nbcm,         % Accordingly updating the cumulant set given the init
		CM(:,u:u+m-1) = CM(:,u:u+m-1)*V ;
	end;
	CM	= V'*CM;
else,	%% The dont-try-to-be-smart init
	V	= eye(m) ; % la rotation initiale
end;

%% Computing the initial value of the contrast
Diag    = zeros(m,1) ;
On      = 0 ;
Range   = 1:m ;
for im = 1:nbcm,
  Diag  = diag(CM(:,Range)) ;
  On    = On + sum(Diag.*Diag) ;
  Range = Range + m ;
end;
Off = sum(sum(CM.*CM)) - On ;

seuil	= 1.0e-6 / sqrt(T) ; % A statistically scaled threshold on 'small' angles
encore	= 1;
sweep	= 0; % sweep number
updates = 0; % Total number of rotations
upds    = 0; % Number of rotations in a given seep
g	= zeros(2,nbcm);
gg	= zeros(2,2);
G	= zeros(2,2);
c	= 0 ;
s 	= 0 ;
ton	= 0 ;
toff	= 0 ;
theta	= 0 ;
Gain    = 0 ;

%% Joint diagonalization proper
while encore, encore=0;

  Vkeep = V ;

  for p=1:m-1,
    for q=p+1:m,

      Ip = p:m:m*nbcm ;
      Iq = q:m:m*nbcm ;

      %%% computation of Givens angle
      g	    = [ CM(p,Ip)-CM(q,Iq) ; CM(p,Iq)+CM(q,Ip) ];
      gg    = g*g';
      ton   = gg(1,1)-gg(2,2);
      toff  = gg(1,2)+gg(2,1);
      theta = 0.5*atan2( toff , ton+sqrt(ton*ton+toff*toff) );
      Gain  = (sqrt(ton*ton+toff*toff) - ton) / 4 ;

      %%% Givens update
      if abs(theta) > seuil,
%%      if Gain > 1.0e-3*On/m/m ,
	encore  = 1 ;
	c	= cos(theta);
	s	= sin(theta);
	G	= [ c -s ; s c ] ;

	pair 		= [p;q] ;
	V(:,pair) 	= V(:,pair)*G ;
	CM(pair,:)	= G' * CM(pair,:) ;
	CM(:,[Ip Iq]) 	= [ c*CM(:,Ip)+s*CM(:,Iq) -s*CM(:,Ip)+c*CM(:,Iq) ] ;


	On   = On  + Gain;
	Off  = Off - Gain;

      end;%%of the if
    end;%%of the loop on q
  end;%%of the loop on p
end;%%of the while loop

%%% A separating matrix
B	= V'*B ;

%%% Permut the rows of the separating matrix B to get the most energetic components first.
A           = pinv(B) ;
[Ds,keys]   = sort(sum(A.*A)) ;
B           = B(keys,:)       ;
B           = B(m:-1:1,:)     ; % Is this smart ?
% Signs are fixed by forcing the first column of B to have non-negative entries.
b	= B(:,1) ;
signs	= sign(sign(b)+0.1) ; % just a trick to deal with sign=0
B	= diag(signs)*B ;
end`);

// jade.m
// adapted from Cardoso's 2013 version of jade.m
// https://www2.iap.fr/users/cardoso/compsep_classic.html
fn.jade = $fn("jade", `function [A,S] =  jade(X, m)
% Source separation of complex signals with JADE.
% Jade performs 'Source Separation' in the following sense:
%   X is an n x T data matrix assumed modelled as X = A S + N where
%
% o A is an unknown n x m matrix with full rank.
% o S is a m x T data matrix (source signals) with the properties
%    	a) for each t, the components of S(:,t) are statistically
%    	   independent
% 	b) for each p, the S(p,:) is the realization of a zero-mean
% 	   'source signal'.
% 	c) At most one of these processes has a vanishing 4th-order
% 	   cumulant.
% o  N is a n x T matrix. It is a realization of a spatially white
%    Gaussian noise, i.e. Cov(X) = sigma*eye(n) with unknown variance
%    sigma.  This is probably better than no modeling at all...
%
% Jade performs source separation via a
% Joint Approximate Diagonalization of Eigen-matrices.
%
%
% Input :
%   * X: Each column of X is a sample from the n sensors
%   * m: m is an optional argument for the number of sources.
%     If ommited, JADE assumes as many sources as sensors.
%
% Output :
%    * A is an n x m estimate of the mixing matrix
%    * S is an m x T naive (ie pinv(A)*X)  estimate of the source signals
%
% Version 1.6.  Copyright: JF Cardoso.
[n,T]	= size(X);
%%  source detection not implemented yet !
if nargin==1, m=n ; end;
if m>n, error("jade: more sources than sensors are not supported"); end;

% A few parameters that could be adjusted
nem	= m;		% number of eigen-matrices to be diagonalized
seuil	= 1/sqrt(T)/100;% a statistical threshold for stopping joint diag

%% mean removal, ASSUME X is ZERO MEAN
%X	= X - mean(X')' * ones(1,T);

%%% whitening
if m<n, %assumes white noise
 	[U,D] 	= eig((X*X')/T);
	[puiss,k]=sort(diag(D));
 	ibl 	= sqrt(puiss(n-m+1:n)-mean(puiss(1:n-m)));
 	bl 	= ones(m,1) ./ ibl ;
 	W	= diag(bl)*U(1:n,k(n-m+1:n))';
 	IW 	= U(1:n,k(n-m+1:n))*diag(ibl);
else    %assumes no noise
 	IW 	= sqrtm((X*X')/T);
 	W	= inv(IW);
end;
Y	= W*X;

%%% Cumulant estimation
R	= (Y*Y' )/T ;
C	= (Y*Y.')/T ;
Yl	= zeros(1,T);
Ykl	= zeros(1,T);
Yjkl	= zeros(1,T);
Q	= zeros(m*m*m*m,1) ;
index	= 1;
for lx = 1:m ; Yl 	= Y(lx,:);
for kx = 1:m ; Ykl 	= Yl.*conj(Y(kx,:));
for jx = 1:m ; Yjkl	= Ykl.*conj(Y(jx,:));
for ix = 1:m ;
	Q(index) = (Yjkl * Y(ix,:).')/T -  R(ix,jx)*R(lx,kx) -  R(ix,kx)*R(lx,jx) -  C(ix,lx)*conj(C(jx,kx))  ;
	index	= index + 1 ;
end ;
end ;
end ;
end ;

%%%computation and reshaping of the significant eigen matrices
[U,D]	= eig(reshape(Q,m*m,m*m));
[la,K]	= sort(abs(diag(D)));
%% reshaping the most (there are 'nem' of them) significant eigenmatrice
M	= zeros(m,nem*m);	% array to hold the significant eigen-matrices
Z	= zeros(m)	; % buffer
h	= m*m;
for u=1:m:nem*m,
	Z(:) 		= U(:,K(h));
	M(:,u:u+m-1)	= la(h)*Z;
	h		= h-1;
end;
%%% joint approximate diagonalization of the eigen-matrices
%% Better declare the variables used in the loop :
B 	= [ 1 0 0 ; 0 1 1 ; 0 -i i ] ;
Bt	= B' ;
Ip	= zeros(1,nem) ;
Iq	= zeros(1,nem) ;
g	= zeros(3,nem) ;
G	= zeros(2,2) ;
vcp	= zeros(3,3);
D	= zeros(3,3);
la	= zeros(3,1);
K	= zeros(3,3);
angles	= zeros(3,1);
pair	= zeros(1,2);
c	= 0 ;
s	= 0 ;
encore	= 1;
V	= eye(m);

% Main loop
while encore, encore=0;
 for p=1:m-1,
  for q=p+1:m,

 	Ip = p:m:nem*m ;
	Iq = q:m:nem*m ;

	% Computing the Givens angles
 	g	= [ M(p,Ip)-M(q,Iq)  ; M(p,Iq) ; M(q,Ip) ] ;
 	[vcp,D] = eig(real(B*(g*g')*Bt));
	[la, K]	= sort(diag(D));
 	angles	= vcp(:,K(3));
	if angles(1)<0 , angles= -angles ; end ;
 	c	= sqrt(0.5+angles(1)/2);
 	s	= 0.5*(angles(2)-j*angles(3))/c;

 	if abs(s)>seuil, %%% updates matrices M and V by a Givens rotation
	 	encore 		= 1 ;
		pair 		= [p;q] ;
 		G 		= [ c -conj(s) ; s c ] ;
		V(:,pair) 	= V(:,pair)*G ;
	 	M(pair,:)	= G' * M(pair,:) ;
		M(:,[Ip Iq]) 	= [ c*M(:,Ip)+s*M(:,Iq) -conj(s)*M(:,Ip)+c*M(:,Iq) ] ;
 	end;%% if
  end;%% q loop
 end;%% p loop
end;%% while

%%%estimation of the mixing matrix and signal separation
A	= IW*V;
if 1<nargout, S	= V'*Y ; end;
end`);
// stats utils

// correlation functions
function tiedrank(x, symmetric)
{
    var n = x.length,
        ord = x.map(function(xi, i) {return [xi, i];}).sort(function(a, b) {
            return eq(a[0], b[0]) ? a[1] - b[1] : (lt(a[0], b[0]) ? -1 : 1);
        }),
        rank = new Array(n), i, j, k;
    for (i=0; i<n;)
    {
        k = 1;
        j = i;
        while ((j+k < n) && eq(ord[j][0], ord[j+k][0])) ++k;
        while (j < i+k)
        {
            rank[ord[j][1]] = is_nan(ord[j][0]) ? nan : (symmetric ? __((2*i <= n ? i+1 : n-i) + (1 < k ? 1/k : 0)) : __(i+1 + (1 < k ? 1/k : 0)));
            ++j;
        }
        i = j;
    }
    return rank;
}
function pearson(a, b)
{
    // https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
    var n = a.length;
    return 1 < n ? scalar_div(sum(dotmul(dotdiv(sub(a, mean(a)), std(a)), dotdiv(sub(b, mean(b)), std(b)))), n-1) : I;
}
function spearman(a, b)
{
    // https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient
    return pearson(tiedrank(a), tiedrank(b));
}
function kendall(a, b)
{
    // https://en.wikipedia.org/wiki/Kendall_rank_correlation_coefficient
    if (1 < a.length)
    {
        var n = a.length, i, j, sa, sb, tau = O;
        for (i=0; i<n; ++i)
        {
            for (j=i+1; j<n; ++j)
            {
                sa = scalar_sign(scalar_sub(a[i], a[j]));
                sb = scalar_sign(scalar_sub(b[i], b[j]));
                tau = scalar_add(tau, scalar_mul(sa, sb));
            }
        }
        return scalar_div(scalar_div(scalar_mul(tau, two), n), n-1);
    }
    return I;
}
function chi2_contingency(observed)
{
    var sz = !is_array(observed) ? [1] : (is_1d(observed) ? [observed.length] : size(observed)),
        dof = n_add(n_sub(prod(sz), sum(sz)), sz.length-1),
        sums, expected = null, stat, p = null;
    if (n_eq(dof, O))
    {
        stat = O;
        p = I;
    }
    else
    {
        sums = array(sz.length, function(dim) {
            var sumaxes = sum(
                observed,
                array(sz.length-1, function(axis) {
                    return axis < dim ? (axis+1) : (axis+2);
                })
            );
            return ndarray(sz.slice(), function(index) {return sumaxes[index[dim]];});
        });
        expected = dotdiv(sums.slice(1).reduce(function(r, s) {
            return dotmul(r, s);
        }, sums[0]), scalar_pow(sum(observed, "all"), sz.length-1));
        // Pearson's chi-squared statistic
        stat = sum(dotdiv(dotpow(sub(observed, expected), 2), expected), "all");
        p = chi2cdf(stat, dof, 'upper');
    }
    return {
        stat: stat,
        p: p,
        dof: dof,
        expected: expected
    };
}
function cramer_v(a, b, correctbias)
{
    // https://en.wikipedia.org/wiki/Cram%C3%A9r%27s_V
    if (1 < a.length)
    {
        var n = a.length,
            chi2 = chi2_contingency(crosstab([a, b])),
            phi2 = n_div(chi2.stat, n),
            sz = size(chi2.expected),
            k = sz[0], r = sz[1];
        if ('correctbias' === correctbias)
        {
            phi2 = max([O, n_sub(phi2, ((k-1)*(r-1))/(n-1))]);
            k -= stdMath.pow(k-1, 2)/(n-1);
            r -= stdMath.pow(r-1, 2)/(n-1);
        }
        return realMath.sqrt(n_div(phi2, stdMath.min(k-1, r-1)));
    }
    return I;
}

// distributions
function cdf(pdf, min_x, max_x, n)
{
    // compute cdf from pdf between min_x and max_x
    // via numerical approximation of integral of pdf
    n = n || 100;
    var cum = O, eps = n_div(n_sub(max_x, min_x), n), x;
    for (x=min_x;n_le(x, max_x);x=n_add(x, eps))
    {
        cum = n_add(cum, pdf(x));
    }
    return cum;
}
function pdf(cdf, x, eps)
{
    // compute pdf from cdf at x
    // via numerical approximation of derivative of cdf
    eps = __(eps || 1e-12);
    return n_div(n_sub(cdf(n_add(x, eps)), cdf(n_sub(x, eps))), n_mul(constant['2'], eps));
}

var __td1 = 0.000345,
    __td2 = 0.069547,
    __td3 = 1.604326
    //__sqrt_pi = realMath.sqrt(constant.pi)
;
update.push(function() {
__td1 = __(0.000345);
__td2 = __(0.069547);
__td3 = __(1.604326);

//__sqrt_pi = realMath.sqrt(constant.pi);
});

function unifpdf(x, a, b)
{
    // pdf of Uniform distribution
    // https://en.wikipedia.org/wiki/Continuous_uniform_distribution
    if (n_gt(a, b)) return nan;
    return n_lt(x, a) || n_gt(x, b) ? O : n_div(I, n_sub(b, a));
}
function unifcdf(x, a, b, tail)
{
    // cdf of Uniform distribution
    // https://en.wikipedia.org/wiki/Continuous_uniform_distribution
    if (n_gt(a, b)) return nan;
    var p = n_le(x, a) ? O : (n_ge(x, b) ? I : n_div(n_sub(x, a), n_sub(b, a)));
    return 'upper' === tail ? n_sub(I, p) : p;
}
function unifinv(p, a, b)
{
    // icdf of Uniform distribution
    // https://en.wikipedia.org/wiki/Continuous_uniform_distribution
    if (n_gt(a, b)) return nan;
    return n_le(p, O) ? a : (n_ge(p, I) ? b : n_add(a, n_mul(p, n_sub(b, a))));
}

function normpdf(x, mu, sigma)
{
    // pdf of Normal distribution
    // https://en.wikipedia.org/wiki/Normal_distribution
    x = n_div(n_sub(x, mu), sigma); // normalize
    return n_div(realMath.exp(n_neg(n_div(n_mul(x, x), constant['2']))), n_mul(sigma, __sqrt_2pi));
}
function normcdf(x, mu, sigma, tail)
{
    // cdf of Normal distribution, via erf
    // https://en.wikipedia.org/wiki/Normal_distribution
    x = n_div(n_sub(x, mu), sigma); // normalize
    var p = n_mul(constant['1/2'], n_add(I, erf(n_div(x, sqrt2))));
    return 'upper' === tail ? n_sub(I, p) : p;
}
function norminv(p, mu, sigma)
{
    // icdf of Normal distribution
    // https://en.wikipedia.org/wiki/Normal_distribution
    if (n_lt(p, O)) return nan;
    var limit = n_mul(sigma, 100); // 100 x sigma
    return monotone_inverse_newton(
        function(x) {return normcdf(x, mu, sigma);},
        function(x) {return normpdf(x, mu, sigma);},
        p, n_sub(mu, limit), n_add(mu, limit)
    );
}

function chi2pdf(x, nu)
{
    // pdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (n_lt(nu, O)) return nan;
    else if (n_eq(nu, O)) return n_eq(x, O) ? O : nan;
    else if (n_lt(x, O)) return O;
    if (n_eq(constant['2'], nu))
    {
        return n_div(realMath.exp(n_neg(n_div(x, constant['2']))), constant['2']);
    }
    else
    {
        nu = n_div(nu, constant['2']);
        return n_div(n_mul(n_pow(x, n_sub(nu, I)), realMath.exp(n_neg(n_div(x, constant['2'])))), n_mul(n_pow(constant['2'], nu), gamma(nu)));
        /*
        // "A normal approximation for the chi-square distribution", Luisa Canal, 2005
        // accuracy at least within 2-3 decimal places
        return pdf(function(x) {return chi2cdf(x, nu);}, x);
        // Wilson-Hilferty Transformation to approximately a Normal
        // accuracy at least within 1-2 decimal places
        if ((null == chi2pdf.nu) || !n_eq(chi2pdf.nu, nu))
        {
            chi2pdf.nu = nu;
            var sigma2 = n_div(constant['2'], n_mul(nu, 9));
            chi2pdf.mu = n_sub(I, sigma2);
            chi2pdf.sigma = realMath.sqrt(sigma2);
        }
        return pdf(function(x) {return normcdf(n_pow(n_div(x, nu), 1/3), chi2pdf.mu, chi2pdf.sigma);}, x);
        */
    }
}
function chi2cdf(x, nu, tail)
{
    // cdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (n_lt(nu, O) || n_lt(x, O)) return nan;
    else if (n_eq(nu, O)) return n_eq(x, O) ? O : nan;
    var p = O;
    if (n_eq(constant['2'], nu))
    {
        p = n_sub(I, realMath.exp(n_neg(n_div(x, constant['2']))));
    }
    else
    {
        p = gammainc(n_div(x, constant['2']), n_div(nu, constant['2']));
        /*
        // "A normal approximation for the chi-square distribution", Luisa Canal, 2005
        // accuracy at least within 2-3 decimal places
        if ((null == chi2cdf.nu) || !n_eq(chi2cdf.nu, nu))
        {
            chi2cdf.nu = nu;
            var nu2 = n_mul(nu, nu), nu3 = n_mul(nu2, nu);
            chi2cdf.mu = n_add(n_add(5/6, n_div(-1/9, nu)), n_add(n_div(-7/648, nu2), n_div(25/2187, nu3)));
            chi2cdf.sigma = realMath.sqrt(n_add(n_add(n_div(1/18, nu), n_div(1/162, nu2)), n_div(-37/11664, nu3)));
        }
        var xn = n_div(x, nu), L = n_add(n_sub(n_pow(xn, 1/6), n_mul(n_pow(xn, 1/3), 1/2)), n_mul(realMath.sqrt(xn), 1/3));
        p = normcdf(L, chi2cdf.mu, chi2cdf.sigma);
        // Wilson-Hilferty Transformation to approximately a Normal
        // accuracy at least within 1-2 decimal places
        if ((null == chi2cdf.nu) || !n_eq(chi2cdf.nu, nu))
        {
            chi2cdf.nu = nu;
            var sigma2 = n_div(constant['2'], n_mul(nu, 9));
            chi2cdf.mu = n_sub(I, sigma2);
            chi2cdf.sigma = realMath.sqrt(sigma2);
        }
        p = normcdf(n_pow(n_div(x, nu), 1/3), chi2cdf.mu, chi2cdf.sigma);
        */
    }
    return 'upper' === tail ? n_sub(I, p) : p;
}
function chi2inv(p, nu)
{
    // icdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (n_lt(nu, O) || n_lt(p, O)) return nan;
    /*
    // may fail because chi2cdf may return nan or inf if precision is exceeded
    return monotone_inverse_newton(
        function(x) {return chi2cdf(x, nu);},
        function(x) {return chi2pdf(x, nu);},
        p, O, __(1e6), O, I, O, inf
    );
    */
    // Wilson-Hilferty Transformation to approximately a Normal
    // accuracy at least within 1-2 decimal places
    if ((null == chi2inv.nu) || !n_eq(chi2inv.nu, nu))
    {
        chi2inv.nu = nu;
        var sigma2 = n_div(constant['2'], n_mul(nu, 9));
        chi2inv.mu = n_sub(I, sigma2);
        chi2inv.sigma = realMath.sqrt(sigma2);
    }
    return max([O, n_mul(n_pow(norminv(p, chi2inv.mu, chi2inv.sigma), 3), nu)]);
}

function tpdf(x, nu)
{
    // pdf of t distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Student%27s_t-distribution
    if (n_le(nu, O)) return nan;
    var tpdfx = O;
    if (n_eq(nu, I))
    {
        tpdfx = n_div(
            I,
            n_mul(
                constant.pi,
                n_add(I, n_mul(x, x))
            )
        );
    }
    else if (n_eq(nu, constant['2']))
    {
        tpdfx = n_div(
            I,
            n_mul(
                constant['2'],
            n_mul(
                sqrt2,
                n_pow(n_add(I, n_div(n_mul(x, x), constant['2'])), 3/2)
            )
            )
        );
    }
    else if (n_eq(nu, 3))
    {
        tpdfx = n_div(
            constant['2'],
            n_mul(
                constant.pi,
            n_mul(
                realMath.sqrt(3),
                n_pow(n_add(I, n_div(n_mul(x, x), 3)), constant['2'])
            )
            )
        );
    }
    else if (n_eq(nu, 4))
    {
        tpdfx = n_div(
            3,
            n_mul(
                8,
                n_pow(n_add(I, n_div(n_mul(x, x), 4)), 5/2)
            )
        );
    }
    else
    {
        tpdfx = n_mul(
            n_div(
                gamma(n_div(n_add(nu, I), constant['2'])),
                n_mul(realMath.sqrt(n_mul(constant.pi, nu)), gamma(n_div(nu, constant['2'])))
            ),
            n_pow(
                n_add(I, n_div(n_mul(x, x), nu)),
                n_neg(n_div(n_add(nu, I), constant['2']))
            )
        );
        // approximation
        //tpdfx = pdf(function(x) {return tcdf(x, nu);}, x);
    }
    return tpdfx;
}
function tcdf(x, nu, tail)
{
    // cdf of t distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Student%27s_t-distribution
    if (n_le(nu, O)) return nan;
    var p = O, z, z2, z3, z5;
    if (n_eq(nu, I))
    {
        p = n_add(
            constant['1/2'],
            n_div(realMath.atan(x), constant.pi)
        );
    }
    else if (n_eq(nu, constant['2']))
    {
        p = n_add(
            constant['1/2'],
            n_div(
                x,
                realMath.sqrt(n_mul(constant['2'], n_mul(sqrt2, n_add(I, n_div(n_mul(x, x), constant['2'])))))
            )
        );
    }
    else if (n_eq(nu, 3))
    {
        z2 = n_div(n_mul(x, x), 3);
        z = realMath.sqrt(z2);
        p = n_add(
            constant['1/2'],
            n_div(
                n_add(n_div(z, n_add(I, z2)), realMath.atan(z)),
                constant.pi
            )
        );
    }
    else if (n_eq(nu, 4))
    {
        z = n_div(x, constant['2']);
        z2 = n_mul(z, z);
        p = n_add(
            constant['1/2'],
            n_mul(
                n_mul(
                    n_div(z, realMath.sqrt(n_add(I, z2))),
                    n_sub(0.25, n_div(z2, n_mul(n_add(I, z2), 12)))
                ),
                3
            )
        );
    }
    else if (n_gt(nu, 30))
    {
        p = normcdf(x, O, I); // has become almost precisely normal
    }
    else
    {
        // approximation
        // "Approximations to the t Distribution", Bashar Zogheib1 and Ali Elsaheli, 2015
        // http://dx.doi.org/10.12988/ams.2015.52148
        // accuracy at least within 2-3 decimal places
        z = n_div(
            n_mul(x, n_sub(I, n_div(I, n_mul(nu, 4)))), realMath.sqrt(n_add(I, n_div(n_mul(x, x), n_mul(nu, constant['2']))))
        );
        z2 = n_mul(z, z);
        z3 = n_mul(z2, z);
        z5 = n_mul(z3, z2);
        p = n_div(I, n_add(I, realMath.exp(n_sub(n_sub(n_mul(z5, __td1), n_mul(z3, __td2)), n_mul(z, __td3)))));
    }
    return 'upper' === tail ? n_sub(I, p) : p;
}
function tinv(p, nu)
{
    // icdf of t distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Student%27s_t-distribution
    // accuracy at least within 2-3 decimal places
    if (n_le(nu, O) || n_lt(p, O)) return nan;
    var limit = n_gt(nu, constant['2']) ? n_mul(n_div(nu, n_sub(nu, constant['2'])), 100) : __(1e7);
    return monotone_inverse_newton(
        function(x) {return tcdf(x, nu);},
        function(x) {return tpdf(x, nu);},
        p, n_neg(limit), limit
    );
}
// various distributions
// TODO add more and/or improve speed and/or accuracy

// uniform continuous distribution
fn.unifpdf = function(x, a, b) {
    if (null == b) b = I;
    if (null == a) a = O;
    return apply_(unifpdf, [x, a, b], real);
};
fn.unifcdf = function(x, a, b, tail) {
    if (null == b) b = I;
    if (null == a) a = O;
    return apply_(function(x, a, b) {return unifcdf(x, a, b, tail);}, [x, a, b], real);
};
fn.unifinv = function(p, a, b) {
    if (null == b) b = I;
    if (null == a) a = O;
    return apply_(unifinv, [p, a, b], real);
};

// normal distribution
fn.normpdf = function(x, mu, sigma) {
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    return apply_(normpdf, [x, mu, sigma], real);
};
fn.normcdf = varargout(function(nargout, x, mu, sigma, tail) {
    if (1 < nargout) throw "normcdf: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    if (is_string(sigma))
    {
        tail = sigma;
        sigma = I;
    }
    if (is_string(mu))
    {
        tail = mu;
        mu = O;
        sigma = I;
    }
    return apply_(function(x, mu, sigma) {return normcdf(x, mu, sigma, tail);}, [x, mu, sigma], real);
});
fn.norminv = varargout(function(nargout, p, mu, sigma) {
    if (1 < nargout) throw "norminv: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    return apply_(norminv, [p, mu, sigma], real);
});

// chi2 distribution
fn.chi2pdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(chi2pdf, [x, nu], real);
};
fn.chi2cdf = function(x, nu, tail) {
    if (null == nu) nu = I;
    return apply_(function(x, nu) {return chi2cdf(x, nu, tail);}, [x, nu], real);
};
fn.chi2inv = function(p, nu) {
    if (null == nu) nu = I;
    return apply_(chi2inv, [p, nu], real);
};

// t distribution
fn.tpdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(tpdf, [x, nu], real);
};
fn.tcdf = function(x, nu, tail) {
    if (null == nu) nu = I;
    return apply_(function(x, nu) {return tcdf(x, nu, tail);}, [x, nu], real);
};
fn.tinv = function(p, nu) {
    if (null == nu) nu = I;
    return apply_(tinv, [p, nu], real);
};
function mean(x, dim)
{
    return group_apply("block", function(x) {
        return x.length ? scalar_div(sum(x), __(x.length)) : nan;
    }, O, nan, vec(x), vec(dim));
}
fn.mean = mean;
function median(x, dim)
{
    return group_apply("block", function(x) {
        if (!x.length) return nan;
        x = sort(x);
        return x.length & 1 ? x[(x.length >> 1)] : scalar_div(scalar_add(x[(x.length >> 1)], x[(x.length >> 1) - 1]), two);
    }, O, nan, vec(x), vec(dim));
}
fn.median = median;
function mode(x, dim)
{
    return group_apply("block", function(x) {
        if (!x.length) return nan;
        var count = {}, maxcnt = 0;
        return x.reduce(function(mode, xi) {
            var k = xi.toString(), cnt;
            if (HAS.call(count, k))
            {
                count[k] += 1;
                cnt = count[k];
            }
            else
            {
                count[k] = 1;
                cnt = 1;
            }
            if (cnt > maxcnt)
            {
                maxcnt = cnt;
                mode = xi;
            }
            else if ((cnt === maxcnt) && lt(xi, mode))
            {
                mode = xi;
            }
            return mode;
        }, {});
    }, O, nan, vec(x), vec(dim));
}
fn.mode = mode;
function moment(x, order, dim)
{
    if (is_scalar(x))
    {
        return O;
    }
    else if (is_vector(x))
    {
        if (1 >= x.length) return x.length ? O : nan;
        var N = x.length;
        return scalar_div(sum(dotpow(sub(x, mean(x)), order)), __(N));
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            order = __(order);
            return array(COLS(x), function(column) {
                return moment(COL(x, column), order);
            });
        }
        else if (2 === dim)
        {
            order = __(order);
            return array(ROWS(x), function(row) {
                return moment(ROW(x, row), order);
            });
        }
    }
    not_supported("moment");
}
fn.moment = moment;
function std(x, w, dim)
{
    w = _(w || 0);
    return group_apply("block", function(x) {
        return 0 === x.length ? nan : (1 === x.length ? O : realMath.sqrt(scalar_div(sum(dotpow(abs(sub(x, mean(x))), __(2))), __(1 === w ? x.length : (x.length-1)))));
    }, O, nan, vec(x), vec(dim));
}
fn.std = std;
function variance(x, w, dim)
{
    w = _(w || 0);
    return group_apply("block", function(x) {
        if (1 >= x.length) return x.length ? O : nan;
        var N = x.length,
            mu_x = mean(x),
            bar_x = sub(x, mu_x);
        return scalar_div(sum(dotmul(conj(bar_x), bar_x)), __(1 === w ? N : (N-1)));
    }, O, nan, vec(x), vec(dim));
}
fn['var'] = variance;
function cov(a, b, w)
{
    w = _(w || 0);
    if ((2 === arguments.length) && (0 === _(b) || 1 === _(b)))
    {
        w = _(b);
        b = null;
    }
    if (null == b)
    {
        if (is_scalar(a))
        {
            return O;
        }
        else if (is_vector(a))
        {
            if (1 >= a.length) return a.length ? O : nan;
            var N = a.length,
                mu_a = mean(a),
                bar_a = sub(a, mu_a);
            return scalar_div(sum(dotmul(conj(bar_a), bar_a)), __(1 === w ? N : (N-1)));
        }
        else if (is_matrix(a))
        {
            return matrix(COLS(a), COLS(a), function(column1, column2, m) {
                return column1 === column2 ? cov(COL(a, column1), w) : (column1 > column2 ? m[column2][column1] : cov(COL(a, column1), COL(a, column2), w));
            });
        }
    }
    else
    {
        if (is_scalar(a) && is_scalar(b))
        {
            return zeros(2, 2);
        }
        if (is_matrix(a) && is_matrix(b))
        {
            a = colon(a);
            b = colon(b);
        }
        if (is_vector(a) && is_vector(b))
        {
            if (a.length !== b.length) throw "cov: inputs not of same dimension";
            if (1 >= a.length) return a.length ? O : nan;
            var N = a.length;
            return scalar_div(sum(dotmul(conj(sub(a, mean(a))), sub(b, mean(b)))), __(1 === w ? N : (N-1)));
        }
    }
    not_supported("cov");
}
fn.cov = cov;
function corrcoef(a, b)
{
    if (null == b)
    {
        if (is_scalar(a) || is_vector(a))
        {
            return I;
        }
        else if (is_matrix(a))
        {
            return matrix(COLS(a), COLS(a), function(column1, column2, m) {
                return column1 === column2 ? I : (column1 > column2 ? m[column2][column1] : corrcoef(COL(a, column1), COL(a, column2)));
            });
        }
    }
    else
    {
        if (is_scalar(a) && is_scalar(b))
        {
            return I;
        }
        a = vec(a); b = vec(b);
        if (is_vector(a) && is_vector(b))
        {
            if (a.length !== b.length) throw "corrcoef: inputs not of same dimension";
            return pearson(a, b);
        }
        else if (is_2d(a) && is_2d(b))
        {
            if (!arr_eq(size(a), size(b))) throw "corrcoef: inputs not of same dimension";
            /*return array(COLS(a), function(column) {
                return corrcoef(COL(a, column), COL(b, column));
            });*/
            return corrcoef([colon(a), colon(b)]);
        }
    }
    not_supported("corrcoef");
}
fn.corrcoef = corrcoef;
fn.corr = varargout(namevalueargs(function(nargout, X) {
    if (1 < nargout) throw "corr: only one output is supported";
    if (is_scalar(X)) X = [[X]];
    if (!is_matrix(X)) not_supported("corr");
    var nv = arguments[arguments.length-1]._,
        Y = (2 < arguments.length) && is_array(arguments[2]) ? arguments[2] : X,
        corrfunc = pearson, promises = [], ans;
    if (!is_matrix(Y) || (ROWS(X) !== ROWS(Y))) not_supported("corr");
    if (is_callable(nv.Type))
    {
        corrfunc = nv.Type;
    }
    else
    {
        switch (nv.Type)
        {
            case "CramerV":
            corrfunc = _(nv.CorrectBias) ? function(a, b) {return cramer_v(a, b, 'correctbias');} : function(a, b) {return cramer_v(a, b);};
            break;
            case "Spearman":
            corrfunc = spearman;
            break;
            case "Kendall":
            corrfunc = kendall;
            break;
            case "Pearson":
            default:
            corrfunc = pearson;
            break;
        }
    }
    ans = matrix(COLS(X), COLS(Y), function(i, j) {
        var c = corrfunc(COL(X, i), COL(Y, j));
        if (is_instance(c, Promise)) promises.push(c);
    });
    return promises.length ? Promise.all(promises).then(function() {return ans;}) : ans;
}, {
    Type: "Pearson",
    CorrectBias: 0
}));fn.tiedrank = varargout(function(nargout, x, a, b) {
    if (1 < nargout) throw "tiedrank: only one output is supported";
    if (is_scalar(x)) x = [x];
    x = vec(x);
    var symmetric = eq(O, a) && eq(I, b);
    if (is_matrix(x))
    {
        return transpose(array(COLS(x), function(col) {
            return tiedrank(COL(x, col), symmetric);
        }));
    }
    else
    {
        return tiedrank(x, symmetric);
    }
});fn.pdist = function(X) {
    var dist = d_euclidean, m, p;
    if (is_vector(X)) X = vec2col(X);
    if (!is_matrix(X)) not_supported("pdist");
    if (1 < arguments.length)
    {
        if (is_callable(arguments[1]))
        {
            dist = arguments[1];
        }
        else
        {
            switch (arguments[1])
            {
                case "fasteuclidean":
                case "euclidean":
                dist = d_euclidean;
                break;
                case "fastsquaredeuclidean":
                case "squaredeuclidean":
                dist = d_sqeuclidean;
                break;
                case "fastseuclidean":
                case "seuclidean":
                p = is_array(arguments[2]) ? vec(arguments[2]) : std(X);
                dist = function(a, b, i, j) {return d_seuclidean(a, b, p[i]);};
                break;
                case "mahalanobis":
                p = is_array(arguments[2]) ? arguments[2] : cov(ctranspose(X));
                p = inv(p);
                m = mean(ctranspose(X));
                dist = function(a, b, i, j) {return realMath.sqrt(d_mahalanobis(b, m, p));};
                break;
                case "cityblock":
                dist = d_cityblock;
                break;
                case "minkowski":
                p = is_scalar(arguments[2]) ? arguments[2] : two;
                dist = function(a, b, i, j) {return d_minkowski(a, b, p);};
                break;
                case "chebychev":
                dist = d_chebychev;
                break;
                case "cosine":
                dist = d_cosine;
                break;
                case "correlation":
                dist = d_correlation;
                break;
                case "hamming":
                dist = d_hamming;
                break;
                case "jaccard":
                dist = d_jaccard;
                break;
            }
        }
    }
    var ans = [], n = COLS(X), i, j, d, is_promise = false;
    for (i=0; i<n; ++i)
    {
        for (j=i+1; j<n; ++j)
        {
            d = dist(COL(X, j), COL(X, i), j, i);
            is_promise = is_promise || is_instance(d, Promise);
            ans.push(d);
        }
    }
    return is_promise ? Promise.all(ans) : ans;
};
fn.pdist2 = function(X, Y) {
    var dist = d_euclidean, m, p;
    if (is_vector(X)) X = vec2col(X);
    if (is_vector(Y)) Y = vec2col(Y);
    if (!is_matrix(X) || !is_matrix(Y) || (ROWS(X) !== ROWS(Y))) not_supported("pdist2");
    if (2 < arguments.length)
    {
        if (is_callable(arguments[2]))
        {
            dist = arguments[2];
        }
        else
        {
            switch (arguments[2])
            {
                case "fasteuclidean":
                case "euclidean":
                dist = d_euclidean;
                break;
                case "fastsquaredeuclidean":
                case "squaredeuclidean":
                dist = d_sqeuclidean;
                break;
                case "fastseuclidean":
                case "seuclidean":
                p = is_array(arguments[3]) ? vec(arguments[3]) : std(X);
                dist = function(a, b, i, j) {return d_seuclidean(a, b, p[i]);};
                break;
                case "mahalanobis":
                p = is_array(arguments[3]) ? arguments[3] : cov(ctranspose(X));
                p = inv(p);
                m = mean(ctranspose(X));
                dist = function(a, b, i, j) {return realMath.sqrt(d_mahalanobis(b, m, p));};
                break;
                case "cityblock":
                dist = d_cityblock;
                break;
                case "minkowski":
                p = is_scalar(arguments[3]) ? arguments[3] : two;
                dist = function(a, b, i, j) {return d_minkowski(a, b, p);};
                break;
                case "chebychev":
                dist = d_chebychev;
                break;
                case "cosine":
                dist = d_cosine;
                break;
                case "correlation":
                dist = d_correlation;
                break;
                case "hamming":
                dist = d_hamming;
                break;
                case "jaccard":
                dist = d_jaccard;
                break;
            }
        }
    }
    var promises = [],
        ans = matrix(COLS(X), COLS(Y), function(i, j) {
            var d = dist(COL(X, i), COL(Y, j), i, j);
            if (is_instance(d, Promise)) promises.push(d);
            return d;
        })
    ;
    return promises.length ? Promise.all(promises).then(function() {return ans;}) : ans;
};
fn.mahal = function(Y, X) {
    if (is_vector(X)) X = vec2col(X);
    if (is_vector(Y)) Y = vec2col(Y);
    if (!is_matrix(X) || !is_matrix(Y) || (ROWS(X) !== ROWS(Y))) not_supported("mahal");
    var Xt = ctranspose(X), invCov = inv(cov(Xt)), mu = mean(Xt);
    return matrix(COLS(Y), COLS(X), function(i, j, mat) {
        return i <= j ? d_mahalanobis(COL(Y, i), mu, invCov) : mat[j][i];
    });
};
fn.squareform = function(d, output) {
    var ans, n, m, i, j, k;
    d = vec(d);
    if (is_vector(d) || ('tomatrix' === output))
    {
        if (is_scalar(d)) d = [d];
        else if (is_matrix(d)) return d;
        n = d.length;
        m = stdMath.round(((stdMath.sqrt(1 + 8*n)) + 1)/2);
        ans = matrix(m, m, O);
        for (k=0,i=0; i<m; ++i)
        {
            for (j=i+1; j<m; ++j)
            {
                ans[j][i] = d[k++];
                ans[i][j] = ans[j][i];
            }
        }
    }
    else if (is_matrix(d) || ('tovector' === output))
    {
        if (is_scalar(d)) d = [[O, d], [d, O]];
        else if (is_vector(d)) return d;
        n = ROWS(d);
        ans = [];
        for (i=0; i<n; ++i)
        {
            for (j=i+1; j<n; ++j)
            {
                ans.push(d[j][i]);
            }
        }
    }
    return ans;
};function crosstab(args, nargout)
{
    nargout = nargout || 1;
    args = args.map(function(arg) {return is_array(arg) ? colon(arg) : [arg];});
    if (args.length !== args.filter(function(arg) {return args[0].length === arg.length;}).length) throw "crosstab: inputs not of same length";
    var labels = cellarray(array(args.length, function(i) {
            return sort(args[i].reduce(function(_, v) {
                var k = String(v);
                if (!HAS.call(_.h, k))
                {
                    _.h[k] = 1;
                    _.v.push(v);
                }
                return _;
            }, {h:{},v:[]}).v);
        }), [args.length]),
        arg0 = args[0],
        tab = ndarray(labels.map(function(values) {return values.length;}), function(i) {
            return arg0.reduce(function(s, _, j) {
                for (var found=0,k=0,n=i.length; k<n; ++k)
                {
                    if (String(labels[k][i[k]]) !== String(args[k][j])) break;
                    ++found;
                }
                if (n === found) ++s;
                return s;
            }, 0);
        }),
        chi2 = 1 < nargout ? chi2_contingency(tab) : {stat:null, p:null}
    ;
    return 1 < nargout ? [tab, chi2.stat, chi2.p, labels] : tab;
}
fn.crosstab = varargout(function(nargout /*..args*/) {
    return crosstab([].slice.call(arguments, 1), nargout);
});
fn.chi2contingency = varargout(function(nargout, table) {
    var chi2 = chi2_contingency(table);
    return 1 < nargout ? [chi2.stat, chi2.p, chi2.dof, chi2.expected] : chi2.stat;
});function kmeans(X, k, D, init, max_iter, run_async, speedup)
{
    // https://en.wikipedia.org/wiki/K-means_clustering
    // Lloyd's algorithm with triangle speedup heuristic
    var n = X.length, idx = array(n, -1), C, centroids_changed = 0, iter;
    if (run_async)
    {
        return (async function() {
            await closest_clusters(idx, null, X, is_matrix(init) ? init : await init(X, k, D, run_async), D, run_async);

            for (iter=1; iter<=max_iter; ++iter)
            {
                // calculate centroids
                C = compute_centroids(idx, X, k);
                // assign each point to the nearest centroid
                centroids_changed = await closest_clusters(idx, null, X, C, D, run_async);
                if (!centroids_changed) break; // converged
            }
            if (centroids_changed) fn.warning('kmeans failed to converge in '+max_iter+' iteration(s).');
            return [idx, C];
        })();
    }
    else
    {
        closest_clusters(idx, null, X, is_matrix(init) ? init : init(X, k, D), D);

        for (iter=1; iter<=max_iter; ++iter)
        {
            // calculate centroids
            C = compute_centroids(idx, X, k);
            // assign each point to the nearest centroid
            centroids_changed = closest_clusters(idx, null, X, C, D);
            if (!centroids_changed) break; // converged
        }
        if (centroids_changed) fn.warning('kmeans failed to converge in '+max_iter+' iteration(s).');
        return [idx, C];
    }
}
function closest_clusters(idx, min, X, C, D, run_async)
{
    var n = X.length, k = C.length, i, j, x, d, cj, minj, nchanged = 0;
    if (run_async)
    {
        return (async function() {
        for (j=0; j<n; ++j)
        {
            x = X[j];
            cj = 0;
            minj = inf;
            for (i=0; i<k; ++i)
            {
                if (!C[i] || !C[i].length) continue;
                d = await D(x, C[i]);
                if (n_lt(d, minj))
                {
                    minj = d;
                    cj = i;
                }
            }
            if (idx)
            {
                if (cj !== idx[j]) ++nchanged;
                idx[j] = cj;
            }
            if (min)
            {
                min[j] = minj;
            }
        }
        return nchanged;
        })();
    }
    else
    {
        for (j=0; j<n; ++j)
        {
            x = X[j];
            cj = 0;
            minj = inf;
            for (i=0; i<k; ++i)
            {
                if (!C[i] || !C[i].length) continue;
                d = D(x, C[i]);
                if (n_lt(d, minj))
                {
                    minj = d;
                    cj = i;
                }
            }
            if (idx)
            {
                if (cj !== idx[j]) ++nchanged;
                idx[j] = cj;
            }
            if (min)
            {
                min[j] = minj;
            }
        }
        return nchanged;
    }
}
function compute_centroid(cluster)
{
    return cluster.length ? mean(cluster) : cluster;
}
function compute_centroids(idx, X, k)
{
    return array(k, function(cluster_index) {
        return compute_centroid(idx.reduce(function(cluster, index, i) {
            if (index === cluster_index) cluster.push(X[i]);
            return cluster;
        }, []));
    });
}
function kmeans_init_forgy(X, k, D, run_async)
{
    X = X.slice();
    return array(k, function(cluster) {
        var i = X.length ? stdMath.round(stdMath.random()*(X.length-1)) : -1;
        return -1 < i ? X.splice(i, 1)[0] : [];
    });
}
function kmeans_init_random_partition(X, k, D, run_async)
{
    var n = X.length;
    return shuffle(X.slice()).reduce(function(clusters, xi) {
        if (!clusters.length) clusters.push([xi]);
        else if (clusters[clusters.length-1].length+1 > n/k) clusters.push([xi]);
        else clusters[clusters.length-1].push(xi);
        return clusters;
    }, []).map(compute_centroid);
}
function kmeans_init_plusplus(X, k, D, run_async)
{
    // https://en.wikipedia.org/wiki/K-means%2B%2B
    // Initialize list of centroids with one randomly selected point
    var n = X.length,
        centroids = [X[stdMath.round(stdMath.random()*(n-1))]],
        D2 = new Array(n), d = new Array(n), i, total, thresh, cum;

    if (run_async)
    {
        return (async function() {
        // Choose remaining k - 1 centroids
        while (centroids.length < k)
        {
            await closest_clusters(null, d, X, centroids, D, run_async);
            // For each point, compute squared distance to nearest selected centroid
            total = O;
            for (i=0; i<n; ++i)
            {
                D2[i] = scalar_abs(scalar_mul(d[i], scalar_conj(d[i])));
                total = n_add(total, D2[i]);
            }

            // Choose next centroid with probability proportional to D(x)^2
            thresh = n_mul(total, stdMath.random());
            cum = O;
            for (i=0; i<n; ++i)
            {
                cum = n_add(cum, D2[i]);
                if (n_ge(cum, thresh))
                {
                    centroids.push(X[i]);
                    break;
                }
            }
        }
        return centroids;
        })();
    }
    else
    {
        // Choose remaining k - 1 centroids
        while (centroids.length < k)
        {
            closest_clusters(null, d, X, centroids, D);
            // For each point, compute squared distance to nearest selected centroid
            total = O;
            for (i=0; i<n; ++i)
            {
                D2[i] = scalar_abs(scalar_mul(d[i], scalar_conj(d[i])));
                total = n_add(total, D2[i]);
            }

            // Choose next centroid with probability proportional to D(x)^2
            thresh = n_mul(total, stdMath.random());
            cum = O;
            for (i=0; i<n; ++i)
            {
                cum = n_add(cum, D2[i]);
                if (n_ge(cum, thresh))
                {
                    centroids.push(X[i]);
                    break;
                }
            }
        }
        return centroids;
    }
}
fn.kmeans = varargout(namevalueargs(function(nargout, X, k) {
    var nv = arguments[arguments.length-1]._,
        dist, init, max_iter, speedup = false,
        run_async = false, i, j, n, m, idx, C, ans;
    if (!is_matrix(X)) not_supported("kmeans");
    if (is_matrix(nv.Start))
    {
        init = nv.Start;
        if (COLS(init) !== COLS(X)) throw "kmeans: centroids and input must have same number of columns";
        k = ROWS(init);
    }
    else
    {
        switch (nv.Start)
        {
            /*case "cluster":
            // not used
            break;*/
            case "uniform":
            init = kmeans_init_random_partition;
            break;
            case "sample":
            init = kmeans_init_forgy;
            break;
            case "plus":
            default:
            init = kmeans_init_plusplus;
            break;
        }
    }
    if (is_callable(nv.Distance))
    {
        dist = nv.Distance;
        run_async = is_instance(dist(X[0], array(X[0].length, O)), Promise);
    }
    else
    {
        switch (nv.Distance)
        {
            case "hamming":
            dist = d_hamming;
            break;
            case "correlation":
            dist = d_correlation;
            break;
            case "cosine":
            dist = d_cosine;
            break;
            case "cityblock":
            dist = d_cityblock;
            break;
            case "euclidean":
            dist = d_euclidean;
            break;
            case "sqeuclidean":
            default:
            dist = d_sqeuclidean;
            break;
        }
    }
    max_iter = stdMath.ceil(stdMath.abs(_(sca(nv.MaxIter, true))));

    if (run_async)
    {
        return (async function() {
        ans = await kmeans(X, k, dist, init, max_iter, run_async);
        idx = ans[0]; C = ans[1];
        ans[0] = ans[0].map(function(idx) {return idx+1;});
        if (1 === nargout)
        {
            ans = ans[0];
        }
        else if (2 < nargout)
        {
            // sumd
            n = idx.length;
            m = array(k, O);
            ans.push(m);
            for (j=0; j<k; ++j)
            {
                for (i=0; i<n; ++i)
                {
                    if (idx[i] === j)
                    {
                        m[j] = scalar_add(m[j], await dist(X[i], C[j]));
                    }
                }
            }
            if (3 < nargout)
            {
                // D
                n = ROWS(X);
                m = matrix(n, k, O);
                ans.push(m);
                for (i=0; i<n; ++i)
                {
                    for (j=0; j<k; ++j)
                    {
                        m[i][j] = await dist(X[i], C[j]);
                    }
                }
            }
        }
        return ans;
        })();
    }
    else
    {
        ans = kmeans(X, k, dist, init, max_iter);
        idx = ans[0]; C = ans[1];
        ans[0] = ans[0].map(function(idx) {return idx+1;});
        if (1 === nargout)
        {
            ans = ans[0];
        }
        else if (2 < nargout)
        {
            // sumd
            n = idx.length;
            m = array(k, O);
            ans.push(m);
            for (j=0; j<k; ++j)
            {
                for (i=0; i<n; ++i)
                {
                    if (idx[i] === j)
                    {
                        m[j] = scalar_add(m[j], dist(X[i], C[j]));
                    }
                }
            }
            if (3 < nargout)
            {
                // D
                n = ROWS(X);
                m = matrix(n, k, O);
                ans.push(m);
                for (i=0; i<n; ++i)
                {
                    for (j=0; j<k; ++j)
                    {
                        m[i][j] = dist(X[i], C[j]);
                    }
                }
            }
        }
        return ans;
    }
}, {
   Start: "plus",
   Distance: "sqeuclidean",
   MaxIter: 100
}));function pwcdanneal(D, k, alpha, max_iter)
{
    /*
    "Pairwise Data Clustering by Deterministic Annealing",
    Thomas Hofmann, Joachim M. Buhmann,
    IEEE Transactions on Pattern Analysis and Machine Intelligence, 1997
    */
    // D is the square distance or dissimilarity matrix
    // M is the assignment matrix which consists of the
    // a posteriori probabilities of a component zi for a given class ck

    if (null == max_iter) max_iter = 100;
    if (null == alpha) alpha = 0.75;

    var n = ROWS(D), M, prevE, E,
        T, Tstart, Tfinal, i, j, v,
        tmp, iter, delta, eps = 1e-6,
        m, e, f, summa, sum, DM;

    // at the worst case the components cannot be grouped
    //max_classes=n;

    // how to choose initial temperature? [corresponds to initial energy==>max eigenvalue]
    Tstart = _(realMath.sqrt(n_mul(norm(D, I), norm(D, inf)))); // max eig estimate

    if (!Tstart)
    {
        // trivial
        return array(n, 1);
    }

    // initialize in (0,1) uniformly
    M = matrix(n, k, function() {return stdMath.random();});
    // normalize each row to sum to unity
    for (i=0; i<n; ++i)
    {
        for (summa=0,v=0; v<k; ++v) summa += M[i][v];
        for (v=0; v<k; ++v) M[i][v] /= summa;
    }
    E = matrix(n, k, function() {return stdMath.random();});
    prevE = matrix(n, k, 0);

    D = tonumber(D);
    DM = matrix(n, k, 0);
    sum = array(k, 0);
    Tfinal = Tstart/1000;
    T = Tstart;
    while ((alpha < 1) && (T > 0) && (T > Tfinal))
    {
        for (iter=1; iter<=max_iter; ++iter)
        {
            tmp = prevE;
            prevE = E;
            E = tmp;
            for (i=0; i<n; ++i)
            {
                m = M[i];
                e = prevE[i];
                for (summa=0,v=0; v<k; ++v)
                {
                    summa += stdMath.exp(-e[v] / T);
                }
                for (v=0; v<k; ++v)
                {
                    // E-lke step: estimate M(t+1) from E(t) eq.(25)
                    m[v] = stdMath.exp(-e[v] / T) / summa;
                }
            }

            for (v=0; v<k; ++v)
            {
                for (summa=0,j=0; j<n; ++j) summa += M[j][v];
                sum[v] = summa;
            }
            for (i=0; i<n; ++i)
            {
                m = DM[i];
                for (v=0; v<k; ++v)
                {
                    for (summa=0,j=0; j<n; ++j) summa += D[i][j]*M[j][v];
                    m[v] = summa;
                }
            }

            delta = 0;

            for (i=0; i<n; ++i)
            {
                m = M[i];
                e = E[i];
                for (v=0; v<k; ++v)
                {
                    f = sum[v] - m[v];
                    for (summa=0,j=0; j<n; ++j)
                    {
                        summa += M[j][v] * (D[i][j] - DM[j][v]/(2*f));
                    }
                    // M-like step: calculate new E(t+1) from M(t+1) eq.(26)
                    e[v] = summa / (f + 1);

                    delta = stdMath.max(delta, stdMath.abs(e[v] - prevE[i][v]));
                }
            }

            if (delta <= eps) break; // converged
        }
        T = alpha*T;   // decrease temperature exponentially
    }
    return array(n, function(i) {
        for (var Mi=M[i],cluster=0,c=1; c<k; ++c)
        {
            if (Mi[c] > Mi[cluster]) cluster = c;
        }
        return cluster+1;
    });
}
fn.pwcdanneal = namevalueargs(function(D, k) {
    k = stdMath.round(_(sca(k, true)));
    if ((0 >= k) || !is_matrix(D) || (ROWS(D) !== COLS(D))) not_supported("pwcdanneal");
    var nv = arguments[arguments.length-1]._,
        alpha = stdMath.abs(_(sca(nv.Alpha, true))),
        max_iter = stdMath.ceil(stdMath.abs(_(sca(nv.MaxIter, true))));
    return pwcdanneal(D, k, alpha, max_iter);
}, {
    Alpha: 0.75,
    MaxIter: 100
});function pwcaffinity(s, damping, max_iter)
{
    /*
    "Clustering by passing messages between data points",
    B. J. Frey, D. Dueck,
    Science, 2007
    https://en.wikipedia.org/wiki/Affinity_propagation
    */
    // s is the similarity matrix

    if (null == max_iter) max_iter = 100;
    if (null == damping) damping = 0.5;

    var n = ROWS(s), r, a,
        e, e_prev,
        tmp, tmp1, tmp2,
        iter, notchanged,
        i, j, k, t, K;

    s = tonumber(s);
    // prevent degeneracies, add tiny random differences
    for (i=0; i<n; ++i)
    {
        tmp1 = s[i];
        for (j=0; j<n; ++j)
        {
            tmp1[j] += (Number.EPSILON * tmp1[j] + realmin * 100) * normal();
        }
    }

    // r(i, k) = 0, a(k, i) = 0 for all i, k
    r = matrix(n, n, 0);
    a = matrix(n, n, 0);
    tmp = matrix(n, n, 0);
    e = array(n, 0);
    e_prev = array(n, 0);
    notchanged = 0;

    for (iter=1; iter<=max_iter; ++iter)
    {
        // r(i, k) ← s(i, k) − max_{j:j=/=k}(a(j, i) + s(i, j))
        for (i=0; i<n; ++i)
        {
            tmp1 = tmp[i]; tmp2 = s[i];
            for (k=0; k<n; ++k)
            {
                t = -inf;
                for (j=0; j<n; ++j)
                {
                    if (j === k) continue;
                    t = stdMath.max(t, a[j][i] + tmp2[j]);
                }
                tmp1[k] = tmp2[k] - t;
            }
        }
        // damping
        for (i=0; i<n; ++i)
        {
            tmp1 = r[i]; tmp2 = tmp[i];
            for (k=0; k<n; ++k)
            {
                tmp1[k] = 1 === iter ? tmp2[k] : ((damping) * tmp1[k] + (1 - damping) * tmp2[k]);
            }
        }

        // a(k, k) ← sum_{j:j=/=k}max(0, r(j, k))
        for (k=0; k<n; ++k)
        {
            t = 0;
            for (j=0; j<n; ++j)
            {
                if (j === k) continue;
                t += stdMath.max(0, r[j][k]);
            }
            a[k][k] = t;
        }
        // a(k, i) ← min(0, r(k, k) + sum_{j:j not in {k,i}}max(0, r(j, k)))
        for (k=0; k<n; ++k)
        {
            tmp1 = tmp[k];
            for (i=0; i<n; ++i)
            {
                if (i === k) continue;
                t = r[k][k];
                for (j=0; j<n; ++j)
                {
                    if (j === k || j === i) continue;
                    t += stdMath.max(0, r[j][k]);
                }
                tmp1[i] = stdMath.min(0, t);
            }
        }
        // damping
        for (k=0; k<n; ++k)
        {
            tmp1 = a[k]; tmp2 = tmp[k];
            for (i=0; i<n; ++i)
            {
                tmp1[i] = 1 === iter ? tmp2[i] : ((damping) * tmp1[i] - (1 - damping) * tmp2[i]);
            }
        }

        // exemplars
        tmp1 = e_prev;
        e_prev = e;
        e = tmp1;
        for (k=0; k<n; ++k)
        {
            e[k] = a[k][k] + r[k][k] > 0 ? 1 : 0;
            if (e[k] !== e_prev[k]) notchanged = 0;
        }
        ++notchanged;
        if (notchanged >= 10) break; // exemplars not changed for 10 iters, converged
    }
    e = e.reduce(function(e, ei, i) {
        if (ei > 0) e.push(i);
        return e;
    }, []);
    K = e.length;
    return array(n, function(i) {
        var max = -inf, score = 0, cluster = 0, k, j;
        for (k=0; k<K; ++k)
        {
            j = e[k];
            if (j === i)
            {
                cluster = k;
                break;
            }
            score = /*s[i][j]*/r[i][j] + a[j][i];
            if (score > max)
            {
                max = score;
                cluster = k;
            }
        }
        return cluster + 1;
    });
}
fn.pwcaffinity = namevalueargs(function(S) {
    if (!is_matrix(S) || (ROWS(S) !== COLS(S))) not_supported("pwcaffinity");
    var nv = arguments[arguments.length-1]._,
        damping = stdMath.abs(_(sca(nv.Damping, true))),
        max_iter = stdMath.ceil(stdMath.abs(_(sca(nv.MaxIter, true))));
    return pwcaffinity(S, damping, max_iter);
}, {
    Damping: 0.5,
    MaxIter: 100
});function confusionmat(actual, predicted, order, nargout)
{
    if (!is_array(actual) || !is_array(predicted)) not_supported("confusionmat");
    nargout = nargout || 1;
    actual = colon(actual);
    predicted = colon(predicted);
    order = order || sort(
        actual.concat(predicted)
        .filter(function(v) {
            return (null != v) && (is_string(v) || (is_num(v) && !is_nan(v)));
        })
        .reduce(function(_, v) {
            var k = String(v);
            if (!HAS.call(_.h, k))
            {
                _.h[k] = 1;
                _.v.push(v);
            }
            return _;
        }, {h:{},v:[]})
        .v
    );
    var o = order.map(function(v) {return String(v);}),
        ga = actual.map(function(v) {return String(v);}),
        gp = predicted.map(function(v) {return String(v);}),
        mat = matrix(order.length, order.length, function(i, j) {
            return ga.reduce(function(s, v, iv) {
                if (v === o[i])
                {
                    var vp = predicted[iv];
                    if ((null != vp) && (is_string(vp) || !is_nan(vp)) && (o[j] === gp[iv])) ++s;
                }
                return s;
            }, 0);
        })
    ;
    return 1 < nargout ? [mat, order] : mat;
}
fn.confusionmat = varargout(namevalueargs(function(nargout, actual, predicted) {
    var nv = arguments[arguments.length-1]._;
    return confusionmat(actual, predicted, vec(nv.Order), nargout);
}, {
    Order: null
}));// window functions
fn.rectwin = function(L) {
    L = stdMath.round(_(sca(L, true)));
    return vec2col(array(L, function(n) {return I;}));
};
fn.triang = function(L) {
    L = stdMath.round(_(sca(L, true)));
    return vec2col((L & 1) ? array(L, function(n) {
        return __(n+1 <= (L+1)/2 ? (2*(n+1)/(L+1)) : (2 - 2*(n+1)/(L+1)));
    }) : array(L, function(n) {
        return __(n+1 <= L/2 ? ((2*(n+1)-1)/L) : (2 - (2*(n+1)-1)/L));
    }));
};
fn.gausswin = function(L, alpha) {
    L = stdMath.round(_(sca(L, true)));
    if (null == alpha) alpha = 2.5;
    alpha = _(sca(alpha, true));
    var sigma2 = (L-1)/(2*a);
    sigma2 = 2*sigma2*sigma2;
    return vec2col(array(L, function(n) {
        n -= (L-1)/2;
        return __(stdMath.exp(-(n*n)/sigma2));
    }));
};
fn.hamming = function(L, sflag) {
    L = stdMath.round(_(sca(L, true)));
    var N = sflag === "periodic" ? L : (L - 1);
    return vec2col(array(L, function(n) {
        return __(0.54 - 0.46*stdMath.cos(2*pi*n/N));
    }));
};
fn.hann = function(L, sflag) {
    L = stdMath.round(_(sca(L, true)));
    var N = sflag === "periodic" ? L : (L - 1);
    return vec2col(array(L, function(n) {
        return __(0.5*(1 - stdMath.cos(2*pi*n/N)));
    }));
};
fn.bartlett = function(L) {
    L = stdMath.round(_(sca(L, true)));
    if (1 === L) return I;
    var N = L - 1;
    return vec2col(array(L, function(n) {
        return __(n <= N/2 ? (2*n/N) : (2 - 2*n/N));
    }));
};
fn.barthannwin = function(L) {
    L = stdMath.round(_(sca(L, true)));
    if (1 === L) return I;
    var N = L - 1;
    return vec2col(array(L, function(n) {
        return __(0.62 - 0.48*stdMath.abs(n/N - 0.5) + 0.38*stdMath.cos(2*pi*(n/N-0.5)));
    }));
};
fn.blackman = function(L, sflag) {
    L = stdMath.round(_(sca(L, true)));
    var N = "periodic" === sflag ? L : (L - 1), M = N & 1 ? (N+1)/2 : (N/2);
    return vec2col(array(L, function(n, arr) {
        return n <= M-1 ? __(0.42-0.5*stdMath.cos(2*pi*n/(L-1))+0.08*stdMath.cos(4*pi*n/(L-1))) : arr[L-1-n];
    }));
};
fn.blackmanharris = function(L, sflag) {
    L = stdMath.round(_(sca(L, true)));
    var a0 = 0.35875, a1 = 0.48829, a2 = 0.14128, a3 = 0.01168,
        N = "periodic" === sflag ? L : (L - 1);
    return vec2col(array(L, function(n) {
        return __(a0 - a1*stdMath.cos(2*pi*n/N) + a2*stdMath.cos(4*pi*n/N) - a3*stdMath.cos(6*pi*n/N));
    }));
};function conv(a, b)
{
    // adapted from https://github.com/foo123/FILTER.js
    var i, j, ij, t,
        n = a.length,
        m = b.length,
        nm = n + m - 1, c;
    if (!n || !m) return [];
    c = new Array(nm);
    if (n < m)
    {
        t = a;
        a = b;
        b = t;
        n = a.length;
        m = b.length;
    }
    for (i=0; i<nm; ++i)
    {
        c[i] = O;
        for (j=0; j<m; ++j)
        {
            ij = i-j;
            if ((0 <= ij) && (ij < n))
            {
                c[i] = scalar_add(c[i], scalar_mul(a[ij], b[j]));
            }
        }
    }
    return c;
}
fn.conv = function(a, b) {
    if (is_scalar(a) || is_scalar(b)) return dotmul(a, b);
    a = vec(a);
    b = vec(b);
    if (!is_vector(a) || !is_vector(b)) not_supported("conv");
    return conv(a, b);
};
function deconv(n, d, pad)
{
    // adapted from https://github.com/foo123/Abacus
    // polynomial division
    var q = [], r = n.slice(),
        diff = r.length - d.length,
        diff0, d0 = d;
    if (0 <= diff)
    {
        q = array(diff+1, O);
        while (0 <= diff)
        {
            diff0 = diff;
            d = d0.concat(array(diff, O));
            q[q.length-1-diff] = scalar_div(r[0], d[0]);
            r = addp(r, mulp(d, [scalar_neg(q[q.length-1-diff])]));
            while (r.length && eq(r[0], O)) r.shift();
            diff = r.length - d0.length;
            if (diff === diff0) break; // remainder won't change anymore
        }
        //q = q.reverse();
    }
    return [q, pad ? (array(n.length-r.length, O).concat(r)) : r];
}
fn.deconv = varargout(function(nargout, a, b) {
    var ans;
    if (is_scalar(a) || is_scalar(b))
    {
        ans = 1 < nargout ? [dotdiv(a, b), O] : dotdiv(a, b);
    }
    else
    {
        a = vec(a);
        b = vec(b);
        if (!is_vector(a) || !is_vector(b)) not_supported("deconv");
        if (!b.length || (1 === b.length) && eq(b[0], O)) throw "deconv: divisor is zero";
        ans = deconv(a, b, true);
    }
    return 1 < nargout ? ans : ans[0];
});
function conv2(a, b)
{
    // adapted from https://github.com/foo123/FILTER.js
    var rA, cA,
        rB, cB,
        c, rC, cC,
        cjk, j, k,
        p, q, t;

    if (ROWS(a) < ROWS(b))
    {
        t = a;
        a = b;
        b = t;
    }
    rA = ROWS(a);
    cA = COLS(a);
    rB = ROWS(b);
    cB = COLS(b);
    rC = rA + rB - 1;
    cC = cA + cB - 1;
    c = zeros(rC, cC);

    for (j=0; j<rC; ++j)
    {
        for (k=0; k<cC; ++k)
        {
            cjk = O;
            for (p=0; p<=j; ++p)
            {
                if (p >= rA) break;
                if (j-p >= rB) continue;
                for (q=0; q<=k; ++q)
                {
                    if (q >= cA) break;
                    if (k-q >= cB) continue;
                    cjk = scalar_add(cjk, scalar_mul(a[p][q], b[j-p][k-q]));
                }
            }
            c[j][k] = cjk;
        }
    }
    return c;
}
fn.conv2 = function(a, b) {
    if (is_scalar(a) || is_scalar(b))
    {
        return dotmul(a, b);
    }
    else if (is_vector(a))
    {
        if (is_vector(b))
        {
            return conv(a, b);
        }
        else if (is_matrix(b))
        {
            return array(COLS(b), function(column) {
                return conv(a, COL(b, column));
            });
        }
        else
        {
            throw "conv2: input 2 not supported";
        }
    }
    else if (is_vector(b))
    {
        if (is_vector(a))
        {
            return conv(a, b);
        }
        else if (is_matrix(a))
        {
            return array(a[0].length, function(column) {
                return conv(COL(a, column), b);
            });
        }
        else
        {
            throw "conv2: input 1 not supported";
        }
    }
    if (!is_matrix(a)) throw "conv2: input 1 not supported";
    if (!is_matrix(b)) throw "conv2: input 2 not supported";
    return conv2(a, b);
};
function filter(b, a, x/*, zi, dim*/)
{
    // adapted from https://github.com/foo123/FILTER.js
    var nx = x.length,
        na = a.length,
        nb = b.length,
        y = new Array(nx),
        n, k, m, yn,
        a0 = a[0];

    a = a.map(function(ai) {return scalar_div(ai, a0);});
    b = b.map(function(bi) {return scalar_div(bi, a0);});

    /*
     ‘filter’ returns the solution to the following linear,
     time-invariant difference equation:

           N                   M
          SUM a(k+1) y(n-k) = SUM b(k+1) x(n-k)    for 1<=n<=length(x)
          k=0                 k=0

     where N=length(a)-1 and M=length(b)-1.  The result is calculated
     over the first non-singleton dimension of X or over DIM if
     supplied.

     An equivalent form of the equation is:

                    N                   M
          y(n) = - SUM c(k+1) y(n-k) + SUM d(k+1) x(n-k)  for 1<=n<=length(x)
                   k=1                 k=0

     where c = a/a(1) and d = b/a(1).
    */
    for (n=0; n<nx; ++n)
    {
        yn = O;
        for (m=n,k=0; m>=0 && k<nb; ++k,--m)
        {
            yn = scalar_add(yn, scalar_mul(b[k], x[m]));
        }
        for (m=n-1,k=1; m>=0 && k<na; ++k,--m)
        {
            yn = scalar_sub(yn, scalar_mul(a[k], y[m]));
        }
        y[n] = yn;
    }
    return y;
}
fn.filter = function(b, a, x, zi, dim) {
    b = vec(b);
    a = vec(a);
    x = vec(x);
    if (!is_vector(b) || !is_vector(a) || !is_vector(x)) not_supported("filter");
    return filter(b, a, x);
};
// adapted from https://github.com/foo123/FILTER.js
var SIN = {}, COS = {};
function sine(i)
{
    var sin_i;
    sin_i = SIN[i];
    if (null == sin_i) SIN[i] = sin_i = stdMath.sin(pi/i);
    return sin_i;
}
function cosine(i)
{
    var cos_i;
    cos_i = COS[i];
    if (null == cos_i) COS[i] = cos_i = stdMath.cos(pi/i);
    return cos_i;
}
function bitrevidx(idx, n)
{
    var rev_idx = 0;

    while (1 < n)
    {
        rev_idx <<= 1;
        rev_idx += idx & 1;
        idx >>= 1;
        n >>= 1;
    }
    return rev_idx;
}
function bitrev(x, x2)
{
    var n = x.length, done = {}, i, j, t;

    for (i=0; i<n; ++i)
    {
        if (1 === done[i]) continue;

        j = bitrevidx(i, n);

        t = x[j];
        x2[j] = x[i];
        x2[i] = t;

        done[j] = 1;
    }
}
function first_odd_fac(n)
{
    var sqrt_n = stdMath.sqrt(n), f = 3;

    while (f <= sqrt_n)
    {
        if (0 === (n % f)) return f;
        f += 2;
    }
    return n;
}
function fft1_r(x, inv, output)
{
    var n = x.length;
    var i, j, t;
    if (1 === n)
    {

        output[0] = x[0];
        return;
    }
    for (i=0; i<n; ++i)
    {
        output[i] = new complex(O, O);
    }

    // Use the lowest odd factor, so we are able to use _fft_i in the
    // recursive transforms optimally.
    var p = first_odd_fac(n), m = n / p,
        normalisation = inv ? __(1 / /*stdMath.sqrt(*/p/*)*/) : 1,
        recursive_result = new Array(m),
        recursive_result2 = new Array(m),
        del_f_r, del_f_i, f_r, f_i, _real, _imag;

    // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
    // for a power of a prime, p, this reduces to O(n p log_p n)
    for (j=0; j<p; ++j)
    {
        for (i=0; i<m; ++i)
        {
            recursive_result[i] = x[i * p + j];
        }
        // Don't go deeper unless necessary to save allocs.
        if (m > 1)
        {
            fft1(recursive_result, inv, recursive_result2);
            t = recursive_result;
            recursive_result = recursive_result2;
            recursive_result2 = t;
        }

        del_f_r = __(stdMath.cos(2*pi*j/n));
        del_f_i = __((inv ? 1 : -1) * stdMath.sin(2*pi*j/n));
        f_r = I;
        f_i = O;

        for (i=0; i<n; ++i)
        {
            _real = n_mul(normalisation, recursive_result[i % m].re);
            _imag = n_mul(normalisation, recursive_result[i % m].im);

            output[i] = output[i].add(new complex(
                n_sub(n_mul(_real, f_r), n_mul(_imag, f_i)),
                n_add(n_mul(_imag, f_r), n_mul(_real, f_i))
            ));

            _real = n_sub(n_mul(f_r, del_f_r), n_mul(f_i, del_f_i));
            _imag = n_add(n_mul(f_r, del_f_i), n_mul(f_i, del_f_r));
            f_r = _real;
            f_i = _imag;
        }
    }
}
function fft1_i(x, inv, output)
{
    // Loops go like O(n log n):
    //   w ~ log n; i,j ~ n
    var n = x.length, w = 1,
        del_f_r, del_f_i, i, k, j, t, s,
        f_r, f_i, l_index, r_index,
        left_r, left_i, right_r, right_i;
    bitrev(x, output);
    while (w < n)
    {
        del_f_r = __(cosine(w));
        del_f_i = __((inv ? 1 : -1) * sine(w));
        k = n/(2*w);
        for (i=0; i<k; ++i)
        {
            f_r = I;
            f_i = O;
            for (j=0; j<w; ++j)
            {
                l_index = 2*i*w + j;
                r_index = l_index + w;

                left_r = output[l_index].re;
                left_i = output[l_index].im;
                t = output[r_index].re;
                s = output[r_index].im;
                right_r = n_sub(n_mul(f_r, t), n_mul(f_i, s));
                right_i = n_add(n_mul(f_i, t), n_mul(f_r, s));

                output[l_index] = new complex(n_mul(n_add(left_r, right_r), sqrt1_2), n_mul(n_add(left_i, right_i), sqrt1_2));
                output[r_index] = new complex(n_mul(n_sub(left_r, right_r), sqrt1_2), n_mul(n_sub(left_i, right_i), sqrt1_2));

                t = n_sub(n_mul(f_r, del_f_r), n_mul(f_i, del_f_i));
                s = n_add(n_mul(f_r, del_f_i), n_mul(f_i, del_f_r));
                f_r = t;
                f_i = s;
            }
        }
        w <<= 1;
    }
}
function fft1(x, inv, output)
{
    var n = x.length;
    if (0 >= n) return;
    var ret = false;
    if (null == output)
    {
        output = new Array(n);
        ret = true;
    }
    if (n & (n - 1)) fft1_r(x, inv, output)
    else fft1_i(x, inv, output);
    if (ret) return output;
}
fn.fft = function(x) {
    x = vec(x);
    if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return realify(fft1(complexify(COL(x, column)), false));
        });
    }
    else if (is_vector(x))
    {
        return realify(fft1(complexify(x), false));
    }
    not_supported("fft");
};
fn.ifft = function(x) {
    x = vec(x);
    if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return realify(fft1(complexify(COL(x, column)), true));
        });
    }
    else if (is_vector(x))
    {
        return realify(fft1(complexify(x), true));
    }
    not_supported("ifft");
};
function fftshift(x, dim)
{
    if (is_vector(x))
    {
        var N = x.length, N_2 = stdMath.ceil(N / 2);
        return array(N, function(i) {
            return x[(i+N_2) % N];
        });
    }
    else if (is_matrix(x))
    {
        var N = ROWS(x), N_2 = stdMath.ceil(N / 2),
            M = COLS(x), M_2 = stdMath.ceil(M / 2);
        if (1 === dim)
        {
            return matrix(N, M, function(i, j) {
                return x[(i+N_2) % N][j];
            });
        }
        else if (2 === dim)
        {
            return matrix(N, M, function(i, j) {
                return x[i][(j+M_2) % M];
            });
        }
        else
        {
            return matrix(N, M, function(i, j) {
                return x[(i+N_2) % N][(j+M_2) % M];
            });
        }
    }
    return x;
}
fn.fftshift = function(x, dim) {
    x = vec(x);
    if (is_vector(x) || is_matrix(x))
    {
        return fftshift(x, is_scalar(dim) ? _(real(dim)) : null);
    }
    return x;
};// adapted from https://github.com/foo123/FILTER.js
function fft2(x, inv, output)
{
    var nx = x.length, ny = x[0].length;
    if (0 >= nx || 0 >= ny) return;
    var ret = false,
        n = nx * ny, i, j, jn,
        row = new Array(nx),
        col = new Array(ny),
        frow = new Array(nx),
        fcol = new Array(ny);

    if (null == output)
    {
        output = new Array(nx);
        for (i=0; i<nx; ++i) output[i] = new Array(ny);
        ret = true;
    }
    for (j=0,jn=0; j<ny; ++j,jn+=nx)
    {
        for (i=0; i<nx; ++i)
        {
            row[i] = x[i][j];
        }
        fft1(row, inv, frow);
        for (i=0; i<nx; ++i)
        {
            output[i][j] = frow[i];
        }
    }
    for (i=0; i<nx; ++i)
    {
        for (j=0,jn=0; j<ny; ++j,jn+=nx)
        {
            col[j] = output[i][j];
        }
        fft1(col, inv, fcol);
        for (j=0,jn=0; j<ny; ++j,jn+=nx)
        {
            output[i][j] = fcol[j];
        }
    }

    if (ret) return output;
}
fn.fft2 = function(x) {
    if (!is_matrix(x)) not_supported("fft2");
    return realify(fft2(complexify(x), false));
};
fn.ifft2 = function(x) {
    if (!is_matrix(x)) not_supported("ifft2");
    return realify(fft2(complexify(x), true));
};
function stft(inp, win, FFTLEN, OVERLAP, inv)
{
    // short-time fourier transform and inverse
    var out,
        i, j, k,
        N, SEGMENTS,
        WLEN = FFTLEN < win.length ? FFTLEN : win.length,
        HOP = stdMath.max(1, WLEN - OVERLAP),
        zero = new complex(O, O),
        wx = new Array(FFTLEN),
        fx = new Array(FFTLEN),
        pad = stdMath.floor((FFTLEN-WLEN)/2);

    if (WLEN < win.length) win = win.slice(0, WLEN);
    win = dotdiv(win, norm(win));
    if (inv)
    {
        // inverse short-time fourier transform using ifft
        SEGMENTS = COLS(inp);
        N = (SEGMENTS - 1) * HOP + 1;
        out = array(N, zero);
        win = dotdiv(win, sum(dotmul(win, win)));
        for (j=0,i=0; i<SEGMENTS; ++i,j+=HOP)
        {
            // get segment
            for (k=0; k<FFTLEN; ++k)
            {
                fx[k] = inp[k][i];
                wx[k] = zero;
            }
            // ifft
            fft1(fx, true, wx);
            // overlap-add resynthesis
            // win should satisfy certain conditions (COLA) for exact inverse reconstruction
            for (k=0; k<WLEN; ++k)
            {
                if (j+pad+k >= N) break;
                out[j+pad+k] = scalar_add(out[j+pad+k], scalar_mul(wx[pad+k], win[k]));
            }
        }
    }
    else
    {
        // short-time fourier transform using fft
        // if (N - OVERLAP) / HOP is integer istft produces output of same length as original input
        N = inp.length;
        SEGMENTS = stdMath.floor((N - 1) / HOP) + 1;
        out = matrix(FFTLEN, SEGMENTS, zero);
        for (j=0,i=0; i<SEGMENTS; ++i,j+=HOP)
        {
            // apply win to segment with zero padding
            for (k=0; k<pad; ++k)
            {
                wx[k] = zero;
                fx[k] = zero;
            }
            for (k=0; k<WLEN; ++k)
            {
                wx[pad+k] = j+k < N ? scalar_mul(win[k], inp[j+k]) : zero;
                fx[pad+k] = zero;
            }
            for (k=pad+WLEN; k<FFTLEN; ++k)
            {
                wx[k] = zero;
                fx[k] = zero;
            }
            // fft
            fft1(/*fftshift(*/wx/*)*/, false, fx);
            // store
            for (k=0; k<FFTLEN; ++k)
            {
                out[k][i] = fx[k];
            }
        }
    }
    return out;
}
fn.stft = varargout(namevalueargs(function(nargout, x) {
    var nv = arguments[arguments.length-1]._,
        win = null, ovrl = null, nfft = null,
        fs = 2*pi, f = null, t = null, ans;
    if ((2 < arguments.length) && is_scalar(arguments[2]))
    {
        fs = _(real(arguments[2]));
    }
    x = vec(x);
    if (is_vector(x))
    {
        win = nv.Window;
        nfft = nv.FFTLength;
        ovrl = nv.OverlapLength;
        win = null == win ? vec(fn.hann(128, "periodic")) : vec(win);
        nfft = null == nfft ? stdMath.max(128, win.length) : stdMath.round(_(real(nfft)));
        ovrl = null == ovrl ? stdMath.floor(0.75*win.length) : stdMath.round(_(real(ovrl)));
        ans = realify(stft(complexify(x), win, nfft, ovrl, false));
        if (1 < nargout)
        {
            f = array(nfft, function(k) {
                return __((k/nfft - 0.5/*nyquist rate*/)*fs);
            });
        }
        if (2 < nargout)
        {
            t = array(COLS(ans), function(m) {
                return __(m*stdMath.max(1, win.length - ovrl + 1)/fs);
            });
        }
    }
    else
    {
        not_supported("stft");
    }
    return 1 < nargout ? [ans, f, t] : ans;
}, {
   Window: null,
   FFTLength: null,
   OverlapLength: null
}));
fn.istft = varargout(namevalueargs(function(nargout, X) {
    var nv = arguments[arguments.length-1]._,
        win = null, ovrl = null, nfft = null,
        fs = 2*pi, t = null, ans;
    if ((2 < arguments.length) && is_scalar(arguments[2]))
    {
        fs = _(real(arguments[2]));
    }
    if (is_matrix(X))
    {
        win = nv.Window;
        nfft = nv.FFTLength;
        ovrl = nv.OverlapLength;
        win = null == win ? vec(fn.hann(128, "periodic")) : vec(win);
        nfft = null == nfft ? stdMath.max(128, win.length) : stdMath.round(_(real(nfft)));
        ovrl = null == ovrl ? stdMath.floor(0.75*win.length) : stdMath.round(_(real(ovrl)));
        if (nfft === ROWS(X))
        {
            ans = realify(stft(complexify(X), win, nfft, ovrl, true));
            if (1 < nargout)
            {
                t = array(COLS(X), function(m) {
                    return __(m*stdMath.max(1, win.length - ovrl + 1)/fs);
                });
            }
        }
        else
        {
            not_supported("istft");
        }
    }
    else
    {
        not_supported("istft");
    }
    return 1 < nargout ? [ans, t] : ans;
}, {
   Window: null,
   FFTLength: null,
   OverlapLength: null
}));
function addp(p, q)
{
    // adapted from https://github.com/foo123/Abacus
    var i = p.length-1, j = q.length-1, pq = [];
    while ((0 <= i) && (0 <= j)) pq.unshift(scalar_add(p[i--], q[j--]));
    while (0 <= i) pq.unshift(p[i--]);
    while (0 <= j) pq.unshift(q[j--]);
    return pq;
}
var mulp = conv, divp = deconv;
function horner(p, x)
{
    // adapted from https://github.com/foo123/Abacus
    if (!p.length) return O;
    x = x || O;
    var n = p.length, i = 0, v = p[0];
    while (i+1 < n)
    {
        ++i;
        v = scalar_add(scalar_mul(v, x), p[i]);
    }
    return v;
}
fn.polydiv = varargout(function(nargout, a, b) {
    var ans;
    if (is_scalar(a) || is_scalar(b))
    {
        ans = 1 < nargout ? [dotdiv(a, b), O] : dotdiv(a, b);
    }
    else
    {
        a = vec(a);
        b = vec(b);
        if (!is_vector(a) || !is_vector(b)) not_supported("polydiv");
        if (!b.length || (1 === b.length) && eq(b[0], O)) throw "polydiv: divisor is zero";
        ans = divp(a, b, false);
    }
    return 1 < nargout ? ans : ans[0];
});
fn.polyval = function(p, x) {
    p = vec(p);
    if (!is_vector(p)) not_supported("polyval");
    if (is_scalar(x)) return realify(horner(p, x));
    else if (is_vector(x)) return x.map(function(xi) {return realify(horner(p, xi));});
    not_supported("polyval");
};
function hornerm(p, A)
{
    // adapted from https://github.com/foo123/Abacus
    if (!p.length) return zeros(ROWS(A), COLS(A));
    var n = p.length, i = 0, k = ROWS(A), v = eye(k, p[0]);
    while (i+1 < n)
    {
        ++i;
        v = add(mul(v, A), eye(k, p[i]));
    }
    return v;
}
fn.polyvalm = function(p, A) {
    p = vec(p);
    if (!is_vector(p)) not_supported("polyvalm");
    if (is_matrix(A) && (ROWS(A) === COLS(A))) return realify(hornerm(p, A));
    else if (is_scalar(A)) return realify(horner(p, A));
    else if (is_vector(A)) return A.map(function(ai) {return realify(horner(p, ai));});
    not_supported("polyvalm");
};
function lagrange(x, y)
{
    // adapted from https://github.com/foo123/Abacus
    var p, i, n, d, f, vi, hash, dupl;
    if (!is_vector(x) || !x.length || !is_vector(y) || !y.length) return [];
    // check and filter out duplicate values
    x = x.slice();
    y = y.slice();
    n = stdMath.min(x.length, y.length);
    x.length = n;
    y.length = n;
    hash = {}; dupl = [];
    for (i=0; i<n; ++i)
    {
        vi = String(x[i]);
        if (!HAS.call(hash, vi)) hash[vi] = i;
        else if (!eq(y[hash[vi]], y[i])) return []; // no polynomial exists
        else dupl.push(i); // duplicate value to be removed
    }
    // remove duplicate values
    while (dupl.length)
    {
        i = dupl.pop();
        x.splice(i, 1);
        y.splice(i, 1);
    }
    hash = null;
    dupl = null;
    n = x.length;

    // Set-up denominators
    d = array(n, function(j) {
        var i, dj = I;
        for (i=0; i<n; ++i)
        {
            if (i === j) continue;
            dj = scalar_mul(dj, scalar_sub(x[j], x[i]));
        }
        dj = scalar_div(y[j], dj);
        return dj;
    });
    // Set-up numerator factors
    f = array(n, function(i) {
        return [I, scalar_neg(x[i])];
    });
    // Produce each Li in turn, and sum into p
    for (p=[],i=0; i<n; ++i)
    {
        p = addp(p, f.reduce(function(Li, fj, j) {
            if (j !== i) Li = mulp(Li, fj);
            return Li;
        }, [d[i]]));
    }
    return p;
}
fn.polyfit = function(x, y, n) {
    x = vec(x);
    y = vec(y);
    if (!is_vector(x) || !is_vector(y)) not_supported("polyfit");
    if (x.length !== y.length) throw "polyfit: input 1 and 2 must have same length";
    if (3 === arguments.length)
    {
        if (!is_int(n) || (0 > _(n))) throw "polyfit: input 3 not positive int";
        n = _(n);
        // least-squares fit
        return realify(mul(pinv(x.reduce(function(A, xi) {
            for (var i=1,row=[I]; i<=n; ++i)
            {
                row.unshift(scalar_mul(xi, row[0]));
            }
            A.push(row);
            return A;
        }, [])), y));
    }
    else
    {
        // lagrange interpolation
        return realify(lagrange(x, y));
    }
};
function roots(p)
{
    // adapted from https://github.com/foo123/Abacus
    if (1 >= p.length) return [];
    var d = p.length-1, tc, lo, hi,
        roots, found, i, j, m,
        ri, ratio, offset, iter,
        epsilon = __(1e-10),
        epsilonz = new complex(epsilon, O),
        zero = new complex(O, O),
        one = new complex(I, O),
        p_x, dp_x, px, dpx;

    p = /*complexify*/(p.map(__));
    p_x = function(x) {
        return horner(p, x);
    };
    dp_x = function(x) {
        return scalar_div(scalar_sub(p_x(scalar_add(x, epsilonz)), p_x(x)), epsilonz);
    };

    // init
    tc = p.map(function(ci) {return complex(ci).abs();});
    i = tc.length-1; while ((0 < i) && n_eq(tc[i], O)) --i;
    hi = n_add(n_div((max(tc.slice(0, i)) || O), max([tc[i], I])), I);
    lo = n_div(tc[0], max(n_add(tc[0], max(tc.slice(1))), I));
    roots = array(d, function() {
        return new complex(n_add(lo, n_mul(n_sub(hi, lo), stdMath.random())), __(stdMath.random()*pi/2), 'polar');
    });

    // root finding
    for (iter=1; iter<=10000; ++iter)
    {
        found = 0;
        for (i=0; i<d; ++i)
        {
            ri = roots[i];
            px = p_x(ri);
            dpx = dp_x(ri);
            if (n_eq(dpx.re, O) && n_eq(dpx.im, O))
            {
                if (n_le(realMath.abs(px.re), epsilon) && n_le(realMath.abs(px.im), epsilon))
                {
                    ++found;
                    continue;
                }
                ratio = new complex(hi, O);
            }
            else
            {
                ratio = px.div(dpx);
            }
            offset = ratio.div(one.sub(ratio.mul(roots.reduce(function(s, rj, j) {
                if ((j !== i) && !(n_eq(ri.re, rj.re) && n_eq(ri.im, rj.im))) s = s.add((ri.sub(rj)).inv());
                return s;
            }, zero))));
            if (n_le(realMath.abs(offset.re), epsilon) && n_le(realMath.abs(offset.im), epsilon)) ++found;
            roots[i] = ri.sub(offset);
        }
        if (found === d) break;
    }
    return roots;
}
fn.roots = function(p) {
    p = vec(p);
    if (!is_vector(p)) not_supported("roots");
    return realify(roots(p).sort(function(a, b) {
        return n_lt(real(a), real(b)) ? -1 : (n_gt(real(a), real(b)) ? 1 : 0);
    }));
};
function compan(p)
{
    return matrix(p.length-1, p.length-1, function(i, j) {
        return 0 === i ? scalar_neg(scalar_div(p[j+1], p[0])) : (j+1 === i ? I : O);
        
    });
}
fn.compan = function(p) {
    p = vec(p);
    if (!is_vector(p)) not_supported("compan");
    return compan(p);
};
function poly(r)
{
    // adapted from https://github.com/foo123/Abacus
    return r.reduce(function(p, ri) {
        return mulp(p, [I, scalar_neg(ri)]);
    }, [I]);
}
fn.poly = function(r) {
    r = vec(r);
    if (is_matrix(r) && fn.charpoly) return fn.charpoly(r);
    if (!is_vector(r)) not_supported("poly");
    return realify(poly(r));
};
fn.cart2pol = varargout(function(nargout, x, y, z) {
    return [
        fn.atan2(y, x), // theta
        fn.sqrt(add(dotpow(x, two), dotpow(y, two))), // rho
        z // z
    ];
}, 3);fn.pol2cart = varargout(function(nargout, theta, rho, z) {
    return [
        dotmul(rho, fn.cos(theta)), // x
        dotmul(rho, fn.sin(theta)), // y
        z // z
    ];
}, 3);fn.cart2sph = varargout(function(nargout, x, y, z) {
    var rxy = add(dotpow(x, two), dotpow(y, two));
    return [
        fn.atan2(y, x), // azimuth
        fn.atan2(z, fn.sqrt(rxy)), // elevation
        fn.sqrt(add(rxy, dotpow(z, two))) // r
    ];
}, 3);fn.sph2cart = varargout(function(nargout, azimuth, elevation, r) {
    return [
        dotmul(r, dotmul(fn.cos(elevation), fn.cos(azimuth))), // x
        dotmul(r, dotmul(fn.cos(elevation), fn.sin(azimuth))), // y
        dotmul(r, fn.sin(elevation)) // z
    ];
}, 3);function polyarea(x, y)
{
    // adapted from https://github.com/foo123/Geometrize
    var x1, y1, x2, y2, area = O,
        i, n = stdMath.min(x.length, y.length)-1;
    for (i=0; i<n; ++i)
    {
        x1 = x[i];
        x2 = x[i+1];
        y1 = y[i];
        y2 = y[i+1];
        // shoelace formula
        area = n_add(area, n_div(n_sub(n_mul(x1, y2), n_mul(y1, x2)), two));
    }
    if (1 < n)
    {
        x1 = x[n];
        x2 = x[0];
        y1 = y[n];
        y2 = y[0];
        // shoelace formula
        area = n_add(area, n_div(n_sub(n_mul(x1, y2), n_mul(y1, x2)), two));
    }
    return area;
}
fn.polyarea = function(x, y) {
    x = vec(x);
    y = vec(y);
    if (is_matrix(x) && is_matrix(y))
    {
        if ((ROWS(x) !== ROWS(y)) || (COLS(x) !== COLS(y))) not_supported("polyarea");
        return array(COLS(x), function(column) {
            return polyarea(COL(x, column), COL(y, column));
        });
    }
    if (is_vector(x) && is_vector(y))
    {
        if (x.length !== y.length) not_supported("polyarea");
        return polyarea(x, y);
    }
    not_supported("polyarea");
};
function dir_angle(x1, y1, x2, y2, x3, y3)
{
    // adapted from https://github.com/foo123/Geometrize
    var dx1 = n_sub(x1, x3),
        dx2 = n_sub(x2, x3),
        dy1 = n_sub(y1, y3),
        dy2 = n_sub(y2, y3)
    ;
    return n_sub(n_mul(dx1, dy2), n_mul(dy1, dx2));
}
function polar_angle(x1, y1, x2, y2)
{
    // adapted from https://github.com/foo123/Geometrize
    var a = realMath.atan2(n_sub(y2, y1), n_sub(x2, x1));
    return lt(a, O) ? n_add(a, 2*pi) : a;
}
function convex_hull_2d(x, y)
{
    // adapted from https://github.com/foo123/Geometrize
    var n = x.length, k = array(n, function(i) {return i;}),
        i0, i, convexHull, hullSize;

    // at least 3 points must define a non-trivial convex hull
    if (3 > n) return k;

    i0 = 0;
    for (i=1; i<n; ++i)
    {
        if (n_lt(y[i], y[i0]) || (n_eq(y[i], y[i0]) && n_lt(x[i], x[i0])))
        {
            i0 = i;
        }
    }
    k.splice(i0, 1);
    --n;

    k = k.map(function(i) {
        return [polar_angle(x[i0], y[i0], x[i], y[i]), i];
    }).sort(function(a, b) {
        return n_lt(a[0], b[0]) ? -1 : (n_gt(a[0], b[0]) ? 1 : 0);
    }).map(function(i) {
        return i[1];
    });

    // pre-allocate array to avoid slow array size changing ops inside loop
    convexHull = new Array(n + 1);
    convexHull[0] = i0;
    convexHull[1] = k[0];
    convexHull[2] = k[1];
    hullSize = 3;
    for (i=2; i<n; ++i)
    {
        while ((1 < hullSize) && n_le(O, dir_angle(x[k[i]], y[k[i]], x[convexHull[hullSize-1]], y[convexHull[hullSize-1]], x[convexHull[hullSize-2]], y[convexHull[hullSize-2]]))) --hullSize;
        convexHull[hullSize++] = k[i];
    }
    // truncate to actual size
    convexHull.length = hullSize;
    return convexHull;
}
fn.convhull = varargout(function(nargout, x, y, z) {
    if (3 < arguments.length) not_supported("convhull");
    if (is_matrix(x) && (2 === COLS(x)))
    {
        y = COL(x, 1);
        x = COL(x, 0);
    }
    else
    {
        x = vec(x);
        y = vec(y);
    }
    if (!is_vector(x) || !is_vector(y) || (x.length !== y.length)) not_supported("convhull");
    var hull2d = convex_hull_2d(x, y);
    return 1 < nargout ? [hull2d.map(function(i) {return i+1;}), polyarea(hull2d.map(function(i) {return x[i];}), hull2d.map(function(i) {return y[i];}))] : (hull2d.map(function(i) {return i+1;}));
});
/*function mod(x, n)
{
    n = sca(n || 0);
    return eq(n, 0) ? x : apply(function(x) {
        if (is_num(x))
        {
            var m = n_mod(x, n);
            if (n_lt(m, 0) && n_gt(n, 0)) m = n_add(m, n);
            return m;
        }
        return x;
    }, x, true);
}
fn.mod = mod;*/
fn.mod = function(x, n) {
    return apply_(function(x, n) {
        n = real(n);
        if (!n_eq(O, n) && is_num(x))
        {
            var m = n_mod(x, n);
            if (n_lt(m, O) && n_gt(n, O)) m = n_add(m, n);
            return m;
        }
        return x;
    }, [x, n || 0]);
};
function n_gcd(/* args */)
{
    // adapted from https://github.com/foo123/Abacus
    var args = arguments, c = args.length, a, b, t, i;
    if (0 === c) return O;

    i = 0;
    while ((i < c) && n_eq(O, a=args[i++]));
    a = realMath.abs(a);
    while (i < c)
    {
        // break early
        if (n_eq(a, I)) return I;
        while ((i < c) && n_eq(O, b=args[i++]));
        b = realMath.abs(b);
        // break early
        if (n_eq(b, I)) return I;
        else if (n_eq(b, a)) continue;
        else if (n_eq(b, O)) break;
        // swap them (a >= b)
        if (n_lt(a, b)) {t = b; b = a; a = t;}
        while (!n_eq(O, b)) {t = b; b = n_mod(a, t); a = t;}
    }
    return a;
}
function n_xgcd(args)
{
    // adapted from https://github.com/foo123/Abacus
    var k = args.length, a, b, a1 = I, b1 = O, a2 = O, b2 = I, quot, gcd, asign = I, bsign = I;

    if (0 === k) return;

    a = args[0];
    if (n_gt(O, a)) {a = realMath.abs(a); asign = J;}
    if (1 === k)
    {
        return [a, asign];
    }
    else //if (2 <= k)
    {
        // recursive on number of arguments
        // compute xgcd on rest arguments and combine with current
        // based on recursive property: gcd(a,b,c,..) = gcd(a, gcd(b, c,..))
        // for coefficients this translates to:
        // gcd(a,b,c,..) = ax + by + cz + .. =
        // gcd(a, gcd(b, c, ..)) = ax + k gcd(b,c,..) = (given gcd(b,c,..) = nb + mc + ..)
        // gcd(a, gcd(b, c, ..)) = ax + k (nb + mc + ..) = ax + b(kn) + c(km) + .. = ax + by +cz + ..
        // also for possible negative numbers we can do (note gcd(a,b,c,..) is always positive):
        // a*(sign(a)*x) + b*(sign(b)*y) + c*(sign(c)*z) + .. = gcd(|a|,|b|,|c|,..) so factors are same only adjusted by sign(.) to match always positive GCD
        // note: returns always positive gcd (even of negative numbers)
        // note2: any zero arguments are skipped and do not break xGCD computation
        // note3: gcd(0,0,..,0) is conventionaly set to 0 with 1's as factors
        gcd = 2 === k ? [args[1], I] : n_xgcd(args.slice(1));
        b = gcd[0];
        if (n_gt(O, b)) {b = realMath.abs(b); bsign = J;}

        // gcd with zero factor, take into account
        if (n_eq(O, a))
            return array(gcd.length+1,function(i) {
                return 0 === i ? b : (1 === i ? asign : n_mul(bsign, gcd[i-1]));
            });
        else if (n_eq(O, b))
            return array(gcd.length+1,function(i) {
                return 0 === i ? a : (1 === i ? asign : n_mul(bsign, gcd[i-1]));
            });

        for (;;)
        {
            quot = realMath.floor(n_div(a, b));
            a = n_mod(a, b);
            a1 = n_sub(a1, n_mul(quot, a2));
            b1 = n_sub(b1, n_mul(quot, b2));
            if (n_eq(O, a))
            {
                a2 = n_mul(a2, asign); b2 = n_mul(b2, bsign);
                return array(gcd.length+1,function(i) {
                    return 0 === i ? b : (1 === i ? a2 : n_mul(b2, gcd[i-1]));
                });
            }

            quot = realMath.floor(n_div(b, a));
            b = n_mod(b, a);
            a2 = n_sub(a2, n_mul(quot, a1));
            b2 = n_sub(b2, n_mul(quot, b1));
            if (n_eq(O, b))
            {
                a1 = n_mul(a1, asign); b1 = n_mul(b1, bsign);
                return array(gcd.length+1, function(i) {
                    return 0 === i ? a : (1 === i ? a1 : n_mul(b1, gcd[i-1]));
                });
            }
        }
    }
}
/*function gcd(a, b, want_bezout_coeffs)
{
    if (want_bezout_coeffs)
    {
        var u, v;
        if (is_array(a))
        {
            u = new Array(a.length);
            if (is_array(b))
            {
                if (a.length !== b.length) not_supported("gcd");
                v = new Array(b.length)
                return [a.map(function(ai, i) {
                    var res = gcd(ai, b[i], want_bezout_coeffs);
                    u[i] = res[1];
                    v[i] = res[2];
                    return res[0];
                }), u, v];
            }
            if (is_int(b))
            {
                v = new Array(a.length)
                return [a.map(function(ai, i) {
                    var res = gcd(ai, b, want_bezout_coeffs);
                    u[i] = res[1];
                    v[i] = res[2];
                    return res[0];
                }), u, v];
            }
        }
        if (is_int(a))
        {
            if (is_array(b))
            {
                u = new Array(b.length);
                v = new Array(b.length);
                return [b.map(function(bi, i) {
                    var res = gcd(a, bi, want_bezout_coeffs);
                    u[i] = res[1];
                    v[i] = res[2];
                    return res[0];
                }), u, v];
            }
            if (is_int(b))
            {
                return n_xgcd([a, b]);
            }
        }
    }
    else
    {
        if (is_array(a))
        {
            if (is_array(b))
            {
                if (a.length !== b.length) not_supported("gcd");
                return a.map(function(ai, i) {return gcd(ai, b[i]);});
            }
            if (is_int(b))
            {
                return a.map(function(ai) {return gcd(ai, b);});
            }
        }
        if (is_int(a))
        {
            if (is_array(b))
            {
                return b.map(function(bi, i) {return gcd(a, bi);});
            }
            if (is_int(b))
            {
                return n_gcd(a, b);
            }
        }
    }
    not_supported("gcd");
}*/
fn.gcd = varargout(function(nargout, a, b) {
    //return gcd(a, b, 1 < nargout);
    return apply_(1 < nargout ? function(a, b) {return n_xgcd([a, b]);} : function(a, b) {return n_gcd(a, b);}, [a, b], function(x) {return realMath.fix(real(x));}, nargout);
});function n_lcm2(a, b)
{
    // adapted from https://github.com/foo123/Abacus
    var aa = realMath.abs(a), bb = realMath.abs(b);
    if (n_eq(aa, bb)) return n_eq(n_sign(a), n_sign(b)) ? aa : n_neg(aa);
    return n_mul(n_div(a, n_gcd(a, b)), b);
}
function n_lcm(/* args */)
{
    // adapted from https://github.com/foo123/Abacus
    var args = arguments, i, l = args.length, LCM;
    if (1 >= l) return 1 === l ? args[0] : O;
    if (n_eq(O, args[0]) || n_eq(O, args[1])) return O;
    LCM = n_lcm2(args[0], args[1]);
    for (i=2; i<l; ++i)
    {
        if (n_eq(O, args[i])) return O;
        LCM = n_lcm2(LCM, args[i]);
    }
    return LCM;
}
/*function lcm(a, b)
{
    if (is_array(a))
    {
        if (is_array(b)) return a.map(function(ai, i) {return lcm(ai, b[i]);});
        if (is_int(b)) return a.map(function(ai) {return lcm(ai, b);});
    }
    if (is_int(a))
    {
        if (is_array(b)) return b.map(function(bi, i) {return lcm(a, bi);});
        if (is_int(b)) return n_lcm(a, b);
    }
    return a;
}
fn.lcm = lcm;*/
fn.lcm = function(a, b) {
    return apply_(n_lcm, [a, b], function(x) {return realMath.fix(real(x));});
};function small_primes()
{
    // adapted from https://github.com/foo123/Abacus
    var N = __;
    if (!small_primes.list)
    {
        // a list of the first primes up to a limit (first 2000 primes)
        small_primes.list = [N(2),N(3),N(5),N(7),N(11),N(13),N(17),N(19),N(23),N(29),N(31),N(37),N(41),N(43),N(47),N(53),N(59),N(61),N(67),N(71),N(73),N(79),N(83),N(89),N(97),N(101),N(103),N(107),N(109),N(113),N(127),N(131),N(137),N(139),N(149),N(151),N(157),N(163),N(167),N(173),N(179),N(181),N(191),N(193),N(197),N(199),N(211),N(223),N(227),N(229),N(233),N(239),N(241),N(251),N(257),N(263),N(269),N(271),N(277),N(281),N(283),N(293),N(307),N(311),N(313),N(317),N(331),N(337),N(347),N(349),N(353),N(359),N(367),N(373),N(379),N(383),N(389),N(397),N(401),N(409),N(419),N(421),N(431),N(433),N(439),N(443),N(449),N(457),N(461),N(463),N(467),N(479),N(487),N(491),N(499),N(503),N(509),N(521),N(523),N(541),N(547),N(557),N(563),N(569),N(571),N(577),N(587),N(593),N(599),N(601),N(607),N(613),N(617),N(619),N(631),N(641),N(643),N(647),N(653),N(659),N(661),N(673),N(677),N(683),N(691),N(701),N(709),N(719),N(727),N(733),N(739),N(743),N(751),N(757),N(761),N(769),N(773),N(787),N(797),N(809),N(811),N(821),N(823),N(827),N(829),N(839),N(853),N(857),N(859),N(863),N(877),N(881),N(883),N(887),N(907),N(911),N(919),N(929),N(937),N(941),N(947),N(953),N(967),N(971),N(977),N(983),N(991),N(997),N(1009),N(1013),N(1019),N(1021),N(1031),N(1033),N(1039),N(1049),N(1051),N(1061),N(1063),N(1069),N(1087),N(1091),N(1093),N(1097),N(1103),N(1109),N(1117),N(1123),N(1129),N(1151),N(1153),N(1163),N(1171),N(1181),N(1187),N(1193),N(1201),N(1213),N(1217),N(1223),N(1229),N(1231),N(1237),N(1249),N(1259),N(1277),N(1279),N(1283),N(1289),N(1291),N(1297),N(1301),N(1303),N(1307),N(1319),N(1321),N(1327),N(1361),N(1367),N(1373),N(1381),N(1399),N(1409),N(1423),N(1427),N(1429),N(1433),N(1439),N(1447),N(1451),N(1453),N(1459),N(1471),N(1481),N(1483),N(1487),N(1489),N(1493),N(1499),N(1511),N(1523),N(1531),N(1543),N(1549),N(1553),N(1559),N(1567),N(1571),N(1579),N(1583),N(1597),N(1601),N(1607),N(1609),N(1613),N(1619),N(1621),N(1627),N(1637),N(1657),N(1663),N(1667),N(1669),N(1693),N(1697),N(1699),N(1709),N(1721),N(1723),N(1733),N(1741),N(1747),N(1753),N(1759),N(1777),N(1783),N(1787),N(1789),N(1801),N(1811),N(1823),N(1831),N(1847),N(1861),N(1867),N(1871),N(1873),N(1877),N(1879),N(1889),N(1901),N(1907),N(1913),N(1931),N(1933),N(1949),N(1951),N(1973),N(1979),N(1987),N(1993),N(1997),N(1999),N(2003),N(2011),N(2017),N(2027),N(2029),N(2039),N(2053),N(2063),N(2069),N(2081),N(2083),N(2087),N(2089),N(2099),N(2111),N(2113),N(2129),N(2131),N(2137),N(2141),N(2143),N(2153),N(2161),N(2179),N(2203),N(2207),N(2213),N(2221),N(2237),N(2239),N(2243),N(2251),N(2267),N(2269),N(2273),N(2281),N(2287),N(2293),N(2297),N(2309),N(2311),N(2333),N(2339),N(2341),N(2347),N(2351),N(2357),N(2371),N(2377),N(2381),N(2383),N(2389),N(2393),N(2399),N(2411),N(2417),N(2423),N(2437),N(2441),N(2447),N(2459),N(2467),N(2473),N(2477),N(2503),N(2521),N(2531),N(2539),N(2543),N(2549),N(2551),N(2557),N(2579),N(2591),N(2593),N(2609),N(2617),N(2621),N(2633),N(2647),N(2657),N(2659),N(2663),N(2671),N(2677),N(2683),N(2687),N(2689),N(2693),N(2699),N(2707),N(2711),N(2713),N(2719),N(2729),N(2731),N(2741),N(2749),N(2753),N(2767),N(2777),N(2789),N(2791),N(2797),N(2801),N(2803),N(2819),N(2833),N(2837),N(2843),N(2851),N(2857),N(2861),N(2879),N(2887),N(2897),N(2903),N(2909),N(2917),N(2927),N(2939),N(2953),N(2957),N(2963),N(2969),N(2971),N(2999),N(3001),N(3011),N(3019),N(3023),N(3037),N(3041),N(3049),N(3061),N(3067),N(3079),N(3083),N(3089),N(3109),N(3119),N(3121),N(3137),N(3163),N(3167),N(3169),N(3181),N(3187),N(3191),N(3203),N(3209),N(3217),N(3221),N(3229),N(3251),N(3253),N(3257),N(3259),N(3271),N(3299),N(3301),N(3307),N(3313),N(3319),N(3323),N(3329),N(3331),N(3343),N(3347),N(3359),N(3361),N(3371),N(3373),N(3389),N(3391),N(3407),N(3413),N(3433),N(3449),N(3457),N(3461),N(3463),N(3467),N(3469),N(3491),N(3499),N(3511),N(3517),N(3527),N(3529),N(3533),N(3539),N(3541),N(3547),N(3557),N(3559),N(3571),N(3581),N(3583),N(3593),N(3607),N(3613),N(3617),N(3623),N(3631),N(3637),N(3643),N(3659),N(3671),N(3673),N(3677),N(3691),N(3697),N(3701),N(3709),N(3719),N(3727),N(3733),N(3739),N(3761),N(3767),N(3769),N(3779),N(3793),N(3797),N(3803),N(3821),N(3823),N(3833),N(3847),N(3851),N(3853),N(3863),N(3877),N(3881),N(3889),N(3907),N(3911),N(3917),N(3919),N(3923),N(3929),N(3931),N(3943),N(3947),N(3967),N(3989),N(4001),N(4003),N(4007),N(4013),N(4019),N(4021),N(4027),N(4049),N(4051),N(4057),N(4073),N(4079),N(4091),N(4093),N(4099),N(4111),N(4127),N(4129),N(4133),N(4139),N(4153),N(4157),N(4159),N(4177),N(4201),N(4211),N(4217),N(4219),N(4229),N(4231),N(4241),N(4243),N(4253),N(4259),N(4261),N(4271),N(4273),N(4283),N(4289),N(4297),N(4327),N(4337),N(4339),N(4349),N(4357),N(4363),N(4373),N(4391),N(4397),N(4409),N(4421),N(4423),N(4441),N(4447),N(4451),N(4457),N(4463),N(4481),N(4483),N(4493),N(4507),N(4513),N(4517),N(4519),N(4523),N(4547),N(4549),N(4561),N(4567),N(4583),N(4591),N(4597),N(4603),N(4621),N(4637),N(4639),N(4643),N(4649),N(4651),N(4657),N(4663),N(4673),N(4679),N(4691),N(4703),N(4721),N(4723),N(4729),N(4733),N(4751),N(4759),N(4783),N(4787),N(4789),N(4793),N(4799),N(4801),N(4813),N(4817),N(4831),N(4861),N(4871),N(4877),N(4889),N(4903),N(4909),N(4919),N(4931),N(4933),N(4937),N(4943),N(4951),N(4957),N(4967),N(4969),N(4973),N(4987),N(4993),N(4999),N(5003),N(5009),N(5011),N(5021),N(5023),N(5039),N(5051),N(5059),N(5077),N(5081),N(5087),N(5099),N(5101),N(5107),N(5113),N(5119),N(5147),N(5153),N(5167),N(5171),N(5179),N(5189),N(5197),N(5209),N(5227),N(5231),N(5233),N(5237),N(5261),N(5273),N(5279),N(5281),N(5297),N(5303),N(5309),N(5323),N(5333),N(5347),N(5351),N(5381),N(5387),N(5393),N(5399),N(5407),N(5413),N(5417),N(5419),N(5431),N(5437),N(5441),N(5443),N(5449),N(5471),N(5477),N(5479),N(5483),N(5501),N(5503),N(5507),N(5519),N(5521),N(5527),N(5531),N(5557),N(5563),N(5569),N(5573),N(5581),N(5591),N(5623),N(5639),N(5641),N(5647),N(5651),N(5653),N(5657),N(5659),N(5669),N(5683),N(5689),N(5693),N(5701),N(5711),N(5717),N(5737),N(5741),N(5743),N(5749),N(5779),N(5783),N(5791),N(5801),N(5807),N(5813),N(5821),N(5827),N(5839),N(5843),N(5849),N(5851),N(5857),N(5861),N(5867),N(5869),N(5879),N(5881),N(5897),N(5903),N(5923),N(5927),N(5939),N(5953),N(5981),N(5987),N(6007),N(6011),N(6029),N(6037),N(6043),N(6047),N(6053),N(6067),N(6073),N(6079),N(6089),N(6091),N(6101),N(6113),N(6121),N(6131),N(6133),N(6143),N(6151),N(6163),N(6173),N(6197),N(6199),N(6203),N(6211),N(6217),N(6221),N(6229),N(6247),N(6257),N(6263),N(6269),N(6271),N(6277),N(6287),N(6299),N(6301),N(6311),N(6317),N(6323),N(6329),N(6337),N(6343),N(6353),N(6359),N(6361),N(6367),N(6373),N(6379),N(6389),N(6397),N(6421),N(6427),N(6449),N(6451),N(6469),N(6473),N(6481),N(6491),N(6521),N(6529),N(6547),N(6551),N(6553),N(6563),N(6569),N(6571),N(6577),N(6581),N(6599),N(6607),N(6619),N(6637),N(6653),N(6659),N(6661),N(6673),N(6679),N(6689),N(6691),N(6701),N(6703),N(6709),N(6719),N(6733),N(6737),N(6761),N(6763),N(6779),N(6781),N(6791),N(6793),N(6803),N(6823),N(6827),N(6829),N(6833),N(6841),N(6857),N(6863),N(6869),N(6871),N(6883),N(6899),N(6907),N(6911),N(6917),N(6947),N(6949),N(6959),N(6961),N(6967),N(6971),N(6977),N(6983),N(6991),N(6997),N(7001),N(7013),N(7019),N(7027),N(7039),N(7043),N(7057),N(7069),N(7079),N(7103),N(7109),N(7121),N(7127),N(7129),N(7151),N(7159),N(7177),N(7187),N(7193),N(7207),N(7211),N(7213),N(7219),N(7229),N(7237),N(7243),N(7247),N(7253),N(7283),N(7297),N(7307),N(7309),N(7321),N(7331),N(7333),N(7349),N(7351),N(7369),N(7393),N(7411),N(7417),N(7433),N(7451),N(7457),N(7459),N(7477),N(7481),N(7487),N(7489),N(7499),N(7507),N(7517),N(7523),N(7529),N(7537),N(7541),N(7547),N(7549),N(7559),N(7561),N(7573),N(7577),N(7583),N(7589),N(7591),N(7603),N(7607),N(7621),N(7639),N(7643),N(7649),N(7669),N(7673),N(7681),N(7687),N(7691),N(7699),N(7703),N(7717),N(7723),N(7727),N(7741),N(7753),N(7757),N(7759),N(7789),N(7793),N(7817),N(7823),N(7829),N(7841),N(7853),N(7867),N(7873),N(7877),N(7879),N(7883),N(7901),N(7907),N(7919),N(7927),N(7933),N(7937),N(7949),N(7951),N(7963),N(7993),N(8009),N(8011),N(8017),N(8039),N(8053),N(8059),N(8069),N(8081),N(8087),N(8089),N(8093),N(8101),N(8111),N(8117),N(8123),N(8147),N(8161),N(8167),N(8171),N(8179),N(8191),N(8209),N(8219),N(8221),N(8231),N(8233),N(8237),N(8243),N(8263),N(8269),N(8273),N(8287),N(8291),N(8293),N(8297),N(8311),N(8317),N(8329),N(8353),N(8363),N(8369),N(8377),N(8387),N(8389),N(8419),N(8423),N(8429),N(8431),N(8443),N(8447),N(8461),N(8467),N(8501),N(8513),N(8521),N(8527),N(8537),N(8539),N(8543),N(8563),N(8573),N(8581),N(8597),N(8599),N(8609),N(8623),N(8627),N(8629),N(8641),N(8647),N(8663),N(8669),N(8677),N(8681),N(8689),N(8693),N(8699),N(8707),N(8713),N(8719),N(8731),N(8737),N(8741),N(8747),N(8753),N(8761),N(8779),N(8783),N(8803),N(8807),N(8819),N(8821),N(8831),N(8837),N(8839),N(8849),N(8861),N(8863),N(8867),N(8887),N(8893),N(8923),N(8929),N(8933),N(8941),N(8951),N(8963),N(8969),N(8971),N(8999),N(9001),N(9007),N(9011),N(9013),N(9029),N(9041),N(9043),N(9049),N(9059),N(9067),N(9091),N(9103),N(9109),N(9127),N(9133),N(9137),N(9151),N(9157),N(9161),N(9173),N(9181),N(9187),N(9199),N(9203),N(9209),N(9221),N(9227),N(9239),N(9241),N(9257),N(9277),N(9281),N(9283),N(9293),N(9311),N(9319),N(9323),N(9337),N(9341),N(9343),N(9349),N(9371),N(9377),N(9391),N(9397),N(9403),N(9413),N(9419),N(9421),N(9431),N(9433),N(9437),N(9439),N(9461),N(9463),N(9467),N(9473),N(9479),N(9491),N(9497),N(9511),N(9521),N(9533),N(9539),N(9547),N(9551),N(9587),N(9601),N(9613),N(9619),N(9623),N(9629),N(9631),N(9643),N(9649),N(9661),N(9677),N(9679),N(9689),N(9697),N(9719),N(9721),N(9733),N(9739),N(9743),N(9749),N(9767),N(9769),N(9781),N(9787),N(9791),N(9803),N(9811),N(9817),N(9829),N(9833),N(9839),N(9851),N(9857),N(9859),N(9871),N(9883),N(9887),N(9901),N(9907),N(9923),N(9929),N(9931),N(9941),N(9949),N(9967),N(9973),N(10007),N(10009),N(10037),N(10039),N(10061),N(10067),N(10069),N(10079),N(10091),N(10093),N(10099),N(10103),N(10111),N(10133),N(10139),N(10141),N(10151),N(10159),N(10163),N(10169),N(10177),N(10181),N(10193),N(10211),N(10223),N(10243),N(10247),N(10253),N(10259),N(10267),N(10271),N(10273),N(10289),N(10301),N(10303),N(10313),N(10321),N(10331),N(10333),N(10337),N(10343),N(10357),N(10369),N(10391),N(10399),N(10427),N(10429),N(10433),N(10453),N(10457),N(10459),N(10463),N(10477),N(10487),N(10499),N(10501),N(10513),N(10529),N(10531),N(10559),N(10567),N(10589),N(10597),N(10601),N(10607),N(10613),N(10627),N(10631),N(10639),N(10651),N(10657),N(10663),N(10667),N(10687),N(10691),N(10709),N(10711),N(10723),N(10729),N(10733),N(10739),N(10753),N(10771),N(10781),N(10789),N(10799),N(10831),N(10837),N(10847),N(10853),N(10859),N(10861),N(10867),N(10883),N(10889),N(10891),N(10903),N(10909),N(10937),N(10939),N(10949),N(10957),N(10973),N(10979),N(10987),N(10993),N(11003),N(11027),N(11047),N(11057),N(11059),N(11069),N(11071),N(11083),N(11087),N(11093),N(11113),N(11117),N(11119),N(11131),N(11149),N(11159),N(11161),N(11171),N(11173),N(11177),N(11197),N(11213),N(11239),N(11243),N(11251),N(11257),N(11261),N(11273),N(11279),N(11287),N(11299),N(11311),N(11317),N(11321),N(11329),N(11351),N(11353),N(11369),N(11383),N(11393),N(11399),N(11411),N(11423),N(11437),N(11443),N(11447),N(11467),N(11471),N(11483),N(11489),N(11491),N(11497),N(11503),N(11519),N(11527),N(11549),N(11551),N(11579),N(11587),N(11593),N(11597),N(11617),N(11621),N(11633),N(11657),N(11677),N(11681),N(11689),N(11699),N(11701),N(11717),N(11719),N(11731),N(11743),N(11777),N(11779),N(11783),N(11789),N(11801),N(11807),N(11813),N(11821),N(11827),N(11831),N(11833),N(11839),N(11863),N(11867),N(11887),N(11897),N(11903),N(11909),N(11923),N(11927),N(11933),N(11939),N(11941),N(11953),N(11959),N(11969),N(11971),N(11981),N(11987),N(12007),N(12011),N(12037),N(12041),N(12043),N(12049),N(12071),N(12073),N(12097),N(12101),N(12107),N(12109),N(12113),N(12119),N(12143),N(12149),N(12157),N(12161),N(12163),N(12197),N(12203),N(12211),N(12227),N(12239),N(12241),N(12251),N(12253),N(12263),N(12269),N(12277),N(12281),N(12289),N(12301),N(12323),N(12329),N(12343),N(12347),N(12373),N(12377),N(12379),N(12391),N(12401),N(12409),N(12413),N(12421),N(12433),N(12437),N(12451),N(12457),N(12473),N(12479),N(12487),N(12491),N(12497),N(12503),N(12511),N(12517),N(12527),N(12539),N(12541),N(12547),N(12553),N(12569),N(12577),N(12583),N(12589),N(12601),N(12611),N(12613),N(12619),N(12637),N(12641),N(12647),N(12653),N(12659),N(12671),N(12689),N(12697),N(12703),N(12713),N(12721),N(12739),N(12743),N(12757),N(12763),N(12781),N(12791),N(12799),N(12809),N(12821),N(12823),N(12829),N(12841),N(12853),N(12889),N(12893),N(12899),N(12907),N(12911),N(12917),N(12919),N(12923),N(12941),N(12953),N(12959),N(12967),N(12973),N(12979),N(12983),N(13001),N(13003),N(13007),N(13009),N(13033),N(13037),N(13043),N(13049),N(13063),N(13093),N(13099),N(13103),N(13109),N(13121),N(13127),N(13147),N(13151),N(13159),N(13163),N(13171),N(13177),N(13183),N(13187),N(13217),N(13219),N(13229),N(13241),N(13249),N(13259),N(13267),N(13291),N(13297),N(13309),N(13313),N(13327),N(13331),N(13337),N(13339),N(13367),N(13381),N(13397),N(13399),N(13411),N(13417),N(13421),N(13441),N(13451),N(13457),N(13463),N(13469),N(13477),N(13487),N(13499),N(13513),N(13523),N(13537),N(13553),N(13567),N(13577),N(13591),N(13597),N(13613),N(13619),N(13627),N(13633),N(13649),N(13669),N(13679),N(13681),N(13687),N(13691),N(13693),N(13697),N(13709),N(13711),N(13721),N(13723),N(13729),N(13751),N(13757),N(13759),N(13763),N(13781),N(13789),N(13799),N(13807),N(13829),N(13831),N(13841),N(13859),N(13873),N(13877),N(13879),N(13883),N(13901),N(13903),N(13907),N(13913),N(13921),N(13931),N(13933),N(13963),N(13967),N(13997),N(13999),N(14009),N(14011),N(14029),N(14033),N(14051),N(14057),N(14071),N(14081),N(14083),N(14087),N(14107),N(14143),N(14149),N(14153),N(14159),N(14173),N(14177),N(14197),N(14207),N(14221),N(14243),N(14249),N(14251),N(14281),N(14293),N(14303),N(14321),N(14323),N(14327),N(14341),N(14347),N(14369),N(14387),N(14389),N(14401),N(14407),N(14411),N(14419),N(14423),N(14431),N(14437),N(14447),N(14449),N(14461),N(14479),N(14489),N(14503),N(14519),N(14533),N(14537),N(14543),N(14549),N(14551),N(14557),N(14561),N(14563),N(14591),N(14593),N(14621),N(14627),N(14629),N(14633),N(14639),N(14653),N(14657),N(14669),N(14683),N(14699),N(14713),N(14717),N(14723),N(14731),N(14737),N(14741),N(14747),N(14753),N(14759),N(14767),N(14771),N(14779),N(14783),N(14797),N(14813),N(14821),N(14827),N(14831),N(14843),N(14851),N(14867),N(14869),N(14879),N(14887),N(14891),N(14897),N(14923),N(14929),N(14939),N(14947),N(14951),N(14957),N(14969),N(14983),N(15013),N(15017),N(15031),N(15053),N(15061),N(15073),N(15077),N(15083),N(15091),N(15101),N(15107),N(15121),N(15131),N(15137),N(15139),N(15149),N(15161),N(15173),N(15187),N(15193),N(15199),N(15217),N(15227),N(15233),N(15241),N(15259),N(15263),N(15269),N(15271),N(15277),N(15287),N(15289),N(15299),N(15307),N(15313),N(15319),N(15329),N(15331),N(15349),N(15359),N(15361),N(15373),N(15377),N(15383),N(15391),N(15401),N(15413),N(15427),N(15439),N(15443),N(15451),N(15461),N(15467),N(15473),N(15493),N(15497),N(15511),N(15527),N(15541),N(15551),N(15559),N(15569),N(15581),N(15583),N(15601),N(15607),N(15619),N(15629),N(15641),N(15643),N(15647),N(15649),N(15661),N(15667),N(15671),N(15679),N(15683),N(15727),N(15731),N(15733),N(15737),N(15739),N(15749),N(15761),N(15767),N(15773),N(15787),N(15791),N(15797),N(15803),N(15809),N(15817),N(15823),N(15859),N(15877),N(15881),N(15887),N(15889),N(15901),N(15907),N(15913),N(15919),N(15923),N(15937),N(15959),N(15971),N(15973),N(15991),N(16001),N(16007),N(16033),N(16057),N(16061),N(16063),N(16067),N(16069),N(16073),N(16087),N(16091),N(16097),N(16103),N(16111),N(16127),N(16139),N(16141),N(16183),N(16187),N(16189),N(16193),N(16217),N(16223),N(16229),N(16231),N(16249),N(16253),N(16267),N(16273),N(16301),N(16319),N(16333),N(16339),N(16349),N(16361),N(16363),N(16369),N(16381),N(16411),N(16417),N(16421),N(16427),N(16433),N(16447),N(16451),N(16453),N(16477),N(16481),N(16487),N(16493),N(16519),N(16529),N(16547),N(16553),N(16561),N(16567),N(16573),N(16603),N(16607),N(16619),N(16631),N(16633),N(16649),N(16651),N(16657),N(16661),N(16673),N(16691),N(16693),N(16699),N(16703),N(16729),N(16741),N(16747),N(16759),N(16763),N(16787),N(16811),N(16823),N(16829),N(16831),N(16843),N(16871),N(16879),N(16883),N(16889),N(16901),N(16903),N(16921),N(16927),N(16931),N(16937),N(16943),N(16963),N(16979),N(16981),N(16987),N(16993),N(17011),N(17021),N(17027),N(17029),N(17033),N(17041),N(17047),N(17053),N(17077),N(17093),N(17099),N(17107),N(17117),N(17123),N(17137),N(17159),N(17167),N(17183),N(17189),N(17191),N(17203),N(17207),N(17209),N(17231),N(17239),N(17257),N(17291),N(17293),N(17299),N(17317),N(17321),N(17327),N(17333),N(17341),N(17351),N(17359),N(17377),N(17383),N(17387),N(17389)];
    }
    return small_primes.list;
}
update.push(function() {
    small_primes.list = null;
});

function trial_div_fac(n, maxlimit)
{
    // adapted from https://github.com/foo123/Abacus
    var factors = [], primes = small_primes(), n0 = n, i, l, p, p2;

    for (i=0,l=primes.length; i<l; ++i)
    {
        p = primes[i];
        if (n_eq(n0, p)) return [p];

        p2 = n_mul(p, p);

        if (n_gt(p2, n) || ((null != maxlimit) && n_gt(p2, maxlimit))) break;

        while (n_eq(O, n_mod(n, p)))
        {
            factors.push(p);
            n = n_div(n, p);
        }
    }
    if (i >= l)
    {
        p = n_add(p, two);
        p2 = n_mul(p, p);
        while (n_le(p2, n) && ((null == maxlimit) || n_le(p2, maxlimit)))
        {
            while (n_eq(O, n_mod(n, p)))
            {
                factors.push(p);
                n = n_div(n, p);
            }
            p = n_add(p, two);
            p2 = n_mul(p, p);
        }
    }
    if (n_gt(n, I)) factors.push(n);
    return factors;
}
fn.factor = function(n) {
    return trial_div_fac(realMath.floor(realMath.abs(real(sca(n)))), __(1e30));
};function shuffle(a)
{
    // adapted from https://github.com/foo123/Abacus
    var offset = 0, a0 = 0, a1 = a.length-1,
        N = a1-a0+1, perm, swap;
    while (1 < N--)
    {
        perm = stdMath.round(stdMath.random()*(N-offset));
        swap = a[a0+N];
        a[a0+N] = a[a0+perm];
        a[a0+perm] = swap;
    }
    return a;
}
fn.randperm = function(n) {
    n = stdMath.round(_(n || 0));
    if (!is_int(n) || 0 >= n) not_supported("randperm");
    return shuffle(array(n, function(i) {return i+1;}));
};
function next_perm(item)
{
    // adapted from https://github.com/foo123/Abacus
    if (!item.length) return null;

    // LEX
    var n = item.length,
        k, kl, s, l, r,
        MIN = 0, MAX = n-1,
        DK = 1, k0 = MAX,
        a = 1, b = 0,
        da = 1, db = 0;

    k = k0-DK;
    while ((MIN <= k) && (k <= MAX) && (a*item[k] >= a*item[k+DK])) k -= DK;
    if ((MIN <= k) && (k <= MAX))
    {
        kl = k0;
        while ((MIN <= kl) && (kl <= MAX) && (DK*(kl-k) > 0) && (a*item[k] >= a*item[kl])) kl -= DK;
        s = item[k]; item[k] = item[kl]; item[kl] = s;
        l = k+DK; r = k0;
        while ((MIN <= l) && (l <= MAX) && (MIN <= r) && (r <= MAX) && (DK*(r-l) > 0))
        {
            s = item[l]; item[l] = item[r]; item[r] = s;
            l += DK; r -= DK;
        }
    }
    else item = null;

    return item;
}
function perms(v)
{
    // adapted from https://github.com/foo123/Abacus
    v = vec(v);
    if (!is_1d(v)) not_supported("perms");
    var n = v.length,
        perm = array(n, function(i) {return i;}),
        ans = [];
    while (perm && perm.length)
    {
        ans.unshift(perm.map(function(i) {return v[i];})); // revlex order
        perm = next_perm(perm);
    }
    if (v.$scilitecell$) ans = cellarray(ans, [ans.length]);
    return ans;
}
fn.perms = perms;function next_comb(item, n, k)
{
    // adapted from https://github.com/foo123/Abacus
    var i, j, index, curr, i0, DI, MIN, MAX, a, b, da, db, inc;

    if ((0 > n) || (0 > k) || !item.length) return null;

    // LEX
    MIN = 0; MAX = k-1;
    DI = 1; i0 = MAX;
    a = 1; b = 0;
    da = 1; db = 0;
    inc = 1;

    for (index=-1,j=n-k,i=i0; (MIN<=i) && (i<=MAX); i-=DI)
        if (item[i] < j+da*i+db) {index = i; break;}

    if ((MIN <= index) && (index <= MAX))
    {
        curr = item[index]+1;
        j = n-k+da*index+db;
        if (curr === j)
        {
            item[index] = curr;
        }
        else if (curr < j)
        {
            for (i=index; (MIN<=i) && (i<=MAX); i+=DI) {item[i] = curr; curr += inc;}
        }
    }
    else item = null;

    return item;
}
function nchoosek(n, k)
{
    // adapted from https://github.com/foo123/Abacus
    var v = is_array(n) ? vec(n) : null, comb, ans;
    if (!is_scalar(k) || (!is_scalar(n) && !is_1d(v))) not_supported("nchoosek");
    if (is_scalar(n))
    {
        // return binomial coefficient
        return binom(n, k);
    }
    // return all choices of k items from n items
    ans = [];
    k = stdMath.round(_(real(k)));
    n = v.length;
    if ((0 <= k) && (k <= n))
    {
        comb = array(k, function(i) {return i;});
        while (comb)
        {
            ans.push(comb.map(function(i) {return v[i];}));
            comb = next_comb(comb, n, k);
        }
    }
    if (v.$scilitecell$) ans = cellarray(ans, [ans.length]);
    return ans;
}
fn.nchoosek = nchoosek;function next_tensor(item, n)
{
    // adapted from https://github.com/foo123/Abacus
    var k = n.length, i, j, i0, i1, DI, a, b, MIN, MAX;
    // LEX
    MIN = 0; MAX = k-1;
    DI = 1; i0 = MAX; i1 = MIN;
    a = 1; b = 0;

    i = i0;
    while ((MIN <= i) && (MAX >= i) && (item[i]+1 === n[a*i+b])) i -= DI;
    if ((MIN <= i) && (MAX >= i))
        for (item[i]=item[i]+1,j=i+DI; MIN<=j && MAX>=j; j+=DI) item[j] = 0;
    //else last item
    else item = null;

    return item;
}
function combinations(A)
{
    // adapted from https://github.com/foo123/Abacus
    A = [].map.call(A, function(Ak) {
        if (!is_array(Ak)) not_supported("combinations");
        return colon(Ak);
    });
    var n = A.map(function(Ak) {return Ak.length;}),
        comb = array(n.length, 0),
        ans = [];
    while (comb && comb.length)
    {
        ans.push(comb.map(function(i, k) {return A[k][i];}));
        comb = next_tensor(comb, n);
    }
    return ans;
}
fn.combinations = function() {
    return combinations(arguments);
};// interpreter
function TRUE(x)
{
    if (is_string(x))
    {
        return 0 < x.length;
    }
    else if (is_nan(x))
    {
        return false;
    }
    else if (is_number(x))
    {
        return 0 !== x;
    }
    else if (is_decimal(x))
    {
        return !x.eq(O);
    }
    else if (is_complex(x))
    {
        return !n_eq(x.re, O) || !n_eq(x.im, O);
    }
    else if (is_array(x))
    {
        if (!x.length) return false;
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (!TRUE(x[i])) return false;
        }
        return true;
    }
    return true === x ? true : false;
}

var PREFIX = -1,
    INFIX = 0,
    POSTFIX = 1,
    LEFT = -1,
    RIGHT = 1,
    COMMUTATIVE = 1,
    NONCOMMUTATIVE = 0,
    ANTICOMMUTATIVE = -1
;

// adapted from https://github.com/foo123/Xpresion
var OP = {
    "[]": {
     name         : 'literal_array'
    ,arity        : 1
    ,fixity       : PREFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 0
    ,fn           : function(/*args..*/) {
                        var arr = [], row = [], cols = null, dtype = null;
                        [].forEach.call(arguments, function(arg) {
                            if (',' === arg)
                            {
                                // pass
                            }
                            else if (';' === arg)
                            {
                                if (row.length)
                                {
                                    if (is_array(row[0]))
                                    {
                                        if (null == cols) cols = COLS(row);
                                        else if (cols !== COLS(row)) throw "array rows with different dimensions";
                                        arr = arr.length ? cat_vert(arr, row) : row;
                                    }
                                    else
                                    {
                                        if (null == cols) cols = row.length;
                                        else if (cols !== row.length) throw "array rows with different dimensions";
                                        arr.push(row);
                                    }
                                    row = [];
                                }
                            }
                            else
                            {
                                if (null == dtype)
                                {
                                    dtype = data_type(arg);
                                    if ('' === dtype) throw "array with incompatible data types";
                                }
                                else if (dtype !== data_type(arg))
                                {
                                    throw "array with incompatible data types";
                                }
                                if (is_instance(arg, variable))
                                {
                                    row.push(arg);
                                }
                                else if (is_array(arg))
                                {
                                    // pass array by value
                                    row = row.length ? cat_horz(row, copy(arg)) : copy(arg);
                                }
                                else
                                {
                                    row.push(arg);
                                }
                            }
                        });
                        if (row.length)
                        {
                            if (is_array(row[0]))
                            {
                                if (null == cols) cols = COLS(row);
                                else if (cols !== COLS(row)) throw "array rows with different dimensions";
                                arr = arr.length ? cat_vert(arr, row) : row;
                            }
                            else if (arr.length)
                            {
                                if (null == cols) cols = row.length;
                                else if (cols !== row.length) throw "array rows with different dimensions";
                                arr.push(row);
                            }
                            else
                            {
                                arr = row;
                            }
                        }
                        return arr;
                    }
    },
    "{}": {
     name         : 'literal_cellarray'
    ,arity        : 1
    ,fixity       : PREFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 0
    ,fn           : function(/*args..*/) {
                        var arr = [], row = [], dims = [];
                        [].forEach.call(arguments, function(arg) {
                            if (',' === arg)
                            {
                                // pass
                            }
                            else if (';' === arg)
                            {
                                if (row.length)
                                {
                                    if (!dims.length) dims.unshift(row.length);
                                    else if (dims[0] !== row.length) throw "cell array rows with different dimensions";
                                    arr.push(row);
                                    row = [];
                                }
                            }
                            else
                            {
                                row.push(arg);
                            }
                        });
                        if (row.length)
                        {
                            if (!dims.length) dims.unshift(row.length);
                            else if (dims[0] !== row.length) throw "cell array rows with different dimensions";
                            arr.push(row);
                        }
                        dims.unshift(arr.length);
                        if (2 > dims.length) dims.unshift(dims[0] ? 1 : 0);
                        return cellarray(arr, dims);
                    }
    },
    "(:)": {
     name         : 'colon'
    ,arity        : 1
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 30
    ,fn           : function(arg0) {
                        return fn.colon(arg0);
                    }
    },
    ":": {
     name         : 'colon1'
    ,arity        : 2
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 30
    ,fn           : function(arg0, arg1) {
                        return colon(arg0, arg1);
                    }
    },
    "::": {
     name         : 'colon2'
    ,arity        : 3
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 30
    ,fn           : function(arg0, arg1, arg2) {
                        return colon(arg0, arg1, arg2);
                    }
    },
    "'": {
     name         : 'ctranspose'
    ,arity        : 1
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 10
    ,fn           : function(arg0) {
                        return fn.ctranspose(arg0);
                    }
    },
    ".'": {
     name         : 'transpose'
    ,arity        : 1
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 10
    ,fn           : function(arg0) {
                        return fn.transpose(arg0);
                    }
    },
    '^': {
     name         : 'pow'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 15
    ,fn           : function(arg0, arg1) {
                        return pow(arg0, arg1);
                    }
    },
    '.^': {
     name         : 'dotpow'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 15
    ,fn           : function(arg0, arg1) {
                        return dotpow(arg0, arg1);
                    }
    },
    '\\': {
     name         : 'mldivide'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return mldivide(arg0, arg1);
                    }
    },
    '/': {
     name         : 'div'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return dotdiv(arg0, arg1);
                    }
    },
    './': {
     name         : 'dotdiv'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return dotdiv(arg0, arg1);
                    }
    },
    '*': {
     name         : 'mul'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        // arrays represent row vectors
                        if (is_1d(arg0)) arg0 = vec2row(arg0);
                        if (is_1d(arg1)) arg1 = vec2row(arg1);
                        return mul(arg0, arg1);
                    }
    },
    '.*': {
     name         : 'dotmul'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 20
    ,fn           : function(arg0, arg1) {
                        return dotmul(arg0, arg1);
                    }
    },
    '+': {
     name         : 'add'
    ,arity        : 2
    ,arityalt     : 1
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 25
    ,fn           : function(arg0, arg1) {
                        return 1 === arguments.length ? arg0 : add(arg0, arg1);
                    }
    },
    '-': {
     name         : 'sub'
    ,arity        : 2
    ,arityalt     : 1
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: ANTICOMMUTATIVE
    ,priority     : 25
    ,fn           : function(arg0, arg1) {
                        return 1 === arguments.length ? neg(arg0) : sub(arg0, arg1);
                    }
    },
    '>=': {
     name         : 'ge'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 35
    ,fn           : function(arg0, arg1) {
                        return ge(arg0, arg1);
                    }
    },
    '<=': {
     name         : 'le'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 35
    ,fn           : function(arg0, arg1) {
                        return le(arg0, arg1);
                    }
    },
    '>': {
     name         : 'gt'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 35
    ,fn           : function(arg0, arg1) {
                        return gt(arg0, arg1);
                    }
    },
    '<': {
     name         : 'lt'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 35
    ,fn           : function(arg0, arg1) {
                        return lt(arg0, arg1);
                    }
    },
    '~=': {
     name         : 'ne'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 40
    ,fn           : function(arg0, arg1) {
                        return ne(arg0, arg1);
                    }
    },
    '==': {
     name         : 'eq'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 40
    ,fn           : function(arg0, arg1) {
                        return eq(arg0, arg1);
                    }
    },
    '&&': {
     name         : 'and'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 32
    ,fn           : function(arg0, arg1) {
                        return TRUE(arg0) && TRUE(arg1) ? 1 : 0;
                    }
    },
    '||': {
     name         : 'or'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 33
    ,fn           : function(arg0, arg1) {
                        return TRUE(arg0) || TRUE(arg1) ? 1 : 0;
                    }
    },
    'xor': {
     name         : 'xor'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 33
    ,fn           : function(arg0, arg1) {
                        var a = TRUE(arg0), b = TRUE(arg1);
                        return (a && !b) || (b && !a) ? 1 : 0;
                    }
    },
    '~': {
     name         : 'not'
    ,arity        : 1
    ,fixity       : PREFIX
    ,associativity: LEFT
    ,commutativity: ANTICOMMUTATIVE
    ,priority     : 31
    ,fn           : function(arg0) {
                        return TRUE(arg0) ? 0 : 1;
                    }
    },
    '&': {
     name         : 'band'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 41
    ,fn           : function(arg0, arg1) {
                        return bitand(arg0, arg1);
                    }
    },
    '|': {
     name         : 'bor'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 41
    ,fn           : function(arg0, arg1) {
                        return bitor(arg0, arg1);
                    }
    },
    '(=)': {
     name         : 'set-name-value'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 45
    ,fn           : function(nv, name, value) {
                        if (is_instance(nv, namevalue) && is_string(name))
                        {
                            // if nv already has name, create new one
                            if (nv.has(name)) nv = namevalue();
                            nv.set(name, value);
                        }
                        return nv;
                    }
    },
    '=': {
     name         : 'set'
    ,breakpoint   : 'set'
    ,arity        : 2
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 45
    ,fn           : async function(arg0, arg1) {
                        if (is_array(arg0) && is_instance(arg0[0], variable))
                        {
                            // de-structuring
                            var vars = arg0, val = arg1;
                            if (is_array(val))
                            {
                                vars = await Promise.all(vars.map(function(vari, i) {
                                    return set_var(vari, i < val.length ? val[i] : null);
                                }));
                            }
                            else
                            {
                                vars = await Promise.all(vars.map(function(vari, i) {
                                    return set_var(vari, 0 === i ? val : null);
                                }));
                            }
                            vars.$scilitevarargout$ = true;
                            return vars;
                        }
                        else if (is_instance(arg1, variable))
                        {
                            return await set_var(arg0, await arg1.get('ref'));
                        }
                        else
                        {
                            // set whole array as one variable, do not assume de-structuring
                            if (is_vector(arg1) && arg1.$scilitevarargout$) arg1.$scilitevarargout$ = null;
                            return await set_var(arg0, (null != arg1) && arg1.$scilitevarargout$ ? arg1[0] : arg1);
                        }
                    }
    }
};
$.op = OP;

async function set_var($var, $val)
{
    if (!is_instance($var, variable) || !is_string($var.v)) throw "setting non-variable";
    await $var.set($val);
    return await $var.get(true);
}

async function if_end($arg, v, $$)
{
    var i, j, k, n, statements, echoed = [], ans = null;
    echoed.$scilitevarargout$ = true;
    if (TRUE(await vale($arg['if'].cond, v, $$)))
    {
        statements = $arg['if'].statements;
        for (i=0,n=statements.length; i<n; ++i)
        {
            ans = await vale(statements[i], v, $$, null, echoed);
            if (/*null != ans*/ $$ && $$.ctx) $$.ctx.ans = ans;
            if ((1 < echoed.length) && is_array(echoed[echoed.length-1]) && (echoed[echoed.length-1] === echoed[echoed.length-2])) echoed.pop();
        }
        return echoed;
    }
    if ($arg['elseif'].length)
    {
        for (j=0,k=$arg['elseif'].length; j<k; ++j)
        {
            if (TRUE(await vale($arg['elseif'][j].cond, v, $$)))
            {
                statements = $arg['elseif'][j].statements;
                for (i=0,n=statements.length; i<n; ++i)
                {
                    ans = await vale(statements[i], v, $$, null, echoed);
                    if (/*null != ans*/ $$ && $$.ctx) $$.ctx.ans = ans;
                    if ((1 < echoed.length) && is_array(echoed[echoed.length-1]) && (echoed[echoed.length-1] === echoed[echoed.length-2])) echoed.pop();
                }
                return echoed;
            }
        }
    }
    if ($arg['else'].statements.length)
    {
        statements = $arg['else'].statements;
        for (i=0,n=statements.length; i<n; ++i)
        {
            ans = await vale(statements[i], v, $$, null, echoed);
            if (/*null != ans*/ $$ && $$.ctx) $$.ctx.ans = ans;
            if ((1 < echoed.length) && is_array(echoed[echoed.length-1]) && (echoed[echoed.length-1] === echoed[echoed.length-2])) echoed.pop();
        }
        return echoed;
    }
}

async function for_end($arg, v, $$)
{
    var i, n, j, k, ans, echoed = [],
        brk, is_break = false,
        cont, is_continue = false,
        values = await vale($arg.val, v, $$),
        values_is_2d = false, sz,
        statements = $arg.statements;
    echoed.$scilitevarargout$ = true;
    if (is_array(values))
    {
        $$ = $$ || {};
        //$$.ctx = $$.ctx || {ans:null};
        brk = $$.brk;
        cont = $$.cont;
        $$.brk = function() {is_break = true;};
        $$.cont = function() {is_continue = true;};
        values = vec(values);
        values_is_2d = is_2d(values);
        if (values_is_2d)
        {
            sz = size(values);
            // reshape nd-array to 2d-array by columns
            if (2 < sz.length) values = reshape(values, [sz[0], prod(sz.slice(1))]);
        }
        if ($$.ctx) $arg.ind.new_ctx($$.ctx);
        for (j=0,k=values_is_2d?COLS(values):(values.length); j<k; ++j)
        {
            is_break = false;
            is_continue = false;
            await $arg.ind.set(values_is_2d ? vec2col(COL(values, j)) : values[j]);
            for (i=0,n=statements.length; i<n; ++i)
            {
                ans = await vale(statements[i], v, $$, null, echoed);
                if (is_break || is_continue) break;
                if (/*null != ans*/ $$.ctx) $$.ctx.ans = ans;
                if ((1 < echoed.length) && is_array(echoed[echoed.length-1]) && (echoed[echoed.length-1] === echoed[echoed.length-2])) echoed.pop();
            }
            if (is_break) break;
            else if (is_continue) continue;
        }
        if ($$.ctx) $arg.ind.new_ctx(false);
        $$.brk = brk;
        $$.cont = cont;
    }
    return echoed;
}

async function while_end($arg, v, $$)
{
    var i, n, ans, echoed = [],
        brk, is_break = false,
        cont, is_continue = false,
        statements = $arg.statements;
    echoed.$scilitevarargout$ = true;
    $$ = $$ || {};
    //$$.ctx = $$.ctx || {ans:null};
    brk = $$.brk;
    cont = $$.cont;
    $$.brk = function() {is_break = true;};
    $$.cont = function() {is_continue = true;};
    while (TRUE(await vale($arg.cond, v, $$)))
    {
        is_break = false;
        is_continue = false;
        for (i=0,n=statements.length; i<n; ++i)
        {
            ans = await vale(statements[i], v, $$, null, echoed);
            if (is_break || is_continue) break;
            if (/*null != ans*/ $$.ctx) $$.ctx.ans = ans;
            if ((1 < echoed.length) && is_array(echoed[echoed.length-1]) && (echoed[echoed.length-1] === echoed[echoed.length-2])) echoed.pop();
        }
        if (is_break) break;
        else if (is_continue) continue;
    }
    $$.brk = brk;
    $$.cont = cont;
    return echoed;
}

function def_fn(fn_def)
{
    var fn = varargout(async function(nargout) {
        var args = [].slice.call(arguments, 1),
            nargin, argin = fn_def.argin, argout,
            NameValueDefaults = fn_def.nv,
            NameValueArgs, NameValueAltArgs, AltBackup,
            $$ = {ctx:{ans:null}, "@fn":merge({}, (fn_def["@fns"]||[]).concat(fn_def["@fn"]||{}))},
            is_return = false, ans,
            i, nexti = -1, a, arg, n;

        if (NameValueDefaults)
        {
            argin = argin.filter(function(arg) {
                if (('varargin' !== arg) && NameValueDefaults.has(arg))
                {
                    // Name=Value default arguments
                    return false;
                }
                return true;
            });
            for (i=0,n=args.length; i<n; ++i)
            {
                if (is_instance(args[i], namevalue))
                {
                    NameValueArgs = args[i]; // Name=Value args present
                    break;
                }
            }
            a = args;
            args = [];
            for (i=0,n=a.length; i<n; ++i)
            {
                arg = a[i];
                if (i === nexti)
                {
                    nexti = -1;
                    continue;
                }
                else if (is_instance(arg, namevalue))
                {
                    // Name=Value arguments
                    /*NameValueArgs = arg;
                    if (NameValueAltArgs)
                    {
                        NameValueArgs.fill(NameValueAltArgs, 'defaults');
                        NameValueAltArgs = null;
                    }*/
                    continue;
                }
                else if (!NameValueArgs && is_string(arg) && (i+1 < a.length) && NameValueDefaults.has(arg))
                {
                    // older alternative "Name",Value argument pairs
                    /*if (NameValueArgs)
                    {
                        NameValueArgs.set(arg, a[i+1]);
                    }
                    else
                    {*/
                        if (!NameValueAltArgs)
                        {
                            NameValueAltArgs = {};
                            AltBackup = [];
                        }
                        NameValueAltArgs[arg] = a[i+1];
                        AltBackup.push(arg);
                        AltBackup.push(a[i+1]);
                    /*}*/
                    nexti = i+1;
                    continue;
                }
                if (NameValueAltArgs)
                {
                    // "Name",Value argument pairs are not last, push them back
                    args.push.apply(args, AltBackup);
                    NameValueAltArgs = null;
                    AltBackup = null;
                }
                args.push(arg);
            }
        }
        AltBackup = null;
        a = null;
        /* The value that nargin returns does not include optional input arguments that are not included in the function call.
        Also, nargin does not count any name-value arguments, but counts varargin args.
        */
        nargin = 0;
        for (i=0; i<argin.length; ++i)
        {
            if ('varargin' === argin[i])
            {
                // must be last
                $$.ctx.varargin = args.slice(i).map(copy); // pass by value
                $$.ctx.varargin = cellarray($$.ctx.varargin, [$$.ctx.varargin.length]);
                nargin += $$.ctx.varargin.length;
                break;
            }
            else if (i < args.length)
            {
                nargin += 1;
                $$.ctx[argin[i]] = copy(args[i]); // pass by value
            }
            else
            {
                $$.ctx[argin[i]] = null; // not set
            }
        }
        if (NameValueDefaults)
        {
            // Name=Value arguments
            if (NameValueAltArgs)
            {
                if (NameValueArgs) NameValueArgs.fill(NameValueAltArgs, 'defaults');
                else NameValueArgs = namevalue(NameValueAltArgs);
            }
            await Promise.all(NameValueDefaults.all(
            ).filter(function(name) {
                return -1 === ['varargin','varargout','nargin','nargout'].indexOf(name);
            }).map(async function(name) {
                return {name:name, value:await vale(NameValueDefaults.get(name), null, {ctx:{}})};
            })).then(function(defaults) {
                defaults.forEach(function(arg) {
                    $$.ctx[arg.name] = NameValueArgs ? copy(NameValueArgs.get(arg.name, arg.value)) : arg.value;
                });
            });
        }
        $$.retrn = function() {is_return = true;};
        $$.ctx.nargin = nargin;
        $$.ctx.nargout = nargout;
        if (fn_def.argout.length && ('varargout' === fn_def.argout[fn_def.argout.length-1]))
        {
            $$.ctx.varargout = cellarray(array(100, null), [100]); // pre-allocate a large array
        }
        if (1 === fn_def.body.length)
        {
            ans = await vale(fn_def.body[0], null, $$);
        }
        else
        {
            for (i=0,n=fn_def.body.length; i<n; ++i)
            {
                await vale(fn_def.body[i], null, $$);
                if (is_return) break;
            }
        }
        if (fn_def.argout.length)
        {
            if ('' === fn_def.name)
            {
                // anonymous function
                argout = ans && ans.$scilitevarargout$ ? ans : [ans];
            }
            else
            {
                argout = array(nargout, function(i) {
                    if (('varargout' === fn_def.argout[fn_def.argout.length-1]) && (i >= fn_def.argout.length-1))
                    {
                        return $$.ctx.varargout[i-(fn_def.argout.length-1)];
                    }
                    else
                    {
                        return (i < fn_def.argout.length) && HAS.call($$.ctx, fn_def.argout[i]) ? $$.ctx[fn_def.argout[i]] : null;
                    }
                });
            }
            return 1 === nargout ? argout[0] : argout;
        }
        return null;
    });
    fn.fname = fn_def.name; // fn.name is read-only
    fn.nargin = fn_def.argin.length;
    return fn;
}

variable = function(ctx, v, i, b) {
    var self = this;
    if (!is_instance(self, variable)) return new variable(ctx, v, i, b);
    self.ctx = ctx; // current context
    self.v = v; // variable name or value
    self.i = i; // any indexing applied
    self.b = b || '()'; // type of bracket indexing
};
variable.prototype = {
    constructor: variable,
    ctx: null,
    _ctx: null,
    v: null,
    i: null,
    b: null,
    ln: null,
    new_ctx: function(new_ctx) {
        var self = this;
        if (new_ctx)
        {
            self._ctx = self.ctx;
            self.ctx = new_ctx;
        }
        else if (self._ctx)
        {
            self.ctx = self._ctx;
            self._ctx = null;
        }
        return self;
    },
    get: function(type) {
        var self = this, val, s, i;
        if ('' === self.v)
        {
            return null; // dummy variable, ignored
        }
        else if (is_instance(self.v, expr))
        {
            val = vale(self.v, null, {ctx:self.ctx});
        }
        else if (is_array(self.v))
        {
            val = self.v[0];
        }
        else
        {
            if (!HAS.call(self.ctx, self.v) && !HAS.call(constant, self.v))
            {
                throw 'undefined variable "'+self.v+'"' + (self.ln ? "\nat: " + self.ln : "");
            }
            val = HAS.call(self.ctx, self.v) ? self.ctx[self.v] : constant[self.v];
        }
        if ((true !== type) && (null != self.i))
        {
            return is_instance(val, Promise) ? val.then(function(val) {return get_val(self, val, 'ref' === type);}) : get_val(self, val, 'ref' === type);
        }
        return val;
    },
    set: async function(value) {
        var self = this, val, s, i, iscell, dtype, dtypev;
        if ('' === self.v)
        {
            return self; // dummy variable, ignored
        }
        else if (null != self.i)
        {
            if (is_instance(self.v, expr))
            {
                val = await vale(self.v, null, {ctx:self.ctx});
                s = size(val);
            }
            else if (is_array(self.v))
            {
                val = self.v[0];
                s = size(val);
            }
            else
            {
                if (!HAS.call(self.ctx, self.v))
                {
                    val = self.ctx[self.v] = []; // dummy empty array
                    s = [0, 0];
                }
                else
                {
                    val = self.ctx[self.v];
                    s = size(val);
                }
            }
            if (is_array(val))
            {
                iscell = is_cell(val);
                i = await Promise.all(self.i.map(function(ind, i) {
                    return vale(ind, {end:1 === self.i.length ? prod(s) : s[i]}, {ctx:self.ctx});
                }));
                if (!iscell && val.length && !i.filter(function(i) {return ':' !== i;}).length)
                {
                    dtype = data_type(val);
                    dtypev = data_type(is_instance(value, tensorview) ? (is_cell(value.data) ? value.data[0] : value.data) : (is_cell(value) ? value[0] : value));
                    if (('' === dtypev) || (dtype !== dtypev))
                    {
                        throw ('incompatible array data type ("'+dtype+'") with value data type' + (dtypev.length ? ' ("'+dtypev+'")' : ''));
                    }
                }
                val = set.apply(set, [val, !s[0] || iscell ? self.b : '()'].concat(i).concat([value]));
            }
            else
            {
                if (is_instance(value, tensorview))
                {
                    value = value.data.$scilitecell$ ? cellarray(value.toNDArray(), value.shape()) : (value.toNDArray());
                }
                val = value;
            }
        }
        else
        {
            if (is_instance(value, tensorview))
            {
                value = value.data.$scilitecell$ ? cellarray(value.toNDArray(), value.shape()) : (value.toNDArray());
            }
            val = value;
        }
        if (is_string(self.v))
        {
            self.ctx[self.v] = val; // may change shape etc.., so store again
        }
        else if (is_array(self.v))
        {
            self.v = [val];
        }
        return self;
    },
    isset: function() {
        return is_array(this.v) || (is_string(this.v) && HAS.call(this.ctx, this.v));
    },
    isByRef: function() {
        return (null == this.i);
    }
};
function get_val(self, val, as_view)
{
    if (is_array(val))
    {
        var s = size(val);
        return Promise.all(self.i.map(function(ind, i) {
            return vale(ind, {end:1 === self.i.length ? prod(s) : s[i]}, {ctx:self.ctx});
        })).then(function(i) {
            return get.apply(get, [as_view ? self : val, !s[0] || is_cell(val) ? self.b : '()'].concat(i));
        });
    }
    return val;
}
async function val(x, ln)
{
    if (is_instance(x, variable))
    {
        var _ln = x.ln, v;
        x.ln = ln || _ln;
        v = await x.get();
        x.ln = _ln;
        return v;
    }
    return x;
}

expr = function(op, arg, ln) {
    var self = this;
    if (!is_instance(self, expr)) return new expr(op, arg, ln);
    if (null == arg)
    {
        arg = op;
        op = '';
    }
    self.op = op;
    self.arg = arg;
    self.ln = ln;
};
expr.prototype = {
    constructor: expr,
    op: null,
    arg: null,
    ln: null
};

var NL_RE = /\r\n|\r|\n/g, NL = '\n';
function parse(s, ctx, lineStart, posStart)
{
    s = s.replace(NL_RE, NL); // normalize newlines
    var i = 0, l = 0, j, t = s, lines = t.split(NL), fns = [];

    function line(ln)
    {
        if (null == ln) ln = l;
        return lines[ln];
    }
    function error(msg, pos, ln)
    {
        if (null == ln) ln = l;
        if (null == pos) pos = i;
        msg = String(msg) + ' at line ' + String((lineStart||0)+ln) + ' position ' + String((posStart||0)+pos) + ':';
        return (msg + "\n" + (line(ln)||'') + "\n" + (new Array(pos+1)).join(' ') + '^' + "\n");
    }

    function parse_until(expected)
    {
        var match, m, n, c,
            op, term, arg,
            tmp, tmp2, ln,
            terms = [], ops = [],
            statements = [];

        function merge(up_to_end)
        {
            // generalized shunting-yard algorithm
            if (!ops.length) return;
            var o, op, opc,
                o2, op2, opc2,
                result, args;
            if (up_to_end)
            {
                var oops = ops.slice(), tterms = terms.slice();
                while (0 < ops.length)
                {
                    o2 = ops.shift();
                    op2 = o2[0];
                    opc2 = OP[op2];

                    if (up_to_end === opc2.breakpoint)
                    {
                        ops.unshift(o2);
                        break;
                    }
                    if ((0 < ops.length) && ((OP[ops[0][0]].arityalt || OP[ops[0][0]].arity) > 1) && (opc2.arity > terms.length-1))
                    {
                        if ((null != opc2.arityalt) && (opc2.arityalt <= terms.length-1))
                        {
                            args = terms.splice(0, opc2.arityalt).reverse();
                        }
                        else
                        {
                            throw error('invalid or missing argument for "'+op2+'"', o2[1], o2[2]);
                        }
                    }
                    else if (opc2.arity > terms.length)
                    {
                        if ((null != opc2.arityalt) && (opc2.arityalt <= terms.length))
                        {
                            args = terms.splice(0, opc2.arityalt).reverse();
                        }
                        else
                        {
                            throw error('invalid or missing argument for "'+op2+'"', o2[1], o2[2]);
                        }
                    }
                    else
                    {
                        args = terms.splice(0, opc2.arity).reverse();
                    }
                    result = expr(opc2.fn, args, args[0] ? args[0].ln : null);
                    terms.unshift(result);
                }
            }
            else
            {
                o = ops.shift();
                op = o[0];
                opc = OP[op];
                if (POSTFIX === opc.fixity)
                {
                    // postfix assumed to be already in correct order,
                    // no re-structuring needed
                    if (opc.arity > terms.length)
                    {
                        if ((null != opc.arityalt) && (opc.arityalt <= terms.length))
                        {
                            args = terms.splice(0, opc.arityalt).reverse();
                        }
                        else
                        {
                            throw error('invalid or missing argument for "'+op+'"', o[1], o[2]);
                        }
                    }
                    else
                    {
                        args = terms.splice(0, opc.arity).reverse();
                    }
                    result = expr(opc.fn, args, args[0] ? args[0].ln : null);
                    terms.unshift(result);
                }
                else if (PREFIX === opc.fixity)
                {
                    // prefix assumed to be already in reverse correct order,
                    // just push to op queue for later re-ordering
                    ops.unshift(o);
                }
                else //if (INFIX === opc.fixity)
                {
                    while (0 < ops.length)
                    {
                        o2 = ops[0];
                        op2 = o2[0];
                        opc2 = OP[op2];

                        if (
                            (opc2.priority < opc.priority ||
                            (opc2.priority === opc.priority &&
                            (opc2.associativity < opc.associativity ||
                            (opc2.associativity === opc.associativity &&
                            LEFT === opc2.associativity))))
                        )
                        {
                            if ((1 < ops.length) && ((OP[ops[1][0]].arityalt || OP[ops[1][0]].arity) > 1) && (opc2.arity > terms.length-1))
                            {
                                if ((null != opc2.arityalt) && (opc2.arityalt <= terms.length-1))
                                {
                                    args = terms.splice(0, opc2.arityalt).reverse();
                                }
                                else
                                {
                                    throw error('invalid or missing argument for "'+op2+'"', o2[1], o2[2]);
                                }
                            }
                            else if (opc2.arity > terms.length)
                            {
                                if ((null != opc2.arityalt) && (opc2.arityalt <= terms.length))
                                {
                                    args = terms.splice(0, opc2.arityalt).reverse();
                                }
                                else
                                {
                                    throw error('invalid or missing argument for "'+op2+'"', o2[1], o2[2]);

                                }
                            }
                            else
                            {
                                args = terms.splice(0, opc2.arity).reverse();
                            }
                            result = expr(opc2.fn, args, args[0] ? args[0].ln : null);
                            terms.unshift(result);
                            ops.shift();
                        }
                        else
                        {
                            break;
                        }
                    }
                    ops.unshift(o);
                }
            }
        }

        function end(and_reset, not_echoed)
        {
            merge(true);
            if ((1 < terms.length) || (0 < ops.length))
            {
                throw error('mismatched terms and operators', ops.length ? ops[0][1] : i, ops.length ? ops[0][2] : l);
            }
            if (true === and_reset)
            {
                if (is_instance(terms[0], expr)) statements.push(not_echoed ? expr('not_echoed', terms[0]) : terms[0]);
                terms = [];
                ops = [];
            }
        }

        function can_merge()
        {
            return ops.reduce(function(used_terms, op) {
                var opc = OP[op[0]];
                return used_terms + ((opc.arity > terms.length-used_terms) && (null != opc.arityalt) ? opc.arityalt : opc.arity);
            }, 0) <= terms.length;
        }

        function eat(pattern, group)
        {
            var match = pattern.test ? s.match(pattern) : (pattern === s.slice(0, pattern.length)), offset;
            if (match)
            {
                if (false === group)
                {
                    return pattern.test ? match : [pattern, pattern];
                }
                if (pattern.test) // regexp
                {
                    offset = match[group || 0].length;
                    s = s.slice(offset);
                    i += offset;
                    return match;
                }
                else // string
                {
                    offset = pattern.length;
                    s = s.slice(offset);
                    i += offset;
                    return [pattern, pattern];
                }
            }
            return false;
        }

        /*function findmatching(close, open, skipstring)
        {
            var c, j = 0, k = 0, t;
            while (j < s.length)
            {
                c = s.charAt(j);
                if (skipstring && ('"' === c || "'" === c))
                {
                    // string, skip
                    j = string_literal(c, false, j+1)[1];
                    continue;
                }
                if (open === c)
                {
                    ++k;
                }
                else if (close === c)
                {
                    if (0 === k) break;
                    --k;
                }
                ++j;
            }
            return k || (j >= s.length) ? -1 : j;
        }*/

        function string_literal(q, eat, j0)
        {
            var c, j = j0 || 0, r = '';
            while (j < s.length)
            {
                c = s.charAt(j);
                if (q === c)
                {
                    if ((j+1 < s.length) && (q === s.charAt(j+1)))
                    {
                        r += c;
                        j += 2;
                    }
                    else
                    {
                        break;
                    }
                }
                else
                {
                    r += c;
                    j += 1;
                }
            }
            if (eat)
            {
                s = s.slice(j+1);
                i += j+1;
            }
            return [r, j+1];
        }

        function array_literal(brackets)
        {
            brackets = brackets || '[]';
            var arg, entry, ln = line();
            if ('{}' === brackets)
            {
                eat('{');
                eat(/^[ \t\v\f]+/);
                arg = [];
                for (;;)
                {
                    entry = parse_until(',;}');
                    if (entry)
                    {
                        arg.push(entry);
                    }
                    if (eat(","))
                    {
                        if (entry) arg.push(expr(','));
                    }
                    else if (eat(";"))
                    {
                        if (entry) arg.push(expr(';'));
                    }
                    else
                    {
                        break;
                    }
                }
                eat(/^[ \t\v\f]+/);
                if (!eat('}')) throw error('mismatched curly brackets');
            }
            else
            {
                eat('[');
                eat(/^[ \t\v\f]+/);
                arg = [];
                for (;;)
                {
                    entry = parse_until(' ,\n;]');
                    if (entry)
                    {
                        arg.push(entry);
                    }
                    if (eat(","))
                    {
                        arg.push(expr(','));
                        eat(/^[ \t\v\f]+/);
                    }
                    else if (eat(";"))
                    {
                        arg.push(expr(';'));
                        eat(/^[ \t\v\f]+/);
                    }
                    else if (eat("\n"))
                    {
                        arg.push(expr(';'));
                        ++l;
                        i = 0;
                        eat(/^[ \t\v\f]+/);
                    }
                    else if (eat(/^[ \t\v\f]+/))
                    {
                        if (entry && !eat(/^[,;\n\]]/, false))
                        {
                            arg.push(expr(','));
                        }
                    }
                    else
                    {
                        break;
                    }
                }
                eat(/^[ \t\v\f]+/);
                if (!eat(']')) throw error('mismatched brackets');
            }
            return expr(OP[brackets].fn, arg, ln);
        }

        while (0 < s.length)
        {
            if (eat(/^if\b/))
            {
                end(true);
                ln = line();
                tmp = parse_until("\n,");
                if (!tmp) throw error('missing or invalid condition in "if"');
                if (eat("\n"))
                {
                    ++l;
                    i = 0;
                }
                else
                {
                    eat(',');
                }
                arg = {'if':{cond:tmp,statements:[]},'elseif':[],'else':{statements:[]}};
                term = arg['if'];
                for (;;)
                {
                    tmp = parse_until(['elseif','else','end']);
                    if (tmp) term.statements = term.statements.concat(tmp);
                    if (eat('elseif'))
                    {
                        tmp = parse_until("\n,");
                        if (!tmp) throw error('missing or invalid condition in "elseif"');
                        if (eat("\n"))
                        {
                            ++l;
                            i = 0;
                        }
                        else
                        {
                            eat(',');
                        }
                        arg['elseif'].push({cond:tmp, statements:[]});
                        term = arg['elseif'][arg['elseif'].length-1];
                    }
                    else if (eat('else'))
                    {
                        eat(/^[ \t\v\f]+/);
                        if (eat("\n"))
                        {
                            ++l;
                            i = 0;
                        }
                        else
                        {
                            eat(',');
                        }
                        term = arg['else'];
                    }
                    else if (eat('end') || !tmp)
                    {
                        eat(/^[ \t\v\f]*;/); // eat any trailing ';'
                        break;
                    }
                }
                statements.push(expr(if_end, arg, ln));
                continue;
            }
            if (eat(/^for\b/))
            {
                end(true);
                ln = line();
                if (match = eat(/^[ \t\v\f]+([_a-z][_a-z0-9]*)[ \t\v\f]*=[ \t\v\f]*/i))
                {
                    // pass
                }
                else
                {
                    throw error('missing or invalid declaration in "for"');
                }
                tmp = parse_until("\n,;");
                if (!tmp) throw error('missing or invalid declaration in "for"');
                if (eat("\n"))
                {
                    ++l;
                    i = 0;
                }
                else
                {
                    eat(',') || eat(';');

                }
                arg = {ind:variable(ctx, match[1]),val:tmp,statements:[]};
                for (;;)
                {
                    tmp = parse_until(['end']);
                    if (tmp) arg.statements = arg.statements.concat(tmp);
                    if (eat('end') || !tmp)
                    {
                        eat(/^[ \t\v\f]*;/); // eat any trailing ';'
                        break;
                    }
                }
                statements.push(expr(for_end, arg, ln));
                continue;
            }
            if (eat(/^while\b/))
            {
                end(true);
                ln = line();
                tmp = parse_until("\n,;");
                if (!tmp) throw error('missing or invalid condition in "while"');
                if (eat("\n"))
                {
                    ++l;
                    i = 0;
                }
                else
                {
                    eat(',') || eat(';');
                }
                arg = {cond:tmp,statements:[]};
                for (;;)
                {
                    tmp = parse_until(['end']);
                    if (tmp) arg.statements = arg.statements.concat(tmp);
                    if (eat('end') || !tmp)
                    {
                        eat(/^[ \t\v\f]*;/); // eat any trailing ';'
                        break;
                    }
                }
                statements.push(expr(while_end, arg, ln));
                continue;
            }
            if (eat(/^function\b/))
            {
                end(true);
                eat(/^[ \t\v\f]+/);
                arg = {argout:null, name:null, argin:null, nv:null, "@fns":fns.slice().reverse(), "@fn":{}, body:[]};
                if (match = eat(/^([_a-z][_a-z0-9]*)[ \t\v\f]*=[ \t\v\f]*/i))
                {
                    // single output
                    arg.argout = [match[1]];
                }
                else if (match = eat(/^\[[ \t\v\f]*([_a-z][_a-z0-9]*(?:[ \t\v\f]*,[ \t\v\f]*[_a-z][_a-z0-9]*)*)[ \t\v\f]*\][ \t\v\f]*=[ \t\v\f]*/i))
                {
                    // multiple output
                    arg.argout = match[1].split(',').map(function(v) {return v.trim();});
                }
                else
                {
                    // no output
                    arg.argout = [];
                }
                //if (match = eat(/^([_a-z][_a-z0-9]*)(?:[ \t\v\f]*\(([ \t\v\f]*([_a-z][_a-z0-9]*(?:[ \t\v\f]*,[ \t\v\f]*[_a-z][_a-z0-9]*)*)?[ \t\v\f]*)\))?/i))
                if (match = eat(/^([_a-z][_a-z0-9]*)([ \t\v\f]*\()?/i))
                {
                    arg.name = match[1];
                    //arg.argin = match[2] ? match[2].split(',').map(function(v) {return v.trim();}) : [];
                    arg.argin = [];
                    if (match[2])
                    {
                        for (;;)
                        {
                            eat(/^[ \t\v\f]*/);
                            if (match = eat(/^[_a-z][_a-z0-9]*/i))
                            {
                                arg.argin.push(match[0]);
                                if (eat(/^[ \t\v\f]*=/))
                                {
                                    // Name=Value default arg
                                    tmp = parse_until(',)');
                                    if (is_instance(tmp, expr))
                                    {
                                        if (!arg.nv) arg.nv = namevalue();
                                        arg.nv.set(match[0], tmp);
                                    }
                                    else throw error('missing or invalid Name=Value function argument');
                                }
                                eat(/^[ \t\v\f]*/);
                                if (!eat(',')) break;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    eat(/^[ \t\v\f]*/);
                    if (!eat(')')) throw error('missing or invalid function declaration');
                }
                else
                {
                    throw error('missing or invalid function declaration');
                }
                fns.unshift(arg["@fn"]); // storage for internal functions to this function
                for (;;)
                {
                    tmp = parse_until(['end']);
                    if (tmp) arg.body = arg.body.concat(tmp);
                    if (eat('end') || !tmp)
                    {
                        eat(/^[ \t\v\f]*;/); // eat any trailing ';'
                        break;
                    }
                }
                fns.shift();
                if (fns.length) fns[0][arg.name] = def_fn(arg); // internal/local function
                else $["@fn"][arg.name] = def_fn(arg); // global function
                continue;
            }
            if (match = eat(/^(return|continue|break|elseif|else|end)\b/, false))
            {
                if (expected && (-1 < expected.indexOf(match[1])))
                {
                    break;
                }
                else if ('return' === match[1])
                {
                    eat('return');
                    eat(/^[ \t\v\f]*;/); // eat any trailing ';'
                    statements.push(expr('return', '', line()));
                    continue;
                }
                else if ('continue' === match[1])
                {
                    eat('continue');
                    eat(/^[ \t\v\f]*;/); // eat any trailing ';'
                    statements.push(expr('continue', '', line()));
                    continue;
                }
                else if ('break' === match[1])
                {
                    eat('break');
                    eat(/^[ \t\v\f]*;/); // eat any trailing ';'
                    statements.push(expr('break', '', line()));
                    continue;
                }
                else if ('end' === match[1])
                {
                    eat('end');
                    terms.unshift(expr('v', variable(ctx, 'end'), line()));
                    continue;
                }
                else
                {
                    throw error('unexpected "' + match[1] + '"');
                }
            }
            if (eat("..."))
            {
                // continue line
                eat(/^[ \t\v\f]+/);
                if (eat("\n"))
                {
                    // new line
                    ++l;
                    i = 0;
                    eat(/^[ \t\v\f]+/);
                }
                continue;
            }
            if (eat(";", false))
            {
                if (expected && (-1 < expected.indexOf(";")))
                {
                    break;
                }
                else
                {
                    // statement end
                    eat(";");
                    // new statement
                    end(true, 'not_echoed');
                    continue;
                }
            }
            if (eat(",", false))
            {
                if (expected && (-1 < expected.indexOf(',')))
                {
                    break;
                }
                else
                {
                    // alternative statement end
                    eat(",");
                    // new statement
                    end(true);
                    continue;
                }
            }
            if (eat("\n", false))
            {
                if (expected && (-1 < expected.indexOf("\n")))
                {
                    break;
                }
                else
                {
                    // line end
                    eat("\n");
                    // new line
                    ++l;
                    i = 0;
                    // new statement
                    end(true);
                    continue;
                }
            }
            if (eat(/^[ \t\v\f]+/, false))
            {
                if (expected && (-1 < expected.indexOf(' ')) && terms.length && !eat(/^[ \t\v\f]+(&&|\|\||&|\||xor\b|>=|<=|==|~=|>|<|=|\+|-\s|\.\*|\*|\.\/|\/|\\|\.\^|\^)/, false) && can_merge())
                {
                    // space expected that separates a complete expression
                    //eat(/^[ \t\v\f]+/); // consume it
                    break;
                }
                else
                {
                    // space
                    eat(/^[ \t\v\f]+/);
                    continue;
                }
            }
            if (match = eat('%'))
            {
                // line comment
                j = s.indexOf("\n");
                s = s.slice(-1 < j ? j+1 : s.length);
                if (-1 < j) ++l;
                i = 0;
                end(true);
                continue;
            }
            if (match = eat('{%'))
            {
                // block comment
                j = s.indexOf("%}");
                if (-1 === j) j = s.length;
                tmp = s.slice(0, j+2);
                s = s.slice(j+2);
                l += tmp.split("\n").length-1;
                i = 0;
                end(true);
                continue;
            }
            if ((match = eat("'")) || (match = eat('"')))
            {
                // string
                term = string_literal(match[0], true)[0];
                terms.unshift(expr("'" === match[0] ? term.split('') : term, null, line()));
                continue;
            }
            if (match = eat(/^(&&|\|\||&|\|)[^&\|]/, 1))
            {
                // logical/bitwise and/or
                op = match[1];
                ops.unshift([op, i, l]);
                merge();
                continue;
            }
            if (match = eat(/^(xor)[^a-zA-Z]/, 1))
            {
                // logical xor
                op = match[1];
                ops.unshift([op, i, l]);
                merge();
                continue;
            }
            if (match = eat(/^(>=|<=|==|~=|>|<)[^<>=]/, 1))
            {
                // relational op
                op = match[1];
                ops.unshift([op, i, l]);
                merge();
                continue;
            }
            if (match = eat("~"))
            {
                if (eat(/^([ \t\v\f]*)[,\]\)]/, 1))
                {
                    // dummy variable
                    terms.unshift(expr('v', variable(ctx, ''), line()));
                }
                else
                {
                    // logical not
                    ops.unshift(["~", i, l]);
                    merge();
                }
                continue;
            }
            if (match = eat('='))
            {
                // set or name=value function arg
                ops.unshift([expected && (-1 < expected.indexOf(')')) ? '(=)' : '=', i, l]);
                merge();
                continue;
            }
            if (match = eat(/^(\+|-|\.\*|\*|\.\/|\/|\\|\.\^|\^)/i))
            {
                // +,-,*,/,^ op
                op = match[0];
                ops.unshift([op, i, l]);
                merge();
                continue;
            }
            if (match = eat(/^[_a-z][_a-z0-9]*/i))
            {
                m = match[0];
                arg = null;
                if ("true" === m)
                {
                    term = expr(I, null, line());
                }
                else if ("false" === m)
                {
                    term = expr(O, null, line());
                }
                else if (match = eat(expected && (-1 < expected.indexOf(' ')) ? /^([\(\{])/ : /^[ \t\v\f]*([\(\{])/))
                {
                    ln = line();
                    if ('{' === match[1])
                    {
                        // cell array indexing
                        arg = [];
                        for (;;)
                        {
                            tmp = parse_until(',}');
                            if (tmp) arg.push(tmp);
                            if (!eat(',')) break;
                        }
                        if (!eat('}')) throw error("mismatched curly brackets");
                        term = expr('v', variable(ctx, m, arg, '{}'), ln);
                    }
                    else if (eat(/^[ \t\v\f]*\:[ \t\v\f]*\)/))
                    {
                        // variable single colon
                        //arg = '(:)';
                        term = expr('v', variable(ctx, m, [expr(':')]), ln);
                    }
                    else
                    {
                        // array indexing or function invocation
                        arg = [];
                        for (;;)
                        {
                            tmp = parse_until(',)');
                            if (tmp) arg.push(expr('arg', tmp));
                            if (!eat(',')) break;
                        }
                        if (!eat(')')) throw error("mismatched parentheses");
                        term = expr('v_or_f', [m, arg, ctx, '()'], ln);
                    }
                }
                else
                {
                    // variable or function
                    term = expr('v_or_f', [m, null, ctx], line());
                }
                terms.unshift(term);
                /*if ('(:)' === arg)
                {
                    ops.unshift(['(:)', i, l]);
                    merge();
                }*/
                if (match = eat(/^[ \t\v\f]*(\.?')/))
                {
                    // transpose
                    ops.unshift([match[1], i, l]);
                    merge();
                }
                continue;
            }
            if (match = eat(/^((?:-[ \t\v\f]*)?\d+(\.\d+)?([eE][+-]?\d+)?)([ij])?/))
            {
                // number
                arg = match[1].split(/\s+/).join('');
                arg = decimal ? decimal(arg) : parseFloat(arg, 10);
                term = expr(match[4] ? (new complex(0, arg)) : arg, null, line());
                terms.unshift(term);
                continue;
            }
            if (match = eat(/^((?:-[ \t\v\f]*)?\.\d+([eE][+-]?\d+)?)([ij])?/))
            {
                // number, shorthand version
                arg = match[1].split(/\s+/).join('');
                arg = '-' === arg.charAt(0) ? ('-0'+arg.slice(1)) : ('0'+arg);
                arg = decimal ? decimal(arg) : parseFloat(arg, 10);
                term = expr(match[4] ? (new complex(0, arg)) : arg, null, line());
                terms.unshift(term);
                continue;
            }
            ln = line();
            c = s.charAt(0);
            if ('@' === c)
            {
                // function handle
                if (match = eat(/^@\(([ \t\v\f]*[_a-z][_a-z0-9]*(?:[ \t\v\f]*,[ \t\v\f]*[_a-z][_a-z0-9]*)*[ \t\v\f]*)\)/i))
                {
                    // anonymous function
                    arg = {argout:['*'], name:'', argin:match[1].split(',').map(function(s) {return s.trim();}), nv:null, "@fns":[], "@fn":{}, body:[]};
                    tmp = parse_until(',)]};');
                    if (tmp) arg.body = arg.body.concat(tmp);
                    terms.unshift(expr(def_fn(arg), null, ln));
                    continue;
                }
                if (match = eat(/^@([_a-z][_a-z0-9]*)/i))
                {
                    // defined function
                    m = match[1];
                    /*if (HAS.call($["@fn"], m) && is_callable($["@fn"][m]))
                    {
                        // user-defined function handle
                        terms.unshift(expr($["@fn"][m], null, ln));
                    }
                    else if (HAS.call(fn, m) && is_callable(fn[m]))
                    {
                        // builtin function handle
                        terms.unshift(expr(fn[m], null, ln));
                    }
                    else
                    {
                        throw error('"'+m+'" is not a defined function');
                    }*/
                    terms.unshift(expr('fh', m, ln));
                    continue;
                }
            }
            if ('[' === c)
            {
                // bracket, literal array
                term = array_literal('[]');
                if (term)
                {
                    terms.unshift(term);
                    if (match = eat(/^[ \t\v\f]*(\.?')/))
                    {
                        // transpose
                        ops.unshift([match[1], i, l]);
                        merge();
                    }
                }
                continue;
            }
            if (']' === c)
            {
                if (expected && (-1 < expected.indexOf(']')))
                {
                    // end bracket
                    break;
                }
                throw error('mismatched brackets');
            }
            if ('{' === c)
            {
                // curly bracket
                if (terms.length && can_merge())
                {
                    s = s.slice(1);
                    i += 1;
                    merge('set');
                    term = terms.shift();
                    arg = [];
                    for (;;)
                    {
                        tmp = parse_until(',}');
                        if (tmp) arg.push(tmp);
                        if (!eat(',')) break;
                    }
                    if (!eat('}')) throw error("mismatched curly brackets");
                    // de-referencing cell array indexing
                    if (arg.length) term = expr('v', variable(ctx, term, arg, '{}'), ln);
                }
                else
                {
                    // literal cell array
                    term = array_literal('{}');
                }
                if (term)
                {
                    terms.unshift(term);
                    if (match = eat(/^[ \t\v\f]*(\.?')/))
                    {
                        // transpose
                        ops.unshift([match[1], i, l]);
                        merge();
                    }
                }
                continue;
            }
            if ('}' === c)
            {
                if (expected && (-1 < expected.indexOf('}')))
                {
                    // end curly bracket
                    break;
                }
                throw error('mismatched curly brackets');
            }
            if ('(' === c)
            {
                // paren
                s = s.slice(1);
                i += 1;
                /*if (eat(/^[ \t\v\f]*\:[ \t\v\f]*\)/))
                {
                    // single colon
                    ops.unshift(['(:)', i, l]);
                    merge();
                }
                else
                {*/
                    if (terms.length && can_merge())
                    {
                        merge('set');
                        term = terms.shift();
                        arg = [];
                        for (;;)
                        {
                            tmp = parse_until(',)');
                            if (tmp) arg.push(expr('arg', tmp));
                            if (!eat(',')) break;
                        }
                        if (!eat(')')) throw error("mismatched parentheses");
                        // de-referencing array indexing or function invocation
                        if (arg.length) term = expr('v_or_f', [term, arg, ctx, '()'], ln);
                    }
                    else
                    {
                        // parenthesized expression
                        term = parse_until(')');
                        if (!eat(')')) throw error("mismatched parentheses");
                    }
                    if (term)
                    {
                        terms.unshift(term);
                        if (match = eat(/^[ \t\v\f]*(\.?')/))
                        {
                            // transpose
                            ops.unshift([match[1], i, l]);
                            merge();
                        }
                    }
                /*}*/
                continue;
            }
            if (')' === c)
            {
                if (expected && (-1 < expected.indexOf(')')))
                {
                    // end paren
                    break;
                }
                throw error('mismatched parentheses');
            }
            if (':' === c)
            {
                // colon
                if (expected && (-1 < expected.indexOf(':'))) break;
                s = s.slice(1);
                i += 1;
                tmp = [i, l];
                merge('set');
                if (terms.length)
                {
                    arg = 1;
                }
                else
                {
                    arg = 0;
                    terms.unshift(expr(':', null, ln));
                }
                for (;;)
                {
                    term = parse_until(':,;]})\n');
                    eat(/^[ \t\v\f]+/);
                    if (term) {terms.unshift(term); ++arg;}
                    else if (eat(':', false)) terms.unshift(expr(':', null, ln));
                    if (!eat(':')) break;
                }
                if (1 < arg)
                {
                    ops.unshift([3 === arg ? '::' : ':', tmp[0], tmp[1]]);
                    merge();
                }
                //if (expected) break;
                //else continue;
                continue;
            }
            throw error(expected ? ('missing expected "' + (is_string(expected) ? expected.split('') : expected).join('" or "') + '"') : ('unexpected "' + c + '"'));
        }
        end(true);
        return 0 === statements.length ? null : (1 === statements.length ? statements[0] : statements);
    }
    return parse_until(false);
}

async function v_or_f(e, v, $$, vf2v)
{
    var ctx, n, arg, ret;
    /*if ('v_or_f' === e.op)
    {*/
        // variable or function
        if ((true === vf2v) && is_string(e.arg[0]))
        {
            // default cast to variable
            e = expr('v', variable(e.arg[2], e.arg[0], e.arg[1] && e.arg[1].length ? e.arg[1] : null, e.arg[3]), e.ln);
        }
        else
        {
            ctx = $$ && $$.ctx ? $$.ctx : e.arg[2];
            n = e.arg[0];
            arg = e.arg[1];
            if (is_instance(n, expr))
            {
                ret = await evaluate(n, v, $$);
                if (!is_callable(ret)) ret = [ret];
            }
            else
            {
                if (is_obj(v) && HAS.call(v, n))
                {
                    ret = n;
                }
                else if (HAS.call(ctx, n))
                {
                    ret = is_callable(ctx[n]) ? ctx[n] : n;
                }
                else if ($$ && $$["@fn"] && HAS.call($$["@fn"], n) && is_callable($$["@fn"][n]))
                {
                    ret = $$["@fn"][n];
                    arg = arg || []; // support function call without ()
                }
                else if (HAS.call($["@fn"], n) && is_callable($["@fn"][n]))
                {
                    ret = $["@fn"][n];
                    arg = arg || []; // support function call without ()
                }
                else if (HAS.call(constant, n))
                {
                    ret = n;
                }
                else if (HAS.call(fn, n) && is_callable(fn[n]))
                {
                    ret = fn[n];
                    arg = arg || []; // support function call without ()
                }
                else
                {
                    ret = n;
                }
            }
            if (is_callable(ret))
            {
                // function
                e = expr(ret, arg);
            }
            else
            {
                // variable
                e = expr('v', variable(e.arg[2], ret, arg && arg.length ? arg : null, e.arg[3]));
            }
        }
    /*}*/
    return e;
}
async function evaluate(e, v, $$, vf2v)
{
    var f, argout, nargout, tmp, tmpe, n, arg, ctx, ret;
    if (is_instance(e, expr))
    {
        if ('not_echoed' === e.op)
        {
            return await evaluate(e.arg, v, $$, vf2v);
        }
        if ('arg' === e.op)
        {
            // argument, delegate
            e = e.arg;
            if ((OP['(=)'].fn !== e.op) && $$ && $$.nv) $$.nv = null; // reset namevalue if needed
        }
        if ('v_or_f' === e.op)
        {
            e = await v_or_f(e, v, $$, vf2v);
        }
        if ('' === e.op)
        {
            // value
            return e.arg;
        }
        else if ('fh' === e.op)
        {
            // function handle
            n = e.arg;
            if ($$ && $$["@fn"] && HAS.call($$["@fn"], n) && is_callable($$["@fn"][n]))
            {
                return $$["@fn"][n];
            }
            else if (HAS.call($["@fn"], n) && is_callable($["@fn"][n]))
            {
                return $["@fn"][n];
            }
            else if (HAS.call(fn, n) && is_callable(fn[n]))
            {
                return fn[n];
            }
            throw '"'+n+'" is not a defined function' + (e.ln ? "\nat: " + e.ln : "");
        }
        else if ('v' === e.op)
        {
            // variable
            if ($$ && $$.ctx) e.arg.new_ctx($$.ctx); // local context
            if (false === v)
            {
                ret = e.arg;
            }
            else
            {
                ret = is_obj(v) && is_string(e.arg.v) && HAS.call(v, e.arg.v) ? v[e.arg.v] : await val(e.arg, e.ln);
            }
            if ($$ && $$.ctx) e.arg.new_ctx(false); // restore context
            return ret;
        }
        else if (if_end === e.op)
        {
            // if .. else .. elseif .. end
            return await if_end(e.arg, v, $$);
        }
        else if (for_end === e.op)
        {
            // for .. end loop
            return await for_end(e.arg, v, $$);
        }
        else if (while_end === e.op)
        {
            // while .. end loop
            return await while_end(e.arg, v, $$);
        }
        else if ('break' === e.op)
        {
            if ($$ && is_callable($$.brk)) $$.brk();
            return;
        }
        else if ('continue' === e.op)
        {
            if ($$ && is_callable($$.cont)) $$.cont();
            return;
        }
        else if ('return' === e.op)
        {
            if ($$ && is_callable($$.retrn)) $$.retrn();
            return;
        }
        else if (OP['(=)'].fn === e.op)
        {
            // Name=Value arg
            $$ = $$ || {};
            $$.nv = $$.nv || namevalue(); // init namevalue if needed
            if (!is_instance($$.nv, namevalue))
            {
                throw 'invalid Name=Value argument' + (e.ln ? "\nat: " + e.ln : "");
            }
            n = await evaluate(e.arg[0], false, null, true);
            if (is_string(n))
            {
                // pass
            }
            else if (is_instance(n, variable) && is_string(n.v))
            {
                n = n.v;
            }
            else
            {
                throw 'invalid Name=Value argument' + (e.ln ? "\nat: " + e.ln : "");
            }
            try {
                ret = await e.op.apply(null, [$$.nv, n, await evaluate(e.arg[1], v, $$)]);
            } catch (err) {
                throw ((err.message || err) + (e.ln ? "\nat: " + e.ln : ""));
            }
            $$.nv = ret;
            return ret;
        }
        else if (OP['='].fn === e.op)
        {
            // set
            $$ = $$ || {};
            nargout = $$.nargout;
            argout = await evaluate(e.arg[0], false, null, true);
            if (is_array(argout) && is_instance(argout[0], variable))
            {
                $$.nargout = argout.length; // variable output
                if ($$.ctx) argout = argout.map(function(v) {return v.new_ctx($$.ctx);});
            }
            if (is_instance(argout, variable))
            {
                if ($$.ctx) argout.new_ctx($$.ctx);
            }
            tmpe = e.arg[1];
            if ('v_or_f' === tmpe.op)
            {
                tmpe = await v_or_f(tmpe, v, $$);
            }
            if (('v' === tmpe.op) && !is_instance(tmpe.arg.v, expr))
            {
                tmp = null;
                //arg = [argout, /*(e.arg[0].arg.v === e.arg[1].arg.v) ||*/ e.arg[1].arg.isByRef() ? copy(await evaluate(e.arg[1], v, $$)) : await evaluate(e.arg[1], v, $$)];
                if (is_instance(argout, variable) && ((tmpe.arg.v === argout.v) || (argout.isByRef() && tmpe.arg.isByRef())))
                {
                    // eg A(:,[1 2])=A(:,[2 1]), or A=B
                    // use copy when setting variable from itself, or other but without slicing
                    arg = [argout, copy(await evaluate(tmpe, v, $$))];
                }
                else
                {
                    // eg A(:,[1 2])=B(:,[2 1])
                    // use ref to reduce all these intermediate arrays back and forth
                    tmp = tmpe.arg;
                    arg = [argout, tmp.new_ctx($$ && $$.ctx)];
                }
                try {
                    ret = await e.op.apply(null, arg);
                } catch (err) {
                    throw ((err.message || err) + (e.ln ? "\nat: " + e.ln : ""));
                }
                if (tmp) tmp.new_ctx(false);
            }
            else
            {
                // eg A = other expr
                try {
                    ret = await e.op.apply(null, [argout, await evaluate(tmpe, v, $$)]);
                } catch (err) {
                    throw ((err.message || err) + (e.ln ? "\nat: " + e.ln : ""));
                }
            }
            $$.nargout = nargout;
            if ($$.ctx)
            {
                if (is_array(argout) && is_instance(argout[0], variable))
                {
                    argout.forEach(function(v) {v.new_ctx(false);});
                }
                if (is_instance(argout, variable))
                {
                    argout.new_ctx(false);
                }
            }
            return ret;
        }
        else if (is_callable(e.op))
        {
            // other operator/function
            $$ = $$ || {};
            f = is_int($$.nargout) && is_callable(e.op.nargout) ? e.op.nargout($$.nargout) : e.op;
            try {
                ret = await f.apply(null, await vale(e.arg, v, $$, vf2v));
            } catch (err) {
                throw ((err.message || err) + (e.ln ? "\nat: " + e.ln : ""));
            }
            return ret;
        }
    }
    throw "invalid expr";
}
async function vale(x, v, $$, vf2v, echoed)
{
    if (is_instance(x, expr))
    {
        var ans = await evaluate(x, v, $$, vf2v);
        if ((null != ans) && echoed && ('not_echoed' !== x.op)) echoed.push.apply(echoed, ans.$scilitevarargout$ ? ans : [ans]);
        return ans;
    }
    else if (is_array(x))
    {
        for (var i=0,n=x.length,y=new Array(n); i<n; ++i)
        {
            y[i] = await vale(x[i], v, $$, vf2v, echoed);
            if (echoed && (1 < echoed.length) && is_array(echoed[echoed.length-1]) && (echoed[echoed.length-1] === echoed[echoed.length-2])) echoed.pop();
        }
        return y;
    }
    return x;
}

$_.createContext = function() {
    return {ans: null};
};

$_.eval = async function(code, ctx, lineStart, cb) {
    if (!is_callable(cb)) cb = null;
    ctx = ctx || $_.createContext();
    var ast = parse(String(code), ctx, null == lineStart ? 1 : lineStart, 1),
        ans = null, ans_changed = false, echoed = [], i, n;
    if (is_array(ast))
    {
        for (i=0,n=ast.length; i<n; ++i)
        {
            if (ast[i])
            {
                ans = await vale(ast[i], null, null, null, echoed);
                if ((1 < echoed.length) && is_array(echoed[echoed.length-1]) && (echoed[echoed.length-1] === echoed[echoed.length-2])) echoed.pop();
                if ((null != ans) && cb) cb(ans);
                ans_changed = true;
            }
        }
    }
    else if (ast)
    {
        ans = await vale(ast, null, null, null, echoed);
        if ((null != ans) && cb) cb(ans);
        ans_changed = true;
    }
    if (ans_changed && (is_array(ans) || is_nan(ans) || is_scalar(ans) || is_string(ans))) ctx.ans = ans;
    return echoed;
};

// export it
return $;
});
