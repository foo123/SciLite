function kmeans(X, k, D, init, max_iter, run_async, speedup)
{
    // https://en.wikipedia.org/wiki/K-means_clustering
    // Lloyd's algorithm with triangle speedup heuristic
    var n = X.length, idx = array(n, -1), C, centroids_changed = 0, iter;
    if (run_async)
    {
        return (async function() {
            await closest_clusters(idx, null, X, is_matrix(init) ? init : await init(X, k, D, run_async), D, run_async);

            for (iter=1; iter<=max_iter; ++iter)
            {
                // calculate centroids
                C = compute_centroids(idx, X, k);
                // assign each point to the nearest centroid
                centroids_changed = await closest_clusters(idx, null, X, C, D, run_async);
                if (!centroids_changed) break; // converged
            }
            if (centroids_changed) fn.warning('kmeans failed to converge in '+max_iter+' iteration(s).');
            return [idx, C];
        })();
    }
    else
    {
        closest_clusters(idx, null, X, is_matrix(init) ? init : init(X, k, D), D);

        for (iter=1; iter<=max_iter; ++iter)
        {
            // calculate centroids
            C = compute_centroids(idx, X, k);
            // assign each point to the nearest centroid
            centroids_changed = closest_clusters(idx, null, X, C, D);
            if (!centroids_changed) break; // converged
        }
        if (centroids_changed) fn.warning('kmeans failed to converge in '+max_iter+' iteration(s).');
        return [idx, C];
    }
}
function closest_clusters(idx, min, X, C, D, run_async)
{
    var n = X.length, k = C.length, i, j, x, d, cj, minj, nchanged = 0;
    if (run_async)
    {
        return (async function() {
        for (j=0; j<n; ++j)
        {
            x = X[j];
            cj = 0;
            minj = inf;
            for (i=0; i<k; ++i)
            {
                if (!C[i] || !C[i].length) continue;
                d = await D(x, C[i]);
                if (n_lt(d, minj))
                {
                    minj = d;
                    cj = i;
                }
            }
            if (idx)
            {
                if (cj !== idx[j]) ++nchanged;
                idx[j] = cj;
            }
            if (min)
            {
                min[j] = minj;
            }
        }
        return nchanged;
        })();
    }
    else
    {
        for (j=0; j<n; ++j)
        {
            x = X[j];
            cj = 0;
            minj = inf;
            for (i=0; i<k; ++i)
            {
                if (!C[i] || !C[i].length) continue;
                d = D(x, C[i]);
                if (n_lt(d, minj))
                {
                    minj = d;
                    cj = i;
                }
            }
            if (idx)
            {
                if (cj !== idx[j]) ++nchanged;
                idx[j] = cj;
            }
            if (min)
            {
                min[j] = minj;
            }
        }
        return nchanged;
    }
}
function compute_centroid(cluster)
{
    return cluster.length ? mean(cluster) : cluster;
}
function compute_centroids(idx, X, k)
{
    return array(k, function(cluster_index) {
        return compute_centroid(idx.reduce(function(cluster, index, i) {
            if (index === cluster_index) cluster.push(X[i]);
            return cluster;
        }, []));
    });
}
function kmeans_init_forgy(X, k, D, run_async)
{
    X = X.slice();
    return array(k, function(cluster) {
        var i = X.length ? stdMath.round(stdMath.random()*(X.length-1)) : -1;
        return -1 < i ? X.splice(i, 1)[0] : [];
    });
}
function kmeans_init_random_partition(X, k, D, run_async)
{
    var n = X.length;
    return shuffle(X.slice()).reduce(function(clusters, xi) {
        if (!clusters.length) clusters.push([xi]);
        else if (clusters[clusters.length-1].length+1 > n/k) clusters.push([xi]);
        else clusters[clusters.length-1].push(xi);
        return clusters;
    }, []).map(compute_centroid);
}
function kmeans_init_plusplus(X, k, D, run_async)
{
    // https://en.wikipedia.org/wiki/K-means%2B%2B
    // Initialize list of centroids with one randomly selected point
    var n = X.length,
        centroids = [X[stdMath.round(stdMath.random()*(n-1))]],
        D2 = new Array(n), d = new Array(n), i, total, thresh, cum;

    if (run_async)
    {
        return (async function() {
        // Choose remaining k - 1 centroids
        while (centroids.length < k)
        {
            await closest_clusters(null, d, X, centroids, D, run_async);
            // For each point, compute squared distance to nearest selected centroid
            total = O;
            for (i=0; i<n; ++i)
            {
                D2[i] = scalar_abs(scalar_mul(d[i], scalar_conj(d[i])));
                total = n_add(total, D2[i]);
            }

            // Choose next centroid with probability proportional to D(x)^2
            thresh = n_mul(total, stdMath.random());
            cum = O;
            for (i=0; i<n; ++i)
            {
                cum = n_add(cum, D2[i]);
                if (n_ge(cum, thresh))
                {
                    centroids.push(X[i]);
                    break;
                }
            }
        }
        return centroids;
        })();
    }
    else
    {
        // Choose remaining k - 1 centroids
        while (centroids.length < k)
        {
            closest_clusters(null, d, X, centroids, D);
            // For each point, compute squared distance to nearest selected centroid
            total = O;
            for (i=0; i<n; ++i)
            {
                D2[i] = scalar_abs(scalar_mul(d[i], scalar_conj(d[i])));
                total = n_add(total, D2[i]);
            }

            // Choose next centroid with probability proportional to D(x)^2
            thresh = n_mul(total, stdMath.random());
            cum = O;
            for (i=0; i<n; ++i)
            {
                cum = n_add(cum, D2[i]);
                if (n_ge(cum, thresh))
                {
                    centroids.push(X[i]);
                    break;
                }
            }
        }
        return centroids;
    }
}
fn.kmeans = varargout(namevalueargs(function(nargout, X, k) {
    var nv = arguments[arguments.length-1]._,
        dist, init, max_iter, speedup = false,
        run_async = false, i, j, n, m, idx, C, ans;
    if (!is_matrix(X)) not_supported("kmeans");
    if (is_matrix(nv.Start))
    {
        init = nv.Start;
        if (COLS(init) !== COLS(X)) throw "kmeans: centroids and input must have same number of columns";
        k = ROWS(init);
    }
    else
    {
        switch (nv.Start)
        {
            /*case "cluster":
            // not used
            break;*/
            case "uniform":
            init = kmeans_init_random_partition;
            break;
            case "sample":
            init = kmeans_init_forgy;
            break;
            case "plus":
            default:
            init = kmeans_init_plusplus;
            break;
        }
    }
    if (is_callable(nv.Distance))
    {
        dist = nv.Distance;
        run_async = is_instance(dist(X[0], array(X[0].length, O)), Promise);
    }
    else
    {
        switch (nv.Distance)
        {
            case "hamming":
            dist = d_hamming;
            break;
            case "correlation":
            dist = d_correlation;
            break;
            case "cosine":
            dist = d_cosine;
            break;
            case "cityblock":
            dist = d_cityblock;
            break;
            case "euclidean":
            dist = d_euclidean;
            break;
            case "sqeuclidean":
            default:
            dist = d_sqeuclidean;
            break;
        }
    }
    max_iter = stdMath.ceil(stdMath.abs(_(sca(nv.MaxIter, true))));

    if (run_async)
    {
        return (async function() {
        ans = await kmeans(X, k, dist, init, max_iter, run_async);
        idx = ans[0]; C = ans[1];
        ans[0] = ans[0].map(function(idx) {return idx+1;});
        if (1 === nargout)
        {
            ans = ans[0];
        }
        else if (2 < nargout)
        {
            // sumd
            n = idx.length;
            m = array(k, O);
            ans.push(m);
            for (j=0; j<k; ++j)
            {
                for (i=0; i<n; ++i)
                {
                    if (idx[i] === j)
                    {
                        m[j] = scalar_add(m[j], await dist(X[i], C[j]));
                    }
                }
            }
            if (3 < nargout)
            {
                // D
                n = ROWS(X);
                m = matrix(n, k, O);
                ans.push(m);
                for (i=0; i<n; ++i)
                {
                    for (j=0; j<k; ++j)
                    {
                        m[i][j] = await dist(X[i], C[j]);
                    }
                }
            }
        }
        return ans;
        })();
    }
    else
    {
        ans = kmeans(X, k, dist, init, max_iter);
        idx = ans[0]; C = ans[1];
        ans[0] = ans[0].map(function(idx) {return idx+1;});
        if (1 === nargout)
        {
            ans = ans[0];
        }
        else if (2 < nargout)
        {
            // sumd
            n = idx.length;
            m = array(k, O);
            ans.push(m);
            for (j=0; j<k; ++j)
            {
                for (i=0; i<n; ++i)
                {
                    if (idx[i] === j)
                    {
                        m[j] = scalar_add(m[j], dist(X[i], C[j]));
                    }
                }
            }
            if (3 < nargout)
            {
                // D
                n = ROWS(X);
                m = matrix(n, k, O);
                ans.push(m);
                for (i=0; i<n; ++i)
                {
                    for (j=0; j<k; ++j)
                    {
                        m[i][j] = dist(X[i], C[j]);
                    }
                }
            }
        }
        return ans;
    }
}, {
   Start: "plus",
   Distance: "sqeuclidean",
   MaxIter: 100
}));