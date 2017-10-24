import uuid from './lib/uuid'

export function toAbsolute(point, block) {
  return {
    x: block.x + point.x,
    y: block.y + point.y
  };
}

export function isPointInBlock(point, block) {
    const px = point.x;
    const py = point.y;
    const bx = block.x;
    const by = block.y;
    const { w, h } = block;

    return bx <= px && px <= bx + w &&
        by <= py && py <= by + h;
}

export function findBlockForXY(model, point) {
    for (let i = 0; i < model.blocks.length; i++) {
        const block = model.blocks[i];
        if (isPointInBlock(point, block)) {
            return block;
        }
    }
    return model;
}

export function findBlockFor(model, card) {
  const blocks = model.blocks;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    for (let j = 0; j < block.cards.length; j++) {
      const p = block.cards[j];
      if (p === card) {
        return block;
      }
    }
  }
  return model;
}


export function relativeCenterPoint(card) {
  return {
    x: card.x + (card.w / 2),
    y: card.y + (card.h / 2)
  };
}

export function findBlockForCardXY(model, card) {
  const containingBlock = findBlockFor(model, card);
  const point = toAbsolute(relativeCenterPoint(card), containingBlock);

  for (let i = 0; i < model.blocks.length; i++) {
    const block = model.blocks[i];
    if (isPointInBlock(point, block)) {
      return block;
    }
  }
  return model;
}

export function findCardInContainer(container, id) {
    for (let i = 0; i < container.cards.length; i++) {
        const card = container.cards[i];
        if (card.id === id) {
            return card;
        }
    }
    return null;
}

export function findCard(model, id) {
    for (let i = 0; i < model.blocks.length; i++) {
        const card = findCardInContainer(model.blocks[i], id);
        if (card !== null) {
            return card;
        }
    }
    return findCardInContainer(model, id);
}

// mutations of the model

export function addCard(doc, point) {
    const container = findBlockForXY(doc, point);
    const mx = container.x || 0;
    const my = container.y || 0;
    console.log(point.x + ", " + point.y);
    if (!Array.isArray(container.cards)) {
        container.cards = [];
    }

    container.cards.push({
        "id": uuid(),
        "title": "Click to edit",
        "x": point.x - mx,
        "y": point.y - my,
        "w": 150,
        "h": 60,
        "color": "yellow"
    });
}

export function dropCard(doc, cardId, point) {
    const card = findCard(doc, cardId);
    const currentBlock = findBlockFor(doc, card);
    const centerPoint = {
        x: point.x + (card.w / 2),
        y: point.y + (card.h / 2)};

    const targetBlock = findBlockForXY(doc, centerPoint);

    card.x += point.x;
    card.y += point.y;


    // if (currentBlock !== targetBlock) {
    //     for (let i = 0; i < currentBlock.cards.length; i++) {
    //         if (currentBlock.cards[i] === card) {
    //             currentBlock.cards.splice(i, 1);
    //             targetBlock.cards.push(card);
    //         }
    //     }
    // }

    //card.x += point.x;
    //card.y += point.y;
/*
    // ajust coordinates to relatives
    if (targetBlock === doc) {
        card.x += currentBlock.x;
        card.y += currentBlock.y;
    } else {
        card.x -= targetBlock.x - currentBlock.x;// - targetBlock.x;
        card.y -= targetBlock.y - currentBlock.y;// - targetBlock.y;
    }*/
    
/*  store.dragging = null;

  // find the current block
  const model = store.model;
  const currentBlock = findBlockFor(model, postIt);
  const targetBlock = findBlockForPostItXY(model, postIt);

  if (currentBlock !== targetBlock) {
    for (let i = 0; i < currentBlock.postIts.length; i++) {
      if (currentBlock.postIts[i] === postIt) {
        currentBlock.postIts.splice(i, 1);
        targetBlock.postIts.push(postIt);
      }
    }

    // ajust coordinates to relatives
    if (targetBlock === model) {
      postIt.x += currentBlock.x;
      postIt.y += currentBlock.y;
    } else {
      postIt.x -= targetBlock.x - currentBlock.x;// - targetBlock.x;
      postIt.y -= targetBlock.y - currentBlock.y;// - targetBlock.y;
    }
  }*/
}

export function resizeCard(doc, cardId, width, height) {
    const card = findCard(doc, cardId);
    card.w = width;
    card.h = height;
}
