import React, {Component} from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';

class CardProperties extends Component {

  renderNoSelection() {
    return <p className="card-text">No selection</p>;
  }

  renderSelection() {
    const card = this.props.selection;

    return <div>
        <div>Color
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={e => this.props.onColorChange(card, "orange")} className="btn-sm orange">O</Button>
            <Button onClick={e => this.props.onColorChange(card, "blue")} className="btn-sm blue">B</Button>
            <Button onClick={e => this.props.onColorChange(card, "yellow")} className="btn-sm yellow">Y</Button>
            <Button onClick={e => this.props.onColorChange(card, "green")} className="btn-sm green">G</Button>
            <Button onClick={e => this.props.onColorChange(card, "pink")} className="btn-sm pink">P</Button>
          </ButtonGroup>
        </ButtonToolbar>
        </div>

        <div>Move to
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={this.handleMoveToFront.bind(this)} color="primary" className="btn-sm">Move to front</Button>
            <Button onClick={this.handleMoveToBack.bind(this)} color="primary" className="btn-sm">Move to back</Button>
          </ButtonGroup>
        </ButtonToolbar>
        </div>

        <p>Duplicate this card</p>
        <Button onClick={this.handleDuplicate.bind(this)} color="primary" className="btn-sm">Duplicate</Button>
        <p>Delete this card</p>
        <Button onClick={this.handleDelete.bind(this)} color="danger" className="btn-sm">Delete</Button>
      </div>;
  }

  render() {
    const {selection} = this.props;
    return <div className="card">
      <div className="card-header">Card properties</div>
      <div className="card-body">
        {selection? this.renderSelection() : this.renderNoSelection()}
      </div>
    </div>;
  }

  handleMoveToFront() {
    const card = this.props.selection;
    if (card) {
      this.props.onMoveToFront(card);
    }
  }

  handleMoveToBack() {
    const card = this.props.selection;
    if (card) {
      this.props.onMoveToBack(card);
    }
  }

  handleDelete() {
    const card = this.props.selection;
    if (card) {
      this.props.onDelete(card);
    }
  }

  handleDuplicate() {
    const card = this.props.selection;
    if (card) {
      this.props.onDuplicate(card);
    }
  }
}

export default CardProperties;
