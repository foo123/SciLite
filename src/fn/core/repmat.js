function repmat(x)
{
    var n = [].slice.call(arguments, 1), sz = size(x);
    if (is_array(n[0])) n = n[0];
    n = n.map(_);
    if (1 === n.length) n = array(sz.length, n[0]);
    if (!is_array(x) || (sz.length === n.length))
    {
        return ndarray(is_array(x) ? n.map(function(ni, i) {return sz[i]*ni;}) : n, function(indices) {
            return indices.reduce(function(arr, index, dim) {
                return is_array(arr) ? arr[index % n[dim]] : arr;
            }, x);
        });
    }
    /*if (is_0d(x)) x = [[x]];
    if (is_1d(x)) x = [x];
    if (is_2d(x))
    {
        var rows = nr*ROWS(x), cols = nc*COLS(x);
        return matrix(rows, cols, function(i, j) {
            return x[i % nr][j % nc];
        });
   }*/
   return x;
}
fn.repmat = repmat;
