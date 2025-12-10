function cmp_real(a, b)
{
    var ra = real(a), rb = real(b),
        ia = imag(a), ib = imag(b),
        r = n_lt(ra, rb) ? -1 : (n_gt(ra, rb) ? 1 : 0),
        i = n_lt(ia, ib) ? -1 : (n_gt(ia, ib) ? 1 : 0);
    return r || i;
}
function cmp_abs(a, b)
{
    var aba = scalar_abs(a), abb = scalar_abs(b),
        ana = scalar_angle(a), anb = scalar_angle(b),
        ab = n_lt(aba, abb) ? -1 : (n_gt(aba, abb) ? 1 : 0),
        an = n_lt(ana, anb) ? -1 : (n_gt(ana, anb) ? 1 : 0);
    return ab || an;
}
function sort(x, dim, dir, cmp, with_indices)
{
    var ans;
    if (is_0d(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        if (null == cmp) cmp = is_real(x) ? cmp_real : cmp_abs;
        ans = x.map(function(v, i) {return {v:v, i:i};}).sort('descend' === dir ? function(a, b) {
            return cmp(b.v, a.v) || (a.i - b.i);
        } : function(a, b) {
            return cmp(a.v, b.v) || (a.i - b.i);
        });
        return with_indices ? [ans.map(function(vi) {return vi.v;}), ans.map(function(vi) {return vi.i+1;})] : ans.map(function(vi) {return vi.v;});
    }
    else if (is_matrix(x))
    {
        if (1 === dim)
        {
            if (with_indices)
            {
                ans = array(COLS(x), function(c) {
                    var col = COL(x, c);
                    return sort(col, dim, dir, null == cmp ? (is_real(col) ? cmp_real : cmp_abs) : cmp, true);
                });
                return [matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[j][0][i];
                }), matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[j][1][i];
                })];
            }
            else
            {
                ans = array(COLS(x), function(c) {
                    var col = COL(x, c);
                    return sort(col, dim, dir, null == cmp ? (is_real(col) ? cmp_real : cmp_abs) : cmp, false);
                });
                return matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[j][i];
                });
            }
        }
        else if (2 === dim)
        {
            if (with_indices)
            {
                ans = array(ROWS(x), function(r) {
                    var row = ROW(x, r);
                    return sort(row, dim, dir, null == cmp ? (is_real(row) ? cmp_real : cmp_abs) : cmp, true);
                });
                return [matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[i][0][j];
                }), matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[i][1][j];
                })];
            }
            else
            {
                ans = array(ROWS(x), function(r) {
                    var row = ROW(x, r);
                    return sort(row, dim, dir, null == cmp ? (is_real(row) ? cmp_real : cmp_abs) : cmp, false);
                });
                return matrix(ROWS(x), COLS(x), function(i, j) {
                    return ans[i][j];
                });
            }
        }
    }
    not_supported("sort");
}
fn.sort = varargout(function(nargout, x, dim, dir/*, .. args*/) {
    var i = 2, cmp = null;
    while (i < arguments.length)
    {
        if ('ComparisonMethod' === arguments[i])
        {
            if ('real' === arguments[i+1]) cmp = cmp_real;
            else if ('abs' === arguments[i+1]) cmp = cmp_abs;
            if (1 === i)
            {
                dim = 1;
                dir = 'ascend';
            }
            else if (2 === i)
            {
                dir = 'ascend';
            }
            break;
        }
        else
        {
            i += 1;
        }
    }
    if (null == dir) dir = 'ascend';
    if (null == dim) dim = 1;
    dim = _(dim);
    return sort(x, dim, dir, cmp, 1 < nargout);
});
