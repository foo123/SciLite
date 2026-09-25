function arrayfun(fn, arrays, nargout)
{
    nargout = nargout || 1;
    var sz = is_array(arrays[0]) /*&& !arrays[0].$scilitecell$*/ ? (is_1d(arrays[0]) ? [arrays[0].length] : size(arrays[0])) : [], output, promises = [], type;

    if (arrays.length !== arrays.filter(function(arr) {return is_array(arr) /*&& !arr.$scilitecell$*/ && arr_eq(sz, is_1d(arr) ? [arr.length] : size(arr));}).length) not_supported("arrayfun");

    arrays = arrays.map(function(arr) {return tensorview(arr, {shape:sz, ndarray:sz});});
    output = array(nargout, function() {return tensorview(ndarray(sz, null), {shape:sz, ndarray:sz});});
    type = array(nargout, "");
    if ((1 < nargout) && is_callable(fn.nargout) fn = fn.nargout(nargout);
    function check_type(j, resj)
    {
       var typej = type[j];
       if ("c" !== typej)
       {
           if (is_array(resj)) type[j] = "c";
           else if (is_string(resj)) type[j] = "" === typej || "s" === typej ? "s" : "c";
           else if (is_scalar(resj)) type[j] = "" === typej || "n" === typej ? "n" : "c";
           else type[j] = "c";
       }
       return resj;
    }
    function ret()
    {
        return 1 < nargout ? output.map(function(out, j) {return "c" === type[j] ? cellarray(out.toNDArray(), out.shape()) : (out.toNDArray());}) : ("c" === type[0] ? cellarray(output[0].toNDArray(), output[0].shape()) : (output[0].toNDArray()));
    }
    ndarray.indices(sz, function(i) {
        var res = fn.apply(null, arrays.map(function(arr) {return arr.get(i);}));
        if (res instanceof Promise)
        {
            promises.push(res.then((function(i) {return function(res) {
                if (res && res.$scilitevarargout$)
                {
                    output.forEach(function(outj, j) {
                       if (j >= res.length) return;
                       outj.set(i, check_type(j, res[j]));
                    });
                }
                else
                {
                    output[0].set(i, check_type(0, res));
                }
            }})(i.slice())));
        }
        else
        {
            if (res && res.$scilitevarargout$)
            {
                output.forEach(function(outj, j) {
                   if (j >= res.length) return;
                   outj.set(i, check_type(j, res[j]));
                });
            }
            else
            {
                output[0].set(i, check_type(0, res));
            }
        }
    });
    return promises.length ? Promise.all(promises).then(ret) : ret();
}
fn.arrayfun = varargout(function(nargout, fn/*..arrays*/) {
    if (!is_callable(fn) || (3 > arguments.length)) not_supported("arrayfun");
    return arrayfun(fn, [].slice.call(arguments, 2), nargout);
});
