import uuid from './lib/uuid'

export function toAbsolute(point, block) {
  return {
    x: (block.x || 0) + point.x,
    y: (block.y || 0) + point.y
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
      if (p.id === card.id) {
        return block;
      }
    }
  }
  return model;
}


export function relativeCenterPoint(point, card) {
  return {
    x: point.x + card.x + (card.w / 2),
    y: point.y + card.y + (card.h / 2)
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
    const centerPoint = toAbsolute(relativeCenterPoint(point, card), currentBlock);
    const targetBlock = findBlockForXY(doc, centerPoint);

    if (currentBlock.id !== targetBlock.id) {
         const i = currentBlock.cards.findIndex(c => c.id === cardId);
         currentBlock.cards.splice(i, 1);
         targetBlock.cards.push(card);
         card.x += point.x;
         card.y += point.y;

         // adjust to relatives of new parent
         if (targetBlock === doc) {
            card.x += currentBlock.x;
            card.y += currentBlock.y;
         }
         else {
            card.x -= targetBlock.x - (currentBlock.x || 0);
            card.y -= targetBlock.y - (currentBlock.y || 0);
        }
    }
    else {
        card.x += point.x;
        card.y += point.y;
    }
}

export function resizeCard(doc, cardId, width, height) {
    const card = findCard(doc, cardId);
    card.w = width;
    card.h = height;
}

export function renameCard(doc, cardId, name) {
    const card = findCard(doc, cardId);
    card.title = name;
}

export function changeCardColor(doc, cardId, color) {
    const card = findCard(doc, cardId);
    card.color = color;
}

export function moveToFront(doc, cardId) {
    const card = findCard(doc, cardId);
    const block = findBlockFor(doc, card);
    const i = block.cards.findIndex(c => c.id === cardId);
    if (i >= 0) {
        block.cards.splice(i, 1);
        block.cards.push(card);
    }
}

export function moveToBack(doc, cardId) {
    const card = findCard(doc, cardId);
    const block = findBlockFor(doc, card);
    const i = block.cards.findIndex(c => c.id === cardId);
    if (i >= 0) {
        block.cards.splice(i, 1);
        block.cards.unshift(card);
    }
}

export function deleteCard(doc, cardId) {
    const card = findCard(doc, cardId);
    const block = findBlockFor(doc, card);
    const i = block.cards.findIndex(c => c.id === cardId);
    if (i >= 0) {
        delete block.cards[i];
    }
}

export function duplicateCard(doc, cardId) {
    const card = findCard(doc, cardId);
    const block = findBlockFor(doc, card);
    block.cards.push({
        "id": uuid(),
        "title": card.title,
        "x": card.x + 20,
        "y": card.y + 20,
        "w": card.w,
        "h": card.h,
        "color": card.color
    });

}