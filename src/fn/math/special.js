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
/*function series_sum(terms, n, eps)
{
    var gen = terms, k, ak, s = O;
    // terms must be function or array
    if (is_array(terms))
    {
        gen = function(k) {return terms[k];};
        n = terms.length-1;
    }
    else if (null == n)
    {
        n = inf;
        eps = eps || __eps;
    }
    for (k=0; k<=n; ++k)
    {
        ak = gen(k);
        s = scalar_add(s, ak);
        if ((null != eps) && n_le(scalar_abs(ak), eps)) break;
    }
    return s;
}*/
/*function continued_fraction(terms, n, eps)
{
    /*
    https://en.wikipedia.org/wiki/Continued_fraction#Formulation
    x=b_{0}+{\cfrac {a_{1}}{b_{1}+{\cfrac {a_{2}}{b_{2}+{\cfrac {a_{3}}{b_{3}+{\cfrac {a_{4}}{b_{4}+\ddots \,}}}}}}}}

    nth convergents p/q for n >= 1 are (recursively):
    p = b_n*p0 + a_n*p1,
    q = b_n*q0 + a_n*q1,

    with initial values:
    p1 = 1, p0 = b_0,
    q1 = 0, q0 = 1
    * /
    var gen = terms,
        p, q, p1, p0,
        q1, q0, r0, r,
        k, abk, ak, bk
    ;
    // terms must be function or array
    if (is_array(terms))
    {
        gen = function(k) {return terms[k];};
        n = terms.length-1;
    }
    else if (null == n)
    {
        n = inf;
        eps = eps || __eps;
    }
    abk = gen(0);
    p1 = I;
    p0 = abk.b;
    q1 = O;
    q0 = I;
    for (k=1; k<=n; ++k)
    {
        abk = gen(k);
        ak = abk.a;
        bk = abk.b;
        p = scalar_add(scalar_mul(bk, p0), scalar_mul(ak, p1));
        q = scalar_add(scalar_mul(bk, q0), scalar_mul(ak, q1));
        r = scalar_div(p, q);

        if ((null != eps) && (5 < k) && n_le(scalar_abs(scalar_sub(r, r0)), eps)) break;

        p1 = p0; p0 = p;
        q1 = q0; q0 = q;
        r0 = r;
    }
    return r;
}*/

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
        return scalar_sub(scalar_sub(__log_pi, fn.log(fn.sin(scalar_mul(constant.pi, z)))), gammaln(scalar_sub(I, z)));
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
        k, ak, bk, m
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
