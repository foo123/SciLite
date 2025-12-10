/*function qr(A, without_d, wantq, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var n = ROWS(A), m = COLS(A), T, l_u;
    /*
    Fraction free QR factoring(FFQR) based on completely fraction-free LU factoring (CFFLU)
    Input: A nxm matrix A.
    Output: Three matrices: Q, D, R where:
        Q is a nxm left orthogonal matrix,
        D is a mxm diagonal matrix,
        R is a mxm upper triangular matrix
        and A = Q*inv(D)*R

        use CFFLU([A.t*A | A.t]) and extract appropriate factors
    * /
    T = transpose(A);
    l_u = lu(concat(mul(T, A), T), without_d, eps);
    if (wantq)
    {
        return without_d ? [transpose(slice(l_u[1], 0, m, -1, -1))/*Q* /, transpose(l_u[0])/*R* /, transpose(l_u[2])/*P* /] : [l_u[0]/*D* /, transpose(slice(l_u[2], 0, m, -1, -1))/*Q* /, transpose(l_u[1])/*R* /, transpose(l_u[3])/*P* /];
    }
    else
    {
        return without_d ? transpose(l_u[0])/*R* / : transpose(l_u[1])/*R* /;
    }
}*/
function qr_givens(A, wantq)
{
    var m = ROWS(A), n = COLS(A),
        Q = wantq ? eye(m) : null,
        R = A, i, j, G, G_t;
    for (j=0; j<n; ++j)
    {
        for (i=m-1; i>=(j+1); --i)
        {
            //G = givens(m, i-1, i, R[i-1][j], R[i][j]);
            //G_t = ctranspose(G);
            G = compute_givens(R[i-1][j], R[i][j]);
            G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
            R = givensmul('left', G_t, i-1, i, R);//mul(ctranspose(G), R);
            if (wantq) Q = givensmul('right', G, i-1, i, Q);//mul(Q, G);
        }
    }
    return wantq ? [Q, R] : R;
}
fn.qr = varargout(function(nargout, x) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("qr");
    return qr_givens(x, 1 < nargout);//qr(x, true, 1 < nargout);
});
