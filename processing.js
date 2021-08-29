const WIDTH = 20
const HEIGHT = 20
const PADDING_LR = 4
const PADDING_TB = 4

var model;

async function loadModel() {
    const testImage = []
    model = await tf.loadGraphModel("TFJS.bak/model.json");
}

function predictImage() {
    if (model) {
        const image = [preprocessImage()];
        const tensor = tf.tensor(image);
        results = model.predict(tensor);
        results_class = tf.argMax(results, axis = 1);
        const output = results_class.dataSync()[0];
        
        // console.log(tf.memory());
        cleanUpTF([results, tensor, results_class]);
        return output;
    }
}

function preprocessImage() {
    
    console.log('Processing...');
    image = cv.imread(canvas);
    outputCanvas = document.createElement('canvas')
    cv.cvtColor(image, image, cv.COLOR_RGB2GRAY, 0);
    cv.threshold(image, image, 100, 255, cv.THRESH_BINARY);


    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    // You can try more different parameters
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0)
    let rect = cv.boundingRect(cnt);

    image = image.roi(rect);

    // Scale Image

    let width = image.cols;
    let height = image.rows;
    let newSize;
    let fx = WIDTH / width;
    let fy = HEIGHT / height;

    if (width > height)
        newSize = new cv.Size(WIDTH, parseInt(fx * height));
    else
        newSize = new cv.Size(parseInt(fy * width), HEIGHT);


    cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

    // Add Paddings

    width = image.cols;
    height = image.rows;

    const PAD_LEFT = Math.ceil(PADDING_LR + (WIDTH - width) / 2);
    const PAD_RIGHT = WIDTH + PADDING_LR * 2 - width - PAD_LEFT;
    const PAD_TOP = Math.ceil(PADDING_TB + (HEIGHT - height) / 2);
    const PAD_BOT = HEIGHT + PADDING_TB * 2 - height - PAD_TOP;

    let s = new cv.Scalar(0, 0, 0, 255);
    cv.copyMakeBorder(image, image, PAD_TOP, PAD_BOT, PAD_LEFT, PAD_RIGHT, cv.BORDER_CONSTANT, s);

    // Center of Mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);

    let Moments = cv.moments(cnt, false);
    let cx = Moments.m10 / Moments.m00;
    let cy = Moments.m01 / Moments.m00;

    // Shift Image to Center
    dx = Math.ceil(image.cols / 2 - cx);
    dy = Math.ceil(image.rows / 2 - cy);
    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, dx, 0, 1, dy]);
    let dsize = new cv.Size(image.rows, image.cols);
    // You can try more different parameters
    cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // cv.imshow(outputCanvas, image);
    // document.body.appendChild(outputCanvas);

    // Normalize Image Data
    let pixelValues = Float32Array.from(image.data).map(px => px / 255.0);
    // console.log(pixelValues);

    // Clean Up
    cleanUpCV([image, cnt, contours, hierarchy, M]);

    return pixelValues;
}

function cleanUpCV(cv_objects) {
    cv_objects.forEach(obj => { obj.delete()});
}

function  cleanUpTF(tf_objects) {
    tf_objects.forEach(obj => { obj.dispose()});
}
