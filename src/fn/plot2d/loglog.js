fn.loglog = function(/*..args*/) {
    var fig = figure().parse(arguments);
    fig.xscale = 'log';
    fig.yscale = 'log';
    return fig.data.length ? fig.render('plot', $_.createCanvas(700, 525)/*4:3*/) : null;
};
