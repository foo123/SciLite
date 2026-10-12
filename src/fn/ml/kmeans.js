async function kmeans(X, k, C, D, max_iter, speedup)
{
    // https://en.wikipedia.org/wiki/K-means_clustering
    // Lloyd's algorithm with triangle speedup heuristic

    var n = ROWS(X), p = COLS(X), iter,
        i, ci, idx, centroids_changed;

    idx = await Promise.all(X.map(function(Xi) {return closest_cluster(Xi, C, D, speedup);})).then(function(c) {return c[0];});
    C = compute_centroids(X, k, idx);

    for (iter=1; iter<=max_iter; ++iter)
    {
        // Assign each point to the nearest centroid
        centroids_changed = 0;
        for (i=0; i<n; ++i)
        {
            ci = (await closest_cluster(X[i], C, D, speedup))[0];
            if (idx[i] !== ci) ++centroids_changed;
            idx[i] = ci;
        }

        // Check for convergence
        if (0 === centroids_changed)
        {
            break; // converged
        }
        else
        {
            // Recalculate centroids
            C = compute_centroids(X, k, idx);
        }
    }
    return [idx, C];
}
async function closest_cluster(x, C, D, speedup)
{
    var k = C.length, i, d, idx = 0, min = inf;
    for (i=0; i<k; ++i)
    {
        if (!C[i] || !C[i].length) continue;
        d = await D(x, C[i]);
        if (n_lt(d, min))
        {
            min = d;
            idx = i;
        }
    }
    return [idx, min];
}
function compute_centroid(cluster)
{
    return cluster.length ? mean(cluster) : cluster;
}
function compute_centroids(X, k, idx)
{
    return array(k, function(cluster_index) {
        return compute_centroid(idx.reduce(function(cluster, index, i) {
            if (index === cluster_index) cluster.push(X[i]);
            return cluster;
        }, []));
    });
}
function kmeans_init_forgy(X, k, dist, speedup)
{
    X = X.slice();
    return array(k, function(cluster) {
        var i = X.length ? stdMath.round(stdMath.random()*(X.length-1)) : -1;
        return -1 < i ? X.splice(i, 1)[0] : [];
    });
}
function kmeans_init_random_partition(X, k, dist, speedup)
{
    var n = X.length;
    return shuffle(X.slice()).reduce(function(clusters, xi) {
        if (!clusters.length) clusters.push([xi]);
        else if (clusters[clusters.length-1].length+1 > n/k) clusters.push([xi]);
        else clusters[clusters.length-1].push(xi);
        return clusters;
    }, []).map(compute_centroid);
}
async function kmeans_init_plusplus(X, k, dist, speedup)
{
    // https://en.wikipedia.org/wiki/K-means%2B%2B
    // Initialize list of centroids with one randomly selected point
    var n = X.length,
        centroids = [X[stdMath.round(stdMath.random()*(n-1))]],
        D2 = new Array(n), d, i, total, thresh, cum;

    // Choose remaining k - 1 centroids
    while (centroids.length < k)
    {
        // For each point, compute squared distance to nearest selected centroid
        total = O;
        for (i=0; i<n; ++i)
        {
            d = (await closest_cluster(X[i], centroids, dist, speedup))[1];
            D2[i] = scalar_abs(scalar_mul(d, scalar_conj(d)));
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
fn.kmeans = varargout(async function(nargout, X, k) {
    var i = 3, j, n, m,
        init = kmeans_init_plusplus,
        dist = d_sqeuclidean,
        max_iter = 100,
        speedup = false,
        ans;
    if (!is_matrix(X)) not_supported("kmeans");
    while (i < arguments.length)
    {
        if ("Start" === arguments[i])
        {
            if (is_matrix(arguments[i+1]))
            {
                init = arguments[i+1];
                if (COLS(init) !== COLS(X)) throw "kmeans: centroids and input must have same number of columns";
                k = ROWS(init);
            }
            else
            {
                switch (arguments[i+1])
                {
                    case "cluster":
                    // not used
                    break;
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
        }
        else if ("Distance" === arguments[i])
        {
            if (is_callable(arguments[i+1]))
            {
                dist = arguments[i+1];
            }
            else
            {
                switch (arguments[i+1])
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
        }
        else if ("MaxIter" === arguments[i])
        {
            max_iter = stdMath.ceil(stdMath.abs(_(sca(arguments[i+1], true))));
        }
        i += 2;
    }
    ans = await kmeans(X, k, is_matrix(init) ? init : await init(X, k, dist, speedup), dist, max_iter, speedup);
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
});