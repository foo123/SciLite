function bitshift(x, k)
{
    return apply(function(x) {return is_int(x) ? (n_lt(k, O) ? (_(x) >> (-_(k))) : (_(x) << _(k))) : x}, x, true);
}
fn.bitshift = bitshift;
function bitand(x, y)
{
    if (is_int(x))
    {
        if (is_int(y)) return _(x) & _(y);
        else if (is_array(y)) return y.map(function(yi) {return bitand(x, yi);});
    }
    else if (is_array(x))
    {
        if (is_int(y)) return x.map(function(xi) {return bitand(xi, y);});
        else if (is_array(y) && (x.length === y.length)) return x.map(function(xi, i) {return bitand(xi, y[i]);});
    }
    return 0;
}
fn.bitand = bitand;
function bitor(x, y)
{
    if (is_int(x))
    {
        if (is_int(y)) return _(x) | _(y);
        else if (is_array(y)) return y.map(function(yi) {return bitor(x, yi);});
    }
    else if (is_array(x))
    {
        if (is_int(y)) return x.map(function(xi) {return bitor(xi, y);});
        else if (is_array(y) && (x.length === y.length)) return x.map(function(xi, i) {return bitor(xi, y[i]);});
    }
    return 0;
}
fn.bitor = bitor;
function bitxor(x, y)
{
    if (is_int(x))
    {
        if (is_int(y)) return _(x) ^ _(y);
        else if (is_array(y)) return y.map(function(yi) {return bitxor(x, yi);});
    }
    else if (is_array(x))
    {
        if (is_int(y)) return x.map(function(xi) {return bitxor(xi, y);});
        else if (is_array(y) && (x.length === y.length)) return x.map(function(xi, i) {return bitxor(xi, y[i]);});
    }
    return 0;
}
fn.bitxor = bitxor;
