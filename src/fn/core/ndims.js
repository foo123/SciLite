function ndims(x)
{
    return (2 + size(x).slice(2).filter(function(d) {return 1 < d;}).length);
}
fn.ndims = ndims;
