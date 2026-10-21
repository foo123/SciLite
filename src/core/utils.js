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
