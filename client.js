// Generated by CoffeeScript 1.3.3

/*
Copyright (c) 2011-2012 Emanuel Rylke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function() {
  var NUM_ALTAR_PIECES, Shooter, altar, altarInInventar, altarPieces, altarPiecesCount, arrows, brownbunny, bunnies, collectAltarPiece, deathbrownbunny, deathbunnies, deathbunnycount, dog, doggoal, doghasbunny, dogpath, dogpos, dogrun, dogspeed, draw, drawBg, drawHPBar, drawOnMap, drawPs, flower, flowers, frameInterval, frameTimer, getPatch, getTime, grasscanvas, grassctx, hitp, hunter, hunterImg, initStubs, intersect, knuth, lastZombieWave, lastZombieWaveOffset, mapcanvas, mapctx, mousePressed, mp, nigth, patches, pathing, pause, rand255, randpos, runGame, runStubs, shooting, step, walk, zombie, zombieWaveSize, zombies,
    __slice = [].slice;

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

  NUM_ALTAR_PIECES = 7;

  arrows = [];

  bunnies = new parray(5000, 500);

  deathbunnies = [];

  flowers = new parray(5000, 500);

  zombies = new parray(5000, 500);

  altarPieces = [];

  altarPiecesCount = 0;

  altarInInventar = false;

  altar = null;

  patches = new stparray(5000);

  this.patches = patches;

  randpos = function() {
    var foo, p;
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
  };

  hunter = null;

  knuth = null;

  dogpos = null;

  doggoal = null;

  doghasbunny = false;

  dogrun = false;

  dogpath = [];

  dogspeed = 0;

  deathbunnycount = 0;

  mp = [0, 0];

  mousePressed = false;

  frameInterval = null;

  getTime = function() {
    return (new Date()).getTime();
  };

  frameTimer = 0;

  nigth = null;

  lastZombieWave = getTime();

  lastZombieWaveOffset = 0;

  zombieWaveSize = 1;

  shooting = false;

  pause = false;

  drawPs = [];

  brownbunny = loadImg('brownbunny.png');

  deathbrownbunny = loadImg('deathbrownbunny.png');

  dog = loadImg('dog.png');

  flower = loadImg('flower.png');

  hunterImg = loadImg('hunter.png');

  zombie = loadImg('zombie.png');

  initStubs.push(function() {
    var flpatch, foo, mindist, obst;
    while (patches.length() < 50) {
      flpatch = {
        r: 40 + Math.random() * 400,
        n: []
      };
      flpatch.p = [flpatch.r + Math.random() * (5000 - flpatch.r * 2), "foo"];
      flpatch.p[1] = 0 - flpatch.r;
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
        if (obst) {
          flpatch.p[1] += 0.1;
          if (obst.p[0] < flpatch.p[0]) {
            flpatch.p[0]++;
          } else {
            flpatch.p[0]--;
          }
        } else {
          flpatch.p[1] += Math.max(1, mindist);
        }
      }
    }
    return null;
  });

  initStubs.push(function() {
    return patches.each(function(patch) {
      return patches.eachinradius(patch.p, patch.r, function(other) {
        if (patch !== other) {
          return patch.n.push(other);
        }
      });
    });
  });

  runGame = function() {
    return frameInterval = setInterval((function() {
      try {
        return step();
      } catch (err) {
        clearInterval(frameInterval);
        throw err;
      }
    }), 40);
  };

  initStubs.push(function() {
    var p, r, _ref;
    _ref = patches.biggestinradius([4000, 4000], 2000, function(x) {
      return -1 * (distance([4000, 4000], x.p));
    }), p = _ref.p, r = _ref.r;
    hunter = new Shooter(p);
    dogpos = plus(p, [r / 2, 0]);
    doggoal = hunter.p;
    p = patches.biggestinradius([1000, 4000], 2000, function(x) {
      return x.r / (1500 + (distance(x.p, [1000, 4000])));
    }).p;
    knuth = new Shooter(p);
    return runGame();
  });

  initStubs.push(function() {
    var i;
    return altarPieces = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= NUM_ALTAR_PIECES ? _i < NUM_ALTAR_PIECES : _i > NUM_ALTAR_PIECES; i = 0 <= NUM_ALTAR_PIECES ? ++_i : --_i) {
        _results.push(randpos());
      }
      return _results;
    })();
  });

  rand255 = function() {
    return Math.floor(255 * Math.random());
  };

  grasscanvas = ($('<canvas width="5000" height="5000">'))[0];

  grassctx = grasscanvas.getContext('2d');

  mapcanvas = ($('<canvas width="1000" height="1000">'))[0];

  mapctx = mapcanvas.getContext('2d');

  mapctx.scale(0.2, 0.2);

  mapctx.lineWidth = 10;

  mapctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';

  mapctx.fillStyle = 'rgba(0, 0, 0, 0.1)';

  drawOnMap = function(patch) {
    var n, other, p, r, _i, _len;
    if (!patch.drawn) {
      r = patch.r, p = patch.p, n = patch.n;
      for (_i = 0, _len = n.length; _i < _len; _i++) {
        other = n[_i];
        fillRect(mapctx, minus(intersect(patch, other), [10, 10]), [20, 20]);
      }
      mapctx.beginPath();
      arc(mapctx, p, r, 0, tau + 0.001);
      mapctx.stroke();
      return patch.drawn = true;
    }
  };

  initStubs.push(function() {
    return drawOnMap(getPatch(hunter.p));
  });

  drawBg = function(name, andThen) {
    var bg;
    bg = new Image();
    ($(bg)).load(function() {
      var bgsize, x, _fn, _i, _ref;
      bgsize = bg.width;
      _fn = function(x) {
        return initStubs.push(function() {
          var y, _j, _ref1;
          for (y = _j = 0, _ref1 = 5000 / bgsize | 0; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
            grassctx.drawImage(bg, x * bgsize, y * bgsize);
          }
          return null;
        });
      };
      for (x = _i = 0, _ref = 5000 / bgsize | 0; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        _fn(x);
      }
      return initStubs.push(andThen);
    });
    return bg.src = name;
  };

  initStubs.push(function() {
    grassctx.fillStyle = '#44aa00';
    patches.each(function(_arg) {
      var p, r;
      r = _arg.r, p = _arg.p;
      grassctx.beginPath();
      arc(grassctx, p, r, 0, tau + 0.001);
      return grassctx.fill();
    });
    grassctx.globalCompositeOperation = 'source-atop';
    return drawBg('bg.png', function() {
      return drawBg('bg2.png', function() {
        return patches.each(function(_arg) {
          var p, r;
          r = _arg.r, p = _arg.p;
          grassctx.fillStyle = 'rgba(' + rand255() + ', ' + rand255() + ', ' + rand255() + ', 0.1)';
          grassctx.beginPath();
          arc(grassctx, p, r, 0, tau + 0.001);
          return grassctx.fill();
        });
      });
    });
  });

  drawHPBar = function(ctx, p, hp, maxhp) {
    ctx.fillStyle = '#aa2255';
    fillRect(ctx, minus(p, [20, 25]), [40, 3]);
    ctx.fillStyle = '#00dd00';
    return fillRect(ctx, minus(p, [20, 25]), [40 * hp / maxhp, 3]);
  };

  draw = function() {
    var i, m, p, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _n, _ref;
    ctx.fillStyle = '#bbaaaa';
    fillRect(ctx, [0, 0], [1000, 500]);
    ctx.save();
    translate(ctx, minus([500, 250], hunter.p));
    drawImage(ctx, grasscanvas, [0, 0]);
    ctx.strokeStyle = '#000000';
    for (_i = 0, _len = altarPieces.length; _i < _len; _i++) {
      p = altarPieces[_i];
      fillRect(ctx, minus(p, [20, 20]), [40, 40]);
    }
    for (_j = 0, _len1 = deathbunnies.length; _j < _len1; _j++) {
      p = deathbunnies[_j].p;
      drawImage(ctx, deathbrownbunny, minus(p, [20, 20]));
    }
    flowers.eachin(minus(hunter.p, [500, 250]), [1000, 500], function(_arg) {
      var p;
      p = _arg.p;
      return drawImage(ctx, flower, minus(p, [10, 10]));
    });
    bunnies.eachin(minus(hunter.p, [500, 250]), [1000, 500], function(_arg) {
      var p;
      p = _arg.p;
      return drawImage(ctx, brownbunny, minus(p, [20, 20]));
    });
    drawImage(ctx, dog, minus(dogpos, [20, 20]));
    if (doghasbunny) {
      drawImage(ctx, deathbrownbunny, minus(dogpos, [10, 10]));
    }
    fillRect(ctx, minus(knuth.p, [20, 20]), [40, 40]);
    if (altar) {
      fillRect(ctx, minus(altar, [20, 20]), [40, 40]);
    }
    drawImage(ctx, hunterImg, minus(hunter.p, [20, 20]));
    ctx.fillStyle = '#ffffff';
    ctx.fillText("Knuth", knuth.p[0] - 40, knuth.p[1] - 40);
    ctx.strokeText("Knuth", knuth.p[0] - 40, knuth.p[1] - 40);
    zombies.eachin(minus(hunter.p, [500, 250]), [1000, 500], function(_arg) {
      var life, p;
      p = _arg.p, life = _arg.life;
      drawImage(ctx, zombie, minus(p, [20, 20]));
      return drawHPBar(ctx, p, life, 10);
    });
    for (_k = 0, _len2 = arrows.length; _k < _len2; _k++) {
      _ref = arrows[_k], p = _ref.p, m = _ref.m;
      ctx.beginPath();
      moveTo(ctx, p);
      lineTo(ctx, plus(p, m));
      ctx.closePath();
      ctx.stroke();
    }
    for (_l = 0, _len3 = drawPs.length; _l < _len3; _l++) {
      p = drawPs[_l];
      fillRect(ctx, p, [10, 10]);
    }
    drawPs = [];
    ctx.restore();
    ctx.save();
    translate(ctx, minus([500, 250], mult(hunter.p, 0.2)));
    drawImage(ctx, mapcanvas, [0, 0]);
    ctx.scale(0.2, 0.2);
    ctx.fillStyle = 'rgba(255,255,255, 0.4)';
    for (_m = 0, _len4 = altarPieces.length; _m < _len4; _m++) {
      p = altarPieces[_m];
      if ((getPatch(p)).drawn) {
        fillRect(ctx, minus(p, [10, 10]), [20, 20]);
      }
    }
    ctx.restore();
    ctx.fillStyle = "rgba(0, 0, 0, " + nigth + ")";
    fillRect(ctx, [0, 0], [1000, 500]);
    for (i = _n = 0; 0 <= deathbunnycount ? _n < deathbunnycount : _n > deathbunnycount; i = 0 <= deathbunnycount ? ++_n : --_n) {
      p = plus([30, 30], [(i ^ (i * 31.31)) % 50, (i ^ (i * 42.42)) % 50]);
      drawImage(ctx, deathbrownbunny, p);
    }
    ctx.font = '40px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText("" + deathbunnycount, 70, 45);
    return ctx.strokeText("" + deathbunnycount, 70, 45);
  };

  hitp = function(bunny) {
    var a, _i, _len;
    for (_i = 0, _len = arrows.length; _i < _len; _i++) {
      a = arrows[_i];
      if (contains(a.p, minus(bunny.p, [20, 20]), plus(bunny.p, [20, 20]))) {
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
    var bar, bla, closed, j, n, newpath, open, p1patch, p2patch, pth, _i, _j, _len, _ref, _ref1;
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
            for (j = _j = 0, _ref1 = open.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
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
    }
    throw "the controlflow should never go here";
  };

  walk = function(start, goal, speed) {
    var path;
    path = pathing(start, goal);
    return plus(start, mult(direction(start, path[0]), speed));
  };

  Shooter = (function() {

    function Shooter(p) {
      this.p = p;
      this.target = null;
      this.lastShoot = 0;
    }

    Shooter.prototype.behave = function() {
      if (this.target && frameTimer - 4 > this.lastShoot) {
        arrows.push({
          h: 30,
          p: this.p,
          m: mult(direction(this.p, this.target), 20)
        });
        return this.lastShoot = frameTimer;
      }
    };

    return Shooter;

  })();

  collectAltarPiece = function() {
    altarPiecesCount++;
    $('#inventar')[0].innerHTML = 'Inventar:<br>Altar Pieces: ' + altarPiecesCount;
    if (altarPiecesCount === NUM_ALTAR_PIECES) {
      return $('#inventar').append('<br><a onclick="javascript:repairAltar()" href="javascript:void(0)">repair altar</a>');
    }
  };

  this.repairAltar = function() {
    altarPieces = [];
    altarInInventar = true;
    $('#inventar')[0].innerHTML = 'Inventar:<br>Altar: 1<br><a onclick="javascript:placeAltar()" href="javascript:void(0)">place altar</a>';
    return false;
  };

  this.placeAltar = function() {
    altar = hunter.p;
    altarInInventar = false;
    return $("#inventar")[0].innerHTML = '';
  };

  step = function() {
    var a, bar, db, db2, dist, foo, goal, i, newarrows, newbunnies, newdeathbunnies, newflowers, newzombies, patch, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref;
    _ref = (getPatch(hunter.p)).n;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      patch = _ref[_i];
      drawOnMap(patch);
    }
    frameTimer++;
    nigth = ((Math.sin(frameTimer / (25 * 60))) + 1) / 4;
    if (mousePressed) {
      hunter.goal = plus(mp, minus(hunter.p, [500, 250]));
    }
    if (hunter.goal) {
      hunter.p = walk(hunter.p, hunter.goal, 6);
      if ((distance(hunter.p, hunter.goal)) < 6) {
        hunter.goal = null;
      }
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
    if (getTime() - 60 * 1000 > lastZombieWave) {
      for (i = _j = 0; 0 <= zombieWaveSize ? _j < zombieWaveSize : _j > zombieWaveSize; i = 0 <= zombieWaveSize ? ++_j : --_j) {
        zombies.add({
          p: randpos(),
          sleep: 100,
          life: 10,
          subgoal: [0, 0],
          subgoalcounter: 0
        });
      }
      zombieWaveSize++;
      lastZombieWave = getTime();
    }
    if (hunter.target) {
      hunter.target = plus(mp, minus(hunter.p, [500, 250]));
    }
    hunter.behave();
    knuth.target = null;
    foo = 1;
    zombies.eachinradius(knuth.p, 400, function(zombie) {
      if (Math.random() < 1 / foo) {
        knuth.target = zombie.p;
      }
      return foo++;
    });
    knuth.behave();
    altarPieces = altarPieces.filter(function(a) {
      if (distance(a, hunter.p) < 40) {
        collectAltarPiece();
        return false;
      } else {
        return true;
      }
    });
    newarrows = [];
    for (_k = 0, _len1 = arrows.length; _k < _len1; _k++) {
      a = arrows[_k];
      goal = plus(a.p, a.m);
      bar = false;
      patches.eachin(goal, [0, 0], function(patch) {
        if ((distance(patch.p, goal)) < patch.r - 1) {
          return bar = true;
        }
      });
      if (bar) {
        a.p = goal;
      }
      foo = true;
      zombies.eachinradius(a.p, 20, function(zombie) {
        if (foo) {
          zombie.life--;
          return foo = false;
        }
      });
      if (a.h > 1 && foo && bar) {
        a.h -= 1;
        newarrows.push(a);
      }
    }
    arrows = newarrows;
    newbunnies = new parray(5000, 500);
    bunnies.each(function(bunny) {
      var bunnygoal, bunnyspeed, d, dist, f, hd, inter, newd, other, _l, _len2, _ref1;
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
      dist = distance(hunter.p, bunny.p);
      if (dist < 150) {
        bunnies.eachinradius(bunny.p, 150, function(otherbunny) {
          return otherbunny.alarmed = true;
        });
      }
      if (bunny.alarmed) {
        bunny.alarmed = dist < 600;
        bunnyspeed = 10;
        d = 0;
        patch = getPatch(bunny.p);
        _ref1 = patch.n;
        for (_l = 0, _len2 = _ref1.length; _l < _len2; _l++) {
          other = _ref1[_l];
          inter = intersect(patch, other);
          newd = distance(inter, bunny.p);
          hd = distance(inter, hunter.p);
          if (newd < hd && d < hd) {
            d = hd;
            bunnygoal = other.p;
          }
        }
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
          if ((distance(f.p, bunny.p)) > (distance(f2.p, bunny.p))) {
            if ((distance(f2.p, bunny.p)) > (distance(f2.p, hunter.p))) {
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
      bunny.p = walk(bunny.p, bunnygoal, bunnyspeed);
      return newbunnies.add(bunny);
    });
    bunnies = newbunnies;
    doggoal = dogpos;
    if (doghasbunny) {
      if ((distance(dogpos, hunter.p)) < 50) {
        deathbunnycount++;
        doghasbunny = false;
      } else {
        dogspeed = 10;
        doggoal = hunter.p;
      }
    } else {
      db = {
        p: [99999, 99999]
      };
      for (_l = 0, _len2 = deathbunnies.length; _l < _len2; _l++) {
        db2 = deathbunnies[_l];
        dist = distance(db2.p, dogpos);
        if (dist < 500 && dist < (distance(dogpos, db.p))) {
          db = db2;
        }
      }
      if (db.p[0] !== 99999) {
        dogspeed = 10;
        doggoal = db.p;
      } else if (dogrun) {
        if ((distance(dogpos, hunter.p)) > 90) {
          dogspeed = 7;
          doggoal = hunter.p;
        } else {
          dogrun = false;
        }
      } else if ((distance(dogpos, hunter.p)) > 250) {
        dogrun = true;
      }
    }
    dogpos = walk(dogpos, doggoal, dogspeed);
    newzombies = new parray(5000, 500);
    zombies.each(function(zombie) {
      if (nigth < 0.25) {
        zombie.life -= 0.1;
      }
      if (zombie.sleep < 1) {
        if (zombie.subgoalcounter < 1 || (distance(zombie.subgoal, zombie.p)) < zombie.life / 2 || (distance(zombie.p, hunter.p)) < 400) {
          zombie.subgoal = (pathing(zombie.p, altar || hunter.p))[0];
          zombie.subgoalcounter = 200;
        }
        zombie.subgoalcounter--;
        zombie.p = plus(zombie.p, mult(direction(zombie.p, zombie.subgoal), zombie.life / 2));
        zombies.eachinradius(zombie.p, 40, function(other) {
          var _ref1, _ref2;
          if (other !== zombie) {
            if (other.sleep < 5) {
              other.sleep += 10;
            }
            if (((10 > (_ref2 = zombie.life) && _ref2 > (_ref1 = other.life)) && _ref1 > 0)) {
              other.life--;
              return zombie.life++;
            }
          }
        });
        if ((distance(hunter.p, zombie.p)) < 10) {
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
    for (_m = 0, _len3 = deathbunnies.length; _m < _len3; _m++) {
      db = deathbunnies[_m];
      if ((distance(db.p, hunter.p)) < 50) {
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
    var cnvs;
    switch (String.fromCharCode(evt.which)) {
      case ' ':
        if (hunter.target) {
          hunter.target = null;
        } else {
          cnvs = $('canvas');
          mp = minus([evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]);
          hunter.target = plus(mp, minus(hunter.p, [500, 250]));
        }
        break;
      case 'P':
        if (pause) {
          pause = false;
          lastZombieWave = getTime() - lastZombieWaveOffset;
          runGame();
        } else {
          pause = true;
          clearInterval(frameInterval);
          lastZombieWaveOffset = getTime() - lastZombieWave;
          ctx.fillStyle = 'rgba(128,128,128,0.3)';
          fillRect(ctx, [0, 0], [1000, 500]);
          ctx.fillStyle = '#000000';
          ctx.fillText("Press P to continue playing.", 200, 250);
        }
        break;
      default:
        return;
    }
    return evt.preventDefault();
  });

  $(function() {
    var cnvs;
    runStubs(initStubs);
    cnvs = $('canvas');
    ($('canvas')).mousemove(function(evt) {
      mp = minus([evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]);
      return evt.preventDefault();
    });
    ($('canvas')).mousedown(function(evt) {
      mousePressed = true;
      mp = minus([evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]);
      hunter.goal = plus(mp, minus(hunter.p, [500, 250]));
      return true;
    });
    return ($('canvas')).mouseup(function() {
      mousePressed = false;
      return true;
    });
  });

}).call(this);
