fn.isempty = function(x) {
    if (is_array(x))
    {
        if (is_2d(x)) return !x[0].length ? 1 : 0;
        else return !x.length ? 1 : 0;
    }
    return 0;
};
