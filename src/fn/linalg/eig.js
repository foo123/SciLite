function eig_power(A)
{
    var e, d, v, w,
        eps = __(1e-10),
        n, N = ROWS(A),
        V = new Array(N),
        W = new Array(N),
        D = array(N, O);

    A = copy(A);
    for (n=0; n<N; ++n)
    {
        e = largest_eig(A, N, eps);
        d = e[0];
        v = e[1];
        w = e[2];
        D[n] = d;
        V[n] = v;
        W[n] = w;
        A = sub(A, mul(mul(scalar_div(d, dot(v, w, true)), v), w));
    }
    return [realify(transpose(V)), realify(D), realify(transpose(W))];
}
fn.eig = varargout(function(nargout, A, nobalance) {
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("eig");
    if (is_matrix(nobalance)) not_supported("eig");
    var T = null, ans;
    if ('nobalance' !== nobalance)
    {
        T = balance(A, two, true);
        A = T[1];
        T = T[0];
    }
    // TODO implement more general and efficient eig routine
    if (1 < nargout)
    {
        ans = eig_power(A);
        return [T ? mul(diag(T), ans[0]) : ans[0], diag(ans[1]), T ? mul(diag(T.map(function(ti) {return n_inv(ti);})), ans[2]) : ans[2]];
    }
    else
    {
        return realify((is_tri(A, 'upper', true, 1e-15) || is_tri(A, 'lower', true, 1e-15) ? array(ROWS(A), function(i) {
                return A[i][i];
            }) : roots(charpoly(A))).sort(function(a, b) {
                var aa = scalar_abs(a), ab = scalar_abs(b)
                return n_gt(ab, aa) ? 1 : (n_lt(ab, aa) ? -1 : 0);
            })
        );
    }
});
