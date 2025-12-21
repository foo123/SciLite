function gcdex(a, b)
{
    var gcd, g, x, y;
    if (!n_eq(a, O) && n_eq(O, n_mod(b, a)))
    {
        g = realMath.abs(a);
        y = O;
        x = n_lt(a, O) ? J : I;
    }
    else if (!n_eq(b, O) && n_eq(O, n_mod(a, b)))
    {
        g = realMath.abs(b);
        x = O;
        y = n_lt(b, O) ? J : I;
    }
    else
    {
        gcd = n_xgcd([a, b]);
        g = gcd[0];
        x = gcd[1];
        y = gcd[2];
    }
    return [x, y, g];
}
function add_columns(m, i, j, a, b, c, d)
{
    var k, n, e, f;
    if (i === j)
    {
        for (k=0,n=ROWS(m); k<n; ++k)
        {
            m[k][i] = n_mul(a, m[k][i]);
        }
    }
    else
    {
        for (k=0,n=ROWS(m); k<n; ++k)
        {
            e = m[k][i]; f = m[k][j];
            m[k][i] = n_add(n_mul(a, e), n_mul(b, f));
            m[k][j] = n_add(n_mul(c, e), n_mul(d, f));
        }
    }
}
function hnf(A, wantu)
{
    // adapted from https://github.com/foo123/Abacus
    var m = ROWS(A), n = COLS(A),
        U = wantu ? eye(n) : null,
        k = n, i, j, b, q, gcd, r, s;
    for (i=m-1; i>=0; --i)
    {
        if (0 === k) break;
        --k;
        for (j=k-1; j>=0; --j)
        {
            if (!n_eq(A[i][j], O))
            {
                gcd = gcdex(A[i][k], A[i][j]);
                r = n_div(A[i][k], gcd[2]);
                s = n_neg(n_div(A[i][j], gcd[2]));
                add_columns(A, k, j, gcd[0], gcd[1], s, r);
                if (wantu) add_columns(U, k, j, gcd[0], gcd[1], s, r);
            }
        }
        b = A[i][k];
        if (n_eq(b, O))
        {
            ++k;
        }
        else
        {
            if (n_lt(b, O))
            {
                add_columns(A, k, k, J, O, J, O);
                if (wantu) add_columns(U, k, k, J, O, J, O);
                b = n_neg(b);
            }
            for (j=k+1; j<n; ++j)
            {
                q = n_neg(realMath.floor(n_div(A[i][j], b)));
                add_columns(A, j, k, I, q, O, I);
                if (wantu) add_columns(U, j, k, I, q, O, I);
            }
        }
    }
    return wantu ? [U, A] : A;
}
fn.hermiteForm = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported('hermiteForm');
    return hnf(fn.round(fn.real(A)), 1 < nargout);
});
