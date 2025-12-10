function length(x)
{
    if (is_array(x)) return stdMath.max.apply(null, size(x));
    return null == x ? 0 : 1;
}
fn.length = length;
