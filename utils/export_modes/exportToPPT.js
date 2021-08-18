import pptxgen from "pptxgenjs";

const AUTHOR = 'KartikeyGEP';
const COMPANY = 'GEP';
let format = 0;
const wd = process.cwd();
console.log(wd);
const basePathLogo = wd + "\\utils\\images";
// C:\\Users\\Kartikey_Nigam\\Desktop\\Highcharts Export Server V1\\V1.1\\utils\\images\\
export const exportToPPT = (imgArrayBase64)=>{
    return new Promise((resolve, reject)=>{
        let pres = new pptxgen();
        pres.author = AUTHOR;
        pres.company = COMPANY;
        pres.layout = 'LAYOUT_WIDE';
        if(format === 0){
            pres.defineSlideMaster({
                title: "MASTER_SLIDE",
                
                background: {  },
                objects: [
                    // { image: { x: 0, y: 0, w: "100%" , h: "100%", path: "C:\\Users\\Kartikey_Nigam\\Desktop\\Highcharts Export Server V1\\V2 VC based export Server\\utils\\export_modes\\layout-1.jpeg" } },
                    // { rect: { x: 0.0, y: 5, w: "100%", h: 1, fill: { color: "F1F1F1" } } },
                    // { text: { text: "Logistics Report", options: { x: 1, y: 5, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 40 } } },
                    // { image: { x: 11, y: 5, w: 2.3, h: 1, path: "C:\\Users\\Kartikey_Nigam\\Desktop\\Highcharts Export Server V1\\V2 VC based export Server\\utils\\export_modes\\gep-logo.png" } },
                    { image: { x: 11.2, y: 6.7, w: 1.67, h: 0.75, path: basePathLogo + "/gep-logo.png" } },
                ],
                // slideNumber: { x: 0.3, y: "90%" },
                
                
            });
            pres.defineSlideMaster({
                title: "CHILD_SLIDE",
                
                background: {  },
                objects: [
                    // { image: { x: 0, y: 0, w: "100%" , h: "100%", path: "C:\\Users\\Kartikey_Nigam\\Desktop\\Highcharts Export Server V1\\V2 VC based export Server\\utils\\export_modes\\layout-1.jpeg" } },
                    // { rect: { x: 0.0, y: 5, w: "100%", h: 1, fill: { color: "F1F1F1" } } },
                    // { text: { text: "Logistics Report", options: { x: 1, y: 5, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 40 } } },
                    // { image: { x: 0, y: 6.7, w: "100%", h: 0.8, path: "C:\\Users\\Kartikey_Nigam\\Desktop\\Highcharts Export Server V1\\V2 VC based export Server\\utils\\export_modes\\layout-1 Child.png" } },
                    { image: { x: 11.2, y: 6.7, w: 1.67, h: 0.75, path: basePathLogo + "/gep-logo.png" } },
                ],
                slideNumber: { x: 0.3, y: "90%" }
                
            });
        }
        else if(format === 1){
            let basePath = "C:\\Users\\Kartikey_Nigam\\Desktop\\Highcharts Export Server V1\\V1.1\\utils\\images\\Layout-1";
            pres.defineSlideMaster({
                title: "MASTER_SLIDE",
                
                background: {  },
                objects: [
                    { image: { x: 0, y: 0, w: "100%" , h: "100%", path: basePath + "\\layout-1.jpeg" } },
                    { rect: { x: 0.0, y: 5, w: "100%", h: 1, fill: { color: "F1F1F1" } } },
                    { text: { text: "Logistics Report", options: { x: 1, y: 5, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 40 } } },
                    { image: { x: 11, y: 5, w: 2.3, h: 1, path: basePathLogo + "\\gep-logo.png" } },
                ],
                // slideNumber: { x: 0.3, y: "90%" },
                
            });
            pres.defineSlideMaster({
                title: "CHILD_SLIDE",
                
                background: {  },
                objects: [
                    // { image: { x: 0, y: 0, w: "100%" , h: "100%", path: "C:\\Users\\Kartikey_Nigam\\Desktop\\Highcharts Export Server V1\\V2 VC based export Server\\utils\\export_modes\\layout-1.jpeg" } },
                    // { rect: { x: 0.0, y: 5, w: "100%", h: 1, fill: { color: "F1F1F1" } } },
                    // { text: { text: "Logistics Report", options: { x: 1, y: 5, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 40 } } },
                    { image: { x: 0, y: 6.7, w: "100%", h: 0.8, path: basePath + "\\layout-1 Child.png" } },
                ],
                slideNumber: { x: 0.3, y: "95%" }
                
            });
            pres.defineSlideMaster({
                title: "MASTER_END_SLIDE",
                
                background: {  },
                objects: [
                    { image: { x: 0, y: 0, w: "100%" , h: "100%", path: basePath + "\\layout-1.jpeg" } },
                    { rect: { x: 0.0, y: 5, w: "100%", h: 1, fill: { color: "F1F1F1" } } },
                    { text: { text: "Thank You!!", options: { x: 1, y: 5, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 40 } } },
                    { image: { x: 11, y: 5, w: 2.3, h: 1, path: basePathLogo + "\\gep-logo.png" } },
                ],
                // slideNumber: { x: 0.3, y: "90%" },
                
            });
        }
        else if(format === 2){
            let basePath = "C:\\Users\\Kartikey_Nigam\\Desktop\\Highcharts Export Server V1\\V1.1\\utils\\images\\Layout-2";
            pres.defineSlideMaster({
                title: "MASTER_SLIDE",
                
                background: {  },
                objects: [
                    { image: { x: 0, y: 0, w: "100%" , h: "100%", path: basePath + "\\layout-2 Master.png" } },
                    { rect: { x: 7.8, y: 1.25, w: "41.5%", h: 1, fill: { color: "#000000" } } },
                    { rect: { x: 7.6, y: 1, w: "43%", h: 1, fill: { color: "595959" } } },
                    
                    { text: { text: "Teams Report", options: { x: 7.7, y: 1, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 50, color: "FFFFFF" } } },
                    { image: { x: 11, y: 6.5, w: 2.3, h: 1, path: basePathLogo + "\\gep-logo.png" } },
                ],
                // slideNumber: { x: 0.3, y: "90%" },
                
            });
            pres.defineSlideMaster({
                title: "CHILD_SLIDE",
                
                background: {  },
                objects: [
                    { image: { x: 0, y: 0, w: "100%" , h: "100%", path: basePath + "\\layout-2 Child.png" } },
                    // { rect: { x: 0.0, y: 5, w: "100%", h: 1, fill: { color: "F1F1F1" } } },
                    // { text: { text: "Logistics Report", options: { x: 1, y: 5, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 40 } } },
                    { image: { x: 11.2, y: 6.7, w: 1.67, h: 0.75, path: basePathLogo + "\\gep-logo.png" } },
                ],
                slideNumber: { x: 0.3, y: "95%" }
                
            });
            pres.defineSlideMaster({
                title: "CHILD_SLIDE_2",
                
                background: {  },
                objects: [
                    { image: { x: 0, y: 0, w: "100%" , h: "100%", path: basePath + "\\layout-2 Child2.png" } },
                    // { rect: { x: 0.0, y: 5, w: "100%", h: 1, fill: { color: "F1F1F1" } } },
                    // { text: { text: "Logistics Report", options: { x: 1, y: 5, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 40 } } },
                    { image: { x: 11.2, y: 6.7, w: 1.67, h: 0.75, path: basePathLogo + "\\gep-logo.png" } },
                ],
                slideNumber: { x: 0.3, y: "95%" }
                
            });
            pres.defineSlideMaster({
                title: "MASTER_END_SLIDE",
                
                background: {  },
                objects: [
                    { image: { x: 0, y: 0, w: "100%" , h: "100%", path: basePath + "\\layout-2 Master.png" } },
                    { rect: { x: 0.0, y: 5, w: "100%", h: 1, fill: { color: "595959" } } },
                    { text: { text: "Thank You!!", options: { x: 1, y: 5, w: 10, h: 1, fontFace:'Times New Roman', fontSize: 40, color: "FFFFFF" } } },
                    { image: { x: 11, y: 1, w: 2.3, h: 1, path: basePathLogo + "\\gep-logo.png" } },
                ],
                // slideNumber: { x: 0.3, y: "90%" },
                
            });
        }
        
        let dataFormat = "img/png;base64,";
        let openSld = pres.addSlide({ masterName: "MASTER_SLIDE" });
 
        for(let i = 0; i < imgArrayBase64.length; i++){
            let slide;
            if(format === 2){
                if(i%2){
                    slide = pres.addSlide({ masterName: "CHILD_SLIDE" }); 
                }else{
                    slide = pres.addSlide({ masterName: "CHILD_SLIDE" })              
                }
            }
            else{
                slide = pres.addSlide({ masterName: "CHILD_SLIDE" }); 
                slide.addText(`Chart ${i+1}`, { x: 0.5, y: 0.7, fontSize: 30, fontFace:'Times New Roman', color: "C35A11" });
            }
            
            
            slide.addImage({  
                x: "20%", 
                y: "20%", 
                w: "60%", 
                h: "60%", 
                data: dataFormat + imgArrayBase64[i] 
            });
        }

        let closeSld = pres.addSlide({ masterName: "MASTER_END_SLIDE" });

        let pptName = "./PPTs/" + process.pid + "_child_ppt";
        pres.writeFile({ fileName: pptName }).then(()=>{
            resolve();
        }).catch(err=>{
            console.log(err)
            reject(err);
        });

    })
    
}
