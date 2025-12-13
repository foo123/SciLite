function expm(A)
{
    /*
    "Matrix Computations",
    Golub G.H., Van Loan C.F., 1996
    Algorithm 11.3.1
    */
    var n = ROWS(A),
        eps = __(1e-10),
        In = eye(n),
        D = In, N = In,
        X = In, c = I,
        j = max([O, n_add(I, realMath.floor(realMath.log2(norm(A, inf))))]),
        q = 2*n*n/*TODO function of eps*/, k, s;
    A = dotdiv(A, n_pow(two, j));
    for (s=I,k=1; k<=q; ++k)
    {
        c = n_div(n_mul(c, n_add(n_sub(q, k), I)), n_mul(n_add(n_sub(n_mul(two, q), k), I), k));
        X = mul(A, X);
        N = add(N, dotmul(c, X));
        D = add(D, dotmul(n_mul(s, c), X));
        s = I === s ? J : I;
    }
    F = linsolve(D, N);
    for (k=1,j=_(j); k<=j; ++k)
    {
        F = mul(F, F);
    }
    return F; // -> exp(A)
}
fn.expm = function(A) {
    if (is_scalar(A)) return fn.exp(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("expm");
    return expm(A);
});
