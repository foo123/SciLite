function length(x)
{
    if (is_array(x)) return x.length ? stdMath.max.apply(null, size(x)) : 0;
    return null == x ? 0 : 1;
}
fn.length = length;
