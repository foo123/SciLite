function colon(a, b, c)
{
    var ans;
    if (1 === arguments.length)
    {
        // a(:)
        if (is_2d(a))
        {
            var rows = ROWS(a), cols = COLS(a), i, j, k;
            ans = new Array(cols*rows);
            for (k=0,j=0; j<cols; ++j)
            {
                for (i=0; i<rows; ++i)
                {
                    ans[k++] = a[i][j];
                }
            }
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
            b = 1;
        }
        else
        {
            // one input
            c = a;
            b = 1;
            a = 1;
        }
        a = sca(a, true);
        b = sca(b, true);
        c = sca(c, true);
        ans = [];
        if (n_gt(b, 0))
        {
            for (; n_le(a, c); a=n_add(a, b)) ans.push(a);
        }
        else if (n_lt(b, 0))
        {
            for (; n_ge(a, c); a=n_add(a, b)) ans.push(a);
        }
        return ans;
    }
}
fn.colon = colon;
