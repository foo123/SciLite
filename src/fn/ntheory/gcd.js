function n_gcd(/* args */)
{
    // adapted from https://github.com/foo123/Abacus
    var args = arguments, c = args.length, a, b, t, i;
    if (0 === c) return O;

    i = 0;
    while ((i < c) && n_eq(O, a=args[i++]));
    a = realMath.abs(a);
    while (i < c)
    {
        // break early
        if (n_eq(a, I)) return I;
        while ((i < c) && n_eq(O, b=args[i++]));
        b = realMath.abs(b);
        // break early
        if (n_eq(b, I)) return I;
        else if (n_eq(b, a)) continue;
        else if (n_eq(b, O)) break;
        // swap them (a >= b)
        if (n_lt(a, b)) {t = b; b = a; a = t;}
        while (!n_eq(O, b)) {t = b; b = n_mod(a, t); a = t;}
    }
    return a;
}
function n_xgcd(args)
{
    // adapted from https://github.com/foo123/Abacus
    var k = args.length, a, b, a1 = I, b1 = O, a2 = O, b2 = I, quot, gcd, asign = I, bsign = I;

    if (0 === k) return;

    a = args[0];
    if (n_gt(O, a)) {a = realMath.abs(a); asign = J;}
    if (1 === k)
    {
        return [a, asign];
    }
    else //if (2 <= k)
    {
        // recursive on number of arguments
        // compute xgcd on rest arguments and combine with current
        // based on recursive property: gcd(a,b,c,..) = gcd(a, gcd(b, c,..))
        // for coefficients this translates to:
        // gcd(a,b,c,..) = ax + by + cz + .. =
        // gcd(a, gcd(b, c, ..)) = ax + k gcd(b,c,..) = (given gcd(b,c,..) = nb + mc + ..)
        // gcd(a, gcd(b, c, ..)) = ax + k (nb + mc + ..) = ax + b(kn) + c(km) + .. = ax + by +cz + ..
        // also for possible negative numbers we can do (note gcd(a,b,c,..) is always positive):
        // a*(sign(a)*x) + b*(sign(b)*y) + c*(sign(c)*z) + .. = gcd(|a|,|b|,|c|,..) so factors are same only adjusted by sign(.) to match always positive GCD
        // note: returns always positive gcd (even of negative numbers)
        // note2: any zero arguments are skipped and do not break xGCD computation
        // note3: gcd(0,0,..,0) is conventionaly set to 0 with 1's as factors
        gcd = 2 === k ? [args[1], I] : n_xgcd(args.slice(1));
        b = gcd[0];
        if (n_gt(O, b)) {b = realMath.abs(b); bsign = J;}

        // gcd with zero factor, take into account
        if (n_eq(O, a))
            return array(gcd.length+1,function(i) {
                return 0 === i ? b : (1 === i ? asign : n_mul(bsign, gcd[i-1]));
            });
        else if (n_eq(O, b))
            return array(gcd.length+1,function(i) {
                return 0 === i ? a : (1 === i ? asign : n_mul(bsign, gcd[i-1]));
            });

        for (;;)
        {
            quot = realMath.floor(n_div(a, b));
            a = n_mod(a, b);
            a1 = n_sub(a1, n_mul(quot, a2));
            b1 = n_sub(b1, n_mul(quot, b2));
            if (n_eq(O, a))
            {
                a2 = n_mul(a2, asign); b2 = n_mul(b2, bsign);
                return array(gcd.length+1,function(i) {
                    return 0 === i ? b : (1 === i ? a2 : n_mul(b2, gcd[i-1]));
                });
            }

            quot = realMath.floor(n_div(b, a));
            b = n_mod(b, a);
            a2 = n_sub(a2, n_mul(quot, a1));
            b2 = n_sub(b2, n_mul(quot, b1));
            if (n_eq(O, b))
            {
                a1 = n_mul(a1, asign); b1 = n_mul(b1, bsign);
                return array(gcd.length+1, function(i) {
                    return 0 === i ? a : (1 === i ? a1 : n_mul(b1, gcd[i-1]));
                });
            }
        }
    }
}
function gcd(a, b, want_bezout_coeffs)
{
    if (want_bezout_coeffs)
    {
        var u, v;
        if (is_array(a))
        {
            u = new Array(a.length);
            if (is_array(b))
            {
                if (a.length !== b.length) not_supported("gcd");
                v = new Array(b.length)
                return [a.map(function(ai, i) {
                    var res = gcd(ai, b[i], want_bezout_coeffs);
                    u[i] = res[1];
                    v[i] = res[2];
                    return res[0];
                }), u, v];
            }
            if (is_int(b))
            {
                v = new Array(a.length)
                return [a.map(function(ai, i) {
                    var res = gcd(ai, b, want_bezout_coeffs);
                    u[i] = res[1];
                    v[i] = res[2];
                    return res[0];
                }), u, v];
            }
        }
        if (is_int(a))
        {
            if (is_array(b))
            {
                u = new Array(b.length);
                v = new Array(b.length);
                return [b.map(function(bi, i) {
                    var res = gcd(a, bi, want_bezout_coeffs);
                    u[i] = res[1];
                    v[i] = res[2];
                    return res[0];
                }), u, v];
            }
            if (is_int(b))
            {
                return n_xgcd([a, b]);
            }
        }
    }
    else
    {
        if (is_array(a))
        {
            if (is_array(b))
            {
                if (a.length !== b.length) not_supported("gcd");
                return a.map(function(ai, i) {return gcd(ai, b[i]);});
            }
            if (is_int(b))
            {
                return a.map(function(ai) {return gcd(ai, b);});
            }
        }
        if (is_int(a))
        {
            if (is_array(b))
            {
                return b.map(function(bi, i) {return gcd(a, bi);});
            }
            if (is_int(b))
            {
                return n_gcd(a, b);
            }
        }
    }
    not_supported("gcd");
}
fn.gcd = varargout(function(nargout, a, b) {
    return gcd(a, b, 1 < nargout);
});