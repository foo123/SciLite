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
    if (null == a) a = 1;
    if (null == b) b = 1;
    for (k=k0||0; k<n; ++k)
        m[i][k] = scalar_add(scalar_mul(b, m[i][k]), scalar_mul(a, m[j][k]));
    return m;
}
function ADDC(m, i, j, a, b, k0)
{
    // add (a multiple of) column j to (a multiple of) column i
    var k, n = m.length;
    if (null == a) a = 1;
    if (null == b) b = 1;
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
                return i < rA ? 0 : B[i-rA][j];
            else if (j >= cB)
                return i < rA ? A[i][j] : 0;
            else
                return i < rA ? A[i][j] : B[i-rA][j];
        });
    }
    else //if ('horz' === axis)
    {
        // | A | B |
        return matrix(stdMath.max(rA, rB), cA+cB, function(i, j) {
            if (i >= rA)
                return j < cA ? 0 : B[i][j-cA];
            else if (i >= rB)
                return j < cA ? A[i][j] : 0;
            else
                return j < cA ? A[i][j] : B[i][j-cA];
        });
    }
}
function norm2(x)
{
    return x.reduce(function(n, xi) {
        return scalar_add(n, scalar_mul(xi, scalar_conj(xi)));
    }, __(0));
}
function is_tri(A, type, strict, eps)
{
    var nr = ROWS(A), nc = COLS(A), n, r, c, O;
    if ((false !== strict) && (nr !== nc)) return false;

    eps = __(eps || 0);
    n = stdMath.min(nr, nc);
    for (r=0; r<n; ++r)
    {
        if (('lower' === type) || ('diagonal' === type))
        {
            for (c=r+1; c<n; ++c) if (!le(scalar_abs(A[r][c]), eps)) return false;
        }
        if (('upper' === type) || ('diagonal' === type))
        {
            for (c=0; c<r; ++c) if (!le(scalar_abs(A[r][c]), eps)) return false;
        }
    }
    if (nr > nc)
    {
        // should be all zero
        for (r=n; r<nr; ++r)
        {
            for (c=0; c<nc; ++c) if (!le(scalar_abs(A[r][c]), eps)) return false;
        }
    }
    else if (nr < nc)
    {
        // should be all zero
        for (c=n; c<nc; ++c)
        {
            for (r=0; r<nr; ++r) if (!le(scalar_abs(A[r][c]), eps)) return false;
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
    if (eq(g, 0))
    {
        c = __(1);
        s = __(0);
        //r = f;
    }
    else if (eq(f, 0))
    {
        c = __(0);
        s = scalar_sign(scalar_conj(g));
        if (eq(s, 0)) s = __(1);
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
function givens(n, p, q, f, g)
{
    var givens_rot = compute_givens(f, g),
        c = givens_rot[0], s = givens_rot[1],
        O = __(0), I = __(1);
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
}
function givensmul(type, G, p, q, A)
{
    var i, j, n = ROWS(A),
        B = copy(A),
        Gpp, Gpq, Gqp, Gqq;
    if ('right' === type)
    {
        /*
        a1 b1 c1 d1 | 1 0  0 0  = a1 (G[:,i]*A[1,:]) c1 (G[:,j]*A[1,:])
        a2 b2 c2 d2 | 0 c -s 0  = a2 (G[:,i]*A[2,:]) c2 (G[:,j]*A[2,:])
        a3 b3 c3 d3 | 0 s  c 0  = a3 (G[:,i]*A[3,:]) c3 (G[:,j]*A[3,:])
        a4 b4 c4 d4 | 0 0  0 1  = a4 (G[:,i]*A[4,:]) c4 (G[:,j]*A[4,:])
        */
        if ((2 === G.length) && is_scalar(G[0]))
        {
            // c, s
            Gpp = G[0];
            Gpq = scalar_neg(G[1]);
            Gqp = G[1];
            Gqq = G[0];
        }
        else
        {
            // matrix
            Gpp = G[p][p];
            Gpq = G[p][q];
            Gqp = G[q][p];
            Gqq = G[q][q];
        }
        for (i=0; i<n; ++i)
        {
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[j][p], A[i][j]));
            }*/
            B[i][p] = scalar_add(scalar_mul(Gpp, A[i][p]), scalar_mul(Gqp, A[i][q]));
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[j][q], A[i][j]));
            }*/
            B[i][q] = scalar_add(scalar_mul(Gpq, A[i][p]), scalar_mul(Gqq, A[i][q]));
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
        if ((2 === G.length) && is_scalar(G[0]))
        {
            // c, s
            Gpp = G[0];
            Gpq = scalar_neg(G[1]);
            Gqp = G[1];
            Gqq = G[0];
        }
        else
        {
            // matrix
            Gpp = G[p][p];
            Gpq = G[p][q];
            Gqp = G[q][p];
            Gqq = G[q][q];
        }
        for (i=0; i<n; ++i)
        {
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[p][j], A[j][i]));
            }*/
            B[p][i] = scalar_add(scalar_mul(Gpp, A[p][i]), scalar_mul(Gpq, A[q][i]));
            /*for (s=0,j=0; j<n; ++j)
            {
                s = scalar_add(s, scalar_mul(G[q][j], A[j][i]));
            }*/
            B[q][i] = scalar_add(scalar_mul(Gqp, A[p][i]), scalar_mul(Gqq, A[q][i]));
        }
    }
    return B;
}
