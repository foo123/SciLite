function sum(x)
{
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
        return array(COLS(x), function(column) {
            return sum(COL(x, column));
        });
    }
    return nan;
}
fn.sum = sum;
