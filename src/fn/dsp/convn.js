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
        j0 = array(db, function(i) {return sb[i] >> 1;});
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
        var _, ki_ = ndarray.indices.split(j.map(function(ji, _) {return (j0[_]||0)+ji;}), sa, sb),
            ki, k, ak, i, bi, cj = O;
        for (;ki=ki_();)
        {
            for (k=ki[0],ak=a,_=0; _<da; ++_) ak = ak[k[_]];
            for (i=ki[1],bi=b,_=0; _<db; ++_) bi = bi[i[_]];
            cj = scalar_add(cj, scalar_mul(ak, bi));
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
