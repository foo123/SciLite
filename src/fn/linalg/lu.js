function lu(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var n, m, dim, P, L, U, DD,
        oldpivot, k, i, j, kpivot,
        NotFound, Ukk, Uik, defficient;
    eps = __(eps || 0);
    n = ROWS(A);
    m = COLS(A);
    /*
    Completely Fraction free LU factoring(CFFLU)
    Input: A nxm matrix A, with m >= n.
    Output: Four matrices P, L, D, U, where:
        P is a nxn permutation matrix,
        L is a nxn lower triangular matrix,
        D is a nxn diagonal matrix,
        U is a nxm upper triangular matrix
        and P*A = L*inv(D)*U
    */
    defficient = false;
    U = copy(A);
    L = eye(n);
    DD = array(n, O);
    P = eye(n);
    oldpivot = I;
    for (k=0; k<n-1; ++k)
    {
        if (le(scalar_abs(U[k][k]), eps))
        {
            kpivot = k+1;
            NotFound = true;
            while ((kpivot < n) && NotFound)
            {
                if (!le(scalar_abs(U[kpivot][k]), eps))
                    NotFound = false;
                else
                    ++kpivot;
            }
            if (n <= kpivot)
            {
                // matrix is rank-defficient
                defficient = true;
                break;
            }
            else
            {
                SWAPR(U, k, kpivot);
                SWAPR(P, k, kpivot);
            }
        }
        Ukk = U[k][k];
        L[k][k] = Ukk;
        DD[k] = scalar_mul(oldpivot, Ukk);
        for (i=k+1; i<n; ++i)
        {
            Uik = U[i][k];
            L[i][k] = Uik;
            for (j=k+1; j<m; ++j)
            {
                U[i][j] = scalar_div(scalar_sub(scalar_mul(Ukk, U[i][j]), scalar_mul(U[k][j], Uik)), oldpivot);
            }
            U[i][k] = O;
        }
        oldpivot = U[k][k];
    }
    if (defficient) return [];
    DD[n-1] = oldpivot;
    return [DD, L, U, P];
}
fn.lu = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("lu");
    var ans = lu(A), invD;
    if (!ans.length) throw "lu: defficient matrix";
    invD = diag(ans[0].map(function(di) {return scalar_inv(di);}));
    return 2 < nargout ? [mul(ans[1], invD), ans[2], ans[3]] : [mul(transpose(ans[3]), mul(ans[1], invD)), ans[2]];
}, 2);
