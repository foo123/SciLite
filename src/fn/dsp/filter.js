function filter(b, a, x/*, zi, dim*/)
{
    // adapted from https://github.com/foo123/FILTER.js
    var nx = x.length,
        na = a.length,
        nb = b.length,
        y = new Array(nx),
        n, k, m, yn,
        a0 = a[0], O = __(0);

    a = a.map(function(ai) {return scalar_div(ai, a0);});
    b = b.map(function(bi) {return scalar_div(bi, a0);});

    /*
     ‘filter’ returns the solution to the following linear,
     time-invariant difference equation:

           N                   M
          SUM a(k+1) y(n-k) = SUM b(k+1) x(n-k)    for 1<=n<=length(x)
          k=0                 k=0

     where N=length(a)-1 and M=length(b)-1.  The result is calculated
     over the first non-singleton dimension of X or over DIM if
     supplied.

     An equivalent form of the equation is:

                    N                   M
          y(n) = - SUM c(k+1) y(n-k) + SUM d(k+1) x(n-k)  for 1<=n<=length(x)
                   k=1                 k=0

     where c = a/a(1) and d = b/a(1).
    */
    for (n=0; n<nx; ++n)
    {
        yn = O;
        for (m=n,k=0; m>=0 && k<nb; ++k,--m)
        {
            yn = scalar_add(yn, scalar_mul(b[k], x[m]));
        }
        for (m=n-1,k=1; m>=0 && k<na; ++k,--m)
        {
            yn = scalar_sub(yn, scalar_mul(a[k], y[m]));
        }
        y[n] = yn;
    }
    return y;
}
fn.filter = function(b, a, x, zi, dim) {
    b = vec(b);
    a = vec(a);
    x = vec(x);
    if (!is_vector(b) || !is_vector(a) || !is_vector(x)) not_supported("filter");
    return filter(b, a, x);
};
