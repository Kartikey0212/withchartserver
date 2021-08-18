import pkg from 'jspdf';
const { jsPDF } = pkg;
import sizeOf from "image-size";
const getImgDim = (img) => {
    img = Buffer.from(img, 'base64');
    let dimensions = sizeOf(img);
    // console.log(dimensions.width, dimensions.height);
    return dimensions;
}
const get4ImgsSamePg = (imgArrayBase64, imgFormat)=>{
    const doc = new pkg('l', 'px', 'a4');
    let pgWd = doc.internal.pageSize.getWidth();
    let pgHt = doc.internal.pageSize.getHeight()
    
    let ratio = 1/16;
    let x = pgWd * ratio;
    let y = pgHt * ratio;
    let imgHt = (pgHt - 4*y)/2;
    let imgWd = (pgWd - 4*x)/2;
    
    // first img 
    let x1 = x;
    let y1 = y;
    // second img 
    let x2 = 3*x+imgWd;
    let y2 = y;
    // third img
    let x3 = x;
    let y3 = 3*y+imgHt;
    // fourth img 
    let x4 = 3*x+imgWd;
    let y4 = 3*y+imgHt;
    let cord = [[x1,y1],[x2,y2],[x3,y3],[x4,y4]];

    let id = 0;
    while(id < imgArrayBase64.length){
        // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
        if(id != 0){
            doc.addPage();
        }
        for(let i = 0; i < cord.length && id < imgArrayBase64.length; i++){
            let dim = getImgDim(imgArrayBase64[id]);
            doc.addImage(imgArrayBase64[id], imgFormat, cord[i][0], cord[i][1], imgWd < dim.width ? imgWd : dim.width, imgHt < dim.height ? imgHt : dim.height);
            id++;
        }    
    }
    doc.save("PDFs/" + process.pid + "_PDF4.pdf");
}
const get2ImgsSamePg = (imgArrayBase64, imgFormat)=>{
    const doc = new pkg('l', 'px', 'a4');
    let pgWd = doc.internal.pageSize.getWidth();
    let pgHt = doc.internal.pageSize.getHeight()
    
    let ratio = 1/16;
    let x = pgWd * ratio;
    let y = 75;
    let imgHt = (pgHt - 2*y)/2;
    let imgWd = (pgWd - 4*x)/2;
    
    // first img 
    let x1 = x;
    let y1 = y;
    // second img 
    let x2 = 3*x+imgWd;
    let y2 = y;

    let cord = [[x1,y1],[x2,y2]];

    let id = 0;
    while(id < imgArrayBase64.length){
        // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
        if(id != 0){
            doc.addPage();
        }
        for(let i = 0; i < cord.length && id < imgArrayBase64.length; i++){
            let dim = getImgDim(imgArrayBase64[id]);
            doc.addImage(imgArrayBase64[id], imgFormat, cord[i][0], cord[i][1], imgWd < dim.width ? imgWd : dim.width, imgHt < dim.height ? imgHt : dim.height);
            id++;
        }    
    }
    doc.save("PDFs/" + process.pid + "_PDF2.pdf");
}
export const exportToPDF = (imgArrayBase64, imgFormat = 'JPEG') => {
    // l=>landscape , a4=>type of Pg, 
    return new Promise((reject, resolve) => {
        const doc = new pkg('l', 'px', 'a4');
        let startPosX = doc.internal.pageSize.getWidth()*1/6;
        let startPosY = doc.internal.pageSize.getHeight()*1/6;
        let width = doc.internal.pageSize.getWidth()*2/3;
        let height = doc.internal.pageSize.getHeight()*2/3;
        for (let i = 0; i < imgArrayBase64.length; i++) {
            // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
            if(i != 0)
                doc.addPage();
            let dim = getImgDim(imgArrayBase64[i]);
            doc.addImage(imgArrayBase64[i], imgFormat, startPosX, startPosY, width < dim.width ? width : dim.width, height < dim.height ? height : dim.height);
            
        }

        doc.save("PDFs/" + process.pid + "_PDF.pdf");
        get4ImgsSamePg(imgArrayBase64, imgFormat);
        get2ImgsSamePg(imgArrayBase64, imgFormat);
    })

}
