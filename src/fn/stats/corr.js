fn.corr = varargout(function(nargout, X) {
    if (1 < nargout) throw "corr: only one output is supported";
    if (is_scalar(X)) X = [[X]];
    if (!is_matrix(X)) not_supported("corr");
    var i = 2, corrfunc = pearson, Y, promises = [], ans;
    if ((i < arguments.length) && is_array(arguments[i]))
    {
        Y = arguments[i];
        ++i;
    }
    else
    {
        Y = X;
    }
    if ((i < arguments.length) && ("Type" === arguments[i]))
    {
        if (is_callable(arguments[i+1]))
        {
            corrfunc = arguments[i+1];
        }
        else
        {
            switch (arguments[i+1])
            {
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
    }
    if (!is_matrix(Y) || (ROWS(X) !== ROWS(Y))) not_supported("corr");
    ans = matrix(COLS(X), COLS(Y), function(i, j) {
        var c = corrfunc(COL(X, i), COL(Y, j));
        if (is_instance(c, Promise)) promises.push(c);
    });
    return promises.length ? Promise.all(promises).then(function() {return ans;}) : ans;
});