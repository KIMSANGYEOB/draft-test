import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

export default class TestDraftJsPlus extends Component {
    
    constructor() {
        super();
        this.state = {
          editorState: EditorState.createEmpty(),
        };
    }

    onChange = (editorState) => {
        this.setState({editorState})
    }

    handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

        if(newState){
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    onHeaderOne = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-one'))
    }
    onHeaderTwo = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-two'))
    }
    onHeaderThree = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-three'))
    }
    onHeaderFour = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-four'))
    }
    onHeaderFive = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-five'))
    }

    onBold = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    onUnderlineClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    }

    onToggleCode = () => {
        this.onChange(RichUtils.toggleCode(this.state.editorState));
    }

    onResetStyle = () => {
        this.onChange(RichUtils.tryToRemoveBlockStyle(this.state.editorState));
    }

    render() {
        return (
            <>
                <button onClick={this.onHeaderOne}>h1</button>
                <button onClick={this.onHeaderTwo}>h2</button>
                <button onClick={this.onHeaderThree}>h3</button>
                <button onClick={this.onHeaderFour}>h4</button>
                <button onClick={this.onHeaderFive}>h5</button>
                <button onClick={this.onBold}>B</button>
                <button onClick={this.onUnderlineClick}>Underline</button>
                <button onClick={this.onToggleCode}>{`<>`}</button>
                <button onClick={this.onResetStyle}>{`reset`}</button>
                <Editor  
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    handleKeyCommand={this.handleKeyCommand}
                />
            </>
        );
    }
}
