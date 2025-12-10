function conv(a, b)
{
    // adapted from https://github.com/foo123/FILTER.js
    var i, j, ij, t,
        n = a.length,
        m = b.length,
        nm = n + m - 1,
        c, O = __(0);
    if (!n || !m) return [];
    c = new Array(nm);
    if (n < m)
    {
        t = a;
        a = b;
        b = t;
        n = a.length;
        m = b.length;
    }
    for (i=0; i<nm; ++i)
    {
        c[i] = O;
        for (j=0; j<m; ++j)
        {
            ij = i-j;
            if ((0 <= ij) && (ij < n))
            {
                c[i] = scalar_add(c[i], scalar_mul(a[ij], b[j]));
            }
        }
    }
    return c;
}
fn.conv = function(a, b) {
    if (is_scalar(a) || is_scalar(b)) return dotmul(a, b);
    a = vec(a);
    b = vec(b);
    if (!is_vector(a) || !is_vector(b)) not_supported("conv");
    return conv(a, b);
};
