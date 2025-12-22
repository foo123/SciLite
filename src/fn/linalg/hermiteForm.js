function int_gauss_jordan(A, hermite, wantu)
{
    // adapted from https://github.com/foo123/Abacus
    var rows = ROWS(A), columns = COLS(A),
        dim = columns, pl = 0, r, i, i0, p0,
        lead, imin, im, min, a, z, m, eps = O;
    m = wantu ? concat(A, eye(rows)) : A;
    lead = 0;
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
                }
                if (lt(m[r][lead], O))
                {
                    // make it positive
                    ADDR(m, r, r, O, J, lead);
                }
                if (hermite)
                {
                    a = m[r][lead];
                    for (i=0; i<r; ++i)
                    {
                        if (ge(scalar_abs(m[i][lead]), a))
                        {
                            // make strictly smaller
                            ADDR(m, i, r, scalar_neg(fn.floor(scalar_div(m[i][lead], a))), I, lead);
                        }
                        if (lt(m[i][lead], O))
                        {
                            // make positive
                            ADDR(m, i, r, I, I, lead);
                        }
                    }
                }
                i = imin; i0 = r;
                break;
            }
            else
            {
                z = 0; im = imin;
                for (i=i0; i<rows; ++i)
                {
                    if (i === im) continue;
                    // subtract min row from other rows
                    ADDR(m, i, im, scalar_neg(fn.floor(scalar_div(m[i][lead], m[im][lead]))), I, lead);

                    // find again row with min abs value for this column as well for next round
                    a = scalar_abs(m[i][lead]);
                    if (le(a, eps)) ++z;
                    else if (lt(a, min)) {min = a; imin = i;}
                }
            }
        }

        ++lead;
    }
    return wantu ? [slice(m, 0, columns, rows-1, rows+columns-1), slice(m, 0, 0, rows-1, columns-1)] : m;
}
var iref = int_gauss_jordan;
fn.hermiteForm = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("hermiteForm");
    return iref(fn.round(fn.real(A)), true, 1 < nargout);
});
