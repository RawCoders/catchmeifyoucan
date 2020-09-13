export default {
  random: {
    movements: [
      {
        action: "moveLeft",
        steps: 100,
      },
      {
        action: "moveUp",
        steps: 200,
      },
      {
        action: "moveRight",
        steps: 40,
      },
      {
        action: "moveDown",
        steps: 200,
      },
    ],
    onBoundaryCollision: () => {},
  },
  toAndFro: {
    movements: [
      {
        action: "moveUp",
        steps: 100,
      },
      {
        action: "moveDown",
        steps: 200,
      },
    ],
    onBoundaryCollision: () => {},
  },
  moveAhead: {
    movements: [
      {
        action: "moveRight",
        steps: 100,
      },
      {
        action: "stop",
        steps: 200,
      },
      {
        action: "moveRight",
        steps: 200,
      },
    ],
    onBoundaryCollision: () => {},
  },
};
