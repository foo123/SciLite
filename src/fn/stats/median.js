function median(x, dim)
{
    return group_apply(function(x) {
        if (!x.length) return nan;
        x = sort(x);
        return x.length & 1 ? x[(x.length >> 1)] : scalar_div(scalar_add(x[(x.length >> 1)], x[(x.length >> 1) - 1]), two);
    }, O, nan, vec(x), vec(dim), "block");
}
fn.median = median;
