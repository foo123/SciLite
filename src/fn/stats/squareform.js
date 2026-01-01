fn.squareform = function(d, output) {
    var ans, n, m, i, j, k;
    d = vec(d);
    if (is_vector(d) || ('tomatrix' === output))
    {
        if (is_scalar(d)) d = [d];
        else if (is_matrix(d)) return d;
        n = d.length;
        m = stdMath.round(((stdMath.sqrt(1 + 8*n)) + 1)/2);
        ans = matrix(m, m, O);
        for (k=0,i=0; i<m; ++i)
        {
            for (j=i+1; j<m; ++j)
            {
                ans[j][i] = d[k++];
                ans[i][j] = ans[j][i];
            }
        }
    }
    else if (is_matrix(d) || ('tovector' === output))
    {
        if (is_scalar(d)) d = [[O, d], [d, O]];
        else if (is_vector(d)) return d;
        n = ROWS(d);
        ans = [];
        for (i=0; i<n; ++i)
        {
            for (j=i+1; j<n; ++j)
            {
                ans.push(d[j][i]);
            }
        }
    }
    return ans;
};