function cum(x, f, dir, dim)
{
    var accum;
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        if (null == dir) dir = 'forward';
        if ('reverse' === dir)
        {
            return x.slice().reverse().map(function(xi, i) {
                accum = 0 === i ? xi : f(accum, xi);
                return acc;
            }).reverse();
        }
        else if ('forward' === dir)
        {
            return x.map(function(xi, i) {
                accum = 0 === i ? xi : f(accum, xi);
                return accum;
            });
        }
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return cum(COL(x, column), f, dir, dim);
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return cum(ROW(x, row), f, dir, dim);
            });
        }
    }
    return false;
}
fn.cumsum = function(x, dim, dir) {
    var ans = cum(x, scalar_add, dir, dim);
    if (false === ans) not_supported("cumsum");
    return ans;
};
fn.cumprod = function(x, dim, dir) {
    var ans = cum(x, scalar_mul, dir, dim);
    if (false === ans) not_supported("cumprod");
    return ans;
};
fn.cummin = function(x, dim, dir) {
    var ans = cum(x, function(a, b) {return lt(a, b) ? a : b;}, dir, dim);
    if (false === ans) not_supported("cummin");
    return ans;
};
fn.cummax = function(x, dim, dir) {
    var ans = cum(x, function(a, b) {return gt(a, b) ? a : b;}, dir, dim);
    if (false === ans) not_supported("cummax");
    return ans;
};
