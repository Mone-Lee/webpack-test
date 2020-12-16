import React from 'react';
import ReactDOM from 'react-dom';
import largeNumberWebpackBuild from 'large-number-webpack-build';
import './search.less';
import '../../common';
import logo from '../images/icon_star.png';

class Search extends React.Component {
	constructor() {
		super();
		this.state = {
			Text: null
		}
	}

	loadComponentDynamic() {
		// 动态import进来，返回的是一个promise对象
		import('./text.js').then((Text) => {
			this.setState({
				Text: Text.default
			})
		})
	}

	render() {
		const { Text } = this.state;
		const addResult = largeNumberWebpackBuild('9999', '1');
		return (
			<div className="search-text">
				{
					Text && <Text />
				}
				Search Txt<img src={ logo } onClick={() => this.loadComponentDynamic()} />
				<p>{ addResult }</p>
			</div>
		)
	}
}

ReactDOM.render(
	<Search />,
	document.getElementById('root')
)