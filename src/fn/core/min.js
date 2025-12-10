function min(x)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.reduce(function(min, xi) {
            if (n_lt(xi, min)) min = xi;
            return min;
        }, inf);
    }
    else if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return min(COL(x, column));
        });
    }
    return 0;
}
fn.min = min;
