function confusionmat(actual, predicted, order, nargout)
{
    if (!is_array(actual) || !is_array(predicted)) not_supported("confusionmat");
    nargout = nargout || 1;
    actual = colon(actual);
    predicted = colon(predicted);
    order = order || sort(
        actual.concat(predicted)
        .filter(function(v) {
            return (null != v) && (is_string(v) || (is_num(v) && !is_nan(v)));
        })
        .reduce(function(_, v) {
            var k = String(v);
            if (!HAS.call(_.h, k))
            {
                _.h[k] = 1;
                _.v.push(v);
            }
            return _;
        }, {h:{},v:[]})
        .v
    );
    var o = order.map(function(v) {return String(v);}),
        ga = actual.map(function(v) {return String(v);}),
        gp = predicted.map(function(v) {return String(v);}),
        mat = matrix(order.length, order.length, function(i, j) {
            return ga.reduce(function(s, v, iv) {
                if (v === o[i])
                {
                    var vp = predicted[iv];
                    if ((null != vp) && (is_string(vp) || !is_nan(vp)) && (o[j] === gp[iv])) ++s;
                }
                return s;
            }, 0);
        })
    ;
    return 1 < nargout ? [mat, order] : mat;
}
fn.confusionmat = varargout(function(nargout, actual, predicted) {
    return confusionmat(actual, predicted, "Order" === arguments[3] ? arguments[4] : null, nargout);
});