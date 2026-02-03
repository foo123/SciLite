// adapted from https://github.com/foo123/Abacus
function SWAPR(m, i, j)
{
    // swap rows i and j
    if (i !== j)
    {
        var t = m[i];
        m[i] = m[j];
        m[j] = t;
    }
    return m;
}
function SWAPC(m, i, j)
{
    // swap columns i and j
    if (i !== j)
    {
        var k, n = m.length, t;
        for (k=0; k<n; ++k)
        {
            t = m[k][i];
            m[k][i] = m[k][j];
            m[k][j] = t;
        }
    }
    return m;
}
function ADDR(m, i, j, a, b, k0)
{
    // add (a multiple of) row j to (a multiple of) row i
    var k, n = m[0].length;
    if (null == a) a = I;
    if (null == b) b = I;
    for (k=k0||0; k<n; ++k)
        m[i][k] = scalar_add(scalar_mul(b, m[i][k]), scalar_mul(a, m[j][k]));
    return m;
}
function ADDC(m, i, j, a, b, k0)
{
    // add (a multiple of) column j to (a multiple of) column i
    var k, n = m.length;
    if (null == a) a = I;
    if (null == b) b = I;
    for (k=k0||0; k<n; ++k)
        m[k][i] = scalar_add(scalar_mul(b, m[k][i]), scalar_mul(a, m[k][j]));
    return m;
}
function MULR(m, i0, i1, a, b, c, d)
{
    var j, l = m[0].length, x, y;
    for (j=0; j<l; ++j)
    {
        x = m[i0][j]; y = m[i1][j];
        m[i0][j] = scalar_add(scalar_mul(a, x), scalar_mul(b, y));
        m[i1][j] = scalar_add(scalar_mul(c, x), scalar_mul(d, y));
    }
    return m;
}
function MULC(m, j0, j1, a, b, c, d)
{
    var i, l = m.length, x, y;
    for (i=0; i<l; ++i)
    {
        x = m[i][j0]; y = m[i][j1];
        m[i][j0] = scalar_add(scalar_mul(a, x), scalar_mul(c, y));
        m[i][j1] = scalar_add(scalar_mul(b, x), scalar_mul(d, y));
    }
    return m;
}
function EQU(m1, m2)
{
    if (is_scalar(m2))
    {
        if (is_scalar(m1)) return eq(m1, m2);
        else return m1.filter(function(m1i) {return EQU(m1i, m2);}).length === m1.length;
    }
    else if (is_array(m2))
    {
        if (is_scalar(m1)) return EQU(m2, m1);
        return (m1.length === m2.length) && m1.filter(function(m1i, i) {return EQU(m1i, m2[i]);}).length === m2.length;
    }
    return false;
}
function slice(A, r1, c1, r2, c2)
{
    var rows = ROWS(A), columns = COLS(A);
    if (!rows || !columns) return [];
    if (is_array(r1) && is_array(c1))
    {
        r1 = r1.filter(function(i) {return 0 <= i && i < rows;});
        c1 = c1.filter(function(j) {return 0 <= j && j < columns;});
        return matrix(r1.length, c1.length, function(i, j) {
            return A[r1[i]][c1[j]];
        });
    }
    else
    {
        if (null == r1) r1 = 0;
        if (null == c1) c1 = 0;
        if (null == r2) r2 = rows-1;
        if (null == c2) c2 = columns-1;
        if (0 > r1) r1 += rows;
        if (0 > c1) c1 += columns;
        if (0 > r2) r2 += rows;
        if (0 > c2) c2 += columns;
        r1 = stdMath.max(0, stdMath.min(rows-1, r1));
        r2 = stdMath.max(0, stdMath.min(rows-1, r2));
        c1 = stdMath.max(0, stdMath.min(columns-1, c1));
        c2 = stdMath.max(0, stdMath.min(columns-1, c2));
        return r1 <= r2 && c1 <= c2 ? matrix(r2-r1+1, c2-c1+1, function(i, j) {
            return A[r1+i][c1+j];
        }) : [];
    }
}
function concat(A, B, axis)
{
    axis = axis || 'horz';
    var rA = ROWS(A), cA = COLS(A), rB = ROWS(B), cB = COLS(B);
    if ('vert' === axis)
    {
        // |  A  |
        // | --- |
        // |  B  |
        return matrix(rA+rB, stdMath.max(cA, cB), function(i, j) {
            if (j >= cA)
                return i < rA ? O : B[i-rA][j];
            else if (j >= cB)
                return i < rA ? A[i][j] : O;
            else
                return i < rA ? A[i][j] : B[i-rA][j];
        });
    }
    else //if ('horz' === axis)
    {
        // | A | B |
        return matrix(stdMath.max(rA, rB), cA+cB, function(i, j) {
            if (i >= rA)
                return j < cA ? O : B[i][j-cA];
            else if (i >= rB)
                return j < cA ? A[i][j] : O;
            else
                return j < cA ? A[i][j] : B[i][j-cA];
        });
    }
}
function is_tri(A, type, strict, eps, setzero, setcopy)
{
    var nr = ROWS(A), nc = COLS(A), n, r, c, tol;
    if ((false !== strict) && (nr !== nc)) return false;

    eps = __(eps || 0);
    n = stdMath.min(nr, nc);
    tol = n_gt(eps, O) ? n_mul(n_div(sum(array(n, function(i) {return scalar_abs(A[i][i]);})), n), eps) : O;
    for (r=0; r<n; ++r)
    {
        //tol = n_mul(scalar_abs(A[r][r]), eps);
        if (('lower' === type) || ('diagonal' === type))
        {
            for (c=r+1; c<n; ++c) if (!le(scalar_abs(A[r][c]), tol)) return false;
        }
        if (('upper' === type) || ('diagonal' === type))
        {
            for (c=0; c<r; ++c) if (!le(scalar_abs(A[r][c]), tol)) return false;
        }
    }
    if (nr > nc)
    {
        // should be all zero
        //tol = n_mul(scalar_abs(A[n-1][n-1]), eps);
        for (r=n; r<nr; ++r)
        {
            for (c=0; c<nc; ++c) if (!le(scalar_abs(A[r][c]), tol)) return false;
        }
    }
    else if (nr < nc)
    {
        // should be all zero
        //tol = n_mul(scalar_abs(A[n-1][n-1]), eps);
        for (c=n; c<nc; ++c)
        {
            for (r=0; r<nr; ++r) if (!le(scalar_abs(A[r][c]), tol)) return false;
        }
    }
    if ((true === setzero) && n_gt(eps, O))
    {
        if (setcopy && setcopy._) A = setcopy._ = copy(A);
        if (('upper' === type) || ('diagonal' === type))
        {
            for (r=0; r<n; ++r)
            {
                for (c=0; c<r; ++c)
                {
                    A[r][c] = O;
                }
            }
        }
        if (('lower' === type) || ('diagonal' === type))
        {
            for (r=0; r<n; ++r)
            {
                for (c=r+1; c<n; ++c)
                {
                    A[r][c] = O;
                }
            }
        }
        if (nr > nc)
        {
            // should be all zero
            for (r=n; r<nr; ++r)
            {
                for (c=0; c<nc; ++c)
                {
                    A[r][c] = O;
                }
            }
        }
        else if (nr < nc)
        {
            // should be all zero
            for (c=n; c<nc; ++c)
            {
                for (r=0; r<nr; ++r)
                {
                    A[r][c] = O;
                }
            }
        }
    }
    return true;
}
function compute_givens(f, g)
{
    /*
    "On Computing Givens Rotations Reliably and Efficiently",
    DAVID BINDEL, JAMES DEMMEL, WILLIAM KAHAN, OSNI MARQUES,
    ACM Transactions on Mathematical Software, Vol. 28, No. 2, June 2002
    */
    // f, g may be real or complex
    var c, s, r, sf, af, n;
    if (eq(g, O))
    {
        c = I;
        s = O;
        //r = f;
    }
    else if (eq(f, O))
    {
        c = O;
        s = scalar_sign(scalar_conj(g));
        if (eq(s, O)) s = I;
        //r = scalar_abs(g);
    }
    else
    {
        sf = scalar_sign(f);
        af = scalar_abs(f);
        n = n_hypot(af, scalar_abs(g));
        c = scalar_div(af, n);
        s = scalar_div(scalar_mul(sf, scalar_conj(g)), n);
        //r = scalar_mul(sf, n);
    }
    return [c, s/*, r*/]; // skip r
}
function compute_jacobi(alpha, beta, gamma)
{
    // Compute the Jacobi/Givens rotation
    //
    //   [ c -s ] [ alpha beta  ] [  c s ] = [ alpha_new 0        ]
    //   [ s  c ] [ beta  gamma ] [ -s c ]   [ 0         beta_new ]
    //
    if (eq(beta, O))
    {
        return [
            [I, O],
            [O, I]
        ];
    }
    else
    {
        var b = scalar_div(scalar_sub(gamma, alpha), scalar_mul(beta, two)),
            t = scalar_div(scalar_sign(b), scalar_add(scalar_add(scalar_abs(b), fn.sqrt(scalar_pow(b, two))), I));
            c = scalar_inv(fn.sqrt(scalar_add(I, scalar_pow(t, two)))),
            s = scalar_mul(c, t);
        return [
            [c,             s],
            [scalar_neg(s), c]
        ];
    }
}
/*function givens(n, p, q, f, g)
{
    var givens_rot = compute_givens(f, g),
        c = givens_rot[0], s = givens_rot[1];
    return matrix(n, n, function(i, j) {
        if (i === j)
        {
            return (p === i) || (q === j) ? c : I;
        }
        else if ((p === i) && (q === j) || (p === j) && (q === i))
        {
            return i < j ? scalar_neg(s) : s;
        }
        return O;
    });
}*/
function rotmul(type, G, p, q, A, i1, i2)
{
    var n, i, j, B = A, Ap, Aq,
        Gpp, Gpq, Gqp, Gqq;
    if ((2 === G.length) && is_scalar(G[0]))
    {
        // c, s
        Gpp = G[0];
        Gpq = scalar_neg(G[1]);
        Gqp = G[1];
        Gqq = G[0];
    }
    else if ((2 === G.length) && (2 === G[0].length))
    {
        // jacobi/givens compact matrix
        Gpp = G[0][0];
        Gpq = G[0][1];
        Gqp = G[1][0];
        Gqq = G[1][1];
    }
    else
    {
        // jacobi/givens full matrix
        Gpp = G[p][p];
        Gpq = G[p][q];
        Gqp = G[q][p];
        Gqq = G[q][q];
    }
    if ('right' === type)
    {
        /*
        a1 b1 c1 d1 | 1 0  0 0  = a1 (G[:,i]*A[1,:]) c1 (G[:,j]*A[1,:])
        a2 b2 c2 d2 | 0 c -s 0  = a2 (G[:,i]*A[2,:]) c2 (G[:,j]*A[2,:])
        a3 b3 c3 d3 | 0 s  c 0  = a3 (G[:,i]*A[3,:]) c3 (G[:,j]*A[3,:])
        a4 b4 c4 d4 | 0 0  0 1  = a4 (G[:,i]*A[4,:]) c4 (G[:,j]*A[4,:])
        */
        // A(:, [k l]) = A(:, [k l])*G;
        n = ROWS(A);
        if (null == i1) i1 = 0;
        if (null == i2) i2 = n-1;
        for (i=i1; i<=i2; ++i)
        {
            Ap = A[i][p]; Aq = A[i][q];
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[j][p], A[i][j]));
            }*/
            B[i][p] = scalar_add(scalar_mul(Gpp, Ap), scalar_mul(Gqp, Aq));
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[j][q], A[i][j]));
            }*/
            B[i][q] = scalar_add(scalar_mul(Gpq, Ap), scalar_mul(Gqq, Aq));
        }
    }
    else//if ('left' === type)
    {
        /*
        1 0  0 0 | a1 b1 c1 d1 = a1 b1 c1 d1
        0 c -s 0 | a2 b2 c2 d2 = (G[i,:]*A[:,1]) (G[i,:]*A[:,2]) (G[i,:]*A[:,3]) (G[i,:]*A[:,4])
        0 s  c 0 | a3 b3 c3 d3 = (G[j,:]*A[:,1]) (G[j,:]*A[:,2]) (G[j,:]*A[:,3]) (G[j,:]*A[:,4])
        0 0  0 1 | a4 b4 c4 d4 = a4 b4 c4 d4
        */
        // A([k l], :) = G'*A([k l], :);
        n = COLS(A);
        if (null == i1) i1 = 0;
        if (null == i2) i2 = n-1;
        for (i=i1; i<=i2; ++i)
        {
            Ap = A[p][i]; Aq = A[q][i];
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[p][j], A[j][i]));
            }*/
            B[p][i] = scalar_add(scalar_mul(Gpp, Ap), scalar_mul(Gpq, Aq));
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[q][j], A[j][i]));
            }*/
            B[q][i] = scalar_add(scalar_mul(Gqp, Ap), scalar_mul(Gqq, Aq));
        }
    }
    return B;
}
function jacobi_sweep(A, nsweeps)
{
    if (null == nsweeps) nsweeps = 1;
    var n = ROWS(A), sweep, k, l, J;

    for (sweep=1; sweep<=nsweeps; ++sweep)
    {
        for (k=1; k<n; ++k)
        {
            for (l=0; l<k; ++l)
            {
                J = compute_jacobi(A[k][k], A[k][l], A[l][l]);
                A = rotmul('right', J, k, l, rotmul('left', ctranspose(J), k, l, A));
            }
        }
    }
    return A;
}
function compute_householder(A, hh, i1, i2, j1, j2, eps)
{
    /*
    "Unitary Triangularization of a Nonsymmetric Matrix",
    Householder, A. S.,
    Journal of the ACM. 5 (4): 339–342.  1958
    */
    // v(0) is always 1, rest is the essential part
    if (null == eps) eps = constant.eps;
    var c0, c, normc, b, bc;
    if (is_vector(A))
    {
        c0 = A[i1];
        if (i1 === i2)
        {
            normc = O;
        }
        else
        {
            c = A.slice(i1+1, i2+1);
            normc = real(dot(c, c));
        }
    }
    else if (j1 === j2)
    {
        c0 = A[i1][j1];
        if (i1 === i2)
        {
            normc = O;
        }
        else
        {
            c = A.slice(i1+1, i2+1).map(function(Ai) {return Ai[j1];});
            normc = real(dot(c, c));
        }
    }
    else//if (i1 === i2)
    {
        c0 = A[i1][j1];
        if (j1 === j2)
        {
            normc = O;
        }
        else
        {
            c = A[i1].slice(j1+1, j2+1);
            normc = real(dot(c, c));
        }
    }
    if (n_le(normc, eps) && n_le(n_pow(scalar_abs(imag(c0)), two), eps))
    {
        hh.beta = real(c0);
        hh.tau = O;
        hh.v.forEach(function(vi, i) {
            hh.v[i] = 0 === i ? I : O;
        });
    }
    else
    {
        b = realMath.sqrt(n_add(real(scalar_mul(c0, scalar_conj(c0))), normc));
        if (n_ge(real(c0), O)) b = scalar_neg(b);
        bc = scalar_sub(c0, b);
        hh.beta = b;
        hh.tau = scalar_conj(scalar_div(scalar_neg(bc), b));
        if (is_vector(A))
        {
            hh.v.forEach(function(vi, i) {
                hh.v[i] = 0 === i ? I : scalar_div(A[i+i1], bc);
            });
        }
        else if (j1 === j2)
        {
            hh.v.forEach(function(vi, i) {
                hh.v[i] = 0 === i ? I : scalar_div(A[i+i1][j1], bc);
            });
        }
        else//if (i1 === i2)
        {
            hh.v.forEach(function(vi, i) {
                hh.v[i] = 0 === i ? I : scalar_div(A[i1][i+j1], bc);
            });
        }
    }
    return hh;
}
function hh_mul(type, hh, A, i1, i2, j1, j2)
{
    var n, i, j,
        v = hh.v, vA,
        vl = v.length,
        tau = hh.tau,
        B = A;
    if (eq(tau, O))
    {
        return B;
    }
    if ('right' === type)
    {
        // -- B = AH
        // B(j1:j2,i1:i2) = A(j1:j2,i1:i2)-(A(j1:j2,i1:i2)*v)*(tau*v’);
        n = ROWS(A);
        if (null == i1) i1 = 0;
        if (null == i2) i2 = COLS(A)-1;
        if (null == j1) j1 = 0;
        if (null == j2) j2 = n-1;
        vA = array(j2-j1+1, function(j) {
            for (var vA=O,i=0; i<vl; ++i)
            {
                vA = scalar_add(vA, scalar_mul(v[i], A[j+j1][i+i1]));
            }
            return vA;
        });
        for (j=j1; j<=j2; ++j)
        {
            for (i=i1; i<=i2; ++i)
            {
                B[j][i] = scalar_sub(A[j][i], scalar_mul(vA[j-j1], scalar_mul(tau, scalar_conj(v[i-i1]))));
            }
        }
    }
    else//if ('left' === type)
    {
        // -- B = HA
        // B(i1:i2,j1:j2) = A(i1:i2,j1:j2)-(tau*v)*(v’*A(i1:i2,j1:j2));
        n = COLS(A);
        if (null == i1) i1 = 0;
        if (null == i2) i2 = ROWS(A)-1;
        if (null == j1) j1 = 0;
        if (null == j2) j2 = n-1;
        vA = array(j2-j1+1, function(j) {
            for (var vA=O,i=0; i<vl; ++i)
            {
                vA = scalar_add(vA, scalar_mul(scalar_conj(v[i]), A[i+i1][j+j1]));
            }
            return vA;
        });
        for (j=j1; j<=j2; ++j)
        {
            for (i=i1; i<=i2; ++i)
            {
                B[i][j] = scalar_sub(A[i][j], scalar_mul(scalar_mul(tau, v[i-i1]), vA[j-j1]));
            }
        }
    }
    return B;
}
/*function francis_poly(H, i, j)
{
    // Get shifts via trailing submatrix
    var //i = ROWS(H)-1, j = COLS(H)-1,
        trHH  = scalar_add(H[i-1][j-1], H[i][j]),
        detHH = scalar_sub(scalar_mul(H[i-1][j-1], H[i][j]), scalar_mul(H[i-1][j], H[i][j-1])),
        f1, f2, f3, r1, r2, b, c
    ;

    f1 = scalar_pow(trHH, 2);
    f2 = scalar_mul(detHH, 4);
    if (gt(f1, f2)) // Real eigenvalues
    {
        // Use the one closer to H(n,n)
        f3 = fn.sqrt(scalar_sub(f1, f2));
        r1 = scalar_div(scalar_add(trHH, f3), 2);
        r2 = scalar_div(scalar_sub(trHH, f3), 2);
        if (lt(scalar_abs(scalar_sub(r1, H[i][j])), scalar_abs(scalar_sub(r2, H[i][j]))))
        {
            r2 = r1;
        }
        else
        {
            r1 = r2;
        }
        // z^2 + bz + c = (z-sigma_1)(z-sigma_2)
        b = scalar_neg(scalar_add(r1, r2));
        c = scalar_mul(r1, r2);
    }
    else
    {
        // In the complex case, we want the char poly for HH
        b = scalar_neg(trHH);
        c = detHH;
    }
    return [b, c];
}*/
function gauss_jordan(A, with_pivots, odim, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A),
        dim = columns, pivots,
        det, pl = 0, r, i, i0, p0,
        lead, leadc, imin, im, min,
        a, z, m, aug, find_dupl;
    eps = __(eps || 0);
    if (is_tri(A, "upper", false, eps))
    {
        return with_pivots ? [A, array(dim, function(col) {return [col, col];}).filter(function(pivot) {return (pivot[0] < rows) && (pivot[1] < columns) && !le(scalar_abs(A[pivot[0]][pivot[1]]), eps);}), prod(diag(A)), eye(rows)] : A;
    }
    // original dimensions, eg when having augmented matrix
    if (is_array(odim)) dim = stdMath.min(dim, odim[1]);
    m = concat(A, eye(rows));
    pivots = new Array(dim);
    lead = 0; leadc = 0; det = I;
    find_dupl = function find_dupl(k0, k) {
        k = k || 0;
        for (var p=pl-1; p>=0; --p)
            if (k0 === pivots[p][k])
                return p;
        return -1;
    };
    for (r=0; r<rows; ++r)
    {
        if (dim <= lead) break;

        i = r;
        while (le(scalar_abs(m[i][lead]), eps))
        {
            ++i;
            if (rows <= i)
            {
                i = r; ++lead;
                if (dim <= lead)
                {
                    lead = -1;
                    break;
                }
            }
        }
        if (-1 === lead) break; // nothing to do

        i0 = i;
        imin = -1; min = null; z = 0;
        // find row with min abs leading value non-zero for current column lead
        for (i=i0; i<rows; ++i)
        {
            a = scalar_abs(m[i][lead]);
            if (le(a, eps)) ++z;
            else if ((null == min) || lt(a, min)) {min = a; imin = i;}
        }
        for (;;)
        {
            if (-1 === imin) break; // all zero, nothing else to do
            if (rows-i0 === z+1)
            {
                // only one non-zero, swap row to put it first
                if (r !== imin)
                {
                    SWAPR(m, r, imin);
                    // determinant changes sign for row swaps
                    det = scalar_neg(det);
                }
                if (lt(m[r][lead], O))
                {
                    ADDR(m, r, r, O, J, lead); // make it positive
                    // determinant is multiplied by same constant for row multiplication, here simply changes sign
                    det = scalar_neg(det);
                }
                i = imin; i0 = r;
                while ((0 <= i) && (-1 !== (p0=find_dupl(i)))) {i0 -= pl-p0; i = i0;}
                pivots[pl++] = [i, lead/*, leadc*/]; // row/column/original column of pivot
                // update determinant
                det = r < dim ? scalar_mul(det, m[r][r/*lead*/]) : O;
                break;
            }
            else
            {
                z = 0; im = imin;
                for (i=i0; i<rows; ++i)
                {
                    if (i === im) continue;
                    // subtract min row from other rows
                    ADDR(m, i, im, scalar_neg(scalar_div(m[i][lead], m[im][lead])), I, lead);
                    // determinant does not change for this operation

                    // find again row with min abs value for this column as well for next round
                    a = scalar_abs(m[i][lead]);
                    if (le(a, eps)) ++z;
                    else if (lt(a, min)) {min = a; imin = i;}
                }
            }
        }

        ++lead; //++leadc;
    }
    if (pl < dim) det = O;

    aug = slice(m, 0, columns, rows-1, rows+columns-1);
    m = slice(m, 0, 0, rows-1, columns-1);
    // truncate if needed
    if (pivots.length > pl) pivots.length = pl;

    return with_pivots ? [m, pivots, det, aug] : m;
}
function solve_by_substitution(type, T, y, free_vars)
{
    if (!free_vars) free_vars = [I];
    var n = ROWS(T), fk = 0, fn = free_vars.length;
    if (y) y = vec(y);
    if ("lower" === type)
    {
        // lower triangular, forward substitution
        return array(n, function(m, x) {
            for (var Tx=O,i=0; i<m; ++i) Tx = scalar_add(Tx, scalar_mul(T[m][i], x[i]));
            Tx = scalar_sub(y ? y[m] : O, Tx);
            if (eq(T[m][m], O) && eq(Tx, O)) return fk < fn ? free_vars[fk++] : (free_vars[fn-1] || O); // free variable
            return scalar_div(Tx, T[m][m]);
        });
    }
    else
    {
        // upper triangular, backward substitution
        return array(n, function(m, x) {
            for (var Tx=O,i=0; i<m; ++i) Tx = scalar_add(Tx, scalar_mul(T[n-1-m][n-1-i], x[i]));
            Tx = scalar_sub(y ? y[n-1-m] : O, Tx);
            if (eq(T[n-1-m][n-1-m], O) && eq(Tx, O)) return fk < fn ? free_vars[fk++] : (free_vars[fn-1] || O); // free variable
            return scalar_div(Tx, T[n-1-m][n-1-m]);
        }).reverse();
    }
}
var ref = gauss_jordan;
/*function largest_eig(A, N, eps, valueonly)
{
    // power method
    var iter,
        A_t,
        k, prev_k,
        v, prev_v,
        w, prev_w;

    k = O;
    if (true === valueonly)
    {
        v = array(N, function() {return new complex(__(stdMath.random() || 0.1), O);});
        v = dotdiv(v, norm(v));
        for (iter=1; iter<=100; ++iter)
        {
            prev_k = k;
            prev_v = v;
            v = vec(mul(A, v));
            k = dot(v, prev_v);
            if (!eq(v[0], O))
            {
                v = dotdiv(v, scalar_sign(v[0]));
            }
            v = dotdiv(v, norm(v));
            if (n_le(realMath.abs(n_sub(real(k), real(prev_k))), eps) && n_le(realMath.abs(n_sub(imag(k), imag(prev_k))), eps)) break;
        }
        return k;
    }
    else
    {
        A_t = ctranspose(A);
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
            if (!eq(v[0], O))
            {
                v = dotdiv(v, scalar_sign(v[0]));
            }
            if (!eq(w[0], O))
            {
                w = dotdiv(w, scalar_sign(w[0]));
            }
            v = dotdiv(v, norm(v));
            w = dotdiv(w, norm(w));
            if (n_le(realMath.abs(n_sub(real(k), real(prev_k))), eps) && n_le(realMath.abs(n_sub(imag(k), imag(prev_k))), eps)) break;
        }
        return [k, v, w];
    }
}*/
