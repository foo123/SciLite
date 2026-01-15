function pwcdanneal(D, k, alpha, max_iter)
{
    /*
    "Pairwise Data Clustering by Deterministic Annealing",
    Thomas Hofmann, Joachim M. Buhmann,
    IEEE Transactions on Pattern Analysis and Machine Intelligence, 1997
    */
    // D is the square distance or dissimilarity matrix
    // M is the assignment matrix which consists of the
    // a posteriori probabilities of a component zi for a given class ck

    if (null == max_iter) max_iter = 100;
    if (null == alpha) alpha = 0.75;

    var n = ROWS(D), M, prevE, E,
        T, Tstart, Tfinal, i, j, v,
        tmp, iter, delta, eps = 1e-6,
        m, e, f, summa, sum, DM;

    // at the worst case the components cannot be grouped
    //max_classes=n;

    // initialize in (0,1) uniformly
    M = matrix(n, k, function() {return stdMath.random();});
    // normalize each row to sum to unity
    for (i=0; i<n; ++i)
    {
        for (summa=0,v=0; v<k; ++v) summa += M[i][v];
        for (v=0; v<k; ++v) M[i][v] /= summa;
    }
    E = matrix(n, k, function() {return stdMath.random();});
    prevE = matrix(n, k, 0);

    // how to choose initial temperature? [corresponds to initial energy==>max eigenvalue]
    Tstart = _(realMath.sqrt(n_mul(norm(D, I), norm(D, inf)))); // max eig estimate
    Tfinal = Tstart/1000;
    D = tonumber(D);
    DM = matrix(n, k, 0);
    sum = array(k, 0);
    T = Tstart;
    while ((alpha < 1) && (T > Tfinal))
    {
        for (iter=1; iter<=max_iter; ++iter)
        {
            tmp = prevE;
            prevE = E;
            E = tmp;
            for (i=0; i<n; ++i)
            {
                m = M[i];
                e = prevE[i];
                for (summa=0,v=0; v<k; ++v)
                {
                    summa += stdMath.exp(-e[v] / T);
                }
                for (v=0; v<k; ++v)
                {
                    // E-lke step: estimate M(t+1) from E(t) eq.(25)
                    m[v] = stdMath.exp(-e[v] / T) / summa;
                }
            }

            for (v=0; v<k; ++v)
            {
                for (summa=0,j=0; j<n; ++j) summa += M[j][v];
                sum[v] = summa;
            }
            for (i=0; i<n; ++i)
            {
                m = DM[i];
                for (v=0; v<k; ++v)
                {
                    for (summa=0,j=0; j<n; ++j) summa += D[i][j]*M[j][v];
                    m[v] = summa;
                }
            }

            delta = 0;

            for (i=0; i<n; ++i)
            {
                m = M[i];
                e = E[i];
                for (v=0; v<k; ++v)
                {
                    f = sum[v] - m[v];
                    for (summa=0,j=0; j<n; ++j)
                    {
                        summa += M[j][v] * (D[i][j] - DM[j][v]/(2*f));
                    }
                    // M-like step: calculate new E(t+1) from M(t+1) eq.(26)
                    e[v] = summa / (f + 1);

                    delta = stdMath.max(delta, stdMath.abs(e[v] - prevE[i][v]));
                }
            }

            if (delta <= eps) break; // converged
        }
        T = alpha*T;   // decrease temperature exponentially
    }
    return M;
}
fn.pwcdanneal = function(D, k) {
    k = stdMath.round(_(sca(k, true)));
    if ((0 >= k) || !is_matrix(D) || (ROWS(D) !== COLS(D))) not_supported("pwcdanneal");
    var i = 2, alpha = 0.75, max_iter = 100;
    while (i < arguments.length)
    {
        if ("Alpha" === arguments[i])
        {
            alpha = stdMath.abs(_(sca(arguments[i+1], true)));
        }
        else if ("MaxIter" === arguments[i])
        {
            max_iter = stdMath.ceil(stdMath.abs(_(sca(arguments[i+1], true))));
        }
        i += 2;
    }
    var M = pwcdanneal(D, k, alpha, max_iter);
    return array(ROWS(M), function(i) {
        for (var Mi=M[i],cluster=0,c=1; c<k; ++c)
        {
            if (Mi[c] > Mi[cluster]) cluster = c;
        }
        return cluster+1;
    });
};