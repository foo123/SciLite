function rand(rows, cols)
{
    if (null == rows)
    {
        return __(stdMath.random());
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
        return __(stdMath.random());
    });
}
fn.rand = rand;
