var small_primes = [__(2),__(3),__(5),__(7),__(11),__(13),__(17),__(19),__(23),__(29),__(31),__(37),__(41),__(43),__(47),__(53),__(59),__(61),__(67),__(71),__(73),__(79),__(83),__(89),__(97),__(101),__(103),__(107),__(109)];

update.push(function() {
    small_primes = [__(2),__(3),__(5),__(7),__(11),__(13),__(17),__(19),__(23),__(29),__(31),__(37),__(41),__(43),__(47),__(53),__(59),__(61),__(67),__(71),__(73),__(79),__(83),__(89),__(97),__(101),__(103),__(107),__(109)];
});

function trial_div_fac(n, maxlimit)
{
    // adapted from https://github.com/foo123/Abacus
    var factors = [], n0 = n, i, l, p, p2;

    for (i=0,l=small_primes.length; i<l; ++i)
    {
        p = small_primes[i];
        if (n_eq(n0, p)) return [p];

        p2 = n_mul(p, p);

        if (n_gt(p2, n) || ((null != maxlimit) && n_gt(p2, maxlimit))) break;

        while (n_eq(O, n_mod(n, p)))
        {
            factors.push(p);
            n = n_div(n, p);
        }
    }
    if (i >= l)
    {
        p = n_add(p, two);
        p2 = n_mul(p, p);
        while (n_le(p2, n) && ((null == maxlimit) || n_le(p2, maxlimit)))
        {
            while (n_eq(O, n_mod(n, p)))
            {
                factors.push(p);
                n = n_div(n, p);
            }
            p = n_add(p, two);
            p2 = n_mul(p, p);
        }
    }
    if (n_gt(n, I)) factors.push(n);
    return factors;
}
fn.factor = function(n) {
    return trial_div_fac(realMath.floor(realMath.abs(real(sca(n)))), __(1e30));
};