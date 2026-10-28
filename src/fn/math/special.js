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
    euler_gamma = parseFloat("0.57721566490153286060651209008240243104215933593992359")
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

euler_gamma = decimal ? decimal("0.57721566490153286060651209008240243104215933593992359") : parseFloat("0.57721566490153286060651209008240243104215933593992359");
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

    var two = constant['2'], x, fx, tol = eps;
    for (;;)
    {
        x = n_div(n_add(min_x, max_x), two);
        fx = f(x);
        if (is_nan(fx))
        {
            x = nan;
            break; // fails
        }
        if (n_gt(min_f, fx))
        {
            // possible overflow
            if (0 > dir)
            {
                min_x = x;
            }
            else
            {
                max_x = x;
            }
            continue;
        }
        if (n_lt(max_f, fx))
        {
            // possible overflow
            if (0 > dir)
            {
                max_x = x;
            }
            else
            {
                min_x = x;
            }
            continue;
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
            if (n_lt(n_sub(y, fx), tol) || n_lt(n_sub(max_x, min_x), tol)) break;
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

    var x = n_div(n_add(min_x, max_x), constant['2']), fx, dfx, max_iter = 100, tries, tol = eps;
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
        if (n_gt(n_sub(min_f, y), fx))
        {
            // possible overflow
            if (0 > dir)
            {
                min_x = x;
            }
            else
            {
                max_x = x;
            }
            x = n_div(n_add(min_x, max_x), constant['2']);
            max_iter += 2;
            continue;
        }
        if (n_lt(n_sub(max_f, y), fx))
        {
            // possible overflow
            if (0 > dir)
            {
                max_x = x;
            }
            else
            {
                min_x = x;
            }
            x = n_div(n_add(min_x, max_x), constant['2']);
            max_iter += 2;
            continue;
        }
        if (n_lt(scalar_abs(fx), tol))
        {
            break;
        }
        dfx = df(x); if (n_eq(O, dfx)) dfx = eps;
        x = n_sub(x, n_div(fx, dfx));
    }
    return x;
}
/*function agm(a, b)
{
    // arithmetic-geometric mean
    // https://en.wikipedia.org/wiki/Arithmetic%E2%80%93geometric_mean
    var a0, g0, a1, g1;
    if (n_eq(a, b)) return a;
    if (n_gt(a, b))
    {
        a0 = a;
        g0 = b;
    }
    else
    {
        a0 = b;
        g0 = a;
    }
    for (;;)
    {
        a1 = n_div(n_add(a0, g0), constant['2']);
        g1 = realMath.sqrt(n_mul(a0, g0));
        if (n_le(n_sub(a1, g1), eps)) return g1;
        a0 = a1;
        g0 = g1;
    }
}*/

// erf
function erf(x)
{
    // https://en.wikipedia.org/wiki/Error_function#Bounds_and_numerical_approximations
    x = real(x);
    if (is_nan(x)) return nan;
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
    if (is_nan(x)) return nan;
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
    if (is_nan(x) || n_lt(x, J) || n_gt(x, I)) return nan;
    return monotone_inverse_bisearch(
        erf,
        x, __(-1000), __(1000), J, I
    );
}

// erfcinv
function erfcinv(x)
{
    x = real(x);
    if (is_nan(x) || n_lt(x, O) || n_gt(x, constant['2'])) return nan;
    return monotone_inverse_bisearch(
        erfc,
        x, __(-1000), __(1000), O, constant['2'], -inf, inf, -1
    );
}

