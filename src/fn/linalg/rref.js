function ref(A, with_pivots, odim, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A), dim = columns, pivots,
        det, pl = 0, r, i, i0, p0, lead, leadc, imin, im, min,
        a, z, m, aug, find_dupl,
        O = __(0), I = __(1), J = __(-1);
    eps = __(eps || 0);
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
        do {
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
                    ADDR(m, i, im, scalar_neg(scalar_div(m[i][lead], m[im][lead])), 1, lead);
                    // determinant does not change for this operation

                    // find again row with min abs value for this column as well for next round
                    a = scalar_abs(m[i][lead]);
                    if (le(a, eps)) ++z;
                    else if (lt(a, min)) {min = a; imin = i;}
                }
            }
        } while (1);

        ++lead; //++leadc;
    }
    if (pl < dim) det = O;

    aug = slice(m, 0, columns, rows-1, rows+columns-1);
    m = slice(m, 0, 0, rows-1, columns-1);
    // truncate if needed
    if (pivots.length > pl) pivots.length = pl;

    return with_pivots ? [m, pivots, det, aug] : m;
}
fn.ref = varargout(function(nargout, x, tol) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("ref");
    var ans = ref(x, true, null, tol);
    return 1 < nargout ? [ans[0], ans[1].map(function(pi) {return pi[1]+1;})] : ans[0];
});
function rref(A, with_pivots, odim, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A), dim = columns,
        pivots, det, pl, lead, r, i, j, l, a, g, rf, aug,
        O = __(0), I = __(1)/*, J = __(-1)*/;
    eps = __(eps || 0);
    // original dimensions, eg when having augmented matrix
    if (is_array(odim)) dim = stdMath.min(dim, odim[1]);
    // build rref incrementaly from ref
    rf = ref(A, true, odim, eps);
    a = concat(rf[0], rf[3]);
    pivots = rf[1]; det = rf[2];
    pl = pivots.length;
    for (r=0; r<pl; ++r)
    {
        lead = pivots[r][1];
        for (i=0; i<r; ++i)
        {
            if (le(scalar_abs(a[i][lead]), eps)) continue;

            ADDR(a, i, r, scalar_neg(a[i][lead]), a[r][lead]);
            if (!eq(a[i][pivots[i][1]], I))
            {
                ADDR(a, i, i, O, scalar_inv(a[i][pivots[i][1]]), pivots[i][1]);
            }
        }
    }
    if (!eq(a[pl-1][pivots[pl-1][1]], I))
    {
        ADDR(a, pl-1, pl-1, O, scalar_inv(a[pl-1][pivots[pl-1][1]]), pivots[pl-1][1]);
    }
    aug = slice(a, 0, columns, rows-1, rows+columns-1);
    a = slice(a, 0, 0, rows-1, columns-1);
    return with_pivots ? [a, pivots, det, aug] : a;
}
fn.rref = varargout(function(nargout, x, tol) {
    if (is_scalar(x)) x = [[x]];
    if (!is_matrix(x)) not_supported("rref");
    var ans = rref(x, true, null, tol);
    return 1 < nargout ? [ans[0], ans[1].map(function(pi) {return pi[1]+1;})] : ans[0];
});
