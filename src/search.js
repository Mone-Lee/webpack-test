import React from 'react';
import ReactDOM from 'react-dom';
import './search.less';
import logo from './images/icon_star.png';

class Search extends React.Component {
    render() {
        return <div className="search-text">
            Search Txt<img src={ logo } />
        </div>
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
)