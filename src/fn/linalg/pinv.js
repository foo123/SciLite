function rankf(A, ref)
{
    // adapted from https://github.com/foo123/Abacus
    // rank factorization
    var rows = ROWS(A), columns = COLS(A), pivots, rank, F, C;
    if (!ref) ref = rref(A, true);
    pivots = ref[1];
    rank = pivots.length;
    C = slice(A, array(rows, function(i) {return i;}), array(rank, function(j) {return pivots[j][1];}));
    F = slice(ref[0], 0, 0, rank-1, columns-1).map(function(rref_i, i) {
        return rref_i.map(function(rref_ij, j) {
            j = i;
            while ((j+1 < columns) && eq(rref_i[j], O)) ++j;
            return scalar_div(rref_ij, rref_i[j]);
        });
    });
    return [C, F];
}
fn.rankf = function(A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("rankf");
    return rankf(A);
};
function pinv(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    // pseudo-matrix inverse
    if (is_scalar(A)) return scalar_inv(A);
    if (!is_matrix(A)) return [];
    var rows = ROWS(A), columns = COLS(A), ref, rank, rf, h, C, F;
    if (EQU(A, 0))
    {
        // zero matrix, pinv is transpose
        return transpose(A);
    }
    else if (1 === rows && 1 === columns)
    {
        // scalar, pinv is inverse
        return [[scalar_inv(A[0][0])]];
    }
    else if (1 === rows || 1 === columns)
    {
        // vector, pinv is transpose divided by square norm
        C = norm2(A);
        return matrix(columns, rows, function(j, i) {
            return scalar_div(scalar_conj(A[i][j]), C);
        });
    }
    else
    {
        ref = rref(A, true, null, eps || 0);
        rank = ref[1].length;
        if (rank === columns)
        {
            // linearly independent columns
            if (rows === columns)
            {
                // invertible, pinv is inverse
                return ref[3].map(function(ai, i) {
                    return ai.map(function(aug_ij) {
                        return scalar_div(aug_ij, ref[0][i][i]);
                    });
                });
            }
            else
            {
                // A+ = inv(Ah * A) * Ah
                h = ctranspose(A);
                return mul(inv(mul(h, A)), h);
            }
        }
        else if (rank === rows)
        {
            // linearly independent rows
            // A+ = Ah * inv(A * Ah)
            h = ctranspose(A);
            return mul(h, inv(mul(A, h)));
        }
        else
        {
            // general matrix, through rank factorisation
            // A = C F <=> A+ = F+ C+
            // where F+ = Fh * inv(F * Fh) and C+ = inv(Ch * C) * Ch
            rf = rankf(A, ref);
            C = rf[0];
            h = ctranspose(C);
            C = mul(inv(mul(h, C)), h);
            F = rf[1];
            h = ctranspose(F);
            F = mul(h, inv(mul(F, h)));
            return mul(F, C);
        }
    }
}
fn.pinv = function(A, tol) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("pinv");
    return pinv(A, tol);
};
