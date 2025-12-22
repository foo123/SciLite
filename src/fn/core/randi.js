function randi(n, rows, cols)
{
    n = _(n);
    if (null == rows && null == cols)
    {
        return __(stdMath.ceil(stdMath.random()*n));
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
        return __(stdMath.ceil(stdMath.random()*n));
    });
}
fn.randi = function(n, rows, cols) {
    return randi(fn.fix(n), fn.fix(rows), is_scalar(cols) ? fn.fix(cols) : cols);
};
