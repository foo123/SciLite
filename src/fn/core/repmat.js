function repmat(x, nr, nc)
{
    if (is_vector(nr))
    {
        nc = nr[1];
        nr = nr[0];
    }
    if (null == nc) nc = nr;
    nr = _(nr); nc = _(nc);
    if (is_0d(x)) x = [[x]];
    if (is_1d(x)) x = [x];
    if (is_2d(x))
    {
        var rows = nr*ROWS(x), cols = nc*COLS(x);
        return matrix(rows, cols, function(i, j) {
            return x[i % nr][j % nc];
        });
   }
   return x;
}
fn.repmat = repmat;
