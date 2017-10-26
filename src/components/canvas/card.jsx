import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Resizable} from 'react-resizable';
import Draggable, {DraggableCore} from 'react-draggable';

class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      deltaX: 0,
      deltaY: 0
    };
  }

  componentDidMount() {
    const selected = this.props.isSelected(this.props.card);
    if (selected) {
      const node = ReactDOM.findDOMNode(this.refs.postItInput);
      //node.focus();
      //node.select();
    }
  }

  componentDidUpdate() {
    const selected = this.props.isSelected(this.props.card);
    if (selected) {
      const node = ReactDOM.findDOMNode(this.refs.postItInput);
      //node.focus();
      //node.select();
    }
  }

  render() {
    const {card} = this.props;
    const {x, y} = card;
    const deltaX = this.state.deltaX || 0;
    const deltaY = this.state.deltaY || 0;
    const {title, color} = card;
    const w = this.state.rw || card.w;
    const h = this.state.rh || card.h;

    let textX = x + 20;
    let textY = y + 20;
    let textW = w - 40;
    let textH = h - 40;

    // the post it represented in SVG
    const selected = this.props.isSelected(card);
    const dragHandleHeight = 12;

    const text = this.state.newName || title;
    const titleElem = selected?
      <textarea
          onChange={this.handleNameChange.bind(this)}
          onBlur={this.handleNameUpdate.bind(this)}
          style={{width: (w - 8) + "px", height: (h - dragHandleHeight - 8) + "px"}}
          ref="postItInput"
          value={text}>
      </textarea> :
      <p>{title}</p>;

    return <div>
      <DraggableCore handle=".handle"
          onStart={this.handleDragStart.bind(this)}
          onDrag={this.handleDragMove.bind(this)}
          onStop={this.handleDrop.bind(this)}>

        <div>
          <Resizable height={h} width={w} minConstraints={[98, 50]} 
              onResizeStart={this.handleResizeStart.bind(this)}
              onResize={this.handleResize.bind(this)}
              onResizeStop={this.handleResizeStop.bind(this)}>

            <div className={"postit " + color + (selected? " selected" : "")} style={{
                  position: 'absolute',
                  left: x + deltaX,
                  top: y + deltaY,
                  width: w - 2, // 1px border on both sides
                  height: h - 2, // 1px border on both sides
                }}
                onClick={this.handleSelect.bind(this)}>

              <div className="postit-color-layer">
                <svg width={w - 2} height={h - 2} viewBox={"0 0 " + (w - 2) + " " + (h - 2)} xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="0" width={w - 2} height={h - 2}/>
                </svg>
              </div>

              <div className="handle">
                <svg width={w - 2} height="12" viewBox={"0 0 " + (w - 2) + " 12"} xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="0" width={w - 2} height="12"/>
                </svg>
              </div>

              {titleElem}

            </div>
          </Resizable>
        </div>
      </DraggableCore>
    </div>;
  }

  handleSelect(e) {
    e.stopPropagation(); 
    this.props.onSelect(this.props.card);
  }

  handleNameChange(e) {
    const text = e.target.value;
    this.setState({newName: text});
  }

  handleNameUpdate(e) {
    const text = e.target.value;
    const {card} = this.props;
    if (card.title !== text) {
      this.props.onChangeCardName(card, text);
      this.setState({newName: null});
    } 
  }

  handleDragStart(e, dragInfo) {
    this.setState({deltaX: 0, deltaY: 0});
  }

  handleDragMove(e, dragInfo) {
    e.preventDefault();
    const deltaX = (this.state.deltaX || 0) + dragInfo.deltaX;
    const deltaY = (this.state.deltaY || 0) + dragInfo.deltaY;
    this.setState({deltaX: deltaX, deltaY: deltaY});
  }

  handleDrop(e, dragInfo) {
    const card = this.props.card;
    const deltaX = (this.state.deltaX || 0);
    const deltaY = (this.state.deltaY || 0);
    setTimeout(() => {
      this.setState({deltaX: 0, deltaY: 0});
      this.props.onDropCard(card, deltaX, deltaY)
    }, 0);
  }

  handleResizeStart(e, data) {
    this.setState({rw: undefined, rh: undefined});
  }

  handleResize(e, data) {
    const {width, height} = data.size;
    this.setState({rw: width, rh: height});
  }

  handleResizeStop(e, data) {
    const card = this.props.card;
    const {width, height} = data.size;
    this.props.onResizeCard(card, width, height);
    this.setState({rw: undefined, rh: undefined});
  }
}

export default Card;
