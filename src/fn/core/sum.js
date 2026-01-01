function sum(x, dim)
{
    x = vec(x);
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.reduce(function(sum, xi) {
            return scalar_add(sum, xi);
        }, O);
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return sum(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return sum(ROW(x, row));
            });
        }
    }
    return nan;
}
fn.sum = sum;
