function snf(A, wantl, wantr)
{
    // adapted from https://github.com/foo123/Abacus
    var rows, columns, dim, left, right,
        last_j, i, j, upd, ii, jj, non_zero, i1, i0, g,
        coef1, coef2, coef3, coef4, coef5, tmp, tmp2;
    rows = ROWS(A);
    columns = COLS(A);
    dim = stdMath.min(rows, columns);
    if (wantl) left = eye(rows);
    if (wantr) right = eye(columns);
    last_j = -1;
    for (i=0; i<rows; ++i)
    {
        non_zero = false;
        for (j=last_j+1; j<columns; ++j)
        {
            for (i0=0; i0<rows; ++i0)
                if (!n_eq(A[i0][j], O))
                    break;
            if (i0 < rows)
            {
                non_zero = true;
                break;
            }
        }
        if (!non_zero) break;

        if (n_eq(A[i][j], O))
        {
            for (ii=0; ii<rows; ++ii)
                if (!n_eq(A[ii][j], O))
                    break;
            MULR(A, i, ii, O, I, I, O);
            if (wantl) MULC(left, i, ii, O, I, I, O);
        }
        MULC(A, j, i, O, I, I, O);
        if (wantr) MULR(right, j, i, O, I, I, O);
        j = i;
        upd = true;
        while (upd)
        {
            upd = false;
            for (ii=i+1; ii<rows; ++ii)
            {
                if (n_eq(A[ii][j], O)) continue;
                upd = true;
                if (!n_eq(O, n_mod(A[ii][j], A[i][j])))
                {
                    g = n_xgcd([A[i][j], A[ii][j]]);
                    coef1 = g[1]; coef2 = g[2];
                    coef3 = n_div(A[ii][j], g[0]);
                    coef4 = n_div(A[i][j], g[0]);
                    MULR(A, i, ii, coef1, coef2, n_neg(coef3), coef4);
                    if (wantl) MULC(left, i, ii, coef4, n_neg(coef2), coef3, coef1);
                }
                coef5 = n_div(A[ii][j], A[i][j]);
                MULR(A, i, ii, I, O, n_neg(coef5), I);
                if (wantl) MULC(left, i, ii, I, O, coef5, I);
            }
            for (jj=j+1; jj<columns; ++jj)
            {
                if (n_eq(A[i][jj], O)) continue;
                upd = true;
                if (!n_eq(O, n_mod(A[i][jj], A[i][j])))
                {
                    g = n_xgcd([A[i][j], A[i][jj]]);
                    coef1 = g[1]; coef2 = g[2];
                    coef3 = n_div(A[i][jj], g[0]);
                    coef4 = n_div(A[i][j], g[0]);
                    MULC(A, j, jj, coef1, n_neg(coef3), coef2, coef4);
                    if (wantr) MULR(right, j, jj, coef4, coef3, n_neg(coef2), coef1);
                }
                coef5 = n_div(A[i][jj], A[i][j]);
                MULC(A, j, jj, I, n_neg(coef5), O, I);
                if (wantr) MULR(right, j, jj, I, coef5, O, I);
            }
        }
        last_j = j;
    }
    for (i1=0; i1<dim; ++i1)
    {
        for (i0=i1-1; i0>=0; --i0)
        {
            g = n_xgcd([A[i0][i0], A[i1][i1]]);
            if (n_eq(g[0], O)) continue;
            coef1 = g[1]; coef2 = g[2];
            coef3 = n_div(A[i1][i1], g[0]);
            coef4 = n_div(A[i0][i0], g[0]);
            tmp = n_mul(coef2, coef3);
            tmp2 = n_sub(I, n_mul(coef1, coef4));
            MULR(A, i0, i1, I, coef2, coef3, n_sub(tmp, I));
            if (wantl) MULC(left, i0, i1, n_sub(I, tmp), coef2, coef3, J);
            MULC(A, i0, i1, coef1, tmp2, I, n_neg(coef4));
            if (wantr) MULR(right, i0, i1, coef4, tmp2, I, n_neg(coef1));
        }
    }
    return wantl && wantr ? [A/*diagonal center matrix*/, left/*left matrix*/, right/*right matrix*/] : (wantl ? [A, left] : (wantr ? [A, right] : A));
}
fn.smithForm = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported('smithForm');
    var ans = snf(fn.round(fn.real(A)), 1 < nargout, 1 < nargout);
    return 1 < nargout ? [ans[1], ans[2], ans[0]] : ans;
});
