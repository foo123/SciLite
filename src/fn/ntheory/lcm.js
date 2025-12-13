function n_lcm2(a, b)
{
    // adapted from https://github.com/foo123/Abacus
    var aa = realMath.abs(a), bb = realMath.abs(b);
    if (n_eq(aa, bb)) return n_eq(n_sign(a), n_sign(b)) ? aa : n_neg(aa);
    return n_mul(n_div(a, n_gcd(a, b)), b);
}
function n_lcm(/* args */)
{
    // adapted from https://github.com/foo123/Abacus
    var args = arguments, i, l = args.length, LCM;
    if (1 >= l) return 1 === l ? args[0] : O;
    if (n_eq(O, args[0]) || n_eq(O, args[1])) return O;
    LCM = n_lcm2(args[0], args[1]);
    for (i=2; i<l; ++i)
    {
        if (n_eq(O, args[i])) return O;
        LCM = n_lcm2(LCM, args[i]);
    }
    return LCM;
}
function lcm(a, b)
{
    if (is_array(a))
    {
        if (is_array(b)) return a.map(function(ai, i) {return lcm(ai, b[i]);});
        if (is_int(b)) return a.map(function(ai) {return lcm(ai, b);});
    }
    if (is_int(a))
    {
        if (is_array(b)) return b.map(function(bi, i) {return lcm(a, bi);});
        if (is_int(b)) return n_lcm(a, b);
    }
    return a;
}
fn.lcm = lcm;