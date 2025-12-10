function all(x, check)
{
    if (is_scalar(x))
    {
        return check(x, 1, 1) ? 1 : 0;
    }
    else if (is_vector(x))
    {
        for (var i=0,n=x.length; i<n; ++i)
        {
            if (!check(x[i], i+1, 1)) return 0;
        }
        return 1;
    }
    else if (is_matrix(x))
    {
        for (var i=0,rows=ROWS(x),cols=COLS(x); i<rows; ++i)
        {
            for (var j=0; j<cols; ++j)
            {
                if (!check(x[i][j], i+1, j+1)) return 0;
            }
        }
        return 1;
    }
    return 0;
}
$_.all = all;
fn.all = function(x) {
    return all(x, function(x) {return !eq(x, 0);});
};
