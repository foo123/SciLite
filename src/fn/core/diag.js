function diag(x, k)
{
    k = _(k || 0);
    if (is_0d(x))
    {
        return [[x]];
    }
    if (is_1d(x))
    {
        return matrix(x.length, x.length, function(i, j) {
            return k === i - j ? x[i] : 0;
        });
    }
    if (is_2d(x))
    {
        return x.reduce(function(diag, xi, i) {
            return xi.reduce(function(diag, xij, j) {
                if (k === i - j) diag.push(xij);
                return diag;
            }, diag);
        }, []);
    }
    not_supported("diag");
}
fn.diag = diag;
