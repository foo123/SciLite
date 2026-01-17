function logm_tri(T)
{
    // log(A) by inverse squaring(sqrt), Taylor approximation and inverse scaling
    // for upper triangular T
    var n = ROWS(T),
        BT = balance(T, null, true),
        B = BT[0],
        In = eye(n),
        theta = __(0.013325),
        s = 0,
        An, logA, i, N;

    T = BT[1];

    // inverse squaring (sqrt)
    while (n_gt(norm(sub(T, In), inf), theta))
    {
        T = sqrtm_tri(T);
        ++s;
    }

    T = sub(T, In);
    An = T;
    // Taylor expansion of log(I+A) up to N terms,
    // A - A^2/2 + A^3/3 - A^4/4 + ..
    logA = An;
    for (i=2,N=10; i<=N; ++i)
    {
        An = mul_tri(T, An);
        logA = i & 1 ? add(logA, dotdiv(An, __(i))) : sub(logA, dotdiv(An, __(i)));
    }

    // inverse scaling
    if (0 < s) logA = dotmul(logA, n_pow(two, s));

    return mul(mul(diag(B), logA), diag(B.map(function(bi) {return n_inv(bi);})));
}
function logm(A)
{
    var QT = schur(A, true, true),
        Q = QT[0], T = QT[1];
    return mul(mul(Q, logm_tri(T)), ctranspose(Q));
}
fn.logm = varargout(function(nargout, A) {
    var logA;
    if (is_scalar(A))
    {
        logA = fn.log(A);
    }
    else
    {
        if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("logm");
        logA = logm(A);
    }
    return 1 < nargout ? [logA, 0] : logA;
});
