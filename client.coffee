arrows = []
bunnies = new parray 5000, 500
deathbunnies = []
flowers = new parray 5000, 500

pathdepth = 10

# the numbers are not quite 5000 because this would mean that flowers would get to a place where bunnies would seek them but wouldn't reach
randpos = -> 
  res = [4950 * Math.random(), 4950 * Math.random()]
  for {p, r} in rocks.near res
    if (distance p, res) < r
      return randpos()
  res

rocks = new parray 5000, 500
###
setRock = ({p, r}, arc) ->
  if ptrue 0.1
    setRock {p, r * 0.7}, arc - 1
    setRock {p, r * 0.7}, arc - 2
  else
    arc += Math.random() - 0.5 
    newrock = 
      p: (plus p, (mult [(Math.sin arc), (Math.cos arc)], r * 1.5)),
      r: Math.min(200, (Math.random() + 0.4) * r)
    rocks.add newrock
    if newrock.r > 10
      setRock newrock, arc

setRock {p: [2500, 2500], r: 200}, 0
setRock {p: [2500, 2500], r: 200}, Math.PI
###
for i in [0..5000]
  p = randpos()
  m = mult (sincos Math.random() * Math.PI * 2), 50
  loop
    p = plus p, m
    r = {p: [99999, 99999]}
    rocks.eachin (minus p, [400, 400]), [800, 800], (r2) ->
      if (Math.min (distance p, r.p), 400) > (distance p, r2.p) 
        r = r2
    if r.p[0] != 99999
      if ptrue r.r / 200
        rocks.add {p: (plus r.p, (mult (direction r.p, p), r.r * 1.7)), r: 5}
      else
        r.r += 5
      break
    else
      if p[0] < 0
        rocks.add {p: [0, p[1]], r: 5}
        break
      else if p[0] > 5000
        rocks.add {p: [4999, p[1]], r: 5}
        break
      else if p[1] < 0
        rocks.add {p: [p[0], 0], r: 5}
        break
      else if p[1] > 5000
        rocks.add {p: [p[0], 4999], r: 5}
        break

newrocks = new parray 5000, 500
rocks.each (rck) ->
  foo = true
  rocks.eachin (minus rck.p, [rck.r, rck.r]), [rck.r * 2, rck.r * 2], (rck2) ->
    b = distance rck.p, rck2.p
    if b + rck.r < rck2.r
      foo = false
  if foo
    newrocks.add rck

rocks = newrocks

rocks.each (rck) ->
  rck.n = []
  rocks.eachin (minus rck.p, [400, 400]), [800, 800], (rck2) ->
    b = distance rck.p, rck2.p
    if b > 0 && b < rck.r + rck2.r
      foo = Math.acos (rck.r * rck.r + b * b - rck2.r * rck2.r) / (2 * rck.r * b)
      bar = asincos (direction rck.p, rck2.p)
      rck.n.push [bar + foo, bar - foo, rck2]

###
foo = (r) ->
  r.r++
  rdist = distance r.p, [2500, 2500]
  r3 = {p: [99999, 99999]}
  for r2 in rocks.near r.p
    if rdist < (distance r2.p, [2500, 2500]) && (distance r3.p, r.p) > (distance r2.p, r.p)
      r3 = r2
  if r3.p[0] != 99999
    foo r3




rocks.each (r) ->
  foo r
###

pos = [1250, 1250]
dogpos = [1300, 1300]
doghasbunny = false
dogrun = false
dogpath = []
doggoal = pos
deathbunnycount = 0
mp = [0, 0]
quux = 0

up = false
down = false
left = false
right = false


drawPs = []

bg = loadImg 'bg.png'
bg2 = loadImg 'bg2.png'
brownbunny = loadImg 'brownbunny.png'
deathbrownbunny = loadImg 'deathbrownbunny.png'
dog = loadImg 'dog.png'
flower = loadImg 'flower.png'
hunter = loadImg 'hunter.png'

rou_ound = (rck, start, goal, sign, depth) ->
  if rck == start || rck == goal
    return path start, goal, sign, depth - 1
  bar = cctangent start, rck, sign 
  bar2 = cctangent goal, rck, sign * -1 
  avg = ((bar + bar2 + (if bar * sign > bar2 * sign then tau else 0)) / 2)
  r = (arcdist bar, bar2) / 2
  for i in rck.n
    if (arcdist ((i[0] + i[1]) / 2), avg) < ((arcdist i[0], i[1]) / 2 + r) && depth > 0
      #return (path start, rck, sign, depth - 1).concat [rck], (rou_ound i[2], rck, goal, sign, depth - 1)
      #return (path start, rck, sign, depth - 1).concat [rck], (rou_ound i[2], rck, rck, sign, depth - 1), [rck], (path rck, goal, sign, depth - 1)
      return (path start, rck, sign, depth - 1).concat [rck], (path rck, i[2], sign, depth - 1), [i[2]], (path i[2], goal, sign, depth - 1)
      #return rou_ound(i[2], start, goal, sign, depth - 1)
  #if depth < 1
    #console.trace()
    #throw 'bar'
  foo = path start, rck, sign, depth - 1
  foo2 = path rck, goal, sign, depth - 1
  return foo.concat([rck], foo2)

