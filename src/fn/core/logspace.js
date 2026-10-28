function logspace(a, b, n)
{
    if (null == n) n = 100;
    a = sca(a, true);
    b = sca(b, true);
    n = sca(n, true);
    n = _(n);
    n = _(n);
    var step = n_pow(n_div(b, a), 1/(n-1)), i, ans = new Array(n);
    for (i=0; i<n; ++i) ans[i] = n_mul(a, n_pow(step, i));
    return ans;
}
fn.logspace = logspace;
