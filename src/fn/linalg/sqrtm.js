function sqrtm(A)
{
    /*
    "A new stable and avoiding inversion iteration for computing matrix square root",
    Li ZHU, Keqi YE, Yuelin ZHAO, Feng WU, Jiqiang HU, Wanxie ZHONG, 2022
    https://arxiv.org/abs/2206.10346
    */
    var n = ROWS(A),
        X, Xnext,
        Y, Ynext,
        In, I34,
        one_fourth = __(0.25),
        three_fourths = __(0.75),
        m, a, iter, eps = __(1e-10);
    // estimate of 2-norm of A for convergence test
    m = fn.sqrt(scalar_mul(norm(A, 1), norm(A, inf)));
    eps = scalar_mul(eps, m);
    In = eye(n);
    I34 = eye(n, three_fourths);
    a = half;
    m = scalar_div(a, m);
    X = dotmul(A, fn.sqrt(m));
    Y = sub(In, dotmul(A, m));
    for (iter=1; iter<=1000; ++iter)
    {
        Xnext = mul(X, add(In, dotmul(half, Y)));
        if (n_le(norm(sub(Xnext, X), 'fro'), eps)) break;
        Ynext = mul(mul(Y, Y), add(I34, dotmul(one_fourth, Y)));
        X = Xnext; Y = Ynext;
    }
    return realify(X); // -> A^(1/2)
}
fn.sqrtm = varargout(function(nargout, A) {
    if (2 < nargout) throw "sqrtm: output not supported";
    if (is_scalar(A)) return 1 < nargout ? [fn.sqrt(A), O] : fn.sqrt(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sqrtm");
    var sqrtA = sqrtm(A);
    return 1 < nargout ? [sqrtA, scalar_div(norm(sub(A, pow(sqrtA, 2)), 1), norm(A, 1))] : sqrtA;
});
