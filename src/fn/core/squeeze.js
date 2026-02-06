function squeeze(x, dim)
{
    if (is_array(x))
    {
        if (null == dim) dim = 1;
        if ((1 === x.length) && (2 < dim))
        {
            // squeeze only higher dimensions than 2
            return squeeze(x[0], dim+1);
        }
        else
        {
            return x.map(function(xi) {
                return squeeze(xi, dim+1);
            });
        }
    }
    else
    {
        return x;
    }
}
fn.squeeze = function(x) {
    return is_nd(x) ? squeeze(x) : x;
};
