function eye(n)
{
    if (null == n) n = 1;
    n = sca(n, true);
    var I = __(1), O = __(0);
    return matrix(_(n), _(n), function(i, j) {
        return i === j ? I : O;
    });
}
fn.eye = eye;
