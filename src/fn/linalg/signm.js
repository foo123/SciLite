function sgn(z)
{
    if (n_eq(real(z), O))
    {
        return n_eq(imag(z), O) ? I : realMath.sign(imag(z));
    }
    else
    {
        return realMath.sign(real(z));
    }
}
function signm_tri(T)
{
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/acoshm.m
    // sign(T) for upper triangular T
    var n = ROWS(T),
        S = eye(n),
        i, j, k,
        p, d, s;
    for (i=0; i<n; ++i)
    {
        S[i][i] = sgn(T[i][i]);
    }
    for (p=0; p<n-1; ++p)
    {
        for (i=0; i<n-p; ++i)
        {
            j = i+p;
            d = scalar_sub(T[j][j], T[i][i]);

            // solve via S^2 = I if we can.
            if (!eq(S[i][i], scalar_neg(S[j][j])))
            {
                // get S(i,j) from S^2 = I.
                for (k=i+1; k<=j-1; ++k)
                {
                    S[i][j] = scalar_div(scalar_mul(scalar_neg(S[i][k]), S[k][j]), scalar_add(S[i][i], S[j][j]));
                }
            }
            else
            {
                // get S(i,j) from S*T = T*S.
                s = scalar_mul(T[i][j], scalar_sub(S[j][j], S[i][i]));
                if (p > 0)
                {
                    for (k=i+1; k<=j-1; ++k)
                    {
                        s = scalar_add(s, scalar_sub(scalar_mul(T[i][k], S[k][j]), scalar_mul(S[i][k], T[k][j])));
                    }
                }
                S[i][j] = scalar_div(s, d);
            }
        }
    }
    return S;
}
function signm(A)
{
    var QT = schur(A, true, "complex"), Q = QT[0], T = QT[1];
    return mul(mul(Q, signm_tri(T)), ctranspose(Q));
}
fn.signm = function(A) {
    if (is_scalar(A)) return fn.sign(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("signm");
    return signm(A);
};
