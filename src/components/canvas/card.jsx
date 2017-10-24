import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Resizable} from 'react-resizable';
import {DraggableCore} from 'react-draggable';
//import PostItToolbar from './PostItToolbar';

class Card extends Component {

  componentDidMount() {
    const selected = false;//this.props.isSelected(this.props.postIt);
    if (selected) {
      const node = ReactDOM.findDOMNode(this.refs.postItInput);
      //node.focus();
      //node.select();
    }
  }

  componentDidUpdate() {
    const selected = false;//this.props.isSelected(this.props.postIt);
    if (selected) {
      const node = ReactDOM.findDOMNode(this.refs.postItInput);
      //node.focus();
      //node.select();
    }
  }

  render() {
    const {x, y} = this.props.card;
    const {title, color, w, h} = this.props.card;

    let textX = x + 20;
    let textY = y + 20;
    let textW = w - 40;
    let textH = h - 40;

    // the post it represented in SVG
    const selected = false;//this.props.isSelected(this.props.postIt);
    const dragHandleHeight = 12;

    const toolBarElem = undefined;
/*    const toolBarElem = selected?
      <PostItToolbar x={x} y={y - 40} selectedColor={color}
        onMoveToFront={this.onMoveToFront}
        onMoveToBack={this.onMoveToBack}
        onDuplicatePostIt={this.onDuplicatePostIt}
        onChangeColor={this.onChangeColor}
        onDelete={this.onDelete}/> :
      undefined;*/

    const titleElem = selected?
      <textarea
          onChange={(e) => this.props.postIt.title = e.target.value}
          style={{width: (w - 8) + "px", height: (h - dragHandleHeight - 8) + "px"}}
          ref="postItInput"
          value={title}>
      </textarea> :
      <p>{title}</p>;

    return <div>
      <DraggableCore handle=".handle"
          onStart={(e, dragInfo) => this.props.onStartDragPostIt(this.props.postIt)}
          onDrag={(e, dragInfo) => this.handleDrag(e, dragInfo)}
          onStop={(e, dragInfo) => this.handleDrop(this.props.onDropPostIt, this.props.postIt, dragInfo)}>

        <div>
          {toolBarElem}

          <Resizable height={h} width={w} minConstraints={[98, 50]} onResize={(event, {size}) => this.handleResize(event, this.props.postIt, size)}>
            <div className={"postit " + color + (selected? " selected" : "")} style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: w - 2, // 1px border on both sides
                  height: h - 2, // 1px border on both sides
                }}
                onClick={(e) => { e.stopPropagation(); this.props.onSelect(this.props.postIt); }}>

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

/*  onMoveToFront = (e) => {
    e.stopPropagation();
    this.props.onMoveToFront(this.props.postIt);
  };

  onMoveToBack = (e) => {
    e.stopPropagation();
    this.props.onMoveToBack(this.props.postIt);
  };

  onDuplicatePostIt = (e) => {
    e.stopPropagation();
    this.props.onDuplicatePostIt(this.props.postIt);
  };

  onChangeColor = (e, color) => {
    e.stopPropagation();
    this.props.postIt.color = color;
  };

  onClick(e) {
    e.stopPropagation();
    this.props.onSelect(this.props.postIt);
  }

  onDelete = (e) => {
    e.stopPropagation();
    const postIt = this.props.postIt;
    this.props.onDeletePostIt(postIt);
  };

  handleDrag(e, dragInfo) {
    e.preventDefault();
    const postIt = this.props.postIt;
    this.props.onDragPostIt(postIt, dragInfo.deltaX, dragInfo.deltaY);
  }

  handleResize = (e, postIt, size) => {
    event.preventDefault();
    this.props.onResizePostIt(postIt, size.width, size.height);
  };

  handleDrop = (postIt, dragInfo) => {
    setTimeout(() => this.props.onDropPostIt(postIt, dragInfo.x, dragInfo.y, dragInfo.deltaX, dragInfo.deltaY), 1);
  }*/

}

export default Card;
