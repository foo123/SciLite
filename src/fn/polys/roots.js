function roots(p)
{
    // adapted from https://github.com/foo123/Abacus
    if (1 >= p.length) return [];
    var d = p.length-1, tc, lo, hi,
        roots, found, i, j, m,
        ri, ratio, offset, iter,
        epsilon = __(1e-10),
        epsilonz = new complex(epsilon, O),
        zero = new complex(O, O),
        one = new complex(I, O),
        p_x, dp_x, px, dpx;

    p = /*complexify*/(p.map(__));
    p_x = function(x) {
        return horner(p, x);
    };
    dp_x = function(x) {
        return scalar_div(scalar_sub(p_x(scalar_add(x, epsilonz)), p_x(x)), epsilonz);
    };

    // init
    tc = p.map(function(ci) {return complex(ci).abs();});
    i = tc.length-1; while ((0 < i) && n_eq(tc[i], O)) --i;
    hi = n_add(n_div((max(tc.slice(0, i)) || O), max([tc[i], I])), I);
    lo = n_div(tc[0], max(n_add(tc[0], max(tc.slice(1))), I));
    roots = array(d, function() {
        return new complex(n_add(lo, n_mul(n_sub(hi, lo), stdMath.random())), __(stdMath.random()*pi/2), 'polar');
    });

    // root finding
    for (iter=1; iter<=10000; ++iter)
    {
        found = 0;
        for (i=0; i<d; ++i)
        {
            ri = roots[i];
            px = p_x(ri);
            dpx = dp_x(ri);
            if (n_eq(dpx.re, O) && n_eq(dpx.im, O))
            {
                if (n_le(realMath.abs(px.re), epsilon) && n_le(realMath.abs(px.im), epsilon))
                {
                    ++found;
                    continue;
                }
                ratio = new complex(hi, O);
            }
            else
            {
                ratio = px.div(dpx);
            }
            offset = ratio.div(one.sub(ratio.mul(roots.reduce(function(s, rj, j) {
                if ((j !== i) && !(n_eq(ri.re, rj.re) && n_eq(ri.im, rj.im))) s = s.add((ri.sub(rj)).inv());
                return s;
            }, zero))));
            if (n_le(realMath.abs(offset.re), epsilon) && n_le(realMath.abs(offset.im), epsilon)) ++found;
            roots[i] = ri.sub(offset);
        }
        if (found === d) break;
    }
    return roots;
}
fn.roots = function(p) {
    p = vec(p);
    if (!is_vector(p)) not_supported("roots");
    return realify(roots(p).sort(function(a, b) {
        return n_lt(real(a), real(b)) ? -1 : (n_gt(real(a), real(b)) ? 1 : 0);
    }));
};
