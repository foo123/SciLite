function magic(n)
{
    // adapted from https://github.com/foo123/Abacus
    var odd = n & 1,
        even = 1 - odd,
        doubly_even = 0 === (/*n%4*/n&3),
        nn = n*n, n2 = (n-odd) >> 1,
        n22, n12, n21,
        a, b, c, lc, rc, t,
        k, i, j, m2, m;

    if (odd) // odd order
    {
        // O(n^2)
        n12 = n+n2; n21 = n2+odd;
        return matrix(n, n, function(j, i) {
            i = n-1-i;
            return ((n12+j-i) % n) * n + ((n21+i+j) % n) + 1;
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
        m2 = magic(n2);
        n22 = n2*n2;
        a = n22;
        b = a<<1;
        c = b+n22;
        m = matrix(n, n, function(i, j) {
            if (i < n2 && j < n2) return m2[i][j];
            else if (i < n2) return m2[i][j-n2] + c;
            else if (j < n2) return m2[i-n2][j] + b;
            else return m2[i-n2][j-n2] + a;
        });
        lc = n2 >>> 1; rc = lc;
        for (j=0; j<n2; ++j)
        {
            for (i=0; i<n; ++i)
            {
                if (((i < lc) || (i > n - rc) || (i === lc && j === lc)) &&
                !(i === 0 && j === lc))
                {
                    t = m[i][j];
                    m[i][j] = m[i][j + n2];
                    m[i][j + n2] = t;
                }
            }
        }
        return m;
    }
}
fn.magic = function(n) {
    n = sca(n, true);
    n = is_int(n) ? _(n) : null;
    if (!is_int(n) || (2 >= n)) return 1 === n ? [[I]] : [];
    var m = magic(n);
    return matrix(n, n, function(i, j) {return __(m[i][j]);});
};
