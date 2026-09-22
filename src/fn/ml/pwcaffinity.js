function pwcaffinity(s, damping, max_iter)
{
    /*
    "Clustering by passing messages between data points",
    B. J. Frey, D. Dueck,
    Science, 2007
    https://en.wikipedia.org/wiki/Affinity_propagation
    */
    // s is the similarity matrix

    if (null == max_iter) max_iter = 100;
    if (null == damping) damping = 0.5;

    var n = ROWS(s), r, a,
        e, e_prev,
        tmp, tmp1, tmp2,
        iter, notchanged,
        i, j, k, t, K;

    s = tonumber(s);
    // prevent degeneracies, add tiny random differences
    for (i=0; i<n; ++i)
    {
        tmp1 = s[i];
        for (j=0; j<n; ++j)
        {
            tmp1[j] += (Number.EPSILON * tmp1[j] + realmin * 100) * normal();
        }
    }

    // r(i, k) = 0, a(k, i) = 0 for all i, k
    r = matrix(n, n, 0);
    a = matrix(n, n, 0);
    tmp = matrix(n, n, 0);
    e = array(n, 0);
    e_prev = array(n, 0);
    notchanged = 0;

    for (iter=1; iter<=max_iter; ++iter)
    {
        // r(i, k) ← s(i, k) − max_{j:j=/=k}(a(j, i) + s(i, j))
        for (i=0; i<n; ++i)
        {
            tmp1 = tmp[i]; tmp2 = s[i];
            for (k=0; k<n; ++k)
            {
                t = -inf;
                for (j=0; j<n; ++j)
                {
                    if (j === k) continue;
                    t = stdMath.max(t, a[j][i] + tmp2[j]);
                }
                tmp1[k] = tmp2[k] - t;
            }
        }
        // damping
        for (i=0; i<n; ++i)
        {
            tmp1 = r[i]; tmp2 = tmp[i];
            for (k=0; k<n; ++k)
            {
                tmp1[k] = 1 === iter ? tmp2[k] : ((damping) * tmp1[k] + (1 - damping) * tmp2[k]);
            }
        }

        // a(k, k) ← sum_{j:j=/=k}max(0, r(j, k))
        for (k=0; k<n; ++k)
        {
            t = 0;
            for (j=0; j<n; ++j)
            {
                if (j === k) continue;
                t += stdMath.max(0, r[j][k]);
            }
            a[k][k] = t;
        }
        // a(k, i) ← min(0, r(k, k) + sum_{j:j not in {k,i}}max(0, r(j, k)))
        for (k=0; k<n; ++k)
        {
            tmp1 = tmp[k];
            for (i=0; i<n; ++i)
            {
                if (i === k) continue;
                t = r[k][k];
                for (j=0; j<n; ++j)
                {
                    if (j === k || j === i) continue;
                    t += stdMath.max(0, r[j][k]);
                }
                tmp1[i] = stdMath.min(0, t);
            }
        }
        // damping
        for (k=0; k<n; ++k)
        {
            tmp1 = a[k]; tmp2 = tmp[k];
            for (i=0; i<n; ++i)
            {
                tmp1[i] = 1 === iter ? tmp2[i] : ((damping) * tmp1[i] - (1 - damping) * tmp2[i]);
            }
        }

        // exemplars
        tmp1 = e_prev;
        e_prev = e;
        e = tmp1;
        for (k=0; k<n; ++k)
        {
            e[k] = a[k][k] + r[k][k] > 0 ? 1 : 0;
            if (e[k] !== e_prev[k]) notchanged = 0;
        }
        ++notchanged;
        if (notchanged >= 10) break; // exemplars not changed for 10 iters, converged
    }
    e = e.reduce(function(e, ei, i) {
        if (ei > 0) e.push(i);
        return e;
    }, []);
    K = e.length;
    return array(n, function(i) {
        var max = -inf, score = 0, cluster = 0, k, j;
        for (k=0; k<K; ++k)
        {
            j = e[k];
            if (j === i)
            {
                cluster = k;
                break;
            }
            score = /*s[i][j]*/r[i][j] + a[j][i];
            if (score > max)
            {
                max = score;
                cluster = k;
            }
        }
        return cluster + 1;
    });
}
fn.pwcaffinity = function(S) {
    if (!is_matrix(S) || (ROWS(S) !== COLS(S))) not_supported("pwcaffinity");
    var i = 1, damping = 0.5, max_iter = 100;
    while (i < arguments.length)
    {
        if ("Damping" === arguments[i])
        {
            damping = stdMath.abs(_(sca(arguments[i+1], true)));
        }
        else if ("MaxIter" === arguments[i])
        {
            max_iter = stdMath.ceil(stdMath.abs(_(sca(arguments[i+1], true))));
        }
        i += 2;
    }
    return pwcaffinity(S, damping, max_iter);
};