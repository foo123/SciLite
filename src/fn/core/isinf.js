fn.isinf = function isinf(x) {
    if (is_array(x)) return x.map(isinf);
    if (is_num(x)) return is_inf(x) ? 1 : 0;
    if (is_complex(x)) return is_inf(x.re) || is_inf(x.im) ? 1 : 0;
    return 0;
};