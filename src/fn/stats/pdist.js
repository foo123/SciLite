fn.pdist = function(X) {
    var dist = d_euclidean, m, p;
    if (is_vector(X)) X = vec2col(X);
    if (!is_matrix(X)) not_supported("pdist");
    if (1 < arguments.length)
    {
        switch (arguments[1])
        {
            case "fasteuclidean":
            case "euclidean":
            dist = d_euclidean;
            break;
            case "fastsquaredeuclidean":
            case "squaredeuclidean":
            dist = d_sqeuclidean;
            break;
            case "fastseuclidean":
            case "seuclidean":
            p = is_array(arguments[2]) ? vec(arguments[2]) : std(X);
            dist = function(a, b, i, j) {return d_seuclidean(a, b, p[i]);};
            break;
            case "mahalanobis":
            p = is_array(arguments[2]) ? arguments[2] : cov(ctranspose(X));
            p = inv(p);
            m = mean(ctranspose(X));
            dist = function(a, b, i, j) {return realMath.sqrt(d_mahalanobis(b, m, p));};
            break;
            case "cityblock":
            dist = d_cityblock;
            break;
            case "minkowski":
            p = is_scalar(arguments[2]) ? arguments[2] : two;
            dist = function(a, b, i, j) {return d_minkowski(a, b, p);};
            break;
            case "chebychev":
            dist = d_chebychev;
            break;
            case "cosine":
            dist = d_cosine;
            break;
            case "correlation":
            dist = d_correlation;
            break;
            case "hamming":
            dist = d_hamming;
            break;
            case "jaccard":
            dist = d_jaccard;
            break;
        }
    }
    var ans = [], n = COLS(X), i, j;
    for (i=0; i<n; ++i)
    {
        for (j=i+1; j<n; ++j)
        {
            ans.push(dist(COL(X, j), COL(X, i), j, i));
        }
    }
    return ans;
};
fn.pdist2 = function(X, Y) {
    var dist = d_euclidean, m, p;
    if (is_vector(X)) X = vec2col(X);
    if (is_vector(Y)) Y = vec2col(Y);
    if (!is_matrix(X) || !is_matrix(Y) || (ROWS(X) !== ROWS(Y))) not_supported("pdist2");
    if (2 < arguments.length)
    {
        switch (arguments[2])
        {
            case "fasteuclidean":
            case "euclidean":
            dist = d_euclidean;
            break;
            case "fastsquaredeuclidean":
            case "squaredeuclidean":
            dist = d_sqeuclidean;
            break;
            case "fastseuclidean":
            case "seuclidean":
            p = is_array(arguments[3]) ? vec(arguments[3]) : std(X);
            dist = function(a, b, i, j) {return d_seuclidean(a, b, p[i]);};
            break;
            case "mahalanobis":
            p = is_array(arguments[3]) ? arguments[3] : cov(ctranspose(X));
            p = inv(p);
            m = mean(ctranspose(X));
            dist = function(a, b, i, j) {return realMath.sqrt(d_mahalanobis(b, m, p));};
            break;
            case "cityblock":
            dist = d_cityblock;
            break;
            case "minkowski":
            p = is_scalar(arguments[3]) ? arguments[3] : two;
            dist = function(a, b, i, j) {return d_minkowski(a, b, p);};
            break;
            case "chebychev":
            dist = d_chebychev;
            break;
            case "cosine":
            dist = d_cosine;
            break;
            case "correlation":
            dist = d_correlation;
            break;
            case "hamming":
            dist = d_hamming;
            break;
            case "jaccard":
            dist = d_jaccard;
            break;
        }
    }
    return matrix(COLS(X), COLS(Y), function(i, j, mat) {
        return i <= j ? dist(COL(X, i), COL(Y, j), i, j) : mat[j][i];
    });
};
fn.mahal = function(Y, X) {
    if (is_vector(X)) X = vec2col(X);
    if (is_vector(Y)) Y = vec2col(Y);
    if (!is_matrix(X) || !is_matrix(Y) || (ROWS(X) !== ROWS(Y))) not_supported("mahal");
    var Xt = ctranspose(X), invCov = inv(cov(Xt)), mu = mean(Xt);
    return matrix(COLS(Y), COLS(X), function(i, j, mat) {
        return i <= j ? d_mahalanobis(COL(Y, i), mu, invCov) : mat[j][i];
    });
};
