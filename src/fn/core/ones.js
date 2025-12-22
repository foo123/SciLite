function ones(rows, cols)
{
    if (null == rows) rows = 1;
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    if (null == cols)
    {
        cols = rows;
    }
    return matrix(_(rows), _(cols), I);
}
fn.ones = function(rows, cols) {
    return ones(fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
