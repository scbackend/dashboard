import React from 'react';
import globalState from '../../globalState';
import './dialog.css';

class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false,
            title: props.title || '',
            message: props.children || '',
            onConfirm: props.onConfirm || null,
            onCancel: props.onCancel || null,
            onClose: props.onClose || null
        };
    }

    handleConfirm = () => {
        if (this.state.onConfirm) this.state.onConfirm();
        this.setState({ visible: false });
        if (this.state.onClose) this.state.onClose();
    }

    handleCancel = () => {
        if (this.state.onCancel) this.state.onCancel();
        this.setState({ visible: false });
        if (this.state.onClose) this.state.onClose();
    }

    render() {
        if (!this.state.visible) return null;
        return (
            <div className="DialogOverlay">
                <div className="DialogBox">
                    <h2 className="DialogTitle">{this.state.title}</h2>
                    <div className="DialogMessage">{this.state.message}</div>
                    <div className="DialogActions">
                        <button className="DialogBtn" onClick={this.handleCancel}>{globalState.formatMessage('dialog.cancel')}</button>
                        <button className="DialogBtn" onClick={this.handleConfirm}>{globalState.formatMessage('dialog.confirm')}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dialog;