function hypot(a, b)
{
    a = stdMath.abs(a);
    b = stdMath.abs(b);
    var r = 0;
    if (0 === a)
    {
        return b;
    }
    else if (0 === b)
    {
        return a;
    }
    else if (a > b)
    {
        r = b/a;
        return a*stdMath.sqrt(1 + r*r);
    }
    else if (a < b)
    {
        r = a/b;
        return b*stdMath.sqrt(1 + r*r);
    }
    return a*stdMath.SQRT2;
}
function n_hypot(a, b)
{
    if (is_number(a) && is_number(b)) return hypot(a, b);
    return realMath.sqrt(n_add(n_mul(a, a), n_mul(b, b)));
}
function hypotn(args)
{
    var max = 0;
    args = args.map(function(ai) {
        ai = scalar_abs(ai);
        if (max < ai) max = ai;
        return ai;
    });
    return 0 === max ? 0 : (max*stdMath.sqrt(args.reduce(function(sum, ai) {
        if (ai === max)
        {
            return sum + 1;
        }
        else
        {
            var r = ai/max;
            return sum + r*r;
        }
    }, 0)));
}
function d_euclidean(a, b)
{
    var d = 1 === arguments.length ? a : sub(a, b);
    return d.reduce(function(n, di) {
        return n && (is_number(di) || (is_complex(di) && is_number(di.re) && is_number(di.im)));
    }, true) ? hypotn(d) : realMath.sqrt(real(dot(d, d)));
}
function d_sqeuclidean(a, b)
{
    var d = 1 === arguments.length ? a : sub(a, b);
    return real(dot(d, d));
}
function d_cityblock(a, b)
{
    // manhattan
    return sum(abs(1 === arguments.length ? a : sub(a, b)));
}
function d_cosine(a, b)
{
    return scalar_sub(I, scalar_div(scalar_div(dot(a, b), realMath.sqrt(real(dot(a, a)))), realMath.sqrt(real(dot(b, b)))));
}
function d_hamming(a, b)
{
    return __(a.reduce(function(d, ai, i) {
        return d + 1 - eq(ai, b[i]);
    }, 0) / a.length);
}
function d_jaccard(a, b)
{
    return __(a.reduce(function(d, ai, i) {
        return d + eq(ai, b[i]);
    }, 0) / a.length);
}
function d_minkowski(a, b, p)
{
    // p-norm
    if (2 === arguments.length) p = b;
    return scalar_pow(sum(dotpow(abs(2 === arguments.length ? a : sub(a, b)), p)), n_inv(p));
}
function d_chebyshev(a, b)
{
    return max(abs(1 === arguments.length ? a : sub(a, b)));
}
function norm2(x)
{
    return x.reduce(function(n, xi) {
        return scalar_add(n, scalar_mul(xi, scalar_conj(xi)));
    }, O);
}
/*function zsin(side, hypotenuse)
{
    return scalar_div(imag(scalar_mul(side, scalar_conj(hypotenuse))), scalar_mul(abs(side), abs(hypotenuse)));
}
function zcos(side, hypotenuse)
{
    return scalar_div(real(scalar_mul(side, scalar_conj(hypotenuse))), scalar_mul(abs(side), abs(hypotenuse)));
}*/
function normal()
{
    // Box-Muller
    var u1 = 0, u2 = 0, r, z0, z1;
    if (is_number(normal.z1))
    {
        z1 = normal.z1;
        normal.z1 = null;
        return z1;
    }
    while (0 === u1 || 1 === u1) u1 = stdMath.random();
    while (0 === u2 || 1 === u2) u2 = stdMath.random();
    r = stdMath.sqrt(-2.0*stdMath.log(u1));
    z0 = r*stdMath.cos(2.0*pi*u2);
    z1 = r*stdMath.sin(2.0*pi*u2);
    normal.z1 = z1;
    return z0;
}
