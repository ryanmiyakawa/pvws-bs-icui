/** Returns an SVG object as prescribed by shape array and params */
const LayoutSVG = ({ shapes, svgSize, viewPort, posX = 0, posY = 0 }) => {


    /**
     * Viewbox first 2 numbers represent the top left corner of the viewbox
     * The last 2 numbers represent the width and height of the viewbox
     */
    const viewBoxDim = `${viewPort.offsetX} ${viewPort.offsetY} ${viewPort.width} ${viewPort.height}`;

    return (
        <svg width={svgSize.width} height={svgSize.height} viewBox = {viewBoxDim}>
            {shapes.map((shape, index) => {
                const x = shape.x + posX;
                const y = shape.y - posY; // so that up goes up

                switch (shape.type) {
                    case 'rect':
                        return <rect 
                            key={index} 
                            x = {x} 
                            y = {y} 
                            width = {shape.width}
                            height = {shape.height}
                            style = {shape.style}
                        />
                    case 'text':
                        const text = shape.text;
                        return <text 
                            key={index} 
                            x = {x}
                            y = {y}
                            fontFamily = {shape.fontFamily}
                            fontSize = {shape.fontSize}
                            fill = {shape.fill}
                        >
                            {text}
                        </text>
                }
            })}
        </svg>
    )

}


export default LayoutSVG;