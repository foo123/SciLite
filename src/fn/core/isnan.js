fn.isnan = function isnan(x) {
    if (is_array(x)) return x.map(isnan);
    if (is_nan(x)) return 1;
    if (is_complex(x)) return is_nan(x.re) || is_nan(x.im) ? 1 : 0;
    return 0;
};