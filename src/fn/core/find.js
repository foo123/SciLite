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
            ind = ('last' === dir ? xx.slice().reverse() : xx).reduce(function(ind, xi, i) {
                if (ind.length < n)
                {
                    if (c > cols)
                    {
                        ++r;
                        c = 1;
                    }
                    if ('last' === dir)
                    {
                        if (check(xi, rows-r+1, cols-c+1))
                        {
                            ind.push(tot-(i+1)+1);
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
                    ++c;
                }
                return ind;
            }, []);
        return 1 < nargout ? [row, col, val] : ind;
        /*if (is_2d(x))
        {
            if (is_nd(x))
            {
                // ndarray
                // use octave-compatible columnwise-ordering by permuting back and forth
                var sizex = size(x);
                return tensorview(x, {shape: sizex, ndarray: sizex}).permute(array(sizex.length, function(i) {return sizex.length-1-i;})).toArray().reduce(function(ind, xi, i) {
                    if (check(xi, i+1, 1)) ind.push(i+1);
                    return ind;
                }, []);
            }
            else
            {
                // matrix
                var rows = ROWS(x);
                return x.reduce(function(ind, xi, i) {
                    return xi.reduce(function(ind, xij, j) {
                        if (check(xij, i+1, j+1)) ind.push(i+rows*j+1);
                        return ind;
                    }, ind);
                }, []);
            }
        }
        else
        {
            // vector
            return x.reduce(function(ind, xi, i) {
                if (check(xi, i+1, 1)) ind.push(i+1);
                return ind;
            }, []);
        }*/
    }
    return [];
}
$_.find = find;
fn.find = varargout(function(nargout, x, n, dir) {
    return find(x, function(x) {return !eq(x, O);}, is_int(n) ? _(n) : null, dir || 'first', nargout);
});
