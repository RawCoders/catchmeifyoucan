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
        steps: 50,
      },
      {
        action: "moveRight",
        steps: 200,
      },
    ],
    onBoundaryCollision: () => {},
  },
  Jitter: {
    movements: [
      {
        action: "moveRight",
        steps: 10,
      },
      {
        action: "stop",
        steps: 50,
      },
      {
        action: "moveRight",
        steps: 100,
      },
      ...getTurnMovement(),
    ],
    onBoundaryCollision: () => {},
  },
};

function getTurnMovement() {
  return [
    {
      animation: "player-face-right",
      steps: 5,
    },
    {
      animation: "player-face-up",
      steps: 5,
    },
    {
      animation: "player-face-left",
      steps: 5,
    },
    {
      animation: "player-face-down",
      steps: 5,
    },
    {
      animation: "player-face-right",
      steps: 5,
    },
  ];
}
