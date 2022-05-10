# react-ranking-animation

> React component for adding a leaderboard/ranking table with animation effects

[![NPM](https://img.shields.io/npm/v/react-ranking-animation.svg)](https://www.npmjs.com/package/react-ranking-animation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-ranking-animation
```

## Usage

```jsx
import React, { Component } from 'react'

import Leaderboard from 'react-ranking-animation'
import 'react-ranking-animation/dist/index.css'

class Example extends Component {
  constructor(props) {
    super(props);
    this.contestants = [
      {name: "John", score: 100},
      {name: "Susie", score: 100},
      {name: "Adam", score: 100},
    ];
  }

  render() {
    return <Leaderboard contestants={this.contestants} />
  }
}
```

## License

MIT © [DennisTsiang](https://github.com/DennisTsiang)
