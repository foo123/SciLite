function zeros(rows, cols)
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
    return matrix(_(rows), _(cols), O);
}
fn.zeros = function(rows, cols) {
    return zeros(fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
