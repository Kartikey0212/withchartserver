import exporter from "highcharts-export-server";

export const exportToImg = (exportSettings)=>{
    return new Promise((resolve, reject)=>{
    
        exporter.export(exportSettings, function (err, res) {
            //If the output is not PDF or SVG, it will be base64 encoded (res.data).
            //If the output is a PDF or SVG, it will contain a filename (res.filename).
            
            if(res.data){
                resolve(res.data);
            }
            else{
                reject(err);
            }
            
        });
    })
}
