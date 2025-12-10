function repelem(x, n)
{
    if (is_vector(x))
    {
        if (is_vector(n))
        {
            if (n.length === x.length)
            {
                var cnt = 0, i = -1;
                return array(_(sum(n)), function(j) {
                    if (j === cnt) {++i; cnt += _(n[i]);}
                    return x[i];
                });
            }
        }
        else if (is_int(n))
        {
            n = _(n);
            var i = -1;
            return array(n*x.length, function(j) {
                if (0 === (j % n)) ++i;
                return x[i];
            });
        }
    }
    return x;
}
fn.repelem = repelem;
