function largest_eig(A, N, eps, O, I)
{
    // power method
    var iter,
        A_t = ctranspose(A),
        k, prev_k,
        v, prev_v,
        w, prev_w;

    k = O;
    v = array(N, function() {return new complex(__(stdMath.random() || 0.1), O);});
    v = dotdiv(v, norm(v));
    w = array(N, function() {return new complex(__(stdMath.random() || 0.1), O);});
    w = dotdiv(w, norm(w));

    for (iter=1; iter<=100; ++iter)
    {
        prev_k = k;
        prev_v = v;
        prev_w = w;
        v = vec(mul(A, v));
        w = vec(mul(A_t, w));
        k = dot(v, prev_v);
        v = dotdiv(v, v[0].sign());
        w = dotdiv(w, w[0].sign());
        v = dotdiv(v, norm(v));
        w = dotdiv(w, norm(w));
        if (n_le(realMath.abs(n_sub(real(k), real(prev_k))), eps) && n_le(realMath.abs(n_sub(imag(k), imag(prev_k))), eps)) break;
    }
    return [k, v, w];
}
function eig_power(A)
{
    var e, d, v, w,
        eps = __(1e-10),
        O = __(0),
        I = __(1),
        n, N = ROWS(A),
        V = new Array(N),
        W = new Array(N),
        D = array(N, 0);

    A = copy(A);
    for (n=0; n<N; ++n)
    {
        e = largest_eig(A, N, eps, O, I);
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
    var T = null;
    if ('nobalance' !== nobalance)
    {
        T = balance(A, 2, true);
        A = T[1];
        T = T[0];
    }
    // TODO implement more general and efficient eig routine
    if (1 < nargout)
    {
        var ans = eig_power(A);
        return [T ? mul(diag(T), ans[0]) : ans[0], diag(ans[1]), T ? mul(diag(T.map(function(ti) {return n_inv(ti);})), ans[2]) : ans[2]];
    }
    else
    {
        return realify((is_tri(A, 'upper', true, 1e-15) || is_tri(A, 'lower', true, 1e-15) ? array(ROWS(A), function(i) {
                return A[i][i];
            }) : roots(charpoly(A))).sort(function(a, b) {
                return scalar_abs(b) - scalar_abs(a);
            })
        );
    }
});
