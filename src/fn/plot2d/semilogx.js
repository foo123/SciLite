fn.semilogx = function(/*..args*/) {
    var fig = figure().parse(arguments);
    fig.xscale = 'log';
    fig.yscale = 'linear';
    return fig.data.length ? fig.render('plot', $_.createCanvas(700, 525)/*4:3*/) : null;
};
