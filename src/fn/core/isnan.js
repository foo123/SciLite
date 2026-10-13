fn.isnan = function isnan(x) {
    if (is_array(x)) return x.map(isnan);
    if (is_complex(x)) return is_nan(x.re) || is_nan(x.im) ? 1 : 0;
    return is_nan(x) ? 1 : 0;
};
fn.anynan = function anynan(x) {
    if (is_array(x)) return 0 < x.filter(anynan).length ? 1 : 0;
    if (is_complex(x)) return is_nan(x.re) || is_nan(x.im) ? 1 : 0;
    return is_nan(x) ? 1 : 0;
};