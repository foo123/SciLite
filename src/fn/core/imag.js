function imag(x)
{
    return apply(function(x) {return is_complex(x) ? x.im : 0;}, x, true);
}
fn.imag = imag;
