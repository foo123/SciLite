function ldl(A, triangle)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A),
        i, j, jj, k, sum, D, L,
        upper_triangle = "upper" === triangle;
    D = zeros(rows, rows);
    L = eye(rows);

    for (i=0; i<rows; ++i)
    {
        for (j=0; j<i; ++j)
        {
            for (k=0,sum=O; k<j; ++k)
                sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[j][k])), D[k][k]));

            L[i][j] = scalar_div(scalar_sub(upper_triangle ? A[j][i] : A[i][j], sum), D[j][j]);
        }

        for (k=0,sum=O; k<i; ++k)
            sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[i][k])), D[k][k]));

        D[i][i] = scalar_sub(A[i][i], sum);

        if (le(D[i][i], O))
        {
            // not positive-definite
            return [];
        }
    }
    return [L, D];
}
fn.ldl = varargout(function(nargout, A, triangle) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A)) /*|| !EQU(A, ctranspose(A))*/) not_supported("ldl");
    var ans = ldl(A, triangle);
    if (!ans.length) not_supported("ldl");
    if (2 < nargout) ans.push(eye(ROWS(A)));
    return ans;
}, 2);
