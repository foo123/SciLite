// various distributions
// TODO add more and/or improve numerical accuracy

// normal distribution
fn.normpdf = function(x, mu, sigma) {
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    return apply_(normpdf, [x, mu, sigma], real);
};
fn.normcdf = varargout(function(nargout, x, mu, sigma) {
    if (1 < nargout) throw "normcdf: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    return apply_(normcdf, [x, mu, sigma], real);
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
fn.chi2cdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(chi2cdf, [x, nu], real);
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
fn.tcdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(tcdf, [x, nu], real);
};
fn.tinv = function(p, nu) {
    if (null == nu) nu = I;
    return apply_(tinv, [p, nu], real);
};
