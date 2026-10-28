function linspace(a, b, n)
{
    if (null == n) n = 100;
    a = sca(a, true);
    b = sca(b, true);
    n = sca(n, true);
    n = _(n);
    var step = n_div(n_sub(b, a), n-1), i, ans = new Array(n);
    for (i=0; i<n; ++i) ans[i] = n_add(a, n_mul(step, i));
    return ans;
}
fn.linspace = linspace;
