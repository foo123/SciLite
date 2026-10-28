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
    var n = a.length;
    return 1 < n ? scalar_div(sum(dotmul(dotdiv(sub(a, mean(a)), std(a)), dotdiv(sub(b, mean(b)), std(b)))), n-1) : I;
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
        p = chi2cdf(stat, dof, 'upper');
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
    // via numerical approximation of integral of pdf
    n = n || 100;
    var cum = O, delta = n_div(n_sub(max_x, min_x), n), x;
    for (x=min_x;n_le(x, max_x);x=n_add(x, delta))
    {
        cum = n_add(cum, pdf(x));
    }
    return cum;
}
function pdf(cdf, x, delta)
{
    // compute pdf from cdf at x
    // via numerical approximation of derivative of cdf
    delta = __(delta || eps);
    return n_div(n_sub(cdf(n_add(x, delta)), cdf(n_sub(x, delta))), n_mul(constant['2'], delta));
}

var __td1 = 0.000345,
    __td2 = 0.069547,
    __td3 = 1.604326
    //__sqrt_pi = realMath.sqrt(constant.pi)
;
update.push(function() {
__td1 = __(0.000345);
__td2 = __(0.069547);
__td3 = __(1.604326);

//__sqrt_pi = realMath.sqrt(constant.pi);
});

function unifpdf(x, a, b)
{
    // pdf of Uniform distribution
    // https://en.wikipedia.org/wiki/Continuous_uniform_distribution
    if (n_gt(a, b)) return nan;
    return n_lt(x, a) || n_gt(x, b) ? O : n_div(I, n_sub(b, a));
}
function unifcdf(x, a, b, tail)
{
    // cdf of Uniform distribution
    // https://en.wikipedia.org/wiki/Continuous_uniform_distribution
    if (n_gt(a, b)) return nan;
    var p = n_le(x, a) ? O : (n_ge(x, b) ? I : n_div(n_sub(x, a), n_sub(b, a)));
    return 'upper' === tail ? n_sub(I, p) : p;
}
function unifinv(p, a, b)
{
    // icdf of Uniform distribution
    // https://en.wikipedia.org/wiki/Continuous_uniform_distribution
    if (n_gt(a, b)) return nan;
    return n_le(p, O) ? a : (n_ge(p, I) ? b : n_add(a, n_mul(p, n_sub(b, a))));
}

function normpdf(x, mu, sigma)
{
    // pdf of Normal distribution
    // https://en.wikipedia.org/wiki/Normal_distribution
    x = n_div(n_sub(x, mu), sigma); // normalize
    return n_div(realMath.exp(n_neg(n_div(n_mul(x, x), constant['2']))), n_mul(sigma, __sqrt_2pi));
}
function normcdf(x, mu, sigma, tail)
{
    // cdf of Normal distribution, via erf
    // https://en.wikipedia.org/wiki/Normal_distribution
    x = n_div(n_sub(x, mu), sigma); // normalize
    var p = n_mul(constant['1/2'], n_add(I, erf(n_div(x, sqrt2))));
    return 'upper' === tail ? n_sub(I, p) : p;
}
function norminv(p, mu, sigma)
{
    // icdf of Normal distribution
    // https://en.wikipedia.org/wiki/Normal_distribution
    if (n_lt(p, O)) return nan;
    var limit = n_mul(sigma, 1000); // 1000 x sigma
    return monotone_inverse_newton(
        function(x) {return normcdf(x, mu, sigma);},
        function(x) {return normpdf(x, mu, sigma);},
        p, n_sub(mu, limit), n_add(mu, limit)
    );
}

