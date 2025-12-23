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
function is_nd(x)
{
    return is_array(x) && is_array(x[0]) && is_array(x[0][0]);
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
function ndarray(dims, v)
{
    return dims.length ? array(dims[0], function(i) {
        if (dims.length > 1)
        {
            return ndarray(dims.slice(1), function(j) {
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
    if (null == x)
    {
        return x;
    }
    else if (is_2d(x))
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
    return ("number" === typeof x) ? x : (is_decimal(x) ? (x.$valueOf()) : (is_complex(x) ? x.valueOf() : x));
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
