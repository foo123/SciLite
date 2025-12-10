function real(x)
{
    return apply(function(x) {return is_complex(x) ? x.re : x;}, x, true);
}
fn.real = real;
