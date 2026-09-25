function confusionmat(actual, predicted, order, nargout)
{
    // todo
}
fn.confusionmat = varargout(function(nargout, actual, predicted) {
    var order = null;
    if ('Order' === arguments[3]) order = arguments[4] || null;
    return confusionmat(actual, predicted, order, nargout);
});