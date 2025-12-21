function max(x)
{
    x = vec(x);
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_vector(x))
    {
        return x.reduce(function(max, xi) {
            if (n_gt(xi, max)) max = xi;
            return max;
        }, -inf);
    }
    else if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return max(COL(x, column));
        });
    }
    return nan;
}
fn.max = max;
