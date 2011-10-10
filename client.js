(function() {
  /*
  Copyright (c) 2011 Emanuel Rylke
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */  var arrows, brownbunny, bunnies, deathbrownbunny, deathbunnies, deathbunnycount, dog, doggoal, doghasbunny, dogpath, dogpos, dogrun, dogspeed, down, draw, drawBg, drawPs, flower, flowers, frameInterval, getPatch, grasscanvas, grassctx, hitp, hunter, initStubs, intersect, lastShoot, left, mp, patches, pathing, pos, randpos, right, rockcanvas, rockctx, runStubs, shoot, shooting, step, up, walk, zombies;
  var __slice = Array.prototype.slice;
  initStubs = [];
  runStubs = function(stubs) {
    if (stubs.length > 0) {
      stubs.shift()();
      return setTimeout((function() {
        return runStubs(stubs);
      }), 1);
    } else {
      return setTimeout((function() {
        return runStubs(stubs);
      }), 300);
    }
  };
  arrows = [];
  bunnies = new parray(5000, 500);
  deathbunnies = [];
  flowers = new parray(5000, 500);
  zombies = new parray(5000, 500);
  patches = new stparray(5000);
  this.patches = patches;
  randpos = function() {
    var foo, p, _results;
    _results = [];
    while (true) {
      p = [5000 * Math.random(), 5000 * Math.random()];
      foo = false;
      patches.eachin(p, [0, 0], function(patch) {
        if ((distance(patch.p, p)) < patch.r) {
          return foo = true;
        }
      });
      if (foo) {
        return p;
      }
    }
    return _results;
  };
  pos = null;
  dogpos = null;
  doggoal = null;
  doghasbunny = false;
  dogrun = false;
  dogpath = [];
  dogspeed = 0;
  deathbunnycount = 0;
  mp = [0, 0];
  frameInterval = null;
  lastShoot = (new Date()).getTime();
  shooting = false;
  up = false;
  down = false;
  left = false;
  right = false;
  drawPs = [];
  brownbunny = loadImg('brownbunny.png');
  deathbrownbunny = loadImg('deathbrownbunny.png');
  dog = loadImg('dog.png');
  flower = loadImg('flower.png');
  hunter = loadImg('hunter.png');
  initStubs.push(function() {
    var flpatch, foo, mindist, obst, _results;
    _results = [];
    while (patches.length() < 100) {
      flpatch = {
        r: 40 + Math.random() * 200,
        n: []
      };
      flpatch.p = [flpatch.r + Math.random() * (5000 - flpatch.r * 2), "foo"];
      flpatch.p[1] = 0 - flpatch.r;
      _results.push((function() {
        var _results2;
        _results2 = [];
        while (true) {
          if (flpatch.p[0] - flpatch.r < 0 || flpatch.p[0] + flpatch.r > 5000 || flpatch.p[1] + flpatch.r > 5000) {
            flpatch.p[1] = Math.min(5000 - flpatch.r, flpatch.p[1]);
            patches.add(flpatch);
            break;
          }
          obst = false;
          foo = false;
          mindist = 50;
          patches.eachin(minus(flpatch.p, [flpatch.r, flpatch.r]), [flpatch.r * 2, flpatch.r * 2 + 50], function(i) {
            mindist = Math.min(mindist, (distance(i.p, flpatch.p)) + 2 - i.r - flpatch.r);
            if ((distance(i.p, flpatch.p)) + 2 < i.r + flpatch.r) {
              if (obst && !foo) {
                patches.add(flpatch);
                return foo = true;
              } else {
                return obst = i;
              }
            }
          });
          if (foo) {
            break;
          }
          _results2.push(obst ? (flpatch.p[1] += 0.1, obst.p[0] < flpatch.p[0] ? flpatch.p[0]++ : flpatch.p[0]--) : flpatch.p[1] += Math.max(1, mindist));
        }
        return _results2;
      })());
    }
    return _results;
  });
  /*
  initStubs.push ->
    i = 0
    while i < patches.length
      patches.slice i, 1
      i += 4
  */
  initStubs.push(function() {
    return patches.each(function(patch) {
      return patches.eachin(minus(patch.p, [patch.r, patch.r]), [patch.r * 2, patch.r * 2], function(other) {
        if (patch !== other && (distance(patch.p, other.p)) < patch.r + other.r) {
          return patch.n.push(other);
        }
      });
    });
  });
  initStubs.push(function() {
    patches.each(function(_arg) {
      var p, r;
      p = _arg.p, r = _arg.r;
      pos = p;
      return dogpos = plus(pos, [r / 2, 0]);
    });
    doggoal = pos;
    return frameInterval = setInterval((function() {
      try {
        return step();
      } catch (err) {
        clearInterval(frameInterval);
        throw err;
      }
    }), 40);
  });
  grasscanvas = ($('<canvas width="5000" height="5000">'))[0];
  grassctx = grasscanvas.getContext('2d');
  rockcanvas = ($('<canvas width="5000" height="5000">'))[0];
  rockctx = rockcanvas.getContext('2d');
  initStubs.push(function() {
    rockctx.fillStyle = '#bbaaaa';
    fillRect(rockctx, [0, 0], [5000, 5000]);
    rockctx.globalCompositeOperation = 'destination-out';
    return patches.each(function(_arg) {
      var p, r;
      r = _arg.r, p = _arg.p;
      rockctx.beginPath();
      arc(rockctx, p, r, 0, tau + 0.001);
      return rockctx.fill();
    });
  });
  drawBg = function(name) {
    var bg;
    bg = new Image();
    ($(bg)).load(function() {
      var bgsize, x, _fn, _ref;
      bgsize = bg.width;
      _fn = function(x) {
        return initStubs.push(function() {
          var y, _ref2, _results;
          _results = [];
          for (y = 0, _ref2 = 5000 / bgsize | 0; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
            _results.push(grassctx.drawImage(bg, x * bgsize, y * bgsize));
          }
          return _results;
        });
      };
      for (x = 0, _ref = 5000 / bgsize | 0; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
        _fn(x);
      }
      return initStubs.push(function() {
        return drawImage(grassctx, rockcanvas, [0, 0]);
      });
    });
    return bg.src = name;
  };
  drawBg('bg.png');
  drawBg('bg2.png');
  draw = function() {
    var m, p, _i, _j, _k, _len, _len2, _len3, _ref;
    ctx.fillStyle = '#000000';
    fillRect(ctx, [0, 0], [1000, 500]);
    ctx.save();
    translate(ctx, minus([500, 250], pos));
    drawImage(ctx, grasscanvas, [0, 0]);
    ctx.strokeStyle = '#000000';
    for (_i = 0, _len = deathbunnies.length; _i < _len; _i++) {
      p = deathbunnies[_i].p;
      drawImage(ctx, deathbrownbunny, minus(p, [20, 20]));
    }
    flowers.eachin(minus(pos, [500, 250]), [1000, 500], function(_arg) {
      p = _arg.p;
      return drawImage(ctx, flower, minus(p, [10, 10]));
    });
    bunnies.eachin(minus(pos, [500, 250]), [1000, 500], function(_arg) {
      p = _arg.p;
      return drawImage(ctx, brownbunny, minus(p, [20, 20]));
    });
    drawImage(ctx, dog, minus(dogpos, [20, 20]));
    if (doghasbunny) {
      drawImage(ctx, deathbrownbunny, minus(dogpos, [10, 10]));
    }
    drawImage(ctx, hunter, minus(pos, [20, 20]));
    zombies.each(function(_arg) {
      var life, p;
      p = _arg.p, life = _arg.life;
      return fillRect(ctx, minus(p, [20, 20]), [20 + life * 2, 40]);
    });
    for (_j = 0, _len2 = arrows.length; _j < _len2; _j++) {
      _ref = arrows[_j], p = _ref.p, m = _ref.m;
      ctx.beginPath();
      moveTo(ctx, p);
      lineTo(ctx, plus(p, m));
      ctx.closePath();
      ctx.stroke();
    }
    ctx.lineWidth = 400;
    strokeRect(ctx, [-200, -200], [5400, 5400]);
    for (_k = 0, _len3 = drawPs.length; _k < _len3; _k++) {
      p = drawPs[_k];
      fillRect(ctx, p, [10, 10]);
    }
    drawPs = [];
    ctx.restore();
    drawImage(ctx, deathbrownbunny, [20, 20]);
    ctx.font = '40px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillText("" + deathbunnycount, 72, 47);
    ctx.fillText("" + deathbunnycount, 71, 46);
    ctx.fillStyle = '#ffddaa';
    return ctx.fillText("" + deathbunnycount, 70, 45);
  };
  hitp = function(bunny) {
    var a, _i, _len;
    for (_i = 0, _len = arrows.length; _i < _len; _i++) {
      a = arrows[_i];
      if (contains(plus(a.p, a.m), minus(bunny.p, [20, 20]), plus(bunny.p, [20, 20]))) {
        a.p = [-100, -100];
        return true;
      }
    }
    return false;
  };
  intersect = function(patch1, patch2) {
    return plus(patch1.p, mult(direction(patch1.p, patch2.p), patch1.r));
  };
  getPatch = function(p) {
    var res;
    res = false;
    patches.eachin(p, [0, 0], function(patch) {
      if ((distance(p, patch.p)) < patch.r) {
        return res = patch;
      }
    });
    return res;
  };
  pathing = function(p1, p2) {
    var bar, bla, closed, j, n, newpath, open, p1patch, p2patch, pth, _i, _len, _ref, _ref2, _results;
    p1patch = getPatch(p1);
    p2patch = getPatch(p2);
    if (!p2patch) {
      return [p1];
    } else if (p2patch === p1patch || !p1patch) {
      return [p2];
    } else {
      open = [
        {
          heurD: distance(p1, p2),
          measD: 0,
          p: [p2patch]
        }
      ];
      closed = [];
      _results = [];
      while (true) {
        open.sort(function(a, b) {
          return (a.heurD + a.measD) - (b.heurD + b.measD);
        });
        if (open.length === 0) {
          return [p1];
        }
        pth = open.shift();
        closed.push(pth.p[0]);
        _ref = pth.p[0].n;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          if (n === p1patch) {
            return __slice.call(intlvmap([n].concat(__slice.call(pth.p)), intersect)).concat([p2]);
          }
          bar = one(closed, function(x) {
            return x === n;
          });
          if (!bar) {
            newpath = {
              heurD: distance(p1, intersect(pth.p[0], n)),
              measD: pth.measD + (distance(intersect(pth.p[0], n), (pth.p.length > 1 ? intersect(pth.p[0], pth.p[1]) : p2))),
              p: [n].concat(__slice.call(pth.p))
            };
            bla = true;
            for (j = 0, _ref2 = open.length; 0 <= _ref2 ? j < _ref2 : j > _ref2; 0 <= _ref2 ? j++ : j--) {
              if (open[j].p[0] === n) {
                if (open[j].heurD + open[j].measD > newpath.heurD + newpath.measD) {
                  open[j] = newpath;
                }
                bla = false;
                break;
              }
            }
            if (bla) {
              open.push(newpath);
            }
          }
        }
      }
      return _results;
    }
  };
  walk = function(start, goal, speed) {
    var path;
    path = pathing(start, goal);
    return plus(start, mult(direction(start, path[0]), speed));
  };
  step = function() {
    var a, db, db2, dist, foo, goal, newarrows, newbunnies, newdeathbunnies, newflowers, newzombies, patch, _i, _j, _k, _len, _len2, _len3;
    goal = [pos[0] + (right ? 1 : 0) - (left ? 1 : 0), pos[1] + (down ? 1 : 0) - (up ? 1 : 0)];
    goal = plus(pos, mult(direction(pos, goal), 6));
    foo = true;
    patches.eachin(goal, [0, 0], function(patch) {
      if ((distance(patch.p, goal)) < patch.r - 1) {
        pos = goal;
        return foo = false;
      }
    });
    if (foo) {
      patch = getPatch(pos);
      pos = plus(patch.p, mult(direction(patch.p, goal), patch.r - 1));
    }
    if (bunnies.length() < 5) {
      bunnies.add({
        p: randpos(),
        alarmed: false,
        life: 100
      });
    }
    if (ptrue(0.5)) {
      flowers.add({
        p: randpos(),
        death: false
      });
    }
    if (ptrue(0.01)) {
      zombies.add({
        p: randpos(),
        sleep: 100,
        life: 10
      });
    }
    if (shooting) {
      shoot();
    }
    newarrows = [];
    for (_i = 0, _len = arrows.length; _i < _len; _i++) {
      a = arrows[_i];
      a.p = plus(a.p, a.m);
      if (a.h > 1) {
        a.h -= 1;
        newarrows.push(a);
      }
    }
    arrows = newarrows;
    newbunnies = new parray(5000, 500);
    bunnies.each(function(bunny) {
      var bunnygoal, bunnypath, bunnyspeed, dist, f;
      bunnygoal = bunny.p;
      bunnyspeed = 0;
      if (hitp(bunny)) {
        deathbunnies.push(bunny);
        return;
      }
      if (bunny.life < 1) {
        return;
      }
      bunny.life--;
      dist = distance(pos, bunny.p);
      if (dist < 150) {
        bunnies.eachin(minus(bunny.p, [150, 150]), [300, 300], function(otherbunny) {
          var dist2;
          dist2 = distance(bunny.p, otherbunny.p);
          if (dist2 < 150) {
            return otherbunny.alarmed = true;
          }
        });
      }
      if (bunny.alarmed) {
        bunny.alarmed = dist < 600;
        bunnyspeed = 10;
        bunnygoal = plus(bunny.p, mult(direction(pos, bunny.p), 100));
      } else {
        if (bunny.life > 1000) {
          bunny.life -= 200;
          bunny.life /= 2;
          newbunnies.add({
            p: plus(bunny.p, [0, 0]),
            alarmed: false,
            life: bunny.life
          });
        }
        f = {
          p: [99999, 99999]
        };
        flowers.eachin(minus(bunny.p, [500, 500]), [1000, 1000], function(f2) {
          var other;
          if ((distance(f.p, bunny.p)) > (distance(f2.p, bunny.p))) {
            if ((distance(f2.p, bunny.p)) > (distance(f2.p, pos))) {
              other = true;
            } else {
              other = false;
              bunnies.eachin(minus(bunny.p, [50, 50]), [100, 100], function(otherbunny) {
                if ((bunny !== otherbunny) && (distance(f2.p, bunny.p)) > (distance(f2.p, otherbunny.p))) {
                  return other = true;
                }
              });
            }
            if (!other) {
              return f = f2;
            }
          }
        });
        if (f.p[0] !== 99999) {
          bunnyspeed = 8;
          bunnygoal = f.p;
          if ((distance(f.p, bunny.p)) < 20) {
            bunny.life += 50;
            f.death = true;
          }
        }
      }
      bunnypath = pathing(bunny.p, bunnygoal);
      bunny.p = plus(bunny.p, mult(direction(bunny.p, bunnypath[0]), bunnyspeed));
      return newbunnies.add(bunny);
    });
    bunnies = newbunnies;
    doggoal = dogpos;
    if (doghasbunny) {
      if ((distance(dogpos, pos)) < 50) {
        deathbunnycount++;
        doghasbunny = false;
      } else {
        dogspeed = 10;
        doggoal = pos;
      }
    } else {
      db = {
        p: [99999, 99999]
      };
      for (_j = 0, _len2 = deathbunnies.length; _j < _len2; _j++) {
        db2 = deathbunnies[_j];
        dist = distance(db2.p, dogpos);
        if (dist < 500 && dist < (distance(dogpos, db.p))) {
          db = db2;
        }
      }
      if (db.p[0] !== 99999) {
        dogspeed = 10;
        doggoal = db.p;
      } else if (dogrun) {
        if ((distance(dogpos, pos)) > 90) {
          dogspeed = 7;
          doggoal = pos;
        } else {
          dogrun = false;
        }
      } else if ((distance(dogpos, pos)) > 250) {
        dogrun = true;
      }
    }
    dogpos = walk(dogpos, doggoal, dogspeed);
    newzombies = new parray(5000, 500);
    zombies.each(function(zombie) {
      if (hitp(zombie)) {
        zombie.life--;
      }
      if (zombie.sleep < 1) {
        zombie.p = walk(zombie.p, pos, zombie.life / 2);
        /*
              zombies.eachin (minus zombie.p, [50, 50]), [100, 100], (other) ->
                if other.sleep < 1 && 0 < (distance other.p, zombie.p) < 50
                  zombie.sleep = 500
              */
        if ((distance(pos, zombie.p)) < 10) {
          pr("You die! but you got " + deathbunnycount + " bunnies!");
          clearInterval(frameInterval);
        }
      } else {
        zombie.sleep--;
      }
      if (zombie.life > 0) {
        return newzombies.add(zombie);
      }
    });
    zombies = newzombies;
    newdeathbunnies = [];
    for (_k = 0, _len3 = deathbunnies.length; _k < _len3; _k++) {
      db = deathbunnies[_k];
      if ((distance(db.p, pos)) < 50) {
        deathbunnycount++;
      } else if ((!doghasbunny) && (distance(db.p, dogpos)) < 50) {
        doghasbunny = true;
      } else {
        newdeathbunnies.push(db);
      }
    }
    deathbunnies = newdeathbunnies;
    newflowers = new parray(5000, 500);
    flowers.each(function(f) {
      if (!f.death) {
        return newflowers.add(f);
      }
    });
    flowers = newflowers;
    return draw();
  };
  ($(document)).keydown(function(evt) {
    switch (String.fromCharCode(evt.which)) {
      case 'A':
        left = true;
        break;
      case 'S':
        down = true;
        break;
      case 'W':
        up = true;
        break;
      case 'D':
        right = true;
        break;
      default:
        return;
    }
    return evt.preventDefault();
  });
  ($(document)).keyup(function(evt) {
    switch (String.fromCharCode(evt.which)) {
      case 'A':
        left = false;
        break;
      case 'S':
        down = false;
        break;
      case 'W':
        up = false;
        break;
      case 'D':
        right = false;
        break;
      default:
        return;
    }
    return evt.preventDefault();
  });
  shoot = function() {
    if ((new Date()).getTime() - 160 > lastShoot) {
      arrows.push({
        h: 30,
        p: pos,
        m: mult(direction(pos, plus(mp, minus(pos, [500, 250]))), 20)
      });
      return lastShoot = (new Date()).getTime();
    }
  };
  $(function() {
    var cnvs;
    runStubs(initStubs);
    cnvs = $('canvas');
    ($('canvas')).mousemove(function(evt) {
      mp = minus([evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]);
      return evt.preventDefault();
    });
    ($('canvas')).click(function() {
      return shoot();
    });
    ($('canvas')).mousedown(function() {
      shoot();
      shooting = true;
      return true;
    });
    return ($('canvas')).mouseup(function() {
      shooting = false;
      return true;
    });
  });
}).call(this);
