fn.hilb = function(n) {
    n = _(sca(n, true));
    return matrix(n, n, function(i, j) {
        return __(1 / (i+1 + j+1 - 1));
    });
};
fn.invhilb = function(n) {
    n = _(sca(n, true));
    var h = fn.hilb(n);
    // exact or approximate inverse
    return n < 10 ? inv(h) : ainv(h);
};