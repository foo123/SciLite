function prod(x, dim)
{
    x = vec(x);
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.reduce(function(prod, xi) {
            return scalar_mul(prod, xi);
        }, I);
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return prod(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return prod(ROW(x, row));
            });
        }
    }
    return nan;
}
fn.prod = prod;
