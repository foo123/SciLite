// some special functions, eg gamma, gammainc, ..

// Constant g and Coefficients p_k(g)
var __G = 7,
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
    ]
;
update.push(function() {
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
});
function factorial(n)
{
    // simple factorial
    if (n_ge(n, O))
    {
        n = realMath.floor(n);
        var f = n_eq(n, O) ? I : n;
        for (n=n_sub(n, I);n_gt(n, I);n=n_sub(n, I)) f = n_mul(f, n);
        return f;
    }
    return nan;
}
fn.factorial = function(n) {
    return apply(factorial, n, false);
};

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
            return factorial(z); // reduces to simple factorial
        }
        else
        {
            var t = scalar_add(scalar_add(z, __G), constant['1/2']),
                x = __gP.reduce(function(sum, pk, k) {
                    return scalar_add(sum, 0 === k ? pk : scalar_div(pk, scalar_add(z, k)));
                }, O);
            return scalar_mul(scalar_mul(realMath.sqrt(n_mul(constant['2'], constant.pi)), scalar_pow(t, scalar_add(z, constant['1/2']))), scalar_mul(fn.exp(scalar_neg(t)), x));
        }
    }
}
fn.gamma = function(x) {
    return apply(gamma, x, true);
};

function gammainc(x, a, type)
{
    // gammainc(x,a) regularized incomplete gamma function
    // https://en.wikipedia.org/wiki/Incomplete_gamma_function
    if (!is_real(x) || !is_real(a) || lt(a, O)) return nan;
    x = real(x); a = real(a);
    // TODO handle 'scaledlower', 'scaledupper'
    var Gamma_a = gamma(a),
        G_a = n_mul(n_div(n_pow(x, a), Gamma_a), realMath.exp(n_neg(x))),
        t = n_div(G_a, a),
        g = t, eps = __(1e-12);
    for (var k=1; k<20; ++k) // power series up to 20 terms
    {
        t = n_mul(t, n_div(x, n_add(a, k)));
        if (n_le(t, eps)) break;
        g = n_add(g, t);
    }
    return 'upper' === type ? n_sub(Gamma_a, g) : g;
}
fn.gammainc = function(x, a, type) {
    return apply_(function(x, a) {return gammainc(x, a, type);}, [x, a]);
};

function monotone_inverse_bisearch(f, y, min_x, max_x, lim_0, lim_1, eps)
{
    // find inverse x s.t f(x) <= y
    // using binary search between min_x and max_x
    if (is_nan(y)) return nan;
    else if (n_le(y, O)) return null == lim_0 ? -inf : lim_0;
    else if (n_ge(y, I)) return null == lim_1 ? inf : lim_1;

    eps = __(eps || 1e-12);
    var two = constant['2'], x, fx;
    for (;;)
    {
        x = n_div(n_add(min_x, max_x), two);
        fx = f(x);
        if (n_gt(fx, y))
        {
            max_x = x;
        }
        else if (n_lt(fx, y))
        {
            if (n_le(n_sub(y, fx), eps) || n_le(n_sub(max_x, min_x), eps)) break;
            min_x = x;
        }
        else
        {
            break;
        }
    }
    return x;
}
function gammaincinv(y, a, type)
{
    // gammainc(x,a) inverse regularized incomplete gamma function
    // https://en.wikipedia.org/wiki/Incomplete_gamma_function
    if (!is_real(y) || !is_real(a) || lt(a, O)) return nan;
    y = real(y); a = real(a);
    return monotone_inverse_bisearch(function(x) {return gammainc(x, a, type);}, y, -1000, 1000);
}
fn.gammaincinv = function(y, a, type) {
    return apply_(function(y, a) {return gammaincinv(y, a, type);}, [y, a]);
};
