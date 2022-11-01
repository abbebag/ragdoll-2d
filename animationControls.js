const startDrag = (renderer, b) => {
  if (
    playerBodyParts.some(function (body) {
      return body.id === b.id
    })
  ) {
    window.lockConstraints = []
    if (b.type === p2.Body.KINEMATIC) {
      b.type = p2.Body.DYNAMIC
      b.resetToKinematic = true
    }
    if (b.id === 8) {
      renderer.mouseConstraint.setLimits(0, 0)
      playerConstraints.forEach(function (constraint) {
        renderer.world.removeConstraint(constraint)
        const lockConstraint = new p2.LockConstraint(
          constraint.bodyA,
          constraint.bodyB
        )
        renderer.world.addConstraint(lockConstraint)
        window.lockConstraints.push(lockConstraint)
      })
      playerBodyParts.forEach(function (body) {
        body.type = p2.Body.DYNAMIC
      })
    }
    if (b.id === 9) {
      const bodyB = playerBodyParts.find((body) => body.id === 11)
      const constraint = new p2.LockConstraint(b, bodyB)
      renderer.world.addConstraint(constraint)
      window.lockConstraints.push(constraint)
      bodyB.type = p2.Body.DYNAMIC
    }
    if (b.id === 11) {
      playerBodyParts.find((body) => body.id === 9).type = p2.Body.DYNAMIC
    }
    if (b.id === 10) {
      const bodyB = playerBodyParts.find((body) => body.id === 12)
      const constraint = new p2.LockConstraint(b, bodyB)
      renderer.world.addConstraint(constraint)
      window.lockConstraints.push(constraint)
      bodyB.type = p2.Body.DYNAMIC
    }
    if (b.id === 12) {
      playerBodyParts.find((body) => body.id === 10).type = p2.Body.DYNAMIC
    }

    if (b.id === 7) {
      playerBodyParts.find((body) => body.id === 5).type = p2.Body.DYNAMIC
    }
    if (b.id === 6) {
      playerBodyParts.find((body) => body.id === 4).type = p2.Body.DYNAMIC
    }
    if (b.id === 4) {
      const bodyB = playerBodyParts.find((body) => body.id === 6)
      const constraint = new p2.LockConstraint(b, bodyB)
      renderer.world.addConstraint(constraint)
      window.lockConstraints.push(constraint)
      bodyB.type = p2.Body.DYNAMIC
    }
    if (b.id === 5) {
      const bodyB = playerBodyParts.find((body) => body.id === 7)
      const constraint = new p2.LockConstraint(b, bodyB)
      renderer.world.addConstraint(constraint)
      window.lockConstraints.push(constraint)
      bodyB.type = p2.Body.DYNAMIC
    }
  }
}

const stopDrag = (renderer) => {
  const moveBody = renderer.mouseConstraint.bodyB
  if (moveBody.resetToKinematic) {
    window.lockConstraints.forEach(function (constraint) {
      renderer.world.removeConstraint(constraint)
    })
    if (moveBody.id === 8) {
      playerConstraints.forEach(function (constraint) {
        renderer.world.addConstraint(constraint)
      })
    }
    playerBodyParts.forEach(function (body) {
      body.type = p2.Body.KINEMATIC
      body.resetToKinematic = false
      body.setZeroForce()
      body.velocity = [0, 0]
      body.angularVelocity = 0
    })
  }
}
