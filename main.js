////////////////////////////////////////////////////////////////////////////////////////
//
// MAIN LOGIC
//
var app = new p2.WebGLRenderer(function () {
  var world = new p2.World({
    gravity: [0, -10],
  })
  this.setWorld(world)

  world.solver.iterations = 100
  world.solver.tolerance = 0.002

  // create ragdoll
  var playerBodyParts = createRagdoll(p2, -1, -1)
  window.playerBodyParts = playerBodyParts
  playerBodyParts.forEach(function (bodyPart) {
    bodyPart.type = p2.Body.KINEMATIC
    world.addBody(bodyPart)
  })
  var playerConstraints = createRagdollConstraints(p2, playerBodyParts)
  window.playerConstraints = playerConstraints
  playerConstraints.forEach(function (constraint) {
    world.addConstraint(constraint)
  })

  // other ragdoll
  var otherBodyParts = createRagdoll(p2, 1, -1, {
    isSideView: true,
    isOther: true,
  })
  window.otherBodyParts = otherBodyParts
  otherBodyParts.forEach(function (bodyPart) {
    world.addBody(bodyPart)
  })
  var otherConstraints = createRagdollConstraints(p2, otherBodyParts, {
    isSideView: true,
  })
  otherConstraints.forEach(function (constraint) {
    world.addConstraint(constraint)
  })

  // Create ground
  var planeShape = new p2.Plane()
  var plane = new p2.Body({
    position: [0, -2.3],
  })
  plane.addShape(planeShape)
  planeShape.collisionGroup = GROUND
  planeShape.collisionMask =
    BODY_CENTER | BODY_LEFT | BODY_RIGHT | OTHER | OTHER_RAGDOLL
  world.addBody(plane)

  this.newShapeCollisionGroup = OTHER
  this.newShapeCollisionMask =
    BODY_CENTER | BODY_LEFT | BODY_RIGHT | GROUND | OTHER | OTHER_RAGDOLL

  window.play = function () {
    clearGhostBodyParts()

    if (keyframes.length > 0) {
      playerBodyParts.forEach(function (bodyPart) {
        bodyPart.position = keyframes[0][bodyPart.id].position
        bodyPart.angle = keyframes[0][bodyPart.id].angle
      })
    }
    window.playerBodyParts.forEach((bodyPart) => {
      bodyPart.shapes[0].collisionMask = GROUND | OTHER | OTHER_RAGDOLL
    })
    window.otherBodyParts.forEach((bodyPart) => {
      bodyPart.shapes[0].collisionMask =
        GROUND | OTHER | BODY_CENTER | BODY_LEFT | BODY_RIGHT
    })

    var i = 0
    var loop = setInterval(function () {
      if (i < keyframes.length) {
        playerBodyParts.forEach(function (bodyPart) {
          bodyPart.position = keyframes[i][bodyPart.id].position
          bodyPart.angle = keyframes[i][bodyPart.id].angle
        })
        i++
      } else {
        clearInterval(loop)
        // set all bodyparts to DYNAMIC
        playerBodyParts.forEach(function (bodyPart) {
          bodyPart.type = p2.Body.DYNAMIC
        })
      }
    }, 20)
  }

  document.addEventListener("keydown", function (e) {
    // when enter is pressed, loop through keyframes and set bodyPart positions
    if (e.keyCode === 13) {
      // Enter
      play()
    }
    // when k is pressed, record bodyPart positions
    if (e.keyCode === 75) {
      // "k"
      addKeyframe()
    }
    // when 'z' is pressed, clear local storage keyframes
    if (e.keyCode === 90) {
      // "z"
      clearKeyframes()
    }
  })

  window.keyframeSliderInput = function (value) {
    if (value < keyframes.length) {
      const keyframe = keyframes[value]
      playerBodyParts.forEach(function (bodyPart) {
        bodyPart.position = keyframe[bodyPart.id].position
        bodyPart.angle = keyframe[bodyPart.id].angle
      })
    }
  }
})
