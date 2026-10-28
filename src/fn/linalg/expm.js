function expm(A, with_neg)
{
    /*
    "Nineteen Dubious Ways to Compute the Exponential of a Matrix, Twenty-Five Years Later",
    Cleve Moler, Charles Van Loan,
    SIAM REVIEW, 2003
    */
    // exp(A) by scaling, power series approximation and squaring

    with_neg = 'with_neg' === with_neg;

    var n = ROWS(A),
        i, N = 25, sgn = -1,
        In = eye(n), An,
        expA, expA_neg,
        tol = eps,
        k = max([O, n_add(I, realMath.floor(realMath.log2(norm(A, inf))))]);

    // down-scaling by a power of 2
    A = dotdiv(A, n_pow(two, k));

    // power series of exp(A) up to N terms,
    // I + A + A^2/2! + A^3/3! + ..
    // converges rapidly
    An = A;
    expA = add(In, An);
    expA_neg = with_neg ? sub(In, An) : In;
    for (i=2; i<=N; ++i)
    {
        sgn = -sgn;
        An = dotdiv(mul(A, An), __(i));
        expA = add(expA, An);
        if (with_neg) expA_neg = 0 > sgn ? sub(expA_neg, An) : add(expA_neg, An);
        if ((i > 5) && n_le(max(max(abs(An))), tol)) break;
    }

    // fast squaring
    for (i=1,k=_(k); i<=k; ++i) expA = mul(expA, expA);
    if (with_neg) for (i=1; i<=k; ++i) expA_neg = mul(expA_neg, expA_neg);

    return with_neg ? {'+':expA, '-':expA_neg} : expA;
}
fn.expm = function(A) {
    if (is_scalar(A)) return fn.exp(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("expm");
    if (1 === ROWS(A)) return [[fn.exp(A[0][0])]];
    return expm(A);
};
