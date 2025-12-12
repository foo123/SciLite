function eye(n, d)
{
    if (null == d) d = I;
    if (null == n) n = 1;
    n = sca(n, true);
    return matrix(_(n), _(n), function(i, j) {
        return i === j ? d : O;
    });
}
fn.eye = function(n) {
    return eye(n, I);
};
