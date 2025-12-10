function mode(x, dim)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        if (!x.length) return nan;
        var count = {}, maxcnt = 0;
        return x.reduce(function(mode, xi) {
            var k = xi.toString(), cnt;
            if (HAS.call(count, k))
            {
                count[k] += 1;
                cnt = count[k];
            }
            else
            {
                count[k] = 1;
                cnt = 1;
            }
            if (cnt > maxcnt)
            {
                maxcnt = cnt;
                mode = xi;
            }
            else if ((cnt === maxcnt) && lt(xi, mode))
            {
                mode = xi;
            }
            return mode;
        }, {});
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return mode(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return mode(ROW(x, row));
            });
        }
    }
    not_supported("mode");
}
fn.mode = mode;
