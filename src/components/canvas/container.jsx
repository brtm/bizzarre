import React, {Component} from 'react';
import Card from './card';

const borderWidth = 2;

class Container extends Component {

  render() {
    const block = this.props.block;
    const titleClass = block.title.replace(/ /g,'').toLowerCase();
    const cards = block.cards || [];

    return <div className={"block " + titleClass} style={{
          position: 'absolute',
          left: block.x,
          top: block.y,
          width: block.w + borderWidth,
          height: block.h + borderWidth,
          border: borderWidth + 'px solid grey',
          boxSizing: 'border-box'
        }}>

        <div style={{ width: "100%" }}>
          <div style={{float: "right"}}>
          </div>
          <h1 style={{float: "left", width: "60%"}}>{block.title}</h1>

          <div className="cards">
          {cards.map(card =>
            <Card key={card.id} 
                card={card}
                onDropCard={this.props.onDropCard}
                onResizeCard={this.props.onResizeCard}/>
          )}
          </div>

        </div>

      </div>;
  }

}

export default Container;