function factorial(n)
{
    // simple factorial
    // https://en.wikipedia.org/wiki/Factorial
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
    // simple log factorial
    // https://en.wikipedia.org/wiki/Factorial
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
    // binomial = B(n,m) = B(n-1,m-1)+B(n-1,m) = n!/m!(n-m)! = Gamma(n+1)/Gamma(k+1)Gamma(n-k+1)
    // https://en.wikipedia.org/wiki/Binomial_coefficient
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
    // log binomial = log(B(n,m)) = log(n!)-log(m!)-log((n-m)!) = LogGamma(n+1)-LogGamma(k+1)-LogGamma(n-k+1)
    // https://en.wikipedia.org/wiki/Binomial_coefficient
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
    if (is_nan(z) || n_lt(z, O)) return nan;
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
    if (is_nan(x) || is_nan(a) || n_lt(a, O)) return nan;
    type = 'scaledlower' === type || 'scaledupper' === type || 'upper' === type ? type : 'lower';
    if ((null == gammainc.a) || !n_eq(a, gammainc.a) || (type !== gammainc.type))
    {
        // memoize
        gammainc.type = type;
        gammainc.a = a;
        gammainc.g = 'scaledlower' === type || 'scaledupper' === type ? I : gamma(a);
        gammainc.g1 = 'scaledupper' === type ? gamma(n_add(a, I)) : I;
    }
    var Ga = 'scaledlower' === type || 'scaledupper' === type ? a : n_mul(n_div(n_pow(x, a), gammainc.g), realMath.exp(n_neg(x))),
        t = n_eq(Ga, a) ? I : n_div(Ga, a),
        g = t;
    for (var k=1,N=25,tol=eps; k<=N; ++k) // power series up to N terms
    {
        t = n_mul(t, n_div(x, n_add(a, k)));
        g = n_add(g, t);
        if ((5 < k) && n_lt(scalar_abs(t), tol)) break;
    }
    return 'scaledupper' === type ? n_sub(n_mul(gammainc.g1, n_div(realMath.exp(x), n_pow(x, a))), g) : ('upper' === type ? n_sub(I, g) : g);
}
function gammaincinv(y, a, type)
{
    // gammaincinv(y,a) inverse regularized incomplete gamma function
    // https://en.wikipedia.org/wiki/Incomplete_gamma_function
    if (!is_real(y) || !is_real(a)) return nan;
    y = real(y); a = real(a);
    if (is_nan(y) || is_nan(a) || n_lt(a, O) || n_lt(y, O) || n_gt(y, I)) return nan;
    type = 'upper' === type ? type : 'lower';
    var s = 'upper' === type ? -1 : 1;
    /*if ((null == gammaincinv.a) || !n_eq(a, gammaincinv.a) || (type !== gammaincinv.type))
    {
        // memoize
        gammaincinv.type = type;
        gammaincinv.a = a;
        gammaincinv.g = n_mul(gamma(a), -s);
    }
    return monotone_inverse_newton(
        function(x) {return gammainc(x, a, type);},
        function(x) {return n_div(n_mul(n_pow(x, n_sub(a, I)), realMath.exp(n_neg(x))), gammaincinv.g);},
        y, O, I, O, I, O, inf, s
    );*/
    return monotone_inverse_bisearch(
        function(x) {return gammainc(x, a, type);},
        y, O, __(10), O, I, O, inf, s
    );
}

