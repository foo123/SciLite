function qr(A, wantq, wantp, eps)
{
    var m = ROWS(A), n = COLS(A),
        Q = wantq ? eye(m) : null,
        R = A, P, p, t,
        colnorms, max,
        i, j, k, G, G_t, hh;
    eps = __(eps || 0);
    if (!is_tri(R, "upper", false, eps))
    {
        R = copy(A);
        if (wantp)
        {
            hh = {};
            P = array(n, function(j) {return j;});
            colnorms = array(n, function(col) {
                return norm(COL(R, col), two);
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
                    t = colnorms[j];
                    colnorms[j] = colnorms[p];
                    colnorms[p] = t;
                    t = P[j];
                    P[j] = P[p];
                    P[p] = t;
                    for (i=0; i<m; ++i)
                    {
                        t = R[i][j];
                        R[i][j] = R[i][p];
                        R[i][p] = t;
                    }
                }

                /*
                // qr via givens rotations
                for (i=m-1; i>=(j+1); --i)
                {
                    if (n_le(scalar_abs(R[i][j]), n_mul(scalar_abs(R[i-1][j]), eps)))
                    {
                        R[i][j] = O;
                    }
                    else
                    {
                        //G = givens(m, i-1, i, R[i-1][j], R[i][j]);
                        //G_t = ctranspose(G);
                        G = compute_givens(R[i-1][j], R[i][j]);
                        G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                        R = rotmul('left', G_t, i-1, i, R);//mul(G_t, R);
                        if (wantq) Q = rotmul('right', G, i-1, i, Q);//mul(Q, G);
                    }
                }
                */

                // qr via householder reflections
                hh.v = array(m-j, O);
                compute_householder(R, hh, j, m-1, j, j, eps);
                // -- R := HR
                R = hh_mul('left', hh, R, j);//R(j:end,:) = R(j:end,:)-(tau*w)*(w'*R(j:end,:));
                // zero-out round-off remainders
                for (i=j+1; i<m; ++i) R[i][j] = O;
                // -- Q := QH
                if (wantq) Q = hh_mul('right', hh, Q, j);//Q(:,j:end) = Q(:,j:end)-(Q(:,j:end)*w)*(tau*w)';

                for (i=j+1; i<n; ++i)
                {
                    colnorms[i] = n_sub(colnorms[i], n_pow(scalar_abs(R[j][i]), two));
                }
            }
        }
        else
        {
            /*
            // qr via givens rotations
            // produces some reflected signs from Octave's qr
            for (j=0; j<n; ++j)
            {
                for (i=m-1; i>=(j+1); --i)
                {
                    if (n_le(scalar_abs(R[i][j]), n_mul(scalar_abs(R[i-1][j]), eps)))
                    {
                        R[i][j] = O;
                    }
                    else
                    {
                        //G = givens(m, i-1, i, R[i-1][j], R[i][j]);
                        //G_t = ctranspose(G);
                        G = compute_givens(R[i-1][j], R[i][j]);
                        G_t = [scalar_conj(G[0]), scalar_neg(scalar_conj(G[1]))];
                        R = rotmul('left', G_t, i-1, i, R);//mul(G_t, R);
                        if (wantq) Q = rotmul('right', G, i-1, i, Q);//mul(Q, G);
                    }
                }
            }
            */
            // qr via householder reflections
            hh = {};
            for (j=0; j<n; ++j)
            {
                // -- Find H = I-tau*w*w' to put zeros below R(j,j)
                hh.v = array(m-j, O);
                compute_householder(R, hh, j, m-1, j, j, eps);
                // -- R := HR
                R = hh_mul('left', hh, R, j);//R(j:end,:) = R(j:end,:)-(tau*w)*(w'*R(j:end,:));
                // zero-out round-off remainders
                for (i=j+1; i<m; ++i) R[i][j] = O;
                // -- Q := QH
                if (wantq) Q = hh_mul('right', hh, Q, j);//Q(:,j:end) = Q(:,j:end)-(Q(:,j:end)*w)*(tau*w)';
            }
        }
    }
    return wantq && wantp ? [Q, R, P ? matrix(n, n, function(i, j) {return i === P[j] ? I : O;}) : eye(n)] : (wantq ? [Q, R] : R);
}
fn.qr = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("qr");
    return qr(A, 1 < nargout, 2 < nargout);
});
