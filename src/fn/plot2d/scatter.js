fn.scatter = function(/*..args*/) {
    var fig = figure().parse(arguments);
    fig.xscale = 'linear';
    fig.yscale = 'linear';
    return fig.data.length ? fig.render('scatter', $_.createCanvas(700, 525)/*4:3*/) : null;
};
