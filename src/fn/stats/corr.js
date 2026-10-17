fn.corr = varargout(namevalueargs(function(nargout, X) {
    if (1 < nargout) throw "corr: only one output is supported";
    if (is_scalar(X)) X = [[X]];
    if (!is_matrix(X)) not_supported("corr");
    var nv = arguments[arguments.length-1],
        Y = (2 < arguments.length) && is_array(arguments[2]) ? arguments[2] : X,
        corrfunc = pearson, promises = [], ans;
    if (!is_matrix(Y) || (ROWS(X) !== ROWS(Y))) not_supported("corr");
    if (is_callable(nv.Type))
    {
        corrfunc = nv.Type;
    }
    else
    {
        switch (nv.Type)
        {
            case "CramerV":
            corrfunc = _(nv.CorrectBias) ? function(a, b) {return cramer_v(a, b, 'correctbias');} : function(a, b) {return cramer_v(a, b);};
            break;
            case "Spearman":
            corrfunc = spearman;
            break;
            case "Kendall":
            corrfunc = kendall;
            break;
            case "Pearson":
            default:
            corrfunc = pearson;
            break;
        }
    }
    ans = matrix(COLS(X), COLS(Y), function(i, j) {
        var c = corrfunc(COL(X, i), COL(Y, j));
        if (is_instance(c, Promise)) promises.push(c);
    });
    return promises.length ? Promise.all(promises).then(function() {return ans;}) : ans;
}, {
    Type: "Pearson",
    CorrectBias: 0
}));