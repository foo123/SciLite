function logm(A)
{
    // log(A) by inverse squaring(sqrt), Taylor approximation and inverse scaling
    var n = ROWS(A),
        BT = balance(A, null, true),
        B = BT[0],
        QT = schur(BT[1], true, true),
        Q = QT[0],
        T = QT[1],
        In = eye(n),
        theta = __(0.013325),
        s = 0,
        An, logA, i, N;

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
        An = mul(T, An);
        logA = i & 1 ? add(logA, dotdiv(An, __(i))) : sub(logA, dotdiv(An, __(i)));
    }

    // inverse scaling
    logA = dotmul(logA, n_pow(two, s));

    return mul(mul(diag(B), mul(mul(Q, logA), ctranspose(Q))), diag(B.map(function(bi) {return n_inv(bi);})));
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
