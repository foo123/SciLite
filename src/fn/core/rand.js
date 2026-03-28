function rand()
{
    var dims = [].slice.call(arguments);
    if (!dims.length) return __(stdMath.random());
    if ((1 === dims.length) && is_vector(dims[0])) dims = dims[0];
    dims = fn.fix(dims).map(_);
    if (1 === dims.length) dims = [dims[0], dims[0]];
    return ndarray(dims, function() {
        return __(stdMath.random());
    });
}
fn.rand = rand;
