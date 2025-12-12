function tril(x, k)
{
    if (is_2d(x))
    {
        k = _(k || 0);
        return matrix(ROWS(x), COLS(x), function(i, j) {
            return j <= i+k ? x[i][j] : O;
        });
    }
    not_supported("tril");
}
fn.tril = tril;
