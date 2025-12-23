function next_tensor(item, n)
{
    // adapted from https://github.com/foo123/Abacus
    var k = n.length, i, j, i0, i1, DI, a, b, MIN, MAX;
    // LEX
    MIN = 0; MAX = k-1;
    DI = 1; i0 = MAX; i1 = MIN;
    a = 1; b = 0;

    i = i0;
    while ((MIN <= i) && (MAX >= i) && (item[i]+1 === n[a*i+b])) i -= DI;
    if ((MIN <= i) && (MAX >= i))
        for (item[i]=item[i]+1,j=i+DI; MIN<=j && MAX>=j; j+=DI) item[j] = 0;
    //else last item
    else item = null;

    return item;
}
function combinations(A)
{
    // adapted from https://github.com/foo123/Abacus
    A = [].map.call(A, function(Ak) {
        if (!is_array(Ak)) not_supported("combinations");
        return colon(Ak);
    });
    var n = A.map(function(Ak) {return Ak.length;}),
        comb = array(n.length, 0),
        ans = [];
    while (comb && comb.length)
    {
        ans.push(comb.map(function(i, k) {return A[k][i];}));
        comb = next_tensor(comb, n);
    }
    return ans;
}
fn.combinations = function() {
    return combinations(arguments);
};