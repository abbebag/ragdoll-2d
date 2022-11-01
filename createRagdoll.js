////////////////////////////////////////////////////////////////////////////////////////
//
// Ragdoll
//
const ragdollDefaults = {
  shouldersDistance: 0.5,
  upperArmLength: 0.5,
  lowerArmLength: 0.5,
  upperArmSize: 0.2,
  lowerArmSize: 0.2,
  neckLength: 0.1,
  headRadius: 0.25,
  upperBodyLength: 0.6,
  pelvisLength: 0.4,
  upperLegLength: 0.6,
  upperLegSize: 0.2,
  lowerLegSize: 0.2,
  lowerLegLength: 0.6,
}

const createRagdoll = (p2, x, y, options = {}) => {
  const { isSideView, isOther } = options

  const collisionMask = OTHER | GROUND

  const {
    shouldersDistance,
    upperArmLength,
    lowerArmLength,
    upperArmSize,
    lowerArmSize,
    neckLength,
    headRadius,
    upperBodyLength,
    pelvisLength,
    upperLegLength,
    upperLegSize,
    lowerLegSize,
    lowerLegLength,
  } = ragdollDefaults

  // Head
  var head = new p2.Body({
    mass: 1,
    position: [x, y + pelvisLength + upperBodyLength + headRadius + neckLength],
  })
  var headShape = new p2.Circle({ radius: headRadius })
  headShape.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_CENTER
  headShape.collisionMask = collisionMask
  head.addShape(headShape)

  // Upper Body
  var upperBody = new p2.Body({
    mass: 1,
    position: [x, y + pelvisLength + upperBodyLength / 2],
  })
  var upperBodyShape = new p2.Box({
    width: shouldersDistance,
    height: upperBodyLength,
  })
  upperBodyShape.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_CENTER
  upperBodyShape.collisionMask = collisionMask
  upperBody.addShape(upperBodyShape)

  // Neck joint
  var neckJoint = new p2.RevoluteConstraint(head, upperBody, {
    localPivotA: [0, -headRadius - neckLength / 2],
    localPivotB: [0, upperBodyLength / 2],
  })
  neckJoint.setLimits(-Math.PI / 8, Math.PI / 8)

  // Upper Left Arm
  var upperLeftArm = new p2.Body({
    mass: 1,
    position: [
      x - upperArmLength / 2,
      upperBody.position[1] + upperBodyLength / 2,
    ],
  })
  var upperArmShapeLeft = new p2.Box({
    width: upperArmLength,
    height: upperArmSize,
  })
  upperArmShapeLeft.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_LEFT
  upperArmShapeLeft.collisionMask = collisionMask
  upperLeftArm.addShape(upperArmShapeLeft)

  // Upper Right Arm
  var upperRightArm = new p2.Body({
    mass: 1,
    position: [
      x + upperArmLength / 2,
      upperBody.position[1] + upperBodyLength / 2,
    ],
  })
  var upperArmShapeRight = new p2.Box({
    width: upperArmLength,
    height: upperArmSize,
  })
  upperArmShapeRight.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_RIGHT
  upperArmShapeRight.collisionMask = collisionMask
  upperRightArm.addShape(upperArmShapeRight)

  // Shoulders
  var leftShoulder = new p2.RevoluteConstraint(upperBody, upperLeftArm, {
    localPivotA: [0, upperBodyLength / 2],
    localPivotB: [upperArmLength / 2, 0],
  })
  var rightShoulder = new p2.RevoluteConstraint(upperBody, upperRightArm, {
    localPivotA: [0, upperBodyLength / 2],
    localPivotB: [-upperArmLength / 2, 0],
  })
  //leftShoulder.setLimits(-Math.PI / 3, Math.PI / 3)
  //rightShoulder.setLimits(-Math.PI / 3, Math.PI / 3)

  // Lower Left Arm
  var lowerLeftArm = new p2.Body({
    mass: 1,
    position: [
      upperLeftArm.position[0] - lowerArmLength / 2 - upperArmLength / 2,
      upperLeftArm.position[1],
    ],
  })
  var lowerArmShapeLeft = new p2.Box({
    width: lowerArmLength,
    height: lowerArmSize,
  })
  lowerArmShapeLeft.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_LEFT
  lowerArmShapeLeft.collisionMask = collisionMask
  lowerLeftArm.addShape(lowerArmShapeLeft)

  // Lower Right Arm
  var lowerRightArm = new p2.Body({
    mass: 1,
    position: [
      upperRightArm.position[0] + lowerArmLength / 2 + upperArmLength / 2,
      upperRightArm.position[1],
    ],
  })
  var lowerArmShapeRight = new p2.Box({
    width: lowerArmLength,
    height: lowerArmSize,
  })
  lowerArmShapeRight.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_RIGHT
  lowerArmShapeRight.collisionMask = collisionMask
  lowerRightArm.addShape(lowerArmShapeRight)

  // Elbow joint
  var leftElbowJoint = new p2.RevoluteConstraint(lowerLeftArm, upperLeftArm, {
    localPivotA: [lowerArmLength / 2, 0],
    localPivotB: [-upperArmLength / 2, 0],
  })
  var rightElbowJoint = new p2.RevoluteConstraint(
    lowerRightArm,
    upperRightArm,
    {
      localPivotA: [-lowerArmLength / 2, 0],
      localPivotB: [upperArmLength / 2, 0],
    }
  )
  leftElbowJoint.setLimits(-Math.PI / 2, 0)
  rightElbowJoint.setLimits(-Math.PI / 2, 0)

  // Pelvis
  var pelvis = new p2.Body({
    mass: 1,
    position: [x, y + pelvisLength / 2],
  })
  var pelvisShape = new p2.Box({
    width: shouldersDistance,
    height: pelvisLength,
  })
  pelvisShape.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_CENTER
  pelvisShape.collisionMask = collisionMask
  pelvis.addShape(pelvisShape)

  // Spine Joint
  var spineJoint = new p2.RevoluteConstraint(pelvis, upperBody, {
    localPivotA: [0, pelvisLength / 2],
    localPivotB: [0, -upperBodyLength / 2],
  })
  spineJoint.setLimits(-Math.PI / 8, Math.PI / 8)
  world.addConstraint(spineJoint)

  // Upper Left Leg
  var upperLeftLeg = new p2.Body({
    mass: 1,
    position: [
      pelvis.position[0] + (isSideView ? shouldersDistance / 2 : 0),
      pelvis.position[1] - pelvisLength / 2 - upperLegLength / 2,
    ],
  })
  var upperLegShapeLeft = new p2.Box({
    width: upperLegSize,
    height: upperLegLength,
  })
  upperLegShapeLeft.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_LEFT
  upperLegShapeLeft.collisionMask = collisionMask
  upperLeftLeg.addShape(upperLegShapeLeft)

  // Upper Right Leg
  var upperRightLeg = new p2.Body({
    mass: 1,
    position: [
      pelvis.position[0] - (isSideView ? shouldersDistance / 2 : 0),
      pelvis.position[1] - pelvisLength / 2 - upperLegLength / 2,
    ],
  })
  var upperLegShapeRight = new p2.Box({
    width: upperLegSize,
    height: upperLegLength,
  })
  upperLegShapeRight.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_RIGHT
  upperLegShapeRight.collisionMask = collisionMask
  upperRightLeg.addShape(upperLegShapeRight)

  // Hip joints
  var leftHipJoint = new p2.RevoluteConstraint(upperLeftLeg, pelvis, {
    localPivotA: [0, upperLegLength / 2],
    localPivotB: [isSideView ? shouldersDistance / 2 : 0, -pelvisLength / 2],
  })
  var rightHipJoint = new p2.RevoluteConstraint(upperRightLeg, pelvis, {
    localPivotA: [0, upperLegLength / 2],
    localPivotB: [isSideView ? -shouldersDistance / 2 : 0, -pelvisLength / 2],
  })

  if (!isSideView) {
    leftHipJoint.setLimits(-Math.PI / 2, Math.PI / 2)
    rightHipJoint.setLimits(-Math.PI / 2, Math.PI / 2)
  } else {
    leftHipJoint.setLimits(-Math.PI / 8, Math.PI / 8)
    rightHipJoint.setLimits(-Math.PI / 8, Math.PI / 8)
  }

  // Lower Left Leg
  var lowerLeftLeg = new p2.Body({
    mass: 1,
    position: [
      upperLeftLeg.position[0],
      upperLeftLeg.position[1] - lowerLegLength,
    ],
  })
  var lowerLegShapeLeft = new p2.Box({
    width: lowerLegSize,
    height: lowerLegLength,
  })
  lowerLegShapeLeft.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_LEFT
  lowerLegShapeLeft.collisionMask = collisionMask
  lowerLeftLeg.addShape(lowerLegShapeLeft)

  // Lower Right Leg
  var lowerRightLeg = new p2.Body({
    mass: 1,
    position: [
      upperRightLeg.position[0],
      upperRightLeg.position[1] - lowerLegLength,
    ],
  })
  var lowerLegShapeRight = new p2.Box({
    width: lowerLegSize,
    height: lowerLegLength,
  })
  lowerLegShapeRight.collisionGroup = isOther ? OTHER_RAGDOLL : BODY_RIGHT
  lowerLegShapeRight.collisionMask = collisionMask
  lowerRightLeg.addShape(lowerLegShapeRight)

  // Knee joints
  var leftKneeJoint = new p2.RevoluteConstraint(lowerLeftLeg, upperLeftLeg, {
    localPivotA: [0, lowerLegLength / 2],
    localPivotB: [0, -upperLegLength / 2],
  })
  var rightKneeJoint = new p2.RevoluteConstraint(lowerRightLeg, upperRightLeg, {
    localPivotA: [0, lowerLegLength / 2],
    localPivotB: [0, -upperLegLength / 2],
  })
  if (!isSideView) {
    leftKneeJoint.setLimits(upperLeftLeg.angle, Math.PI)
    rightKneeJoint.setLimits(upperRightLeg.angle, Math.PI)
  } else {
    leftKneeJoint.setLimits(-Math.PI / 8, Math.PI / 8)
    rightKneeJoint.setLimits(-Math.PI / 8, Math.PI / 8)
  }

  const bodyParts = [
    lowerLeftLeg,
    lowerRightLeg,
    upperLeftLeg,
    upperRightLeg,
    pelvis,
    upperBody,
    head,
    upperLeftArm,
    upperRightArm,
    lowerLeftArm,
    lowerRightArm,
  ]

  return bodyParts
}

