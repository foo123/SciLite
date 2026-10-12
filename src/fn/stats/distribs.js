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
    return apply_(normpdf, [x, mu, sigma]);
};
fn.normcdf = varargout(function(nargout, x, mu, sigma) {
    if (1 < nargout) throw "normcdf: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    return apply_(normcdf, [x, mu, sigma]);
});
fn.norminv = varargout(function(nargout, p, mu, sigma) {
    if (1 < nargout) throw "norminv: only 1 output is supported";
    if (null == sigma) sigma = I;
    if (null == mu) mu = O;
    return apply_(norminv, [p, mu, sigma]);
});

// chi2 distribution
fn.chi2pdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(chi2pdf, [x, nu]);
};
fn.chi2cdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(chi2cdf, [x, nu]);
};
fn.chi2inv = function(p, nu) {
    if (null == nu) nu = I;
    return apply_(chi2inv, [p, nu]);
};

// t distribution
fn.tpdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(tpdf, [x, nu]);
};
fn.tcdf = function(x, nu) {
    if (null == nu) nu = I;
    return apply_(tcdf, [x, nu]);
};
fn.tinv = function(p, nu) {
    if (null == nu) nu = I;
    return apply_(tinv, [p, nu]);
};
