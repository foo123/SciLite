function sub2ind(dims, i, j)
{
    if (is_vector(i))
    {
        j = i[1];
        i = i[0];
    }
    i = _(i); j = _(j);
    return 1 === dims.length ? i : ((i-1)+_(dims[0])*(j-1)+1);
}
fn.sub2ind = sub2ind;
function ind2sub(dims, ind)
{
    ind = _(ind);
    return 1 === dims.length ? [ind, 1] : [((ind-1) % _(dims[0])) + 1, stdMath.floor((ind-1) / _(dims[0])) + 1];
}
fn.ind2sub = ind2sub;
