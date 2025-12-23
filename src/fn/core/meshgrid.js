function meshgrid(x, y)
{
    var X, Y;
    if (null == y)
    {
        y = x;
    }
    x = vec(x); y = vec(y);
    if (is_vector(x) && is_vector(y))
    {
        X = matrix(y.length, x.length, function(i, j) {
            return x[j];
        });
        Y = matrix(y.length, x.length, function(i, j) {
            return y[i];
        });
        return [X, Y];
    }
    not_supported("meshgrid");
}
fn.meshgrid = varargout(function(nargout, x, y) {
    return meshgrid(x, y);
}, 2);
