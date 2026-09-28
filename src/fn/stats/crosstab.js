function crosstab(args, nargout)
{
    nargout = nargout || 1;
    args = args.map(function(arg) {return is_array(arg) ? colon(arg) : [arg];});
    if (args.length !== args.filter(function(arg) {return args[0].length === arg.length;}).length) throw "crosstab: inputs not of same length";
    var labels = cellarray(array(args.length, function(i) {
            return sort(args[i].reduce(function(_, v) {
                var k = String(v);
                if (!HAS.call(_.h, k))
                {
                    _.h[k] = 1;
                    _.v.push(v);
                }
                return _;
            }, {h:{},v:[]}).v);
        }), [args.length]),
        arg0 = args[0],
        tab = ndarray(labels.map(function(values) {return values.length;}), function(i) {
            return arg0.reduce(function(s, _, j) {
                for (var found=0,k=0,n=i.length; k<n; ++k)
                {
                    if (String(labels[k][i[k]]) !== String(args[k][j])) break;
                    ++found;
                }
                if (n === found) ++s;
                return s;
            }, 0);
        }),
        chi2 = 0, pvalue = 0 // todo
    ;
    return 1 < nargout ? [tab, chi2, pvalue, labels] : tab;
}
fn.crosstab = varargout(function(nargout /*..args*/) {
    return crosstab([].slice.call(arguments, 1), nargout);
});