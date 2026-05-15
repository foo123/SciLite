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
    if ((null != x) && x.$scilitedims$) return x.$scilitedims$.length === 1;
    return is_array(x) && is_scalar(x[0]);
}
$_.is_vector = is_vector;
function is_matrix(x)
{
    if ((null != x) && x.$scilitedims$) return x.$scilitedims$.length === 2;
    return is_array(x) && is_array(x[0]) && is_scalar(x[0][0]);
}
$_.is_matrix = is_matrix;
function is_0d(x)
{
    if ((null != x) && x.$scilitedims$) return x.$scilitedims$.length < 1;
    return !is_array(x);
}
function is_1d(x)
{
    if ((null != x) && x.$scilitedims$) return x.$scilitedims$.length < 2;
    return is_array(x) && !is_array(x[0]);
}
function is_2d(x)
{
    if ((null != x) && x.$scilitedims$) return x.$scilitedims$.length > 1;
    return is_array(x) && is_array(x[0]);
}
function is_nd(x)
{
    if ((null != x) && x.$scilitedims$) return x.$scilitedims$.length > 2;
    return is_array(x) && is_array(x[0]) && is_array(x[0][0]);
}
function array(n, v)
{
    n = stdMath.max(0, stdMath.round(n));
    var i, arr = new Array(n);
    for (i=0; i<n; ++i) arr[i] = is_callable(v) ? v(i, arr) : v;
    return arr;
}
$_.array = array;
function matrix(rows, cols, v)
{
    rows = stdMath.max(0, stdMath.round(rows));
    cols = stdMath.max(0, stdMath.round(cols));
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
    return dims.length ? array(dims[0], function(i, ndarr) {
        if (dims.length > 1)
        {
            return ndarray(dims.slice(1), function(j) {
                return is_callable(v) ? v([i].concat(j), ndarr) : v;
            }, true);
        }
        return is_callable(v) ? v([i], ndarr) : v;
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
$_.ndarray = ndarray;
function cellarray(array, dims)
{
    array.$scilitedims$ = dims || [];
    return array;
}
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
    else if (is_nd(x))
    {
        var sizex = size(x);
        if (arr_eq(sizex, array(sizex.length, 1)))
        {
            return sca(project(x, array(sizex.length, 0)), real);
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
    else if (is_2d(x) && !is_nd(x))
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
    if ((null != mat) && mat.$scilitedims$) return mat.$scilitedims$[0] || 1;
    return mat.length;
}
function COLS(mat)
{
    if ((null != mat) && mat.$scilitedims$) return mat.$scilitedims$[1] || 1;
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
function project(x, i, j)
{
    j = j || 0;
    if (is_array(x))
    {
        return ':' === i[j] ? x.map(function(xj) {return project(xj, i, j+1);}) : project(x[i[j]], i, j+1);
    }
    return x;
}
$_.project = project;

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
        if (ans instanceof Promise)
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
        return function(/*..args*/) {
            var args = [].slice.call(arguments), ans;
            args.unshift(nargout); // nargout=nargout
            ans = f.apply(null, args);
            if (ans instanceof Promise)
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
        var absx = scalar_abs(x);
        x = n_le(absx, 1e-5) && n_ge(absx, 1e-14) ? String(x) : (x.toFixed(4).replace(/\.0{4}$/, ''));
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
    else if (is_2d(x))
    {
        // 2d or nd array
        x = tensorview.stringify('tex', x, size(x), texify, $_.MAXPRINTSIZE, 1);
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
                x = "\\[" + texify(x) + "\\]";
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
    else if (is_2d(x))
    {
        // 2d or nd array
        x = tensorview.stringify('str', x, size(x), stringify, $_.MAXPRINTSIZE, 1);
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
                x = stringify(x);
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
