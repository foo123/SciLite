function poly(r)
{
    // adapted from https://github.com/foo123/Abacus
    return r.reduce(function(p, ri) {
        return mulp(p, [I, scalar_neg(ri)]);
    }, [I]);
}
fn.poly = function(r) {
    r = vec(r);
    if (is_matrix(r) && fn.charpoly) return fn.charpoly(r);
    if (!is_vector(r)) not_supported("poly");
    return realify(poly(r));
};
