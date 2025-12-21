function prod(x)
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
        return array(COLS(x), function(column) {
            return prod(COL(x, column));
        });
    }
    return nan;
}
fn.prod = prod;
