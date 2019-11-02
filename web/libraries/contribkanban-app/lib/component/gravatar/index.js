import React, { Component } from 'react';
import querystring from 'query-string'
import PropTypes from 'prop-types'

class Gravatar extends Component {
  static propTypes = {
    name: PropTypes.string,
    md5: PropTypes.string,
    size: PropTypes.number,
    rating: PropTypes.string,
    default: PropTypes.string,
  };
  static defaultProps = {
    size: 128,
    rating: 'g',
    default: 'identicon',
  };

  render() {
    const base = `https://www.gravatar.com/avatar/`;
    const query = querystring.stringify({
      s: this.props.size,
      r: this.props.rating,
      d: this.props.default,
    });
    const retinaQuery = querystring.stringify({
      s: this.props.size * 2,
      r: this.props.rating,
      d: this.props.default,
    });
    const src = `${base}${this.props.md5}?${query}`;
    const retinaSrc = `${base}${this.props.md5}?${retinaQuery}`;

    return (
      <figure className="image is-128x128">
        <img
          alt={`Gravatar for ${this.props.name}`}
          style={this.props.style}
          src={src}
          srcSet={`${retinaSrc} 2x`}
          height={this.props.size}
          width={this.props.size}
          className="user-profile-gravatar"
        />
      </figure>
    )
  }
}

export default Gravatar;
