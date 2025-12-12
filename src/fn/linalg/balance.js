function balance(A, pnorm, wantt)
{
    if (null == pnorm) pnorm = 2;
    /*
    "ON MATRIX BALANCING AND EIGENVECTOR COMPUTATION",
    RODNEY JAMES, JULIEN LANGOU, BRADLEY R. LOWERY
    https://arxiv.org/abs/1401.5766
    */
    var n = ROWS(A),
        B = copy(A),
        T = wantt ? array(n, I) : null,
        i, j, f,
        col, row, c, r,
        eps = __(1e-10),
        converged, iter;
    for (iter=1; iter<=10000; ++iter)
    {
        converged = 0;
        for (i=0; i<n; ++i)
        {
            col = COL(B, i).map(__);
            col.splice(i, 1);
            row = ROW(B, i).map(__);
            row.splice(i, 1);
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
    var ans = balance(A, 2, 1 < nargout);
    return 2 < nargout ? [ans[0], array(ROWS(A), function(i) {return i+1;})/*noperm*/, ans[1]] : (1 < nargout ? [diag(ans[0]), ans[1]] : ans);
});
