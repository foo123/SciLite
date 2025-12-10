function conv2(a, b)
{
    // adapted from https://github.com/foo123/FILTER.js
    var rA, cA,
        rB, cB,
        c, rC, cC,
        cjk, j, k,
        p, q, t, O;

    if (ROWS(a) < ROWS(b))
    {
        t = a;
        a = b;
        b = t;
    }
    rA = ROWS(a);
    cA = COLS(a);
    rB = ROWS(b);
    cB = COLS(b);
    rC = rA + rB - 1;
    cC = cA + cB - 1;
    c = zeros(rC, cC),
    O = __(0);

    for (j=0; j<rC; ++j)
    {
        for (k=0; k<cC; ++k)
        {
            cjk = O;
            for (p=0; p<=j; ++p)
            {
                if (p >= rA) break;
                if (j-p >= rB) continue;
                for (q=0; q<=k; ++q)
                {
                    if (q >= cA) break;
                    if (k-q >= cB) continue;
                    cjk = scalar_add(cjk, scalar_mul(a[p][q], b[j-p][k-q]));
                }
            }
            c[j][k] = cjk;
        }
    }
    return c;
}
fn.conv2 = function(a, b) {
    if (is_scalar(a) || is_scalar(b))
    {
        return dotmul(a, b);
    }
    else if (is_vector(a))
    {
        if (is_vector(b))
        {
            return conv(a, b);
        }
        else if (is_matrix(b))
        {
            return array(COLS(b), function(column) {
                return conv(a, COL(b, column));
            });
        }
        else
        {
            throw "conv2: input 2 not supported";
        }
    }
    else if (is_vector(b))
    {
        if (is_vector(a))
        {
            return conv(a, b);
        }
        else if (is_matrix(a))
        {
            return array(a[0].length, function(column) {
                return conv(COL(a, column), b);
            });
        }
        else
        {
            throw "conv2: input 1 not supported";
        }
    }
    if (!is_matrix(a)) throw "conv2: input 1 not supported";
    if (!is_matrix(b)) throw "conv2: input 2 not supported";
    return conv2(a, b);
};
