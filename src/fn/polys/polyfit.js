function lagrange(x, y)
{
    // adapted from https://github.com/foo123/Abacus
    var p, i, n, d, f, vi, hash, dupl;
    if (!is_vector(x) || !x.length || !is_vector(y) || !y.length) return [];
    // check and filter out duplicate values
    x = x.slice();
    y = y.slice();
    n = stdMath.min(x.length, y.length);
    x.length = n;
    y.length = n;
    hash = {}; dupl = [];
    for (i=0; i<n; ++i)
    {
        vi = String(x[i]);
        if (!HAS.call(hash, vi)) hash[vi] = i;
        else if (!eq(y[hash[vi]], y[i])) return []; // no polynomial exists
        else dupl.push(i); // duplicate value to be removed
    }
    // remove duplicate values
    while (dupl.length)
    {
        i = dupl.pop();
        x.splice(i, 1);
        y.splice(i, 1);
    }
    hash = null;
    dupl = null;
    n = x.length;

    // Set-up denominators
    d = array(n, function(j) {
        var i, dj = I;
        for (i=0; i<n; ++i)
        {
            if (i === j) continue;
            dj = scalar_mul(dj, scalar_sub(x[j], x[i]));
        }
        dj = scalar_div(y[j], dj);
        return dj;
    });
    // Set-up numerator factors
    f = array(n, function(i) {
        return [I, scalar_neg(x[i])];
    });
    // Produce each Li in turn, and sum into p
    for (p=[],i=0; i<n; ++i)
    {
        p = addp(p, f.reduce(function(Li, fj, j) {
            if (j !== i) Li = mulp(Li, fj);
            return Li;
        }, [d[i]]));
    }
    return p;
}
fn.polyfit = function(x, y, n) {
    x = vec(x);
    y = vec(y);
    if (!is_vector(x) || !is_vector(y)) not_supported("polyfit");
    if (x.length !== y.length) throw "polyfit: input 1 and 2 must have same length";
    if (3 === arguments.length)
    {
        if (!is_int(n) || (0 > _(n))) throw "polyfit: input 3 not positive int";
        n = _(n);
        // least-squares fit
        return realify(mul(pinv(x.reduce(function(A, xi) {
            for (var i=1,row=[I]; i<=n; ++i)
            {
                row.unshift(scalar_mul(xi, row[0]));
            }
            A.push(row);
            return A;
        }, [])), y));
    }
    else
    {
        // lagrange interpolation
        return realify(lagrange(x, y));
    }
};
