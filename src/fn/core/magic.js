function magic(n)
{
    // adapted from Octave
    var odd = n & 1,
        even = 1 - odd,
        doubly_even = 0 === (/*n%4*/n&3),
        nn = n*n, n2 = (n-odd) >> 1,
        n22, n12, n21,
        k, I, J, t, m2, m;

    if (odd) // odd order
    {
        // O(n^2)
        return matrix(n, n, function(i, j) {
            var A = (i+1+j+1+(n-3)/2) % n,
                B = (i+1+2*(j+1)-2) % n;
            if (0 > A) A += n;
            if (0 > B) B += n;
            return n*A + B + 1;
        });
    }

    else if (doubly_even) // doubly-even order
    {
        // O(n^2)
        k = 0;
        return matrix(n, n, function(i, j) {
            ++k;
            return (((i+1)/*%4*/ & 3) >> 1 === ((j+1)/*%4*/ & 3) >> 1) ? (nn - (k-1)) : (k);
        });
    }

    else //if (even) // singly-even order
    {
        // O((n/2)^2)
        n22 = n2*n2;
        m2 = magic(n2);
        m = matrix(n, n, function(i, j) {
            if (i < n2)
            {
                return j < n2 ? m2[i][j] : (m2[i][j-n2]+2*n22);
            }
            else if (j < n2)
            {
                return i < n2 ? m2[i][j] : (m2[i-n2][j]+3*n22);
            }
            else
            {
                return m2[i-n2][j-n2]+n22;
            }
        });
        k = (n2-1)/2;
        if (k > 1)
        {
            for (I=1; I<=n2; ++I)
            {
                for (J=2; J<=k; ++J)
                {
                    t = m[I-1][J-1];
                    m[I-1][J-1] = m[I+n2-1][J-1];
                    m[I+n2-1][J-1] = t;
                }
                for (J=n-k+2; J<=n; ++J)
                {
                    t = m[I-1][J-1];
                    m[I-1][J-1] = m[I+n2-1][J-1];
                    m[I+n2-1][J-1] = t;
                }
            }
        }
        for (I=1; I<=k; ++I)
        {
            t = m[I-1][0];
            m[I-1][0] = m[I+n2-1][0];
            m[I+n2-1][0] = t;
        }
        for (I=k+2; I<=n2; ++I)
        {
            t = m[I-1][0];
            m[I-1][0] = m[I+n2-1][0];
            m[I+n2-1][0] = t;
        }
        t = m[k][k-1];
        m[k][k-1] = m[k+n2][k-1];
        m[k+n2][k-1] = t;
        return m;
    }
}
fn.magic = function(n) {
    n = sca(fn.fix(n), true);
    n = is_int(n) ? _(n) : null;
    if (!is_int(n) || (2 >= n)) return 1 === n ? [[I]] : [];
    var m = magic(n);
    return matrix(n, n, function(i, j) {return __(m[i][j]);});
};
