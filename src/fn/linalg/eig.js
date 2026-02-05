/*function eig_pow(A, wantv, wantw, eps)
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
    return [
    realify(D),
    realify(transpose(V)),
    realify(transpose(W))
    ];
}*/
function eig_schur(A, wantv, wantw, eps)
{
    // triangularize via schur
    // eigenvalues are on diagonal
    // eigenvectors can be found from the nullspace of A-λI via fast backsubstitution
    var Q = schur(A, true, fn.isreal(A) ? "realcomplex" : "complex", eps),
        i, j, n,
        D, V, W,
        v, w,
        sortperm, lambda,
        Alambda, AlambdaT,
        multiplicity, free;
    A = Q[1];
    Q = Q[0];
    n = ROWS(A);
    D = array(n, function(i) {return realify(A[i][i]);});

    if (wantv || wantw)
    {
        sortperm = array(n, function(i) {return i;}).sort(function(i, j) {
            var a = D[i],
                b = D[j],
                aa = scalar_abs(a),
                ab = scalar_abs(b),
                ra = real(a),
                rb = real(b);
            return (n_gt(ab, aa) ? 1 : (n_lt(ab, aa) ? -1 : (n_gt(rb, ra) ? 1 : (n_lt(rb, ra) ? -1 : 0)))) || (j-i);
        });

        if (wantv)
        {
            V = new Array(n);
            Alambda = copy(A);
        }
        if (wantw)
        {
            W = new Array(n);
            AlambdaT = ctranspose(A);
        }
        free = array(n, O);

        for (i=0; i<n; ++i)
        {
            multiplicity = 1;
            lambda = D[sortperm[i]];
            j = i-1;
            while ((j >= 0) && n_le(scalar_abs(scalar_sub(lambda, D[sortperm[j]])), eps))
            {
                ++multiplicity;
                --j;
            }
            // generate new independent eigenvector if possible
            // based on multiplicity of eigenvalue
            free[multiplicity-1] = I;
            if (wantv)
            {
                for (j=0; j<n; ++j) Alambda[j][j] = scalar_sub(A[j][j], lambda);
                v = solve_tri("upper", Alambda, null, eps, free);
                V[sortperm[i]] = dotdiv(v, norm(v));
            }
            if (wantw)
            {
                for (j=0; j<n; ++j) AlambdaT[j][j] = scalar_sub(conj(A[j][j]), lambda);
                w = solve_tri("lower", AlambdaT, null, eps, free);
                W[sortperm[i]] = dotdiv(w, norm(w));
            }
            free[multiplicity-1] = O;
        }
    }
    return [
    D,
    wantv ? mul(Q, realify(transpose(V))) : null,
    wantw ? mul(ctranspose(Q), realify(ctranspose(W))) : null
    ];
}
function ordeig(T)
{
    var n = ROWS(T), i = 0, eig = new Array(n),
        a, b, c, d, p, q, D;
    for (;i<n;)
    {
        if ((i+1 < n) && !eq(T[i+1][i], O))
        {
            // 2x2 block, complex conjugate values
            //eig[i] = new complex(T[i][i], T[i][i+1]);
            //++i;
            //eig[i] = new complex(T[i][i], T[i][i-1]);
            //++i;
            a = T[i][i];
            b = T[i][i+1];
            c = T[i+1][i];
            d = T[i+1][i+1];
            p = scalar_add(a, d);
            q = scalar_sub(scalar_mul(a, d), scalar_mul(b, c));
            D = fn.sqrt(scalar_sub(scalar_mul(p, p), scalar_mul(q, 4)));
            eig[i] = scalar_div(scalar_add(p, D), two);
            eig[i+1] = scalar_div(scalar_sub(p, D), two);
            i += 2;
        }
        else
        {
            // 1x1 block, diagonal value
            eig[i] = T[i][i];
            i += 1;
        }
    }
    return eig;
}
fn.ordeig = function(T) {
    if (arguments.length > 1) not_supported("ordeig");
    if (is_scalar(T)) T = [[T]];
    if (!is_matrix(T) || (ROWS(T) !== COLS(T))) not_supported("ordeig");
    return ordeig(T);
};
fn.eig = varargout(function(nargout, A, nobalance) {
    if (is_matrix(nobalance)) not_supported("eig");
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("eig");
    var T = null, ans;
    if ('nobalance' !== nobalance)
    {
        // always balance the matrix, unless explicitly bypassed
        if (1 < nargout)
        {
            T = balance(A, null, true);
            A = T[1];
            T = T[0];
        }
        else
        {
            A = balance(A, null, false);
        }
    }
    if (1 < nargout)
    {
        //ans = eig_pow(A, 1 < nargout, 2 < nargout, 1e-16);
        ans = eig_schur(A, 1 < nargout, 2 < nargout, 1e-16);
        return [T && ans[1] ? mul(diag(T), ans[1]) : ans[1], diag(ans[0]), T && ans[2] ? mul(diag(T.map(function(ti) {return n_inv(ti);})), ans[2]) : ans[2]];
    }
    else
    {
        if (is_tri(A, "lower", true, 1e-16))
        {
            // lower triangular
            // pass
        }
        else
        {
            // triangularize via schur, schur checks if already upper triangular
            A = schur(A, false, fn.isreal(A) ? "realcomplex" : "complex", 1e-16);
        }
        // get eigenvalues from diagonal
        return realify(array(ROWS(A), function(i) {return A[i][i];}));
        /*
        return realify(is_tri(A, 'upper', true, 1e-16) || is_tri(A, 'lower', true, 1e-16) ? array(ROWS(A), function(i) {
                return A[i][i];
            }) : roots(charpoly(A)));
        */
    }
});
