###
Copyright (c) 2011-2012 Emanuel Rylke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###
initStubs = []

runStubs = (stubs) ->
  if stubs.length > 0
    stubs.shift()()
    setTimeout (-> runStubs stubs), 1
  #maybe i should have a better solution for when stubs are added after all are processed
  else
    setTimeout (-> runStubs stubs), 300


arrows = []
bunnies = new parray 5000, 500
deathbunnies = []
flowers = new parray 5000, 500
zombies = new parray 5000, 500
patches = new stparray 5000
@patches = patches

randpos = -> 
  loop
    p = [5000 * Math.random(), 5000 * Math.random()]
    foo = false
    patches.eachin p, [0, 0], (patch) ->
      if (distance patch.p, p) < patch.r
        foo = true
    if foo
      return p

hunter = null
knuth = null
dogpos = null
doggoal = null
doghasbunny = false
dogrun = false
dogpath = []
dogspeed = 0
deathbunnycount = 0
mp = [0, 0]
frameInterval = null
getTime = -> (new Date()).getTime()
frameTimer = 0
nigth = null
lastZombieWave = getTime()
lastZombieWaveOffset = 0
zombieWaveSize = 1
shooting = false
pause = false

up = false
down = false
left = false
right = false

drawPs = []

brownbunny = loadImg 'brownbunny.png'
deathbrownbunny = loadImg 'deathbrownbunny.png'
dog = loadImg 'dog.png'
flower = loadImg 'flower.png'
hunterImg = loadImg 'hunter.png'
zombie = loadImg 'zombie.png'

#control flow of doom !
#also needs to be optimized
initStubs.push ->
  while patches.length() < 50
    flpatch = {r: 40 + Math.random() * 400, n: []}
    flpatch.p = [flpatch.r + Math.random() * (5000 - flpatch.r * 2), "foo"]
    flpatch.p[1] = 0 - flpatch.r
    loop
      if flpatch.p[0] - flpatch.r < 0 || flpatch.p[0] + flpatch.r > 5000 || flpatch.p[1] + flpatch.r > 5000
        flpatch.p[1] = Math.min 5000 - flpatch.r, flpatch.p[1]
        patches.add flpatch
        break
      obst = false
      foo = false
      mindist = 50
      patches.eachin (minus flpatch.p, [flpatch.r, flpatch.r]), [flpatch.r * 2, flpatch.r * 2 + 50], (i) ->
        mindist = Math.min mindist, (distance i.p, flpatch.p) + 2 - i.r - flpatch.r
        if (distance i.p, flpatch.p) + 2 < i.r + flpatch.r
          if obst && not foo
            patches.add flpatch
            foo = true
          else
            obst = i
      if foo
        break
      if obst
        flpatch.p[1] += 0.1
        if obst.p[0] < flpatch.p[0]
          flpatch.p[0]++
        else
          flpatch.p[0]--
      else
        flpatch.p[1] += Math.max 1, mindist
  null

initStubs.push ->
  patches.each (patch) ->
    patches.eachinradius patch.p, patch.r, (other) ->
      if patch != other
        patch.n.push other

runGame = ->
  frameInterval = setInterval (->
    try
      step()
    catch err
      clearInterval frameInterval
      throw err
  ), 40

initStubs.push ->
  {p, r} = patches.biggestinradius [4000, 4000], 2000, (x) -> -1 * (distance [4000, 4000], x.p)
  hunter = new Shooter p
  dogpos = plus p, [r / 2, 0]
  doggoal = hunter.p
  {p} = patches.biggestinradius [1000, 4000], 2000, (x) -> x.r / (1500 + (distance x.p, [1000, 4000]))
  knuth = new Shooter p
  runGame()

rand255 = ->
  Math.floor(255 * Math.random())

grasscanvas = ($ '<canvas width="5000" height="5000">')[0]
grassctx = grasscanvas.getContext '2d'
mapcanvas = ($ '<canvas width="1000" height="1000">')[0]
mapctx = mapcanvas.getContext '2d'
mapctx.scale 0.2, 0.2
mapctx.lineWidth = 10
mapctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
mapctx.fillStyle = 'rgba(0, 0, 0, 0.1)'

drawOnMap = (patch) ->
  if not patch.drawn
    {r, p, n} = patch
    for other in n
      fillRect mapctx, (minus (intersect patch, other), [10, 10]), [20, 20]
    mapctx.beginPath()
    arc mapctx, p, r, 0, tau + 0.001
    mapctx.stroke()
    patch.drawn = true

initStubs.push ->
  drawOnMap (getPatch hunter.p)

