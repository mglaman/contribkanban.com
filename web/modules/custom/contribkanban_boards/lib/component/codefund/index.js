import React, { PureComponent } from 'react';

class CodeFund extends PureComponent {
    defaultProps = {
        template: 'horizontal',
        theme: `light`,
    }
    componentDidMount() {
        const script = document.createElement("script");
        script.setAttribute("src", `https://codefund.app/properties/86/funder.js?template=${this.props.template}&theme=${this.props.theme}`);
        script.async = "true";
        script.setAttribute("id", "external-js");
        document.head.appendChild(script);
    }
    render() {
        return <div id="codefund"/>
    }
}
export default CodeFund;
