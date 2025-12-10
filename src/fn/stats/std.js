function std(x, w, dim)
{
    w = _(w || 0);
    if (is_scalar(x))
    {
        return __(0);
    }
    else if (is_vector(x))
    {
        return 0 === x.length ? nan : (1 === x.length ? __(0) : realMath.sqrt(scalar_div(sum(dotpow(abs(sub(x, mean(x))), __(2))), __(1 === w ? x.length : (x.length-1)))));
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return std(COL(x, column, w));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return std(ROW(x, row, w));
            });
        }
    }
    not_supported("std");
}
fn.std = std;
