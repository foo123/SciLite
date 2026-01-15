function balance(A, pnorm, wantt)
{
    if (null == pnorm) pnorm = two;
    /*
    "ON MATRIX BALANCING AND EIGENVECTOR COMPUTATION",
    RODNEY JAMES, JULIEN LANGOU, BRADLEY R. LOWERY
    https://arxiv.org/abs/1401.5766
    */
    var n = ROWS(A), n1 = n-1,
        B = todecimal(A),
        T = wantt ? array(n, I) : null,
        col = new Array(n1),
        row = new Array(n1),
        i, j, ji, f, c, r,
        eps = __(1e-10),
        converged, iter;
    for (iter=1; iter<=100; ++iter)
    {
        converged = 0;
        for (i=0; i<n; ++i)
        {
            for (j=0; j<n1; ++j)
            {
                ji = j >= i ? j+1 : j;
                col[j] = B[ji][i];
                row[j] = B[i][ji];
            }
            c = norm(col, pnorm);
            r = norm(row, pnorm);
            if (n_eq(r, O) || n_eq(c, O))
            {
                ++converged;
                continue;
            }
            f = realMath.sqrt(n_div(r, c));
            if (n_le(realMath.abs(n_sub(f, I)), eps)) ++converged;
            if (wantt) T[i] = n_mul(f, T[i]);
            for (j=0; j<n; ++j)
            {
                B[j][i] = scalar_mul(B[j][i], f);
            }
            for (j=0; j<n; ++j)
            {
                B[i][j] = scalar_div(B[i][j], f);
            }
        }
        if (n === converged) break;
    }
    return wantt ? [T, B] : B;
}
fn.balance = varargout(function(nargout, A, noperm) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("balance");
    var ans = balance(A, two, 1 < nargout);
    return 2 < nargout ? [ans[0], array(ROWS(A), function(i) {return i+1;})/*noperm*/, ans[1]] : (1 < nargout ? [diag(ans[0]), ans[1]] : ans);
});
