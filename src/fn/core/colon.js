function colon(a, b, c)
{
    var ans, sz, i, n;
    if ((1 === arguments.length) && is_array(a))
    {
        // a(:)
        if (is_2d(a))
        {
            /*var rows = ROWS(a), cols = COLS(a), i, j, k;
            ans = new Array(cols*rows);
            for (k=0,j=0; j<cols; ++j)
            {
                for (i=0; i<rows; ++i)
                {
                    ans[k++] = a[i][j];
                }
            }
            return ans;*/
            sz = size(a);
            // use octave-compatible columnwise-ordering by permuting back and forth
            ans = tensorview(a, {shape:sz,ndarray:sz}).permute(array(sz.length, function(i) {return sz.length-1-i;})).toArray();
            if (a.$scilitecell$) ans = cellarray(ans, [ans.length]);
            return ans;
        }
        return a;
    }
    else
    {
        // a:b:c
        if ((null != c) && (null != b))
        {
            // three inputs
        }
        else if (null != b)
        {
            // two inputs
            c = b;
            b = I;
        }
        else
        {
            // one input
            c = a;
            b = I;
            a = I;
        }
        a = sca(a, true);
        b = sca(b, true);
        c = sca(c, true);
        n = stdMath.max(0, stdMath.floor(stdMath.abs(_(n_div(n_sub(c, a), b))))+1);
        if (n_gt(b, O) && n_le(a, c))
        {
            ans = new Array(n);
            for (i=0; n_le(a, c); a=n_add(a, b),++i) ans[i] = a;
            if (null == ans[n-1]) ans[n-1] = min([a, c]);
        }
        else if (n_lt(b, O) && n_ge(a, c))
        {
            ans = new Array(n);
            for (i=0; n_ge(a, c); a=n_add(a, b),++i) ans[i] = a;
            if (null == ans[n-1]) ans[n-1] = max([a, c]);
        }
        else
        {
            ans = [];
        }
        return ans;
    }
}
fn.colon = function(a, b, c) {
    if ((1 === arguments.length) && is_array(a))
    {
        // a(:)
        return vec2col(colon(a));
    }
    return colon.apply(null, arguments);
};
