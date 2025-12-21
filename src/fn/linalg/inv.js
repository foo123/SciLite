function inv(A)
{
    // adapted from https://github.com/foo123/Abacus
    // matrix inverse
    if (is_scalar(A)) return scalar_inv(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) return [];
    var rows = ROWS(A), columns = rows, ref;
    if (1 === rows)
    {
        return [[scalar_inv(A[0][0])]];
    }
    else
    {
        // compute inverse through augmented rref (Gauss-Jordan method)
        ref = rref(A, true);
        if (eq(ref[0][rows-1][columns-1], O))
        {
            // not full-rank, no inverse
            return [];
        }
        else
        {
            // full-rank, has inverse
            return ref[3].map(function(ai, i) {
                return ai.map(function(aug_ij) {
                    return scalar_div(aug_ij, ref[0][i][i]);
                });
            });
        }
    }
}
function ainv(A)
{
    // approximate inverse, via 16 terms of Neumann series
    if (ROWS(A) !== COLS(A)) return [];
    var In = eye(ROWS(A)), invA = In, AA = sub(In, A), i;
    for (i=0; i<4; ++i)
    {
        invA = mul(invA, add(In, AA));
        if (i+1 < 4) AA = mul(AA, AA);
    }
    return invA;
}
fn.inv = function(A) {
    if (is_scalar(A)) x = [[A]];
    if (!is_matrix(A)) not_supported("inv");
    return inv(A);
};
fn.ainv = function(A) {
    if (is_scalar(A)) x = [[A]];
    if (!is_matrix(A)) not_supported("ainv");
    return ainv(A);
};
