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
    var N = a.length;
    return 1 < N ? scalar_div(sum(dotmul(dotdiv(sub(a, mean(a)), std(a)), dotdiv(sub(b, mean(b)), std(b)))), __(N-1)) : I;
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
        p = n_sub(I, chi2cdf(stat, dof)); // accuracy at least 2-3 decimal places
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
    if (is_nan(y)) return nan;
    else if (n_le(y, O)) return null == lim_0 ? -inf : lim_0;
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
    __sqrt_pi = realMath.sqrt(constant.pi),

    __td1 = 0.000345,
    __td2 = 0.069547,
    __td3 = 1.604326
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

    __td1 = __(0.000345);
    __td2 = __(0.069547)
    __td3 = __(1.604326);
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
    // https://en.wikipedia.org/wiki/Normal_distribution
    x = n_div(n_sub(x, mu), sigma); // normalize
    return n_div(realMath.exp(n_neg(n_div(n_mul(x, x), constant['2']))), n_mul(sigma, n_mul(sqrt2, __sqrt_pi)));
}
function normcdf(x, mu, sigma)
{
    // cdf of Normal distribution, via erf
    // https://en.wikipedia.org/wiki/Normal_distribution
    x = n_div(n_sub(x, mu), sigma); // normalize
    return n_mul(constant['1/2'], n_add(I, erf(n_div(x, sqrt2))));
}
function norminv(p, mu, sigma)
{
    // icdf of Normal distribution
    // https://en.wikipedia.org/wiki/Normal_distribution
    var limit = n_mul(sigma, 100); // 100 x sigma
    return icdf(function(x) {return normcdf(x, mu, sigma);}, p, n_sub(mu, limit), n_add(mu, limit));
}

function chi2pdf(x, nu)
{
    // pdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (n_lt(nu, O) || n_lt(x, O)) return nan;
    else if (n_eq(nu, O)) return O;
    // "A normal approximation for the chi-square distribution", Luisa Canal, 2005
    // accuracy at least within 2-3 decimal places
    return pdf(function(x) {return chi2cdf(x, nu);}, x);
    /*
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
function chi2cdf(x, nu)
{
    // cdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (n_lt(nu, O) || n_lt(x, O)) return nan;
    else if (n_eq(nu, O)) return O;
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
    return normcdf(L, chi2cdf.mu, chi2cdf.sigma);
    /*
    // Wilson-Hilferty Transformation to approximately a Normal
    // accuracy at least within 1-2 decimal places
    if ((null == chi2cdf.nu) || !n_eq(chi2cdf.nu, nu))
    {
        chi2cdf.nu = nu;
        var sigma2 = n_div(constant['2'], n_mul(nu, 9));
        chi2cdf.mu = n_sub(I, sigma2);
        chi2cdf.sigma = realMath.sqrt(sigma2);
    }
    return normcdf(n_pow(n_div(x, nu), 1/3), chi2cdf.mu, chi2cdf.sigma);
    */
}
function chi2inv(p, nu)
{
    // icdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (n_lt(nu, O)) return nan;
    // "A normal approximation for the chi-square distribution", Luisa Canal, 2005
    // accuracy at least within 2-3 decimal places
    if ((null == chi2inv.nu) || !n_eq(chi2inv.nu, nu))
    {
        chi2inv.nu = nu;
        var nu2 = n_mul(nu, nu), nu3 = n_mul(nu2, nu);
        chi2inv.limit = n_mul(realMath.sqrt(n_add(n_add(n_div(1/18, nu), n_div(1/162, nu2)), n_div(-37/11664, nu3))), 100);
    }
    return icdf(function(x) {return chi2cdf(x, nu);}, p, O, chi2inv.limit, O, inf);
    /*
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
    */
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
        // approximation
        tpdfx = pdf(function(x) {return tcdf(x, nu);}, x);
    }
    return tpdfx;
}
function tcdf(x, nu)
{
    // cdf of t distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Student%27s_t-distribution
    if (n_le(nu, O)) return nan;
    var tcdfx = O, z, z2, z3, z5;
    if (n_eq(nu, I))
    {
        tcdfx = n_add(
            constant['1/2'],
            n_div(realMath.atan(x), constant.pi)
        );
    }
    else if (n_eq(nu, constant['2']))
    {
        tcdfx = n_add(
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
        tcdfx = n_add(
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
        tcdfx = n_add(
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
        tcdfx = n_div(I, n_add(I, realMath.exp(n_sub(n_sub(n_mul(z5, __td1), n_mul(z3, __td2)), n_mul(z, __td3)))));
    }
    return tcdfx;
}
function tinv(p, nu)
{
    // icdf of t distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Student%27s_t-distribution
    // accuracy at least within 2-3 decimal places
    if (n_le(nu, O)) return nan;
    var limit = n_gt(nu, constant['2']) ? n_mul(n_div(nu, n_sub(nu, constant['2'])), 100) : __(1e7);
    return icdf(function(x) {return tcdf(x, nu);}, p, n_neg(limit), limit);
}
