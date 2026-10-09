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
    var N = a.length;
    return 1 < N ? scalar_div(sum(dotmul(dotdiv(sub(a, mean(a)), std(a)), dotdiv(sub(b, mean(b)), std(b)))), __(N-1)) : I;
}
function spearman(a, b)
{
    return pearson(tiedrank(a), tiedrank(b));
}
function kendall(a, b)
{
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

// distributions
function cdf(pdf, min_x, max_x, n)
{
    // compute cdf from pdf between min_x and max_x
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
    eps = __(eps || 1e-12);
    return n_div(n_sub(cdf(n_add(x, eps)), cdf(n_sub(x, eps))), n_mul(constant['2'], eps));
}
function icdf(cdf, y, min_x, max_x, lim_0, lim_1, eps)
{
    // find icdf quantile x s.t cdf(x) <= y by bisection between min_x and max_x
    if (n_le(y, O)) return null == lim_0 ? -inf : lim_0;
    else if (n_ge(y, I)) return null == lim_1 ? inf : lim_1;

    eps = __(eps || 1e-12);
    var two = constant['2'], x, cdfx;
    for (;;)
    {
        x = n_div(n_add(min_x, max_x), two);
        cdfx = cdf(x);
        if (n_gt(cdfx, y))
        {
            max_x = x;
        }
        else if (n_lt(cdfx, y))
        {
            if (n_le(n_sub(y, cdfx), eps) || n_le(n_sub(max_x, min_x), eps)) break;
            min_x = x;
        }
        else
        {
            break;
        }
    }
    return x;
}

// erf, erfc
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
    __sqrt_pi = realMath.sqrt(constant.pi)
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
    __sqrt_pi = realMath.sqrt(constant.pi);
});
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

function normpdf(x, mu, sigma)
{
    // pdf of Normal distribution
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    x = n_div(n_sub(x, mu), sigma); // normalize
    return n_div(realMath.exp(n_neg(n_div(n_mul(x, x), constant['2']))), n_mul(sigma, n_mul(sqrt2, __sqrt_pi)));
}
function normcdf(x, mu, sigma)
{
    // cdf of Normal distribution, via erf
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    x = n_div(n_sub(x, mu), sigma); // normalize
    return n_mul(constant['1/2'], n_add(I, erf(n_div(x, sqrt2))));
}
function norminv(p, mu, sigma)
{
    // icdf of Normal distribution
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    var limit = n_mul(sigma, 100); // 100 x sigma
    return icdf(function(x) {return normcdf(x, mu, sigma);}, p, n_sub(mu, limit), n_add(mu, limit));
}

function chi2pdf(x, nu)
{
    // pdf of Chi-squared distribution with nu degrees of freedom
    // Wilson-Hilferty Transformation to approximately a Normal
    // accuracy at least within 1-2 decimal points
    if (null == nu) nu = I;
    var sigma2 = n_div(constant['2'], n_mul(nu, 9)),
        mu = n_sub(I, sigma2),
        sigma = realMath.sqrt(sigma2);
    return pdf(function(x) {return normcdf(n_pow(n_div(x, nu), 1/3), mu, sigma);}, x);
}
function chi2cdf(x, nu)
{
    // cdf of Chi-squared distribution with nu degrees of freedom
    // Wilson-Hilferty Transformation to approximately a Normal
    // accuracy at least within 1-2 decimal points
    if (null == nu) nu = I;
    var sigma2 = n_div(constant['2'], n_mul(nu, 9)),
        mu = n_sub(I, sigma2),
        sigma = realMath.sqrt(sigma2);
    return normcdf(n_pow(n_div(x, nu), 1/3), mu, sigma);
}
function chi2inv(p, nu)
{
    // icdf of Chi-squared distribution with nu degrees of freedom
    // Wilson-Hilferty Transformation to approximately a Normal
    // accuracy at least within 1-2 decimal points
    if (null == nu) nu = I;
    var sigma2 = n_div(constant['2'], n_mul(nu, 9)),
        mu = n_sub(I, sigma2),
        sigma = realMath.sqrt(sigma2);
    return max([O, n_mul(n_pow(norminv(p, mu, sigma), 3), nu)]);
}
