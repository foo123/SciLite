function conv(a, b, shape)
{
    var n = a.length, m = b.length, nm, i0;

    if (!n || !m) return [];
    if ("valid" === shape)
    {
        // non zero-padded part
        nm = 0 === m ? n : stdMath.max(0, n-m+1);
        i0 = m;
    }
    else if ("same" === shape)
    {
        // central part
        nm = n;
        i0 = m >> 1;
    }
    else
    {
        // full
        nm = n + m - 1;
        i0 = 0;
    }
    return array(nm, function(i) {
        var j, jn, ij, ci = O;
        i += i0;
        for (j=0,jn=stdMath.min(i+1, n); j<jn; ++j)
        {
            ij = i-j;
            if ((0 <= ij) && (ij < m))
            {
                ci = scalar_add(ci, scalar_mul(a[j], b[ij]));
            }
        }
        return ci;
    });
}
fn.conv = function(a, b, shape) {
    if (is_scalar(a) || is_scalar(b)) return dotmul(a, b);
    a = vec(a); b = vec(b);
    if (!is_vector(a) || !is_vector(b)) not_supported("conv");
    return conv(a, b, shape);
};
