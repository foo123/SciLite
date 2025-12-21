function mov(x, f, kb, kf, dim)
{
    if (is_vector(x))
    {
        var n = x.length;
        return array(n, function(i) {
            return f(x.slice(stdMath.max(0, i-kb), stdMath.min(n-1, i+kf)+1));
        });
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return mov(COL(x, column), f, kb, kf, dim);
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return mov(ROW(x, row), f, kb, kf, dim);
            });
        }
    }
    return false;
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
    ans = mov(vec(x), sum, kb, kf, dim);
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
    ans = mov(vec(x), prod, kb, kf, dim);
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
    ans = mov(vec(x), mean, kb, kf, dim);
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
    ans = mov(vec(x), min, kb, kf, dim);
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
    ans = mov(vec(x), max, kb, kf, dim);
    if (false === ans) not_supported("movmax");
    return ans;
};
