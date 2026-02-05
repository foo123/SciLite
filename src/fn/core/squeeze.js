function squeeze(x)
{
    if (is_array(x))
    {
        return 1 === x.length ? squeeze(x[0]) : array(x.length, function(i) {return squeeze(x[i]);});
    }
    else
    {
        return x;
    }
}
fn.squeeze = function(x) {
    return is_nd(x) ? squeeze(x) : x;
};
