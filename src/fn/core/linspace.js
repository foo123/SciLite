function linspace(a, b, n)
{
    if (null == n) n = 100;
    a = sca(a, true);
    b = sca(b, true);
    n = sca(n, true);
    n = stdMath.floor(_(n));
    if (0 < n)
    {
        var step = n_div(n_sub(b, a), n-1), i, ans = new Array(n);
        ans[0] = a;
        for (i=1; i<n; ++i) ans[i] = n_add(a, n_mul(step, i));
        return ans;
    }
    return [];
}
fn.linspace = linspace;
