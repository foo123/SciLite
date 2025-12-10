function randi(n, rows, cols)
{
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
fn.randi = randi;
