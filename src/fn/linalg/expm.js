function expm(A)
{
    /*
    "Nineteen Dubious Ways to Compute the Exponential of a Matrix, Twenty-Five Years Later",
    Cleve Moler, Charles Van Loan,
    SIAM REVIEW, 2003
    */
    // exp(A) by scaling, Taylor approximation and squaring
    var n = ROWS(A),
        i, N,
        In = eye(n),
        expA, An,
        k = max([O, n_add(I, realMath.floor(realMath.log2(norm(A, inf))))]);
    // down-scaling by a power of 2
    A = dotdiv(A, n_pow(two, k));
    An = A;
    // Taylor expansion of exp(A) up to N terms,
    // I + A + A^2/2! + A^3/3! + ..
    // in general converges
    expA = add(In, An);
    for (i=2,N=100; i<=N; ++i)
    {
        An = dotdiv(mul(A, An), __(i));
        expA = add(expA, An);
    }
    // fast squaring
    for (i=1,k=_(k); i<=k; ++i)
    {
        expA = mul(expA, expA);
    }
    return expA;
}
fn.expm = function(A) {
    if (is_scalar(A)) return fn.exp(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("expm");
    return expm(A);
};
fn.sinm = function(A) {
    if (is_scalar(A)) return fn.sin(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sinm");
    return dotdiv(sub(expm(dotmul(A, i)), expm(dotmul(A, scalar_mul(J, i)))), scalar_mul(two, i));
};
fn.cosm = function(A) {
    if (is_scalar(A)) return fn.cos(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("cosm");
    return dotdiv(add(expm(dotmul(A, i)), expm(dotmul(A, scalar_mul(J, i)))), two);
};
fn.sinhm = function(A) {
    if (is_scalar(A)) return fn.sinh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sinhm");
    return dotdiv(sub(expm(A), expm(dotmul(A, J))), two);
};
fn.coshm = function(A) {
    if (is_scalar(A)) return fn.cosh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("coshm");
    return dotdiv(add(expm(A), expm(dotmul(A, J))), two);
};
