function ndgrid(nargout, x)
{
    x = x.map(function(xi) {return vec(xi);});
    var k, ans = [],
        dims = array(nargout, function(i) {
            return (1 === x.length ? x[0] : x[i]).length;
        })
    ;
    for (k=0; k<nargout; ++k)
    {
        ans.push(ndarray(dims, function(i) {
            return (1 === x.length ? x[0] : x[k])[i[k]];
        }));
    }
    return 1 === nargout ? ans[0] : ans;
}
fn.ndgrid = varargout(function(nargout) {
    return ndgrid(nargout, [].slice.call(arguments, 1));
});
