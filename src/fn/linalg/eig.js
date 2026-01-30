function eig_power(A, eps)
{
    // eig power iteration method
    eps = __(eps || 1e-10);
    var e, d, v, w,
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
function eig_from_schur(A)
{
    var n = ROWS(A), i = 0, e = new Array(n);
    for (;i<n;)
    {
        if ((i+1 < n) && !eq(A[i+1][i], O))
        {
            // 2x2 block, complex conjugate values
            e[i] = new complex(A[i][i], A[i][i+1]);
            ++i;
            e[i] = new complex(A[i][i], A[i][i-1]);
            ++i;
        }
        else
        {
            // 1x1 block, diagonal value
            e[i] = A[i][i];
            ++i;
        }
    }
    return e;
}
function eig_tri(A, eps)
{
    // TODO
}
fn.eig = varargout(function(nargout, A, nobalance) {
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("eig");
    if (is_matrix(nobalance)) not_supported("eig");
    var T = null, Q, ans;
    if ('nobalance' !== nobalance)
    {
        T = balance(A, null, true);
        A = T[1];
        T = T[0];
    }
    if (1 < nargout)
    {
        // TODO implement more general and efficient eig routine
        ans = eig_power(A, 1e-12);
        return [T ? mul(diag(T), ans[0]) : ans[0], diag(ans[1]), T ? mul(diag(T.map(function(ti) {return n_inv(ti);})), ans[2]) : ans[2]];
        /*
        // triangularize via schur
        // eigenvectors can also be found from the nullspace of A-λI via fast backsubstitution
        Q = schur(A, true, "real", 1e-12);
        A = Q[1];
        Q = Q[0];
        ans = eig_tri(A, 1e-12);
        return [T ? mul(diag(T), mul(Q, ans[0])) : mul(Q, ans[0]), diag(ans[1]), T ? mul(diag(T.map(function(ti) {return n_inv(ti);})), mul(ctranspose(Q), ans[2])) : mul(ctranspose(Q), ans[2])];
        */
    }
    else
    {
        if (is_tri(A, "lower", true, 1e-12))
        {
            // lower triangular, diagonal entries
            ans = realify(array(ROWS(A), function(i) {return A[i][i];}));
        }
        else
        {
            // triangularize via schur, schur checks if already upper triangular
            ans = realify(eig_from_schur(schur(A, false, "real", 1e-12)));
        }
        // get sorted eigen values
        return ans.sort(function(a, b) {
            var aa = scalar_abs(a), ab = scalar_abs(b),
                ra = real(a), rb = real(b);
            return n_gt(ab, aa) ? 1 : (n_lt(ab, aa) ? -1 : (n_gt(rb, ra) ? 1 : (n_lt(rb, ra) ? -1 : 0)));
        });
        /*
        return realify((is_tri(A, 'upper', true, 1e-12) || is_tri(A, 'lower', true, 1e-12) ? array(ROWS(A), function(i) {
                return A[i][i];
            }) : roots(charpoly(A))).sort(function(a, b) {
                var aa = scalar_abs(a), ab = scalar_abs(b)
                return n_gt(ab, aa) ? 1 : (n_lt(ab, aa) ? -1 : 0);
            })
        );
        */
    }
});
