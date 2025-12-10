function detr(m, n, O, I, J)
{
    var ii, zr, zc,
        s, det,
        a, b, c,
        d, e, f,
        g, h, i;

    function reduce(m, n, row, col)
    {
        return matrix(n-1, n-1, function(r, c) {
            if (r >= row) ++r;
            if (c >= col) ++c;
            return m[r][c];
        });
    }

    if (1 === n)
    {
        // explicit formula for 1x1, trivial
        det = m[0][0];
    }
    else if (2 === n)
    {
        // explicit formula for 2x2
        a = m[0][0]; b = m[0][1];
        c = m[1][0]; d = m[1][1];
        det = scalar_sub(scalar_mul(a, d), scalar_mul(b, c));
    }
    else if (3 === n)
    {
        // explicit formula for 3x3
        a = m[0][0]; b = m[0][1]; c = m[0][2];
        d = m[1][0]; e = m[1][1]; f = m[1][2];
        g = m[2][0]; h = m[2][1]; i = m[2][2];
        det = scalar_sub(
            scalar_sub(
                scalar_sub(
                    scalar_add(scalar_add(scalar_mul(scalar_mul(a, e), i), scalar_mul(scalar_mul(b, f), g)), scalar_mul(scalar_mul(c, d), h)),
                    scalar_mul(scalar_mul(c, e), g)
                ),
                scalar_mul(scalar_mul(b, d), i)
            ),
            scalar_mul(scalar_mul(a, f), h)
        );
    }
    else //if (3 < n)
    {
        // use row or col with the most zeros
        for (zr=0,zc=0,ii=0; ii<n; ++ii)
        {
            if (eq(m[0][ii], O)) ++zr;
            if (eq(m[ii][0], O)) ++zc;
        }
        s = I; det = O;
        if (zc > zr)
        {
            // expand along 1st col
            for (ii=0; ii<n; ++ii)
            {
                if (!eq(m[ii][0], O)) det = scalar_add(det, scalar_mul(m[ii][0], scalar_mul(s, detr(reduce(m, n, ii, 0), n-1, O, I, J))));
                s = I === s ? J : I;
            }
        }
        else
        {
            // expand along 1st row
            for (ii=0; ii<n; ++ii)
            {
                if (!eq(m[0][ii], O)) det = scalar_add(det, scalar_mul(m[0][ii], scalar_mul(s, detr(reduce(m, n, 0, ii), n-1, O, I, J))));
                s = I === s ? J : I;
            }
        }
    }
    return det;
}
function det(A, explicit, eps)
{
    // adapted from https://github.com/foo123/Abacus
    // determinant
    eps = __(eps || 0);
    var n = ROWS(A);
    if (n !== COLS(A))
    {
        // not square, zero
        return 0;
    }
    else if (1 === n)
    {
        // scalar, trivial
        return A[0][0];
    }
    else if (is_tri(A, 'lower', true, eps) || is_tri(A, 'upper', true, eps))
    {
        // triangular, product of diagonal entries
        return A.reduce(function(det, ai, i) {
            return scalar_mul(det, A[i][i]);
        }, 1);
    }
    else
    {
        // compute either recursively or via ref
        return true === explicit ? detr(A, n, __(0), __(1), __(-1)) : (ref(A, true, null, eps)[2]);
    }
}
fn.det = function(A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("det");
    return det(A, false, 1e-15);
};
