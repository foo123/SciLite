// various distributions
// TODO add more and/or improve numerical accuracy

// erf, erfc
fn.erf = function(x) {
    return apply(erf, x, true);
};
fn.erfc = function(x) {
    return apply(erfc, x, true);
};

// normal distribution
fn.normpdf = function(x, mu, sigma) {
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    if (is_array(sigma))
    {
        return apply(function(sigma) {return normpdf(x, mu, sigma);}, sigma, true);
    }
    else if (is_array(mu))
    {
        return apply(function(mu) {return normpdf(x, mu, sigma);}, mu, true);
    }
    else
    {
        return apply(function(x) {return normpdf(x, mu, sigma);}, x, true);
    }
};
fn.normcdf = varargout(function(nargout, x, mu, sigma) {
    if (1 < nargout) throw "normcdf: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    if (is_array(sigma))
    {
        return apply(function(sigma) {return normcdf(x, mu, sigma);}, sigma, true);
    }
    else if (is_array(mu))
    {
        return apply(function(mu) {return normcdf(x, mu, sigma);}, mu, true);
    }
    else
    {
        return apply(function(x) {return normcdf(x, mu, sigma);}, x, true);
    }
});
fn.norminv = varargout(function(nargout, p, mu, sigma) {
    if (1 < nargout) throw "norminv: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    if (is_array(sigma))
    {
        return apply(function(sigma) {return norminv(p, mu, sigma);}, sigma, true);
    }
    else if (is_array(mu))
    {
        return apply(function(mu) {return norminv(p, mu, sigma);}, mu, true);
    }
    else
    {
        return apply(function(p) {return norminv(p, mu, sigma);}, p, true);
    }
});

// chi2 distribution
fn.chi2pdf = function(x, nu) {
    if (null == nu) nu = I;
    if (is_array(nu))
    {
        return apply(function(nu) {return chi2pdf(x, nu);}, nu, true);
    }
    else
    {
        return apply(function(x) {return chi2pdf(x, nu);}, x, true);
    }
};
fn.chi2cdf = function(x, nu) {
    if (null == nu) nu = I;
    if (is_array(nu))
    {
        return apply(function(nu) {return chi2cdf(x, nu);}, nu, true);
    }
    else
    {
        return apply(function(x) {return chi2cdf(x, nu);}, x, true);
    }
};
fn.chi2inv = function(p, nu) {
    if (null == nu) nu = I;
    if (is_array(nu))
    {
        return apply(function(nu) {return chi2inv(p, nu);}, nu, true);
    }
    else
    {
        return apply(function(p) {return chi2inv(p, nu);}, p, true);
    }
};
