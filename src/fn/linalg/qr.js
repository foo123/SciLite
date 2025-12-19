/*function qr(A, without_d, wantq, wantp, eps)
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
function qr(A, wantq, wantp)
{
    var m = ROWS(A), n = COLS(A),
        Q = wantq ? eye(m) : null,
        R = A, P, p, t,
        colnorms, max,
        i, j, k, G, G_t;
    /*if (wantp)
    {
        P = array(n, function(i) {
            return i;
        });
        colnorms = array(n, function(col) {
            return norm(COL(R, col), 2);
        });
        for (j=0; j<n; ++j)
        {
            p = j;
            max = colnorms[p];
            for (i=j+1; i<n; ++i)
            {
                if (n_gt(colnorms[i], max))
                {
                    p = i;
                    max = colnorms[p];
                }
            }
            if (n_eq(max, O)) break;
            if (j !== p)
            {
                t = P[j];
                P[j] = P[p];
                P[p] = t;
                t = colnorms[j];
                colnorms[j] = colnorms[p];
                colnorms[p] = t;
                for (i=0; i<m; ++i)
                {
                    t = R[i][j];
                    R[i][j] = R[i][p];
                    R[i][p] = t;
                }
            }
            // -- Find H = I-tau*w*w' to put zeros below R(j,j)
            normx = norm(COL(R, j).slice(j), 2);
            s     = scalar_neg(scalar_sign(R[j][j]));
            u1    = scalar_sub(R[j][j], scalar_mul(s, normx));
            w     = dotdiv(R[j:end][j], u1); 
            w[0]  = I;
            tau   = scalar_neg(scalar_mul(s, scalar_div(u1, normx)));

            // -- R := HR, Q := QH
            for (i=j; i<m; ++i)
            {
                //R(j:end,:) = R(j:end,:)-(tau*w)*(w'*R(j:end,:));
                //Q(:,j:end) = Q(:,j:end)-(Q(:,j:end)*w)*(tau*w)';
                for (k=j+1; k<n; ++k)
                {
                    R[i][k] = R[i][k]-(tau*w[i])*(scalar_conj(w[i])*)
                }
            }
        }
    }
    else
    {*/
        for (j=0; j<n; ++j)
        {
            for (i=m-1; i>=(j+1); --i)
            {
                //G = givens(m, i-1, i, R[i-1][j], R[i][j]);
                //G_t = ctranspose(G);
                G = compute_givens(R[i-1][j], R[i][j]);
                G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                R = rotmul('left', G_t, i-1, i, R);//mul(ctranspose(G), R);
                if (wantq) Q = rotmul('right', G, i-1, i, Q);//mul(Q, G);
            }
        }
    /*}*/
    return wantq && wantp ? [Q, R, eye(n)] : (wantq ? [Q, R] : R);
}
fn.qr = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("qr");
    return qr(A, 1 < nargout, 2 < nargout);//qr(A, true, 1 < nargout, 2 < nargout);
});
