function logspace(a, b, n)
{
    if (null == n) n = 100;
    n = _(n);
    var step = n_pow(n_div(b, a), 1/(n-1)), ans = new Array(n);
    for (var i=0,ai=a; i<n; ++i,ai=scalar_mul(ai, step)) ans[i] = ai;
    return ans;
}
fn.logspace = logspace;
