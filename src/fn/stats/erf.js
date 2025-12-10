var __a1 = __( 0.254829592),
    __a2 = __(-0.284496736),
    __a3 = __( 1.421413741),
    __a4 = __(-1.453152027),
    __a5 = __( 1.061405429),
    __p  = __( 0.3275911);
function erf(x)
{
    x = real(x);
    var t, sgn = realMath.sign(x) || 1, I = __(1);

    if (sgn < 0) x = n_neg(x);

    t = n_inv(n_add(n_mul(__p, x), I));
    return n_mul(sgn, n_sub(
    I, n_mul(n_add(n_mul(n_add(n_mul(n_add(n_mul(n_add(n_mul(__a5, t), __a4), t), __a3), t), __a2), t), __a1), n_mul(t, realMath.exp(n_neg(n_mul(x, x)))))));
}
fn.erf = function(x) {
    return apply(erf, x, true);
};