cleanPath = (pth, sign) ->
  if pth.length > 6
    p1 = ponc pth[1], pth[2]
    p2 = ponc pth[3], pth[2]
    p3 = ponc pth[3], pth[4]
    p4 = ponc pth[5], pth[4]
    [bool, croosp] = llcross p1, p2, p3, p4
    if bool
      (pth.slice 0, 2).concat (path pth[1], pth[5], sign, pathdepth), pth.slice 5
    else
      (pth.slice 0, 2).concat cleanPath (pth.slice 2), sign
  else
    pth

#depth is sometimes maxed out. needs debugging
path = (start, goal, sign, depth) ->
  if start == goal
    console.trace()
    drawPs.push start.p
    #@dbg = [start, depth]
    throw 'start == goal'
    #gets triggert sometimes
    #pr depth
  foo = cctangent start, goal, sign
  if isNaN(foo)
    foo = 0
  obst = false
  pa = ponc start, foo
  pb = ponc goal, foo
  rocks.eachin (minus (min pa, pb), [200, 200]), (plus (abs minus pa, pb), [200, 200]), (rck) ->
    if start != rck && goal != rck && (pldist pa, pb, rck.p) < rck.r
      obst = rck
  if obst && depth > 0
    return rou_ound obst, start, goal, sign, depth - 0
  else
    #if depth < 1
    #  console.trace()
    #  throw 'foo'
    return [foo]

draw = ->
  #clearRect ctx, [0, 0], [500, 500]
  ctx.fillStyle = '#000000'
  #fillRect ctx, [0, 0], [1000, 500]
  ctx.save()
  translate ctx, minus [500, 250], pos
  #make a function
  foo = bg.width
  for x in [((pos[0] - 500) / foo | 0)..((pos[0] + 500) / foo | 0)]
    for y in [((pos[1] - 250) / foo | 0)..((pos[1] + 250) / foo | 0)]
      ctx.drawImage bg, x*foo, y*foo
  foo = bg2.width
  for x in [((pos[0] - 500) / foo | 0)..((pos[0] + 500) / foo | 0)]
    for y in [((pos[1] - 250) / foo | 0)..((pos[1] + 250) / foo | 0)]
      ctx.drawImage bg2, x*foo, y*foo
  #ctx.fillStyle = '#bbaaaa'
  ctx.fillStyle = 'rgba(200, 150, 150, 0.5)'
  rocks.eachin (minus pos, [700, 450]), [1400, 900], (rck) -> 
    ctx.beginPath()
    arc ctx, rck.p, rck.r, 0, -Math.PI * 2
    ctx.fill()
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  moveTo ctx, dogpos
  i = 1
  while i < dogpath.length - 1
    arc ctx, dogpath[i].p, dogpath[i].r, dogpath[i-1], dogpath[i+1], true
    i += 2
  lineTo ctx, doggoal
  ctx.stroke()
  for {p} in deathbunnies
    drawImage ctx, deathbrownbunny, (minus p, [20, 20])
  for {p, death} in flowers.near pos
    drawImage ctx, flower, (minus p, [10, 10])
  for {p} in bunnies.near pos
    drawImage ctx, brownbunny, (minus p, [20, 20])
  drawImage ctx, dog, (minus dogpos, [20, 20])
  if doghasbunny
    drawImage ctx, deathbrownbunny, (minus dogpos, [10, 10])
  drawImage ctx, hunter, (minus pos, [20, 20])
  for {p, m} in arrows
    ctx.beginPath()
    moveTo ctx, p
    lineTo ctx, plus p, m
    ctx.closePath()
    ctx.stroke()
  ctx.lineWidth = 400
  strokeRect ctx, [-200, -200], [5400, 5400]
  for p in drawPs
    fillRect ctx, p, [10, 10]
  drawPs = []
  ctx.restore()
  for i in [0...deathbunnycount]
    p = plus [30, 30], [i ^ (i * 31.31) % 50, i ^ (i * 42.42) % 50]
    drawImage ctx, deathbrownbunny, p




hitp = (bunny) ->
  for a in arrows
    if contains (plus a.p, a.m), (minus bunny.p, [20, 20]), (plus bunny.p, [20, 20])
      a.p = [-100, -100]
      return true
  false

bouncerock = (p) ->
  run = true
  while run
    run = false
    rocks.eachin (minus p, [200, 200]), [400, 400], ({p: p2, r}) -> 
      dist = distance p2, p
      if dist < r
        run = true
        p = plus p, (mult (direction p2, p), 0.01 + r - dist)
  p

