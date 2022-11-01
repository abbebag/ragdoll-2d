var keyframes = []

const getKeyframePositions = () => {
  let keyframe = {}
  playerBodyParts.forEach((bodyPart) => {
    keyframe[bodyPart.id] = {
      position: bodyPart.position.slice(),
      angle: bodyPart.angle,
    }
  })
  return keyframe
}

// check for keyframes in local storage
const localstoreKeyframes = localStorage.getItem("keyframes")
if (localstoreKeyframes) {
  console.log("found keyframes in local storage")
  keyframes = JSON.parse(localstoreKeyframes)
}

const ghostBodyParts = []
const clearGhostBodyParts = () => {
  ghostBodyParts.forEach((ghostBodyPart) => {
    world.removeBody(ghostBodyPart)
  })
}

const addInBetweenKeyframes = (keyframe1, keyframe2) => {
  let prevKeyframe = keyframe1

  // remove previous ghost body parts
  clearGhostBodyParts()

  // add 10 keyframes in between
  for (let i = 0; i < 10; i++) {
    let keyframe = {}

    // loop through all body parts, and add a new keyframe for each
    playerBodyParts.forEach((bodyPart) => {
      const position = [
        prevKeyframe[bodyPart.id].position[0] +
          ((keyframe2[bodyPart.id].position[0] -
            prevKeyframe[bodyPart.id].position[0]) *
            1) /
            (10 - i),
        prevKeyframe[bodyPart.id].position[1] +
          ((keyframe2[bodyPart.id].position[1] -
            prevKeyframe[bodyPart.id].position[1]) *
            1) /
            (10 - i),
      ]
      const angle =
        prevKeyframe[bodyPart.id].angle +
        ((keyframe2[bodyPart.id].angle - prevKeyframe[bodyPart.id].angle) * 1) /
          (10 - i)
      keyframe[bodyPart.id] = {
        position,
        angle,
      }
      // if position or angle has changed, create a ghost body for every second keyframe
      if (
        keyframe[bodyPart.id].position[0] !==
          prevKeyframe[bodyPart.id].position[0] ||
        keyframe[bodyPart.id].position[1] !==
          prevKeyframe[bodyPart.id].position[1] ||
        keyframe[bodyPart.id].angle !== prevKeyframe[bodyPart.id].angle
      ) {
        if (i % 2 === 0) {
          const ghostBodyPart = new p2.Body({
            position,
            angle,
          })
          ghostBodyPart.addShape(
            new p2.Box({
              width: bodyPart.shapes[0].width,
              height: bodyPart.shapes[0].height,
            })
          )
          ghostBodyPart.ghost = true
          world.addBody(ghostBodyPart)
          ghostBodyParts.push(ghostBodyPart)
        }
      }
    })
    keyframes.push(keyframe)
    prevKeyframe = keyframe
  }
}

const addKeyframe = () => {
  const keyframe = getKeyframePositions()
  if (keyframes.length === 0) {
    keyframes.push(keyframe)
  } else {
    addInBetweenKeyframes(keyframes[keyframes.length - 1], keyframe)
  }
  console.log("keyframe recorded", keyframe)
  localStorage.setItem("keyframes", JSON.stringify(keyframes))
}

const clearKeyframes = () => {
  keyframes = []
  localStorage.removeItem("keyframes")
}
