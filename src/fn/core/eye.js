function eye(n, d)
{
    if (null == d) d = I;
    if (null == n) n = 1;
    if (is_vector(n)) n = n[0];
    n = sca(n, true);
    return matrix(_(n), _(n), function(i, j) {
        return i === j ? d : O;
    });
}
fn.eye = function(n) {
    return eye(fn.fix(n), I);
};