step = ->
  goal = [pos[0] + (if right then 1 else 0) - (if left then 1 else 0), pos[1] + (if down then 1 else 0) - (if up then 1 else 0)]
  pos = bouncerock plus pos, (mult (direction pos, goal), 6)
  bunnies.add({p: randpos(), alarmed: false, life: 100}) if bunnies.length() < 5
  flowers.add({p: randpos(), death: false})
  newarrows = []
  for a in arrows
    a.p = plus a.p, a.m
    for {p, r} in rocks.near a.p
      if (distance a.p, p) < r
        a.h = 0
    if a.h > 1
      a.h -= 1
      newarrows.push a
  arrows = newarrows
  newbunnies = new parray 5000, 500
  bunnies.each (bunny) -> 
    if (hitp bunny)
      deathbunnies.push bunny
      return
    if bunny.life < 1
      return 
    bunny.life--
    for otherbunny in bunnies.near bunny.p when not (bunny == otherbunny)
      if (pyth minus bunny.p, otherbunny.p) < 50
        bunny.p = bouncerock plus bunny.p, mult (direction otherbunny.p, bunny.p), 2
    dist = pyth minus pos, bunny.p
    if dist < 150 #&& false
      for otherbunny in bunnies.near bunny.p
        dist2 = pyth minus bunny.p, otherbunny.p
        if dist2 < 150
          otherbunny.alarmed = true
    if bunny.alarmed
      bunny.alarmed = dist < 600
      bunny.p = bouncerock plus bunny.p, mult (direction pos, bunny.p), 10
    else
      if bunny.life > 1000
        bunny.life -= 200
        bunny.life /= 2
        newbunnies.add {
          p: (plus bunny.p, [20, 20]), 
          alarmed: false,
          life: bunny.life}
      f = {p: [99999,99999]}
      for f2 in flowers.near bunny.p
        if (distance f.p, bunny.p) > (distance f2.p, bunny.p)
          if (distance f2.p, bunny.p) > (distance f2.p, pos)
            other = true
          else 
            other = false
            for otherbunny in bunnies.near bunny.p when not (bunny == otherbunny)
              if (distance f2.p, bunny.p) > (distance f2.p, otherbunny.p)
                other = true
                break
          if not other
            for {p, r} in rocks.near bunny.p
              if (pldist bunny.p, f2.p, p) < r
                other = true
          if not other
            f = f2
      if f.p[0] != 99999
        bunny.p = bouncerock plus bunny.p, mult (direction bunny.p, f.p), 8
        if (pyth minus f.p, bunny.p) < 20
          bunny.life += 50
          f.death = true
    if bunny.p[0] < 0
      bunny.p[0] = 0
    else if bunny.p[0] > 4960
      bunny.p[0] = 4960
    if bunny.p[1] < 0
      bunny.p[1] = 0
    else if bunny.p[1] > 4960
      bunny.p[1] = 4960
    newbunnies.add bunny
  bunnies = newbunnies
  doggoal = dogpos
  if doghasbunny
    if (distance dogpos, pos) < 50
      deathbunnycount++
      doghasbunny = false
    else
      dogpos = bouncerock plus dogpos, mult (direction dogpos, pos), 10
      doggoal = pos
  else
    db = {p: [99999, 99999]}
    for db2 in deathbunnies
      dist = distance db2.p, dogpos
      if dist < 500 && dist < (distance dogpos, db.p)
        db = db2
    if db.p[0] != 99999
      dogpos = bouncerock plus dogpos, mult (direction dogpos, db.p), 10
      doggoal = db.p
    else if dogrun
      if (distance dogpos, pos) > 90
        dogpos = bouncerock plus dogpos, mult (direction dogpos, pos), 7
        doggoal = pos
      else
        dogrun = false
    else if (distance dogpos, pos) > 250
      dogrun = true
  dogpath = cleanPath (path {p: dogpos, r: 0}, {p: doggoal, r: 0}, 1, pathdepth), 1
  for i in [0..20]
    dogpath = cleanPath dogpath, 1
  newdeathbunnies = []
  for db in deathbunnies
    if (distance db.p, pos) < 50 
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
    when 'T'
      pathdepth--
    when 'Z'
      pathdepth++
      
shoot = ->
  arrows.push {h: 30, p: pos, m: mult (direction pos, (plus mp, (minus pos, [500, 250]))), 20}

shootId = false

$ ->
  quux = setInterval (->
    try
      step()
    catch err
      clearInterval quux
      throw err
  ), 40
  #setTimeout (-> clearInterval quux), 100
  cnvs = $ 'canvas'
  ($ 'canvas').mousemove (evt) ->
    mp = minus [evt.pageX, evt.pageY], [cnvs.offset().left, cnvs.offset().top]
  ($ 'canvas').click ->
    shoot()
  ($ 'canvas').mousedown ->
    shoot
    #maybe a previous mouseup wasn't recorded because the courser was in a sepperate window or something
    clearInterval shootId
    shootId = setInterval shoot, 320
    true
  ($ 'canvas').mouseup ->
    clearInterval shootId
    true