function chi2pdf(x, nu)
{
    // pdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (is_nan(nu) || n_lt(nu, O)) return nan;
    else if (n_eq(nu, O)) return n_eq(x, O) ? O : nan;
    else if (n_lt(x, O)) return O;
    if (n_eq(constant['2'], nu))
    {
        return n_div(realMath.exp(n_neg(n_div(x, constant['2']))), constant['2']);
    }
    else
    {
        var nu2 = n_div(nu, constant['2']);
        if ((null == chi2pdf.nu) || !n_eq(nu, chi2pdf.nu))
        {
            // memoize
            chi2pdf.nu = nu;
            chi2pdf.g = n_mul(n_pow(constant['2'], nu2), gamma(nu2));
        }
        return n_div(n_mul(n_pow(x, n_sub(nu2, I)), realMath.exp(n_neg(n_div(x, constant['2'])))), chi2pdf.g);
        /*
        // "A normal approximation for the chi-square distribution", Luisa Canal, 2005
        // accuracy at least within 2-3 decimal places
        return pdf(function(x) {return chi2cdf(x, nu);}, x);
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
}
function chi2cdf(x, nu, tail)
{
    // cdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (is_nan(nu) || n_lt(nu, O) || n_lt(x, O)) return nan;
    else if (n_eq(nu, O)) return n_eq(x, O) ? O : nan;
    var p = O, nu2;
    if (n_eq(constant['2'], nu))
    {
        p = n_sub(I, realMath.exp(n_neg(n_div(x, constant['2']))));
    }
    else
    {
        nu2 = n_div(nu, constant['2']);
        p = /*n_div(*/gammainc(n_div(x, constant['2']), nu2)/*, n_pow(constant['2'], nu))*/;
        /*
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
        p = normcdf(L, chi2cdf.mu, chi2cdf.sigma);
        // Wilson-Hilferty Transformation to approximately a Normal
        // accuracy at least within 1-2 decimal places
        if ((null == chi2cdf.nu) || !n_eq(chi2cdf.nu, nu))
        {
            chi2cdf.nu = nu;
            var sigma2 = n_div(constant['2'], n_mul(nu, 9));
            chi2cdf.mu = n_sub(I, sigma2);
            chi2cdf.sigma = realMath.sqrt(sigma2);
        }
        p = normcdf(n_pow(n_div(x, nu), 1/3), chi2cdf.mu, chi2cdf.sigma);
        */
    }
    return 'upper' === tail ? n_sub(I, p) : p;
}
function chi2inv(p, nu)
{
    // icdf of Chi-squared distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Chi-squared_distribution
    if (is_nan(nu) || n_lt(nu, O) || n_lt(p, O)) return nan;
    // may fail because chi2cdf may return nan or inf if precision is exceeded
    return monotone_inverse_newton(
        function(x) {return chi2cdf(x, nu);},
        function(x) {return chi2pdf(x, nu);},
        p, O, __(10), O, I, O, inf
    );
    /*
    // Wilson-Hilferty Transformation to approximately a Normal
    // accuracy at least within 1-2 decimal places
    if ((null == chi2inv.nu) || !n_eq(chi2inv.nu, nu))
    {
        // memoize
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
    if (is_nan(nu) || n_le(nu, O)) return nan;
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
    /*else if (n_gt(nu, 30))
    {
        tpdfx = normpdf(x, O, I); // has become almost precisely normal
    }*/
    else
    {
        if ((null == tpdf.nu) || !n_eq(nu, tpdf.nu))
        {
            // memoize
            tpdf.nu = nu;
            tpdf.g = n_div(
                gamma(n_div(n_add(nu, I), constant['2'])),
                n_mul(realMath.sqrt(n_mul(constant.pi, nu)), gamma(n_div(nu, constant['2'])))
            );
        }
        tpdfx = n_mul(
            tpdf.g,
            n_pow(
                n_add(I, n_div(n_mul(x, x), nu)),
                n_neg(n_div(n_add(nu, I), constant['2']))
            )
        );
        // approximation
        //tpdfx = pdf(function(x) {return tcdf(x, nu);}, x);
    }
    return tpdfx;
}
function tcdf(x, nu, tail)
{
    // cdf of t distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Student%27s_t-distribution
    if (is_nan(nu) || n_le(nu, O)) return nan;
    var p = O, z, z2, z3, z5;
    if (n_eq(nu, I))
    {
        p = n_add(
            constant['1/2'],
            n_div(realMath.atan(x), constant.pi)
        );
    }
    else if (n_eq(nu, constant['2']))
    {
        p = n_add(
            constant['1/2'],
            n_div(
                x,
                n_mul(constant['2'], n_mul(sqrt2, realMath.sqrt(n_add(I, n_div(n_mul(x, x), constant['2'])))))
            )
        );
    }
    else if (n_eq(nu, 3))
    {
        z2 = n_div(n_mul(x, x), 3);
        z = realMath.sqrt(z2);
        p = n_add(
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
        p = n_add(
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
    /*else if (n_gt(nu, 30))
    {
        p = normcdf(x, O, I); // has become almost precisely normal
    }*/
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
        p = n_div(I, n_add(I, realMath.exp(n_sub(n_sub(n_mul(z5, __td1), n_mul(z3, __td2)), n_mul(z, __td3)))));
    }
    return 'upper' === tail ? n_sub(I, p) : p;
}
function tinv(p, nu)
{
    // icdf of t distribution with nu degrees of freedom
    // https://en.wikipedia.org/wiki/Student%27s_t-distribution
    // accuracy at least within 2-3 decimal places
    if (is_nan(nu) || n_le(nu, O) || n_lt(p, O)) return nan;
    var limit = 1000/*n_gt(nu, constant['2']) ? n_mul(n_div(nu, n_sub(nu, constant['2'])), 100) : __(1e7)*/;
    return monotone_inverse_newton(
        function(x) {return tcdf(x, nu);},
        function(x) {return tpdf(x, nu);},
        p, __(-limit), __(limit)
    );
}
