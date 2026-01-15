function logm(A)
{
    // log(A) by inverse squaring(sqrt), Taylor approximation and inverse scaling
    var QT = schur(A, true, true),
        Q = QT[0], T = QT[1],
        k = max([O, n_add(I, realMath.floor(realMath.log2(norm(T, inf))))]),
        twok = n_pow(two, k),
        An, logA, i, N;
    // inverse squaring (sqrt)
    for (i=1,k=_(k); i<=k; ++i)
    {
        T = sqrtm_tri(T);
    }
    A = mul(mul(Q, T), ctranspose(Q));
    An = A; // should be close to I
    // Taylor expansion of log(I+A) up to N terms,
    // A - A^2/2 + A^3/3 - A^4/4 + ..
    logA = An;
    for (i=2,N=100; i<=N; ++i)
    {
        An = mul(A, An);
        logA = i & 1 ? add(logA, dotdiv(An, __(i))) : sub(logA, dotdiv(An, __(i)));
    }
    // inverse scaling
    return dotmul(logA, twok);
}
fn.logm = function(A) {
    if (is_scalar(A)) return fn.log(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("logm");
    return logm(A);
};
