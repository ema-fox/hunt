(function() {
  /*
  Copyright (c) 2011 Emanuel Rylke
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.zip = function() {
    var i, len, x, xs, _results;
    xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    len = Math.min.apply(Math, (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        _results.push(x.length);
      }
      return _results;
    })());
    _results = [];
    for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
      _results.push((function() {
        var _i, _len, _results2;
        _results2 = [];
        for (_i = 0, _len = xs.length; _i < _len; _i++) {
          x = xs[_i];
          _results2.push(x[i]);
        }
        return _results2;
      })());
    }
    return _results;
  };
  this.reduce = function(f, res, xs) {
    var x, _i, _len;
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      res = f(res, x);
    }
    return res;
  };
  this.map2d = function(xs, ys, f) {
    var x, y, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      _results.push((function() {
        var _j, _len2, _results2;
        _results2 = [];
        for (_j = 0, _len2 = ys.length; _j < _len2; _j++) {
          y = ys[_j];
          _results2.push(f(x, y));
        }
        return _results2;
      })());
    }
    return _results;
  };
  this.one = function(xs, f) {
    var x, _i, _len;
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      if (f(x)) {
        return x;
      }
    }
    return false;
  };
  this.intlvmap = function(xs, f) {
    var i, _ref, _results;
    if (xs.length < 2) {
      return [];
    } else {
      _results = [];
      for (i = 0, _ref = xs.length - 2; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        _results.push(f(xs[i], xs[i + 1]));
      }
      return _results;
    }
  };
  /*
  these are cute but slow
  @plus  = (xs...) -> reduce ((a, b) -> a + b), 0, x for x in zip xs...
  @minus = (xs...) -> reduce ((a, b) -> a - b), y, ys for [y, ys...] in zip xs...
  */
  this.tau = Math.PI * 2;
  this.mod = function(a, b) {
    if (a >= 0) {
      return a % b;
    } else {
      return b + a % b;
    }
  };
  this.plus = function(_arg, _arg2) {
    var a0, a1, b0, b1;
    a0 = _arg[0], a1 = _arg[1];
    b0 = _arg2[0], b1 = _arg2[1];
    return [a0 + b0, a1 + b1];
  };
  this.minus = function(_arg, _arg2) {
    var a0, a1, b0, b1;
    a0 = _arg[0], a1 = _arg[1];
    b0 = _arg2[0], b1 = _arg2[1];
    return [a0 - b0, a1 - b1];
  };
  this.min = function(_arg, _arg2) {
    var a0, a1, b0, b1;
    a0 = _arg[0], a1 = _arg[1];
    b0 = _arg2[0], b1 = _arg2[1];
    return [Math.min(a0, b0), Math.min(a1, b1)];
  };
  this.mult = function(xs, y) {
    var x, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      _results.push(x * y);
    }
    return _results;
  };
  this.divi = function(xs, y) {
    var x, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      _results.push(x / y);
    }
    return _results;
  };
  this.floor = function(xs) {
    var x, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      _results.push(x | 0);
    }
    return _results;
  };
  this.abs = function(xs) {
    var x, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      _results.push(Math.abs(x));
    }
    return _results;
  };
  this.pyth = function(_arg) {
    var a, b;
    a = _arg[0], b = _arg[1];
    return Math.sqrt((Math.pow(a, 2)) + (Math.pow(b, 2)));
  };
  this.distance = function(_arg, _arg2) {
    var a0, a1, b0, b1;
    a0 = _arg[0], a1 = _arg[1];
    b0 = _arg2[0], b1 = _arg2[1];
    return Math.sqrt((Math.pow(a0 - b0, 2)) + (Math.pow(a1 - b1, 2)));
  };
  this.pldist = function(_arg, _arg2, _arg3) {
    var dx, dy, t, x0, x1, x2, x3, y0, y1, y2, y3;
    x1 = _arg[0], y1 = _arg[1];
    x2 = _arg2[0], y2 = _arg2[1];
    x3 = _arg3[0], y3 = _arg3[1];
    dx = x2 - x1;
    dy = y2 - y1;
    if (dx === 0 && dy === 0) {
      x0 = x1;
      y0 = y1;
    } else {
      t = ((x3 - x1) * dx + (y3 - y1) * dy) / (dx * dx + dy * dy);
      t = Math.min(Math.max(0, t), 1);
      x0 = x1 + t * dx;
      y0 = y1 + t * dy;
    }
    return distance([x3, y3], [x0, y0]);
  };
  this.pctangent = function(point, _arg, sign) {
    var p, r;
    r = _arg.r, p = _arg.p;
    return mod((asincos(direction(p, point))) + sign * (Math.acos(r / (distance(p, point)))), tau);
  };
  this.cctangent = function(c1, c2, sign) {
    return pctangent(c1.p, {
      r: c2.r - c1.r,
      p: c2.p
    }, sign);
  };
  this.convertline = function(p1, p2) {
    var a, b, c;
    a = minus(p2, p1);
    b = a[1] / a[0];
    c = p1[1] - b * p1[0];
    return [b, c];
  };
  this.llcross = function(p1, p2, p3, p4) {
    var a, b, c, crosspoint, d, _ref, _ref2;
    _ref = convertline(p1, p2), b = _ref[0], a = _ref[1];
    _ref2 = convertline(p3, p4), d = _ref2[0], c = _ref2[1];
    crosspoint = [(c - a) / (b - d), a + b * (c - a) / (b - d)];
    return [(contains(crosspoint, p2, p1)) && (contains(crosspoint, p4, p3)), crosspoint];
  };
  this.contains = function(_arg, _arg2, _arg3) {
    var b0, b1, p0, p1, s0, s1;
    p0 = _arg[0], p1 = _arg[1];
    b0 = _arg2[0], b1 = _arg2[1];
    s0 = _arg3[0], s1 = _arg3[1];
    return ((Math.min(b0, s0)) < p0 && p0 < (Math.max(b0, s0))) && ((Math.min(b1, s1)) < p1 && p1 < (Math.max(b1, s1)));
  };
  this.arcContains = function(a1, a2, a3) {
    if (a2 > a3) {
      return a2 < a1 || a1 < a3;
    } else {
      return (a2 < a1 && a1 < a3);
    }
  };
  this.direction = function(from, to) {
    var dist, path;
    path = minus(to, from);
    dist = pyth(path);
    if (dist === 0) {
      return [0, 0];
    } else {
      return divi(path, dist);
    }
  };
  this.sincos = function(arc) {
    return [Math.sin(arc), Math.cos(arc)];
  };
  this.ponc = function(crcl, arc) {
    return plus(crcl.p, mult(sincos(arc), crcl.r));
  };
  this.asincos = function(_arg) {
    var p0, p1;
    p0 = _arg[0], p1 = _arg[1];
    if ((Math.asin(p0)) > 0) {
      return Math.acos(p1);
    } else {
      return Math.PI * 2 - Math.acos(p1);
    }
  };
  this.arcdist = function(a1, a2) {
    var d;
    d = Math.abs((mod(a1, tau)) - (mod(a2, tau)));
    return Math.min(d, tau - d);
  };
  this.add = function(p1, _arg) {
    var b0, b1;
    b0 = _arg[0], b1 = _arg[1];
    p1[0] += b0;
    p1[1] += b1;
    return p1;
  };
  this.ac = function(array, _arg) {
    var col, p0, p1;
    p0 = _arg[0], p1 = _arg[1];
    col = array[p0];
    if (col != null) {
      return col[p1];
    } else {
      return;
    }
  };
  $(__bind(function() {
    return this.ctx = ($('canvas'))[0].getContext('2d');
  }, this));
  this.clearRect = function(ctx, _arg, _arg2) {
    var p0, p1, s0, s1;
    p0 = _arg[0], p1 = _arg[1];
    s0 = _arg2[0], s1 = _arg2[1];
    return ctx.clearRect(p0, p1, s0, s1);
  };
  this.fillRect = function(ctx, _arg, _arg2) {
    var p0, p1, s0, s1;
    p0 = _arg[0], p1 = _arg[1];
    s0 = _arg2[0], s1 = _arg2[1];
    return ctx.fillRect(p0, p1, s0, s1);
  };
  this.drawImage = function(ctx, img, _arg) {
    var p0, p1;
    p0 = _arg[0], p1 = _arg[1];
    return ctx.drawImage(img, p0, p1);
  };
  this.strokeRect = function(ctx, _arg, _arg2) {
    var p0, p1, s0, s1;
    p0 = _arg[0], p1 = _arg[1];
    s0 = _arg2[0], s1 = _arg2[1];
    return ctx.strokeRect(p0, p1, s0, s1);
  };
  this.moveTo = function(ctx, _arg) {
    var p0, p1;
    p0 = _arg[0], p1 = _arg[1];
    return ctx.moveTo(p0, p1);
  };
  this.lineTo = function(ctx, _arg) {
    var p0, p1;
    p0 = _arg[0], p1 = _arg[1];
    return ctx.lineTo(p0, p1);
  };
  this.arc = function(ctx, _arg, radius, startarc, endarc, foo) {
    var p0, p1;
    p0 = _arg[0], p1 = _arg[1];
    return ctx.arc(p0, p1, radius, Math.PI * 0.5 - startarc, Math.PI * 0.5 - endarc, foo);
  };
  this.translate = function(ctx, _arg) {
    var p0, p1;
    p0 = _arg[0], p1 = _arg[1];
    return ctx.translate(p0, p1);
  };
  this.loadImg = function(src) {
    var img;
    img = new Image();
    img.src = src;
    return img;
  };
  this.stparray = (function() {
    function stparray(s) {
      var i;
      this.s = s;
      this.es = [];
      this.ps = (function() {
        var _i, _len, _ref, _results;
        _ref = [2, 4, 8, 16];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(new parray(this.s, this.s / i));
        }
        return _results;
      }).call(this);
    }
    stparray.prototype.add = function(e) {
      var helper, i, p1, p2, _i, _len, _ref;
      p1 = minus(e.p, [e.r, e.r]);
      p2 = plus(e.p, [e.r, e.r]);
      _ref = [3, 2, 1, 0];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        helper = __bind(function(x) {
          return x - x % (this.s / (2 << i));
        }, this);
        if ((helper(p1[0])) === (helper(p2[0])) && (helper(p1[1])) === (helper(p2[1]))) {
          this.ps[i].add(e);
          return;
        }
      }
      return this.es.push(e);
    };
    stparray.prototype.eachin = function(p, s, f) {
      var i, _i, _j, _len, _len2, _ref, _ref2;
      _ref = this.ps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        i.eachin(p, s, f);
      }
      _ref2 = this.es;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        i = _ref2[_j];
        f(i);
      }
      return;
    };
    stparray.prototype.each = function(f) {
      var i, _i, _j, _len, _len2, _ref, _ref2;
      _ref = this.ps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        i.each(f);
      }
      _ref2 = this.es;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        i = _ref2[_j];
        f(i);
      }
      return;
    };
    stparray.prototype.hist = function() {
      var i;
      return [this.es.length].concat(__slice.call((function() {
          var _i, _len, _ref, _results;
          _ref = this.ps;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(i.length());
          }
          return _results;
        }).call(this)));
    };
    stparray.prototype.length = function() {
      var i, res, _i, _len, _ref;
      res = 0;
      _ref = this.hist();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        res += i;
      }
      return res;
    };
    return stparray;
  })();
  this.parray = (function() {
    function parray(s, ts) {
      var x, y;
      this.ts = ts;
      this.es = (function() {
        var _ref, _results;
        _results = [];
        for (x = 0, _ref = s / this.ts | 0; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
          _results.push((function() {
            var _ref2, _results2;
            _results2 = [];
            for (y = 0, _ref2 = s / this.ts | 0; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
              _results2.push([]);
            }
            return _results2;
          }).call(this));
        }
        return _results;
      }).call(this);
    }
    parray.prototype.add = function(e) {
      var x, y;
      x = e.p[0] / this.ts | 0;
      y = e.p[1] / this.ts | 0;
      return this.es[x][y].push(e);
    };
    parray.prototype.near = function(p) {
      var res, x, x1, y, y1, _ref, _ref2, _ref3, _ref4;
      x1 = p[0] / this.ts | 0;
      y1 = p[1] / this.ts | 0;
      res = [];
      for (x = _ref = x1 - 1, _ref2 = x1 + 1; _ref <= _ref2 ? x <= _ref2 : x >= _ref2; _ref <= _ref2 ? x++ : x--) {
        if (this.es[x]) {
          for (y = _ref3 = y1 - 1, _ref4 = y1 + 1; _ref3 <= _ref4 ? y <= _ref4 : y >= _ref4; _ref3 <= _ref4 ? y++ : y--) {
            if (this.es[x][y]) {
              res = res.concat(this.es[x][y]);
            }
          }
        }
      }
      return res;
    };
    parray.prototype.sanitize = function(x) {
      return Math.max(Math.min(x, this.es.length - 1), 0);
    };
    parray.prototype.eachin = function(_arg, _arg2, f) {
      var e, p0, p1, s0, s1, x, x1, x2, y, y1, y2, _i, _len, _ref;
      p0 = _arg[0], p1 = _arg[1];
      s0 = _arg2[0], s1 = _arg2[1];
      x1 = this.sanitize(p0 / this.ts | 0);
      y1 = this.sanitize(p1 / this.ts | 0);
      x2 = this.sanitize((p0 + s0) / this.ts | 0);
      y2 = this.sanitize((p1 + s1) / this.ts | 0);
      for (x = x1; x1 <= x2 ? x <= x2 : x >= x2; x1 <= x2 ? x++ : x--) {
        for (y = y1; y1 <= y2 ? y <= y2 : y >= y2; y1 <= y2 ? y++ : y--) {
          _ref = this.es[x][y];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            f(e);
          }
        }
      }
      return;
    };
    parray.prototype.each = function(f) {
      var e, row, tile, _i, _j, _k, _len, _len2, _len3, _ref;
      _ref = this.es;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        for (_j = 0, _len2 = row.length; _j < _len2; _j++) {
          tile = row[_j];
          for (_k = 0, _len3 = tile.length; _k < _len3; _k++) {
            e = tile[_k];
            f(e);
          }
        }
      }
      return;
    };
    parray.prototype.length = function() {
      var res;
      res = 0;
      this.each(function() {
        return res++;
      });
      return res;
    };
    return parray;
  })();
  this.ptrue = function(a) {
    return Math.random() < a;
  };
  this.pr = function() {
    var a;
    a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return alert(JSON.stringify(a));
  };
}).call(this);
