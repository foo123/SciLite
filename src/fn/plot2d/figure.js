// plotting functions
figure.prototype.render = function(type, canvas) {
    var self = this;
    if (canvas)
    {
        self.canvas = canvas;
        self.type = type;
        if ((-1 < ['plot','scatter','bar','barh','pie'].indexOf(type)) && self.data && self.data.length)
        {
            self.renderData();
        }
        if (('xlabel' === type) && self.xlabel && self.xlabel.length)
        {
            self.renderXLabel();
        }
        if (('ylabel' === type) && self.ylabel && self.ylabel.length)
        {
            self.renderYLabel();
        }
        if (('title' === type) && self.title && self.title.length)
        {
            self.renderTitle();
        }
        self.canvas = null;
    }
    return canvas;
};
figure.prototype.renderData = function() {
    var self = this,
        c = self.canvas.getContext('2d'),
        type = self.type,
        w = self.canvas.width,
        h = self.canvas.height,
        size = 0, n, rows, cols,
        m = self.data.length;

    if (-1 === (['pie']).indexOf(type))
    {
        self.renderAxes();
        n = self.no;
    }
    if ('bar' === type)
    {
        size = stdMath.max(1, stdMath.floor((w - self.pl - self.pr) / (n*m)));
    }
    else if ('barh' === type)
    {
        size = stdMath.max(1, stdMath.floor((h - self.pt - self.pb) / (n*m)));
    }
    else if ('pie' === type)
    {
        if ((1 < m) && (m & 1)) m  = m+1;
        rows = stdMath.floor(stdMath.sqrt(m));
        cols = m / rows;
        size = stdMath.min((w - self.pl - self.pr)/cols, (h - self.pt - self.pb)/rows);
    }
    self.data.forEach(function(data, index) {
        var x = data.x, y = data.y, style = data.style, i;
        if ('plot' === type)
        {
            c.beginPath();
            c.lineWidth = style.LineWidth;
            c.setLineDash(style.LineStyle);
            c.strokeStyle = 'rgb('+style.Color.map(function(col) {return stdMath.round(255*col);}).join(',')+')';
            c.lineJoin = "bevel";
            c.moveTo(self.x(x[0]), self.y(y[0]));
            for (i=1; i<n; ++i)
            {
                c.lineTo(self.x(x[i]), self.y(y[i]));
            }
            c.stroke();
        }
        else if ('scatter' === type)
        {
            c.fillStyle = 'rgb('+style.Color.map(function(col) {return stdMath.round(255*col);}).join(',')+')';
            for (i=0; i<n; ++i)
            {
                c.beginPath();
                c.arc(self.x(x[i]), self.y(y[i]), 2*style.LineWidth, 0, 2 * pi);
                c.closePath();
                c.fill();
            }
        }
        else if ('bar' === type)
        {
            c.fillStyle = 'rgb('+style.Color.map(function(col) {return stdMath.round(255*col);}).join(',')+')';
            for (i=0; i<n; ++i)
            {
                c.fillRect(self.pl+index*size*0.8+i*m*size, self.y(0) > self.y(y[i]) ? self.y(y[i]) : self.y(0), size*0.8, stdMath.abs(self.y(y[i])-self.y(0)));
            }
        }
        else if ('barh' === type)
        {
            c.fillStyle = 'rgb('+style.Color.map(function(col) {return stdMath.round(255*col);}).join(',')+')';
            for (i=0; i<n; ++i)
            {
                c.fillRect(self.y(0) > self.y(y[i]) ? self.y(y[i]) : self.y(0), self.pt+index*size*0.8+i*m*size, stdMath.abs(self.y(y[i])-self.y(0)), size*0.8);
            }
        }
        else if ('pie' === type)
        {
            var total = sum(abs(y)),
                r = size*0.4,
                a0 = -pi/2, a1, p,
                col = index % cols,
                row = stdMath.floor(index / cols),
                cx = (w-cols*size)/2+col*size+size/2,
                cy = (h-rows*size)/2+row*size+size/2;
            for (i=0,n=y.length; i<n; ++i)
            {
                p = y[i]/total;
                a1 = a0 + 2*pi*p;
                c.beginPath();
                c.moveTo(cx, cy);
                c.arc(cx, cy, r, a0, a1, false);
                c.closePath();
                c.fillStyle = $.PALETTE[i % $.PALETTE.length];
                c.fill();
                c.font = '10 px sans-serif';
                c.textAlign = 'center';
                c.fillStyle = '#000';
                c.strokeStyle = '#000';
                c.fillText((100*p).toFixed(2)+'%', cx+(r+22)*stdMath.cos((a0+a1)/2), cy+(r+22)*stdMath.sin((a0+a1)/2));
                a0 = a1;
            }
        }
    });
};
figure.prototype.renderXLabel = function() {
    var self = this,
        c = self.canvas.getContext('2d'),
        w = self.canvas.width,
        h = self.canvas.height,
        fontSize = 15;

    c.font = String(fontSize) + 'px sans-serif';
    c.fillStyle = '#000';
    c.textAlign = 'center';
    c.strokeStyle = '#000';
    c.fillText(self.xlabel, w/2, h-1-self.pb/4)
};
figure.prototype.renderYLabel = function() {
    var self = this,
        c = self.canvas.getContext('2d'),
        w = self.canvas.width,
        h = self.canvas.height,
        fontSize = 15;

    c.font = String(fontSize) + 'px sans-serif';
    c.fillStyle = '#000';
    c.textAlign = 'center';
    c.strokeStyle = '#000';
    //Rotate the context and render the text
    c.save();
    c.translate(1.3*fontSize, h/2);
    c.rotate(-stdMath.PI/2);
    c.fillText(self.ylabel, 0, 0);
    c.restore();
};
figure.prototype.renderTitle = function() {
    var self = this,
        c = self.canvas.getContext('2d'),
        w = self.canvas.width,
        h = self.canvas.height,
        fontSize = 18;

    c.font = String(fontSize) + 'px sans-serif';
    c.fillStyle = '#000';
    c.textAlign = 'center';
    c.strokeStyle = '#000';
    c.fillText(self.title, w/2, self.pt/2);
};
figure.prototype.renderAxes = function() {
    var self = this,
        c = self.canvas.getContext('2d'),
        w = self.canvas.width,
        h = self.canvas.height,
        type = self.type,
        xmin, xmax,
        ymin, ymax,
        xticks, yticks,
        xsize, ysize,
        i, ti, pi, step,
        fontSize = 10, bar;

    self.updateAxes();
    xmin = self.xmin;
    xmax = self.xmax;
    ymin = self.ymin;
    ymax = self.ymax;

    function round_(x, toInt)
    {
        return (false === toInt) || (x < 1) ? parseFloat(x.toFixed(4)) : stdMath.ceil(x);
    }
    function tick_(v)
    {
        return v.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    }
    if ('barh' === self.type)
    {
        step = stdMath.max(10+5*fontSize, round_((w - self.pl - self.pr) / 16));
        xticks = [];
        for (pi=self.pl;;pi+=step)
        {
            ti = self.y(pi, true);
            if (/*ti > ymax*/pi > w-1-self.pr) break;
            xticks.push({t:ti, p:pi});
        }
        //if (xticks[xticks.length-1].p < w-1-self.pr-2.5*fontSize) xticks.push({t:self.y(w-1-self.pr, true), p:w-1-self.pr});

        bar = stdMath.max(1, stdMath.floor((h - self.pt - self.pb) / (self.no*self.data.length)));
        yticks = array(self.no, function(i) {
            return {t:i+1, p:self.pt+i*self.data.length*bar+self.data.length*bar*0.8/2};
        });
    }
    else
    {
        if ('bar' === self.type)
        {
            bar = stdMath.max(1, stdMath.floor((w - self.pl - self.pr) / (self.no*self.data.length)));
            xticks = array(self.no, function(i) {
                return {t:i+1, p:self.pl+i*self.data.length*bar+self.data.length*bar*0.8/2};
            });
        }
        else
        {
            xticks = [];
            if ('log' === self.xscale)
            {
                for (ti=stdMath.pow(10, stdMath.floor(stdMath.log10(xmin)));;ti*=10)
                {
                    pi = self.x(ti);
                    if (/*ti > xmax*/pi > w-1-self.pr) break;
                    xticks.push({t:ti, p:pi});
                    for (i=1; i<=8; ++i)
                    {
                        pi = self.x(i*ti);
                        if (/*i*ti > xmax*/pi > w-1-self.pr) break;
                        xticks.push({t:i*ti, p:pi});
                    }
                }
            }
            else
            {
                step = stdMath.max(10+5*fontSize, round_((w - self.pl - self.pr) / 16));
                for (pi=self.pl;;pi+=step)
                {
                    ti = self.x(pi, true);
                    if (/*ti > xmax*/pi > w-1-self.pr) break;
                    xticks.push({t:ti, p:pi});
                }
            }
            //if (xticks[xticks.length-1].p < w-1-self.pr-2.5*fontSize) xticks.push({t:self.x(w-1-self.pr, true), p:w-1-self.pr});
        }

        yticks = [];
        if ('log' === self.yscale)
        {
            for (ti=stdMath.pow(10, stdMath.floor(stdMath.log10(ymin)));;ti*=10)
            {
                pi = self.y(ti);
                if (/*ti > ymax*/pi < self.pt) break;
                yticks.push({t:ti, p:pi});
                for (i=1; i<=8; ++i)
                {
                    pi = self.y(i*ti);
                    if (/*i*ti > ymax*/pi < self.pt) break;
                    yticks.push({t:i*ti, p:pi});
                }
            }
        }
        else
        {
            step = stdMath.max(4*fontSize, round_((h - self.pt - self.pb) / 16));
            for (pi=h-1-self.pb;;pi-=step)
            {
                ti = self.y(pi, true);
                if (/*ti > ymax*/pi < self.pt) break;
                yticks.push({t:ti, p:pi});
            }
        }
        //if (yticks[yticks.length-1].p > self.pt+1.1*fontSize) yticks.push({t:self.y(self.pt, true), p:self.pt});
    }

    c.font = String(fontSize) + 'px sans-serif';
    c.fillStyle = '#000';
    c.textAlign = 'center';
    c.strokeStyle = '#000';
    c.lineWidth = 1;

    c.beginPath();
    c.moveTo(self.pl, self.pt);
    c.lineTo(w-1-self.pr, self.pt);
    c.lineTo(w-1-self.pr, h-1-self.pb);
    c.lineTo(self.pl, h-1-self.pb);
    c.lineTo(self.pl, self.pt);
    c.stroke();

    xsize = stdMath.max(8, h*1e-3);
    xticks.forEach(function(x) {
        c.lineWidth = 0.5;
        c.beginPath();
        c.moveTo(x.p, h-1-self.pb);
        c.lineTo(x.p, h-1-self.pb - xsize);
        c.stroke();
        c.beginPath();
        c.moveTo(x.p, self.pt);
        c.lineTo(x.p, self.pt + xsize);
        c.stroke();
        if ('log' === self.xscale)
        {
            if (is_int(stdMath.log10(x.t)))
            {
                c.fillText('10^'+String(stdMath.floor(stdMath.log10(x.t))), x.p, h-1-self.pb + 5 + fontSize);
            }
        }
        else
        {
            c.fillText(tick_(x.t), x.p, h-1-self.pb + 5 + fontSize);
        }
    });

    ysize = stdMath.max(8, w*1e-3);
    yticks.forEach(function(y, i) {
        c.lineWidth = 0.5;
        c.beginPath();
        c.moveTo(self.pl, y.p);
        c.lineTo(self.pl + ysize, y.p);
        c.stroke();
        c.beginPath();
        c.moveTo(w-1-self.pr, y.p);
        c.lineTo(w-1-self.pr - ysize, y.p);
        c.stroke();
        if ('log' === self.yscale)
        {
            if (is_int(stdMath.log10(y.t)))
            {
                c.fillText('10^'+String(stdMath.floor(stdMath.log10(y.t))), self.pl - 2.1*fontSize, y.p);
            }
        }
        else
        {
            c.fillText(tick_(y.t), self.pl - 2.1*fontSize, y.p);
        }
    });
};
figure.prototype.updateAxes = function() {
    var self = this,
        w = self.canvas.width,
        h = self.canvas.height,
        xLowerLimit = inf,
        xUpperLimit = -inf,
        yLowerLimit = inf,
        yUpperLimit = -inf,
        no = inf;
    self.data.forEach(function(data, i) {
        if ('barh' === self.type || 'bar' === self.type)
        {
            no = stdMath.min(no, data.y.length);
        }
        else
        {
            no = stdMath.min(no, data.x.length, data.y.length);
            xLowerLimit = stdMath.min(xLowerLimit, min(data.x));
            xUpperLimit = stdMath.max(xUpperLimit, max(data.x));
        }
        yLowerLimit = stdMath.min(yLowerLimit, min(data.y));
        yUpperLimit = stdMath.max(yUpperLimit, max(data.y));
    });
    if ('barh' === self.type || 'bar' === self.type)
    {
        xLowerLimit = 1;
        xUpperLimit = no;
        if (0 < yLowerLimit) yLowerLimit = 0;
        if (0 > yUpperLimit) yUpperLimit = 0;
    }
    if (xLowerLimit === xUpperLimit)
    {
        xLowerLimit -= eps;
        xUpperLimit += eps;
    }
    if (yLowerLimit === yUpperLimit)
    {
        yLowerLimit -= eps;
        yUpperLimit += eps;
    }
    self.no = no;
    self.xmin = xLowerLimit;
    self.xmax = xUpperLimit;
    self.ymin = yLowerLimit;
    self.ymax = yUpperLimit;
    if ('log' === self.xscale)
    {
        self.xmin = stdMath.pow(10, stdMath.floor(stdMath.log10(self.xmin || eps)));
        self.xmax = stdMath.pow(10, stdMath.ceil(stdMath.log10(self.xmax || eps)));
        self.scx = (w-1 - self.pl - self.pr) / (stdMath.log10(self.xmax) - stdMath.log10(self.xmin));
    }
    else
    {
        self.scx = (w-1 - self.pl - self.pr) / (self.xmax - self.xmin);
    }
    if ('log' === self.yscale)
    {
        self.ymin = stdMath.pow(10, stdMath.floor(stdMath.log10(self.ymin || eps)));
        self.ymax = stdMath.pow(10, stdMath.ceil(stdMath.log10(self.ymax || eps)));
        self.scy = ('barh' === self.type ? (w-1 - self.pl - self.pr) : (h-1 - self.pt - self.pb)) / (stdMath.log10(self.ymax) - stdMath.log10(self.ymin));
    }
    else
    {
        self.scy = ('barh' === self.type ? (w-1 - self.pl - self.pr) : (h-1 - self.pt - self.pb)) / (self.ymax - self.ymin);
    }
    self.sc = stdMath.min(self.scx, self.scy);
};
figure.prototype.x = function(x, inv) {
    var self = this,
        xmin = self.xmin,
        sc = self.yscale === self.xscale ? self.sc : self.scx;
    if (true === inv)
    {
        return (x - self.pl) / sc + xmin;
    }
    if ('log' === self.xscale)
    {
        xmin = stdMath.log10(xmin);
        x = stdMath.log10(x || eps);
    }
    return (x - xmin) * sc + self.pl;
};
figure.prototype.y = function(y, inv) {
    var self = this,
        ymin = self.ymin,
        sc = self.yscale === self.xscale ? self.sc : self.scy,
        h = self.canvas.height;
    if (true === inv)
    {
        if ('barh' === self.type)
        {
            return (y - self.pl) / sc + ymin;
        }
        else
        {
            return (h-1-y - self.pb) / sc + ymin;
        }
    }
    if ('log' === self.yscale)
    {
        ymin = stdMath.log10(ymin);
        y = stdMath.log10(y || eps);
    }
    if ('barh' === self.type)
    {
        return (y - ymin) * sc + self.pl;
    }
    else
    {
        return h-1 - ((y - ymin) * sc + self.pb);
    }
};
