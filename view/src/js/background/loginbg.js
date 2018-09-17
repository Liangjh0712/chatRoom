import React from 'react';

export default class LoginBG extends React.Component {

    constructor() {
        super();
        this.canvas = React.createRef();
    }

    componentDidMount() {
        let canvas = this.canvas.current;
        canvas.width = document.body.offsetWidth;
        canvas.height = document.body.offsetHeight;
        let ctx = canvas.getContext("2d");
        let image = new Image();
        image.src = './../../../asset/img/login.png';
        image.addEventListener('load', e => {
            // ctx.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, image.width, image.height);
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

        });
    }

    render() {
        return (<canvas ref={this.canvas}></canvas>)
    }
}