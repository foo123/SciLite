function next_comb(item, n, k)
{
    // adapted from https://github.com/foo123/Abacus
    var i, j, index, curr, i0, DI, MIN, MAX, a, b, da, db, inc;

    if ((0 > n) || (0 > k) || !item.length) return null;

    // LEX
    MIN = 0; MAX = k-1;
    DI = 1; i0 = MAX;
    a = 1; b = 0;
    da = 1; db = 0;
    inc = 1;

    for (index=-1,j=n-k,i=i0; (MIN<=i) && (i<=MAX); i-=DI)
        if (item[i] < j+da*i+db) {index = i; break;}

    if ((MIN <= index) && (index <= MAX))
    {
        curr = item[index]+1;
        j = n-k+da*index+db;
        if (curr === j)
        {
            item[index] = curr;
        }
        else if (curr < j)
        {
            for (i=index; (MIN<=i) && (i<=MAX); i+=DI) {item[i] = curr; curr += inc;}
        }
    }
    else item = null;

    return item;
}
function nchoosek(n, k)
{
    // adapted from https://github.com/foo123/Abacus
    var v = is_array(n) ? vec(n) : null, comb, ans;
    if (!is_scalar(k) || (!is_scalar(n) && !is_1d(v))) not_supported("nchoosek");
    if (is_scalar(n))
    {
        // return binomial coefficient
        return binom(n, k);
    }
    // return all choices of k items from n items
    ans = [];
    k = stdMath.round(_(real(k)));
    n = v.length;
    if ((0 <= k) && (k <= n))
    {
        comb = array(k, function(i) {return i;});
        while (comb)
        {
            ans.push(comb.map(function(i) {return v[i];}));
            comb = next_comb(comb, n, k);
        }
    }
    if (v.$scilitecell$) ans = cellarray(ans, [ans.length]);
    return ans;
}
fn.nchoosek = nchoosek;