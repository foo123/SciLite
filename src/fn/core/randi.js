function randi(n/*, dims*/)
{
    var imax, imin = 1, dims = [].slice.call(arguments, 1);
    n = fn.fix(n);
    if (is_vector(n) && (2 <= n.length))
    {
        imin = _(n[0]);
        imax = _(n[1]);
    }
    else
    {
        imax = _(sca(n, true));
    }
    if (!dims.length) return __(imin + stdMath.round(stdMath.random()*(imax - imin)));
    if ((1 === dims.length) && is_vector(dims[0])) dims = dims[0];
    dims = fn.fix(dims).map(_);
    if (1 === dims.length) dims = [dims[0], dims[0]];
    return ndarray(dims, function() {
        return __(imin + stdMath.round(stdMath.random()*(imax - imin)));
    });
}
fn.randi = randi;
