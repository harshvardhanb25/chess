const sceneHeight=1000;
const sceneWidth=1000;
const letters=['A','B','C','D','E','F','G','H'];
let stage;

function draw(){

    stage = new Konva.Stage({
        container: 'board',
        height: sceneHeight,
        width: sceneWidth,

    });


    let layer = new Konva.Layer({
        id: 'board-in'
    });
    stage.add(layer);


    for (let i=0; i<8; i++) {
        for (let j = 0; j < 8; j++) {
            let fill='grey';
            if ((i+j)%2===0){
                fill = 'white';
            }
            let rect = new Konva.Rect({
                fill: fill,
                x: sceneWidth / 8 * i,
                y: sceneHeight/8 * j,
                width: sceneWidth/8,
                height: sceneHeight/8,
                id: letters[i]+ (8-j).toString(),
            });
            layer.add(rect);
        }
    }
    layer.draw();

    fitStageIntoParentContainer();
}

function fitStageIntoParentContainer() {
    var container = document.querySelector('#board');

    // now we need to fit stage into parent container
    var containerWidth = container.offsetWidth;


    // but we also make the full scene visible
    // so we need to scale all objects on canvas
    var scale = containerWidth / sceneWidth;

    stage.width(sceneWidth * scale);
    stage.height(sceneHeight * scale);
    stage.scale({ x: scale, y: scale });
}

