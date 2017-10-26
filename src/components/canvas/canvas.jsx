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
        <div className="canvas" 
            onClick={e => this.props.onSelect(null)}
            onDoubleClick={e => this.props.onAddCard(e.pageX, e.pageY)}>
            
            {blocks.map((block) =>
                <Container key={block.id} 
                    block={block}
                    onDropCard={this.props.onDropCard}
                    onResizeCard={this.props.onResizeCard}
                    onSelect={this.props.onSelect}
                    isSelected={this.props.isSelected}
                    onChangeCardName={this.props.onChangeCardName}/>
            )}

            <div className="cards">
                {cards.map(card =>
                    <Card key={card.id} 
                        card={card}
                        onDropCard={this.props.onDropCard}
                        onResizeCard={this.props.onResizeCard}
                        onSelect={this.props.onSelect}
                        isSelected={this.props.isSelected}
                        onChangeCardName={this.props.onChangeCardName}/>
                )}
            </div>

        </div>
    );
  }

}