function beta(z, w)
{
    // beta(z, w) function
    // https://en.wikipedia.org/wiki/Beta_function
    if (!is_real(z) || !is_real(w)) return nan;
    z = real(z); w = real(w);
    if (is_nan(z) || is_nan(w) || n_lt(z, O) || n_lt(w, O)) return nan;
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
    if (is_nan(z) || is_nan(w) || n_lt(z, O) || n_lt(w, O)) return nan;
    if (is_int(z) && is_int(w))
    {
        // reduces to inverse log-binomial coeff
        return n_add(realMath.log(n_add(z, w)), n_sub(logbinom(n_add(z, w), w, 'inverse'), realMath.log(n_mul(z, w))));
    }
    return scalar_add(scalar_sub(gammaln(z), gammaln(scalar_add(z, w))), gammaln(w));
}
function _betainc_cont_frac(x, z, w, factor)
{
    var p, q, p1, p0,
        q1, q0, r0, r,
        m, k, ak, bk,
        tol = eps
    ;
    p1 = I;
    p0 = O;
    q1 = O;
    q0 = I;
    bk = I;
    ak = n_div(n_mul(n_div(n_pow(x, z), z), n_pow(n_sub(I, x), w)), null == factor ? I : factor);
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

        if ((5 < k) && n_lt(scalar_abs(n_sub(r, r0)), tol)) break;

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

    if (is_nan(x) || is_nan(z) || is_nan(w) || n_lt(x, O) || n_gt(x, I) || n_lt(z, O) || n_lt(w, O)) return nan;

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
    if ((null == betainc.z) || !n_eq(z, betainc.z) || !n_eq(w, betainc.w))
    {
        // memoize
        betainc.z = z;
        betainc.w = w;
        betainc.b = null;
        betainc.d = null;
    }
    if (n_ge(x, xt))
    {
        if (null == betainc.d) betainc.d = beta(w, z);
        // use reflection, more efficient
        b = n_sub(I, _betainc_cont_frac(n_sub(I, x), w, z, betainc.d));
    }
    else
    {
        if (null == betainc.b) betainc.b = beta(z, w);
        // converges rapidly for x < xt
        b = _betainc_cont_frac(x, z, w, betainc.b);
    }
    return 'upper' === tail ? n_sub(I, b) : b;
}
function betaincinv(y, z, w, tail)
{
    // betaincinv(y,z,w) inverse regularized incomplete beta function
    // https://en.wikipedia.org/wiki/Beta_function
    if (!is_real(y) || !is_real(z) || !is_real(w)) return nan;
    y = real(y); z = real(z); w = real(w);

    if (s_nan(y) || is_nan(z) || is_nan(w) || n_lt(y, O) || n_gt(y, I) || n_lt(z, O) || n_lt(w, O)) return nan;
    if ((null == betaincinv.z) || !n_eq(z, betaincinv.z) || !n_eq(w, betaincinv.w))
    {
        // memoize
        betaincinv.z = z;
        betaincinv.w = w;
        betaincinv.b = beta(z, w);
    }
    var s = 'upper' === tail ? -1 : 1, b = n_mul(betaincinv.b, s);
    return monotone_inverse_newton(
        function(x) {return betainc(x, z, w, tail);},
        function(x) {return n_div(n_mul(n_pow(x, n_sub(z, I)), n_pow(n_sub(I, x), n_sub(w, I))), b);},
        y, O, I, O, I, O, I, s
    );
}

