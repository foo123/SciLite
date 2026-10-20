// various distributions
// TODO add more and/or improve speed and/or accuracy

// uniform continuous distribution
fn.unifpdf = function(x, a, b) {
    if (null == b) b = I;
    if (null == a) a = O;
    return apply_(unifpdf, [x, a, b], real);
};
fn.unifcdf = function(x, a, b, tail) {
    if (null == b) b = I;
    if (null == a) a = O;
    return apply_(function(x, a, b) {return unifcdf(x, a, b, tail);}, [x, a, b], real);
};
fn.unifinv = function(p, a, b) {
    if (null == b) b = I;
    if (null == a) a = O;
    return apply_(unifinv, [p, a, b], real);
};

// normal distribution
fn.normpdf = function(x, mu, sigma) {
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    return apply_(normpdf, [x, mu, sigma], real);
};
fn.normcdf = varargout(function(nargout, x, mu, sigma, tail) {
    if (1 < nargout) throw "normcdf: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    if (is_string(sigma))
    {
        tail = sigma;
        sigma = I;
    }
    if (is_string(mu))
    {
        tail = mu;
        mu = O;
        sigma = I;
    }
    tail = 'uppper' === tail ? 'upper' : 'lower';
    return apply_(function(x, mu, sigma) {return normcdf(x, mu, sigma, tail);}, [x, mu, sigma], real);
});
fn.norminv = varargout(function(nargout, p, mu, sigma) {
    if (1 < nargout) throw "norminv: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    return apply_(norminv, [p, mu, sigma], real);
});

// chi2 distribution
fn.chi2pdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(chi2pdf, [x, nu], real);
};
fn.chi2cdf = function(x, nu, tail) {
    if (null == nu) nu = I;
    return apply_(function(x, nu) {return chi2cdf(x, nu, tail);}, [x, nu], real);
};
fn.chi2inv = function(p, nu) {
    if (null == nu) nu = I;
    return apply_(chi2inv, [p, nu], real);
};

// t distribution
fn.tpdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(tpdf, [x, nu], real);
};
fn.tcdf = function(x, nu, tail) {
    if (null == nu) nu = I;
    return apply_(function(x, nu) {return tcdf(x, nu, tail);}, [x, nu], real);
};
fn.tinv = function(p, nu) {
    if (null == nu) nu = I;
    return apply_(tinv, [p, nu], real);
};
