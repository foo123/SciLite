function median(x, dim)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        if (!x.length) return nan;
        x = sort(x);
        return x.length & 1 ? x[(x.length >> 1)] : scalar_div(scalar_add(x[(x.length >> 1)], x[(x.length >> 1) - 1]), two);
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return median(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return median(ROW(x, row));
            });
        }
    }
    not_supported("median");
}
fn.median = median;
