function cov(a, b, w)
{
    w = _(w || 0);
    if ((2 === arguments.length) && (0 === _(b) || 1 === _(b)))
    {
        w = _(b);
        b = null;
    }
    if (null == b)
    {
        if (is_scalar(a))
        {
            return 0;
        }
        else if (is_vector(a))
        {
            if (1 >= a.length) return a.length ? __(0) : nan;
            var N = a.length,
                mu_a = mean(a),
                bar_a = sub(a, mu_a);
            return scalar_div(sum(dotmul(conj(bar_a), bar_a)), __(1 === w ? N : (N-1)));
        }
        else if (is_matrix(a))
        {
            return matrix(COLS(a), COLS(a), function(column1, column2, m) {
                return column1 === column2 ? cov(COL(a, column1), w) : (column1 > column2 ? m[column2][column1] : cov(COL(a, column1), COL(a, column2), w));
            });
        }
    }
    else
    {
        if (is_scalar(a) && is_scalar(b))
        {
            return zeros(2, 2);
        }
        if (is_matrix(a) && is_matrix(b))
        {
            a = colon(a);
            b = colon(b);
        }
        if (is_vector(a) && is_vector(b))
        {
            if (a.length !== b.length) throw "cov: inputs not of same dimension";
            if (1 >= a.length) return a.length ? __(0) : nan;
            var N = a.length;
            return scalar_div(sum(dotmul(conj(sub(a, mean(a))), sub(b, mean(b)))), __(1 === w ? N : (N-1)));
        }
    }
    not_supported("cov");
}
fn.cov = cov;
