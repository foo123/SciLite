fn.corr = varargout(function(nargout, X) {
    if (1 < nargout) throw "corr: only one output is supported";
    if (is_scalar(X)) X = [[X]];
    if (!is_matrix(X)) not_supported("corr");
    var i = 2, corrfunc = pearson, Y;
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
    if (!is_matrix(Y) || (ROWS(X) !== ROWS(Y))) not_supported("corr");
    return matrix(COLS(X), COLS(Y), function(i, j) {
        return corrfunc(COL(X, i), COL(Y, j));
    });
});