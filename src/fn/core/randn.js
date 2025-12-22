function randn(rows, cols)
{
    if (null == rows)
    {
        return __(normal());
    }
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    if (null == cols)
    {
        cols = rows;
    }
    return matrix(_(rows), _(cols), function() {
        return __(normal());
    });
}
fn.randn = function(rows, cols) {
    return randn(fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
