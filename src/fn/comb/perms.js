function next_perm(item)
{
    // adapted from https://github.com/foo123/Abacus
    if (!item.length) return null;

    // LEX
    var n = item.length,
        k, kl, s, l, r,
        MIN = 0, MAX = n-1,
        DK = 1, k0 = MAX,
        a = 1, b = 0,
        da = 1, db = 0;

    k = k0-DK;
    while ((MIN <= k) && (k <= MAX) && (a*item[k] >= a*item[k+DK])) k -= DK;
    if ((MIN <= k) && (k <= MAX))
    {
        kl = k0;
        while ((MIN <= kl) && (kl <= MAX) && (DK*(kl-k) > 0) && (a*item[k] >= a*item[kl])) kl -= DK;
        s = item[k]; item[k] = item[kl]; item[kl] = s;
        l = k+DK; r = k0;
        while ((MIN <= l) && (l <= MAX) && (MIN <= r) && (r <= MAX) && (DK*(r-l) > 0))
        {
            s = item[l]; item[l] = item[r]; item[r] = s;
            l += DK; r -= DK;
        }
    }
    else item = null;

    return item;
}
function perms(v)
{
    // adapted from https://github.com/foo123/Abacus
    v = vec(v);
    if (!is_1d(v)) not_supported("perms");
    var n = v.length,
        perm = array(n, function(i) {return i;}),
        ans = [];
    while (perm && perm.length)
    {
        ans.unshift(perm.map(function(i) {return v[i];})); // revlex order
        perm = next_perm(perm);
    }
    if (v.$scilitecell$) ans = cellarray(ans, [ans.length]);
    return ans;
}
fn.perms = perms;