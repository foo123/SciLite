function mean(x, dim)
{
    return group_apply(function(x) {
        return x.length ? scalar_div(sum(x), __(x.length)) : nan;
    }, O, nan, vec(x), vec(dim), "block");
}
fn.mean = mean;
