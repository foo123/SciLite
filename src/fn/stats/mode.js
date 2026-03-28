function mode(x, dim)
{
    return group_apply(function(x) {
        if (!x.length) return nan;
        var count = {}, maxcnt = 0;
        return x.reduce(function(mode, xi) {
            var k = xi.toString(), cnt;
            if (HAS.call(count, k))
            {
                count[k] += 1;
                cnt = count[k];
            }
            else
            {
                count[k] = 1;
                cnt = 1;
            }
            if (cnt > maxcnt)
            {
                maxcnt = cnt;
                mode = xi;
            }
            else if ((cnt === maxcnt) && lt(xi, mode))
            {
                mode = xi;
            }
            return mode;
        }, {});
    }, O, nan, vec(x), vec(dim), "block");
}
fn.mode = mode;
