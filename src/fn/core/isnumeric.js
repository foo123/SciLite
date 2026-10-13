fn.isnumeric = function isnumeric(x) {
    if (is_array(x)) return x.length === x.filter(isnumeric).length ? 1 : 0;
    return is_scalar(x) ? 1 : 0;
};