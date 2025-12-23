function next_perm(item)
{
    // adapted from https://github.com/foo123/Abacus
    // LEX
    var n = item.length,
        k, kl, s, l, r,
        MIN = 0, MAX = n-1,
        DK = 1, k0 = MAX,
        a = 1, b = 0,
        da = 1, db = 0;

    //Find the largest index k such that a[k] < a[k + 1].
    // taking into account equal elements, generates multiset permutations
    k = k0-DK;
    while ((MIN <= k) && (k <= MAX) && (a*item[k] >= a*item[k+DK])) k -= DK;
    // If no such index exists, the permutation is the last permutation.
    if ((MIN <= k) && (k <= MAX))
    {
        //Find the largest index kl greater than k such that a[k] < a[kl].
        kl = k0;
        while ((MIN <= kl) && (kl <= MAX) && (DK*(kl-k) > 0) && (a*item[k] >= a*item[kl])) kl -= DK;
        //Swap the value of a[k] with that of a[l].
        s = item[k]; item[k] = item[kl]; item[kl] = s;
        //Reverse the sequence from a[k + 1] up to and including the final element a[n].
        l = k+DK; r = k0;
        while ((MIN <= l) && (l <= MAX) && (MIN <= r) && (r <= MAX) && (DK*(r-l) > 0))
        {
            s = item[l]; item[l] = item[r]; item[r] = s;
            l += DK; r -= DK;
        }
    }
    //else last item
    else item = null;

    return item;
}
function perms(v)
{
    // adapted from https://github.com/foo123/Abacus
    v = vec(v);
    if (!is_vector(v)) not_supported("perms");
    var n = v.length,
        perm = array(n, function(i) {return i;}),
        ans = [];
    while (perm && perm.length)
    {
        ans.push(perm.map(function(i) {return v[i];}));
        perm = next_perm(perm);
    }
    return ans;
}
fn.perms = perms;