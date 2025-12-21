function gcdex(a, b)
{
    var gxy = n_xgcd([a, b]),
        g = gxy[0],
        x = gxy[1],
        y = gxy[2];
    if (!n_eq(a, O) && n_eq(O, n_mod(b, a)))
    {
        y = O;
        x = n_lt(a, O) ? J : I;
    }
    return [x, y, g];
}
function add_columns(m, i, j, a, b, c, d)
{
    for (var k=0,n=ROWS(m); k<n; ++k)
    {
        var e = m[k][i], f = m[k][j];
        m[k][i] = n_add(n_mul(a, e), n_mul(b, f));
        m[k][j] = n_add(n_mul(c, e), n_mul(d, f));
    }
}
function hnf(A, wantu)
{
    // adapted from https://github.com/foo123/Abacus
    var m = ROWS(A), n = COLS(A),
        U = wantu ? eye(m) : null,
        k = n, i, j, b, q, uvd, r, s;
    for (i=m-1; i>=0; --i)
    {
        if (0 === k) break;
        --k;
        for (j=k-1; j>=0; --j)
        {
            if (!n_eq(A[i][j], O))
            {
                uvd = gcdex(A[i][k], A[i][j]);
                r = realMath.floor(n_div(A[i][k], uvd[2]));
                s = realMath.floor(n_div(A[i][j], uvd[2]));
                add_columns(A, k, j, uvd[0], uvd[1], n_neg(s), r);
                if (wantu) add_columns(U, k, j, uvd[0], uvd[1], n_neg(s), r);
            }
        }
        b = A[i][k];
        if (n_lt(b, O))
        {
            add_columns(A, k, k, J, O, J, O);
            if (wantu) add_columns(U, k, k, J, O, J, O);
            b = n_neg(b);
        }
        if (n_eq(b, O))
        {
            ++k;
        }
        else
        {
            for (j=k+1; j<n; ++j)
            {
                q = realMath.floor(n_div(A[i][j], b));
                add_columns(A, j, k, I, n_neg(q), O, I);
                if (wantu) add_columns(U, j, k, I, n_neg(q), O, I);
            }
        }
    }
    return wantu ? [U, A] : A;
}
fn.hermiteForm = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported('hermiteForm');
    return hnf(fn.floor(fn.real(A)), 1 < nargout);
});
