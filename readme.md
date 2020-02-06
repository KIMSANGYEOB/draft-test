draft-js-plus test
====

가이드

```
<TestDraftJsPlus />
```

```js
// KEY BINDING EXAMPLE
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
```
===