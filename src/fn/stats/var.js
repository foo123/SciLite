function variance(x, w, dim)
{
    w = _(w || 0);
    return group_apply(function(x) {
        if (1 >= x.length) return x.length ? O : nan;
        var N = x.length,
            mu_x = mean(x),
            bar_x = sub(x, mu_x);
        return scalar_div(sum(dotmul(conj(bar_x), bar_x)), __(1 === w ? N : (N-1)));
    }, O, nan, vec(x), vec(dim), "block");
}
fn['var'] = variance;