const createRagdollConstraints = (p2, bodyParts, options = {}) => {
  const lowerLeftLeg = bodyParts[0]
  const lowerRightLeg = bodyParts[1]
  const upperLeftLeg = bodyParts[2]
  const upperRightLeg = bodyParts[3]
  const pelvis = bodyParts[4]
  const upperBody = bodyParts[5]
  const head = bodyParts[6]
  const upperLeftArm = bodyParts[7]
  const upperRightArm = bodyParts[8]
  const lowerLeftArm = bodyParts[9]
  const lowerRightArm = bodyParts[10]

  const {
    shouldersDistance,
    upperArmLength,
    lowerArmLength,
    upperArmSize,
    lowerArmSize,
    neckLength,
    headRadius,
    upperBodyLength,
    pelvisLength,
    upperLegLength,
    upperLegSize,
    lowerLegSize,
    lowerLegLength,
  } = ragdollDefaults

  const { isSideView } = options

  // Neck joint
  var neckJoint = new p2.RevoluteConstraint(head, upperBody, {
    localPivotA: [0, -headRadius - neckLength / 2],
    localPivotB: [0, upperBodyLength / 2],
  })
  neckJoint.setLimits(-Math.PI / 8, Math.PI / 8)

  // Shoulder joints
  var leftShoulder = new p2.RevoluteConstraint(upperBody, upperLeftArm, {
    localPivotA: [0, upperBodyLength / 2],
    localPivotB: [upperArmLength / 2, 0],
  })
  var rightShoulder = new p2.RevoluteConstraint(upperBody, upperRightArm, {
    localPivotA: [0, upperBodyLength / 2],
    localPivotB: [-upperArmLength / 2, 0],
  })
  //leftShoulder.setLimits(-Math.PI / 3, Math.PI / 3)
  //rightShoulder.setLimits(-Math.PI / 3, Math.PI / 3)

  // Elbow joint
  var leftElbowJoint = new p2.RevoluteConstraint(lowerLeftArm, upperLeftArm, {
    localPivotA: [lowerArmLength / 2, 0],
    localPivotB: [-upperArmLength / 2, 0],
  })
  var rightElbowJoint = new p2.RevoluteConstraint(
    lowerRightArm,
    upperRightArm,
    {
      localPivotA: [-lowerArmLength / 2, 0],
      localPivotB: [upperArmLength / 2, 0],
    }
  )
  leftElbowJoint.setLimits(-Math.PI / 2, 0)
  rightElbowJoint.setLimits(-Math.PI / 2, 0)

  // Spine Joint
  var spineJoint = new p2.RevoluteConstraint(pelvis, upperBody, {
    localPivotA: [0, pelvisLength / 2],
    localPivotB: [0, -upperBodyLength / 2],
  })
  spineJoint.setLimits(-Math.PI / 8, Math.PI / 8)
  world.addConstraint(spineJoint)

  // Hip joints
  var leftHipJoint = new p2.RevoluteConstraint(upperLeftLeg, pelvis, {
    localPivotA: [0, upperLegLength / 2],
    localPivotB: [isSideView ? shouldersDistance / 2 : 0, -pelvisLength / 2],
  })
  var rightHipJoint = new p2.RevoluteConstraint(upperRightLeg, pelvis, {
    localPivotA: [0, upperLegLength / 2],
    localPivotB: [isSideView ? -shouldersDistance / 2 : 0, -pelvisLength / 2],
  })

  if (!isSideView) {
    leftHipJoint.setLimits(-Math.PI / 2, Math.PI / 2)
    rightHipJoint.setLimits(-Math.PI / 2, Math.PI / 2)
  } else {
    leftHipJoint.setLimits(-Math.PI / 8, Math.PI / 8)
    rightHipJoint.setLimits(-Math.PI / 8, Math.PI / 8)
  }

  // Knee joints
  var leftKneeJoint = new p2.RevoluteConstraint(lowerLeftLeg, upperLeftLeg, {
    localPivotA: [0, lowerLegLength / 2],
    localPivotB: [0, -upperLegLength / 2],
  })
  var rightKneeJoint = new p2.RevoluteConstraint(lowerRightLeg, upperRightLeg, {
    localPivotA: [0, lowerLegLength / 2],
    localPivotB: [0, -upperLegLength / 2],
  })
  if (!isSideView) {
    leftKneeJoint.setLimits(upperLeftLeg.angle, Math.PI)
    rightKneeJoint.setLimits(upperRightLeg.angle, Math.PI)
  } else {
    leftKneeJoint.setLimits(-Math.PI / 8, Math.PI / 8)
    rightKneeJoint.setLimits(-Math.PI / 8, Math.PI / 8)
  }

  const constraints = [
    neckJoint,
    leftShoulder,
    rightShoulder,
    leftElbowJoint,
    rightElbowJoint,
    spineJoint,
    leftHipJoint,
    rightHipJoint,
    leftKneeJoint,
    rightKneeJoint,
  ]

  return constraints
}
