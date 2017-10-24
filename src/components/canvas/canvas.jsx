import * as React from 'react';
import Container from './container';
import Card from './card';

export default class Canvas extends React.Component {
  render() {
    //const {addBox} = this.props;
    const {model} = this.props;
    const blocks = model.blocks || [];
    const cards = model.cards || [];

    return (
        <div onDoubleClick={e => this.props.onAddCard(e.pageX, e.pageY)}>
            {/*this.showGrid()*/}

            {blocks.map((block) =>
                <Container key={block.id} 
                    block={block}
                    onDropCard={this.props.onDropCard}
                    onResizeCard={this.props.onResizeCard}/>
            )}

            <div className="cards">
                {cards.map(card =>
                    <Card key={card.id} 
                        card={card}
                        onDropCard={this.props.onDropCard}
                        onResizeCard={this.props.onResizeCard}/>
                )}
            </div>

        </div>
    );
  }

  showGrid() {
    return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="lightgray" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <rect width="80" height="80" fill="url(#smallGrid)"/>
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="lightgray" strokeWidth="1"/>
                </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

        </svg>);

  }
}
