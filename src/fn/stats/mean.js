function mean(x, dim)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.length ? scalar_div(sum(x), __(x.length)) : nan;
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return mean(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return mean(ROW(x, row));
            });
        }
    }
    not_supported("mean");
}
fn.mean = mean;
