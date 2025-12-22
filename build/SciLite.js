/**
*
* SciLite,
* A scientific computing environment similar to Octave/Matlab in pure JavaScript
* @version: 0.9.8
* 2025-12-23 00:31:13
* https://github.com/foo123/SciLite
*
**//**
*
* SciLite,
* A scientific computing environment similar to Octave/Matlab in pure JavaScript
* @version: 0.9.8
* 2025-12-23 00:31:13
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
    update = [],
    HAS = Object.prototype.hasOwnProperty,
    toString = Object.prototype.toString,
    is_array = Array.isArray || function(o) {return '[object Array]' === toString.call(o);},
    nop = function() {},

    // lib
    $ = {
        VERSION: "0.9.8",
        // common functions
        _: {},
        // builtin functions
        fn: {},
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
        constant.eps = eps;
        constant.pi = pi;
        constant.e = e;
        constant.realmax = realmax;
        constant.realmin = realmin;
        constant.intmax = intmax;
        constant.intmin = intmin;
        constant.bitmax = bitmax;
    }
    if (complex)
    {
        i = new complex(O, I);
        ze = new complex(constant.e, O);
    }
    update.forEach(function(u) {u();});
};

// utils
function not_supported(fn)
{
    throw (String(fn) + ": input(s) not supported");
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
    return !is_complex(x) || n_eq(O, x.im);
}
$_.is_real = is_real;
function is_scalar(x, strict)
{
    if (is_number(x) || is_complex(x) || is_decimal(x)) return true;
    if (false === strict)
    {
        if (is_vector(x) && (1 === x.length)) return true;
        if (is_matrix(x) && (1 === x.length) && (1 === x[0].length)) return true;
    }
    return false;
}
$_.is_scalar = is_scalar;
function is_vector(x)
{
    return is_array(x) && is_scalar(x[0]);
}
$_.is_vector = is_vector;
function is_matrix(x)
{
    return is_array(x) && is_array(x[0]) && is_scalar(x[0][0]);
}
$_.is_matrix = is_matrix;
function is_0d(x)
{
    return !is_array(x);
}
function is_1d(x)
{
    return is_array(x) && !is_array(x[0]);
}
function is_2d(x)
{
    return is_array(x) && is_array(x[0]);
}
function array(n, v)
{
    var i, arr = new Array(n);
    for (i=0; i<n; ++i) arr[i] = is_callable(v) ? v(i, arr) : v;
    return arr;
}
$_.array = array;
function matrix(rows, cols, v)
{
    var r, c, row, mat = new Array(rows);
    for (r=0; r<rows; ++r)
    {
        mat[r] = row = new Array(cols);
        for (c=0; c<cols; ++c)
        {
            row[c] = is_callable(v) ? v(r, c, mat) : v;
        }
    }
    return mat;
}
$_.matrix = matrix;
function ndarray(d, v)
{
    return d.length ? array(d[0], function(i) {
        if (d.length > 1)
        {
            return ndarray(d.slice(1), function(j) {
                return is_callable(v) ? v([i].concat(j)) : v;
            });
        }
        return is_callable(v) ? v([i]) : v;
    }) : [];
}
$_.ndarray = ndarray;
function rowvec(n, v)
{
    return array(n, v);
}
function vec2row(vec)
{
    return is_0d(vec) ? [[vec]] : (is_1d(vec) ? [vec] : vec);
}
fn.rowvec = vec2row;
function colvec(n, v)
{
    return matrix(n, 1, v);
}
function vec2col(vec)
{
    return is_0d(vec) ? [[vec]] : (is_1d(vec) ? vec.map(function(vi) {return [vi];}) : vec);
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
    else if (is_vector(x) && (1 === x.length))
    {
        return sca(x[0], real);
    }
    else if (is_matrix(x) && (1 === x.length) && (1 === x[0].length))
    {
        return sca(x[0][0], real);
    }
    return x;
}
$_.sca = sca;
function vec(x)
{
    if (is_2d(x))
    {
        if (1 === ROWS(x)) return x[0];
        else if (1 === COLS(x)) return x.map(function(xi) {return xi[0];});
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
    return mat.length;
}
function COLS(mat)
{
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
    return ("number" === typeof x) ? x : (is_decimal(x) ? (x.$valueOf()) : (x.valueOf()));
}
function __(x)
{
    return (null != decimal) && ("number" === typeof x) ? decimal(x) : x;
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
    if (is_array(x)) x = x.map(function(xi) {return copy(xi);});
    return x;
}
$_.copy = copy;
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

function varargout(f, nargout_default)
{
    if (null == nargout_default) nargout_default = 1;
    var f_with_nargout = function(/*..args*/) {
        var args = [].slice.call(arguments), ans;
        args.unshift(nargout_default); // nargout=nargout_default
        ans = f.apply(null, args);
        if ((1 < nargout_default) && is_array(ans)) ans.$scilitevarargout$ = true;
        return ans;
    };
    f_with_nargout.nargout = function(nargout) {
        return function(/*..args*/) {
            var args = [].slice.call(arguments), ans;
            args.unshift(nargout); // nargout=nargout
            ans = f.apply(null, args);
            if ((1 < nargout) && is_array(ans)) ans.$scilitevarargout$ = true;
            return ans;
        };
    };
    return f_with_nargout;
}
$_.varargout = varargout;

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
        x = x.toFixed(4).replace(/\.0{4}$/, '');
    }
    else if (is_complex(x))
    {
        x = String(x);
    }
    return x;
}
$_.num2str = num2str;
$_.MAXPRINTSIZE = inf;
function texify(x)
{
    if (null == x)
    {
        // pass
        x = '';
    }
    else if (is_string(x))
    {
        if (-1 === (['\\cdots','\\vdots','\\ddots']).indexOf(x))
        {
            x = '\\text{' + x + '}';
        }
    }
    else if (is_nan(x))
    {
        x = '\\text{nan}';
    }
    else if (is_num(x))
    {
        x = ([eps,realmax,realmin,intmax,intmin]).reduce(function(v, c) {return v || n_eq(x, c);}, false) ? String(x) : (num2str(x).split('e').join('\\text{e}').split('nan').join('\\text{nan}').split('inf').join('\\text{inf}'));
    }
    else if (is_complex(x))
    {
        x = String(x).split('e').join('\\text{e}').split('nan').join('\\text{nan}').split('inf').join('\\text{inf}');
    }
    else if (is_matrix(x))
    {
        var use_ddots = false;
        if (COLS(x) > $_.MAXPRINTSIZE)
        {
            x = x.map(function(row) {
                return row.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat('\\cdots').concat(row.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
            });
            use_ddots = true;
        }
        if (ROWS(x) > $_.MAXPRINTSIZE)
        {
            x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat([array($_.MAXPRINTSIZE, function(i) {return stdMath.round($_.MAXPRINTSIZE/2) === i ? (use_ddots ? '\\ddots' : '\\vdots') : '\\vdots';})]).concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
        }
        x = '\\begin{bmatrix}'+ x.map(function(xi) {return xi.map(texify).join(' & \\hskip 1em ');}).join(' \\\\ ') + '\\end{bmatrix}';
    }
    else if (is_array(x))
    {
        if (x.length > $_.MAXPRINTSIZE)
        {
            x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat(['\\cdots']).concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
        }
        x = x.map(texify).join(' \\hskip 1em ');
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
                if (is_array(x[0][0]) || !is_array(x[1]) || (x[0].length !== x[1].length))
                {
                    x = "\\[" + x.map(texify).join("\\]\n\\[") + "\\]";
                }
                else
                {
                    x = "\\[" + texify(x) + "\\]";
                }
            }
            else
            {
                if (x.length > $_.MAXPRINTSIZE)
                {
                    x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat('\\vdots').concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
                }
                //x = "\\[" + x.map(texify).join(' \\hskip 1em ') + "\\]";
                x = "\\[" + x.map(texify).join("\\]\n\\[") + "\\]";
            }
        }
        else
        {
            x = '';
        }
    }
    else
    {
        x = texify(x);
        if (x.length) x = "\\[" + x + "\\]";
    }
    return x;
};
function stringify(x)
{
    if (null == x)
    {
        // pass
        x = '';
    }
    else if (is_string(x))
    {
        // pass
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
    else if (is_matrix(x))
    {
        var use_ddots = false;
        if (COLS(x) > $_.MAXPRINTSIZE)
        {
            x = x.map(function(row) {
                return row.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat('..').concat(row.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
            });
            use_ddots = true;
        }
        if (ROWS(x) > $_.MAXPRINTSIZE)
        {
            x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat([array($_.MAXPRINTSIZE, function(i) {return stdMath.round($_.MAXPRINTSIZE/2) === i ? (use_ddots ? '\\' : ':') : ':';})]).concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
        }
        var ln = array(COLS(x), function(col) {
            return COL(x, col).reduce(function(l, xi) {
                return stdMath.max(l, stringify(xi).length);
            }, 0);
        });
        x = x.map(function(row, i) {
            return '[' + row.map(function(xij, j) {
                var str = stringify(xij);
                if (str.length < ln[j]) str = (new Array(ln[j]-str.length+1)).join(' ') + str;
                return str;
            }).join('  ') + ']';
        }).join('\n');
    }
    else if (is_array(x))
    {
        if (x.length > $_.MAXPRINTSIZE)
        {
            x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat(['..']).concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
        }
        x = x.map(stringify).join('  ');
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
                if (is_array(x[0][0]) || !is_array(x[1]) || (x[0].length !== x[1].length))
                {
                    x = x.map(stringify).join("\n\n");
                }
                else
                {
                    x = stringify(x);
                }
            }
            else
            {
                if (x.length > $_.MAXPRINTSIZE)
                {
                    x = x.slice(0, stdMath.round($_.MAXPRINTSIZE/2)).concat(':').concat(x.slice(-stdMath.round($_.MAXPRINTSIZE/2)+1));
                }
                x = x.map(stringify).join("\n");
            }
        }
        else
        {
            x = '';
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

// numeric ops (overloaded)
function eq(a, b)
{
    if (is_string(a))
    {
        if (is_string(b)) return a === b ? 1 : 0;
        else if (is_scalar(b)) return a === String(b) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) === b ? 1 : 0;
        else if (is_num(b)) return n_eq(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_eq(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) === b ? 1 : 0;
        else if (is_num(b)) return n_eq(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return n_eq(a.re, b.re) && n_eq(a.im, b.im) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return eq(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return eq(a, b[i][j]);});
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
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) === b ? 0 : 1;
        else if (is_num(b)) return n_eq(a, b) ? 0 : 1;
        else if (is_complex(b)) return n_eq(b.re, a) && n_eq(b.im, O) ? 0 : 1;
        else if (is_vector(b)) return b.map(function(bi) {return ne(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) === b ? 0 : 1;
        else if (is_num(b)) return n_eq(a.re, b) && n_eq(a.im, O) ? 0 : 1;
        else if (is_complex(b)) return n_eq(a.re, b.re) && n_eq(a.im, b.im) ? 0 : 1;
        else if (is_vector(b)) return b.map(function(bi) {return ne(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ne(a, b[i][j]);});
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
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) < b ? 1 : 0;
        else if (is_num(b)) return n_lt(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_lt(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return lt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) < b ? 1 : 0;
        else if (is_num(b)) return n_lt(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_lt(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_lt(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return lt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return lt(a, b[i][j]);});
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
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) > b ? 1 : 0;
        else if (is_num(b)) return n_gt(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_gt(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return gt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) > b ? 1 : 0;
        else if (is_num(b)) return n_gt(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_gt(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_gt(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return gt(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return gt(a, b[i][j]);});
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
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) <= b ? 1 : 0;
        else if (is_num(b)) return n_le(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_le(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return le(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return le(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) <= b ? 1 : 0;
        else if (is_num(b)) return n_le(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_le(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_le(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return le(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return le(a, b[i][j]);});
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
    }
    else if (is_num(a))
    {
        if (is_string(b)) return String(a) >= b ? 1 : 0;
        else if (is_num(b)) return n_ge(a, b) ? 1 : 0;
        else if (is_complex(b)) return n_ge(b.re, a) && n_eq(b.im, O) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return ge(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a, b[i][j]);});
    }
    else if (is_complex(a))
    {
        if (is_string(b)) return String(a) >= b ? 1 : 0;
        else if (is_num(b)) return n_ge(a.re, b) && n_eq(a.im, O) ? 1 : 0;
        else if (is_complex(b)) return (n_ge(a.re, b.re) && n_eq(a.im, O) && n_eq(b.im, O)) || (n_ge(a.im, b.im) && n_eq(a.re, O) && n_eq(b.re, O)) ? 1 : 0;
        else if (is_vector(b)) return b.map(function(bi) {return ge(a, bi);});
        else if (is_matrix(b)) return matrix(ROWS(b), COLS(b), function(i, j) {return ge(a, b[i][j]);});
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
        // matrix-scalar
        return a.map(function(ai) {return add(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
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
        // matrix-scalar
        return a.map(function(ai) {return sub(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
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
        // matrix-scalar
        return a.map(function(ai) {return dotmul(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
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
        // matrix-scalar
        return a.map(function(ai) {return dotdiv(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
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
        // matrix-scalar
        return a.map(function(ai) {return dotpow(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
        return b.map(function(bi) {return dotpow(a, bi);});
    }
    not_supported("dotpow");
}
$_.dotpow = dotpow;
fn.power = dotpow;
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
            // TODO maybe optimize matrix-matrix multiplication (eg Strassen algorithm)
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
        // matrix-scalar
        return a.map(function(ai) {return mul(ai, b);});
    }
    else if (is_array(b))
    {
        // scalar-matrix
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

function get(mat, rrange = ':', crange = null)
{
    // indices start from 1 to end
    // B=A(:,[5 6]); B=get(A,':',[5,6]);
    var ret;
    if (is_1d(mat))
    {
        if (is_vector(rrange) && (rrange.length === mat.length) && all(rrange, function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            ret = rrange.reduce(function(ret, v, i) {
                if (1 === _(v)) ret.push(mat[i]);
                return ret;
            }, []);
            if (1 === ret.length) ret = ret[0];
            return ret;
        }
        if (is_scalar(rrange)) rrange = sca(rrange, true);
        if ((':' === rrange) || is_int(rrange) || is_vector(rrange))
        {
            var n = mat.length;
            if (':' === rrange) rrange = colon(1, n);
            if (is_int(rrange)) rrange = [rrange];
            ret = rrange.map(function(r) {
                r = _(r);
                if (1 > r) r += n;
                if (1 > r || r > n) throw "get: index out of bounds";
                return mat[r-1];
            });
            if (1 === ret.length) ret = ret[0];
            return ret;
        }
        throw "get: invalid range";
    }
    if (is_2d(mat))
    {
        var rows = ROWS(mat), cols = COLS(mat), n = rows*cols;
        if (null == crange && is_matrix(rrange) && (ROWS(rrange) === rows) && (COLS(rrange) === cols) && all(rrange, function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            ret = [];
            for (var j=0; j<cols; ++j)
            {
                for (var i=0; i<rows; ++i)
                {
                    if (1 === _(rrange[i][j]))
                    {
                        ret.push(mat[i][j]);
                    }
                }
            }
            if (1 === ret.length) ret = ret[0];
            return ret;
        }
        if (is_scalar(rrange)) rrange = sca(rrange, true);
        if (is_scalar(crange)) crange = sca(crange, true);
        if ((':' === rrange) || is_int(rrange) || is_vector(rrange))
        {
            if (':' === rrange) rrange = colon(1, rows);
            if (is_int(rrange)) rrange = [rrange];
            if (null == crange)
            {
                ret = rrange.map(function(r) {
                    r = _(r);
                    if (1 > r) r += n;
                    if (1 > r || r > n) throw "get: index out of bounds";
                    return mat[(r-1) % rows][stdMath.floor((r-1) / rows)];
                });
                if (1 === ret.length) ret = ret[0];
                return ret;
            }
            else if ((':' === crange) || is_int(crange) || is_vector(crange))
            {
                if (':' === crange) crange = colon(1, cols);
                if (is_int(crange)) crange = [crange];
                ret = rrange.map(function(r) {
                    r = _(r);
                    if (1 > r) r += rows;
                    if (1 > r || r > rows) throw "get: index out of bounds";
                    return crange.map(function(c) {
                        c = _(c);
                        if (1 > c) c += cols;
                        if (1 > c || c > cols) throw "get: index out of bounds";
                        return mat[r-1][c-1];
                    });
                });
                if ((1 === ret.length) && (1 === ret[0].length)) ret = ret[0][0];
                return ret;
            }
        }
        throw "get: invalid range";
    }
    return mat;
}
$_.get = get;
function set(mat, rrange = ':', crange = null, val = null)
{
    // indices start from 1 to end
    // A(:,[5 6]) = B; set(A,':',[5,6], B);
    if (is_1d(mat))
    {
        //val = crange;
        if (is_2d(val)) val = COL(val, 0);
        if (is_vector(rrange) && (rrange.length === mat.length) && all(rrange, function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            if (is_0d(val))
            {
                rrange.forEach(function(v, i) {
                    if (1 === _(v)) mat[i] = val;
                });
                return mat;
            }
            else if (is_array(val))
            {
                var k = 0, nv = val.length;
                rrange.forEach(function(v, i) {
                    if (1 === _(v))
                    {
                        if (k >= nv) throw "set: index out of bounds";
                        mat[i] = val[k++];
                    }
                });
                return mat;
            }
            //throw "set: invalid value or range does not match dimensions";
        }
        if (is_scalar(rrange)) rrange = sca(rrange, true);
        if ((':' === rrange) || is_int(rrange) || is_vector(rrange))
        {
            var n = mat.length, index;
            if (':' === rrange) rrange = colon(1, n);
            if (is_int(rrange)) rrange = [rrange];
            if (is_0d(val))
            {
                rrange.forEach(function(r) {
                    r = _(r);
                    if (1 > r) r += n;
                    if (1 > r || r > n) throw "set: index out of bounds";
                    mat[r-1] = val;
                });
                return mat;
            }
            else if (is_array(val) && (val.length >= rrange.length))
            {
                rrange.forEach(function(r, i) {
                    r = _(r);
                    if (1 > r) r += n;
                    if (1 > r || r > n) throw "set: index out of bounds";
                    mat[r-1] = val[i];
                });
                return mat;
            }
            throw "set: invalid value or range does not match dimensions";
        }
        throw "set: invalid range";
    }
    if (is_2d(mat))
    {
        var rows = ROWS(mat), cols = COLS(mat), n = rows*cols, rowsv, colsv, nv, i, j, iv, jv, k;
        if (is_matrix(rrange) && (ROWS(rrange) === rows) && (COLS(rrange) === cols) && all(rrange, function(v) {return 0 === _(v) || 1 === _(v);}))
        {
            if (is_0d(val))
            {
                rrange.forEach(function(row, i) {
                    row.forEach(function(v, j) {
                        if (1 === _(v)) mat[i][j] = val;
                    });
                });
                return mat;
            }
            else if (is_2d(val))
            {
                rowsv = ROWS(val);
                colsv = COLS(val);
                for (j=0,jv=0; j<cols; ++j,++jv)
                {
                    if (1 === colsv) jv = 0;
                    else if (jv >= colsv) throw "set: index out of bounds";
                    for (i=0,iv=0; i<rows; ++i,++iv)
                    {
                        if (1 === _(rrange[i][j]))
                        {
                            if (1 === rowsv) iv = 0;
                            else if (iv >= rowsv) throw "set: index out of bounds";
                            mat[i][j] = val[iv][jv];
                        }
                    }
                }
                return mat;
            }
            else if (is_array(val))
            {
                nv = val.length;
                for (k=0,j=0; j<cols; ++j)
                {
                    for (i=0; i<rows; ++i)
                    {
                        if (1 === _(rrange[i][j]))
                        {
                            if (k >= nv) throw "set: index out of bounds";
                            mat[i][j] = val[k++];
                        }
                    }
                }
                return mat;
            }
            //throw "set: invalid value or range does not match dimensions";
        }
        if (is_scalar(rrange)) rrange = sca(rrange, true);
        if (is_scalar(crange)) crange = sca(crange, true);
        if ((':' === rrange) || is_int(rrange) || is_vector(rrange))
        {
            if (null == crange)
            {
                if (':' === rrange) rrange = colon(1, n);
                if (is_int(rrange)) rrange = [rrange];
                if (is_0d(val))
                {
                    rrange.forEach(function(r) {
                        r = _(r);
                        if (1 > r) r += n;
                        if (1 > r || r > n) throw "set: index out of bounds";
                        mat[(r-1) % rows][stdMath.floor((r-1) / rows)] = val;
                    });
                    return mat;
                }
                else if (is_2d(val))
                {
                    rowsv = ROWS(val);
                    colsv = COLS(val);
                    rrange.forEach(function(r, i) {
                        r = _(r);
                        if (1 > r) r += n;
                        if (1 > r || r > n) throw "set: index out of bounds";
                        var iv = 1 === rowsv ? 0 : (i % rows),
                            jv = 1 === colsv ? 0 : stdMath.floor(i / rows);
                        if (iv >= rowsv || jv >= colsv) throw "set: index out of bounds";
                        mat[(r-1) % rows][stdMath.floor((r-1) / rows)] = val[iv][jv];
                    });
                    return mat;
                }
                else if (is_array(val) && (val.length >= rrange.length))
                {
                    rrange.forEach(function(r, i) {
                        r = _(r);
                        if (1 > r) r += n;
                        if (1 > r || r > n) throw "set: index out of bounds";
                        mat[(r-1) % rows][stdMath.floor((r-1) / rows)] = val[i];
                    });
                    return mat;
                }
            }
            else if ((':' === crange) || is_int(crange) || is_vector(crange))
            {
                if (':' === rrange) rrange = colon(1, rows);
                if (is_int(rrange)) rrange = [rrange];
                if (':' === crange) crange = colon(1, cols);
                if (is_int(crange)) crange = [crange];
                if (is_0d(val))
                {
                    rrange.forEach(function(r) {
                        r = _(r);
                        if (1 > r) r += rows;
                        if (1 > r || r > rows) throw "set: index out of bounds";
                        crange.forEach(function(c) {
                            c = _(c);
                            if (1 > c) c += cols;
                            if (1 > c || c > cols) throw "set: index out of bounds";
                            mat[r-1][c-1] = val;
                        });
                    });
                    return mat;
                }
                else if (is_2d(val))
                {
                    rowsv = ROWS(val);
                    colsv = COLS(val);
                    rrange.forEach(function(r, iv) {
                        r = _(r);
                        if (1 > r) r += rows;
                        if (1 > r || r > rows) throw "set: index out of bounds";
                        if (1 === rowsv) iv = 0;
                        else if (iv >= rowsv) throw "set: index out of bounds";
                        crange.forEach(function(c, jv) {
                            c = _(c);
                            if (1 > c) c += cols;
                            if (1 > c || c > cols) throw "set: index out of bounds";
                            if (1 === colsv) jv = 0;
                            else if (jv >= colsv) throw "set: index out of bounds";
                            mat[r-1][c-1] = val[iv][jv];
                        });
                    });
                    return mat;
                }
                else if (is_array(val) && (val.length >= rrange.length*crange.length))
                {
                    k = 0;
                    crange.forEach(function(c, j) {
                        c = _(c);
                        if (1 > c) c += cols;
                        if (1 > c || c > cols) throw "set: index out of bounds";
                        rrange.forEach(function(r, i) {
                            r = _(r);
                            if (1 > r) r += rows;
                            if (1 > r || r > rows) throw "set: index out of bounds";
                            mat[r-1][c-1] = val[k++];
                        });
                    });
                    return mat;
                }
            }
            throw "set: invalid value or range does not match dimensions";
        }
        throw "set: invalid range";
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
function d_cityblock(a, b)
{
    // manhattan
    return sum(abs(1 === arguments.length ? a : sub(a, b)));
}
function d_cosine(a, b)
{
    return scalar_sub(I, scalar_div(scalar_div(dot(a, b), realMath.sqrt(real(dot(a, a)))), realMath.sqrt(real(dot(b, b)))));
}
function d_hamming(a, b)
{
    return __(a.reduce(function(d, ai, i) {
        return d + 1 - eq(ai, b[i]);
    }, 0) / a.length);
}
function d_jaccard(a, b)
{
    return __(a.reduce(function(d, ai, i) {
        return d + eq(ai, b[i]);
    }, 0) / a.length);
}
function d_minkowski(a, b, p)
{
    // p-norm
    if (2 === arguments.length) p = b;
    return scalar_pow(sum(dotpow(abs(2 === arguments.length ? a : sub(a, b)), p)), n_inv(p));
}
function d_chebyshev(a, b)
{
    return max(abs(1 === arguments.length ? a : sub(a, b)));
}
function norm2(x)
{
    return x.reduce(function(n, xi) {
        return scalar_add(n, scalar_mul(xi, scalar_conj(xi)));
    }, O);
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

    option: function(style, args, i, kth) {
        var linedash = {
                "-" : [],           //Solid
                "--": [15, 5],      //Dashed
                ":" : [5, 5],       //Dotted
                "-.": [15,5,5,5],   //Dash-dotted
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
            val, k, f
        ;
        if (style.Color)
        {
            return {
                Color: color[palette[(kth || 0) % palette.length]],
                LineWidth: style.LineWidth,
                LineStyle: style.LineStyle,
                _LineStyle: style._LineStyle
            };
        }
        if (!style.Color) style.Color = color[palette[(kth || 0) % palette.length]];
        if (!style.LineWidth) style.LineWidth = 1;
        if (!style.LineStyle) style.LineStyle = linedash["-"];
        if (!style._LineStyle) style._LineStyle = "-";
        i = i || 0;
        while (i < args.length)
        {
            if ("Color" === args[i])
            {
                val = args[i+1];
                if (is_string(val))
                {
                    if (HAS.call(color_, val))
                    {
                        style.Color = color[color_[val]];
                    }
                    else if (HAS.call(color, val))
                    {
                        style.Color = color[val];
                    }
                }
                else if (is_vector(val) && (3 === val.length))
                {
                    style.Color = tonumber(val);
                }
                i += 2;
                continue;
            }
            else if ("LineWidth" === args[i])
            {
                val = args[i+1];
                if (is_num(val))
                {
                    style.LineWidth = 2*tonumber(val);
                }
                i += 2;
                continue;
            }
            else if ("LineStyle" === args[i])
            {
                val = args[i+1];
                if (is_string(val) && HAS.call(linedash, val))
                {
                    style._LineStyle = val;
                    style.LineStyle = linedash[val];
                }
                i += 2;
                continue;
            }
            else if (is_string(args[i]))
            {
                f = false;
                val = args[i];
                for (k in color)
                {
                    if (-1 < val.indexOf(k))
                    {
                        style.Color = color[k];
                        f = true;
                    }
                }
                for (k in linedash)
                {
                    if (('-' !== k) && (-1 < val.indexOf(k)))
                    {
                        style._LineStyle = k;
                        style.LineStyle = linedash[k];
                        f = true;
                    }
                }
                if (f)
                {
                    i += 1;
                    continue;
                }
            }
            break;
        }
        return i;
    },
    parse: function(args, type, defaultEmpty) {
        var fig = this, i = 0, j, kth = 0, n, x, y, z, s;
        if ('pie' === type)
        {
            while (i < args.length)
            {
                if (is_vector(args[i]))
                {
                    fig.data.push({y:tonumber(args[i++])});
                }
                else
                {
                    i += 1;
                }
            }
        }
        else if ('plot3' === type)
        {
            while (i < args.length)
            {
                x = null; y = null; z = null;
                if (is_vector(args[i]))
                {
                    x = args[i];
                }
                if (is_vector(args[i+1]))
                {
                    y = args[i+1];
                }
                if (is_vector(args[i+2]))
                {
                    z = args[i+2];
                    i += 3;
                }
                if (x && y && z)
                {
                    s = {};
                    i = fig.option(s, args, i, kth);
                    fig.data.push({x:tonumber(x), y:tonumber(y), z:tonumber(z), style:s});
                    ++kth;
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
                if (is_vector(args[i]))
                {
                    x = args[i];
                }
                if (is_vector(args[i+1]) || is_matrix(args[i+1]))
                {
                    y = args[i+1];
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
                    s = {};
                    i = fig.option(s, args, i, kth);
                    if (is_matrix(y))
                    {
                        for (j=0,n=COLS(y); j<n; ++j)
                        {
                            fig.data.push({x:tonumber(x), y:tonumber(COL(y, j)), style:s});
                            ++kth;
                            s = fig.option(s, args, i, kth);
                        }
                    }
                    else
                    {
                        fig.data.push({x:tonumber(x), y:tonumber(y), style:s});
                        ++kth;
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
        return z.pow(new complex(half, O));
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
    // TODO
    asin: null,
    acos: null,
    atan: null,
    asinh: null,
    acosh: null,
    atanh: null
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
function zeros(rows, cols)
{
    if (null == rows) rows = 1;
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    if (null == cols)
    {
        cols = rows;
    }
    return matrix(_(rows), _(cols), O);
}
fn.zeros = function(rows, cols) {
    return zeros(fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
function ones(rows, cols)
{
    if (null == rows) rows = 1;
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    if (null == cols)
    {
        cols = rows;
    }
    return matrix(_(rows), _(cols), I);
}
fn.ones = function(rows, cols) {
    return ones(fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
function eye(n, d)
{
    if (null == d) d = I;
    if (null == n) n = 1;
    n = sca(n, true);
    return matrix(_(n), _(n), function(i, j) {
        return i === j ? d : O;
    });
}
fn.eye = function(n) {
    return eye(fn.fix(n), I);
};
function rand(rows, cols)
{
    if (null == rows)
    {
        return __(stdMath.random());
    }
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    if (null == cols)
    {
        cols = rows;
    }
    return matrix(_(rows), _(cols), function() {
        return __(stdMath.random());
    });
}
fn.rand = function(rows, cols) {
    return rand(fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
function randi(n, rows, cols)
{
    n = _(n);
    if (null == rows && null == cols)
    {
        return __(stdMath.ceil(stdMath.random()*n));
    }
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    if (null == cols)
    {
        cols = rows;
    }
    return matrix(_(rows), _(cols), function() {
        return __(stdMath.ceil(stdMath.random()*n));
    });
}
fn.randi = function(n, rows, cols) {
    return randi(fn.fix(n), fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
function randn(rows, cols)
{
    if (null == rows)
    {
        return __(normal());
    }
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    if (null == cols)
    {
        cols = rows;
    }
    return matrix(_(rows), _(cols), function() {
        return __(normal());
    });
}
fn.randn = function(rows, cols) {
    return randn(fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
function shuffle(a)
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
    n = _(n || 0);
    if (!is_int(n) || 0 >= n) not_supported("randperm");
    return shuffle(array(n, function(i) {return i+1;}));
};
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
    if (1 === arguments.length)
    {
        y = x;
    }
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
});
function ndgrid(nargout, x)
{
    var ans = [],
        dims = array(nargout, function(i) {
            return (1 === x.length ? x[0] : x[i]).length;
        })
    ;
    for (var k=0; k<nargout; ++k)
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
    var ans;
    if ((1 === arguments.length) && is_array(a))
    {
        // a(:)
        if (is_2d(a))
        {
            var rows = ROWS(a), cols = COLS(a), i, j, k;
            ans = new Array(cols*rows);
            for (k=0,j=0; j<cols; ++j)
            {
                for (i=0; i<rows; ++i)
                {
                    ans[k++] = a[i][j];
                }
            }
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
        ans = [];
        if (n_gt(b, O))
        {
            for (; n_le(a, c); a=n_add(a, b)) ans.push(a);
        }
        else if (n_lt(b, O))
        {
            for (; n_ge(a, c); a=n_add(a, b)) ans.push(a);
        }
        return ans;
    }
}
fn.colon = colon;
function cat(type, A, B)
{
    if ("horz" === type)
    {
        if (is_1d(A) && is_1d(B))
        {
            return A.concat(B);
        }
        else if (is_2d(A) && is_2d(B) && (ROWS(A) === ROWS(B)))
        {
            return A.map(function(Ai, i) {
                return Ai.concat(B[i]);
            });
        }
    }
    if ("vert" === type)
    {
        if (is_1d(A) && is_1d(B))
        {
            return A.concat(B);
        }
        else if (is_2d(A) && is_2d(B) && (COLS(A) === COLS(B)))
        {
            return A.concat(B);
        }
    }
    not_supported("cat");
}
fn.cat = function(dim, A, B /*,..*/) {
    dim = _(dim);
    var ans = [], i;
    if (1 === dim)
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
    }
    return ans;
};
fn.horzcat = function(A, B /*,..*/) {
    var ans, i;
    // horz
    ans = arguments[0];
    for (i=1; i<arguments.length; ++i)
    {
        ans = cat("horz", ans, arguments[i]);
    }
    return ans;
};
fn.vertcat = function(A, B /*,..*/) {
    var ans, i;
    // vert
    ans = arguments[0];
    for (i=1; i<arguments.length; ++i)
    {
        ans = cat("vert", ans, arguments[i]);
    }
    return ans;
};
function transpose(x)
{
    if (is_2d(x))
    {
        return matrix(COLS(x), ROWS(x), function(i, j) {
            return x[j][i];
        });
    }
    return x;
}
fn.transpose = transpose;
function ctranspose(x)
{
    if (is_2d(x))
    {
        return matrix(COLS(x), ROWS(x), function(i, j) {
            return is_scalar(x[j][i]) ? scalar_conj(x[j][i]) : x[j][i];
        });
    }
    else if (is_1d(x))
    {
        return x.map(function(xi) {
            return is_scalar(xi) ? scalar_conj(xi) : xi;
        });
    }
    else if (is_scalar(x))
    {
        return scalar_conj(x);
    }
    return x;
}
fn.ctranspose = ctranspose;
function diag(x, k)
{
    k = _(k || 0);
    if (is_0d(x))
    {
        return [[x]];
    }
    if (is_1d(x))
    {
        return matrix(x.length, x.length, function(i, j) {
            return k === i - j ? x[i] : O;
        });
    }
    if (is_2d(x))
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
        if (!is_2d(mat)) not_supported("blkdiag");
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
    if (is_2d(x))
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
    if (is_2d(x))
    {
        k = _(k || 0);
        return matrix(ROWS(x), COLS(x), function(i, j) {
            return j >= i+k ? x[i][j] : O;
        });
    }
    not_supported("triu");
}
fn.triu = triu;
function repmat(x, nr, nc)
{
    if (is_vector(nr))
    {
        nc = nr[1];
        nr = nr[0];
    }
    if (null == nc) nc = nr;
    nr = _(nr); nc = _(nc);
    if (is_0d(x)) x = [[x]];
    if (is_1d(x)) x = [x];
    if (is_2d(x))
    {
        var rows = nr*ROWS(x), cols = nc*COLS(x);
        return matrix(rows, cols, function(i, j) {
            return x[i % nr][j % nc];
        });
   }
   return x;
}
fn.repmat = repmat;
function repelem(x, n)
{
    if (is_vector(x))
    {
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
    return x;
}
fn.repelem = repelem;
function reshape(x, rows, cols)
{
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    rows = _(rows); cols = _(cols);
    var n = rows*cols;
    if (is_0d(x) && (1 === rows) && (1 === cols))
    {
        return [[x]];
    }
    else if (is_1d(x) && (x.length === n))
    {
        return matrix(rows, cols, function(i, j) {
            return x[i + rows*j];
        });
    }
    else if (is_2d(x) && (ROWS(x)*COLS(x) === n))
    {
        var xrows = ROWS(x);
        return matrix(rows, cols, function(i, j) {
            var index = i + rows*j;
            return x[index % xrows][stdMath.floor(index/xrows)];
        });
    }
    else
    {
        return x;
    }
}
fn.reshape = reshape;
fn.squeeze = function(x) {
    /*if (is_matrix(x))
    {
        if (1 === ROWS(x)) return x[0];
        if (1 === COLS(x)) return x.map(function(xi) {return xi[0];});
    }*/
    return x;
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
        var rows = ROWS(x), cols = COLS(x);
        if (null == dim) dim = 1;
        dim = _(dim);
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
        return x;
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
    if (is_0d(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        if (null == cmp) cmp = is_real(x) ? cmp_real : cmp_abs;
        ans = x.map(function(v, i) {return {v:v, i:i};}).sort('descend' === dir ? function(a, b) {
            return cmp(b.v, a.v) || (a.i - b.i);
        } : function(a, b) {
            return cmp(a.v, b.v) || (a.i - b.i);
        });
        return with_indices ? [ans.map(function(vi) {return vi.v;}), ans.map(function(vi) {return vi.i+1;})] : ans.map(function(vi) {return vi.v;});
    }
    else if (is_matrix(x))
    {
        if (1 === dim)
        {
            if (with_indices)
            {
                ans = array(COLS(x), function(c) {
                    var col = COL(x, c);
                    return sort(col, dim, dir, null == cmp ? (is_real(col) ? cmp_real : cmp_abs) : cmp, true);
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
                    return sort(col, dim, dir, null == cmp ? (is_real(col) ? cmp_real : cmp_abs) : cmp, false);
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
                    return sort(row, dim, dir, null == cmp ? (is_real(row) ? cmp_real : cmp_abs) : cmp, true);
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
                    return sort(row, dim, dir, null == cmp ? (is_real(row) ? cmp_real : cmp_abs) : cmp, false);
                });
                return matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[i][j];
                });
            }
        }
    }
    not_supported("sort");
}
fn.sort = varargout(function(nargout, x, dim, dir/*, .. args*/) {
    var i = 2, cmp = null;
    while (i < arguments.length)
    {
        if ('ComparisonMethod' === arguments[i])
        {
            if ('real' === arguments[i+1]) cmp = cmp_real;
            else if ('abs' === arguments[i+1]) cmp = cmp_abs;
            if (1 === i)
            {
                dim = 1;
                dir = 'ascend';
            }
            else if (2 === i)
            {
                dir = 'ascend';
            }
            break;
        }
        else
        {
            i += 1;
        }
    }
    if (null == dir) dir = 'ascend';
    if (null == dim) dim = 1;
    dim = _(dim);
    return sort(x, dim, dir, cmp, 1 < nargout);
});
function min(x)
{
    x = vec(x);
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.reduce(function(min, xi) {
            if (n_lt(xi, min)) min = xi;
            return min;
        }, inf);
    }
    else if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return min(COL(x, column));
        });
    }
    return nan;
}
fn.min = min;
function max(x)
{
    x = vec(x);
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.reduce(function(max, xi) {
            if (n_gt(xi, max)) max = xi;
            return max;
        }, -inf);
    }
    else if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return max(COL(x, column));
        });
    }
    return nan;
}
fn.max = max;
function sum(x)
{
    x = vec(x);
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.reduce(function(sum, xi) {
            return scalar_add(sum, xi);
        }, O);
    }
    else if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return sum(COL(x, column));
        });
    }
    return nan;
}
fn.sum = sum;
function prod(x)
{
    x = vec(x);
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.reduce(function(prod, xi) {
            return scalar_mul(prod, xi);
        }, I);
    }
    else if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return prod(COL(x, column));
        });
    }
    return nan;
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
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return diff(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return diff(ROW(x, row));
            });
        }
    }
    not_supported("diff");
}
fn.diff = function(x, n, dim) {
    if (null == dim) dim = 1;
    if (null == n) n = 1;
    if (!is_int(n)) not_supported("diff");
    n = _(n);
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
        else if (is_vector(x) && (x.length === y.length))
        {
            for (i=0,n=x.length-1,ans=O; i<n; ++i)
            {
                ans = scalar_add(ans, scalar_mul(scalar_abs(scalar_sub(x[i+1], x[i])), scalar_div(scalar_add(y[i+1], y[i]), two)));
            }
            return ans;
        }
    }
    else if (is_matrix(y))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            if ((null == x) || is_scalar(x) || (is_vector(x) && (x.length === ROWS(y))))
            {
                return array(COLS(y), function(column) {
                    return trapz(x, COL(y, column));
                });
            }
            else if (is_matrix(x) && (ROWS(x) === ROWS(y)) && (COLS(x) === COLS(y)))
            {
                return array(COLS(y), function(column) {
                    return trapz(null == x ? null : COL(x, column), COL(y, column));
                });
            }
        }
        else if (2 === dim)
        {
            if ((null == x) || is_scalar(x) || (is_vector(x) && (x.length === COLS(y))))
            {
                return array(ROWS(x), function(row) {
                    return trapz(x, ROW(y, row));
                });
            }
            else if (is_matrix(x) && (ROWS(x) === ROWS(y)) && (COLS(x) === COLS(y)))
            {
                return array(ROWS(x), function(row) {
                    return trapz(ROW(x, row), ROW(y, row));
                });
            }
        }
    }
    not_supported("trapz");
}
fn.trapz = function(x, y, dim) {
    if (3 > arguments.length)
    {
        if (is_array(y))
        {
            dim = 1;
        }
        else if (is_array(x) && !is_array(y))
        {
            dim = y;
            y = x;
            x = null;
        }
    }
    return trapz(is_array(x) ? vec(x) : x, vec(y), dim);
};
function cumtrapz(x, y, dim)
{
    if (is_scalar(y))
    {
        return y;
    }
    else if (is_vector(y))
    {
        if ((null == x) || is_scalar(x))
        {
            return y.map(function(yi, i) {
                return trapz(x, y.slice(0, i+1));
            });
        }
        else if (is_vector(x) && (x.length === y.length))
        {
            return y.map(function(yi, i) {
                return trapz(x.slice(0, i+1), y.slice(0, i+1));
            });
        }
    }
    else if (is_matrix(y))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            if ((null == x) || is_scalar(x) || (is_vector(x) && (x.length === ROWS(y))))
            {
                return array(COLS(y), function(column) {
                    return cumtrapz(x, COL(y, column), dim);
                });
            }
            else if (is_matrix(x) && (ROWS(x) === ROWS(y)) && (COLS(x) === COLS(y)))
            {
                return array(COLS(y), function(column) {
                    return cumtrapz(COL(x, column), COL(y, column), dim);
                });
            }

        }
        else if (2 === dim)
        {
            if ((null == x) || is_scalar(x) || (is_vector(x) && (x.length === COLS(y))))
            {
                return array(ROWS(y), function(row) {
                    return cumtrapz(x, ROW(y, row), dim);
                });
            }
            else if (is_matrix(x) && (ROWS(x) === ROWS(y)) && (COLS(x) === COLS(y)))
            {
                return array(ROWS(y), function(row) {
                    return cumtrapz(ROW(x, row), ROW(y, row), dim);
                });
            }
        }
    }
    not_supported("cumtrapz");
}
fn.cumtrapz = function(x, y, dim) {
    if (3 > arguments.length)
    {
        if (is_array(y))
        {
            dim = 1;
        }
        else if (is_array(x) && !is_array(y))
        {
            dim = y;
            y = x;
            x = null;
        }
    }
    return cumtrapz(is_array(x) ? vec(x) : x, vec(y), dim);
};
function cum(x, f, dir, dim)
{
    var accum;
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        if (null == dir) dir = 'forward';
        if ('reverse' === dir)
        {
            return x.slice().reverse().map(function(xi, i) {
                accum = 0 === i ? xi : f(accum, xi);
                return accum;
            }).reverse();
        }
        else if ('forward' === dir)
        {
            return x.map(function(xi, i) {
                accum = 0 === i ? xi : f(accum, xi);
                return accum;
            });
        }
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return cum(COL(x, column), f, dir, dim);
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return cum(ROW(x, row), f, dir, dim);
            });
        }
    }
    return false;
}
fn.cumsum = function(x, dim, dir) {
    var ans = cum(vec(x), scalar_add, dir, dim);
    if (false === ans) not_supported("cumsum");
    return ans;
};
fn.cumprod = function(x, dim, dir) {
    var ans = cum(vec(x), scalar_mul, dir, dim);
    if (false === ans) not_supported("cumprod");
    return ans;
};
fn.cummin = function(x, dim, dir) {
    var ans = cum(vec(x), function(a, b) {return lt(a, b) ? a : b;}, dir, dim);
    if (false === ans) not_supported("cummin");
    return ans;
};
fn.cummax = function(x, dim, dir) {
    var ans = cum(vec(x), function(a, b) {return gt(a, b) ? a : b;}, dir, dim);
    if (false === ans) not_supported("cummax");
    return ans;
};
function mov(x, f, kb, kf, dim)
{
    if (is_vector(x))
    {
        var n = x.length;
        return array(n, function(i) {
            return f(x.slice(stdMath.max(0, i-kb), stdMath.min(n-1, i+kf)+1));
        });
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return mov(COL(x, column), f, kb, kf, dim);
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return mov(ROW(x, row), f, kb, kf, dim);
            });
        }
    }
    return false;
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
    ans = mov(vec(x), sum, kb, kf, dim);
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
    ans = mov(vec(x), prod, kb, kf, dim);
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
    ans = mov(vec(x), mean, kb, kf, dim);
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
    ans = mov(vec(x), min, kb, kf, dim);
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
    ans = mov(vec(x), max, kb, kf, dim);
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
function size(x)
{
    var dims = [].slice.call(arguments, 1);
    if (is_array(dims[0])) dims = dims[0];
    if (is_0d(x))
    {
        return dims.length ? dims.map(function(dim) {return ([1, 1])[_(dim)-1];}) : [1, 1];
    }
    else if (is_1d(x))
    {
        return dims.length ? dims.map(function(dim) {return ([1, x.length])[_(dim)-1];}) : [1, x.length];
    }
    else if (is_2d(x))
    {
        return dims.length ? dims.map(function(dim) {return ([ROWS(x), COLS(x)])[_(dim)-1];}) : [ROWS(x), COLS(x)];
    }
    return [];
}
fn.size = size;
function length(x)
{
    if (is_array(x)) return stdMath.max.apply(null, size(x));
    return null == x ? 0 : 1;
}
fn.length = length;
function ndims(x)
{
    return length(size(x));
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
function sub2ind(dims, i, j)
{
    if (is_vector(i))
    {
        j = i[1];
        i = i[0];
    }
    i = _(i); j = _(j);
    return 1 === dims.length ? i : ((i-1)+_(dims[0])*(j-1)+1);
}
fn.sub2ind = sub2ind;
function ind2sub(dims, ind)
{
    ind = _(ind);
    return 1 === dims.length ? [ind, 1] : [((ind-1) % _(dims[0])) + 1, stdMath.floor((ind-1) / _(dims[0])) + 1];
}
fn.ind2sub = ind2sub;
function find(x, check)
{
    if (is_vector(x))
    {
        return x.reduce(function(ind, xi, i) {
            if (check(xi, i+1, 1)) ind.push(i+1);
            return ind;
        }, []);
    }
    else if (is_matrix(x))
    {
        var rows = ROWS(x);
        return x.reduce(function(ind, xi, i) {
            return xi.reduce(function(ind, xij, j) {
                if (check(xij, i+1, j+1)) ind.push(i+rows*j+1);
                return ind;
            }, ind);
        }, []);
    }
    return [];
}
$_.find = find;
fn.find = function(x) {
    return find(x, function(x) {return !eq(x, O);});
};
function all(x, check)
{
    if (is_scalar(x))
    {
        return check(x, 1, 1) ? 1 : 0;
    }
    else if (is_vector(x))
    {
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (!check(x[i], i+1, 1)) return 0;
        }
        return 1;
    }
    else if (is_matrix(x))
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
    else if (is_vector(x))
    {
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (check(x[i], i+1, 1)) return 1;
        }
    }
    else if (is_matrix(x))
    {
        for (var i=0,rows=ROWS(x),cols=COLS(x); i<rows; ++i)
        {
            for (var j=0; j<cols; ++j)
            {
                if (check(x[i][j], i+1, j+1)) return 1;
            }
        }
    }
    return 0;
}
$_.any = any;
fn.any = function(x) {
    return any(x, function(x) {return !eq(x, O);});
};
fn.isnan = function isnan(x) {
    if (is_array(x)) return x.map(isnan);
    if (is_nan(x)) return 1;
    if (is_complex(x)) return is_nan(x.re) || is_nan(x.im) ? 1 : 0;
    return 0;
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
};fn.isreal = function(x) {
    return all(x, is_real);
};
fn.isempty = function(x) {
    if (is_array(x))
    {
        if (is_array(x[0])) return !x[0].length ? 1 : 0;
        else return !x.length ? 1 : 0;
    }
    return 0;
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
function is_tri(A, type, strict, eps)
{
    var nr = ROWS(A), nc = COLS(A), n, r, c;
    if ((false !== strict) && (nr !== nc)) return false;

    eps = __(eps || 0);
    n = stdMath.min(nr, nc);
    for (r=0; r<n; ++r)
    {
        if (('lower' === type) || ('diagonal' === type))
        {
            for (c=r+1; c<n; ++c) if (!le(scalar_abs(A[r][c]), eps)) return false;
        }
        if (('upper' === type) || ('diagonal' === type))
        {
            for (c=0; c<r; ++c) if (!le(scalar_abs(A[r][c]), eps)) return false;
        }
    }
    if (nr > nc)
    {
        // should be all zero
        for (r=n; r<nr; ++r)
        {
            for (c=0; c<nc; ++c) if (!le(scalar_abs(A[r][c]), eps)) return false;
        }
    }
    else if (nr < nc)
    {
        // should be all zero
        for (c=n; c<nc; ++c)
        {
            for (r=0; r<nr; ++r) if (!le(scalar_abs(A[r][c]), eps)) return false;
        }
    }
    return true;
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
        var b = scalar_div(scalar_sub(gamma, alpha), scalar_mul(beta, 2)),
            t = scalar_div(scalar_sign(b), scalar_add(scalar_add(scalar_abs(b), fn.sqrt(scalar_pow(b, 2))), I));
            c = scalar_inv(fn.sqrt(scalar_add(I, scalar_pow(t,2)))),
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
function rotmul(type, G, p, q, A)
{
    var n = ROWS(A), B = copy(A),
        i, j, Gpp, Gpq, Gqp, Gqq;
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
        for (i=0; i<n; ++i)
        {
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[j][p], A[i][j]));
            }*/
            B[i][p] = scalar_add(scalar_mul(Gpp, A[i][p]), scalar_mul(Gqp, A[i][q]));
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[j][q], A[i][j]));
            }*/
            B[i][q] = scalar_add(scalar_mul(Gpq, A[i][p]), scalar_mul(Gqq, A[i][q]));
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
        for (i=0; i<n; ++i)
        {
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[p][j], A[j][i]));
            }*/
            B[p][i] = scalar_add(scalar_mul(Gpp, A[p][i]), scalar_mul(Gpq, A[q][i]));
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[q][j], A[j][i]));
            }*/
            B[q][i] = scalar_add(scalar_mul(Gqp, A[p][i]), scalar_mul(Gqq, A[q][i]));
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
            for (l=0; l<=k-1; ++l)
            {
                J = compute_jacobi(A[k][k], A[k][l], A[l][l]);
                A = rotmul('right', J, k, l, rotmul('left', ctranspose(J), k, l, A));
            }
        }
    }
    return A;
}
function francis_poly(H)
{
    // Get shifts via trailing submatrix
    var i = ROWS(H)-1, j = COLS(H)-1,
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
}
function gauss_jordan(A, with_pivots, odim, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A),
        dim = columns, pivots,
        det, pl = 0, r, i, i0, p0,
        lead, leadc, imin, im, min,
        a, z, m, aug, find_dupl;
    eps = __(eps || 0);
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
function largest_eig(A, N, eps, valueonly)
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
            v = dotdiv(v, v[0].sign());
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
            v = dotdiv(v, v[0].sign());
            w = dotdiv(w, w[0].sign());
            v = dotdiv(v, norm(v));
            w = dotdiv(w, norm(w));
            if (n_le(realMath.abs(n_sub(real(k), real(prev_k))), eps) && n_le(realMath.abs(n_sub(imag(k), imag(prev_k))), eps)) break;
        }
        return [k, v, w];
    }
}
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
        return 0;
    }
    else if (1 === n)
    {
        // scalar, trivial
        return A[0][0];
    }
    else if (is_tri(A, 'lower', true, eps) || is_tri(A, 'upper', true, eps))
    {
        // triangular, product of diagonal entries
        return A.reduce(function(det, ai, i) {
            return scalar_mul(det, A[i][i]);
        }, 1);
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
function ldl(A, triangle)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A), i, j, jj, k, sum, D, L;
    if ((rows !== columns) || !EQU(A, ctranspose(A)))
    {
        not_supported("ldl");
    }
    else
    {
        D = zeros(rows, rows);
        L = eye(rows);

        for (i=0; i<rows; ++i)
        {
            if ("upper" === triangle)
            {
                for (j=i+1; j<rows; ++j)
                {
                    for (k=i+1,sum=O; k<j; ++k)
                        sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[j][k])), D[k][k]));

                    L[i][j] = scalar_div(scalar_sub(A[i][j], sum), D[j][j]);
                }

                for (k=i+1,sum=O; k<rows; ++k)
                    sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[i][k])), D[k][k]));
            }
            else
            {
                for (j=0; j<i; ++j)
                {
                    for (k=0,sum=O; k<j; ++k)
                        sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[j][k])), D[k][k]));

                    L[i][j] = scalar_div(scalar_sub(A[i][j], sum), D[j][j]);
                }

                for (k=0,sum=O; k<i; ++k)
                    sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[i][k])), D[k][k]));
            }

            D[i][i] = scalar_sub(A[i][i], sum);

            if (le(D[i][i], O))
            {
                // not positive-definite
                not_supported("ldl");
            }
        }
        return [L, D];
    }
}
fn.ldl = function(A, triangle) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("ldl");
    return ldl(A, triangle);
};
function lu(A, without_d, eps)
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
    if (defficient) throw "lu: defficient matrix";
    DD[n-1] = oldpivot;
    if (without_d)
    {
        DD = diag(DD.map(function(di) {return scalar_inv(di);}));
        return [mul(L, DD), U, P];
    }
    return [DD, L, U, P];
}
fn.lu = function(A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("lu");
    return lu(A, true);
};
function qr(A, wantq, wantp)
{
    var m = ROWS(A), n = COLS(A),
        Q = wantq ? eye(m) : null,
        R = A, P, p, t,
        colnorms, max,
        i, j, k, G, G_t;
    if (wantp)
    {
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
            for (i=m-1; i>=(j+1); --i)
            {
                //G = givens(m, i-1, i, R[i-1][j], R[i][j]);
                //G_t = ctranspose(G);
                G = compute_givens(R[i-1][j], R[i][j]);
                G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                R = rotmul('left', G_t, i-1, i, R);//mul(G_t, R);
                if (wantq) Q = rotmul('right', G, i-1, i, Q);//mul(Q, G);
            }
            for (i=j+1; i<n; ++i)
            {
                colnorms[i] = n_sub(colnorms[i], n_pow(scalar_abs(R[j][i]), two));
            }
        }
    }
    else
    {
        // produces some reflected signs from Octave's qr
        for (j=0; j<n; ++j)
        {
            for (i=m-1; i>=(j+1); --i)
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
    return wantq && wantp ? [Q, R, matrix(n, n, function(i, j) {return i === P[j] ? I : O;})] : (wantq ? [Q, R] : R);
}
fn.qr = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("qr");
    return qr(A, 1 < nargout, 2 < nargout);
});
function schur(A, wantu)
{
    // schur via qr algorithm
    var n = ROWS(A), H, U, QR,
        m, sigma, Isigma,
        iter, eps = __(1e-8);

    // reduce to hessenberg Form
    H = hess(A, null, wantu);
    if (wantu)
    {
        U = H[0];
        H = H[1];
    }

    // qr algorithm for hessenberg with shifts
    for (m=n-1; m>0; --m)
    {
        for (iter=1; iter<=100; ++iter)
        {
            sigma = H[m][m];
            Isigma = eye(n, sigma);
            QR = qr(sub(H, Isigma), null, true);
            H = add(mul(QR[1], QR[0]), Isigma);
            if (wantu) U = mul(U, QR[0]);
            if (n_le(scalar_abs(H[m][m-1]), eps)) break;
        }
    }
    return wantu ? [U, H] : H;
}
fn.schur = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("schur");
    return schur(A, 1 < nargout);
});
function balance(A, pnorm, wantt)
{
    if (null == pnorm) pnorm = 2;
    /*
    "ON MATRIX BALANCING AND EIGENVECTOR COMPUTATION",
    RODNEY JAMES, JULIEN LANGOU, BRADLEY R. LOWERY
    https://arxiv.org/abs/1401.5766
    */
    var n = ROWS(A),
        B = copy(A),
        T = wantt ? array(n, I) : null,
        i, j, f,
        col, row, c, r,
        eps = __(1e-10),
        converged, iter;
    for (iter=1; iter<=10000; ++iter)
    {
        converged = 0;
        for (i=0; i<n; ++i)
        {
            col = COL(B, i).map(__);
            col.splice(i, 1);
            row = ROW(B, i).map(__);
            row.splice(i, 1);
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
    var ans = balance(A, 2, 1 < nargout);
    return 2 < nargout ? [ans[0], array(ROWS(A), function(i) {return i+1;})/*noperm*/, ans[1]] : (1 < nargout ? [diag(ans[0]), ans[1]] : ans);
});
function hess(A, B, wantq)
{
    var n = ROWS(A);
    if (null == B)
    {
        var Q = wantq ? eye(n) : null,
            H = A, G, G_t,
            k, i;
        for (k=1; k<=n-2; ++k)
        {
            // produces some reflected signs from Octave's hess
            for (i=n; i>=k+2; --i)
            {
                //G = givens(n, i-1-1, i-1, H[i-1-1][k-1], H[i-1][k-1]);
                //G_t = ctranspose(G);
                G = compute_givens(H[i-1-1][k-1], H[i-1][k-1]);
                G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                if (wantq) Q = rotmul('right', G, i-1-1, i-1, Q);//mul(Q, G);
                H = rotmul('left', G_t, i-1-1, i-1, rotmul('right', G, i-1-1, i-1, H));//mul(ctranspose(G), mul(H, G));
            }
        }
        return wantq ? [Q, H] : H;
    }
    else
    {
        var QR = qr_givens(B, true),
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
                //Rl = givens(n, i-1-1, i-1, AA[i-1-1][k-1], AA[i-1][k-1]);
                //Rl_t = ctranspose(Rl);
                Rl = compute_givens(AA[i-1-1][k-1], AA[i-1][k-1]);
                Rl_t = [scalar_conj(Rl[0]), scalar_neg(scalar_conj(Rl[1]))];
                Q = rotmul('right', Rl, i-1-1, i-1, Q);//mul(Q, Rl);
                AA = rotmul('left', Rl_t, i-1-1, i-1, AA);//mul(Rl_t, AA);
                BB = rotmul('left', Rl_t, i-1-1, i-1, BB);//mul(Rl_t, BB);

                //Rr = givens(n, i-1-1, i-1, scalar_neg(BB[i-1][i-1]), BB[i-1][i-1-1]);
                Rr = compute_givens(scalar_neg(BB[i-1][i-1]), BB[i-1][i-1-1]);
                Z = rotmul('right', Rr, i-1-1, i-1, Z);//mul(Z, Rr);
                AA = rotmul('right', Rr, i-1-1, i-1, AA);//mul(AA, Rr);
                BB = rotmul('right', Rr, i-1-1, i-1, BB);//mul(BB, Rr);
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
        return hess(A, B);
    }
    else
    {
        return hess(A, null, 1 < nargout);
    }
});
function eig_power(A)
{
    var e, d, v, w,
        eps = __(1e-10),
        n, N = ROWS(A),
        V = new Array(N),
        W = new Array(N),
        D = array(N, 0);

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
    return [realify(transpose(V)), realify(D), realify(transpose(W))];
}
fn.eig = varargout(function(nargout, A, nobalance) {
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("eig");
    if (is_matrix(nobalance)) not_supported("eig");
    var T = null;
    if ('nobalance' !== nobalance)
    {
        T = balance(A, 2, true);
        A = T[1];
        T = T[0];
    }
    // TODO implement more general and efficient eig routine
    if (1 < nargout)
    {
        var ans = eig_power(A);
        return [T ? mul(diag(T), ans[0]) : ans[0], diag(ans[1]), T ? mul(diag(T.map(function(ti) {return n_inv(ti);})), ans[2]) : ans[2]];
    }
    else
    {
        return realify((is_tri(A, 'upper', true, 1e-15) || is_tri(A, 'lower', true, 1e-15) ? array(ROWS(A), function(i) {
                return A[i][i];
            }) : roots(charpoly(A))).sort(function(a, b) {
                return scalar_abs(b) - scalar_abs(a);
            })
        );
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
        iter, max_iter = 50,
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
var __a1 =  0.254829592,
    __a2 = -0.284496736,
    __a3 =  1.421413741,
    __a4 = -1.453152027,
    __a5 =  1.061405429,
    __p  =  0.3275911;
update.push(function() {
    __a1 = __( 0.254829592);
    __a2 = __(-0.284496736);
    __a3 = __( 1.421413741);
    __a4 = __(-1.453152027);
    __a5 = __( 1.061405429);
    __p  = __( 0.3275911);
});
function erf(x)
{
    x = real(x);
    var t, sgn = realMath.sign(x) || 1;

    if (sgn < 0) x = n_neg(x);

    t = n_inv(n_add(n_mul(__p, x), I));
    return n_mul(sgn, n_sub(
    I, n_mul(n_add(n_mul(n_add(n_mul(n_add(n_mul(n_add(n_mul(__a5, t), __a4), t), __a3), t), __a2), t), __a1), n_mul(t, realMath.exp(n_neg(n_mul(x, x)))))));
}
fn.erf = function(x) {
    return apply(erf, x, true);
};
function mean(x, dim)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.length ? scalar_div(sum(x), __(x.length)) : nan;
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return mean(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return mean(ROW(x, row));
            });
        }
    }
    not_supported("mean");
}
fn.mean = mean;
function median(x, dim)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        if (!x.length) return nan;
        x = sort(x);
        return x.length & 1 ? x[(x.length >> 1)] : scalar_div(scalar_add(x[(x.length >> 1)], x[(x.length >> 1) - 1]), __(2));
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return median(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return median(ROW(x, row));
            });
        }
    }
    not_supported("median");
}
fn.median = median;
function mode(x, dim)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
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
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return mode(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return mode(ROW(x, row));
            });
        }
    }
    not_supported("mode");
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
    if (is_scalar(x))
    {
        return O;
    }
    else if (is_vector(x))
    {
        return 0 === x.length ? nan : (1 === x.length ? O : realMath.sqrt(scalar_div(sum(dotpow(abs(sub(x, mean(x))), __(2))), __(1 === w ? x.length : (x.length-1)))));
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return std(COL(x, column, w));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return std(ROW(x, row, w));
            });
        }
    }
    not_supported("std");
}
fn.std = std;
function variance(x, w, dim)
{
    w = _(w || 0);
    if (is_scalar(x))
    {
        return O;
    }
    else if (is_vector(x))
    {
        if (1 >= x.length) return x.length ? O : nan;
        var N = x.length,
            mu_x = mean(x),
            bar_x = sub(x, mu_x);
        return scalar_div(sum(dotmul(conj(bar_x), bar_x)), __(1 === w ? N : (N-1)));
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return variance(COL(x, column), w);
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return variance(ROW(x, row), w);
            });
        }
    }
    not_supported("var");
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
        else if (is_vector(a) && is_vector(b))
        {
            if (a.length !== b.length) throw "corrcoef: inputs not of same dimension";
            var N = a.length;
            return 1 < N ? scalar_div(sum(dotmul(dotdiv(sub(a, mean(a)), std(a)), dotdiv(sub(b, mean(b)), std(b)))), __(N-1)) : I;
        }
        else if (is_matrix(a) && is_matrix(b))
        {
            if ((ROWS(a) !== ROWS(b)) || (COLS(a) !== COLS(b))) throw "corrcoef: inputs not of same dimension";
            return array(COLS(a), function(column) {
                return corrcoef(COL(a, column), COL(b, column));
            });
        }
    }
    not_supported("corrcoef");
}
fn.corrcoef = corrcoef;
function conv(a, b)
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
        normalisation = __(1 / stdMath.sqrt(p)),
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
        del_f_i = __((inv ? -1 : 1) * stdMath.sin(2*pi*j/n));
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
var SQRT1_2 = stdMath.SQRT1_2;
update.push(function() {
    SQRT1_2 = __(stdMath.SQRT1_2);
});
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
        del_f_i = __((inv ? -1 : 1) * sine(w));
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

                output[l_index] = new complex(n_mul(n_add(left_r, right_r), SQRT1_2), n_mul(n_add(left_i, right_i), SQRT1_2));
                output[r_index] = new complex(n_mul(n_sub(left_r, right_r), SQRT1_2), n_mul(n_sub(left_i, right_i), SQRT1_2));

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
// adapted from https://github.com/foo123/FILTER.js
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
function mod(x, n)
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
fn.mod = mod;
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
function gcd(a, b, want_bezout_coeffs)
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
}
fn.gcd = varargout(function(nargout, a, b) {
    return gcd(a, b, 1 < nargout);
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
function lcm(a, b)
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
fn.lcm = lcm;var small_primes = [__(2),__(3),__(5),__(7),__(11),__(13),__(17),__(19),__(23),__(29),__(31),__(37),__(41),__(43),__(47),__(53),__(59),__(61),__(67),__(71),__(73),__(79),__(83),__(89),__(97),__(101),__(103),__(107),__(109)];

update.push(function() {
    small_primes = [__(2),__(3),__(5),__(7),__(11),__(13),__(17),__(19),__(23),__(29),__(31),__(37),__(41),__(43),__(47),__(53),__(59),__(61),__(67),__(71),__(73),__(79),__(83),__(89),__(97),__(101),__(103),__(107),__(109)];
});

function trial_div_fac(n, maxlimit)
{
    // adapted from https://github.com/foo123/Abacus
    var factors = [], n0 = n, i, l, p, p2;

    for (i=0,l=small_primes.length; i<l; ++i)
    {
        p = small_primes[i];
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
};fn.string = function string(x) {
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
fn.dec2bin = function dec2bin(x) {
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
// interpreter
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

var OP = {
    "[]": {
     name         : 'literal_array'
    ,arity        : 1
    ,fixity       : PREFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 0
    ,fn           : function(/*args..*/) {
                        var arr = [], row = [];
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
                                        arr = arr.length ? cat("vert", arr, row) : row;
                                    }
                                    else
                                    {
                                        arr.push(row);
                                    }
                                    row = [];
                                }
                            }
                            else
                            {
                                if (is_instance(arg, variable))
                                {
                                    row.push(arg);
                                }
                                else if (is_array(arg))
                                {
                                    row = row.length ? cat("horz", row, arg) : arg;
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
                                arr = arr.length ? cat("vert", arr, row) : row;
                            }
                            else if (arr.length)
                            {
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
    "(:)": {
     name         : 'colon'
    ,arity        : 1
    ,fixity       : POSTFIX
    ,associativity: LEFT
    ,commutativity: NONCOMMUTATIVE
    ,priority     : 30
    ,fn           : function(arg0) {
                        return colon(arg0);
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
                        return ctranspose(arg0);
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
                        return transpose(arg0);
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
    ,fixity       : INFIX
    ,associativity: LEFT
    ,commutativity: COMMUTATIVE
    ,priority     : 25
    ,fn           : function(arg0, arg1) {
                        return add(arg0, arg1);
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
                            return vars;
                        }
                        else
                        {
                            return await set_var(arg0, arg1.$scilitevarargout$ ? arg1[0] : arg1);
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

async function if_end($arg, v, $)
{
    var i, j, k, n, statements, res, ans = null;
    if (TRUE(await vale($arg['if'].cond, v, $)))
    {
        statements = $arg['if'].statements;
        for (i=0,n=statements.length; i<n; ++i)
        {
            res = await vale(statements[i], v, $);
            if (null != res) ans = res;
        }
        return ans;
    }
    if ($arg['elseif'].length)
    {
        for (j=0,k=$arg['elseif'].length; j<k; ++j)
        {
            if (TRUE(await vale($arg['elseif'][j].cond, v, $)))
            {
                statements = $arg['elseif'][j].statements;
                for (i=0,n=statements.length; i<n; ++i)
                {
                    res = await vale(statements[i], v, $);
                    if (null != res) ans = res;
                }
                return ans;
            }
        }
    }
    if ($arg['else'].statements.length)
    {
        statements = $arg['else'].statements;
        for (i=0,n=statements.length; i<n; ++i)
        {
            res = await vale(statements[i], v, $);
            if (null != res) ans = res;
        }
        return ans;
    }
}

async function for_end($arg, v, $)
{
    var i, n, j, k, res, ans = null,
        brk, is_break = false,
        cont, is_continue = false,
        values = await vale($arg.val, v, $),
        values_is_2d = false,
        statements = $arg.statements;
    if (is_array(values))
    {
        $ = $ || {};
        brk = $.brk;
        cont = $.cont;
        $.brk = function() {is_break = true;};
        $.cont = function() {is_continue = true;};
        values_is_2d = is_2d(values);
        for (j=0,k=values_is_2d?COLS(values):(values.length); j<k; ++j)
        {
            is_break = false;
            is_continue = false;
            await $arg.ind.set(values_is_2d ? COL(values, j) : values[j]);
            for (i=0,n=statements.length; i<n; ++i)
            {
                res = await vale(statements[i], v, $);
                if (is_break || is_continue) break;
                if (null != res) ans = res;
            }
            if (is_break) break;
            else if (is_continue) continue;
        }
        $.brk = brk;
        $.cont = cont;
    }
    return ans;
}

async function while_end($arg, v, $)
{
    var i, n, res, ans = null,
        brk, is_break = false,
        cont, is_continue = false,
        statements = $arg.statements;
    $ = $ || {};
    brk = $.brk;
    cont = $.cont;
    $.brk = function() {is_break = true;};
    $.cont = function() {is_continue = true;};
    while (TRUE(await vale($arg.cond, v, $)))
    {
        is_break = false;
        is_continue = false;
        for (i=0,n=statements.length; i<n; ++i)
        {
            res = await vale(statements[i], v, $);
            if (is_break || is_continue) break;
            if (null != res) ans = res;
        }
        if (is_break) break;
        else if (is_continue) continue;
    }
    $.brk = brk;
    $.cont = cont;
    return ans;
}

function variable(ctx, v, i)
{
    var self = this;
    if (!is_instance(self, variable)) return new variable(ctx, v, i);
    self.ctx = ctx;
    self.v = v;
    self.i = i;
}
variable.prototype = {
    constructor: variable,
    ctx: null,
    v: null,
    i: null,
    get: async function(orig) {
        var self = this, val, s, i;
        if (is_instance(self.v, expr))
        {
            val = await vale(self.v);
        }
        else
        {
            if (!HAS.call(self.ctx, self.v) && !HAS.call(constant, self.v))
            {
                throw 'undefined variable "'+self.v+'"';
            }
            val = HAS.call(self.ctx, self.v) ? self.ctx[self.v] : constant[self.v];
        }
        if ((true !== orig) && (null != self.i))
        {
            s = size(val);
            i = await Promise.all(self.i.map(function(ind, i) {
                return vale(ind, {end:1 === self.i.length ? s[0]*s[1] : s[i]});
            }));
            return get.apply(null, [val].concat(i));
        }
        return val;
    },
    set: async function(value) {
        var self = this, val, s, i;
        if (null != self.i)
        {
            if (is_instance(self.v, expr))
            {
                val = await vale(self.v);
            }
            else
            {
                if (!HAS.call(self.ctx, self.v)) throw 'undefined variable "'+self.v+'"';
                val = self.ctx[self.v];
            }
            s = size(val);
            i = await Promise.all(self.i.map(function(ind, i) {
                return vale(ind, {end:1 === self.i.length ? s[0]*s[1] : s[i]});
            }));
            if (1 === i.length) i = i.concat(null); // null crange
            set.apply(null, [val].concat(i).concat([value]));
        }
        else
        {
            if (is_instance(self.v, expr))
            {
                // nothing
            }
            else
            {
                self.ctx[self.v] = value;
            }
        }
        return self;
    },
    isset: function() {
        return is_string(this.v) && HAS.call(this.ctx, this.v);
    },
    isByRef: function() {
        return (null == this.i);
    }
};
async function val(x)
{
    return is_instance(x, variable) ? await x.get() : x;
}

function expr(op, arg)
{
    var self = this;
    if (!is_instance(self, expr)) return new expr(op, arg);
    if (null == arg)
    {
        arg = op;
        op = '';
    }
    self.op = op;
    self.arg = arg;
}
expr.prototype = {
    constructor: expr,
    op: null,
    arg: null
};
async function vale(x, v, $)
{
    if (is_instance(x, expr))
    {
        return await evaluate(x, v, $);
    }
    else if (is_array(x))
    {
        //return await Promise.all(x.map(function(xi) {return vale(xi, v, $);}));
        for (var i=0,n=x.length,y=new Array(n); i<n; ++i)
        {
            y[i] = await vale(x[i], v, $);
        }
        return y;
    }
    return x;
}

function parse(s, ctx, lineStart, posStart)
{
    var i = 0, l = 0, j, t = s;

    function error(msg, pos, ln)
    {
        if (null == ln) ln = l;
        if (null == pos) pos = i;
        var line = t.split("\n")[ln];
        msg = String(msg) + ' at line ' + String((lineStart||0)+ln) + ' position ' + String((posStart||0)+pos) + ':';
        return (msg + "\n" + line + "\n" + (new Array(pos+1)).join(' ') + '^' + "\n");
    }

    function parse_until(expected)
    {
        var match, m, n, c,
            op, term, arg,
            tmp, tmp2,
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
                    if (opc2.arity > terms.length)
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
                    result = expr(opc2.fn, args);
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
                    result = expr(opc.fn, args);
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
                            if (opc2.arity > terms.length)
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
                            result = expr(opc2.fn, args);
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

        function end(and_reset)
        {
            merge(true);
            if ((1 < terms.length) || (0 < ops.length)) throw error('mismatched terms and operators', ops.length ? ops[0][1] : i, ops.length ? ops[0][2] : l);
            if (true === and_reset)
            {
                if (is_instance(terms[0], expr)) statements.push(terms[0]);
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

        function findmatching(close, open, skipstring)
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
        }

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

        function array_literal()
        {
            var tmp, arg, entry, j = findmatching(']', '[', true);
            if (-1 === j) throw error('mismatched brackets');
            tmp = s.slice(0, j);
            if (/[\[\]]/.test(tmp))
            {
                arg = [];
                for (;;)
                {
                    entry = parse_until(',;]');
                    if (entry)
                    {
                        arg.push(entry);
                        if (eat(","))
                        {
                            arg.push(expr(','));
                        }
                        else if (eat(";"))
                        {
                            arg.push(expr(';'));
                        }
                        else
                        {
                            break;
                        }
                    }
                    else
                    {
                        break;
                    }
                }
                eat(/^\s+/);
                eat("]");
            }
            else
            {
                if (/[,;\n]/.test(tmp))
                {
                    arg = tmp.trim().split(/[;\n]/g).reduce(function(arg, row) {
                        var hasrow = arg.length, hascol = 0;
                        return row.trim().split(-1 < row.indexOf(',') ? ',' : /\s+/g).reduce(function(arg, col) {
                            col = parse(col.trim(), ctx, l+lineStart, i);
                            if (col)
                            {
                                if (hascol) arg.push(expr(','));
                                else if (hasrow) arg.push(expr(';'));
                                arg.push(col);
                                hascol = 1;
                            }
                            return arg;
                        }, arg);
                    }, []);
                }
                else
                {
                    arg = tmp.trim().split(/\s+/g).reduce(function(arg, col) {
                        col = parse(col.trim(), ctx, l+lineStart, i);
                        if (col)
                        {
                            if (arg.length) arg.push(expr(','));
                            arg.push(col);
                        }
                        return arg;
                    }, []);
                }
                s = s.slice(j+1);
                i += j+1;
                tmp = tmp.split("\n");
                if (1 < tmp.length)
                {
                    l += tmp.length-1;
                    tmp.slice(0, -1).forEach(function(ln) {
                        i -= ln.length+1/*\n*/;
                    });
                }
            }
            return expr(OP['[]'].fn, arg);
        }

        while (0 < s.length)
        {
            if (eat(/^if\b/))
            {
                end(true);
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
                        break;
                    }
                }
                statements.push(expr(if_end, arg));
                continue;
            }
            if (eat(/^for\b/))
            {
                end(true);
                if (match = eat(/^\s+([_a-z][_a-z0-9]*)\s*=\s*/i))
                {
                    // pass
                }
                else
                {
                    throw error('missing or invalid declaration in "for"');
                }
                tmp = parse_until("\n,");
                if (!tmp) throw error('missing or invalid declaration in "for"');
                if (eat("\n"))
                {
                    ++l;
                    i = 0;
                }
                else
                {
                    eat(',');
                }
                arg = {ind:variable(ctx, match[1]),val:tmp,statements:[]};
                for (;;)
                {
                    tmp = parse_until(['end']);
                    if (tmp) arg.statements = arg.statements.concat(tmp);
                    if (eat('end') || !tmp) break;
                }
                statements.push(expr(for_end, arg));
                continue;
            }
            if (eat(/^while\b/))
            {
                end(true);
                tmp = parse_until("\n,");
                if (!tmp) throw error('missing or invalid condition in "while"');
                if (eat("\n"))
                {
                    ++l;
                    i = 0;
                }
                else
                {
                    eat(',');
                }
                arg = {cond:tmp,statements:[]};
                for (;;)
                {
                    tmp = parse_until(['end']);
                    if (tmp) arg.statements = arg.statements.concat(tmp);
                    if (eat('end') || !tmp) break;
                }
                statements.push(expr(while_end, arg));
                continue;
            }
            if (match = eat(/^(continue|break|elseif|else|end)\b/, false))
            {
                if (expected && (-1 < expected.indexOf(match[1])))
                {
                    break;
                }
                else if ('continue' === match[1])
                {
                    eat('continue');
                    statements.push(expr('continue', ''));
                    continue;
                }
                else if ('break' === match[1])
                {
                    eat('break');
                    statements.push(expr('break', ''));
                    continue;
                }
                else if ('end' === match[1])
                {
                    eat('end');
                    terms.unshift(expr('v', variable(ctx, 'end')));
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
            if (eat(/^\s+/))
            {
                if (expected && (-1 < expected.indexOf(' ')))
                {
                    break;
                }
                else
                {
                    // space
                    continue;
                }
            }
            if (match = eat('%'))
            {
                // comment
                j = s.indexOf("\n");
                s = s.slice(-1 < j ? j+1 : s.length);
                if (-1 < j) ++l;
                i = 0;
                end(true);
                continue;
            }
            if ((match = eat("'")) || (match = eat('"')))
            {
                // string
                term = string_literal(match[0], true)[0];
                terms.unshift(expr("'" === match[0] ? term.split('') : term));
                continue;
            }
            if (match = eat(/^(&&|\|\|)[^&\|]/, 1))
            {
                // logical and/or
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
                // logical not
                ops.unshift(["~", i, l]);
                merge();
                continue;
            }
            if (match = eat('='))
            {
                // set
                ops.unshift(['=', i, l]);
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
            if (match = eat(/^([_a-z][_a-z0-9]*)\s*\(/i))
            {
                // function or matrix indexing
                m = match[1];
                if (eat(/^\s*\:\s*\)/))
                {
                    // single colon
                    term = expr('v', variable(ctx, m));
                    terms.unshift(term);
                    ops.unshift(['(:)', i, l]);
                    merge();
                }
                else
                {
                    arg = [];
                    for (;;)
                    {
                        tmp = parse_until(',)');
                        if (tmp) arg.push(tmp);
                        if (!eat(',')) break;
                    }
                    if (!eat(')')) throw error("mismatched parentheses");
                    if (HAS.call(fn, m))
                    {
                        // function
                        term = expr(fn[m], arg);
                    }
                    else
                    {
                        // matrix indexing
                        term = expr('v', variable(ctx, m, arg.length ? arg : null));
                    }
                    terms.unshift(term);
                }
                eat(/^[ \t\v\f]+/);
                if ((match = eat("'")) || (match = eat(".'")))
                {
                    // transpose
                    ops.unshift([match[0], i, l]);
                    merge();
                }
                continue;
            }
            if (match = eat(/^[_a-z][_a-z0-9]*/i))
            {
                // variable
                m = match[0];
                if (HAS.call(fn, m) && (0 === fn[m].length))
                {
                    // function without arguments
                    term = expr(fn[m], []);
                }
                else
                {
                    term = expr('v', variable(ctx, m));
                }
                terms.unshift(term);
                eat(/^[ \t\v\f]+/);
                if ((match = eat("'")) || (match = eat(".'")))
                {
                    // transpose
                    ops.unshift([match[0], i, l]);
                    merge();
                }
                continue;
            }
            if (match = eat(/^(-?\s*\d+(\.\d+)?([eE][+-]?\d+)?)([ij])?/))
            {
                // number
                arg = match[1].split(/\s+/).join('');
                if (decimal)
                {
                    // prefer default number for small integers
                    /*if (!/[\.eE]/.test(arg) && (arg.length < 6))
                    {
                        arg = parseFloat(arg, 10);
                    }
                    else
                    {*/
                        arg = decimal(arg);
                    /*}*/
                }
                else
                {
                    arg = parseFloat(arg, 10);
                }
                term = expr(match[4] ? (new complex(0, arg)) : arg);
                terms.unshift(term);
                continue;
            }
            if (match = eat(/^(-?\s*\.\d+([eE][+-]?\d+)?)([ij])?/))
            {
                // number, shorthand version
                arg = match[1].split(/\s+/).join('');
                arg = '-' === arg.charAt(0) ? ('-0'+arg.slice(1)) : ('0'+arg);
                if (decimal)
                {
                    // prefer default number for small integers
                    /*if (!/[\.eE]/.test(arg) && (arg.length < 6))
                    {
                        arg = parseFloat(arg, 10);
                    }
                    else
                    {*/
                        arg = decimal(arg);
                    /*}*/
                }
                else
                {
                    arg = parseFloat(arg, 10);
                }
                term = expr(match[4] ? (new complex(0, arg)) : arg);
                terms.unshift(term);
                continue;
            }
            c = s.charAt(0);
            if ('[' === c)
            {
                // bracket, literal array
                s = s.slice(1);
                i += 1;
                term = array_literal();
                if (term)
                {
                    terms.unshift(term);
                    eat(/^[ \t\v\f]+/);
                    if ((match = eat("'")) || (match = eat(".'")))
                    {
                        // transpose
                        ops.unshift([match[0], i, l]);
                        merge();
                    }
                }
                continue;
            }
            if (']' === c)
            {
                if ((expected) && (-1 < expected.indexOf(']')))
                {
                    // end bracket
                    break;
                }
                else
                {
                    throw error('mismatched brackets');
                }
            }
            if ('(' === c)
            {
                // paren
                s = s.slice(1);
                i += 1;
                if (eat(/^\s*\:\s*\)/))
                {
                    // single colon
                    ops.unshift(['(:)', i, l]);
                    merge();
                }
                else
                {
                    if (terms.length && can_merge())
                    {
                        merge('set');
                        term = terms.shift();
                        arg = [];
                        for (;;)
                        {
                            tmp = parse_until(',)');
                            if (tmp) arg.push(tmp);
                            if (!eat(',')) break;
                        }
                        if (!eat(')')) throw error("mismatched parentheses");
                        // matrix indexing
                        if (arg.length) term = expr('v', variable(ctx, term, arg));
                    }
                    else
                    {
                        term = parse_until(')');
                        if (!eat(')')) throw error("mismatched parentheses");
                    }
                    if (term)
                    {
                        terms.unshift(term);
                        eat(/^[ \t\v\f]+/);
                        if ((match = eat("'")) || (match = eat(".'")))
                        {
                            // transpose
                            ops.unshift([match[0], i, l]);
                            merge();
                        }
                    }
                }
                continue;
            }
            if (')' === c)
            {
                if ((expected) && (-1 < expected.indexOf(')')))
                {
                    // end paren
                    break;
                }
                else
                {
                    throw error('mismatched parentheses');
                }
            }
            if ((',' === c) && (expected) && (-1 < expected.indexOf(',')))
            {
                break;
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
                    terms.unshift(expr(':'));
                }
                for (;;)
                {
                    term = parse_until(':,)\n');
                    eat(/^[ \t\v\f]+/);
                    if (term) {terms.unshift(term); ++arg;}
                    else if (eat(':', false)) terms.unshift(expr(':'));
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

async function evaluate(e, v, $)
{
    var f, argout, nargout;
    if (is_instance(e, expr))
    {
        if ('' === e.op)
        {
            // value
            return e.arg;
        }
        else if ('v' === e.op)
        {
            // variable
            if (false === v)
            {
                return e.arg;
            }
            else if (is_instance(e.arg.v, expr))
            {
                return await val(e.arg);
            }
            else
            {
                return is_obj(v) && HAS.call(v, e.arg.v) ? v[e.arg.v] : await val(e.arg);
            }
        }
        else if (if_end === e.op)
        {
            // if .. else .. elseif .. end
            return await if_end(e.arg, v, $);
        }
        else if (for_end === e.op)
        {
            // for .. end loop
            return await for_end(e.arg, v, $);
        }
        else if (while_end === e.op)
        {
            // while .. end loop
            return await while_end(e.arg, v, $);
        }
        else if ('break' === e.op)
        {
            if ($ && is_callable($.brk)) $.brk();
            return;
        }
        else if ('continue' === e.op)
        {
            if ($ && is_callable($.cont)) $.cont();
            return;
        }
        else if (OP['='].fn === e.op)
        {
            // set
            $ = $ || {};
            nargout = $.nargout;
            argout = await evaluate(e.arg[0], false);
            if (is_array(argout) && is_instance(argout[0], variable))
            {
                $.nargout = argout.length; // variable output
            }
            if ((2 === e.arg.length) && ('v' === e.arg[1].op))
            {
                // A = B, A = B(:,:), ..
                // make sure a copy is set and not by reference
                return await e.op.apply(null, [argout, e.arg[1].arg.isByRef() ? copy(await evaluate(e.arg[1], v, $, true)) : await evaluate(e.arg[1], v, $, true)]);
            }
            else
            {
                // A = other expr
                return await e.op.apply(null, [argout].concat(await Promise.all(e.arg.slice(1).map(function(e) {return evaluate(e, v, $);}))));
            }
            $.nargout = nargout;
        }
        else if (is_callable(e.op))
        {
            // other operator
            f = $ && is_int($.nargout) && is_callable(e.op.nargout) ? e.op.nargout($.nargout) : e.op;
            return await f.apply(null, await Promise.all(e.arg.map(function(e) {return evaluate(e, v, $);})));
        }
    }
    throw "invalid expr";
}

$_.createContext = function() {
    return {ans: null};
};

$_.eval = async function(code, ctx, lineStart) {
    ctx = ctx || $_.createContext();
    var ast = parse(String(code), ctx, null == lineStart ? 1 : lineStart, 1);
    var ans = null, ans_changed = false;
    if (is_array(ast))
    {
        for (var i=0,n=ast.length; i<n; ++i)
        {
            if (ast[i])
            {
                ans = await evaluate(ast[i]);
                ans_changed = true;
            }
        }
    }
    else if (ast)
    {
        ans = await evaluate(ast);
        ans_changed = true;
    }
    if (ans_changed && (is_array(ans) || is_nan(ans) || is_scalar(ans) || is_string(ans))) ctx.ans = ans;
    return ans_changed ? ans : null;
};

// export it
return $;
});
