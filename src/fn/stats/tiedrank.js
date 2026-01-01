fn.tiedrank = varargout(function(nargout, x, a, b) {
    if (1 < nargout) throw "tiedrank: only one output is supported";
    if (is_scalar(x)) x = [x];
    x = vec(x);
    var symmetric = eq(O, a) && eq(I, b);
    if (is_matrix(x))
    {
        return transpose(array(COLS(x), function(col) {
            return tiedrank(COL(x, col), symmetric);
        }));
    }
    else
    {
        return tiedrank(x, symmetric);
    }
});