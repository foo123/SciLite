fn.xlabel = function(text) {
    var fig = figure();
    fig.xlabel = String(text);
    return fig.render('xlabel', $_.currentCanvas());
};
fn.ylabel = function(text) {
    var fig = figure();
    fig.ylabel = String(text);
    return fig.render('ylabel', $_.currentCanvas());
};
fn.zlabel = nop;
fn.title = function(text) {
    var fig = figure();
    fig.title = String(text);
    return fig.render('title', $_.currentCanvas());
};
