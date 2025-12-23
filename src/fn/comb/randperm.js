function shuffle(a)
{
    // adapted from https://github.com/foo123/Abacus
    var offset = 0, a0 = 0, a1 = a.length-1,
        N = a1-a0+1, perm, swap;
    while (1 < N--)
    {
        perm = stdMath.round(stdMath.random()*(N-offset));
        swap = a[a0+N];
        a[a0+N] = a[a0+perm];
        a[a0+perm] = swap;
    }
    return a;
}
fn.randperm = function(n) {
    n = stdMath.round(_(n || 0));
    if (!is_int(n) || 0 >= n) not_supported("randperm");
    return shuffle(array(n, function(i) {return i+1;}));
};