function ellipj(u, m, tol, nargout)
{
    // Jacobi elliptic functions sn, cn, dn
    // https://en.wikipedia.org/wiki/Jacobi_elliptic_functions
    var a0, g0, aN, gN,
        l, d, y0, y1, x0,
        x1, x2, q, K, K2,
        _sn, _cn, _dn, sn, cn, dn,
        sn_sgn = I, cn_sgn = I, dn_sgn = I,
        shifted = 0;
    if (is_nan(u) || is_nan(m) || n_lt(m, O) || n_gt(m, I))
    {
        return 1 < nargout ? [nan, nan, nan] : nan;
    }
    else if (n_eq(u, O))
    {
        return 2 < nargout ? [O, I, I] : (1 < nargout ? [O, I] : O);
    }
    else if (n_eq(m, O))
    {
        return 2 < nargout ? [realMath.sin(u), realMath.cos(u), I] : (1 < nargout ? [realMath.sin(u), realMath.cos(u)] : realMath.sin(u));
    }
    else if (n_eq(m, I))
    {
        return 2 < nargout ? [realMath.tanh(u), cn=n_div(I, realMath.cosh(u)), cn] : (1 < nargout ? [realMath.tanh(u), n_div(I, realMath.cosh(u))] : realMath.tanh(u));
    }
    if ((null == ellipj.m) || !n_eq(m, ellipj.m) || !n_eq(tol, ellipj.tol))
    {
        x1 = I;
        x2 = realMath.sqrt(n_sub(I, m));
        if (n_ge(x1, x2))
        {
            aN = x1;
            gN = x2;
        }
        else
        {
            aN = x2;
            gN = x1;
        }
        l = null;
        d = scalar_abs(n_sub(aN, gN));
        for (;n_gt(d, tol);)
        {
            // arithmetic-geometric mean loop
            a0 = aN; g0 = gN;
            aN = n_div(n_add(a0, g0), constant['2']);
            gN = realMath.sqrt(n_mul(a0, g0));
            d = scalar_abs(n_sub(aN, gN));
            l = {ac:n_mul(aN, n_div(d, constant['2'])), p:l}; // after new d produces correct results
        }
        // memoize
        ellipj.m = m;
        ellipj.tol = tol;
        ellipj.x2 = x2;
        ellipj.aN = aN;
        ellipj.l = l;
        ellipj.K2 = K2 = n_div(constant.pi, aN);
        ellipj.K = K = n_div(K2, constant['2']);
    }
    else
    {
        // memoized
        x2 = ellipj.x2;
        aN = ellipj.aN;
        l = ellipj.l;
        K2 = ellipj.K2;
        K = ellipj.K;
    }
    // reduce to 0 <= u <= K(m) range through symmetry, shifts and periodicity
    if (n_lt(u, O))
    {
        u = n_neg(u);
        sn_sgn = n_mul(sn_sgn, J);
    }
    // 0 <= u
    if (n_ge(u, K2))
    {
        q = realMath.fix(n_div(u, K2));
        u = n_sub(u, n_mul(q, K2));
        q = n_eq(O, n_mod(scalar_abs(q), constant['2'])) ? I : J;
        sn_sgn = n_mul(sn_sgn, q);
        cn_sgn = n_mul(cn_sgn, q);
    }
    // 0 <= u <= 2K(m)
    if (n_ge(u, K))
    {
        u = n_sub(u, K);
        shifted = 1;
    }
    // 0 <= u <= K(m)
    if (n_eq(u, O))
    {
        // u = 0
        _sn = O;
        _cn = I;
        _dn = I;
    }
    else if (n_eq(u, K))
    {
        // u = K(m)
        _sn = I;
        _cn = O;
        _dn = x2;
    }
    else
    {
        // 0 < u < K(m), 0 < m < 1
        y1 = n_div(aN, realMath.sin(n_mul(aN, u)));
        for (;l;)
        {
            y0 = n_add(y1, n_div(l.ac, y1));
            y1 = y0; l = l.p;
        }
        y0 = n_add(y1, n_div(n_div(m, 4), y1));

        x0 = n_div(I, y0);
        _sn = x0;
    }
    if (shifted)
    {
        if (null == _cn)
        {
            _cn = realMath.sqrt(n_sub(I, x0=n_mul(x0, x0)));
            _dn = realMath.sqrt(n_sub(I, n_mul(m, x0)));
        }
        sn = n_div(_cn, _dn);
        sn = n_mul(sn_sgn, sn);
        if (1 < nargout)
        {
            cn = n_neg(n_mul(x2, n_div(_sn, _dn)));
            cn = n_mul(cn_sgn, cn);
            if (2 < nargout)
            {
                dn = n_div(x2, _dn);
                dn = n_mul(dn_sgn, dn);
            }
        }
    }
    else
    {
        sn = _sn;
        sn = n_mul(sn_sgn, sn);
        if (1 < nargout)
        {
            cn = null == _cn ? realMath.sqrt(n_sub(I, x0=n_mul(x0, x0))) : _cn;
            cn = n_mul(cn_sgn, cn);
            if (2 < nargout)
            {
                dn = null == _dn ? realMath.sqrt(n_sub(I, n_mul(m, x0))) : _dn;
                dn = n_mul(dn_sgn, dn);
            }
        }
    }
    return 2 < nargout ? [sn, cn, dn] : (1 < nargout ? [sn, cn] : sn);
}
function ellipke(m, tol, nargout)
{
    // complete elliptic integral of 1st and 2nd kind
    // https://en.wikipedia.org/wiki/Elliptic_integral
    var a0, g0, a1, g1, c0, c1, x1, x2,
        p2 = constant['1/2'], s = I, ellip1;
    if (is_nan(m) || n_lt(m, O) || n_gt(m, I))
    {
        return 1 < nargout ? [nan, nan] : nan;
    }
    else if (n_eq(m, O))
    {
        ellip1 = n_div(constant.pi, constant['2']);
        return 1 < nargout ? [ellip1, ellip1] : ellip1;
    }
    else if (n_eq(m, I))
    {
        return 1 < nargout ? [inf, I] : inf;
    }
    x1 = I;
    x2 = realMath.sqrt(n_sub(I, m));
    if (n_ge(x1, x2))
    {
        a0 = x1;
        g0 = x2;
    }
    else
    {
        a0 = x2;
        g0 = x1;
    }
    if (1 < nargout)
    {
        c0 = scalar_abs(n_sub(n_mul(a0, a0), n_mul(g0, g0)));
        s = n_sub(s, n_mul(c0, p2));
    }
    for (;n_gt(scalar_abs(n_sub(a0, g0)), tol);)
    {
        // arithmetic-geometric mean loop
        a1 = n_div(n_add(a0, g0), constant['2']);
        g1 = realMath.sqrt(n_mul(a0, g0));
        a0 = a1;
        g0 = g1;
        if (1 < nargout)
        {
            c1 = n_div(c0, n_mul(a1, 4));
            c0 = n_mul(c1, c1);
            p2 = n_mul(p2, constant['2']);
            s = n_sub(s, n_mul(c0, p2));
        }
    }
    ellip1 = n_div(constant.pi, n_mul(constant['2'], a0));
    return 1 < nargout ? [ellip1, n_mul(ellip1, s)] : ellip1;
}

