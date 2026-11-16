function conv2(a, b, shape)
{
    var rA = ROWS(a), cA = COLS(a),
        rB = ROWS(b), cB = COLS(b),
        rC, cC, j0, k0;

    if ("valid" === shape)
    {
        // non zero-padded part
        rC = 0 === rB ? rA : stdMath.max(0, rA-rB+1);
        cC = 0 === cB ? cA : stdMath.max(0, cA-cB+1);
        j0 = rB >> 1;
        k0 = cB >> 1;
    }
    else if ("same" === shape)
    {
        // central part
        rC = rA;
        cC = cA;
        j0 = rB >> 1;
        k0 = cB >> 1;
    }
    else
    {
        // full
        rC = rA + rB - 1;
        cC = cA + cB - 1;
        j0 = 0;
        k0 = 0;
    }
    return matrix(rC, cC, function(j, k) {
        var jp, kq, p, pn, q, qn, cjk = O;
        j += j0; k += k0;
        for (p=0,pn=stdMath.min(j+1, rA); p<pn; ++p)
        {
            jp = j-p;
            if (0 > jp || jp >= rB) continue;
            for (q=0,qn=stdMath.min(k+1, cA); q<qn; ++q)
            {
                kq = k-q;
                if (0 > kq || kq >= cB) continue;
                cjk = scalar_add(cjk, scalar_mul(a[p][q], b[jp][kq]));
            }
        }
        return cjk;
    });
}
fn.conv2 = function(a, b, shape) {
    if (is_scalar(a) || is_scalar(b))
    {
        return dotmul(a, b);
    }
    else if (is_vector(a))
    {
        if (is_vector(b))
        {
            return conv(a, b, shape);
        }
        else if (is_matrix(b))
        {
            return array(COLS(b), function(column) {
                return conv(a, COL(b, column), shape);
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
            return conv(a, b, shape);
        }
        else if (is_matrix(a))
        {
            return array(a[0].length, function(column) {
                return conv(COL(a, column), b, shape);
            });
        }
        else
        {
            throw "conv2: input 1 not supported";
        }
    }
    if (!is_matrix(a)) throw "conv2: input 1 not supported";
    if (!is_matrix(b)) throw "conv2: input 2 not supported";
    return conv2(a, b, shape);
};