drawBg = (name, andThen) ->
  bg = new Image()
  ($ bg).load ->
    bgsize = bg.width
    for x in [0..(5000 / bgsize | 0)]
      ((x) ->
        initStubs.push ->
          for y in [0..(5000 / bgsize | 0)]
            grassctx.drawImage bg, x*bgsize, y*bgsize
          null)(x)
    initStubs.push andThen
  bg.src = name

initStubs.push ->
  grassctx.fillStyle = '#44aa00'
  patches.each ({r, p}) -> 
    grassctx.beginPath()
    arc grassctx, p, r, 0, tau + 0.001
    grassctx.fill()
  grassctx.globalCompositeOperation = 'source-atop'
  drawBg 'bg.png', ->
    drawBg 'bg2.png', ->
      patches.each ({r, p}) ->
        grassctx.fillStyle = 'rgba(' + rand255() + ', '+ rand255() + ', ' + rand255() + ', 0.1)'
        grassctx.beginPath()
        arc grassctx, p, r, 0, tau + 0.001
        grassctx.fill()

drawHPBar = (ctx, p, hp, maxhp) ->
  ctx.fillStyle = '#aa2255'
  fillRect ctx, (minus p, [20, 25]), [40, 3]
  ctx.fillStyle = '#00dd00'
  fillRect ctx, (minus p, [20, 25]), [40 * hp / maxhp, 3]

draw = ->
  ctx.fillStyle = '#bbaaaa'
  fillRect ctx, [0, 0], [1000, 500]
  ctx.save()
  translate ctx, minus [500, 250], hunter.p
  drawImage ctx, grasscanvas, [0, 0]
  ctx.strokeStyle = '#000000'
  for {p} in deathbunnies
    drawImage ctx, deathbrownbunny, (minus p, [20, 20])
  flowers.eachin (minus hunter.p, [500, 250]), [1000, 500], ({p}) ->
    drawImage ctx, flower, (minus p, [10, 10])
  bunnies.eachin (minus hunter.p, [500, 250]), [1000, 500], ({p}) ->
    drawImage ctx, brownbunny, (minus p, [20, 20])
  drawImage ctx, dog, (minus dogpos, [20, 20])
  if doghasbunny
    drawImage ctx, deathbrownbunny, (minus dogpos, [10, 10])
  fillRect ctx, (minus knuth.p, [20, 20]), [40, 40]
  drawImage ctx, hunterImg, (minus hunter.p, [20, 20])
  ctx.fillStyle = '#ffffff'
  ctx.fillText "Knuth", knuth.p[0] - 40, knuth.p[1] - 40
  ctx.strokeText "Knuth", knuth.p[0] - 40, knuth.p[1] - 40
  zombies.eachin (minus hunter.p, [500, 250]), [1000, 500], ({p, life}) ->
    drawImage ctx, zombie, (minus p, [20, 20])
    drawHPBar ctx, p, life, 10

  for {p, m} in arrows
    ctx.beginPath()
    moveTo ctx, p
    lineTo ctx, plus p, m
    ctx.closePath()
    ctx.stroke()
  for p in drawPs
    fillRect ctx, p, [10, 10]
  drawPs = []
  ctx.restore()

  ctx.save()
  translate ctx, minus [500, 250], (mult hunter.p, 0.2)
  drawImage ctx, mapcanvas, [0, 0]
  ctx.restore()

  ctx.fillStyle = "rgba(0, 0, 0, #{nigth})"
  fillRect ctx, [0, 0], [1000, 500]
  #put this in own canvas:
  for i in [0...deathbunnycount]
    p = plus [30, 30], [(i ^ (i * 31.31)) % 50, (i ^ (i * 42.42)) % 50]
    drawImage ctx, deathbrownbunny, p
  #drawImage ctx, deathbrownbunny, [20, 20]

  ctx.font = '40px sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.fillText "#{deathbunnycount}", 70, 45
  ctx.strokeText "#{deathbunnycount}", 70, 45

#reverse hitp checking
hitp = (bunny) ->
  for a in arrows
    if contains a.p, (minus bunny.p, [20, 20]), (plus bunny.p, [20, 20])
      a.p = [-100, -100]
      return true
  false

intersect = (patch1, patch2) ->
  plus patch1.p, (mult (direction patch1.p, patch2.p), patch1.r)

getPatch = (p) ->
  res = false
  patches.eachin p, [0, 0], (patch) ->
    if (distance p, patch.p) < patch.r
      res = patch
  return res

