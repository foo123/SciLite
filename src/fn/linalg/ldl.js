function ldl(A, triangle)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A), i, j, jj, k, sum, D, L;
    if ((rows !== columns) || !EQU(A, ctranspose(A)))
    {
        not_supported("ldl");
    }
    else
    {
        D = zeros(rows, rows);
        L = eye(rows);

        for (i=0; i<rows; ++i)
        {
            if ("upper" === triangle)
            {
                for (j=i+1; j<rows; ++j)
                {
                    for (k=i+1,sum=O; k<j; ++k)
                        sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[j][k])), D[k][k]));

                    L[i][j] = scalar_div(scalar_sub(A[i][j], sum), D[j][j]);
                }

                for (k=i+1,sum=O; k<rows; ++k)
                    sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[i][k])), D[k][k]));
            }
            else
            {
                for (j=0; j<i; ++j)
                {
                    for (k=0,sum=O; k<j; ++k)
                        sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[j][k])), D[k][k]));

                    L[i][j] = scalar_div(scalar_sub(A[i][j], sum), D[j][j]);
                }

                for (k=0,sum=O; k<i; ++k)
                    sum = scalar_add(sum, scalar_mul(scalar_mul(L[i][k], scalar_conj(L[i][k])), D[k][k]));
            }

            D[i][i] = scalar_sub(A[i][i], sum);

            if (le(D[i][i], O))
            {
                // not positive-definite
                not_supported("ldl");
            }
        }
        return [L, D];
    }
}
fn.ldl = function(A, triangle) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("ldl");
    return ldl(A, triangle);
};
