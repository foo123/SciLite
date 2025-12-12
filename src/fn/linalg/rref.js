fn.ref = varargout(function(nargout, x, tol) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("ref");
    var ans = ref(x, true, null, tol);
    return 1 < nargout ? [ans[0], ans[1].map(function(pi) {return pi[1]+1;})] : ans[0];
});
function rref(A, with_pivots, odim, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A), dim = columns,
        pivots, det, pl, lead, r, i, j, l, a, g, rf, aug;
    eps = __(eps || 0);
    // original dimensions, eg when having augmented matrix
    if (is_array(odim)) dim = stdMath.min(dim, odim[1]);
    // build rref incrementaly from ref
    rf = ref(A, true, odim, eps);
    a = concat(rf[0], rf[3]);
    pivots = rf[1]; det = rf[2];
    pl = pivots.length;
    for (r=0; r<pl; ++r)
    {
        lead = pivots[r][1];
        for (i=0; i<r; ++i)
        {
            if (le(scalar_abs(a[i][lead]), eps)) continue;

            ADDR(a, i, r, scalar_neg(a[i][lead]), a[r][lead]);
            if (!eq(a[i][pivots[i][1]], I))
            {
                ADDR(a, i, i, O, scalar_inv(a[i][pivots[i][1]]), pivots[i][1]);
            }
        }
    }
    if (!eq(a[pl-1][pivots[pl-1][1]], I))
    {
        ADDR(a, pl-1, pl-1, O, scalar_inv(a[pl-1][pivots[pl-1][1]]), pivots[pl-1][1]);
    }
    aug = slice(a, 0, columns, rows-1, rows+columns-1);
    a = slice(a, 0, 0, rows-1, columns-1);
    return with_pivots ? [a, pivots, det, aug] : a;
}
fn.rref = varargout(function(nargout, x, tol) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("rref");
    var ans = rref(x, true, null, tol);
    return 1 < nargout ? [ans[0], ans[1].map(function(pi) {return pi[1]+1;})] : ans[0];
});
