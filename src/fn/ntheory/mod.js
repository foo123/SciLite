function mod(x, n)
{
    n = sca(n || 0);
    return eq(n, 0) ? x : apply(function(x) {
        if (is_num(x))
        {
            var m = n_mod(x, n);
            if (n_lt(m, 0) && n_gt(n, 0)) m = n_add(m, n);
            return m;
        }
        return x;
    }, x, true);
}
fn.mod = mod;
