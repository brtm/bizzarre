import uuid from './lib/uuid'

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
