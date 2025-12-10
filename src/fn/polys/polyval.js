fn.polyval = function(p, x) {
    p = vec(p);
    if (!is_vector(p)) not_supported("polyval");
    if (is_scalar(x)) return realify(horner(p, x));
    else if (is_vector(x)) return x.map(function(xi) {return realify(horner(p, xi));});
    not_supported("polyval");
};