#I wish you luck understanding this function and i'm sorry that i didn't document it
pathing = (p1, p2) ->
  p1patch = getPatch p1
  p2patch = getPatch p2
  if not p2patch
    return [p1]
  else if p2patch == p1patch || not p1patch
    return [p2]
  else
    open = [{heurD: (distance p1, p2), measD: 0, p: [p2patch]}]
    closed = []
    loop
      open.sort (a, b) ->
        (a.heurD + a.measD) - (b.heurD + b.measD)
      if open.length == 0
        return [p1]
      pth = open.shift()
      closed.push pth.p[0]
      for n in pth.p[0].n
        if n == p1patch
          return [(intlvmap [n, pth.p...], intersect)..., p2]
        bar = one closed, (x) ->
          x == n
        if not bar
          newpath =
            heurD: (distance p1, (intersect pth.p[0], n))
            measD: (pth.measD + (distance (intersect pth.p[0], n), (if pth.p.length > 1 then (intersect pth.p[0], pth.p[1]) else p2)))
            p: [n, pth.p...]
          bla = true
          for j in [0...(open.length)]
            if open[j].p[0] == n
              if open[j].heurD + open[j].measD > newpath.heurD + newpath.measD
                open[j] = newpath
              bla = false
              break
          if bla
            open.push newpath
  throw "the controlflow should never go here"

walk = (start, goal, speed) ->
  path = pathing start, goal
  plus start, mult (direction start, path[0]), speed

class Shooter
  constructor: (@p) ->
    @target = null
    @lastShoot = 0

  behave: ->
    if @target && frameTimer - 4 > @lastShoot
      arrows.push {h: 30, p: @p, m: mult (direction @p, @target), 20}
      @lastShoot = frameTimer


