function find(x, check, n, dir, nargout)
{
    nargout = nargout || 1;
    if (null == n) n = inf;
    if (is_array(x))
    {
        var row = 1 < nargout ? [] : null,
            col = 1 < nargout ? [] : null,
            val = 2 < nargout ? [] : null,
            xx = colon(x),
            tot = xx.length,
            rows = x.length,
            cols = rows ? tot/rows : 0,
            r = 1, c = 1,
            ind = [],
            i, xi, di = 'last' === dir ? -1 : 1;

        for (i='last' === dir ? tot-1 : 0; 0 <= i && i < tot && ind.length < n; i+=di)
        {
            xi = xx[i];
            if (r > rows)
            {
                ++c;
                r = 1;
            }
            if ('last' === dir)
            {
                if (check(xi, rows-r+1, cols-c+1))
                {
                    ind.push(i+1);
                    if (row) row.push(rows-r+1);
                    if (col) col.push(cols-c+1);
                    if (val) val.push(xi);
                }
            }
            else
            {
                if (check(xi, r, c))
                {
                    ind.push(i+1);
                    if (row) row.push(r);
                    if (col) col.push(c);
                    if (val) val.push(xi);
                }
            }
            ++r;
        }
        return 1 < nargout ? [row, col, val] : ind;
    }
    return [];
}
$_.find = find;
fn.find = varargout(function(nargout, x, n, dir) {
    return find(x, function(x) {return !eq(x, O);}, is_int(n) ? _(n) : null, dir || 'first', nargout);
});
