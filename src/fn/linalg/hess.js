function hess(A, B, wantq, eps)
{
    var n = ROWS(A);
    eps = __(eps || 0);
    if (null == B)
    {
        var Q = wantq ? eye(n) : null,
            H = copy(A), G, G_t,
            k, i;
        for (k=1; k<=n-2; ++k)
        {
            // produces some reflected signs from Octave's hess
            for (i=n; i>=k+2; --i)
            {
                if (n_le(scalar_abs(H[i-1][k-1]), n_mul(scalar_abs(H[i-1-1][k-1]), eps)))
                {
                    // pass
                }
                else
                {
                    //G = givens(n, i-1-1, i-1, H[i-1-1][k-1], H[i-1][k-1]);
                    //G_t = ctranspose(G);
                    G = compute_givens(H[i-1-1][k-1], H[i-1][k-1]);
                    G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                    if (wantq) Q = rotmul('right', G, i-1-1, i-1, Q);//mul(Q, G);
                    H = rotmul('left', G_t, i-1-1, i-1, rotmul('right', G, i-1-1, i-1, H));//mul(G_t, mul(H, G));
                }
                H[i-1][k-1] = O; // zero-out any round-off
            }
        }
        return wantq ? [Q, H] : H;
    }
    else
    {
        var QR = qr(B, true, false, eps),
            Q = QR[0],
            Q_t = ctranspose(Q),
            Z = eye(n),
            AA = mul(Q_t, A),
            BB = mul(Q_t, B),
            k, i, Rl, Rl_t, Rr;
        for (k=1; k<=n-2; ++k)
        {
            for (i=n; i>=k+2; --i)
            {
                if (n_le(scalar_abs(AA[i-1][k-1]), n_mul(scalar_abs(AA[i-1-1][k-1]), eps)))
                {
                    // pass
                }
                else
                {
                    //Rl = givens(n, i-1-1, i-1, AA[i-1-1][k-1], AA[i-1][k-1]);
                    //Rl_t = ctranspose(Rl);
                    Rl = compute_givens(AA[i-1-1][k-1], AA[i-1][k-1]);
                    Rl_t = [scalar_conj(Rl[0]), scalar_neg(scalar_conj(Rl[1]))];
                    if (wantq) Q = rotmul('right', Rl, i-1-1, i-1, Q);//mul(Q, Rl);
                    AA = rotmul('left', Rl_t, i-1-1, i-1, AA);//mul(Rl_t, AA);
                    BB = rotmul('left', Rl_t, i-1-1, i-1, BB);//mul(Rl_t, BB);
                }
                AA[i-1][k-1] = O; // zero-out any round-off

                if (n_le(scalar_abs(BB[i-1][i-1-1]), n_mul(scalar_abs(BB[i-1][i-1]), eps)))
                {
                    // pass
                }
                else
                {
                    //Rr = givens(n, i-1-1, i-1, scalar_neg(BB[i-1][i-1]), BB[i-1][i-1-1]);
                    Rr = compute_givens(scalar_neg(BB[i-1][i-1]), BB[i-1][i-1-1]);
                    if (wantq) Z = rotmul('right', Rr, i-1-1, i-1, Z);//mul(Z, Rr);
                    AA = rotmul('right', Rr, i-1-1, i-1, AA);//mul(AA, Rr);
                    BB = rotmul('right', Rr, i-1-1, i-1, BB);//mul(BB, Rr);
                }
                BB[i-1][i-1-1] = O; // zero-out any round-off
            }
        }
        return [AA, BB, Q, Z];
    }
}
fn.hess = varargout(function(nargout, A, B) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("hess");
    if (2 < arguments.legnth)
    {
        if (is_scalar(B)) B = [[B]];
        if (!is_matrix(B) || (ROWS(B) !== COLS(B))) not_supported("hess");
        return hess(A, B, 2 < nargout);
    }
    else
    {
        return hess(A, null, 1 < nargout);
    }
});
