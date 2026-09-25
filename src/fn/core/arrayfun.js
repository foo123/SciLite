function arrayfun(fn, arrays, nargout)
{
    nargout = nargout || 1;
    var sz = is_array(arrays[0]) && !arrays[0].$scilitecell$ ? (is_1d(arrays[0]) ? [arrays[0].length] : size(arrays[0])) : [], output, promises = [];

    if (arrays.length !== arrays.filter(function(arr) {return is_array(arr) && !arr.$scilitecell$ && arr_eq(sz, is_1d(arr) ? [arr.length] : size(arr));}).length) not_supported("arrayfun");

    arrays = arrays.map(function(arr) {return tensorview(arr, {shape:sz, ndarray:sz});});
    output = array(nargout, function() {return tensorview(ndarray(sz, null), {shape:sz, ndarray:sz});});
    ndarray.indices(sz, function(i) {
        var res = fn.apply(null, arrays.map(function(arr) {return arr.get(i.slice());}));
        if (res instanceof Promise)
        {
            promises.push(res.then((function(i) {return function(res) {
                if (is_1d(res))
                {
                    output.forEach(function(outj, j) {
                       if (j >= res.length) return;
                       outj.set(i.slice(), res[j]);
                    });
                }
                else
                {
                    output[0].set(i, res);
                }
            }})(i.slice())));
        }
        else
        {
            if (is_1d(res))
            {
                output.forEach(function(outj, j) {
                   if (j >= res.length) return;
                   outj.set(i.slice(), res[j]);
                });
            }
            else
            {
                output[0].set(i.slice(), res);
            }
        }
    });
    function ret()
    {
        return 1 < nargout ? output.map(function(out) {return out.toNDArray();}) : (output[0].toNDArray());
    }
    return promises.length ? Promise.all(promises).then(ret) : ret();
}
fn.arrayfun = varargout(async function(nargout, fn/*..arrays*/) {
    if (!is_callable(fn) || (3 > arguments.length)) not_supported("arrayfun");
    return await arrayfun(fn, [].slice.call(arguments, 2), nargout);
});
