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
function icdf(cdf, y, min_x, max_x, lim_0, lim_1)
{
    // find icdf quantile x s.t cdf(x) <= y by bisection between min_x and max_x
    if (n_le(y, O)) return null == lim_0 ? -inf : lim_0;
    else if (n_ge(y, I)) return null == lim_1 ? inf : lim_1;
    var eps = __(1e-12), two = constant['2'], x, cdfx;
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
var __a1 =  0.254829592,
    __a2 = -0.284496736,
    __a3 =  1.421413741,
    __a4 = -1.453152027,
    __a5 =  1.061405429,
    __p  =  0.3275911,
    __A  =  1.98,
    __B  =  1.135,
    __sqrt_pi = realMath.sqrt(constant.pi);
update.push(function() {
    __a1 = __( 0.254829592);
    __a2 = __(-0.284496736);
    __a3 = __( 1.421413741);
    __a4 = __(-1.453152027);
    __a5 = __( 1.061405429);
    __p  = __( 0.3275911);
    __A  = __(1.98);
    __B  = __(1.135);
    __sqrt_pi = realMath.sqrt(constant.pi);
});
function erf(x)
{
    // https://en.wikipedia.org/wiki/Error_function#Bounds_and_numerical_approximations
    x = real(x);
    var t, sgn = realMath.sign(x) || 1;

    if (sgn < 0) x = n_neg(x);

    t = n_inv(n_add(n_mul(__p, x), I));
    return n_mul(sgn, n_sub(
    I, n_mul(n_add(n_mul(n_add(n_mul(n_add(n_mul(n_add(n_mul(__a5, t), __a4), t), __a3), t), __a2), t), __a1), n_mul(t, realMath.exp(n_neg(n_mul(x, x)))))));
}
function erfc(x)
{
    // https://en.wikipedia.org/wiki/Error_function#Bounds_and_numerical_approximations
    // erfc(x) = 1 - erf(x)
    // erfc(-x) = 1 - erf(-x) = 1 + erf(x)
    // only for x >= 0
    x = real(x);
    return n_div(n_mul(n_sub(I, realMath.exp(n_neg(n_mul(__A, x)))), realMath.exp(n_neg(n_mul(x, x)))), n_mul(__B, n_mul(__sqrt_pi, x)));
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
    // accuracy within 1-2 decimal points
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
    // accuracy within 1-2 decimal points
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
    // accuracy within 1-2 decimal points
    if (null == nu) nu = I;
    var sigma2 = n_div(constant['2'], n_mul(nu, 9)),
        mu = n_sub(I, sigma2),
        sigma = realMath.sqrt(sigma2);
    return n_mul(n_pow(norminv(p, mu, sigma), 3), nu);
}