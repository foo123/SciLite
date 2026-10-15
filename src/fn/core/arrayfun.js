/*function arrayfun(fn, arrays, nargout)
{
    nargout = nargout || 1;
    var arr = arrays.reduce(function(arr, a) {return arr ? arr : (is_array(a) ? a : arr);}, null),
        sz = is_array(arr) /*&& !arrays[0].$scilitecell$* / ? (is_1d(arr) ? [arr.length] : size(arr)) : [], output, promises = [], type, res;

    if (arrays.length !== arrays.filter(function(arr) {return !is_array(arr) /*&& !arr.$scilitecell$* / || arr_eq(sz, is_1d(arr) ? [arr.length] : size(arr));}).length) not_supported("arrayfun");

    arrays = arrays.map(function(arr) {return is_array(arr) ? tensorview(arr, {shape:sz, ndarray:sz}) : arr;});
    output = array(nargout, sz.length ? function() {return tensorview(ndarray(sz, null), {shape:sz, ndarray:sz});} : null);
    type = array(nargout, "");

    if ((1 < nargout) && is_callable(fn.nargout)) fn = fn.nargout(nargout);

    function set(i, res)
    {
        if ((1 < nargout) && is_array(res))
        {
            res = vec(res);
            output.forEach(function(outj, j) {
                if (j >= res.length) return;
                if (i)
                {
                    outj.set(i, check_type(type, j, res[j]));
                }
                else
                {
                    output[j] = res[j];
                }
            });
        }
        else if (i)
        {
            output[0].set(i, check_type(type, 0, res));
        }
        else
        {
            output[0] = res;
        }
        return res;
    }
    function ret()
    {
        return sz.length ? (1 < nargout ? output.map(function(out, j) {return "c" === type[j] ? cellarray(out.toNDArray(), sz.slice()) : (out.toNDArray());}) : (arr ? ("c" === type[0] ? cellarray(output[0].toNDArray(), sz.slice()) : (output[0].toNDArray())) : (output[0].get([0])))) : (1 < nargout ? output : (output[0]));
    }

    if (sz.length)
    {
        ndarray.indices(sz, function(i) {
            var res = fn.apply(null, arrays.map(function(arr) {return is_instance(arr, tensorview) ? arr.get(i) : arr;}));
            if (is_instance(res, Promise))
            {
                promises.push(res.then((function(i) {return function(res) {return set(i, res);};})(i.slice())));
            }
            else
            {
                set(i, res);
            }
        });
    }
    else
    {
        res = fn.apply(null, arrays);
        if (is_instance(res, Promise))
        {
            promises.push(res.then(function(res) {return set(null, res);}));
        }
        else
        {
            set(null, res);
        }
    }
    return promises.length ? Promise.all(promises).then(ret) : ret();
}*/
fn.arrayfun = varargout(function(nargout, fn/*..arrays*/) {
    if (!is_callable(fn) || (3 > arguments.length)) not_supported("arrayfun");
    //return arrayfun(fn, [].slice.call(arguments, 2), nargout);
    if ((1 < nargout) && is_callable(fn.nargout)) fn = fn.nargout(nargout);
    return apply_(fn, [].slice.call(arguments, 2), null, nargout);
});
