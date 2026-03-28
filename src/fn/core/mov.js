function mov(x, f, kb, kf, dim)
{
    return group_apply(function(x) {
        var n = x.length;
        return array(n, function(i) {
            return f(x.slice(stdMath.max(0, i-kb), stdMath.min(n-1, i+kf)+1));
        });
    }, null, false, vec(x), vec(dim), "block");
}
fn.movsum = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, sum, kb, kf, dim);
    if (false === ans) not_supported("movsum");
    return ans;
};
fn.movprod = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, prod, kb, kf, dim);
    if (false === ans) not_supported("movprod");
    return ans;
};
fn.movmean = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, mean, kb, kf, dim);
    if (false === ans) not_supported("movmean");
    return ans;
};
fn.movmin = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, min, kb, kf, dim);
    if (false === ans) not_supported("movmin");
    return ans;
};
fn.movmax = function(x, k, dim) {
    var kb, kf, ans;
    if (is_vector(k))
    {
        kb = _(k[0]);
        kf = _(k[1]);
    }
    else if (is_int(k))
    {
        k = _(k);
        if (k & 1)
        {
            kb = (k >> 1);
            kf = (k >> 1);
        }
        else
        {
            kb = (k >> 1);
            kf = ((k-1) >> 1);
        }
    }
    ans = mov(x, max, kb, kf, dim);
    if (false === ans) not_supported("movmax");
    return ans;
};
