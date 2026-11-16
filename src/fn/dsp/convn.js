function convn(a, b, shape)
{
    var sa = size(a), da = sa.length,
        sb = size(b), db = sb.length,
        sc, j0;

    if ("valid" === shape)
    {
        // non zero-padded part
        sc = array(da, function(i) {
            if (!sb[i]) return sa[i];
            return stdMath.max(0, sa[i]-sb[i]+1);
        });
        j0 = array(db, function(i) {return sb[i];});
    }
    else if ("same" === shape)
    {
        // central part
        sc = sa.slice();
        j0 = array(db, function(i) {return sb[i] >> 1;});
    }
    else
    {
        // full
        sc = array(stdMath.max(da, db), function(i) {
            var sai = null == sa[i] ? 1 : sa[i], sbi = null == sb[i] ? 1 : sb[i];
            return sai+sbi-1;
        });
        j0 = array(db, 0);
    }
    return ndarray(sc, function(j) {
        var _, k_ = ndarray.indices(array(da, function(_) {return stdMath.min((j0[_]||0)+j[_]+1, sa[_]);})),
            k, ak, i, bi, cj = O, in_range;
        for (;k=k_();)
        {
            in_range = 1;
            for (bi=b,_=0; _<db; ++_)
            {
                i = j0[_] + (j[_] || 0) - (k[_] || 0);
                if ((0 <= i) && (i < sb[_]))
                {
                    bi = bi[i];
                }
                else
                {
                    in_range = 0;
                    break;
                }
            }
            if (in_range)
            {
                for (ak=a,_=0; _<da; ++_) ak = ak[k[_]];
                cj = scalar_add(cj, scalar_mul(ak, bi));
            }
        }
        return cj;
    });
}
fn.convn = function(a, b, shape) {
    if (is_scalar(a) || is_scalar(b))
    {
        return dotmul(a, b);
    }
    else if (is_array(a) && is_array(b))
    {
        return convn(is_1d(a) ? [a] : a, is_1d(b) ? [b] : b, shape);
    }
    not_supported("convn");
};
