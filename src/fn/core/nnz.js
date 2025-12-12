function nnz(x)
{
    if (is_array(x)) return x.reduce(function(nz, xi) {return n_add(nz, nnz(xi));}, O);
    if (is_num(x)) return n_eq(O, x) ? O : I;
    if (is_complex(x)) return n_eq(O, x.re) && n_eq(O, x.im) ? O : I;
    return O;
}
fn.nnz = nnz;
