function danneal(D, k)
{
    // "Pairwise Data Clustering by Deterministic Annealing",
    // Thomas Hofmann, Joachim M. Buhmann, 1997
    // D is the square distance or dissimilarity matrix
    // M is the assignment matrix which consists of the
    // a posteriori probabilities of a component zi for a given class ck

    var n = ROWS(D), M, prevE, E,
        T, Tstart, Tfinal, a = 0.5,
        i, j, v, iter, delta, eps = 1e-4,
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
    prevE = matrix(n, k, function() {return stdMath.random();});

    // how to choose initial temperature? [corresponds to initial energy==>eigenvalues]
    Tstart = _(realMath.sqrt(n_mul(norm(D, 1), norm(D, inf)))); // estimate
    Tfinal = Tstart/1000;
    a = 0.5;
    D = D.map(function(di) {return di.map(_);});
    T = Tstart;
    while (T > Tfinal)
    {
        for (iter=1; iter<=100; ++iter)
        {
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

            E = matrix(n, k, 0);
            sum = array(k, function(v) {
                for (var summa=0,j=0; j<n; ++j) summa += M[j][v];
                return summa;
            });
            DM = mul(D, M).map(function(dm) {return dm.map(_);});
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

            prevE = E;
            if (delta <= eps) break; // converged
        }
        T = a*T;   // decrease temperature exponentially
    }
    return M;
}
fn.danneal = function(D, k) {
    k = stdMath.round(_(sca(k, true)));
    if ((0 >= k) || !is_matrix(D) || (ROWS(D) !== COLS(D))) not_supported("danneal");
    var M = danneal(D, k);
    return array(ROWS(M), function(i) {
        for (var Mi=M[i],cluster=0,c=1; c<k; ++c)
        {
            if (Mi[c] > Mi[cluster]) cluster = c;
        }
        return cluster+1;
    });
};