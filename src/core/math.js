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
function d_seuclidean(a, b, std)
{
    var d = dotdiv(sub(a, b), std);
    return real(dot(d, d));
}
function d_mahalanobis(a, mean, invCov)
{
    var d = sub(a, mean);
    return real(dot(vec(mul(d, invCov)), d));
}
function d_minkowski(a, b, p)
{
    // p-norm
    if (2 === arguments.length) p = b;
    if (n_eq(p, I))
    {
        return 2 === arguments.length ? d_cityblock(a) : d_cityblock(a, b);
    }
    else if (n_eq(p, two))
    {
        return 2 === arguments.length ? d_euclidean(a) : d_euclidean(a, b);
    }
    else if (is_inf(p))
    {
        return 2 === arguments.length ? d_chebychev(a) : d_chebychev(a, b);
    }
    return scalar_pow(sum(dotpow(abs(2 === arguments.length ? a : sub(a, b)), p)), n_inv(p));
}
function d_chebychev(a, b)
{
    return max(abs(1 === arguments.length ? a : sub(a, b)));
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
function d_correlation(a, b)
{
    return d_cosine(sub(a, mean(a)), sub(b, mean(b)));
}
function d_hamming(a, b)
{
    return __(a.reduce(function(d, ai, i) {
        return d + 1 - eq(ai, b[i]);
    }, 0) / a.length);
}
function d_jaccard(a, b)
{
    return __(1 - a.reduce(function(d, ai, i) {
        return d + eq(ai, b[i]);
    }, 0) / a.length);
}
function d_kullbackleibler(a, b, symmetric)
{
    // compute the Kullback-Leibler divergence
    // normalize A and B to sum to unity (make them represent probability density functions)
    var d, p;
    if (is_matrix(a) && is_matrix(b))
    {
        a = add(sub(a, min(min(a))), eps);
        b = add(sub(b, min(min(b))), eps);
        a = dotdiv(a, sum(sum(a)));
        b = dotdiv(b, sum(sum(b)));
        d = sum(sum(add(sub(dotmul(a, fn.log(dotdiv(a, b))), a), b)));
        if (symmetric)
        {
            p = sum(sum(add(sub(dotmul(b, fn.log(dotdiv(b, a))), b), a)));
            d = scalar_mul(scalar_add(d, p), half);
        }
    }
    else
    {
        a = add(sub(a, min(a)), eps);
        b = add(sub(b, min(b)), eps);
        a = dotdiv(a, sum(a));
        b = dotdiv(b, sum(b));
        d = sum(add(sub(dotmul(a, fn.log(dotdiv(a, b))), a), b));
        if (symmetric)
        {
            p = sum(add(sub(dotmul(b, fn.log(dotdiv(b, a))), b), a));
            d = scalar_mul(scalar_add(d, p), half);
        }
    }
    return d;
}

function norm2(x)
{
    return x.reduce(function(n, xi) {
        return scalar_add(n, scalar_mul(xi, scalar_conj(xi)));
    }, O);
}

function tiedrank(x, symmetric)
{
    var n = x.length,
        ord = x.map(function(xi, i) {return [xi, i];}).sort(function(a, b) {
            return eq(a[0], b[0]) ? a[1] - b[1] : (lt(a[0], b[0]) ? -1 : 1);
        }),
        rank = new Array(n), i, j, k;
    for (i=0; i<n;)
    {
        k = 1;
        j = i;
        while ((j+k < n) && eq(ord[j][0], ord[j+k][0])) ++k;
        while (j < i+k)
        {
            rank[ord[j][1]] = is_nan(ord[j][0]) ? nan : (symmetric ? __((2*i <= n ? i+1 : n-i) + (1 < k ? 1/k : 0)) : __(i+1 + (1 < k ? 1/k : 0)));
            ++j;
        }
        i = j;
    }
    return rank;
}
function pearson(a, b)
{
    var N = a.length;
    return 1 < N ? scalar_div(sum(dotmul(dotdiv(sub(a, mean(a)), std(a)), dotdiv(sub(b, mean(b)), std(b)))), __(N-1)) : I;
}
function spearman(a, b)
{
    return pearson(tiedrank(a), tiedrank(b));
}
function kendall(a, b)
{
    if (1 < a.length)
    {
        var n = a.length, i, j, sa, sb, tau = O;
        for (i=0; i<n; ++i)
        {
            for (j=i+1; j<n; ++j)
            {
                sa = scalar_sign(scalar_sub(a[i], a[j]));
                sb = scalar_sign(scalar_sub(b[i], b[j]));
                tau = scalar_add(tau, scalar_mul(sa, sb));
            }
        }
        return scalar_div(scalar_div(scalar_mul(tau, two), n), n-1);
    }
    return I;
}