step = ->
  for patch in (getPatch hunter.p).n
    drawOnMap patch
  

  frameTimer++
  nigth = (((Math.sin frameTimer / (25 * 60)) + 1) / 4)
  goal = [hunter.p[0] + (if right then 1 else 0) - (if left then 1 else 0), hunter.p[1] + (if down then 1 else 0) - (if up then 1 else 0)]
  goal = plus hunter.p, (mult (direction hunter.p, goal), 6)
  foo = true
  patches.eachin goal, [0, 0], (patch) ->
    if (distance patch.p, goal) < patch.r - 1
      hunter.p = goal
      foo = false
  if foo
    patch = getPatch hunter.p
    hunter.p = plus patch.p, (mult (direction patch.p, goal), patch.r - 1)
  bunnies.add {p: randpos(), alarmed: false, life: 100} if bunnies.length() < 5
  flowers.add {p: randpos(), death: false} if ptrue 0.5
  if getTime() - 60 * 1000 > lastZombieWave
    for i in [0...zombieWaveSize]
      zombies.add {p: randpos(), sleep: 100, life: 10, subgoal: [0, 0], subgoalcounter: 0}
    zombieWaveSize++
    lastZombieWave = getTime()
  if hunter.target
    hunter.target = (plus mp, (minus hunter.p, [500, 250]))
  hunter.behave()
  knuth.target = null
  zombies.eachinradius knuth.p, 400, (zombie) ->
    knuth.target = zombie.p
  knuth.behave()
  newarrows = []
  for a in arrows
    goal = plus a.p, a.m
    bar = false
    patches.eachin goal, [0, 0], (patch) ->
      if (distance patch.p, goal) < patch.r - 1
        bar = true
    if bar
      a.p = goal
    foo = true
    zombies.eachinradius a.p, 20, (zombie) ->
      if foo
        zombie.life--
        foo = false
    if a.h > 1 && foo && bar
      a.h -= 1
      newarrows.push a
  arrows = newarrows
  newbunnies = new parray 5000, 500
  bunnies.each (bunny) -> 
    bunnygoal = bunny.p
    bunnyspeed = 0
    if (hitp bunny)
      deathbunnies.push bunny
      return
    if bunny.life < 1
      return 
    bunny.life--
    dist = distance hunter.p, bunny.p
    if dist < 150
      bunnies.eachinradius bunny.p, 150, (otherbunny) ->
        otherbunny.alarmed = true
    if bunny.alarmed
      bunny.alarmed = dist < 600
      bunnyspeed = 10
      #rewrite below to get an hunter.pition that is alway reachable
      bunnygoal = plus bunny.p, mult (direction hunter.p, bunny.p), 100
    else
      if bunny.life > 1000
        bunny.life -= 200
        bunny.life /= 2
        newbunnies.add {
          p: (plus bunny.p, [0, 0]), 
          alarmed: false,
          life: bunny.life}
      f = {p: [99999,99999]}
      flowers.eachin (minus bunny.p, [500, 500]), [1000, 1000], (f2) ->
        if (distance f.p, bunny.p) > (distance f2.p, bunny.p)
          if (distance f2.p, bunny.p) > (distance f2.p, hunter.p)
            other = true
          else 
            other = false
            bunnies.eachin (minus bunny.p, [50, 50]), [100, 100], (otherbunny) ->
              if (bunny != otherbunny) && (distance f2.p, bunny.p) > (distance f2.p, otherbunny.p)
                other = true
          if not other
            f = f2
      if f.p[0] != 99999
        bunnyspeed = 8
        bunnygoal = f.p
        if (distance f.p, bunny.p) < 20
          bunny.life += 50
          f.death = true
    bunny.p = walk bunny.p, bunnygoal, bunnyspeed
    newbunnies.add bunny
  bunnies = newbunnies
  doggoal = dogpos
  if doghasbunny
    if (distance dogpos, hunter.p) < 50
      deathbunnycount++
      doghasbunny = false
    else
      dogspeed = 10
      doggoal = hunter.p
  else
    db = {p: [99999, 99999]}
    for db2 in deathbunnies
      dist = distance db2.p, dogpos
      if dist < 500 && dist < (distance dogpos, db.p)
        db = db2
    if db.p[0] != 99999
      dogspeed = 10
      doggoal = db.p
    else if dogrun
      if (distance dogpos, hunter.p) > 90
        dogspeed = 7
        doggoal = hunter.p
      else
        dogrun = false
    else if (distance dogpos, hunter.p) > 250
      dogrun = true
  dogpos = walk dogpos, doggoal, dogspeed
  newzombies = new parray 5000, 500
  zombies.each (zombie) ->
    if nigth < 0.25
      zombie.life -= 0.1
    if zombie.sleep < 1
      if zombie.subgoalcounter < 1 || (distance zombie.subgoal, zombie.p) < zombie.life / 2 || (distance zombie.p, hunter.p) < 400
        zombie.subgoal = (pathing zombie.p, hunter.p)[0]
        zombie.subgoalcounter = 200
      zombie.subgoalcounter--
      zombie.p = plus zombie.p, (mult (direction zombie.p, zombie.subgoal), zombie.life / 2)
      zombies.eachinradius zombie.p, 40, (other) ->
        if other != zombie
          if other.sleep < 5
            other.sleep += 10
          if 10 > zombie.life > other.life > 0
            other.life--
            zombie.life++
      if (distance hunter.p, zombie.p) < 10
        pr "You die! but you got #{deathbunnycount} bunnies!"
        clearInterval frameInterval
    else
      zombie.sleep--
    if zombie.life > 0
      newzombies.add zombie
  zombies = newzombies
  newdeathbunnies = []
  for db in deathbunnies
    if (distance db.p, hunter.p) < 50 
      deathbunnycount++
    else if (not doghasbunny) && (distance db.p, dogpos) < 50
      doghasbunny = true
    else
      newdeathbunnies.push db
  deathbunnies = newdeathbunnies
  newflowers = new parray 5000, 500
  flowers.each (f) ->
    if not f.death
      newflowers.add f
  flowers = newflowers
  draw()

($ document).keydown (evt) ->
  switch String.fromCharCode(evt.which)
    when 'A'
      left = true
    when 'S'
      down = true
    when 'W'
      up = true
    when 'D'
      right = true
    when ' '
      if hunter.target
        hunter.target = null
      else
        cnvs = $ 'canvas'
        mp = minus [evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]
        hunter.target = (plus mp, (minus hunter.p, [500, 250]))
    when 'P'
      if pause
        pause = false
        lastZombieWave = getTime() - lastZombieWaveOffset
        runGame()
      else
        pause = true
        clearInterval frameInterval
        lastZombieWaveOffset = getTime() - lastZombieWave
        ctx.fillStyle = 'rgba(128,128,128,0.3)'
        fillRect ctx, [0, 0], [1000, 500]
        ctx.fillStyle = '#000000'
        ctx.fillText "Press P to continue playing.", 200, 250
    else
      return
  evt.preventDefault()

($ document).keyup (evt) ->
  switch String.fromCharCode evt.which
    when 'A'
      left = false
    when 'S'
      down = false
    when 'W'
      up = false
    when 'D'
      right = false
    else
      return
  evt.preventDefault()

$ ->
  runStubs initStubs
  cnvs = $ 'canvas'
  ($ 'canvas').mousemove (evt) ->
    mp = minus [evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]
    evt.preventDefault()
  ($ 'canvas').mousedown (evt) ->
    mp = minus [evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]
    true
  ($ 'canvas').mouseup ->
    true