function err_negligible(curr, prev, tol)
{
    var err = scalar_sub(curr, prev);
    return n_le(scalar_abs(real(err)), n_mul(tol, scalar_abs(real(curr)))) && n_le(scalar_abs(imag(err)), n_mul(tol, scalar_abs(imag(curr))));
}
function _ei_power_series(z, tol)
{
    var modz = scalar_abs(z),
        ei, old, tmp = 1, k;
    ei = scalar_add(scalar_add(euler_gamma, realMath.log(modz)), complex(O, n_mul(realMath.sign(imag(z)), scalar_abs(scalar_angle(z)))));
    for (k=1; k<=/*MAX_ITERATIONS*/24; ++k)
    {
        tmp = scalar_mul(tmp, scalar_div(z, k));
        old = ei;
        ei = scalar_add(ei, scalar_div(tmp, k));
        if (err_negligible(ei, old, tol)) break;
    }
    return ei;
}
function _ei_asymptotic_series(z, tol)
{
    var ei = complex(O, n_mul(realMath.sign(imag(z)), constant.pi)),
        tmp = scalar_div(fn.exp(z), z),
        k, n = _(realMath.floor(scalar_abs(z)))+1;
    for (k=1; k<=n; ++k)
    {
        old = ei;
        ei = scalar_add(ei, tmp);
        if (err_negligible(ei, old, tol)) return ei;
        tmp = scalar_mul(tmp, scalar_div(k, z));
    }
    return false;
}
function _ei_continued_fraction_backward(z, tol)
{
    var ei = O, expz = fn.exp(z), ipi = complex(O, n_mul(realMath.sign(imag(z)), constant.pi)), k;
    for (k=/*MAX_ITERATIONS*/24; k>=1; --k)
    {
        ei = scalar_div(-k*k, scalar_add(scalar_sub(2*k+1, z), ei));
        ei = scalar_sub(ipi, scalar_div(expz, scalar_add(scalar_sub(I, z), ei)));
    }
    return ei;
}
function _ei_continued_fraction_forward(z, tol)
{
    var ei = complex(O, n_mul(realMath.sign(imag(z)), constant.pi)),
        old, expz = fn.exp(z), c, d, k, k2, kk;
    if (!n_eq(ei.im, O))
    {
        c = scalar_div(I, ei);
        d = O;
        c = scalar_div(I, scalar_sub(scalar_sub(I, z), scalar_mul(expz, c)));
        d = scalar_div(I, scalar_sub(scalar_sub(I, z), scalar_mul(expz, d)));
        ei = scalar_mul(ei, scalar_div(d, c));
    }
    else
    {
        c = inf;
        d = O;
        c = O;
        d = scalar_div(I, scalar_sub(scalar_sub(I, z), scalar_mul(expz, d)));
        ei = scalar_mul(d, scalar_neg(expz));
    }
    for (k=1; k<=/*MAX_ITERATIONS*/24; ++k)
    {
        k2 = 2*k+1;
        kk = k*k;
        c = scalar_div(I, scalar_sub(scalar_sub(k2, z), scalar_mul(kk, c)));
        d = scalar_div(I, scalar_sub(scalar_sub(k2, z), scalar_mul(kk, d)));
        old = ei;
        ei = scalar_mul(ei, scalar_div(d, c));
        if (err_negligible(ei, old, tol)) break;
    }
    return ei;
}
function Ei(z)
{
    // exponential integral Ei(z)
    // "On the Evaluation of the Complex-Valued Exponential Integral", Vincent Pegoraro and Philipp Slusallek, 2011
    if ((is_complex(z) && (is_nan(z.re) || is_nan(z.im))) || (is_real(z) && is_nan(z)))
    {
        return z;
    }
    var modz = scalar_abs(z), ei, tol = eps, DIST = 1;
    if (n_lt(n_div(I, modz), eps)/*is_inf(modz)*/)
    {
        return scalar_add(complex(O, n_mul(realMath.sign(imag(z)), constant.pi)), scalar_div(fn.exp(z), z));
    }
    if (n_gt(modz, n_sub(2, n_mul(1.035, realMath.log(tol)))))
    {
        ei = _ei_asymptotic_series(z, tol);
        if (false !== ei) return ei;
    }
    if (n_gt(modz, DIST) && (n_lt(real(z), O) || n_gt(scalar_abs(imag(z)), DIST)))
    {
        return _ei_continued_fraction_forward(z, tol);
    }
    if (n_gt(modz, O))
    {
        return _ei_power_series(z, tol);
    }
    if (n_eq(modz, O))
    {
        return -inf;
    }
    return nan;
}
function E1(z)
{
    // exponential integral E1(z)
    // Ei(z) = -(E1(−z) + sgn(arg(-z))*i*pi)
    // E1(z) = -(Ei(-z) + sgn(arg( z))*i*pi)
    return scalar_neg(scalar_add(Ei(scalar_neg(z)), complex(O, n_mul(realMath.sign(scalar_angle(z)), constant.pi))));
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
fn.ellipj = varargout(function(nargout, u, m, tol) {
    tol = __(tol || eps);
    if (n_lt(tol, eps)) tol = eps; // otherwise too slow
    return apply_(function(u, m) {return ellipj(u, m, tol, nargout);}, [u, m], real, stdMath.min(3, nargout));
});
fn.ellipke = varargout(function(nargout, m, tol) {
    tol = __(tol || eps);
    if (n_lt(tol, eps)) tol = eps; // otherwise too slow
    return apply_(function(m) {return ellipke(m, tol, nargout);}, [m], real, stdMath.min(2, nargout));
});
fn.expint = function(z) {
    return apply(E1, z, true);
};
fn.expinti = function(z) {
    return apply(Ei, z, true);
};
