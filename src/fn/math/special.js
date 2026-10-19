// some special functions, eg erf, erfc, gamma, gammaln, gammainc, beta, betaln, betainc, ..
// TODO add more and/or improve accuracy if needed
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
    __12 = 12
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

__12 = __(12);
});

function monotone_inverse_bisearch(f, y, min_x, max_x, lim_0, lim_1, dir, eps)
{
    // find inverse x s.t f(x) <= y, f() is monotone
    // using binary search between min_x and max_x
    if (is_nan(y)) return nan;
    else if (n_le(y, O)) return null == lim_0 ? -inf : lim_0;
    else if (n_ge(y, I)) return null == lim_1 ? inf : lim_1;

    eps = __(eps || 1e-12);
    dir = -1 === dir ? -1 : 1; // increasing or decreasing
    var two = constant['2'], x, fx;
    for (;;)
    {
        x = n_div(n_add(min_x, max_x), two);
        fx = f(x);
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
            if (n_le(n_sub(y, fx), eps) || n_lt(n_sub(max_x, min_x), eps)) break;
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

function factorial(n)
{
    // simple factorial
    if (n_ge(n, O))
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
    return nan;
}
function logfactorial(n)
{
    // simple log factorial
    if (n_ge(n, O))
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
    return nan;
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
            return factorial(z); // reduces to simple factorial
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
        return scalar_sub(scalar_sub(realMath.log(constant.pi), realMath.log(fn.sin(scalar_mul(constant.pi, z)))), gammaln(scalar_sub(I, z)));
    }
    else
    {
        z = scalar_sub(z, I);
        if (is_int(z) && n_ge(z, O))
        {
            return logfactorial(z); // reduces to simple log factorial
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
        g = t, eps = __(1e-15);
    for (var k=1,N=25; k<=N; ++k) // power series up to N terms
    {
        t = n_mul(t, n_div(x, n_add(a, k)));
        g = n_add(g, t);
        if ((k > 5) && n_le(scalar_abs(t), eps)) break;
    }
    return 'scaledupper' === type ? n_sub(n_mul(gamma(n_add(a, I)), n_div(realMath.exp(x), n_pow(x, a))), g) : ('upper' === type ? n_sub(I, g) : g);
}
function gammaincinv(y, a, type)
{
    // gammaincinv(y,a) inverse regularized incomplete gamma function
    // https://en.wikipedia.org/wiki/Incomplete_gamma_function
    // NEEDS FIX
    if (!is_real(y) || !is_real(a)) return nan;
    y = real(y); a = real(a);
    if (n_lt(a, O) || n_lt(y, O) || n_gt(y, I)) return nan;
    return monotone_inverse_bisearch(function(x) {return gammainc(x, a, type);}, y, O, __(1e6), O, inf, 'upper' === type ? -1 : 1);
}

function beta(z, w)
{
    // beta(z, w) function
    // https://en.wikipedia.org/wiki/Beta_function
    if (!is_real(z) || !is_real(w)) return nan;
    z = real(z); w = real(w);
    if (n_lt(z, O) || n_lt(w, O)) return nan;
    if (n_eq(z, O) || n_eq(w, O)) return n_eq(z, w) ? nan : inf;
    return scalar_div(scalar_mul(gamma(z), gamma(w)), gamma(scalar_add(z, w)));
}
function betaln(z, w)
{
    // log-beta(z, w) function
    // https://en.wikipedia.org/wiki/Beta_function
    if (!is_real(z) || !is_real(w)) return nan;
    z = real(z); w = real(w);
    if (n_lt(z, O) || n_lt(w, O)) return nan;
    return scalar_sub(scalar_add(gammaln(z), gammaln(w)), gammaln(scalar_add(z, w)));
}
function betainc(x, z, w, tail)
{
    // incomplete beta(x, z, w) function
    // https://en.wikipedia.org/wiki/Beta_function
    // NEEDS FIX
    if (!is_real(x) || !is_real(z) || !is_real(w)) return nan;
    x = real(x); z = real(z); w = real(w);
    if (n_lt(x, O) || n_gt(x, I) || n_lt(z, O) || n_lt(w, O)) return nan;
    if (
    n_gt(x, n_div(n_add(z, I), n_add(n_add(z, w), constant['2']))) ||
    n_lt(n_sub(I, x), n_div(n_add(w, I), n_add(n_add(z, w), constant['2'])))
    )
    {
        // use symmetric relation, more efficient
        return n_sub(I, n_mul(n_div(beta(w, z), beta(z, w)), betainc(n_sub(I, x), w, z, tail)));
    }
    var a1 = n_mul(n_div(n_pow(x, z), z), n_pow(n_sub(I, x), w)),
        p, q,
        p_1 = I, p_0 = O,
        q_1 = O, q_0 = I,
        r0, r,
        dm, am, bm, m,
        eps = __(1e-15)
    ;

    // continued fraction expansion evaluation
    // converges rapidly for the range of interest
    /*
    x=b_{0}+{\cfrac {a_{1}}{b_{1}+{\cfrac {a_{2}}{b_{2}+{\cfrac {a_{3}}{b_{3}+{\cfrac {a_{4}}{b_{4}+\ddots \,}}}}}}}}
    nth convergents p/q for n >= 1
    p = b_n*p_0 + a_n*p_1,
    q = b_n*q_0 + a_n*q_1,
    with initial values
    p_1 = 1, p_0 = b_0,
    q_1 = 0, q_0 = 1
    */
    for (m=0;;++m)
    {
        bm = I;
        if (0 === m)
        {
            dm = a1;
        }
        else if (m & 1)
        {
            dm = n_neg(n_div(n_mul(n_mul(x, n_add(z, m)), n_add(n_add(z, w), m)), n_mul(n_add(z, 2*m), n_add(z, 2*m+1))));
        }
        else
        {
            dm = n_div(n_mul(x, n_mul(n_sub(w, m), m)), n_mul(n_add(z, 2*m), n_add(z, 2*m-1)));
        }
        am = dm;
        p = n_add(n_mul(bm, p_0), n_mul(am, p_1));
        q = n_add(n_mul(bm, q_0), n_mul(am, q_1));
        r = n_div(p, q);

        if ((8 < m) && n_le(scalar_abs(n_sub(r, r0)), eps)) break;

        p_1 = p_0; p_0 = p;
        q_1 = q_0; q_0 = q;
        r0 = r;
    }
    r = n_div(r, beta(z, w));
    return 'upper' === tail ? n_sub(I, r) : r;
}

// add them
fn.erf = function(x) {
    return apply(erf, x, true);
};
fn.erfc = function(x) {
    return apply(erfc, x, true);
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
