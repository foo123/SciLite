function normal()
{
    // Box-Muller
    var u1 = 0, u2 = 0, r, z0, z1;
    if (is_number(normal.z1))
    {
        z1 = normal.z1;
        normal.z1 = null;
        return z1;
    }
    while (0 === u1 || 1 === u1) u1 = stdMath.random();
    while (0 === u2 || 1 === u2) u2 = stdMath.random();
    r = stdMath.sqrt(-2.0*stdMath.log(u1));
    z0 = r*stdMath.cos(2.0*pi*u2);
    z1 = r*stdMath.sin(2.0*pi*u2);
    normal.z1 = z1;
    return z0;
}
function randn()
{
    var dims = [].slice.call(arguments);
    if (!dims.length) return __(normal());
    if ((1 === dims.length) && is_vector(dims[0])) dims = dims[0];
    dims = fn.fix(dims).map(_);
    if (1 === dims.length) dims = [dims[0], dims[0]];
    return ndarray(dims, function() {
        return __(normal());
    });
}
fn.randn = randn;
