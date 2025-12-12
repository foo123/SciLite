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
fn.ones = ones;
